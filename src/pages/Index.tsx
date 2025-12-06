import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Shield, Heart, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EpisodeCard } from "@/components/EpisodeCard";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-image.jpeg";

interface Episode {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  duration: string | null;
  category: string;
  spotify_url: string;
}

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

// Floating animation variants
const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const pulseGlow = {
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export default function Index() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      const { data, error } = await supabase
        .from("episodes")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error && data) {
        setEpisodes(data);
      }
      setIsLoading(false);
    };

    fetchEpisodes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <motion.div 
              variants={pulseGlow}
              animate="animate"
              className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl opacity-20" 
            />
            <motion.div 
              variants={pulseGlow}
              animate="animate"
              style={{ animationDelay: "1.5s" }}
              className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl opacity-10" 
            />
            {/* Floating particles */}
            <motion.div
              animate={{ 
                y: [0, -30, 0],
                x: [0, 15, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full"
            />
            <motion.div
              animate={{ 
                y: [0, 20, 0],
                x: [0, -10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary/50 rounded-full"
            />
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-primary/30 rounded-full"
            />
          </div>

          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.span 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-medium mb-6 text-foreground"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.span 
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-primary rounded-full" 
                    />
                    Nouveau : Écoutez notre dernier épisode
                  </motion.span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-foreground"
                >
                  Mettre{" "}
                  <motion.span 
                    className="text-primary inline-block"
                    whileHover={{ scale: 1.05 }}
                    animate={{ 
                      textShadow: ["0 0 0px hsl(var(--primary))", "0 0 20px hsl(var(--primary))", "0 0 0px hsl(var(--primary))"],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    des mots
                  </motion.span>{" "}
                  sur nos{" "}
                  <span className="text-muted-foreground">
                    maux
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                >
                  Un espace safe où chacun peut s'exprimer librement, sans jugement.
                  Écoutez, partagez, et sentez-vous moins seul(e).
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                >
                  <Link to="/episodes">
                    <motion.div 
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px hsl(var(--primary) / 0.3)" }} 
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="spotify" size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                        <Headphones className="w-5 h-5 mr-2" />
                        Explorer les épisodes
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/auth?mode=signup">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" size="xl" className="w-full sm:w-auto group">
                        Rejoindre la communauté
                        <motion.span
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>

              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <motion.div
                  variants={floatAnimation}
                  animate="animate"
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl" />
                  <img
                    src={heroImage}
                    alt="Des mots sur nos maux podcast"
                    className="relative rounded-3xl shadow-2xl shadow-primary/10 w-full max-w-lg mx-auto"
                  />
                  {/* Decorative elements */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-4 -right-4 w-24 h-24 border-2 border-primary/20 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-primary/10 rounded-full"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
          {/* Background decoration */}
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
          />
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                whileInView={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                Votre safe space
              </motion.h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Un espace conçu pour vous permettre de vous exprimer en toute sécurité
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.5,
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group"
                >
                  <motion.div 
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow"
                  >
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
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
              transition={{ duration: 0.6 }}
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
                <motion.div whileHover={{ x: 5 }}>
                  <Button variant="ghost" className="group">
                    Voir tous les épisodes
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : episodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {episodes.map((episode, index) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={{
                      id: episode.id,
                      title: episode.title,
                      description: episode.description || "",
                      image: episode.image_url || "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800",
                      duration: episode.duration || "N/A",
                      category: episode.category,
                      spotifyUrl: episode.spotify_url,
                      commentCount: 0,
                    }}
                    index={index}
                    variant={index === 0 ? "featured" : "default"}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Headphones className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Aucun épisode disponible pour le moment
                </p>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 text-center md:hidden"
            >
              <Link to="/episodes">
                <Button variant="outline">
                  Voir tous les épisodes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
            >
              {/* Background glow */}
              <motion.div 
                animate={{ 
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" 
              />
              
              {/* Floating hearts */}
              <motion.div
                animate={{ 
                  y: [-20, 0, -20],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-8 left-1/4"
              >
                <Heart className="w-6 h-6 text-primary/30" />
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute bottom-12 right-1/4"
              >
                <Heart className="w-8 h-8 text-primary/20" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-4 text-foreground relative z-10"
              >
                Participez au podcast
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground max-w-2xl mx-auto mb-8 relative z-10"
              >
                Vous avez une histoire à partager ? Un sujet qui vous tient à cœur ?
                Proposez votre participation et faisons entendre votre voix ensemble.
                Votre anonymat est garanti.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10"
              >
                <Link to="/participer">
                  <Button variant="spotify" size="xl" className="shadow-lg shadow-primary/20">
                    Proposer ma participation
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-2"
                    >
                      <Heart className="w-5 h-5" />
                    </motion.span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
