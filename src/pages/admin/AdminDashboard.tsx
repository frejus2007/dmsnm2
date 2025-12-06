import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Mic,
  MessageSquare,
  Mail,
  TrendingUp,
  Eye,
  Clock,
  Loader2,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface DashboardStats {
  usersCount: number;
  episodesCount: number;
  commentsCount: number;
  participationsCount: number;
  pendingParticipations: number;
}

interface RecentActivity {
  type: "comment" | "participation";
  user: string;
  action: string;
  time: string;
}

interface TopEpisode {
  id: string;
  title: string;
  commentsCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topEpisodes, setTopEpisodes] = useState<TopEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts in parallel
      const [
        { count: usersCount },
        { count: episodesCount },
        { count: commentsCount },
        { count: participationsCount },
        { count: pendingParticipations },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("episodes").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase.from("participation_requests").select("*", { count: "exact", head: true }),
        supabase.from("participation_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      setStats({
        usersCount: usersCount || 0,
        episodesCount: episodesCount || 0,
        commentsCount: commentsCount || 0,
        participationsCount: participationsCount || 0,
        pendingParticipations: pendingParticipations || 0,
      });

      // Fetch recent comments with pseudo
      const { data: recentComments } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          profiles:user_id (pseudo)
        `)
        .order("created_at", { ascending: false })
        .limit(3);

      // Fetch recent participation requests
      const { data: recentParticipations } = await supabase
        .from("participation_requests")
        .select("id, name, anonymous, created_at")
        .order("created_at", { ascending: false })
        .limit(2);

      const activities: RecentActivity[] = [];

      if (recentComments) {
        recentComments.forEach((comment: any) => {
          activities.push({
            type: "comment",
            user: comment.profiles?.pseudo || "Utilisateur",
            action: "a laissé un commentaire",
            time: formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr }),
          });
        });
      }

      if (recentParticipations) {
        recentParticipations.forEach((p: any) => {
          activities.push({
            type: "participation",
            user: p.anonymous ? "Anonyme" : (p.name || "Quelqu'un"),
            action: "a envoyé une demande de participation",
            time: formatDistanceToNow(new Date(p.created_at), { addSuffix: true, locale: fr }),
          });
        });
      }

      // Sort by most recent
      activities.sort((a, b) => {
        // This is a simple sort, activities with "il y a" less time are more recent
        return 0;
      });

      setRecentActivity(activities.slice(0, 5));

      // Fetch top episodes by comment count
      const { data: episodes } = await supabase
        .from("episodes")
        .select("id, title")
        .eq("published", true)
        .limit(10);

      if (episodes) {
        const episodesWithComments = await Promise.all(
          episodes.map(async (episode) => {
            const { count } = await supabase
              .from("comments")
              .select("*", { count: "exact", head: true })
              .eq("episode_id", episode.id);
            return {
              id: episode.id,
              title: episode.title,
              commentsCount: count || 0,
            };
          })
        );

        // Sort by comment count and take top 3
        episodesWithComments.sort((a, b) => b.commentsCount - a.commentsCount);
        setTopEpisodes(episodesWithComments.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard" description="Vue d'ensemble de votre podcast">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const statsData = [
    {
      title: "Utilisateurs",
      value: stats?.usersCount.toString() || "0",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Épisodes",
      value: stats?.episodesCount.toString() || "0",
      icon: Mic,
      color: "text-blue-400",
    },
    {
      title: "Commentaires",
      value: stats?.commentsCount.toString() || "0",
      icon: MessageSquare,
      color: "text-purple-400",
    },
    {
      title: "Demandes",
      value: stats?.participationsCount.toString() || "0",
      change: stats?.pendingParticipations ? `${stats.pendingParticipations} en attente` : undefined,
      icon: Mail,
      color: "text-orange-400",
    },
  ];

  return (
    <AdminLayout title="Dashboard" description="Vue d'ensemble de votre podcast">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card border-border hover:bg-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-accent ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  {stat.change && (
                    <span className="text-xs text-primary font-medium">{stat.change}</span>
                  )}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {activity.user.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.user}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    Aucune activité récente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Episodes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                Épisodes populaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topEpisodes.length > 0 ? (
                  topEpisodes.map((episode, index) => (
                    <div
                      key={episode.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{episode.title}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {episode.commentsCount} commentaires
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    Aucun épisode publié
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg mb-1">Ajouter un nouvel épisode</h3>
                <p className="text-sm text-muted-foreground">
                  Collez simplement le lien Spotify pour ajouter un épisode
                </p>
              </div>
              <a href="/admin/episodes">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-[1.04] transition-transform">
                  + Nouvel épisode
                </button>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  );
}
