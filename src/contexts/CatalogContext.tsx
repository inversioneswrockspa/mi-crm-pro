import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useDeferredValue } from 'react';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/utils';
import { CatalogItem } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';

// This would ideally be loaded from a config or service, keeping it here for now as in App.tsx
export const DEFAULT_CATALOG: CatalogItem[] = [
  {
    id: "P05989",
    name: "Cable UTP CAT 5E Blanco 305m 100% Cobre (Eco)",
    description: "ECO CABLE UTP CAT 5E 25 AWG BLANCO 305 MTS 100% COBRE. Ideal para instalaciones interiores de alta calidad.",
    unitPrice: 64023,
    images: ["https://images.unsplash.com/photo-1558494949-ef010958384e?w=200&auto=format&fit=crop&q=80"]
  },
  {
    id: "P06291",
    name: "Cable UTP CAT 6 Blanco 305m 100% Cobre (Eco)",
    description: "ECO CABLE UTP CAT 6 24 AWG BLANCO 305 MTS 100% COBRE. Máximo rendimiento y conductivity para redes gigabit.",
    unitPrice: 85008,
    images: ["https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=200&auto=format&fit=crop&q=80"]
  },
  {
    id: "P06043",
    name: "CABLE LIBRE DE HALOGENO H07Z1-K 1x1.5 mm2 BLANCO x100 MTS",
    description: "Marca: Nexans | Color: Blanco | Denominación: monoconductor",
    unitPrice: 23400, // Precio neto
    images: []
  }
];

interface CatalogContextType {
  catalog: CatalogItem[];
  catalogFilteredItems: CatalogItem[];
  catalogSearchTerm: string;
  setCatalogSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  catalogEstrellas: CatalogItem[];
  setCatalog: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
  resetCatalog: () => void;
  isInitialLoading: boolean;
  getOptimizedImageUrl: (url?: string[]) => string;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider = ({ children }: { children: ReactNode }) => {
  const [user, loadingAuth] = useAuthState(auth);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const deferredCatalogSearchTerm = useDeferredValue(catalogSearchTerm);

  const getOptimizedImageUrl = (images?: string[]) => {
    if (!images || images.length === 0) return '/placeholder-image.png'; // Fallback
    const url = images[0];
    if (url.includes('images.unsplash.com')) {
      return url.replace(/w=\d+/, 'w=200').replace(/q=\d+/, 'q=80');
    }
    return url;
  };

  const resetCatalog = () => {
    setCatalog(DEFAULT_CATALOG);
  };



  useEffect(() => {
    if (!user) return;
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;

    const q = query(
      collection(db, "catalog"), 
      where("ownerId", "==", effectiveUid),
      orderBy("createdAt", "desc"),
      limit(500)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CatalogItem));

      setCatalog(fetchedItems);
      setIsInitialLoading(false);

      // Sincronización automática con n8n Cloud
      if (fetchedItems.length > 0) {
        try {
          fetch('https://wrockcoquimb.app.n8n.cloud/webhook/wrock-sync-catalog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: 'MI_CRM_PRO_LIVE',
              catalog: fetchedItems.map(item => ({
                id: item.id,
                name: item.name,
                description: item.description || '',
                unitPrice: item.unitPrice || 0
              }))
            })
          }).catch(() => {});
        } catch (e) {}
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "catalog");
      setIsInitialLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const catalogFilteredItems = useMemo(() => {
    if (!deferredCatalogSearchTerm) return catalog;
    const term = deferredCatalogSearchTerm.toLowerCase();
    
    // Performance optimization for filter loop
    return catalog.filter(item => 
      (item.name || '').toLowerCase().includes(term) || 
      (item.id || '').toLowerCase().includes(term) ||
      (item.description || '').toLowerCase().includes(term)
    );
  }, [catalog, deferredCatalogSearchTerm]);

  const catalogEstrellas = useMemo(() => {
    return [...catalog]
      .sort((a: any, b: any) => (b.totalVendido || 0) - (a.totalVendido || 0))
      .slice(0, 5);
  }, [catalog]);

  const contextValue = useMemo(() => ({
    catalog,
    catalogFilteredItems,
    catalogSearchTerm,
    setCatalogSearchTerm,
    catalogEstrellas,
    setCatalog,
    resetCatalog,
    isInitialLoading,
    getOptimizedImageUrl
  }), [catalog, catalogFilteredItems, catalogSearchTerm, catalogEstrellas, isInitialLoading]);

  return (
    <CatalogContext.Provider value={contextValue}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used within CatalogProvider');
  return context;
};
