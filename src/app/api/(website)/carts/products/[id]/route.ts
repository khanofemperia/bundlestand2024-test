import { NextRequest, NextResponse } from "next/server";
import { getDocs, collection, query, where } from "firebase/firestore";
import { database } from "@/libraries/firebase";
import { cookies } from "next/headers";

type ProductInCartProps = {
  id: string;
  color: string;
  size: string;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const deviceIdentifier = cookies().get("device_identifier")?.value;

  if (!deviceIdentifier) {
    return NextResponse.json({ isInCart: false, productInCart: null });
  }

  const collectionRef = collection(database, "carts");
  const snapshot = await getDocs(
    query(collectionRef, where("device_identifier", "==", deviceIdentifier))
  );

  if (snapshot.empty) {
    return NextResponse.json({ isInCart: false, productInCart: null });
  }

  const cartData = snapshot.docs[0].data();
  const productsInCart = cartData.products || [];

  const isInCart = productsInCart.some(
    (product: ProductInCartProps) => product.id === productId
  );

  let productInCart = null;
  if (isInCart) {
    productInCart = productsInCart.find(
      (product: ProductInCartProps) => product.id === productId
    );
  }

  return NextResponse.json({ isInCart, productInCart });
}
