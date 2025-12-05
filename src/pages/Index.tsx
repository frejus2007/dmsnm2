import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Shield, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EpisodeCard } from "@/components/EpisodeCard";

// Mock data for episodes
const featuredEpisodes = [
  {
    id: "1",
    title: "Apprendre à s'accepter : le chemin vers l'amour de soi",
    description: "Dans cet épisode, nous explorons les étapes essentielles pour développer une relation saine avec soi-même et cultiver l'acceptation.",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop",
    duration: "45 min",
    category: "Développement personnel",
    spotifyUrl: "https://open.spotify.com/episode/example1",
    commentCount: 24,
  },
  {
    id: "2",
    title: "Gérer l'anxiété au quotidien",
    description: "Des techniques concrètes pour apprivoiser l'anxiété et retrouver un équilibre émotionnel.",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop",
    duration: "38 min",
    category: "Santé mentale",
    spotifyUrl: "https://open.spotify.com/episode/example2",
    commentCount: 42,
  },
  {
    id: "3",
    title: "Les relations toxiques : comment s'en libérer",
    description: "Identifier les signes d'une relation toxique et trouver le courage de s'en éloigner.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop",
    duration: "52 min",
    category: "Relations",
    spotifyUrl: "https://open.spotify.com/episode/example3",
    commentCount: 67,
  },
  {
    id: "4",
    title: "Surmonter le deuil : un pas à la fois",
    description: "Accompagnement bienveillant pour traverser les étapes du deuil avec douceur.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    duration: "48 min",
    category: "Deuil",
    spotifyUrl: "https://open.spotify.com/episode/example4",
    commentCount: 35,
  },
];

const features = [
  {
    icon: Shield,
    title: "100% Anonyme",
    description: "Votre identité est protégée. Exprimez-vous librement avec un pseudo généré automatiquement.",
  },
  {
    icon: Headphones,
    title: "Écoute bienveillante",
    description: "Des épisodes qui abordent vos maux avec empathie et sans jugement.",
  },
  {
    icon: Users,
    title: "Communauté safe",
    description: "Rejoignez une communauté où chacun peut partager ses expériences en toute sécurité.",
  },
  {
    icon: Heart,
    title: "Soutien mutuel",
    description: "Commentez, réagissez et soutenez-vous les uns les autres dans la bienveillance.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-medium mb-6 text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Nouveau : Écoutez notre dernier épisode
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-foreground"
              >
                Mettre{" "}
                <span className="text-primary">
                  des mots
                </span>{" "}
                sur nos{" "}
                <span className="text-muted-foreground">
                  maux
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
              >
                Un espace safe où chacun peut s'exprimer librement, sans jugement.
                Écoutez, partagez, et sentez-vous moins seul(e).
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link to="/episodes">
                  <Button variant="spotify" size="xl" className="w-full sm:w-auto">
                    <Headphones className="w-5 h-5 mr-2" />
                    Explorer les épisodes
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    Rejoindre la communauté
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Votre safe space
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Un espace conçu pour vous permettre de vous exprimer en toute sécurité
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Episodes Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Derniers épisodes
                </h2>
                <p className="text-muted-foreground">
                  Découvrez nos conversations les plus récentes
                </p>
              </div>
              <Link to="/episodes" className="hidden md:block">
                <Button variant="ghost">
                  Voir tous les épisodes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredEpisodes.map((episode, index) => (
                <EpisodeCard
                  key={episode.id}
                  episode={episode}
                  index={index}
                  variant={index === 0 ? "featured" : "default"}
                />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link to="/episodes">
                <Button variant="outline">
                  Voir tous les épisodes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-3xl p-8 md:p-16 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Participez au podcast
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Vous avez une histoire à partager ? Un sujet qui vous tient à cœur ?
                Proposez votre participation et faisons entendre votre voix ensemble.
                Votre anonymat est garanti.
              </p>
              <Link to="/participer">
                <Button variant="spotify" size="xl">
                  Proposer ma participation
                  <Heart className="w-5 h-5 ml-2" />
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
