import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type ProductDetailsProps = {
  id: string;
  name: string;
  price: string;
  poster: string;
  images: string[] | null;
  description: string | null;
  colors:
    | {
        name: string;
        image: string;
      }[]
    | null;
  sizes: SizeChartProps | null;
  slug: string;
};

type ProductInCartProps = {
  id: string;
  color: string;
  size: string;
};

type ProductPreviewStoreProps = {
  isVisible: boolean;
  selectedProduct: ProductDetailsProps | null;
  isInCart: boolean;
  productInCart: ProductInCartProps | null;
  showOverlay: () => void;
  hideOverlay: () => void;
  setSelectedProduct: (
    product: ProductDetailsProps,
    isInCart: boolean,
    productInCart: ProductInCartProps | null
  ) => void;
};

export const useQuickviewStore = createWithEqualityFn<ProductPreviewStoreProps>(
  (set) => ({
    isVisible: false,
    selectedProduct: null,
    isInCart: false,
    productInCart: null,
    showOverlay: () => set({ isVisible: true }),
    hideOverlay: () => set({ isVisible: false }),
    setSelectedProduct: (
      product: ProductDetailsProps,
      isInCart: boolean,
      productInCart: ProductInCartProps | null
    ) => set({ selectedProduct: product, isInCart, productInCart }),
  }),
  shallow
);
