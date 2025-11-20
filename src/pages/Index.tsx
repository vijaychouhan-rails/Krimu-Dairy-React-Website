import { ArrowRight, Truck, Shield, Leaf, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import heroDairy from "@/assets/hero-dairy.jpg";
import freshMilk from "@/assets/fresh-milk.jpg";
import freshCurd from "@/assets/fresh-curd.jpg";
import artisanCheese from "@/assets/artisan-cheese.jpg";
import logo from "../assets/logo.png";
const Index = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Fresh Whole Milk",
      price: 3.99,
      image: freshMilk,
      category: "Milk",
      description: "Farm-fresh whole milk, rich in nutrients"
    },
    {
      id: 2,
      name: "Creamy Curd",
      price: 2.49,
      image: freshCurd,
      category: "Curd", 
      description: "Smooth and creamy homemade curd"
    },
    {
      id: 3,
      name: "Artisan Cheese Selection",
      price: 12.99,
      image: artisanCheese,
      category: "Cheese",
      description: "Premium artisanal cheese collection"
    }
  ];

  const categories = [
    { name: "Milk", count: 25, icon: "🥛" },
    { name: "Cheese", count: 18, icon: "🧀" },
    { name: "Curd", count: 12, icon: "🥄" },
    { name: "Yogurt", count: 15, icon: "🍶" },
    { name: "Butter", count: 8, icon: "🧈" },
    { name: "Cream", count: 10, icon: "🥛" }
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Free delivery on orders over ₹50"
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "100% fresh and quality guaranteed"
    },
    {
      icon: Leaf,
      title: "Organic Products",
      description: "Sourced from local organic farms"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="w-fit bg-accent/20 text-accent-foreground border-accent/30">
                🥛 Fresh Dairy Products
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Fresh Dairy Products
                <span className="block text-primary">Delivered Daily</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Experience the finest quality dairy products sourced directly from local farms. 
                Fresh, nutritious, and delivered to your doorstep with care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/products">
                    Shop Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src={heroDairy}
                  alt="Fresh dairy products"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-card p-4 rounded-lg shadow-card">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">4.9 Rating</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-success text-success-foreground p-4 rounded-lg shadow-card">
                <div className="text-center">
                  <div className="font-bold text-lg">50+</div>
                  <div className="text-sm">Fresh Products</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">
              Discover our wide range of fresh dairy products
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category.name} to="/products">
                <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} products</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg">
              Our most popular and highest quality dairy products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-card transition-all duration-300">
                <CardContent className="p-0">
                  <Link to={`/product/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-card text-card-foreground">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-muted-foreground mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                        <Button>Add to Cart</Button>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-hover text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Shop Fresh Dairy Online — Fast, Easy & Reliable</h2>

          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Shop fresh dairy products online and get them delivered right to your doorstep.
            Browse our daily fresh items, place your orders with ease, and enjoy a smooth,
            convenient shopping experience designed especially for your everyday needs.
          </p>

          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-foreground"
            />
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>


      {/* <section className="py-16 bg-gradient-to-r from-primary to-primary-hover text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Demo</h2>
          <p className="text-xl mb-8 opacity-90">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore, magni minima numquam fugiat quaerat iure debitis, a consectetur obcaecati temporibus odit distinctio ullam tempore velit! Distinctio totam quia sequi vel.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-foreground"
            />
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {/* <div className="bg-gradient-to-r from-primary to-accent w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  D
                </div>
                <span className="text-xl font-bold">DairyFresh</span> */}
                <img
              src={logo}
              alt={"logo"}
              className="bg-gradient-to-r from-primary to-accent h-14 w-fit rounded-lg flex items-center justify-center text-white font-bold text-xl"
            />
              </div>
              <p className="text-muted-foreground">
                Your trusted source for fresh, quality dairy products delivered daily.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/products" className="block text-muted-foreground hover:text-primary">Products</Link>
                <Link to="/about" className="block text-muted-foreground hover:text-primary">About Us</Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-primary">Contact</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <Link to="/products" className="block text-muted-foreground hover:text-primary">Milk</Link>
                <Link to="/products" className="block text-muted-foreground hover:text-primary">Cheese</Link>
                <Link to="/products" className="block text-muted-foreground hover:text-primary">Yogurt</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Link to="/policy/privacyPolicy" className="block text-muted-foreground hover:text-primary">Privacy Policy</Link>
                <Link to="/policy/terms-and-conditions" className="block text-muted-foreground hover:text-primary">Terms & Condition</Link>
                {/* <Link to="/returns" className="block text-muted-foreground hover:text-primary">Returns</Link> */}
              </div>
            </div>

            {/* <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Link to="/help" className="block text-muted-foreground hover:text-primary">Help Center</Link>
                <Link to="/shipping" className="block text-muted-foreground hover:text-primary">Shipping Info</Link>
                <Link to="/returns" className="block text-muted-foreground hover:text-primary">Returns</Link>
              </div>
            </div> */}
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Krimu Dairy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
