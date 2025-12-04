import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Shield, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

export default function Participer() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.reason) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir au moins le sujet et votre motivation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-hope/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-hope" />
            </div>
            <h1 className="text-2xl font-bold mb-4">
              Merci pour votre participation !
            </h1>
            <p className="text-muted-foreground mb-6">
              Votre demande a bien été envoyée. Nous reviendrons vers vous très
              prochainement pour discuter de votre participation.
            </p>
            <Button variant="spotify" onClick={() => setIsSubmitted(false)}>
              Envoyer une autre demande
            </Button>
          </motion.div>
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
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-medium mb-4">
                <Heart className="w-4 h-4 text-hope" />
                Votre voix compte
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Participez au podcast
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Vous avez une histoire à partager ? Un sujet qui vous tient à
                cœur ? Proposez votre participation et faisons entendre votre
                voix ensemble.
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 md:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Anonymous toggle */}
                <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-xl">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) =>
                      setIsAnonymous(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="anonymous"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Envoyer ma demande anonymement
                  </Label>
                </div>

                {!isAnonymous && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nom ou prénom (facultatif)</Label>
                      <Input
                        id="name"
                        placeholder="Comment souhaitez-vous être appelé(e) ?"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email (facultatif)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Pour vous recontacter"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="subject">
                    Sujet que vous souhaitez aborder *
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Ex: La reconstruction après une rupture"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="reason">
                    Pourquoi souhaitez-vous participer ? *
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Partagez votre motivation, votre histoire, ce que vous aimeriez apporter..."
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="mt-2 min-h-[150px]"
                  />
                </div>

                {/* Privacy notice */}
                <div className="flex items-start gap-3 p-4 bg-hope/10 rounded-xl">
                  <Shield className="w-5 h-5 text-hope mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-1 text-hope">
                      Nous garantissons votre anonymat
                    </p>
                    <p className="text-muted-foreground">
                      Vos informations personnelles ne seront jamais partagées
                      publiquement. Vous pouvez participer sous pseudonyme ou
                      avec votre voix modifiée si vous le souhaitez.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="spotify"
                  size="xl"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Envoyer ma demande
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <h2 className="text-xl font-semibold mb-6">
                Questions fréquentes
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Mon identité sera-t-elle révélée ?",
                    a: "Jamais. Vous pouvez participer sous pseudonyme, avec votre voix modifiée, ou de manière totalement anonyme.",
                  },
                  {
                    q: "Comment se déroule un enregistrement ?",
                    a: "Nous organisons d'abord un appel pour faire connaissance et discuter du sujet. L'enregistrement se fait ensuite dans un cadre bienveillant.",
                  },
                  {
                    q: "Puis-je me rétracter après l'enregistrement ?",
                    a: "Absolument. Vous avez un droit de regard total sur votre épisode et pouvez demander à ce qu'il ne soit pas publié.",
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-5 border border-border"
                  >
                    <h3 className="font-medium mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
