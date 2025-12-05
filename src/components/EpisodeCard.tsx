import { motion } from "framer-motion";
import { Play, Heart, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Episode {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  category: string;
  spotifyUrl: string;
  commentCount: number;
}

interface EpisodeCardProps {
  episode: Episode;
  index?: number;
  variant?: "default" | "featured";
}

export function EpisodeCard({ episode, index = 0, variant = "default" }: EpisodeCardProps) {
  const isFeatured = variant === "featured";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500",
        isFeatured && "md:col-span-2 md:row-span-2"
      )}
    >
      <Link to={`/episode/${episode.id}`} className="block">
        {/* Image */}
        <div className={cn(
          "relative overflow-hidden",
          isFeatured ? "aspect-[16/9]" : "aspect-square"
        )}>
          <motion.img
            src={episode.image}
            alt={episode.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-xl"
            >
              <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
            </motion.div>
          </div>

          {/* Category Badge */}
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="absolute top-4 left-4 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary-foreground"
          >
            {episode.category}
          </motion.span>

          {/* Duration */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{episode.duration}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className={cn(
            "font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300",
            isFeatured ? "text-xl" : "text-base"
          )}>
            {episode.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {episode.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{episode.commentCount} commentaires</span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add to favorites logic
              }}
              aria-label="Ajouter aux favoris"
            >
              <Heart className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
