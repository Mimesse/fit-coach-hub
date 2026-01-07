import { Search, UserCheck, Dumbbell, Trophy } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Busque",
    description: "Encontre personal trainers na sua região usando nosso sistema de busca avançado",
  },
  {
    icon: UserCheck,
    title: "Escolha",
    description: "Compare perfis, avaliações, especialidades e valores para encontrar o trainer ideal",
  },
  {
    icon: Dumbbell,
    title: "Treine",
    description: "Agende suas sessões e receba treinos personalizados para seus objetivos",
  },
  {
    icon: Trophy,
    title: "Evolua",
    description: "Acompanhe sua evolução e conquiste resultados que você nunca imaginou",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            COMO <span className="text-gradient">FUNCIONA</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Em apenas 4 passos simples você estará treinando com o personal trainer perfeito para você
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="text-center">
                {/* Step Number */}
                <div className="text-6xl font-display font-bold text-primary/20 mb-4">
                  0{index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                
                {/* Content */}
                <h3 className="font-display text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
