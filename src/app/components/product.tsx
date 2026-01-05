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
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList } from "./ui/tabs";
import freshMilk from "../../assets/fallback.png";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addItem, removeItem, updateQuantity } from "@/store/cartSlice";
import { fetchProductById } from "@/services/productService";
import type { Product } from "../types";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [productData, setProductData] = useState<{
    data: Product;
    product_images?: { image_url?: string | null }[];
  } | null>(null);

  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Fetch product details by ID
  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProductData(data);
      } catch (error) {
        console.error("Failed to load product details", error);
      }
    };

    loadProduct();
  }, [id]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  const product = productData.data;

  const productImages: string[] = (() => {
    const images: string[] = [];

    if (product?.pic) {
      images.push(product.pic);
    }

    if (Array.isArray(productData.product_images)) {
      productData.product_images.forEach((img: { image_url?: string | null }) => {
        if (img?.image_url) {
          images.push(img.image_url);
        }
      });
    }

    if (!images.length) {
      images.push(freshMilk as unknown as string);
    }

    return images;
  })();

  const isAlreadyInCart = cartItems.some((p) => p.id === product?.id);

  const handleAddToCart = () => {
    if (!product) return null;

    dispatch(
      addItem({
        id: product.id,
        name: product.product_name,
        price: product.price,
        quantity,
        image: product.pic,
        category: product.product_category_name ?? "",
      })
    );


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
                src={productImages[selectedImage] || productImages[0]}
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
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === index
                    ? "border-primary"
                    : "border-transparent"
                    }`}
                >
                  <Image
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                    width={64}
                    height={64}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.product_category_name || ""}
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

            {/* Quantity Selector handled within the Add to Cart logic below if in cart, otherwise local */}

            {/* Add to Cart / Quantity Controls */}
            <div className="space-y-3">
              {isAlreadyInCart ? (
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const item = cartItems.find((p) => p.id === product.id);
                        if (item) {
                          if (item.quantity > 0.5) {
                            dispatch(updateQuantity({ id: product.id, quantity: item.quantity - 0.5 }));
                          } else {
                            dispatch(removeItem(product.id));
                          }
                        }
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">
                      {cartItems.find((p) => p.id === product.id)?.quantity ?? 0}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const item = cartItems.find((p) => p.id === product.id);
                        if (item) {
                          dispatch(updateQuantity({ id: product.id, quantity: item.quantity + 0.5 }));
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 0.5))}
                        disabled={quantity <= 0.5}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 0.5)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={!product.in_stock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart - ₹ {(product.price * quantity).toFixed(2)}
                  </Button>
                </>
              )}
            </div>
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
                  <span>{product.product_category_name || ""}</span>
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

      {/* Related Products: requires separate API, currently disabled */}
    </div>

  );
};

export default ProductDetail;
