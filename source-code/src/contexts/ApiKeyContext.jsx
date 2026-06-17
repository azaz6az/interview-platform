import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ApiKeyContext = createContext(null);

const STORAGE_KEY = 'ip_api_key';
const PROVIDER_STORAGE_KEY = 'ip_api_provider';

export function ApiKeyProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || ''; } catch { return ''; }
  });
  const [provider, setProvider] = useState(() => {
    try { return localStorage.getItem(PROVIDER_STORAGE_KEY) || 'tongyi'; } catch { return 'tongyi'; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, apiKey); } catch { /* ignore */ }
  }, [apiKey]);

  useEffect(() => {
    try { localStorage.setItem(PROVIDER_STORAGE_KEY, provider); } catch { /* ignore */ }
  }, [provider]);

  const saveApiKey = useCallback((key) => setApiKey(key), []);
  const saveProvider = useCallback((p) => setProvider(p), []);

  const isConfigured = apiKey.length > 0;

  return (
    <ApiKeyContext.Provider value={{ apiKey, provider, isConfigured, saveApiKey, saveProvider }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) return { apiKey: '', provider: 'tongyi', isConfigured: false, saveApiKey: () => {}, saveProvider: () => {} };
  return ctx;
}
