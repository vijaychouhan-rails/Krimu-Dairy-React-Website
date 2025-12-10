import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  latitude: string;
  longitude: string;
}

const initialState: LocationState = {
  latitude: "",
  longitude: "",
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
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
