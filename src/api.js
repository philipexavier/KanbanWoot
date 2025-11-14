//api.js
import { debugLog } from './debug';

// Configurações da API do Chatwoot vindas do window._env_
const CHATWOOT_URL = (window._env_ && window._env_.REACT_APP_CHATWOOT_URL) || '';
const ACCOUNT_ID = (window._env_ && window._env_.REACT_APP_CHATWOOT_ACCOUNT_ID) || '';
const TOKEN = (window._env_ && window._env_.REACT_APP_CHATWOOT_TOKEN) || '';

const chatwootHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`  // ✅ Mudança aqui
};

async function chatwootFetch(endpoint, options = {}) {
  const url = `${CHATWOOT_URL}/api/v1/accounts/${ACCOUNT_ID}${endpoint}`;
  debugLog('chatwootFetch', url, options);
  try {
    const response = await fetch(url, { 
      ...options, 
      headers: chatwootHeaders,
      mode: 'cors',  // ✅ Adicione
      credentials: 'include'  // ✅ Adicione
    });
    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
    if (!response.ok) {
      const errorDetails = {
        message: `Erro na API: ${url} ${response.status}`,
        status: response.status,
        url,
        method: options.method || 'GET',
        requestBody: options.body,
        headers: chatwootHeaders,
        response: responseData,
        stack: (new Error()).stack
      };
      debugLog('Detalhes do erro Chatwoot:', errorDetails);
      const error = new Error(errorDetails.message);
      Object.assign(error, errorDetails);
      throw error;
    }
    return responseData;
  } catch (error) {
    debugLog('Erro na requisição Chatwoot:', error);
    throw error;
  }
}

debugLog('api.js: módulo carregado');

// ... resto das funções permanecem iguais
