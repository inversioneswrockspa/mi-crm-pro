import React, { createContext, useContext, useState, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BudgetItem, ClientInfo, QuoteStatus, QuoteItem } from '../types';

interface QuoteContextType {
  items: BudgetItem[];
  setItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  clientInfo: ClientInfo;
  setClientInfo: React.Dispatch<React.SetStateAction<ClientInfo>>;
  status: QuoteStatus;
  setStatus: React.Dispatch<React.SetStateAction<QuoteStatus>>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  discount: number;
  setDiscount: React.Dispatch<React.SetStateAction<number>>;
  isSavingQuote: boolean;
  saveQuote: (id: string, data: any) => Promise<void>;
  loadQuote: (id: string) => Promise<void>;
  isLoadingQuote: boolean;
  setIsLoadingQuote: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({});
  const [status, setStatus] = useState<QuoteStatus>('draft');
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isSavingQuote, setIsSavingQuote] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const saveQuote = async (id: string, data: any) => {
    setIsSavingQuote(true);
    try {
      await setDoc(doc(db, "presupuestos", id), data, { merge: true });
    } finally {
      setIsSavingQuote(false);
    }
  };

  const loadQuote = async (id: string) => {
    setIsLoadingQuote(true);
    try {
      const docRef = doc(db, "presupuestos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setItems(data.items || []);
        setClientInfo(data.clientInfo || {});
        setStatus(data.status || 'draft');
        setTotal(data.total || 0);
        setDiscount(data.discount || 0);
      }
    } catch (error) {
      console.error("Error al cargar presupuesto:", error);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  return (
    <QuoteContext.Provider value={{ items, setItems, clientInfo, setClientInfo, status, setStatus, total, setTotal, discount, setDiscount, isSavingQuote, saveQuote, loadQuote, isLoadingQuote, setIsLoadingQuote }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) throw new Error('useQuote must be used within QuoteProvider');
  return context;
};
