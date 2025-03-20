import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BreadCrumbItem } from "src/components/layouts/BreadCrumb";

interface RoutesState {
  breadCrumbPath: BreadCrumbItem[] | null;
  activePageName: string;
  activeFirstLevel: string;
  activeSecondLevel: string;
  browserTitle: string;
}

const initialState: RoutesState = {
  breadCrumbPath: null,
  activePageName: "",
  activeFirstLevel: "",
  activeSecondLevel: "",
  browserTitle: "",
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    updateBreadCrumbPath: (state, action: PayloadAction<BreadCrumbItem[]>) => {
      state.breadCrumbPath = action.payload;
    },
    addPathToBreadcrumb: (state, action: PayloadAction<BreadCrumbItem>) => {
      if (state.breadCrumbPath) {
        state.breadCrumbPath.push(action.payload);
      } else {
        state.breadCrumbPath = [action.payload];
      }
    },
    updateActivePageName: (state, action: PayloadAction<string>) => {
      state.activePageName = action.payload;
    },
    updateActiveFirstLevel: (state, action: PayloadAction<string>) => {
      state.activeFirstLevel = action.payload;
    },
    updateActiveSecondLevel: (state, action: PayloadAction<string>) => {
      state.activeSecondLevel = action.payload;
    },
    updateBrowserTitle: (state, action: PayloadAction<string>) => {
      state.browserTitle = action.payload;
    },
  },
});

export const {
  updateBreadCrumbPath,
  addPathToBreadcrumb,
  updateActivePageName,
  updateActiveFirstLevel,
  updateActiveSecondLevel,
  updateBrowserTitle,
} = routesSlice.actions;
export default routesSlice.reducer;
