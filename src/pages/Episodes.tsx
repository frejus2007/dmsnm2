import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EpisodeCard } from "@/components/EpisodeCard";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  "Tous",
  "Santé mentale",
  "Relations",
  "Développement personnel",
  "Deuil",
  "Famille",
  "Travail",
  "Général",
];

interface Episode {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  duration: string | null;
  category: string;
  spotify_url: string;
}

export default function Episodes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [showFilters, setShowFilters] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      const { data, error } = await supabase
        .from("episodes")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setEpisodes(data);
      }
      setIsLoading(false);
    };

    fetchEpisodes();
  }, []);

  const filteredEpisodes = episodes.filter((episode) => {
    const matchesSearch =
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (episode.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
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
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredEpisodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEpisodes.map((episode, index) => (
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
                />
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
