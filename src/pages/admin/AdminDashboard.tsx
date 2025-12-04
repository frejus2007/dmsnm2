import { motion } from "framer-motion";
import {
  Users,
  Mic,
  MessageSquare,
  Mail,
  TrendingUp,
  Eye,
  Heart,
  Clock,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Utilisateurs",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "Épisodes",
    value: "24",
    change: "+2",
    icon: Mic,
    color: "text-blue-400",
  },
  {
    title: "Commentaires",
    value: "847",
    change: "+45",
    icon: MessageSquare,
    color: "text-purple-400",
  },
  {
    title: "Demandes",
    value: "18",
    change: "5 nouvelles",
    icon: Mail,
    color: "text-orange-400",
  },
];

const recentActivity = [
  {
    type: "comment",
    user: "WhisperingSoul_23",
    action: 'a commenté "Apprendre à s\'accepter"',
    time: "Il y a 5 min",
  },
  {
    type: "signup",
    user: "NightBloom_xx",
    action: "s'est inscrit",
    time: "Il y a 15 min",
  },
  {
    type: "participation",
    user: "Anonyme",
    action: "a envoyé une demande de participation",
    time: "Il y a 1h",
  },
  {
    type: "comment",
    user: "SilentRiver_blue",
    action: 'a réagi à un commentaire',
    time: "Il y a 2h",
  },
];

const topEpisodes = [
  { title: "Gérer l'anxiété au quotidien", views: 1234, comments: 42 },
  { title: "Les relations toxiques", views: 987, comments: 67 },
  { title: "Apprendre à s'accepter", views: 876, comments: 24 },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard" description="Vue d'ensemble de votre podcast">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
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
                  <span className="text-xs text-primary font-medium">{stat.change}</span>
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
                {recentActivity.map((activity, index) => (
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
                ))}
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
                {topEpisodes.map((episode, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{episode.title}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {episode.views}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {episode.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
