import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type SelectedProductCategory = {
  id: string;
  name?: string;
  index?: string;
};

type ProductCategoryStoreProps = {
  selectedProductCategory: SelectedProductCategory;
  setSelectedProductCategory: (category: SelectedProductCategory) => void;
  categories: ProductCategoryProps[];
  setCategories: (categories: ProductCategoryProps[]) => void;
};

export const useProductCategoryStore =
  createWithEqualityFn<ProductCategoryStoreProps>(
    (set) => ({
      selectedProductCategory: { id: "", index: "0", name: "" },
      setSelectedProductCategory: (category) => {
        set({ selectedProductCategory: category });
      },
      categories: [],
      setCategories: (categories) => set({ categories }),
    }),
    shallow
  );
