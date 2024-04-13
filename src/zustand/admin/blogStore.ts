import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type SelectedHomepageArticle = {
  id: string;
  title?: string;
  index?: string;
};

type BlogStoreProps = {
  selectedHomepageArticle: SelectedHomepageArticle;
  setSelectedHomepageArticle: (article: SelectedHomepageArticle) => void;
};

export const useBlogStore = createWithEqualityFn<BlogStoreProps>(
  (set) => ({
    selectedHomepageArticle: { id: "", index: "0", title: "" },
    setSelectedHomepageArticle: (article) => {
      set({ selectedHomepageArticle: article });
    },
  }),
  shallow
);
