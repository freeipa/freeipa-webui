import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import ManagedAlerts from "src/components/ManagedAlerts";
import { setupStore } from "src/store/store";
import { useSearchParams } from "react-router";
import { MemoryRouter } from "react-router";

export function renderWithAlerts(
  ui: React.ReactElement,
  renderOptions: RenderOptions = {}
) {
  const store = setupStore();

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <ManagedAlerts />
      {children}
    </Provider>
  );

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

const SearchParamsProbe = ({
  onParams,
}: {
  onParams: (params: URLSearchParams) => void;
}) => {
  const [params] = useSearchParams();
  onParams(params);
  return null;
};

export const renderWithRouter = (
  ui: React.ReactElement,
  initialEntry = "/"
) => {
  let latestParams = new URLSearchParams();
  const result = render(
    <MemoryRouter initialEntries={[initialEntry]}>
      {ui}
      <SearchParamsProbe
        onParams={(params) => {
          latestParams = params;
        }}
      />
    </MemoryRouter>
  );
  return {
    ...result,
    getParams: () => latestParams,
  };
};
