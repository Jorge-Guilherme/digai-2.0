import json
import os
import requests
from http.server import BaseHTTPRequestHandler


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
BASE_CHAT_URL = "https://api.openai.com/v1/chat/completions"
CHAT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")


def _headers():
    return {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }


class handler(BaseHTTPRequestHandler):
    def _send(self, status: int, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        # Basic CORS preflight (usually same-origin on Vercel, but keep permissive)
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_POST(self):
        try:
            if not OPENAI_API_KEY:
                return self._send(500, {"error": "OPENAI_API_KEY ausente"})

            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length > 0 else b"{}"
            try:
                data = json.loads(raw.decode("utf-8")) if raw else {}
            except Exception:
                return self._send(400, {"error": "InvalidJSON"})

            prompt = (data or {}).get("prompt")
            if not prompt:
                return self._send(400, {"error": "Prompt is required"})

            system_msg = "Você é um assistente. Responda de forma clara e objetiva em português do Brasil."
            payload = {
                "model": CHAT_MODEL,
                "messages": [
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
            }

            resp = requests.post(BASE_CHAT_URL, headers=_headers(), json=payload, timeout=60)
            try:
                resp.raise_for_status()
            except requests.HTTPError:
                return self._send(502, {"error": "HTTPError", "detail": resp.text})

            try:
                out = resp.json()
            except Exception:
                return self._send(502, {"error": "InvalidJSON", "detail": resp.text[:800]})

            text = (out.get("choices") or [{}])[0].get("message", {}).get("content")
            if not text:
                return self._send(502, {"error": "EmptyResponse", "raw": out})

            return self._send(200, {"text": text, "used_context": False, "doc_ids": []})

        except requests.Timeout:
            return self._send(504, {"error": "Timeout", "detail": "OpenAI request timed out"})
        except Exception as e:
            return self._send(500, {"error": f"ServerError: {e}"})
