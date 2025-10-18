import CategoryCard from "./CategoryCard";
import { categories } from "@/data/categories";

const CategoriesSection = () => {

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-azul">Categorias de Problemas</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Reporte problemas urbanos de diversas categorias e ajude a melhorar a cidade para todos.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index}
              icon={category.icon}
              title={category.title}
              description={category.description}
              link="/denuncias"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection