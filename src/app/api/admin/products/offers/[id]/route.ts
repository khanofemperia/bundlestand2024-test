import { NextRequest, NextResponse } from "next/server";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { database } from "@/libraries/firebase";

type OfferProductProps = {
  id: string;
  index: number;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const docRef = doc(database, "special_offers", params.id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const offer = docSnap.data();

    const productIds = offer.products.map(
      (product: OfferProductProps) => product.id
    );
    const productsQuery = query(
      collection(database, "products"),
      where("id", "in", productIds)
    );
    const productDocs = await getDocs(productsQuery);

    const products = productDocs.docs.map((doc) => {
      const data = doc.data();
      const productIndex = offer.products.findIndex(
        (product: OfferProductProps) => product.id === data.id
      );

      return {
        id: data.id,
        index: offer.products[productIndex].index,
        poster: data.poster,
        name: data.name,
        price: data.price,
      };
    });

    products.sort((a, b) => a.index - b.index);

    const responseData = {
      message: "Get offer",
      offer: {
        id: docSnap.id,
        ...offer,
        products: products,
      },
    };
    return NextResponse.json(responseData);
  } else {
    const responseData = {
      message: "Offer not found",
      offer: null,
    };
    return NextResponse.json(responseData);
  }
}
