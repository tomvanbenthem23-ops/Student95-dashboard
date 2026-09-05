'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const LS_PREFIX = 's95_';
const API_URL = '/api/state';

function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(LS_PREFIX + key);
  } catch {
    return null;
  }
}
function lsSet(key: string, value: string) {
  try {
    localStorage.setItem(LS_PREFIX + key, value);
  } catch {
    /* private mode etc. — never break the app over this */
  }
}

export type ConnStatus = 'off' | 'connect' | 'poll' | 'sync' | 'err';

type StoreValue = {
  connStatus: ConnStatus;
  connMessage: string;
  get: <T>(key: string, fallback: T) => T;
  set: (key: string, value: unknown) => void;
  editMode: boolean;
  toggleEdit: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

function readInitialCache(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const raw = localStorage.key(i);
      if (raw && raw.indexOf(LS_PREFIX) === 0) {
        const key = raw.slice(LS_PREFIX.length);
        const value = localStorage.getItem(raw);
        if (value != null) out[key] = value;
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Start empty (matches the server-rendered HTML) — localStorage is hydrated
  // in an effect after mount so the client's first render never mismatches.
  const [cache, setCache] = useState<Record<string, string>>({});
  const [connStatus, setConnStatus] = useState<ConnStatus>('off');
  const [connMessage, setConnMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const apiOkRef = useRef(false);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const get = useCallback(
    <T,>(key: string, fallback: T): T => {
      const raw = cache[key];
      if (raw == null) return fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    },
    [cache],
  );

  const flushKey = useCallback(async (key: string, serialized: string) => {
    setConnStatus('sync');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: JSON.parse(serialized) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setConnStatus('poll');
    } catch (e) {
      setConnStatus('err');
      setConnMessage(
        'Opslaan mislukt: ' +
          (e instanceof Error ? e.message : String(e)) +
          ' — de wijziging staat wel in deze browser bewaard.',
      );
    }
  }, []);

  const set = useCallback(
    (key: string, value: unknown) => {
      const serialized = JSON.stringify(value);
      setCache((prev) => ({ ...prev, [key]: serialized }));
      lsSet(key, serialized);
      if (!apiOkRef.current) return;
      const timers = timersRef.current;
      const existing = timers.get(key);
      if (existing) clearTimeout(existing);
      timers.set(
        key,
        setTimeout(() => {
          timers.delete(key);
          flushKey(key, serialized);
        }, 400),
      );
    },
    [flushKey],
  );

  useEffect(() => {
    setCache((prev) => ({ ...readInitialCache(), ...prev }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      setConnStatus('connect');
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(String(res.status));
        const body = await res.json();
        const data = (body.data || {}) as Record<string, unknown>;
        if (cancelled) return;
        setCache((prev) => {
          const next = { ...prev };
          for (const k of Object.keys(data)) {
            const serialized = JSON.stringify(data[k]);
            next[k] = serialized;
            lsSet(k, serialized);
          }
          return next;
        });
        apiOkRef.current = true;
        setConnStatus('poll');
      } catch (e) {
        apiOkRef.current = false;
        setConnStatus('off');
        setConnMessage(
          'Server niet bereikbaar: wijzigingen blijven in deze browser.',
        );
      }
    }
    loadAll();
    const interval = setInterval(() => {
      if (apiOkRef.current && !document.hidden) loadAll();
    }, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('editing', editMode);
  }, [editMode]);

  const toggleEdit = useCallback(() => setEditMode((v) => !v), []);

  return (
    <StoreContext.Provider
      value={{ connStatus, connMessage, get, set, editMode, toggleEdit }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
