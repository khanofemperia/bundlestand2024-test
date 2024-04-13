import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { database } from "@/libraries/firebase";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const docRef = doc(database, "products", params.id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const product = docSnap.data();
    const responseData = {
      message: "Get product",
      product: {
        id: docSnap.id,
        ...product,
      },
    };
    return NextResponse.json(responseData);
  } else {
    const responseData = {
      message: "Product not found",
      product: null,
    };
    return NextResponse.json(responseData);
  }
}
