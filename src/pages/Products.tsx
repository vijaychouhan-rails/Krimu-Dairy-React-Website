import { useState } from "react";
import { Filter, Grid, List, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import freshMilk from "@/assets/fresh-milk.jpg";
import freshCurd from "@/assets/fresh-curd.jpg";
import artisanCheese from "@/assets/artisan-cheese.jpg";

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const products = [
    {
      id: 1,
      name: "Fresh Whole Milk",
      price: 3.99,
      image: freshMilk,
      category: "Milk",
      description: "Farm-fresh whole milk, rich in nutrients",
      inStock: true
    },
    {
      id: 2,
      name: "Creamy Curd",
      price: 2.49,
      image: freshCurd,
      category: "Curd",
      description: "Smooth and creamy homemade curd",
      inStock: true
    },
    {
      id: 3,
      name: "Artisan Cheese Selection",
      price: 12.99,
      image: artisanCheese,
      category: "Cheese",
      description: "Premium artisanal cheese collection",
      inStock: true
    },
    {
      id: 4,
      name: "Organic Skimmed Milk",
      price: 4.49,
      image: freshMilk,
      category: "Milk",
      description: "Organic low-fat milk for health conscious",
      inStock: false
    },
    {
      id: 5,
      name: "Greek Yogurt",
      price: 5.99,
      image: freshCurd,
      category: "Yogurt",
      description: "Thick and creamy Greek-style yogurt",
      inStock: true
    },
    {
      id: 6,
      name: "Premium Butter",
      price: 6.99,
      image: artisanCheese,
      category: "Butter",
      description: "Rich and creamy premium butter",
      inStock: true
    }
  ];

  const categories = ["All", "Milk", "Curd", "Cheese", "Yogurt", "Butter"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>
              
              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Categories</h4>
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={category} />
                    <label htmlFor={category} className="text-sm">{category}</label>
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-sm">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="under5" />
                    <label htmlFor="under5" className="text-sm">Under ₹5</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="5to10" />
                    <label htmlFor="5to10" className="text-sm">₹5 - ₹10</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="over10" />
                    <label htmlFor="over10" className="text-sm">Over ₹10</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold">Dairy Products</h1>
                <p className="text-muted-foreground">Showing {products.length} products</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-card transition-shadow">
                  <CardContent className="p-0">
                    <Link to={`/product/${product.id}`}>
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {!product.inStock && (
                          <Badge className="absolute top-2 right-2 bg-warning">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <Badge variant="secondary" className="mb-2">
                          {product.category}
                        </Badge>
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">${product.price}</span>
                          <Button size="sm" disabled={!product.inStock}>
                            {product.inStock ? "Add to Cart" : "Out of Stock"}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;