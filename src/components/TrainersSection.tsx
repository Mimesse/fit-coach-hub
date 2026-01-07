import { useState } from "react";
import TrainerCard from "@/components/TrainerCard";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown } from "lucide-react";

import trainer1 from "@/assets/trainer-1.jpg";
import trainer2 from "@/assets/trainer-2.jpg";
import trainer3 from "@/assets/trainer-3.jpg";
import trainer4 from "@/assets/trainer-4.jpg";

const trainers = [
  {
    id: 1,
    name: "Lucas Mendes",
    image: trainer1,
    location: "São Paulo, SP - Zona Sul",
    rating: 4.9,
    reviews: 127,
    specialties: ["Musculação", "Hipertrofia", "Emagrecimento"],
    pricePerSession: 120,
    verified: true,
  },
  {
    id: 2,
    name: "Camila Santos",
    image: trainer2,
    location: "São Paulo, SP - Centro",
    rating: 4.8,
    reviews: 89,
    specialties: ["Funcional", "Pilates", "Yoga"],
    pricePerSession: 100,
    verified: true,
  },
  {
    id: 3,
    name: "Rafael Costa",
    image: trainer3,
    location: "Rio de Janeiro, RJ - Copacabana",
    rating: 5.0,
    reviews: 156,
    specialties: ["CrossFit", "HIIT", "Condicionamento"],
    pricePerSession: 150,
    verified: true,
  },
  {
    id: 4,
    name: "Amanda Oliveira",
    image: trainer4,
    location: "Rio de Janeiro, RJ - Barra",
    rating: 4.7,
    reviews: 64,
    specialties: ["Musculação", "Bodybuilding", "Nutrição"],
    pricePerSession: 130,
    verified: false,
  },
];

const cities = ["Todas", "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba"];

const TrainersSection = () => {
  const [selectedCity, setSelectedCity] = useState("Todas");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTrainers = selectedCity === "Todas" 
    ? trainers 
    : trainers.filter(t => t.location.includes(selectedCity));

  return (
    <section id="trainers" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            ENCONTRE SEU <span className="text-gradient">TRAINER</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Profissionais qualificados prontos para transformar sua vida através do exercício físico
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {cities.map((city) => (
              <Button
                key={city}
                variant={selectedCity === city ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Mais Filtros
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-card rounded-xl p-6 mb-10 border border-border animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Especialidade</label>
                <select className="w-full h-10 px-4 rounded-lg bg-secondary border border-border text-foreground">
                  <option>Todas</option>
                  <option>Musculação</option>
                  <option>Funcional</option>
                  <option>CrossFit</option>
                  <option>Pilates</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Faixa de Preço</label>
                <select className="w-full h-10 px-4 rounded-lg bg-secondary border border-border text-foreground">
                  <option>Qualquer</option>
                  <option>Até R$100/aula</option>
                  <option>R$100 - R$150/aula</option>
                  <option>Acima de R$150/aula</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Avaliação Mínima</label>
                <select className="w-full h-10 px-4 rounded-lg bg-secondary border border-border text-foreground">
                  <option>Qualquer</option>
                  <option>4+ estrelas</option>
                  <option>4.5+ estrelas</option>
                  <option>5 estrelas</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTrainers.map((trainer, index) => (
            <div 
              key={trainer.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TrainerCard {...trainer} />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Ver Mais Trainers
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
