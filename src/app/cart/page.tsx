"use client";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import freshMilk from "../assets/fresh-milk.jpg";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearCart, removeItem, updateQuantity, type CartItem } from "@/store/cartSlice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCartPaymentInformation, fetchDeliveryAddresses, placeOrder } from "@/services/orderService";
import showErrorMessages from "@/lib/errorHandle";
import { GET_DELIVERY_ADD } from "@/constants/queryName";
import { fetchAuth } from "@/lib/appCookies";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerField from "../components/field";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import { LocationMapDialog } from "../components/LocationMapDialog";
import { EditAddressLabelDialog, type EditAddressData } from "../components/EditAddressLabelDialog";
import { setLocation, setLocationAddress } from "@/store/locationSlice";

type GeocoderAddressComponents = {
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  house_number?: string;
  street?: string;
  landmark?: string;
};

type GeocoderAddressResponse = {
  success: boolean;
  error?: boolean;
  location: string;
  address_components?: GeocoderAddressComponents;
};

type CartPaymentInfo = {
  product_data: unknown;
  total_amount: number;
  total_payable_amount: number;
  gst_amount: number;
  discount_value: number;
  debit_from_wallet: number;
  coupon_message?: string;
  errors: string[];
};

type CartPaymentInformationResponse = {
  success: boolean;
  checkout_products: unknown[];
  payment_modes: unknown[];
  payment_info: CartPaymentInfo;
};

type PlaceOrderResponse = {
  success: boolean;
  messages?: string[];
};

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [paymentMode, setPaymentMode] = useState<"COD">("COD");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [editAddressDialogOpen, setEditAddressDialogOpen] = useState(false);
  const [pendingEditAddress, setPendingEditAddress] = useState<EditAddressData | null>(null);

  const dispatch = useDispatch();

  const items = useSelector((state: RootState) => state.cart.items);
  const locationState = useSelector((state: RootState) => state.location);
  const {
    latitude,
    longitude,
    location,
    city,
    state,
    postal_code,
    country,
    house_number,
    street,
    landmark,
  } = locationState;
  const authData = fetchAuth();
  const userId = authData.user_id;
  const isLoggedIn = authData?.isLoggedIn;

  const productsForPaymentInfo = cartItems.map((item: CartItem) => ({
    id: item.id,
    quantity: item.quantity,
    product_name: item.name,
  }));

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeItem(id));
  };

  //Fetch user's saved addresses (data currently unused but kept for side effects/caching)
  useQuery({
    queryKey: [GET_DELIVERY_ADD.name],
    queryFn: () => fetchDeliveryAddresses(userId),
    retry: false,
    enabled: !!userId,
  });

  const handlePlaceOrder = useMutation({
    mutationFn: () => {
      const products = cartItems.map((item: CartItem) => ({
        product_id: item.id.toString(),
        quantity: item.quantity,
      }));

      if (!latitude || !longitude || !location) {
        toast.error("Please select delivery location");
        throw new Error("Location not selected");
      }

      const addressPayload = {
        latitude: Number(latitude),
        longitude: Number(longitude),
        city,
        house_number,
        full_address: location,
        postal_code,
        country_name: country,
        state,
        street,
        landmark: landmark || "",
        is_saved: saveAddress,
      };

      return placeOrder({
        products,
        address: addressPayload,
        deliveryDate,
        deliveryInstruction: deliveryInstructions,
        couponCode: appliedCouponCode || "",
      });
    },
    onSuccess: (res: PlaceOrderResponse) => {
      if (res.success) {
        toast.success("Order Placed Successfully!")
        dispatch(clearCart());
        router.push('/');
      } else {
        showErrorMessages({ error: res.messages });
      }
    },
    onError: (error: { message?: string }) => {
      showErrorMessages({ error: error.message ?? "Something went wrong" })
    },
  })
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const { data: cartPaymentData } = useQuery<CartPaymentInformationResponse>({
    queryKey: [
      "cart_payment_information",
      productsForPaymentInfo,
      latitude,
      longitude,
      appliedCouponCode,
    ],
    queryFn: () =>
      fetchCartPaymentInformation({
        products: productsForPaymentInfo,
        latitude: Number(latitude),
        longitude: Number(longitude),
        couponCode: appliedCouponCode,
      }),
    enabled:
      cartItems.length > 0 && !!latitude && !!longitude,
    retry: false,
  });

  const backendPaymentInfo = cartPaymentData?.payment_info;
  const displaySubtotal = backendPaymentInfo
    ? backendPaymentInfo.total_amount - backendPaymentInfo.gst_amount
    : subtotal;
  const displayGst = backendPaymentInfo?.gst_amount ?? tax;
  const displayTotal = backendPaymentInfo?.total_payable_amount ?? total;
  const displayOriginalTotal = backendPaymentInfo?.total_amount ?? total;
  const displayDiscount = backendPaymentInfo
    ? backendPaymentInfo.total_amount - backendPaymentInfo.total_payable_amount
    : 0;

  const applyCoupon = useMutation({
    mutationFn: () => {
      if (!latitude || !longitude) {
        toast.error("Please select delivery location");
        throw new Error("Location not selected");
      }

      return fetchCartPaymentInformation({
        products: productsForPaymentInfo,
        latitude: Number(latitude),
        longitude: Number(longitude),
        couponCode: couponCode || null,
      });
    },
    onSuccess: (data: CartPaymentInformationResponse) => {
      const info = data.payment_info;

      if (info?.errors && info.errors.length > 0) {
        toast.error(info.errors[0]);
        setAppliedCouponCode(null);
        return;
      }

      setAppliedCouponCode(couponCode);
      toast.success("Coupon Applied Successfully");
    },
    onError: (error: { message?: string }) => {
      showErrorMessages({ error: error.message ?? "Something went wrong" });
    },
  });

  const removeCoupon = useMutation({
    mutationFn: () => {
      if (!latitude || !longitude) {
        toast.error("Please select delivery location");
        throw new Error("Location not selected");
      }

      return fetchCartPaymentInformation({
        products: productsForPaymentInfo,
        latitude: Number(latitude),
        longitude: Number(longitude),
        couponCode: null,
      });
    },
    onSuccess: () => {
      setAppliedCouponCode(null);
      setCouponCode("");
    },
    onError: (error: { message?: string }) => {
      showErrorMessages({ error: error.message ?? "Something went wrong" });
    },
  });

  useEffect(() => {
    setCartItems(items)
  }, [items])

  if(!isLoggedIn){
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">{cartItems.length} items in your cart</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some delicious dairy products to get started!</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: CartItem) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={item.image || freshMilk}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          width={400}
                          height={400}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <p className="text-lg font-bold text-primary mt-1">₹ {item.price}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 py-1 min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">₹ {(item.price * item.quantity).toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Checkout sidebar: address, instructions, delivery, payment, coupon, summary */}
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Address Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent>
                  {location ? (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <MapPin className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">{city || "Selected Location"}</p>
                          <p className="text-sm text-muted-foreground break-words">
                            {location}
                          </p>
                        </div>
                      </div>

                      <label className="flex items-center space-x-2 text-sm mt-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                        />
                        <span>Save this address</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setLocationDialogOpen(true)}
                        className="text-xs text-primary underline mt-2"
                      >
                        Change Location
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        No delivery location selected yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => setLocationDialogOpen(true)}
                        className="text-xs text-primary underline"
                      >
                        Set Delivery Location
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="Add delivery notes for the rider (e.g. landmark, call before delivery)"
                  />
                </CardContent>
              </Card>

              {/* Delivery & Payment & Summary */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Delivery & Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Delivery section (date) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Delivery Date</span>
                      <DatePickerField
                        selected={deliveryDate}
                        onChange={(date) => {
                          if (date) {
                            setDeliveryDate(date);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Payment mode */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Payment Mode</p>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        type="button"
                        variant={paymentMode === "COD" ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setPaymentMode("COD")}
                      >
                        COD
                      </Button>
                    </div>
                  </div>

                  {/* Coupon code */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Coupon Code</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCouponCode}
                        placeholder="Enter coupon"
                        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!appliedCouponCode && !couponCode}
                        onClick={() =>
                          appliedCouponCode
                            ? removeCoupon.mutate()
                            : applyCoupon.mutate()
                        }
                      >
                        {appliedCouponCode ? "Remove" : "Apply"}
                      </Button>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-2">
                    <Separator />
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹ {displaySubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST</span>
                      <span>₹ {displayGst.toFixed(2)}</span>
                    </div>
                    {appliedCouponCode && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>- ₹ {displayDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      {appliedCouponCode ? (
                        <span className="space-x-2">
                          <span className="line-through text-sm text-muted-foreground">
                            ₹ {displayOriginalTotal.toFixed(2)}
                          </span>
                          <span>₹ {displayTotal.toFixed(2)}</span>
                        </span>
                      ) : (
                        <span>₹ {displayTotal.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {shipping > 0 && (
                    <div className="bg-accent/20 p-3 rounded-lg text-sm text-center">
                      Add ₹{(50 - subtotal).toFixed(2)} more for free shipping!
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => handlePlaceOrder.mutate()}
                    disabled={handlePlaceOrder.isPending || cartItems.length === 0}
                  >
                    {handlePlaceOrder.isPending ? "Placing Order..." : "Place Order"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Secure checkout powered by SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <LocationMapDialog
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        initialLatitude={latitude}
        initialLongitude={longitude}
        onLocationSelected={({
          latitude: selectedLat,
          longitude: selectedLng,
          addressResponse,
        }: {
          latitude: string;
          longitude: string;
          addressResponse: GeocoderAddressResponse | null;
        }) => {
          const components = addressResponse?.address_components || {};

          const next: EditAddressData = {
            latitude: selectedLat,
            longitude: selectedLng,
            location: addressResponse?.location || location || "",
            city: components.city ?? city,
            state: components.state ?? state,
            postal_code: components.postal_code ?? postal_code,
            country: components.country ?? country,
            house_number: components.house_number ?? house_number,
            street: components.street ?? street,
            landmark: components.landmark ?? landmark,
          };

          setPendingEditAddress(next);
          setEditAddressDialogOpen(true);
        }}
      />

      <EditAddressLabelDialog
        open={editAddressDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditAddressDialogOpen(false);
            setLocationDialogOpen(true);
          } else {
            setEditAddressDialogOpen(true);
          }
        }}
        initialAddress={pendingEditAddress}
        onSave={(data: EditAddressData) => {
          dispatch(
            setLocation({
              latitude: data.latitude,
              longitude: data.longitude,
            })
          );

          dispatch(
            setLocationAddress({
              location: data.location,
              city: data.city,
              state: data.state,
              postal_code: data.postal_code,
              country: data.country,
              house_number: data.house_number,
              street: data.street,
              landmark: data.landmark,
            })
          );

          setEditAddressDialogOpen(false);
        }}
      />
    </div>
  );
};

export default Cart;