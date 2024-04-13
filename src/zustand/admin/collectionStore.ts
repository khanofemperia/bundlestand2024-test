import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type SelectedCollectionProduct = {
  id: string;
  name?: string;
  index?: number;
};

type CollectionStoreProps = {
  selectedCollectionProduct: SelectedCollectionProduct;
  setSelectedCollectionProduct: (product: SelectedCollectionProduct) => void;
};

export const useCollectionStore = createWithEqualityFn<CollectionStoreProps>(
  (set) => ({
    selectedCollectionProduct: { id: "", index: 0, name: "" },
    setSelectedCollectionProduct: (product) => {
      set({ selectedCollectionProduct: product });
    },
  }),
  shallow
);
