import { NextRequest, NextResponse } from "next/server";
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { database } from "@/libraries/firebase";
import { statusCodes } from "@/libraries/utils";

function generateResponse(
  code: number,
  message: string
): GenerateResponseProps {
  return {
    status: {
      code,
      flag: code === statusCodes.success.code ? "success" : "failed",
      message,
    },
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { device_identifier: string } }
) {
  const collectionRef = collection(database, "carts");
  const snapshot = await getDocs(
    query(
      collectionRef,
      where("device_identifier", "==", params.device_identifier)
    )
  );

  if (snapshot.empty) {
    return NextResponse.json({});
  }

  const cart = snapshot.docs[0].data();

  return NextResponse.json(cart);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { device_identifier: string } }
) {
  try {
    const collectionRef = collection(database, "carts");
    const snapshot = await getDocs(
      query(
        collectionRef,
        where("device_identifier", "==", params.device_identifier)
      )
    );

    if (snapshot.empty) {
      return NextResponse.json(
        generateResponse(statusCodes.failed.code, "Cart not found")
      );
    }

    const updatedCartData = await request.json();

    const cartDoc = snapshot.docs[0].ref;
    await updateDoc(cartDoc, {
      products: updatedCartData.products,
      last_updated: updatedCartData.last_updated,
    });

    return NextResponse.json(
      generateResponse(statusCodes.success.code, "Item added to cart")
    );
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      generateResponse(statusCodes.failed.code, "Internal Server Error")
    );
  }
}
