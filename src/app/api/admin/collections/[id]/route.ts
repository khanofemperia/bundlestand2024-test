import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "@/libraries/firebase";

type CollectionProductsProps = {
  id: string;
  name: string;
  price: string;
  poster: string;
  slug: string;
  visibility: string;
};

type UpdatedProductsProps = {
  id: string;
  name: string;
  index: number;
  price: string;
  poster: string;
  slug: string;
  visibility: string;
};

type CollectionDataProps = {
  image: string;
  title: string;
  slug: string;
  campaign_duration: {
    start_date: string;
    end_date: string;
  };
  visibility: string;
  status: string;
  collection_type: string;
  index: number;
  last_updated: string;
  date_created: string;
  products: { id: string; index: number }[];
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const docRef = doc(database, "collections", params.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const responseData = {
      message: "Collection not found",
      collection: null,
    };
    return NextResponse.json(responseData, { status: 404 });
  }

  const collection = docSnap.data() as CollectionDataProps;
  const promises = await Promise.all(
    collection.products.map(async (product) => {
      const productDocRef = doc(database, "products", product.id);
      const productDocSnap = await getDoc(productDocRef);

      if (productDocSnap.exists()) {
        const productData = productDocSnap.data() as CollectionProductsProps;
        return {
          id: productDocSnap.id,
          index: product.index,
          poster: productData.poster,
          name: productData.name,
          price: productData.price,
          slug: productData.slug,
          visibility: productData.visibility,
        };
      }

      return null;
    })
  );

  const filteredProducts = promises.filter((product) => product !== null);
  filteredProducts.sort((a, b) => (a?.index ?? 0) - (b?.index ?? 0));

  const updatedProducts = filteredProducts.map((product, index) => ({
    ...product,
    index: index + 1,
  }));

  const processedProducts = updatedProducts.map((product) => ({
    id: product!.id,
    index: product.index,
  }));

  await updateDoc(docRef, { products: processedProducts });

  const responseData = {
    message: "Get collection",
    collection: {
      ...collection,
      products: updatedProducts as UpdatedProductsProps[],
    },
  };

  return NextResponse.json(responseData, { status: 200 });
}
