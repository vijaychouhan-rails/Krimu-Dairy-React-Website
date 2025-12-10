"use client";

import { Filter, Grid, List } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchCategoryProducts, fetchProductCategories } from "@/services/productService";
import InfiniteScroll from "react-infinite-scroll-component";
import FreshMilk from "../assets/fresh-milk.jpg";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
const Categories = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [hasSetDefaultCategory, setHasSetDefaultCategory] = useState(false);
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.location
  );

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
  } = useQuery({
    queryKey: ["PRODUCT_CATEGORIES"],
    queryFn: fetchProductCategories,
  });

  const categories = [
    ...(categoriesData ?? []),
    { id: null, name: "Others" },
  ];

  useEffect(() => {
    if (categories.length && !hasSetDefaultCategory) {
      setSelectedCategoryId(categories[0].id);
      setHasSetDefaultCategory(true);
    }
  }, [categories, hasSetDefaultCategory]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["GET_CATEGORY_PRODUCTS", selectedCategoryId, latitude, longitude],
    queryFn: ({ pageParam = 1 }) =>
      fetchCategoryProducts({
        page: pageParam,
        id: selectedCategoryId,
        latitude,
        longitude,
      }),
    enabled: !!latitude && !!longitude,
    getNextPageParam: (lastPage) => lastPage?.meta?.next_page ?? undefined,
    initialPageParam: 1,
  });

  const categoryProducts =
    data?.pages.flatMap((page) => page.category_products) ?? [];

  if (isLoading)
    return (
      <div className="text-center py-16 text-muted-foreground text-lg">
        Loading products...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-card p-6 rounded-2xl shadow-sm border">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2 text-primary" />
                Filters
              </h3>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Categories</h4>
                {isCategoriesLoading ? (
                  <div className="text-sm text-muted-foreground">
                    Loading categories...
                  </div>
                ) : (
                  categories.map((category: any) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={String(category.id)}
                        checked={selectedCategoryId === category.id}
                        onCheckedChange={() =>
                          setSelectedCategoryId(category.id)
                        }
                      />
                      <label
                        htmlFor={String(category.id)}
                        className="text-sm text-muted-foreground"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold">Dairy Products</h1>
                <p className="text-muted-foreground">
                  Showing {categoryProducts.length} products
                </p>
              </div>

              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Infinite Scroll Grid */}
            <InfiniteScroll
              dataLength={categoryProducts.length}
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              loader={
                <div className="text-center py-6 text-muted-foreground">
                  Loading more products...
                </div>
              }
              endMessage={
                <p className="text-center py-6 text-muted-foreground">
                  <b>All products loaded!</b>
                </p>
              }
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {categoryProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-md transition-shadow duration-300 rounded-2xl border"
                >
                  <CardContent className="p-0">
                    <Link href={`/product/${product.id}`}>
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <Image
                          src={product.image_url || FreshMilk}
                          alt={product.product_name}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {!product.in_stock && (
                          <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                            Out of Stock
                          </Badge>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <Badge variant="secondary" className="mb-1">
                          {product.category_name}
                        </Badge>
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {product.product_name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xl font-bold text-primary">
                            ₹{product.price}
                          </span>
                          <Button
                            size="sm"
                            disabled={!product.in_stock}
                            className="rounded-full"
                          >
                            {product.in_stock ? "Add" : "Sold Out"}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </InfiniteScroll>

            {isFetchingNextPage && (
              <div className="text-center text-muted-foreground mt-6">
                Fetching more products...
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Categories;
