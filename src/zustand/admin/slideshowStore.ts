import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type SelectedArticle = {
  id: string;
};

type SlideshowStoreProps = {
  selectedArticle: SelectedArticle;
  setSelectedArticle: (article: SelectedArticle) => void;
};

export const useSlideshowStore = createWithEqualityFn<SlideshowStoreProps>(
  (set) => ({
    selectedArticle: { id: "" },
    setSelectedArticle: (article) => {
      set({ selectedArticle: article });
    },
  }),
  shallow
);
