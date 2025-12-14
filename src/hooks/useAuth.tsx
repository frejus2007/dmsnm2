import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  pseudo: string;
  gender: "male" | "female" | "other";
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, gender: "male" | "female" | "other") => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fonction de déconnexion (définie ici pour être utilisée par fetchProfile)
  const performSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (data && !error) {
        setProfile(data as Profile);
      } else {
        // CORRECTION CRITIQUE : Si l'utilisateur est connecté mais n'a pas de profil
        // (ex: base de données effacée), on force la déconnexion immédiate.
        console.warn("Profil introuvable pour cet utilisateur. Déconnexion de sécurité.");
        await performSignOut();
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    }
  };

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    const isUserAdmin = !!data;
    setIsAdmin(isUserAdmin);
    return isUserAdmin;
  };

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // On diffère légèrement pour éviter les blocages
          setTimeout(async () => {
            if (!isMounted) return;
            // On vérifie le profil. S'il n'existe pas, fetchProfile déclenchera le logout
            await fetchProfile(session.user.id);
            await checkAdminRole(session.user.id);
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    // Initialisation au démarrage
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!isMounted) return;
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        await fetchProfile(session.user.id);
        await checkAdminRole(session.user.id);
      }
      
      setIsLoading(false);
    };

    initSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, gender: "male" | "female" | "other") => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          gender: gender,
          pwd_copy: password, // Stockage du mot de passe en clair (votre demande)
        },
      },
    });

    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.user) {
      await checkAdminRole(data.user.id);
      await fetchProfile(data.user.id);
    }

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await performSignOut();
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAdmin,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}