import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Users as UsersIcon,
  Loader2,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface User {
  id: string;
  pseudo: string;
  gender: string;
  created_at: string;
  commentsCount: number;
  favoritesCount: number;
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, pseudo, gender, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch comment and favorite counts for each user
      const usersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          const [{ count: commentsCount }, { count: favoritesCount }] = await Promise.all([
            supabase
              .from("comments")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id),
            supabase
              .from("favorites")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id),
          ]);

          return {
            id: profile.id,
            pseudo: profile.pseudo,
            gender: profile.gender,
            created_at: profile.created_at,
            commentsCount: commentsCount || 0,
            favoritesCount: favoritesCount || 0,
          };
        })
      );

      setUsers(usersWithStats);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.pseudo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = filterGender === "all" || user.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "male":
        return "Homme";
      case "female":
        return "Femme";
      case "other":
        return "Autre";
      default:
        return gender;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Utilisateurs" description="Gérez les membres de la communauté">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Utilisateurs" description="Gérez les membres de la communauté">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par pseudo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterGender} onValueChange={setFilterGender}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrer par genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="male">Hommes</SelectItem>
            <SelectItem value="female">Femmes</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total utilisateurs</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-pink-400">
              {users.filter((u) => u.gender === "female").length}
            </p>
            <p className="text-xs text-muted-foreground">Femmes</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {users.filter((u) => u.gender === "male").length}
            </p>
            <p className="text-xs text-muted-foreground">Hommes</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">
              {users.filter((u) => u.gender === "other").length}
            </p>
            <p className="text-xs text-muted-foreground">Autre</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold">Utilisateur</th>
                <th className="text-left p-4 text-sm font-semibold hidden sm:table-cell">Genre</th>
                <th className="text-left p-4 text-sm font-semibold hidden md:table-cell">Activité</th>
                <th className="text-left p-4 text-sm font-semibold">Inscription</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t border-border hover:bg-accent/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {user.pseudo.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{user.pseudo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {getGenderLabel(user.gender)}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="text-sm text-muted-foreground">
                      <span>{user.commentsCount} commentaires</span>
                      <span className="mx-2">•</span>
                      <span>{user.favoritesCount} favoris</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: fr })}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
        </div>
      )}
    </AdminLayout>
  );
}
