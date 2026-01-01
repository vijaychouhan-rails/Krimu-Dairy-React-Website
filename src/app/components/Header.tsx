// app/components/Header.tsx
"use client";

import { ShoppingCart, User, Menu, LogOut, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDashboardData, checkServiceAvailableInArea } from "@/services/dashboardService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { destroyCookies, fetchAuth } from "@/lib/appCookies";
import { logoutOperation } from "@/services/auth";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { clearCart } from "@/store/cartSlice";
import { setLocation, setLocationAddress } from "@/store/locationSlice";
import { getAddressFromCoordinates } from "@/services/geocoderService";
import { LocationMapDialog } from "./LocationMapDialog";
import { EditAddressLabelDialog, type EditAddressData } from "./EditAddressLabelDialog";
import logo from "../../assets/logo.png";
import { usePathname } from "next/navigation";

const HeaderContent: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { latitude, longitude, location, city, state, postal_code, country, house_number, street, landmark } = useSelector(
    (state: RootState) => state.location
  );
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const cartCount = cartItems.length;
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [editAddressDialogOpen, setEditAddressDialogOpen] = useState(false);
  const [pendingEditAddress, setPendingEditAddress] = useState<EditAddressData | null>(null);

  const authData = fetchAuth();
  const isLoggedIn = authData.isLoggedIn;
  const user = authData.user_name;

  const logoutAuthMutation = useMutation({ mutationFn: () => logoutOperation() });
  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: ["dashboardTopMessage", latitude, longitude],
    queryFn: () => getDashboardData({ page: 1, latitude, longitude }),
    enabled: isHomePage && !!latitude && !!longitude && serviceAvailable === true,
  });

  const topMessage = data?.top_message ?? "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem("krimu:lastLocation");
      if (stored) {
        const parsed = JSON.parse(stored) as {
          latitude?: string;
          longitude?: string;
          location?: string;
          address_components?: {
            city?: string;
            state?: string;
            postal_code?: string;
            country?: string;
            house_number?: string;
            street?: string;
          } | null;
        };

        if (parsed.latitude && parsed.longitude) {
          dispatch(
            setLocation({
              latitude: parsed.latitude,
              longitude: parsed.longitude,
            })
          );

          if (parsed.location || parsed.address_components) {
            const components = parsed.address_components || {};
            dispatch(
              setLocationAddress({
                location: parsed.location || "",
                city: components.city,
                state: components.state,
                postal_code: components.postal_code,
                country: components.country,
                house_number: components.house_number,
                street: components.street,
              })
            );
          }

          return;
        }
      }
    } catch {
    }

    if (!navigator.geolocation) {
      setLocationDialogOpen(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        dispatch(
          setLocation({
            latitude: String(lat),
            longitude: String(lng),
          })
        );
      },
      () => {
        setLocationDialogOpen(true);
      }
    );
  }, [dispatch]);

  const handleChangeLocation = () => {
    setLocationDialogOpen(true);
  };

  const handleLocationDialogOpenChange = (open: boolean) => {
    if (!open) {
      if (!latitude || !longitude || !location) {
        return;
      }
    }

    setLocationDialogOpen(open);
  };

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

  const handleMapLocationSelected = ({
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
  };

  const handleEditAddressSave = (data: EditAddressData) => {
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
  };

  const handleEditAddressDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditAddressDialogOpen(false);
      setLocationDialogOpen(true);
      return;
    }

    setEditAddressDialogOpen(true);
  };

  useEffect(() => {
    if (!latitude || !longitude || location) return;

    getAddressFromCoordinates({ latitude, longitude })
      .then((res: GeocoderAddressResponse) => {
        if (res && res.success && !res.error) {
          const components = res.address_components || {};
          dispatch(
            setLocationAddress({
              location: res.location,
              city: components.city,
              state: components.state,
              postal_code: components.postal_code,
              country: components.country,
              house_number: components.house_number,
              street: components.street,
            })
          );
        }
      })
      .catch(() => {
      });
  }, [latitude, longitude, location, dispatch]);

  useEffect(() => {
    if (!latitude || !longitude) return;

    checkServiceAvailableInArea({ latitude, longitude })
      .then((res: { success?: boolean; service_available_in_area?: boolean }) => {
        if (res && res.success && res.service_available_in_area) {
          setServiceAvailable(true);
        } else {
          setServiceAvailable(false);
          window.location.replace("/service-not-available");
        }
      })
      .catch(() => {
        setServiceAvailable(false);
        window.location.replace("/service-not-available");
      });
  }, [latitude, longitude]);

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
      {topMessage}
    </div>

    <div className="flex items-center justify-between py-4">

      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src={logo}
          alt="logo"
          width={80}
          height={80}
          className="bg-gradient-to-r from-primary to-accent w-20 h-20 rounded-lg flex items-center justify-center text-white font-bold text-xl"
        />
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
        <Link href="/products" className="text-foreground hover:text-primary transition-colors">Products</Link>
        <Link href="/orders" className="text-foreground hover:text-primary transition-colors">My Orders</Link>
      </nav>

      {/* Actions + Location */}
      <div className="flex items-center space-x-4">

        {/* Location Compact */}
        {location && (
          <div className="hidden md:flex items-center max-w-[180px] truncate">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs text-muted-foreground truncate ml-1">
              {location}
            </span>
            <button
              onClick={handleChangeLocation}
              className="text-[11px] text-primary underline ml-2 shrink-0"
            >
              Change
            </button>
          </div>
        )}

        {/* Profile / Login */}
        {isLoggedIn ? (
          <>
            <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span className="text-sm">{user || "Profile"}</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex items-center space-x-1">
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span className="text-sm">Login</span>
            </Button>
          </Link>
        )}

        {/* Cart */}
        <Link href="/cart">
          <Button variant="ghost" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-primary">
              {cartCount}
            </Badge>
          </Button>
        </Link>

        {/* Mobile Menu */}
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>

  {/* Map Dialog */}
  <LocationMapDialog
    open={locationDialogOpen}
    onOpenChange={handleLocationDialogOpenChange}
    initialLatitude={latitude}
    initialLongitude={longitude}
    onLocationSelected={handleMapLocationSelected}
  />

  <EditAddressLabelDialog
    open={editAddressDialogOpen}
    onOpenChange={handleEditAddressDialogOpenChange}
    initialAddress={pendingEditAddress}
    onSave={handleEditAddressSave}
  />
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
