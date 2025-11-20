import { ShoppingCart, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-primary to-accent py-2 text-center text-sm text-white -mx-4 mb-4">
          Free delivery on orders over ₹50 • Fresh dairy products daily
        </div>
        
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
           <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-accent  rounded-lg flex items-center justify-center text-white font-bold text-xl">
            <img
              src={logo}
              alt={"logo"}
              className="bg-gradient-to-r from-primary to-accent w-20 h-20 w-fit  rounded-lg flex items-center justify-center text-white font-bold text-xl"
            />
            </div>
            {/* <span className="text-xl font-bold text-foreground">KrimuDairy</span> */}
          </Link>

          {/* <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-accent w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              D
            </div>
            <span className="text-xl font-bold text-foreground">DairyFresh</span>
          </Link> */}

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            {/* <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
              Admin
            </Link> */}
          </nav>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search dairy products..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Account</span>
              </Button>
            </Link>
            
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-primary">
                  3
                </Badge>
              </Button>
            </Link>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;