import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EpisodeCard } from "@/components/EpisodeCard";
import { cn } from "@/lib/utils";

const categories = [
  "Tous",
  "Santé mentale",
  "Relations",
  "Développement personnel",
  "Deuil",
  "Famille",
  "Travail",
];

const allEpisodes = [
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
  {
    id: "5",
    title: "La charge mentale : reconnaître et alléger",
    description: "Comprendre ce qu'est la charge mentale et apprendre à mieux la gérer au quotidien.",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop",
    duration: "41 min",
    category: "Santé mentale",
    spotifyUrl: "https://open.spotify.com/episode/example5",
    commentCount: 58,
  },
  {
    id: "6",
    title: "Réconciliation familiale : est-ce toujours possible ?",
    description: "Explorer les dynamiques familiales complexes et les chemins vers la réconciliation.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop",
    duration: "55 min",
    category: "Famille",
    spotifyUrl: "https://open.spotify.com/episode/example6",
    commentCount: 29,
  },
  {
    id: "7",
    title: "Burn-out : reconnaître les signaux d'alerte",
    description: "Apprendre à identifier les signes du burn-out avant qu'il ne soit trop tard.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop",
    duration: "43 min",
    category: "Travail",
    spotifyUrl: "https://open.spotify.com/episode/example7",
    commentCount: 71,
  },
  {
    id: "8",
    title: "L'art de dire non sans culpabiliser",
    description: "Poser ses limites avec bienveillance envers soi-même et les autres.",
    image: "https://images.unsplash.com/photo-1489533119213-66a5cd877091?w=800&auto=format&fit=crop",
    duration: "36 min",
    category: "Développement personnel",
    spotifyUrl: "https://open.spotify.com/episode/example8",
    commentCount: 45,
  },
];

export default function Episodes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [showFilters, setShowFilters] = useState(false);

  const filteredEpisodes = allEpisodes.filter((episode) => {
    const matchesSearch =
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" || episode.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Tous les épisodes
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explorez notre collection d'épisodes abordant divers sujets avec
              bienveillance et authenticité.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un épisode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>

            {/* Category Filters */}
            <div
              className={cn(
                "flex flex-wrap gap-2 mt-4",
                !showFilters && "hidden md:flex"
              )}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground mb-6"
          >
            {filteredEpisodes.length} épisode{filteredEpisodes.length > 1 ? "s" : ""} trouvé{filteredEpisodes.length > 1 ? "s" : ""}
          </motion.p>

          {/* Episodes Grid */}
          {filteredEpisodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEpisodes.map((episode, index) => (
                <EpisodeCard key={episode.id} episode={episode} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Aucun épisode trouvé
              </h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Tous");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
