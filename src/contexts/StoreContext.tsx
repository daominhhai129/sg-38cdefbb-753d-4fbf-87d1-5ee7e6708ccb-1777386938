import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Store } from "@/types";
import { getMyStore } from "@/services/storeService";

interface StoreContextValue {
  store: Store | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue>({ store: null, loading: true, refresh: async () => {} });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const s = await getMyStore();
      setStore(s);
    } catch {
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) refresh();
      else setStore(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return <StoreContext.Provider value={{ store, loading, refresh }}>{children}</StoreContext.Provider>;
}

export const useMyStore = () => useContext(StoreContext);