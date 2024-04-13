import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type SelectedCollectionProduct = {
  collectionId: string;
  productId: string;
  name?: string;
  index?: string;
};

type CollectionStoreProps = {
  selectedCollectionProduct: SelectedCollectionProduct;
  setSelectedCollectionProduct: (product: SelectedCollectionProduct) => void;
};

export const useChangeProductIndexStore =
  createWithEqualityFn<CollectionStoreProps>(
    (set) => ({
      selectedCollectionProduct: {
        collectionId: "",
        productId: "",
        index: "",
        name: "",
      },
      setSelectedCollectionProduct: (product) => {
        set({ selectedCollectionProduct: product });
      },
    }),
    shallow
  );
