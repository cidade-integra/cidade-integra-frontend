import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const CategoryCard = ({ icon, title, description, link }) => (
  <Card
    className="
        flex flex-col items-center text-center
        cursor-pointer transition-transform duration-300
        hover:scale-105 hover:shadow-lg hover:bg-verde/5 
        rounded-2xl p-4
      "
  >
    <Link to={link}>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="mb-4 text-verde-escuro">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Link>
  </Card>
);

export default CategoryCard;
