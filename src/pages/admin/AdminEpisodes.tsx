import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreHorizontal,
  Play,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Link as LinkIcon,
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

const categories = [
  "Santé mentale",
  "Relations",
  "Développement personnel",
  "Deuil",
  "Famille",
  "Travail",
];

const mockEpisodes = [
  {
    id: "1",
    title: "Apprendre à s'accepter : le chemin vers l'amour de soi",
    description: "Dans cet épisode, nous explorons les étapes essentielles...",
    category: "Développement personnel",
    spotifyUrl: "https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk",
    published: true,
    views: 876,
    comments: 24,
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=200",
  },
  {
    id: "2",
    title: "Gérer l'anxiété au quotidien",
    description: "Des techniques concrètes pour apprivoiser l'anxiété...",
    category: "Santé mentale",
    spotifyUrl: "https://open.spotify.com/episode/example2",
    published: true,
    views: 1234,
    comments: 42,
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200",
  },
  {
    id: "3",
    title: "Les relations toxiques",
    description: "Identifier les signes d'une relation toxique...",
    category: "Relations",
    spotifyUrl: "https://open.spotify.com/episode/example3",
    published: false,
    views: 0,
    comments: 0,
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200",
  },
];

export default function AdminEpisodes() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [spotifyLink, setSpotifyLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddEpisode = async () => {
    if (!spotifyLink) {
      toast({
        title: "Erreur",
        description: "Veuillez coller un lien Spotify",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsDialogOpen(false);
    setSpotifyLink("");
    setSelectedCategory("");

    toast({
      title: "Épisode ajouté !",
      description: "Les métadonnées ont été extraites automatiquement.",
    });
  };

  const filteredEpisodes = mockEpisodes.filter((ep) =>
    ep.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <DialogTitle>Ajouter un épisode Spotify</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
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
                <p className="text-xs text-muted-foreground mt-2">
                  Le titre, la description et l'image seront extraits automatiquement
                </p>
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
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Extraction en cours...
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
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card border-border hover:bg-accent/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-accent">
                    <img
                      src={episode.image}
                      alt={episode.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-1">
                          {episode.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {episode.description}
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
                      <span className="text-xs text-muted-foreground">
                        {episode.views} vues
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {episode.comments} commentaires
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {episode.published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
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
          <p className="text-muted-foreground">Aucun épisode trouvé</p>
        </div>
      )}
    </AdminLayout>
  );
}
