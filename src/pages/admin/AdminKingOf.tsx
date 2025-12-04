import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Image, Quote, Crown } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminKingOf() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    tagline: "La marque",
    title: "KingOf",
    description:
      "KingOf est bien plus qu'une marque. C'est un mouvement qui célèbre l'authenticité, la résilience et le courage d'être soi-même. Chaque personne est le roi ou la reine de sa propre histoire.",
    quote: "Tu es le roi ou la reine de ta propre histoire. N'oublie jamais ça.",
    instagramUrl: "https://instagram.com/kingof",
    twitterUrl: "https://twitter.com/kingof",
    shopComingSoon: true,
    shopEmailCapture: true,
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Modifications enregistrées",
      description: "Les informations KingOf ont été mises à jour.",
    });
  };

  return (
    <AdminLayout title="KingOf" description="Gérez la section de votre marque">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Edit Form */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tagline</Label>
                  <Input
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    className="mt-2"
                    placeholder="Ex: La marque"
                  />
                </div>
                <div>
                  <Label>Titre</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-2"
                    placeholder="Ex: KingOf"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-2 min-h-[120px]"
                    placeholder="Description de la marque..."
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Quote className="w-5 h-5 text-primary" />
                  Citation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.quote}
                  onChange={(e) =>
                    setFormData({ ...formData, quote: e.target.value })
                  }
                  className="min-h-[80px]"
                  placeholder="Votre citation inspirante..."
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Réseaux sociaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Instagram</Label>
                  <Input
                    value={formData.instagramUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, instagramUrl: e.target.value })
                    }
                    className="mt-2"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <Label>Twitter</Label>
                  <Input
                    value={formData.twitterUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, twitterUrl: e.target.value })
                    }
                    className="mt-2"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary" />
                  Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Image principale</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Cliquez pour uploader une image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG jusqu'à 5MB
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Galerie (4 images max)</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="aspect-[3/4] border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Button
            variant="spotify"
            size="lg"
            className="w-full"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Enregistrement...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block"
        >
          <Card className="bg-card border-border sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-xl p-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-medium mb-4">
                  <Crown className="w-3 h-3" />
                  {formData.tagline}
                </span>
                <h2 className="text-2xl font-bold mb-3">
                  King
                  <span className="text-primary">Of</span>
                </h2>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {formData.description}
                </p>
                <blockquote className="border-l-2 border-primary pl-4 italic text-sm text-muted-foreground">
                  "{formData.quote}"
                </blockquote>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
