import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Ban,
  Edit2,
  Mail,
  MoreHorizontal,
  UserCheck,
  UserX,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const mockUsers = [
  {
    id: "1",
    pseudo: "WhisperingSoul_23",
    email: "user1@example.com",
    gender: "female",
    status: "active",
    createdAt: "15 Nov 2024",
    commentsCount: 12,
    favoritesCount: 5,
  },
  {
    id: "2",
    pseudo: "SilentRiver_blue",
    email: "user2@example.com",
    gender: "male",
    status: "active",
    createdAt: "10 Nov 2024",
    commentsCount: 8,
    favoritesCount: 3,
  },
  {
    id: "3",
    pseudo: "NightBloom_xx",
    email: "user3@example.com",
    gender: "other",
    status: "active",
    createdAt: "5 Nov 2024",
    commentsCount: 24,
    favoritesCount: 12,
  },
  {
    id: "4",
    pseudo: "CloudWalker_42",
    email: "user4@example.com",
    gender: "male",
    status: "banned",
    createdAt: "1 Nov 2024",
    commentsCount: 2,
    favoritesCount: 0,
  },
];

export default function AdminUsers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.pseudo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleBan = (id: string) => {
    toast({ title: "Utilisateur banni", variant: "destructive" });
  };

  const handleUnban = (id: string) => {
    toast({ title: "Utilisateur débanni" });
  };

  return (
    <AdminLayout title="Utilisateurs" description="Gérez les membres de la communauté">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par pseudo ou email..."
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
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="banned">Bannis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{mockUsers.length}</p>
            <p className="text-xs text-muted-foreground">Total utilisateurs</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {mockUsers.filter((u) => u.status === "active").length}
            </p>
            <p className="text-xs text-muted-foreground">Actifs</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">
              {mockUsers.filter((u) => u.status === "banned").length}
            </p>
            <p className="text-xs text-muted-foreground">Bannis</p>
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
                <th className="text-left p-4 text-sm font-semibold hidden md:table-cell">Email</th>
                <th className="text-left p-4 text-sm font-semibold hidden sm:table-cell">Activité</th>
                <th className="text-left p-4 text-sm font-semibold">Statut</th>
                <th className="text-right p-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
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
                        <p className="text-xs text-muted-foreground">
                          Inscrit le {user.createdAt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {user.commentsCount} commentaires
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-primary/20 text-primary"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {user.status === "active" ? (
                        <UserCheck className="w-3 h-3" />
                      ) : (
                        <UserX className="w-3 h-3" />
                      )}
                      {user.status === "active" ? "Actif" : "Banni"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Modifier pseudo
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Envoyer un email
                          </DropdownMenuItem>
                          {user.status === "active" ? (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleBan(user.id)}
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Bannir
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-primary"
                              onClick={() => handleUnban(user.id)}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Débannir
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
        </div>
      )}
    </AdminLayout>
  );
}
