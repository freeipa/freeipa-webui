import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "src/store/store";
// User data (JSON file)
import servicesJson from "./services.json";
// Data types
import { Service } from "src/utils/datatypes/globalDataTypes";

interface ServicesState {
  servicesList: Service[];
}

const initialState: ServicesState = {
  servicesList: servicesJson,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    addService: (state, action: PayloadAction<Service>) => {
      const newService = action.payload;
      state.servicesList.push({
        id: newService.id,
        serviceType: newService.serviceType,
        host: newService.host,
      });
    },
    removeService: (state, action: PayloadAction<string>) => {
      const serviceId = action.payload;
      const updatedServiceList = state.servicesList.filter(
        (service) => service.id !== serviceId
      );
      // If not empty, replace list by new array
      if (updatedServiceList) {
        state.servicesList = updatedServiceList;
      }
    },
  },
});

export default servicesSlice.reducer;
export const { addService, removeService } = servicesSlice.actions;
