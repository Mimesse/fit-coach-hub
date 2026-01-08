import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Save, MapPin, Phone, DollarSign, Tag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  specialties: string[] | null;
  price_per_session: number | null;
  location: string | null;
  phone: string | null;
  cref: string | null;
}

const TrainerProfile = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    avatar_url: null,
    bio: null,
    specialties: null,
    price_per_session: null,
    location: null,
    phone: null,
    cref: null,
  });
  const [specialtiesInput, setSpecialtiesInput] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    
    if (!authLoading && userRole && userRole !== "trainer") {
      navigate("/");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, userRole, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data && !error) {
      setProfile({
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        bio: data.bio,
        specialties: data.specialties,
        price_per_session: data.price_per_session,
        location: data.location,
        phone: data.phone,
        cref: data.cref,
      });
      setSpecialtiesInput(data.specialties?.join(", ") || "");
    }
    
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao fazer upload da imagem",
      });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    setProfile({ ...profile, avatar_url: urlData.publicUrl });
    setUploading(false);
    
    toast({
      title: "Sucesso",
      description: "Imagem carregada com sucesso!",
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);

    const specialtiesArray = specialtiesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        specialties: specialtiesArray.length > 0 ? specialtiesArray : null,
        price_per_session: profile.price_per_session,
        location: profile.location,
        phone: profile.phone,
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar perfil",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground">Configure seu perfil de trainer</p>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-muted border-4 border-primary/20 overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                  {profile.full_name?.[0]?.toUpperCase() || "T"}
                </div>
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-primary-foreground" />
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Clique no ícone para alterar sua foto
          </p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          {/* CREF (read only) */}
          {profile.cref && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                CREF
              </Label>
              <Input value={profile.cref} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                O CREF não pode ser alterado
              </p>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="Seu nome completo"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Sobre mim</Label>
            <Textarea
              id="bio"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Conte um pouco sobre você, sua experiência e metodologia de treino..."
              rows={4}
            />
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <Label htmlFor="specialties" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Especialidades
            </Label>
            <Input
              id="specialties"
              value={specialtiesInput}
              onChange={(e) => setSpecialtiesInput(e.target.value)}
              placeholder="Musculação, Crossfit, Funcional, Yoga..."
            />
            <p className="text-xs text-muted-foreground">
              Separe as especialidades por vírgula
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Valor por Sessão (R$)
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="10"
              value={profile.price_per_session || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  price_per_session: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="150"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Localização
            </Label>
            <Input
              id="location"
              value={profile.location || ""}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="São Paulo, SP"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefone / WhatsApp
            </Label>
            <Input
              id="phone"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
