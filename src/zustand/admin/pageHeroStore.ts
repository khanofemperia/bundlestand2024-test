import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type SelectedProduct = {
  pageHeroId: string;
  productId: string;
  productName?: string;
  productIndex?: string;
};

type PageHeroProps = {
  selectedProduct: SelectedProduct;
  setSelectedProduct: (product: SelectedProduct) => void;
};

export const usePageHeroStore = createWithEqualityFn<PageHeroProps>(
  (set) => ({
    selectedProduct: {
      pageHeroId: "",
      productId: "",
      productIndex: "",
      productName: "",
    },
    setSelectedProduct: (product) => {
      set({ selectedProduct: product });
    },
  }),
  shallow
);
