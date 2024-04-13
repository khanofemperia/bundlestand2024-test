import { NextResponse, NextRequest } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { database } from "@/libraries/firebase";

export async function GET(_request: NextRequest) {
  const collectionRef = collection(database, "special_offers");
  const snapshot = await getDocs(collectionRef);

  const offers: OfferProps[] = snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      poster: data.poster,
      price: data.price,
      sale_price: data.sale_price,
      products: data.products,
      visibility: data.visibility,
      date_created: data.date_created,
      last_updated: data.last_updated,
    };
  });

  return NextResponse.json(offers);
}
