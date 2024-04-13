import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type Overlay = {
  name: string;
  isVisible: boolean;
};

type OverlayType = {
  pageName: string;
  overlayName: string;
};

type PageOverlays = {
  [key: string]: Overlay;
};

type Pages = {
  [key: string]: {
    name: string;
    overlays: PageOverlays;
  };
};

type OverlayStoreProps = {
  pages: Pages;
  showOverlay: ({ pageName, overlayName }: OverlayType) => void;
  hideOverlay: ({ pageName, overlayName }: OverlayType) => void;
};

export const useOverlayStore = createWithEqualityFn<OverlayStoreProps>(
  (set) => ({
    pages: {
      post: {
        name: "post",
        overlays: {
          productSizeChart: {
            name: "productSizeChart",
            isVisible: false,
          },
          specialOffer: {
            name: "specialOffer",
            isVisible: false,
          },
        },
      },
    },
    showOverlay: ({ pageName, overlayName }: OverlayType) => {
      set((state) => {
        const updatedState: Pages = { ...state.pages };
        const overlay = updatedState[pageName]?.overlays[overlayName];
        if (overlay) {
          overlay.isVisible = true;
        }
        return { pages: updatedState };
      });
    },
    hideOverlay: ({ pageName, overlayName }: OverlayType) => {
      set((state) => {
        const updatedState: Pages = { ...state.pages };
        const overlay = updatedState[pageName]?.overlays[overlayName];
        if (overlay) {
          overlay.isVisible = false;
        }
        return { pages: updatedState };
      });
    },
  }),
  shallow
);
