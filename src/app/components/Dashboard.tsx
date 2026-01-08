"use client";
import React, { useEffect, useMemo } from 'react'
import { ArrowRight, Truck, Shield, Leaf, Star, Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import heroDairy from "../assets/hero-dairy.jpg";
import Link from "next/link";
import Image from "next/image";
import { Badge } from './ui/badge';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/services/dashboardService';
import { GET_ESTORE_DASHBOARD_DATA } from "@/constants/queryName"
import { DashboardData, Product } from '../types';
import InfiniteScroll from 'react-infinite-scroll-component';
import showErrorMessages from '@/lib/errorHandle';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import fallbackImage from "../../assets/fallback.png";
import { addItem, removeItem, updateQuantity } from '@/store/cartSlice';
import { toast } from 'react-toastify';

import logo from "../../assets/logo.png";

function Dashboard() {
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.location
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
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


  const {
    data,
    fetchNextPage,
    hasNextPage,
    error
  } = useInfiniteQuery({
    queryKey: [GET_ESTORE_DASHBOARD_DATA.name, latitude, longitude],
    queryFn: ({ pageParam = 1 }): Promise<DashboardData> =>
      getDashboardData({ page: pageParam, latitude, longitude }),
    initialPageParam: 1,
    enabled: !!latitude && !!longitude,
    getNextPageParam: (lastPage) => lastPage?.meta?.next_page ?? undefined,
    retry: false,
  });

  const firstPage = data?.pages[0];
  const categories = firstPage?.categories ?? [];

  const categoryProducts = useMemo(() => {
    const catProducts = data?.pages.flatMap(page => page.category_products) ?? [];
    const nonOtherCatProducts = catProducts.filter(({ category }) => category !== "Other");

    if (!hasNextPage) {
      const otherProduct = catProducts.find(({ category }) => category === "Other");
      return otherProduct ? [...nonOtherCatProducts, otherProduct] : nonOtherCatProducts;
    }

    return nonOtherCatProducts
  }, [data?.pages, hasNextPage]);


  useEffect(() => {
    if (error) showErrorMessages({ error: error });
  }, [error])

  return (
    <div>
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
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <Image
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
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">
              Discover our wide range of fresh dairy products
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={{
                  pathname: "/products",
                  query: { categoryId: category.id },
                }}
              >
                <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-48 h-48 mx-auto mb-3 relative">
                      <Image
                        src={category.category_image_url || fallbackImage}
                        alt={category.name}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>

                    <div className="text-3xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products by Category</h2>
            <p className="text-muted-foreground text-lg">
              Explore our products by category
            </p>
          </div>

          <InfiniteScroll
            dataLength={categoryProducts.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<h4 className="text-center">Loading more products...</h4>}
          >
            {categoryProducts.map((category) => (
              <div key={category.id} className="mb-12">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold mb-4">{category.category}</h3>
                  <Link
                    href={{
                      pathname: "/products",
                      query: { categoryId: category.id },
                    }}
                  >
                    view all
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.products.map((product: Product) => (
                    <Card key={product.id} className="group hover:shadow-card transition-all duration-300">
                      <CardContent className="p-0">
                        <Link href={`/product/${product.id}`}
                        >
                          <div className="relative overflow-hidden rounded-t-lg">
                            {product.pic ? (
                              <Image
                                src={product.pic}
                                alt={product.product_name}
                                className={`w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300`}
                                width={400}
                                height={400}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                                <Image
                                  src={fallbackImage}
                                  alt={product.product_name}
                                  className={`w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300`}
                                  width={400}
                                  height={400}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <Badge className="absolute top-4 left-4 bg-card text-card-foreground">
                              {category.category}
                            </Badge>
                            {!product.in_stock && (
                              <Badge className="absolute top-4 right-4 bg-yellow-500 text-black">
                                Out of Stock
                              </Badge>
                            )}
                            {product.in_stock && !product.available_on_location && (
                              <Badge variant="destructive" className="absolute top-4 right-4">
                                Unavailable at location
                              </Badge>
                            )}
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{product.product_name}</h3>
                            <p className="text-muted-foreground mb-4">{product.detail || "No details available"}</p>

                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                              {cartItems.some((item) => item.id === product.id) ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const item = cartItems.find((i) => i.id === product.id);
                                      if (item) {
                                        if (item.quantity > 0.5) {
                                          dispatch(
                                            updateQuantity({
                                              id: product.id,
                                              quantity: item.quantity - 0.5,
                                            })
                                          );
                                        } else {
                                          dispatch(removeItem(product.id));
                                          toast.success("Removed from cart");
                                        }
                                      }
                                    }}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">
                                    {cartItems.find((i) => i.id === product.id)?.quantity || 0}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const item = cartItems.find((i) => i.id === product.id);
                                      if (item) {
                                        dispatch(
                                          updateQuantity({
                                            id: product.id,
                                            quantity: item.quantity + 0.5,
                                          })
                                        );
                                      }
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  disabled={!product.in_stock || !product.available_on_location}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    dispatch(
                                      addItem({
                                        id: product.id,
                                        name: product.product_name,
                                        price: product.price,
                                        quantity: 1,
                                        image: product.pic ?? "",
                                        category: category.category,
                                      })
                                    );
                                    toast.success("Added to cart");
                                  }}
                                >
                                  {!product.in_stock
                                    ? "Sold Out"
                                    : !product.available_on_location
                                      ? "Unavailable"
                                      : "Add to Cart"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}


                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Image
                src={logo}
                alt="Logo"
                width={80}
                height={80}
                className="w-20 "
              />
              <p className="text-muted-foreground">
                Your trusted source for fresh, quality dairy products delivered daily.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/products" className="block text-muted-foreground hover:text-primary">Products</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Link href="/policy/privacyPolicy" className="block text-muted-foreground hover:text-primary">privacy policy</Link>
                <Link href="/policy/terms-and-conditions" className="block text-muted-foreground hover:text-primary">terms and conditions</Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 - 2026 DairyFresh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard