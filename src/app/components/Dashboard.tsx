"use client";
import React, { useEffect, useMemo } from 'react'
import { ArrowRight, Truck, Shield, Leaf, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import heroDairy from "../assets/hero-dairy.jpg";
import Link from "next/link";
import Image from "next/image";
import { Badge } from './ui/badge';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/services/dashboardService';
import {GET_ESTORE_DASHBOARD_DATA} from "@/constants/queryName"
import { DashboardData, Product } from '../types';
import InfiniteScroll from 'react-infinite-scroll-component';
import showErrorMessages from '@/lib/errorHandle';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import fallbackImage from "../../assets/fallback.png";

function Dashboard() {
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.location
  );
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

  // const latitude = '22.6883834';
  // const longitude = '75.8284917';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: [GET_ESTORE_DASHBOARD_DATA.name, latitude, longitude],
    queryFn: ({ pageParam = 1 }):Promise<DashboardData> =>
      getDashboardData({ page: pageParam, latitude, longitude }),
    initialPageParam: 1,
    enabled: !!latitude && !!longitude,
    getNextPageParam: (lastPage) => lastPage?.meta?.next_page ?? undefined,
    retry: false,
    // getNextPageParam: (lastPage: DashboardData) => {
    //   if (!lastPage?.meta) return undefined;
    //   return lastPage?.meta?.next_page;
    // },
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


  useEffect(()=> {
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
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Learn More
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
                    {category.category_image_url ? (
                      <div className="w-20 h-20 mx-auto mb-3 relative">
                        <Image
                          src={category.category_image_url}
                          alt={category.name}
                          fill
                          className="object-contain rounded-xl"
                        />
                      </div>
                    ) : 
                      <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                      🛒 {/* fallback icon */}
                      </div>
                    }
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
              <div key= {category.id} className="mb-12">
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
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{product.product_name}</h3>
                            <p className="text-muted-foreground mb-4">{product.detail || "No details available"}</p>
                            {product.in_stock === false && (
                              <Badge variant="destructive" className="mb-2">
                                Out of stock
                              </Badge>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                              <Button>Add to Cart</Button>
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
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-primary to-accent w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  D
                </div>
                <span className="text-xl font-bold">DairyFresh</span>
              </div>
              <p className="text-muted-foreground">
                Your trusted source for fresh, quality dairy products delivered daily.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/products" className="block text-muted-foreground hover:text-primary">Products</Link>
                <Link href="/about" className="block text-muted-foreground hover:text-primary">About Us</Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-primary">Contact</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Link href="/help" className="block text-muted-foreground hover:text-primary">Help Center</Link>
                <Link href="/shipping" className="block text-muted-foreground hover:text-primary">Shipping Info</Link>
                <Link href="/returns" className="block text-muted-foreground hover:text-primary">Returns</Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 DairyFresh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard