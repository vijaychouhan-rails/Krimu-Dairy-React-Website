"use client";

import { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  getAddressFromCoordinates,
  searchLocation,
} from "@/services/geocoderService";

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

type SearchLocationResponse = {
  coordinates?: [number | string, number | string] | null;
};

type LocationMapDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLatitude?: string;
  initialLongitude?: string;
  onLocationSelected: (args: {
    latitude: string;
    longitude: string;
    addressResponse: GeocoderAddressResponse | null;
  }) => void;
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
  const [addressText, setAddressText] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = {
    lat:
      selectedLat ??
      (initialLatitude ? parseFloat(initialLatitude) : 22.6883834),
    lng:
      selectedLng ??
      (initialLongitude ? parseFloat(initialLongitude) : 75.8284917),
  };

  /**
   * SINGLE SOURCE OF TRUTH
   * Update marker + reverse geocode
   */
  const updateLocationByCoords = useCallback(
    async (lat: number, lng: number) => {
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
    },
    [],
  );

  /**
   * SEARCH ADDRESS → COORDINATES → ADDRESS
   */
  const handleSearch = useCallback(async () => {
    const query = searchText.trim();
    if (!query) return;

    setSearchLoading(true);
    try {
      const res: SearchLocationResponse = await searchLocation({ address: query });
      const coords = res.coordinates;

      if (Array.isArray(coords) && coords.length >= 2) {
        const lat = Number(coords[0]);
        const lng = Number(coords[1]);

        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
          await updateLocationByCoords(lat, lng);
        }
      }
    } catch {
      // ignore
    } finally {
      setSearchLoading(false);
    }
  }, [searchText, updateLocationByCoords]);

  /**
   * MAP CLICK
   */
  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      await updateLocationByCoords(lat, lng);
    },
    [updateLocationByCoords],
  );

  /**
   * CONFIRM LOCATION
   */
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

      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "krimu:lastLocation",
            JSON.stringify({
              latitude: String(selectedLat),
              longitude: String(selectedLng),
              location: res?.location ?? "",
              address_components: res?.address_components ?? null,
            }),
          );
        }
      } catch {
      }
    } catch {
      onLocationSelected({
        latitude: String(selectedLat),
        longitude: String(selectedLng),
        addressResponse: null,
      });
    } finally {
      setLoadingAddress(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select your location</DialogTitle>
        </DialogHeader>

        {!isLoaded ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading map...
          </div>
        ) : (
          <div className="space-y-4">
            {/* SEARCH */}
            <div className="flex gap-2">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search location by address"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <Button
                size="sm"
                onClick={handleSearch}
                disabled={searchLoading || !searchText.trim()}
              >
                {searchLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* MAP */}
            <div className="w-full h-[400px]">
              <GoogleMap
                key={`${selectedLat}-${selectedLng}`}
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

            {/* ADDRESS */}
            <div className="text-sm">
              {loadingAddress && <div>Resolving address...</div>}
              {!loadingAddress && addressText && (
                <div>
                  <span className="font-medium">
                    Selected address:
                  </span>{" "}
                  {addressText}
                </div>
              )}
              {!loadingAddress && !addressText && (
                <div className="text-muted-foreground text-xs">
                  Click on the map or search an address.
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={
                  selectedLat == null ||
                  selectedLng == null ||
                  loadingAddress
                }
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
