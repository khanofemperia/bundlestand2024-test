import { NextResponse, NextRequest } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { database } from "@/libraries/firebase";

export async function GET(_request: NextRequest) {
  const collectionRef = collection(database, "products");
  const snapshot = await getDocs(collectionRef);

  const products: ProductProps[] = snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      name: data.name,
      price: data.price,
      poster: data.poster,
      images: data.images,
      description: data.description,
      status: data.status,
      visibility: data.visibility,
      colors: data.colors,
      sizes: data.sizes,
      slug: data.slug,
      date_created: data.date_created,
      last_updated: data.last_updated,
    };
  });

  products.sort(
    (a, b) =>
      new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
  );

  return NextResponse.json(products);
}
