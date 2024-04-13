import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type SelectedProduct = {
  offerId: string;
  productId: string;
  productName?: string;
  productIndex?: string;
};

type PageHeroProps = {
  selectedProduct: SelectedProduct;
  setSelectedProduct: (product: SelectedProduct) => void;
};

export const useOfferStore = createWithEqualityFn<PageHeroProps>(
  (set) => ({
    selectedProduct: {
      offerId: "",
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
