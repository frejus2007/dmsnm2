import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  Calendar,
  Send,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Episode {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  duration: string | null;
  category: string;
  spotify_url: string;
  spotify_id: string | null;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    pseudo: string;
  } | null;
}

export default function EpisodeDetail() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEpisode = async () => {
      if (!id) return;

      const { data: episodeData, error: episodeError } = await supabase
        .from("episodes")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .single();

      if (!episodeError && episodeData) {
        setEpisode(episodeData);
      }

      // Fetch approved comments
      const { data: commentsData } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          profiles:user_id (pseudo)
        `)
        .eq("episode_id", id)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (commentsData) {
        setComments(commentsData as Comment[]);
      }

      // Check if episode is in favorites
      if (user) {
        const { data: favoriteData } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("episode_id", id)
          .single();

        setIsFavorite(!!favoriteData);
      }

      setIsLoading(false);
    };

    fetchEpisode();
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user || !id) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter aux favoris",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("episode_id", id);
      setIsFavorite(false);
      toast({ title: "Retiré des favoris" });
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: user.id, episode_id: id });
      setIsFavorite(true);
      toast({ title: "Ajouté aux favoris" });
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim() || !user || !id) return;

    setIsSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      user_id: user.id,
      episode_id: id,
      content: comment.trim(),
      status: "pending",
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le commentaire",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Commentaire envoyé",
        description: "Votre commentaire sera visible après modération",
      });
      setComment("");
    }
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getSpotifyEmbedId = () => {
    if (episode?.spotify_id) return episode.spotify_id;
    // Extract ID from URL if spotify_id is not available
    const match = episode?.spotify_url.match(/episode\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Épisode non trouvé</h1>
            <Link to="/episodes">
              <Button>Retour aux épisodes</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link to="/episodes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux épisodes
              </Button>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Episode Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                  <img
                    src={episode.image_url || "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800"}
                    alt={episode.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-sm font-medium text-primary-foreground">
                    {episode.category}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  {episode.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  {episode.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {episode.duration}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(episode.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {comments.length} commentaire{comments.length > 1 ? "s" : ""}
                  </div>
                </div>

                {episode.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {episode.description}
                  </p>
                )}
              </motion.div>

              {/* Spotify Player */}
              {getSpotifyEmbedId() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <h2 className="text-lg font-semibold mb-4">Écouter l'épisode</h2>
                  <div className="rounded-2xl overflow-hidden">
                    <iframe
                      style={{ borderRadius: "12px" }}
                      src={`https://open.spotify.com/embed/episode/${getSpotifyEmbedId()}?utm_source=generator&theme=0`}
                      width="100%"
                      height="232"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-8"
              >
                <Button
                  variant={isFavorite ? "spotify" : "outline"}
                  onClick={handleToggleFavorite}
                >
                  <Heart
                    className={cn("w-4 h-4 mr-2", isFavorite && "fill-current")}
                  />
                  {isFavorite ? "Dans mes favoris" : "Ajouter aux favoris"}
                </Button>
                <Button variant="ghost">
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
              </motion.div>

              {/* Comments Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-6">
                  Commentaires anonymes
                </h2>

                {/* Comment Form */}
                <div className="bg-card rounded-2xl p-6 border border-border mb-6">
                  {user ? (
                    <div>
                      <Textarea
                        placeholder="Partagez votre ressenti en toute confidentialité..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mb-4 min-h-[100px]"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Votre commentaire sera signé : {profile?.pseudo}
                        </p>
                        <Button onClick={handleSubmitComment} disabled={isSubmitting || !comment.trim()}>
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          Envoyer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <User className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        Connectez-vous pour laisser un commentaire anonyme
                      </p>
                      <Link to="/auth">
                        <Button variant="spotify">Se connecter</Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length > 0 ? (
                    comments.map((commentItem, index) => (
                      <motion.div
                        key={commentItem.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="bg-card rounded-xl p-5 border border-border"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary-foreground">
                                {commentItem.profiles?.pseudo?.charAt(0) || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {commentItem.profiles?.pseudo || "Anonyme"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(commentItem.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {commentItem.content}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aucun commentaire pour le moment</p>
                      <p className="text-sm">Soyez le premier à partager votre ressenti</p>
                    </div>
                  )}
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24"
              >
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold mb-4">Écouter sur Spotify</h3>
                  <a
                    href={episode.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="spotify" className="w-full">
                      Ouvrir sur Spotify
                    </Button>
                  </a>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
