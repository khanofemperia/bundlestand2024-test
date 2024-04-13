import { NextResponse, NextRequest } from "next/server";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import { database } from "@/libraries/firebase";

interface ProductDetails {
  id: string;
  name: string;
  price: number;
  description: string;
  poster: string;
  images: string[];
  status: string;
  visibility: string;
  colors: string[];
  sizes: string[];
  slug: string;
  date_created: string;
  last_updated: string;
  index: number;
}

interface CollectionProps {
  id: string;
  index: number;
  title: string;
  slug: string;
  campaign_duration: string;
  collection_type: string;
  products: ProductDetails[];
  status: string;
  visibility: string;
  date_created: string;
  last_updated: string;
  image?: string;
}

async function getProductDetails(
  data: { id: string; index: number }[]
): Promise<ProductDetails[]> {
  const productDetails: ProductDetails[] = [];

  for (const product of data) {
    const productId = product.id;
    const productDocRef = doc(database, "products", productId);
    const snapshot = await getDoc(productDocRef);

    if (snapshot.exists()) {
      const data: DocumentData = snapshot.data();

      const productDetail: ProductDetails = {
        id: snapshot.id,
        name: data.name,
        price: data.price,
        description: data.description,
        poster: data.poster,
        images: data.images,
        status: data.status,
        visibility: data.visibility,
        colors: data.colors,
        sizes: data.sizes,
        slug: data.slug,
        date_created: data.date_created,
        last_updated: data.last_updated,
        index: product.index,
      };

      productDetails.push(productDetail);
    }
  }

  productDetails.sort((a, b) => a.index - b.index);

  return productDetails;
}

export async function GET(_request: NextRequest): Promise<NextResponse> {
  const firestoreCollectionRef = collection(database, "collections");
  const snapshot = await getDocs(firestoreCollectionRef);

  const collections: CollectionProps[] = await Promise.all(
    snapshot.docs.map(async (document) => {
      const data: DocumentData = document.data();

      const productDetails = await getProductDetails(data.products || []);

      const result: CollectionProps = {
        id: document.id,
        index: data.index,
        title: data.title,
        slug: data.slug,
        campaign_duration: data.campaign_duration,
        collection_type: data.collection_type,
        products: productDetails,
        status: data.status,
        visibility: data.visibility,
        date_created: data.date_created,
        last_updated: data.last_updated,
        image: data.image,
      };

      return result;
    })
  );

  collections.sort((a, b) => a.index - b.index);

  return NextResponse.json(collections);
}
