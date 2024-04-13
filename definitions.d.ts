type ArticleProps = {
  id: string;
  poster: string;
  images: string[];
  status: string;
  title: string;
  visibility: string;
  content: string;
  slug: string;
  meta_description: string;
  date_created: string;
  last_updated: string;
};

type SizeChartProps = {
  columns: { index: number; name: string }[];
  entry_labels: { index: number; name: string }[];
  sizes: {
    measurements: {
      [key: string]: {
        in: string;
        cm: string;
      };
    };
    size: string;
  }[];
};

type ProductProps = {
  id: string;
  name: string;
  slug: string;
  price: string;
  poster: string;
  images: string[] | null;
  colors: { name: string; image: string }[] | null;
  sizes: SizeChartProps | null;
  description: string | null;
  status: string;
  visibility: string;
  date_created: string;
  last_updated: string;
};

type ProductCategoryProps = {
  id: string;
  index: number;
  name: string;
};

type CollectionProps = {
  id: string;
  index: number;
  title: string;
  slug: string;
  campaign_duration: {
    start_date: string;
    end_date: string;
  };
  collection_type: string;
  image?: string;
  products: ProductProps[];
  status: string;
  visibility: string;
  date_created: string;
  last_updated: string;
};

type CategoryProps = {
  id: string;
  index: number;
  name: string;
  image: string;
  visibility: string;
};

type GenerateResponseProps = {
  status: {
    code: number;
    flag: "success" | "failed";
    message: string;
  };
};

type OfferProductProps = {
  id: string;
  index: number;
};

type OfferProps = {
  id: string;
  poster: string;
  price: string;
  sale_price: string;
  products: OfferProductProps[];
  visibility: string;
  date_created: string;
  last_updated: string;
};
