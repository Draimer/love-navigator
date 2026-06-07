/**
 * Cloudflare Worker — Ollama Cloud Proxy for Love Emotion Navigator
 * ─────────────────────────────────────────────────────────────────
 *
 * 部署前必做兩件事:
 *
 * 1. 把下方 ALLOWED_ORIGIN 改成你的 GitHub Pages 網址
 *    例如:'https://dramier.github.io'
 *    (沒有路徑,只到 .io 為止)
 *
 * 2. 在 Cloudflare Worker 後台加入 Secret:
 *    Settings → Variables → Add variable → 選 Encrypt
 *    名稱:OLLAMA_API_KEY
 *    值  :你的 Ollama Cloud API Key
 *         (從 https://ollama.com/settings/keys 取得)
 */

// ⚠️ 改成你自己的 GitHub Pages 網域(只允許這個來源呼叫你的 Worker,避免別人盜用)
const ALLOWED_ORIGIN = 'https://你的GitHub帳號.github.io';

// 鎖定模型(如果前端傳別的模型過來會被覆寫)
const FORCE_MODEL = 'gemma4:31b-cloud';

function buildCorsHeaders(origin) {
  // 允許:你的 GitHub Pages、本機開發 (localhost / 127.0.0.1 / file://)
  const isAllowed =
    origin === ALLOWED_ORIGIN ||
    (origin && origin.startsWith('http://localhost')) ||
    (origin && origin.startsWith('http://127.0.0.1')) ||
    (origin && origin.startsWith('file://')) ||
    (origin && origin.startsWith('null'));

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = buildCorsHeaders(origin);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // 只接受 POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({
        error: { message: '只接受 POST 請求' }
      }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...cors }
      });
    }

    // 檢查 Secret 是否設定
    if (!env.OLLAMA_API_KEY) {
      return new Response(JSON.stringify({
        error: { message: 'Worker 未設定 OLLAMA_API_KEY secret,請到 Cloudflare 後台加入' }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...cors }
      });
    }

    // 解析請求,強制覆寫 model 為固定值(避免使用者選別的貴模型耗你的 quota)
    let bodyJson;
    try {
      bodyJson = await request.json();
      bodyJson.model = FORCE_MODEL;
    } catch (err) {
      return new Response(JSON.stringify({
        error: { message: '請求 body 不是合法 JSON' }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors }
      });
    }

    // 轉送到 Ollama Cloud
    try {
      const ollamaResp = await fetch('https://ollama.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OLLAMA_API_KEY}`,
        },
        body: JSON.stringify(bodyJson),
      });

      const respText = await ollamaResp.text();
      return new Response(respText, {
        status: ollamaResp.status,
        headers: {
          'Content-Type': ollamaResp.headers.get('Content-Type') || 'application/json',
          ...cors,
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({
        error: { message: 'Proxy 轉送失敗:' + err.message }
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...cors }
      });
    }
  },
};
