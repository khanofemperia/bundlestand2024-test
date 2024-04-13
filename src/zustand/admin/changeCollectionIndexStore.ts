import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type SelectedCollectionProps = {
  id: string;
  title?: string;
  index?: string;
};

type CollectionStoreProps = {
  selectedCollection: SelectedCollectionProps;
  setSelectedCollection: (collection: SelectedCollectionProps) => void;
};

export const useChangeCollectionIndexStore =
  createWithEqualityFn<CollectionStoreProps>(
    (set) => ({
      selectedCollection: {
        id: "",
        index: "",
        title: "",
      },
      setSelectedCollection: (collection) => {
        set({ selectedCollection: collection });
      },
    }),
    shallow
  );
