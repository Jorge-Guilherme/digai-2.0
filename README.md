# digai-2.0

Aplicação web com frontend em React (Vite) e backend em Python para respostas via OpenAI Chat Completions. A vectorstore (Chroma) é opcional e não é usada para compor a resposta do chat.

## Stack
- Frontend: Vite + React + TypeScript
- Backend local: Flask + Requests (service/service.py)
- Backend serverless (produção): Vercel Function Python em `api/chatgpt.py`
- LLM: OpenAI Chat Completions API
- Vector Store: ChromaDB (persistente) — opcional (status/ingest/docs)

## Estrutura do projeto
```
api/
  chatgpt.py           # Function Python no Vercel para /api/chatgpt
  requirements.txt     # deps da function (requests)
service/
  service.py           # Servidor Flask local (dev)
  requirements.txt     # deps Python para dev local
src/                   # Frontend React (Vite)
...
```

## Requisitos
- Node.js 18+
- Python 3.10+
- Chave da API OpenAI (não comitar)

## Configuração local
1) Backend (Flask)
```
cd service
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

# Crie service/.env (NÃO versionar)
# Exemplo:
# OPENAI_API_KEY=coloque_sua_chave
# OPENAI_MODEL=gpt-4o-mini
# PORT=3001
```

2) Frontend
```
cd ..
npm install
```

## Executar localmente
- Backend (porta 3001):
```
cd service
source .venv/bin/activate
python service.py
```

- Frontend (porta 5173 padrão Vite):
```
cd ..
npm run dev
```

O Vite já proxy a rota `/api` para `http://localhost:3001` (veja `vite.config.ts`).

## Endpoints da API (Flask local)
- `GET /api/health` — Status do backend.
- `POST /api/chatgpt` — Corpo: `{ "prompt": "sua pergunta" }`.
  - Observação: o chat não usa vectorstore; sempre retorna `used_context=false`.
- `GET /api/vectorstore/status` — Contagem e estado da coleção (opcional).
- `POST /api/vectorstore/ingest` — Ingesta documentos.
- `GET /api/vectorstore/docs?limit=5` — Amostra de docs.

## Deploy (Vercel)
- Conecte o repositório no Vercel.
- Build Frontend:
  - Install: `npm ci` (ou `npm install`)
  - Build: `npm run build`
  - Output: `dist`
- API de produção: a Function Python `api/chatgpt.py` atende `/api/chatgpt`.
- Variáveis no Vercel:
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL` (opcional, ex.: `gpt-4o-mini`)

## Testes rápidos
- Chat local:
```
curl -X POST http://localhost:3001/api/chatgpt \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Resuma Recife em 1 parágrafo"}'
```

- Health local:
```
curl http://localhost:3001/api/health
```

## Segurança
- Não comite `.env` ou chaves. Já adicionamos entradas no `.gitignore`.
- Se um segredo for exposto, rotacione a chave e regrave o histórico se necessário.

## Licença
Defina a licença de sua preferência.
