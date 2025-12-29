"use client";

import { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { getAddressFromCoordinates } from "@/services/geocoderService";

const containerStyle = {
  width: "100%",
  height: "400px",
};

type GeocoderAddressComponents = {
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  house_number?: string;
  street?: string;
};

type GeocoderAddressResponse = {
  success: boolean;
  error?: boolean;
  location: string;
  address_components?: GeocoderAddressComponents;
};

type LocationMapDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLatitude?: string;
  initialLongitude?: string;
  onLocationSelected: (args: { latitude: string; longitude: string; addressResponse: GeocoderAddressResponse | null }) => void;
};

export function LocationMapDialog({
  open,
  onOpenChange,
  initialLatitude,
  initialLongitude,
  onLocationSelected,
}: LocationMapDialogProps) {
  const [selectedLat, setSelectedLat] = useState<number | null>(
    initialLatitude ? parseFloat(initialLatitude) : null,
  );
  const [selectedLng, setSelectedLng] = useState<number | null>(
    initialLongitude ? parseFloat(initialLongitude) : null,
  );
  const [addressText, setAddressText] = useState<string>("");
  const [loadingAddress, setLoadingAddress] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = {
    lat: selectedLat ?? (initialLatitude ? parseFloat(initialLatitude) : 22.6883834),
    lng: selectedLng ?? (initialLongitude ? parseFloat(initialLongitude) : 75.8284917),
  };

  const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setSelectedLat(lat);
    setSelectedLng(lng);

    setLoadingAddress(true);
    try {
      const res = await getAddressFromCoordinates({
        latitude: String(lat),
        longitude: String(lng),
      });
      if (res && res.success && !res.error) {
        setAddressText(res.location || "");
      } else {
        setAddressText("");
      }
    } catch {
      setAddressText("");
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  const handleConfirm = async () => {
    if (selectedLat == null || selectedLng == null) return;

    setLoadingAddress(true);
    try {
      const res = await getAddressFromCoordinates({
        latitude: String(selectedLat),
        longitude: String(selectedLng),
      });
      onLocationSelected({
        latitude: String(selectedLat),
        longitude: String(selectedLng),
        addressResponse: res,
      });
      onOpenChange(false);
    } catch {
      onLocationSelected({
        latitude: String(selectedLat),
        longitude: String(selectedLng),
        addressResponse: null,
      });
      onOpenChange(false);
    } finally {
      setLoadingAddress(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select your location</DialogTitle>
        </DialogHeader>

        {!isLoaded ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Loading map...</div>
        ) : (
          <div className="space-y-4">
            <div className="w-full h-[400px]">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={16}
                onClick={handleMapClick}
              >
                {selectedLat != null && selectedLng != null && (
                  <Marker position={{ lat: selectedLat, lng: selectedLng }} />
                )}
              </GoogleMap>
            </div>
            <div className="text-sm">
              {loadingAddress && <div>Resolving address...</div>}
              {!loadingAddress && addressText && (
                <div>
                  <span className="font-medium">Selected address:</span> {addressText}
                </div>
              )}
              {!loadingAddress && !addressText && (
                <div className="text-muted-foreground text-xs">
                  Click on the map to choose a point.
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={selectedLat == null || selectedLng == null || loadingAddress}
             >
                Use this location
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
