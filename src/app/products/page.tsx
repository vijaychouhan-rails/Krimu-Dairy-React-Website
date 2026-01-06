"use client";

import { Suspense } from "react";
import { Filter, Grid, List, Minus, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchCategoryProducts, fetchProductCategories } from "@/services/productService";
import InfiniteScroll from "react-infinite-scroll-component";
import FreshMilk from "../../assets/fallback.png";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import { addItem, removeItem, updateQuantity } from "@/store/cartSlice";
import { toast } from "react-toastify";

const Categories = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [hasSetDefaultCategory, setHasSetDefaultCategory] = useState(false);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.location
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
  } = useQuery({
    queryKey: ["PRODUCT_CATEGORIES"],
    queryFn: fetchProductCategories,
  });
  const categories = useMemo(() => {
    const baseCategories = categoriesData ?? [];
    return baseCategories.length
      ? [...baseCategories, { id: null, name: "Others" }]
      : [];
  }, [categoriesData]);

  useEffect(() => {
    if (!categories.length || hasSetDefaultCategory) return;

    const categoryIdParam = searchParams.get("categoryId");
    const parsedId = categoryIdParam ? Number(categoryIdParam) : null;

    if (parsedId !== null && !Number.isNaN(parsedId)) {
      const matchedCategory = categories.find((cat) => cat.id === parsedId);
      if (matchedCategory) {
        setSelectedCategoryId(matchedCategory.id);
        setHasSetDefaultCategory(true);
        return;
      }
    }

    setSelectedCategoryId(categories[0].id);
    setHasSetDefaultCategory(true);
  }, [categories, hasSetDefaultCategory, searchParams]);

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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 space-y-6">
              <div className="bg-card p-6 rounded-2xl shadow-sm border">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-primary" />
                  Filters
                </h3>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2"
                      >
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Card
                    key={idx}
                    className="rounded-2xl border overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex items-center justify-between pt-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-8 w-20 rounded-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </main>
          </div>
        </div>
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
                  categories.map((category) => (
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
              className={`grid gap-6 ${viewMode === "grid"
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
                          src={product.pic || FreshMilk}
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
                        {product.in_stock && !product.available_on_location && (
                          <Badge variant="destructive" className="absolute top-2 right-2">
                            Unavailable at location
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
                              size="sm"
                              disabled={!product.in_stock || !product.available_on_location}
                              className="rounded-full"
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
                                    category: product.category_name ?? "",
                                  })
                                );
                                toast.success("Added to cart");
                              }}
                            >
                              {!product.in_stock
                                ? "Sold Out"
                                : !product.available_on_location
                                  ? "Unavailable"
                                  : "Add"}
                            </Button>
                          )}
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

const ProductsPage = () => (
  <Suspense fallback={null}>
    <Categories />
  </Suspense>
);

export default ProductsPage;
