import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Crown,
  Heart,
  Star,
  ArrowRight,
  Quote,
  Instagram,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const values = [
  {
    icon: Crown,
    title: "Authenticité",
    description: "Être soi-même sans masque, embrasser ses imperfections.",
  },
  {
    icon: Heart,
    title: "Bienveillance",
    description: "Cultiver la compassion envers soi et envers les autres.",
  },
  {
    icon: Star,
    title: "Résilience",
    description: "Se relever, grandir, transformer les épreuves en force.",
  },
];

const quotes = [
  "Tu es le roi ou la reine de ta propre histoire.",
  "Tes cicatrices sont des preuves de ta force.",
  "Chaque pas compte, même les plus petits.",
];

export default function KingOf() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-hope/5 via-transparent to-lavender/10" />
          </div>

          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-hope/10 rounded-full text-hope text-sm font-medium mb-6">
                  <Crown className="w-4 h-4" />
                  La marque
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  King
                  <span className="bg-gradient-to-r from-hope to-hope-deep bg-clip-text text-transparent">
                    Of
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  KingOf est bien plus qu'une marque. C'est un mouvement qui
                  célèbre l'authenticité, la résilience et le courage d'être
                  soi-même. Chaque personne est le roi ou la reine de sa propre
                  histoire.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="hope" size="lg">
                    Découvrir la collection
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop"
                    alt="KingOf Brand"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-hope to-hope-deep rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-5xl font-bold text-primary-foreground">
                    K
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nos valeurs
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Les piliers qui guident notre vision et notre communauté
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-hope to-hope-deep flex items-center justify-center mb-6">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid md:grid-cols-3 gap-6">
                {quotes.map((quote, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-hope/10 to-lavender/20 p-6 rounded-2xl relative"
                  >
                    <Quote className="w-8 h-8 text-hope/50 mb-4" />
                    <p className="text-lg font-medium italic">{quote}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                L'univers KingOf
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez notre univers visuel et rejoignez le mouvement
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&auto=format&fit=crop",
              ].map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="aspect-[3/4] rounded-2xl overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`KingOf ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-night to-foreground rounded-3xl p-8 md:p-16 text-center text-primary-foreground"
            >
              <span className="inline-block px-4 py-2 bg-hope/20 rounded-full text-hope text-sm font-medium mb-6">
                Bientôt disponible
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                La boutique KingOf
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Notre collection de vêtements et accessoires arrive bientôt.
                Inscrivez-vous pour être informé(e) du lancement et bénéficier
                d'offres exclusives.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full h-12 px-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-hope"
                />
                <Button variant="hope" size="lg" className="w-full sm:w-auto">
                  M'inscrire
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Rejoignez le mouvement
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Écoutez le podcast "Des mots sur nos maux" et découvrez des
                histoires inspirantes de résilience et d'authenticité.
              </p>
              <Link to="/episodes">
                <Button variant="hope" size="xl">
                  Explorer les épisodes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
