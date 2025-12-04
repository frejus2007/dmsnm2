import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Trash2,
  Flag,
  Check,
  MessageSquare,
  User,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const mockComments = [
  {
    id: "1",
    pseudo: "WhisperingSoul_23",
    content: "Cet épisode m'a vraiment touché. Merci pour ces mots réconfortants. 💚",
    episode: "Apprendre à s'accepter",
    createdAt: "Il y a 2 heures",
    status: "approved",
  },
  {
    id: "2",
    pseudo: "SilentRiver_blue",
    content: "Je ne savais pas que d'autres personnes ressentaient la même chose. Ça fait du bien.",
    episode: "Gérer l'anxiété au quotidien",
    createdAt: "Il y a 5 heures",
    status: "pending",
  },
  {
    id: "3",
    pseudo: "NightBloom_xx",
    content: "Les techniques partagées m'ont vraiment aidé à prendre du recul. Merci infiniment.",
    episode: "Les relations toxiques",
    createdAt: "Il y a 1 jour",
    status: "approved",
  },
  {
    id: "4",
    pseudo: "CloudWalker_42",
    content: "Spam content test",
    episode: "Apprendre à s'accepter",
    createdAt: "Il y a 2 jours",
    status: "flagged",
  },
];

export default function AdminComments() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredComments = mockComments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.pseudo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || comment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    toast({ title: "Commentaire approuvé" });
  };

  const handleDelete = (id: string) => {
    toast({ title: "Commentaire supprimé", variant: "destructive" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-primary/20 text-primary";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "flagged":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé";
      case "pending":
        return "En attente";
      case "flagged":
        return "Signalé";
      default:
        return status;
    }
  };

  return (
    <AdminLayout title="Commentaires" description="Modérez les commentaires de la communauté">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un commentaire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvés</SelectItem>
            <SelectItem value="flagged">Signalés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", count: mockComments.length, color: "text-foreground" },
          { label: "En attente", count: mockComments.filter((c) => c.status === "pending").length, color: "text-yellow-500" },
          { label: "Approuvés", count: mockComments.filter((c) => c.status === "approved").length, color: "text-primary" },
          { label: "Signalés", count: mockComments.filter((c) => c.status === "flagged").length, color: "text-destructive" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-card border-border hover:bg-accent/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {comment.pseudo.charAt(0)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{comment.pseudo}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                        {getStatusLabel(comment.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {comment.episode}
                      </span>
                      <span>{comment.createdAt}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {comment.status !== "approved" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary"
                        onClick={() => handleApprove(comment.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {comment.status !== "flagged" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-500">
                        <Flag className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(comment.id)}
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

      {filteredComments.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucun commentaire trouvé</p>
        </div>
      )}
    </AdminLayout>
  );
}
