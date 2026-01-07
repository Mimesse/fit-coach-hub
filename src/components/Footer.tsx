import { Dumbbell, Instagram, Youtube, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center shadow-glow">
                <Dumbbell className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                My<span className="text-gradient">Personal</span>Trainer
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              A maior plataforma de personal trainers do Brasil. Transforme sua vida com profissionais qualificados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Para Alunos</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Buscar Trainers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Avaliações</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Dúvidas Frequentes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4">Para Trainers</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cadastrar Perfil</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Planos e Preços</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4">Empresa</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contato</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacidade</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>© 2025 MyPersonalTrainer. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
