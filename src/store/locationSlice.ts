import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  latitude: string;
  longitude: string;
  location: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  house_number: string;
  street: string;
  landmark: string;
}

const initialState: LocationState = {
  latitude: "",
  longitude: "",
  location: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  house_number: "",
  street: "",
  landmark: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (
      state,
      action: PayloadAction<{ latitude: string; longitude: string }>
    ) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setLocationAddress: (
      state,
      action: PayloadAction<{
        location?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
        house_number?: string;
        street?: string;
        landmark?: string;
      }>
    ) => {
      if (action.payload.location !== undefined) state.location = action.payload.location;
      if (action.payload.city !== undefined) state.city = action.payload.city;
      if (action.payload.state !== undefined) state.state = action.payload.state;
      if (action.payload.postal_code !== undefined) state.postal_code = action.payload.postal_code;
      if (action.payload.country !== undefined) state.country = action.payload.country;
      if (action.payload.house_number !== undefined) state.house_number = action.payload.house_number;
      if (action.payload.street !== undefined) state.street = action.payload.street;
      if (action.payload.landmark !== undefined) state.landmark = action.payload.landmark;
    },
  },
});

export const { setLocation, setLocationAddress } = locationSlice.actions;
export default locationSlice.reducer;
