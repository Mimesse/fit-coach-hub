import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      
      {/* Red Glow Effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in">
            TRANSFORME SEU
            <span className="block text-gradient">CORPO</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Encontre os melhores personal trainers da sua região. 
            Treinos personalizados, resultados reais.
          </p>

          {/* Search Box */}
          <div className="bg-card/80 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-card border border-border max-w-2xl mx-auto animate-scale-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Digite sua cidade ou bairro..."
                  className="w-full h-12 md:h-14 pl-12 pr-4 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
              <Button variant="hero" size="xl" className="gap-2">
                <Search className="w-5 h-5" />
                Buscar
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient">500+</div>
              <div className="text-sm text-muted-foreground">Trainers Ativos</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient">10K+</div>
              <div className="text-sm text-muted-foreground">Alunos Satisfeitos</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient">50+</div>
              <div className="text-sm text-muted-foreground">Cidades</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
