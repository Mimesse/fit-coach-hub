import { Star, MapPin, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrainerCardProps {
  name: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  specialties: string[];
  pricePerSession: number;
  verified: boolean;
}

const TrainerCard = ({
  name,
  image,
  location,
  rating,
  reviews,
  specialties,
  pricePerSession,
  verified,
}: TrainerCardProps) => {
  return (
    <Card className="overflow-hidden group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Verified Badge */}
        {verified && (
          <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span className="text-xs font-semibold">Verificado</span>
          </div>
        )}
        
        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-xl px-4 py-2">
          <div className="text-xs text-muted-foreground">A partir de</div>
          <div className="font-display text-xl font-bold text-gradient">
            R${pricePerSession}
            <span className="text-sm text-muted-foreground font-normal">/aula</span>
          </div>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Name & Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-display text-xl font-bold">{name}</h3>
          <div className="flex items-center gap-1 bg-secondary rounded-lg px-2 py-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-5">
          {specialties.slice(0, 3).map((specialty) => (
            <span
              key={specialty}
              className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <Button variant="outline" className="w-full">
          Ver Perfil
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrainerCard;
