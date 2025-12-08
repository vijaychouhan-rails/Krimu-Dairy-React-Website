"use client";

import { useEffect, useState } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import freshMilk from "../assets/fresh-milk.jpg";
import freshCurd from "../assets/fresh-curd.jpg";
import artisanCheese from "../assets/artisan-cheese.jpg";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addItem } from "@/store/cartSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay, Navigation } from "swiper/modules";
import { Product } from "../types";

const ProductDetail = () => {
  const { id } = useParams<{id: string}>();
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [productData, setProductData] = useState<any>(null);

  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Read localStorage safely in useEffect
  useEffect(() => {
    const storedData = localStorage.getItem(id);
    if (storedData) {
      const data = JSON.parse(storedData);
      setProductData(data);
    }
  }, [id]);

  if (!productData) {
    return <div>Loading...</div>; // or skeleton loader
  }

  const product = productData.product;
  const c = productData.category;
  const relatedProducts = c?.products.filter((p: Product) => p.id !== product.id)
  
  // Mock productImages data
  const productImages = [freshMilk, freshCurd, artisanCheese]
  const isAlreadyInCart = cartItems.some( p => p.id === product?.id)

  const handleAddToCart = () => {
    if (!product) return null;

    dispatch(
      addItem({
        id: product.id,
        name: product.product_name,
        price: product.price,
        quantity,
        image: product.pic,
        category: c?.category,
      })
    );
    
    router.push("/cart")
  };

  const productItem = (category:  any, product: any) => {
    localStorage.clear();
    localStorage.setItem(product.id.toString(), JSON.stringify({
      product: product,
      category: category,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.product_name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={product.pic || freshMilk}
                alt={product.product_name}
                className="w-full h-full object-cover"
                width={400}
                height={400}
              />
            </div>

            {/* Thumbnail Images Multiple Images */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {c.category}
              </Badge>
              <h1 className="text-3xl font-bold">{product.product_name}</h1>
              <p className="textcategoryProducts-muted-foreground mt-2">
                {product.detail}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">
                ₹{product.price}
              </span>
              <Badge variant={product.in_stock ? "default" : "secondary"}>
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isAlreadyInCart}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isAlreadyInCart}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              { isAlreadyInCart ? 
                <Button
                  size="lg"
                  className="w-full bg-[#F7A200] hover:bg-[#e69500] text-white"
                  disabled={!product.in_stock}
                  onClick={() => router.push("/cart")}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  GO TO CART
                </Button>
              : <Button
                  size="lg"
                  className="w-full"
                  disabled={!product.in_stock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart - ₹ {(product.price * quantity).toFixed(2)}
                </Button>
              }
              {/* <Button variant="outline" size="lg" className="w-full">
                Buy Now
              </Button> */}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Free Delivery</div>
                <div className="text-xs text-muted-foreground">
                  On orders $50+
                </div>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Quality Guarantee</div>
                <div className="text-xs text-muted-foreground">100% fresh</div>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Easy Returns</div>
                <div className="text-xs text-muted-foreground">
                  30-day policy
                </div>
              </div>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UNIT:</span>
                    <span>{product.unit}</span>
                  </div>
                  {product.gst_percentage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST(%):</span>
                      <span>{product.gst_percentage}%</span>
                    </div>
                  )}
                  {/* Add Dairy Name */}
                  {/* <div className="flex justify-between">
                    <span className="text-muted-foreground">Brand:</span>
                    <span>{product.brand}</span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{c.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {/* <TabsTrigger value="description">Description</TabsTrigger> */}
              {/* <TabsTrigger value="specifications">Specifications</TabsTrigger> */}
              {/* <TabsTrigger value="nutrition">Nutrition Facts</TabsTrigger> */}
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.detail}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Specifications</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}

            {/* <TabsContent value="nutrition" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Nutrition Facts</h3>
                  <div className="space-y-3">
                    {Object.entries(product.nutritionFacts).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Related Products</h2>

            {/* Custom Navigation */}
            <div className="flex space-x-2">
              <button className="related-prev-btn w-10 h-10 bg-background border rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="related-next-btn w-10 h-10 bg-background border rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: ".related-next-btn",
                prevEl: ".related-prev-btn",
              }}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                stopOnLastSlide: false, // Don't stop on last slide when looping
              }}
              spaceBetween={24}
              slidesPerView={4}
              speed={600}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 20 },
              }}
            >
              {relatedProducts.map((relatedProduct: any) => (
                <SwiperSlide key={relatedProduct.id} className="!h-auto">
                  <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 h-full border-2 hover:border-primary/20">
                    <CardContent className="p-0 h-full flex flex-col">
                      <Link
                        href={`/product/${relatedProduct.id}`}
                        className="flex flex-col h-full"
                        onClick={() => productItem(c, relatedProduct)}
                      >
                        <div className="relative overflow-hidden rounded-t-lg bg-muted/50">
                          <Image
                            src={relatedProduct.pic || freshMilk}
                            alt={relatedProduct.product_name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                            width={400}
                            height={400}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                          <div className="mb-2">
                            <Badge variant="secondary" className="mb-2">
                              {relatedProduct.category}
                            </Badge>
                            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                              {relatedProduct.product_name}
                            </h3>
                          </div>

                          <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-2">
                            {relatedProduct.detail ||
                              "Discover this amazing product"}
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-4 border-t">
                            <div>
                              <span className="text-2xl font-bold text-primary">
                                ₹ {relatedProduct.price}
                              </span>
                              {relatedProduct.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  ₹ {relatedProduct.originalPrice}
                                </span>
                              )}
                            </div>
                            <Button size="sm" className="shrink-0">
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
