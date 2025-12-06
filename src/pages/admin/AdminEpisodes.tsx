import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Play,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Loader2,
  Mic,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  "Général",
  "Santé mentale",
  "Relations",
  "Développement personnel",
  "Deuil",
  "Famille",
  "Travail",
];

interface Episode {
  id: string;
  title: string;
  description: string | null;
  category: string;
  spotify_url: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

export default function AdminEpisodes() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [spotifyLink, setSpotifyLink] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeDescription, setEpisodeDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from("episodes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEpisodes(data || []);
    } catch (error) {
      console.error("Error fetching episodes:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les épisodes",
        variant: "destructive",
      });
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleAddEpisode = async () => {
    if (!spotifyLink || !episodeTitle) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le lien Spotify et le titre",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Extract spotify_id from URL if possible
      const spotifyIdMatch = spotifyLink.match(/episode\/([a-zA-Z0-9]+)/);
      const spotifyId = spotifyIdMatch ? spotifyIdMatch[1] : null;

      const { data, error } = await supabase
        .from("episodes")
        .insert({
          title: episodeTitle,
          description: episodeDescription || null,
          spotify_url: spotifyLink,
          spotify_id: spotifyId,
          category: selectedCategory || "Général",
          published: false,
        })
        .select()
        .single();

      if (error) throw error;

      setEpisodes([data, ...episodes]);
      setIsDialogOpen(false);
      setSpotifyLink("");
      setEpisodeTitle("");
      setEpisodeDescription("");
      setSelectedCategory("");

      toast({
        title: "Épisode ajouté !",
        description: "L'épisode a été créé avec succès.",
      });
    } catch (error) {
      console.error("Error adding episode:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'épisode",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePublish = async (episode: Episode) => {
    try {
      const { error } = await supabase
        .from("episodes")
        .update({ published: !episode.published })
        .eq("id", episode.id);

      if (error) throw error;

      setEpisodes(episodes.map(e => 
        e.id === episode.id ? { ...e, published: !e.published } : e
      ));

      toast({
        title: episode.published ? "Épisode dépublié" : "Épisode publié",
      });
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'épisode",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("episodes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEpisodes(episodes.filter(e => e.id !== id));
      toast({
        title: "Épisode supprimé",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting episode:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'épisode",
        variant: "destructive",
      });
    }
  };

  const filteredEpisodes = episodes.filter((ep) =>
    ep.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isPageLoading) {
    return (
      <AdminLayout title="Épisodes" description="Gérez vos épisodes du podcast">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Épisodes" description="Gérez vos épisodes du podcast">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un épisode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="spotify">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un épisode
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Ajouter un épisode</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="episode-title">Titre de l'épisode</Label>
                <Input
                  id="episode-title"
                  placeholder="Titre de l'épisode"
                  value={episodeTitle}
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="episode-description">Description (optionnel)</Label>
                <Input
                  id="episode-description"
                  placeholder="Description de l'épisode"
                  value={episodeDescription}
                  onChange={(e) => setEpisodeDescription(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="spotify-link">Lien Spotify de l'épisode</Label>
                <div className="relative mt-2">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="spotify-link"
                    placeholder="https://open.spotify.com/episode/..."
                    value={spotifyLink}
                    onChange={(e) => setSpotifyLink(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label>Catégorie</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="spotify"
                className="w-full"
                onClick={handleAddEpisode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Ajout en cours...
                  </span>
                ) : (
                  "Ajouter l'épisode"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Episodes List */}
      <div className="space-y-4">
        {filteredEpisodes.map((episode, index) => (
          <motion.div
            key={episode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-card border-border hover:bg-accent/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-accent flex items-center justify-center">
                    {episode.image_url ? (
                      <img
                        src={episode.image_url}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Mic className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-1">
                          {episode.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {episode.description || "Aucune description"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            episode.published
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {episode.published ? "Publié" : "Brouillon"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded">
                        {episode.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(episode.spotify_url, "_blank")}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleTogglePublish(episode)}
                    >
                      {episode.published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(episode.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredEpisodes.length === 0 && (
        <div className="text-center py-12">
          <Mic className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucun épisode trouvé</p>
        </div>
      )}
    </AdminLayout>
  );
}
