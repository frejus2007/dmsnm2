import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

// Mock episode data
const episodeData = {
  id: "1",
  title: "Apprendre à s'accepter : le chemin vers l'amour de soi",
  description:
    "Dans cet épisode profond et bienveillant, nous explorons les étapes essentielles pour développer une relation saine avec soi-même et cultiver l'acceptation. Nous abordons les obstacles courants, les croyances limitantes et partageons des outils concrets pour commencer ce chemin de guérison.",
  image:
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop",
  duration: "45 min",
  category: "Développement personnel",
  spotifyId: "4rOoJ6Egrf8K2IrywzwOMk",
  publishedAt: "15 novembre 2024",
  commentCount: 24,
};

// Mock comments
const mockComments = [
  {
    id: "1",
    pseudo: "WhisperingSoul_23",
    content:
      "Cet épisode m'a vraiment touché. Merci pour ces mots réconfortants. 💚",
    createdAt: "Il y a 2 jours",
    likes: 12,
  },
  {
    id: "2",
    pseudo: "SilentRiver_blue",
    content:
      "Je ne savais pas que d'autres personnes ressentaient la même chose que moi. Ça fait du bien de ne pas se sentir seul.",
    createdAt: "Il y a 3 jours",
    likes: 8,
  },
  {
    id: "3",
    pseudo: "NightBloom_xx",
    content:
      "Les techniques partagées dans cet épisode m'ont vraiment aidé à prendre du recul sur ma situation. Merci infiniment.",
    createdAt: "Il y a 5 jours",
    likes: 15,
  },
];

export default function EpisodeDetail() {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoggedIn] = useState(false); // Mock auth state

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    // Handle comment submission
    console.log("Comment submitted:", comment);
    setComment("");
  };

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
                    src={episodeData.image}
                    alt={episodeData.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-lavender/90 backdrop-blur-sm rounded-full text-sm font-medium">
                    {episodeData.category}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  {episodeData.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {episodeData.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {episodeData.publishedAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {episodeData.commentCount} commentaires
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {episodeData.description}
                </p>
              </motion.div>

              {/* Spotify Player */}
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
                    src={`https://open.spotify.com/embed/episode/${episodeData.spotifyId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="232"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-8"
              >
                <Button
                  variant={isFavorite ? "spotify" : "outline"}
                  onClick={() => setIsFavorite(!isFavorite)}
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
                  {isLoggedIn ? (
                    <div>
                      <Textarea
                        placeholder="Partagez votre ressenti en toute confidentialité..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mb-4 min-h-[100px]"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Votre commentaire sera signé avec votre pseudo anonyme
                        </p>
                        <Button onClick={handleSubmitComment}>
                          <Send className="w-4 h-4 mr-2" />
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
                  {mockComments.map((commentItem, index) => (
                    <motion.div
                      key={commentItem.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-card rounded-xl p-5 border border-border"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hope to-lavender flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary-foreground">
                              {commentItem.pseudo.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {commentItem.pseudo}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {commentItem.createdAt}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {commentItem.content}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-xs">{commentItem.likes}</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
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
                  <h3 className="font-semibold mb-4">Épisodes similaires</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Gérer l'anxiété au quotidien",
                        duration: "38 min",
                      },
                      {
                        title: "L'art de dire non sans culpabiliser",
                        duration: "36 min",
                      },
                      {
                        title: "La charge mentale : reconnaître et alléger",
                        duration: "41 min",
                      },
                    ].map((ep, i) => (
                      <Link
                        key={i}
                        to={`/episode/${i + 2}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">
                            {ep.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ep.duration}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
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
