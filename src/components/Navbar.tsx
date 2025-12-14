import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Mic, User, Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import logoImage from "@/assets/logo-dmsnm.jpeg";

const navItems = [
  { path: "/", label: "Accueil", icon: Home },
  { path: "/episodes", label: "Épisodes", icon: Mic },
  { path: "/participer", label: "Participer", icon: Heart },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, profile, isLoading, isAdmin } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 rounded-full overflow-hidden">
            <img src={logoImage} alt="Des mots sur nos maux" className="w-full h-full object-cover" />
          </motion.div>
          <span className="font-bold text-lg hidden sm:block text-foreground">Des mots sur nos maux</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={cn("px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 relative overflow-hidden", isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50")}>
                <motion.span whileHover={{ scale: 1.1 }} className="flex items-center gap-2"><Icon className="w-4 h-4" />{item.label}</motion.span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isLoading && (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105">
                    <LayoutDashboard className="w-4 h-4 mr-2" />Dashboard
                  </Button>
                </Link>
              )}
              {user ? (
                <Link to="/profil">
                  <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105"><User className="w-4 h-4 mr-2" />{profile?.pseudo || "Profil"}</Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth"><Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105">Connexion</Button></Link>
                  <Link to="/auth?mode=signup"><Button variant="spotify" size="sm" className="transition-all duration-300 hover:scale-105">S'inscrire</Button></Link>
                </>
              )}
            </>
          )}
        </div>

        <motion.button whileTap={{ scale: 0.9 }} className="md:hidden p-2 rounded-full hover:bg-accent transition-colors" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="md:hidden bg-background border-b border-border overflow-hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <motion.div key={item.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <Link to={item.path} onClick={() => setIsOpen(false)} className={cn("px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-3", isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50")}>
                      <Icon className="w-5 h-5" />{item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="border-t border-border my-2 pt-4 space-y-2">
                {!isLoading && (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full text-primary justify-start mb-2"><LayoutDashboard className="w-4 h-4 mr-2" />Accéder au Dashboard</Button>
                      </Link>
                    )}
                    {user ? (
                      <Link to="/profil" onClick={() => setIsOpen(false)}><Button variant="outline" className="w-full"><User className="w-4 h-4 mr-2" />{profile?.pseudo || "Profil"}</Button></Link>
                    ) : (
                      <>
                        <Link to="/auth" onClick={() => setIsOpen(false)}><Button variant="outline" className="w-full"><User className="w-4 h-4 mr-2" />Connexion</Button></Link>
                        <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}><Button variant="spotify" className="w-full">S'inscrire</Button></Link>
                      </>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}