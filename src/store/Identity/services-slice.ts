import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// Data types
import { Service } from "../../utils/datatypes/globalDataTypes";

interface ServicesState {
  servicesList: Service[];
}

const initialState: ServicesState = {
  servicesList: [],
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    updateServicesList: (state, action: PayloadAction<Service[]>) => {
      const updatedServicesList = action.payload;
      state.servicesList = updatedServicesList;
    },
    addService: (state, action: PayloadAction<Service>) => {
      const newService = action.payload;
      state.servicesList.push({ ...newService });
    },
    removeService: (state, action: PayloadAction<string>) => {
      const serviceId = action.payload;
      const updatedServiceList = state.servicesList.filter(
        (service) => service.krbcanonicalname !== serviceId
      );
      // If not empty, replace list by new array
      if (updatedServiceList) {
        state.servicesList = updatedServiceList;
      }
    },
  },
});

export default servicesSlice.reducer;
export const { updateServicesList, addService, removeService } =
  servicesSlice.actions;
