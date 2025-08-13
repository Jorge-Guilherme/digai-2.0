from flask import Flask, request, jsonify
import os, requests, uuid
from dotenv import load_dotenv
import chromadb

load_dotenv()

def _env(name: str, default: str | None = None):
    v = os.getenv(name, default)
    if v is None:
        return default
    # Remove aspas acidentais
    if isinstance(v, str):
        v = v.strip().strip('"').strip("'")
    return v

API_KEY           = _env("OPENAI_API_KEY")
CHAT_MODEL        = _env("OPENAI_MODEL", "gpt-4o-mini")
EMBED_MODEL       = _env("OPENAI_EMBED_MODEL", "text-embedding-3-small")
VECTORSTORE_DIR   = _env("VECTORSTORE_DIR", "./service/vectorstore")
CHROMA_COLLECTION = _env("CHROMA_COLLECTION", "default")
TOP_K             = int(_env("TOP_K", "3") or "3")

BASE_CHAT_URL = "https://api.openai.com/v1/chat/completions"
BASE_EMB_URL  = "https://api.openai.com/v1/embeddings"

app = Flask(__name__)

# Inicializa client Chroma persistente
chroma_collection = None
try:
    chroma_client = chromadb.PersistentClient(path=VECTORSTORE_DIR)
    chroma_collection = chroma_client.get_or_create_collection(name=CHROMA_COLLECTION)
    print(f"[Chroma] Coleção '{CHROMA_COLLECTION}' carregada. Registros: {chroma_collection.count()}")
except Exception as e:
    print(f"[Chroma] Falha ao carregar coleção: {e}")

def _headers():
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

def get_embedding(text: str):
    payload = {"model": EMBED_MODEL, "input": text}
    r = requests.post(BASE_EMB_URL, headers=_headers(), json=payload, timeout=45)
    r.raise_for_status()
    return r.json()["data"][0]["embedding"]


def retrieve_context(query: str):
    if not chroma_collection:
        return [], []
    try:
        # Usa somente query por texto para manter compatibilidade com coleção já criada (dimensão 384 do MiniLM interno)
        results = chroma_collection.query(query_texts=[query], n_results=TOP_K)
        docs = results.get("documents", [[]])[0]
        ids  = results.get("ids", [[]])[0]
        return docs, ids
    except Exception as e:
        print(f"[Chroma] Erro consulta: {e}")
        return [], []

@app.route("/api/vectorstore/status", methods=["GET"])
def vectorstore_status():
    loaded = chroma_collection is not None
    count = chroma_collection.count() if loaded else 0
    return jsonify({
        "loaded": loaded,
        "count": count,
        "collection": CHROMA_COLLECTION,
        "dir": VECTORSTORE_DIR
    })

@app.route("/api/vectorstore/ingest", methods=["POST"])
def vectorstore_ingest():
    if not chroma_collection:
        return jsonify({"error": "Vectorstore indisponível"}), 500
    data = request.get_json(silent=True) or {}
    docs = data.get("documents") or data.get("docs")
    metadatas = data.get("metadatas") or data.get("metadata")
    ids = data.get("ids")
    if not docs or not isinstance(docs, list):
        return jsonify({"error": "Campo 'documents' (lista) é obrigatório"}), 400
    # Normalização e geração de ids
    cleaned_docs = []
    final_ids = []
    for i, d in enumerate(docs):
        if not isinstance(d, str):
            continue
        text = d.strip()
        if not text:
            continue
        if len(text) > 8000:
            text = text[:8000]
        cleaned_docs.append(text)
        _id = (ids[i] if ids and i < len(ids) else str(uuid.uuid4()))
        final_ids.append(_id)
    if not cleaned_docs:
        return jsonify({"error": "Nenhum documento válido"}), 400
    md_list = None
    if metadatas and isinstance(metadatas, list):
        # Garantir alinhamento de tamanho
        md_list = []
        for i in range(len(cleaned_docs)):
            md_list.append(metadatas[i] if i < len(metadatas) and isinstance(metadatas[i], dict) else {})
    try:
        # Não passamos embeddings externos para evitar conflito de dimensionalidade com a coleção existente
        chroma_collection.add(documents=cleaned_docs, ids=final_ids, metadatas=md_list)
        return jsonify({
            "ingested": len(cleaned_docs),
            "total_after": chroma_collection.count(),
            "ids": final_ids
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/vectorstore/docs", methods=["GET"])
def vectorstore_docs():
    if not chroma_collection:
        return jsonify({"error": "Vectorstore indisponível"}), 500
    limit = int(request.args.get("limit", 5))
    # Chroma não expõe listagem direta de documentos; usamos get por ids conhecidas
    # Estratégia simples: armazenamos ids via peek (se suportado) ou retornamos estatísticas.
    try:
        # Algumas versões de Chroma expõem .get returning subset; aqui tentamos sem ids para retornar tudo (cuidado com grandes coleções).
        data = chroma_collection.get()
        all_ids = data.get("ids", [])
        all_docs = data.get("documents", [])
        subset = [
            {"id": i, "text": all_docs[idx][:500] if idx < len(all_docs) else None}
            for idx, i in enumerate(all_ids[:limit])
        ]
        return jsonify({
            "count": chroma_collection.count(),
            "sample": subset
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/health", methods=["GET"])
def health():
    loaded = chroma_collection is not None
    count = chroma_collection.count() if loaded else 0
    return jsonify({
        "ok": True,
        "openai_key": bool(API_KEY),
        "model": CHAT_MODEL,
        "vectorstore_loaded": loaded,
        "vectorstore_count": count
    })

@app.route("/api/chatgpt", methods=["POST"])
def chat():
    if not API_KEY:
        return jsonify({"error": "OPENAI_API_KEY ausente"}), 500

    data = request.get_json(silent=True) or {}
    prompt = data.get("prompt")
    # Parâmetro mantido por compatibilidade, mas ignorado: não usamos mais vectorstore no chat
    _ = data.get("use_context")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Não usamos mais contexto de vectorstore
    doc_ids = []
    system_msg = "Você é um assistente. Responda de forma clara e objetiva em português do Brasil."

    payload = {
        "model": CHAT_MODEL,
        "messages": [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    try:
        resp = requests.post(BASE_CHAT_URL, headers=_headers(), json=payload, timeout=60)
        resp.raise_for_status()
        try:
            out = resp.json()
        except Exception:
            return jsonify({"error": "InvalidJSON", "detail": resp.text[:800]}), 502
        text = out.get("choices", [{}])[0].get("message", {}).get("content")
        if not text:
            return jsonify({"error": "EmptyResponse", "raw": out}), 502
        return jsonify({
            "text": text,
            "used_context": False,
            "doc_ids": doc_ids
        })
    except requests.Timeout:
        return jsonify({"error": "Timeout", "detail": "OpenAI request timed out"}), 504
    except requests.HTTPError:
        return jsonify({"error": "HTTPError", "detail": resp.text}), 502
    except Exception as e:
        return jsonify({"error": f"ServerError: {e}"}), 500

if __name__ == "__main__":
    port = int(_env("PORT", "3001") or "3001")
    app.run(host="0.0.0.0", port=port, debug=True)

