// app/components/Header.tsx
"use client";

import { ShoppingCart, Search, User, Menu, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GET_ESTORE_DASHBOARD_DATA } from "@/constants/queryName";
import { getDashboardData } from "@/services/dashboardService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { parseCookies } from 'nookies';
import { destroyCookies, fetchAuth, getCookies } from "@/lib/appCookies";
import { logoutOperation } from "@/services/auth";
import showErrorMessages from "@/lib/errorHandle";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { clearCart } from "@/store/cartSlice";
import logo from "../../assets/logo.png";

const HeaderContent: React.FC = () => {

  const latitude = "22.6883834";
  const longitude = "75.8284917";
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.length;

  const authData = fetchAuth();
  const isLoggedIn = authData.isLoggedIn;
  const user = authData.user_name;

  const logoutAuthMutation = useMutation({ mutationFn: () => logoutOperation() });
  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: ["dashboardTopMessage", latitude, longitude],
    queryFn: () => getDashboardData({ page: 1, latitude, longitude }),
  });

  const topMessage = data?.top_message ?? "";

  const handleLogout = () => {
    logoutAuthMutation.mutate(undefined, {
      onSuccess: () => {
        // Backend confirmed logout
        afterLogout();
      },
      onError: () => {
        // Even if backend failed (401, etc), clear client-side auth
        afterLogout();
      },
    });
  };

  const afterLogout = () => {
    destroyCookies();
    dispatch(clearCart());
    toast.success("Logout Success");
    setTimeout(() => {
      window.location.replace("/login");
    }, 1000);
  };


  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-primary to-accent py-2 text-center text-sm text-white -mx-4 mb-4">
          {topMessage} {/* Free delivery on orders over ₹50 • Fresh dairy products daily */}
        </div>

        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">
              <Image
                src={logo}
                alt={"logo"}
                width={80}
                height={80}
                className="bg-gradient-to-r from-primary to-accent w-20 h-20 w-fit  rounded-lg flex items-center justify-center text-white font-bold text-xl"
              />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/orders" className="text-foreground hover:text-primary transition-colors">
              My Orders
            </Link>
          </nav>

          {/* Search bar */}
          {/* <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search dairy products..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div> */}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div>
                  <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user || "Profile"}</span>
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-primary">
                  {cartCount}
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

const Header: React.FC = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  return <HeaderContent />;
};

export default Header;
