import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Check,
  X,
  Mail,
  Clock,
  User,
  Loader2,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Participation {
  id: string;
  name: string | null;
  email: string | null;
  subject: string;
  reason: string;
  anonymous: boolean;
  status: string;
  created_at: string;
}

export default function AdminParticipations() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedParticipation, setSelectedParticipation] = useState<Participation | null>(null);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
    try {
      const { data, error } = await supabase
        .from("participation_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setParticipations(data || []);
    } catch (error) {
      console.error("Error fetching participations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredParticipations = participations.filter((p) => {
    const matchesSearch =
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAccept = async (id: string) => {
    try {
      const { error } = await supabase
        .from("participation_requests")
        .update({ status: "accepted" })
        .eq("id", id);

      if (error) throw error;

      setParticipations(participations.map(p => 
        p.id === id ? { ...p, status: "accepted" } : p
      ));
      toast({ title: "Demande acceptée" });
      setSelectedParticipation(null);
    } catch (error) {
      console.error("Error accepting participation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("participation_requests")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) throw error;

      setParticipations(participations.map(p => 
        p.id === id ? { ...p, status: "rejected" } : p
      ));
      toast({ title: "Demande refusée", variant: "destructive" });
      setSelectedParticipation(null);
    } catch (error) {
      console.error("Error rejecting participation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de refuser la demande",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-primary/20 text-primary";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "rejected":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepté";
      case "pending":
        return "En attente";
      case "rejected":
        return "Refusé";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Participations" description="Gérez les demandes de participation au podcast">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Participations" description="Gérez les demandes de participation au podcast">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par sujet..."
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
            <SelectItem value="accepted">Acceptés</SelectItem>
            <SelectItem value="rejected">Refusés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", count: participations.length, color: "text-foreground" },
          { label: "En attente", count: participations.filter((p) => p.status === "pending").length, color: "text-yellow-500" },
          { label: "Acceptés", count: participations.filter((p) => p.status === "accepted").length, color: "text-primary" },
          { label: "Refusés", count: participations.filter((p) => p.status === "rejected").length, color: "text-destructive" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Participations List */}
      <div className="space-y-4">
        {filteredParticipations.map((participation, index) => (
          <motion.div
            key={participation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="bg-card border-border hover:bg-accent/30 transition-colors cursor-pointer"
              onClick={() => setSelectedParticipation(participation)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    {participation.anonymous ? (
                      <User className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <span className="text-sm font-bold text-primary">
                        {participation.name?.charAt(0) || "?"}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {participation.anonymous ? "Anonyme" : participation.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(participation.status)}`}>
                        {getStatusLabel(participation.status)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary mb-1">
                      {participation.subject}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {participation.reason}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(participation.created_at), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {participation.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(participation.id);
                        }}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(participation.id);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredParticipations.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune demande trouvée</p>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedParticipation} onOpenChange={() => setSelectedParticipation(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>Demande de participation</DialogTitle>
          </DialogHeader>
          {selectedParticipation && (
            <div className="space-y-4 pt-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Participant</p>
                <p className="font-semibold">
                  {selectedParticipation.anonymous ? "Anonyme" : selectedParticipation.name}
                </p>
              </div>
              {selectedParticipation.email && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p>{selectedParticipation.email}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sujet proposé</p>
                <p className="font-semibold text-primary">{selectedParticipation.subject}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Motivation</p>
                <p className="text-sm leading-relaxed">{selectedParticipation.reason}</p>
              </div>
              {selectedParticipation.status === "pending" && (
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="spotify"
                    className="flex-1"
                    onClick={() => handleAccept(selectedParticipation.id)}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accepter
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleReject(selectedParticipation.id)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Refuser
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
