import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { toast } from 'sonner';
import { useAuthState } from 'react-firebase-hooks/auth';
import { removeUndefined } from '../lib/utils';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  companyRut: string;
  companySubtitle: string;
  companyAddress: string;
  role: string;
  companyLogo: string;
  paymentInfo: string;
  geminiApiKey?: string;
  isPro?: boolean;
  trialEndsAt?: number;
}

interface ProfileContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isSavingProfile: boolean;
  showProfileSettings: boolean;
  setShowProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
  saveProfile: () => Promise<void>;
  upgradeToPro: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Analista de Proyectos',
    email: '',
    phone: '',
    companyName: 'MI CRM PRO',
    companyRut: '',
    companySubtitle: 'Gestión Inteligente',
    companyAddress: '',
    role: 'Especialista',
    companyLogo: '',
    paymentInfo: 'Transferencia Bancaria:\nBanco: ...\nTipo: ...\nCuenta: ...\nRUT: ...\nEmail: ...',
    isPro: false,
    trialEndsAt: 0
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
          const docRef = doc(db, "users", effectiveUid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile(prev => ({ ...prev, ...data }));
          } else {
            setUserProfile({
              name: user.displayName || 'Tu Nombre',
              email: user.email || '',
              phone: '',
              companyName: 'Tu Empresa',
              companyRut: '00.000.000-0',
              companySubtitle: 'Especialista en Proyectos',
              companyAddress: 'Ciudad, Pais',
              role: 'Analista de Proyectos',
              companyLogo: '',
              paymentInfo: 'Transferencia Bancaria:\nBanco: ...\nTipo: ...\nCuenta: ...\nRUT: ...\nEmail: ...',
              isPro: false,
              trialEndsAt: Date.now() + 15 * 24 * 60 * 60 * 1000 // 15 días gratis
            });
            setShowProfileSettings(true);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
    try {
      await setDoc(doc(db, "users", effectiveUid), removeUndefined(userProfile), { merge: true });
      setShowProfileSettings(false);
      toast.success("Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error al guardar el perfil.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const upgradeToPro = async () => {
    if (!user) return;
    try {
      const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
      const updatedProfile = { ...userProfile, isPro: true };
      setUserProfile(updatedProfile);
      await setDoc(doc(db, "users", effectiveUid), removeUndefined(updatedProfile), { merge: true });
      toast.success("¡Bienvenido al Plan Pro! 🚀 Todas las funciones están desbloqueadas.");
    } catch (error) {
      console.error("Error upgrading to Pro:", error);
      toast.error("Hubo un error al procesar tu suscripción.");
    }
  };

  return (
    <ProfileContext.Provider value={{ userProfile, setUserProfile, isSavingProfile, showProfileSettings, setShowProfileSettings, saveProfile, upgradeToPro }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
};
