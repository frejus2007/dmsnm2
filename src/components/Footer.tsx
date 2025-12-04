import { Link } from "react-router-dom";
import { Leaf, Heart, Mail, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hope to-hope-deep flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Des mots sur nos maux</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Un espace safe où l'on met des mots sur nos maux pour s'exprimer
              librement et se sentir moins seul. Votre anonymat est garanti.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@desmotssurnosmaux.com"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/episodes"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Épisodes
                </Link>
              </li>
              <li>
                <Link
                  to="/participer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Participer
                </Link>
              </li>
              <li>
                <Link
                  to="/kingof"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  KingOf
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/mentions-legales"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  to="/confidentialite"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  to="/cgu"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  CGU
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Des mots sur nos maux. Tous droits
            réservés.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Fait avec <Heart className="w-4 h-4 text-destructive fill-current" /> pour vous
          </p>
        </div>
      </div>
    </footer>
  );
}
