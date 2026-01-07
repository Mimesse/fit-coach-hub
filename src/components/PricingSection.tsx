import { Check, Zap, Video, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  { icon: Users, text: "Perfil profissional completo" },
  { icon: Video, text: "Postar vídeos e dicas" },
  { icon: BarChart3, text: "Montagem de treinos personalizados" },
  { icon: Zap, text: "Destaque nas buscas" },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            SEJA UM <span className="text-gradient">TRAINER</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expanda sua clientela e gerencie seus treinos em uma única plataforma profissional
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Card className="relative overflow-hidden border-primary/50 shadow-glow">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-gradient-hero text-primary-foreground px-6 py-2 font-display font-bold tracking-wider">
              PLANO ÚNICO
            </div>
            
            <CardHeader className="text-center pt-12 pb-6">
              <CardTitle className="font-display text-3xl">Trainer Pro</CardTitle>
              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-muted-foreground text-lg">R$</span>
                  <span className="font-display text-6xl md:text-7xl font-bold text-gradient">29</span>
                  <span className="text-muted-foreground text-lg">,90/mês</span>
                </div>
                <p className="text-muted-foreground mt-2">Cobrado mensalmente</p>
              </div>
            </CardHeader>

            <CardContent className="pb-10">
              <ul className="space-y-4 mb-8">
                {features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span>{feature.text}</span>
                  </li>
                ))}
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span>Comentários e interação com alunos</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span>Sem taxas sobre agendamentos</span>
                </li>
              </ul>

              <Button variant="hero" size="xl" className="w-full">
                Começar Agora
              </Button>
              
              <p className="text-center text-sm text-muted-foreground mt-4">
                Cancele quando quiser. Sem compromisso.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
