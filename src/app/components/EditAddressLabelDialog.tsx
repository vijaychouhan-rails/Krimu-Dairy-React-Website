"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export type EditAddressData = {
  latitude: string;
  longitude: string;
  location: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  house_number?: string;
  street?: string;
  landmark?: string;
};

interface EditAddressLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAddress: EditAddressData | null;
  onSave: (data: EditAddressData) => void;
}

export function EditAddressLabelDialog({
  open,
  onOpenChange,
  initialAddress,
  onSave,
}: EditAddressLabelDialogProps) {
  const [fullAddress, setFullAddress] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (!initialAddress) return;

    setFullAddress(initialAddress.location || "");
    setHouseNumber(initialAddress.house_number || "");
    setStreet(initialAddress.street || "");
    setLandmark(initialAddress.landmark || "");
    setCity(initialAddress.city || "");
    setState(initialAddress.state || "");
    setPostalCode(initialAddress.postal_code || "");
    setCountry(initialAddress.country || "");
  }, [initialAddress]);

  const handleSubmit = () => {
    if (!initialAddress) return;

    if (!city || !state || !postalCode || !country) {
      return;
    }

    onSave({
      latitude: initialAddress.latitude,
      longitude: initialAddress.longitude,
      location: fullAddress || initialAddress.location,
      city,
      state,
      postal_code: postalCode,
      country,
      house_number: houseNumber,
      street,
      landmark,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit address label</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <p className="text-xs text-muted-foreground">
            Note: only label will change, latitude and longitude will remain same.
          </p>

          <div className="space-y-1">
            <label className="text-xs font-medium">Full address label</label>
            <Input value={fullAddress} disabled readOnly />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">
              House / Building number (optional)
            </label>
            <Input
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              placeholder="House or building number"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Area / Street / Sector</label>
            <Input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Area, street or sector"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Landmark</label>
            <Input
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Nearby landmark"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">City / Town *</label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City or town"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">State *</label>
              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Pincode *</label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Pincode"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Country *</label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country name"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button type="button" size="sm" onClick={handleSubmit}>
              Save location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
