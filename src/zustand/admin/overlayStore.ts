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
      home: {
        name: "home",
        overlays: {
          articleImageSlideshow: {
            name: "articleImageSlideshow",
            isVisible: false,
          },
        },
      },
      blog: {
        name: "blog",
        overlays: {
          newArticle: {
            name: "newArticle",
            isVisible: false,
          },
          arrangeHomepageArticles: {
            name: "arrangeHomepageArticles",
            isVisible: false,
          },
          addHomepageArticles: {
            name: "addHomepageArticles",
            isVisible: false,
          },
          removeHomepageArticles: {
            name: "removeHomepageArticles",
            isVisible: false,
          },
          changeArticleIndex: {
            name: "changeArticleIndex",
            isVisible: false,
          },
        },
      },
      editProduct: {
        name: "editProduct",
        overlays: {
          basicDetails: {
            name: "basicDetails",
            isVisible: false,
          },
          poster: {
            name: "poster",
            isVisible: false,
          },
          images: {
            name: "images",
            isVisible: false,
          },
          sizes: {
            name: "sizes",
            isVisible: false,
          },
          colors: {
            name: "colors",
            isVisible: false,
          },
          description: {
            name: "description",
            isVisible: false,
          },
          settings: {
            name: "settings",
            isVisible: false,
          },
        },
      },
      editArticle: {
        name: "editArticle",
        overlays: {
          basicDetails: {
            name: "basicDetails",
            isVisible: false,
          },
          poster: {
            name: "poster",
            isVisible: false,
          },
          images: {
            name: "images",
            isVisible: false,
          },
          settings: {
            name: "settings",
            isVisible: false,
          },
          content: {
            name: "content",
            isVisible: false,
          },
        },
      },
      products: {
        name: "products",
        overlays: {
          newProduct: {
            name: "newProduct",
            isVisible: false,
          },
        },
      },
      offers: {
        name: "offers",
        overlays: {
          newOffer: {
            name: "newOffer",
            isVisible: false,
          },
        },
      },
      editOffer: {
        name: "editOffer",
        overlays: {
          offerProducts: {
            name: "offerProducts",
            isVisible: false,
          },
          removeProduct: {
            name: "removeProduct",
            isVisible: false,
          },
          changeProductIndex: {
            name: "changeProductIndex",
            isVisible: false,
          },
        },
      },
      storefront: {
        name: "storefront",
        overlays: {
          pageHero: {
            name: "pageHero",
            isVisible: false,
          },
          newCollection: {
            name: "newCollection",
            isVisible: false,
          },
          featuredCollections: {
            name: "featuredCollections",
            isVisible: false,
          },
          promotionalBanners: {
            name: "promotionalBanners",
            isVisible: false,
          },
          toggleCollections: {
            name: "toggleCollections",
            isVisible: false,
          },
          setupProductCategories: {
            name: "setupProductCategories",
            isVisible: false,
          },
          editPageHero: {
            name: "editPageHero",
            isVisible: false,
          },
          removeProduct: {
            name: "removeProduct",
            isVisible: false,
          },
          changeProductIndex: {
            name: "changeProductIndex",
            isVisible: false,
          },
          changeCollectionIndex: {
            name: "changeCollectionIndex",
            isVisible: false,
          },
        },
      },
      editCollection: {
        name: "editCollection",
        overlays: {
          basicDetails: {
            name: "basicDetails",
            isVisible: false,
          },
          heroImage: {
            name: "heroImage",
            isVisible: false,
          },
          bannerImage: {
            name: "bannerImage",
            isVisible: false,
          },
          campaignDuration: {
            name: "campaignDuration",
            isVisible: false,
          },
          collectionProducts: {
            name: "collectionProducts",
            isVisible: false,
          },
          settings: {
            name: "settings",
            isVisible: false,
          },
          addCollectionProducts: {
            name: "addCollectionProducts",
            isVisible: false,
          },
          removeCollectionProducts: {
            name: "removeCollectionProducts",
            isVisible: false,
          },
          changeProductIndex: {
            name: "changeProductIndex",
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
