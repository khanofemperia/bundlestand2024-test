import { NextResponse, NextRequest } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { database } from "@/libraries/firebase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const articleDocRef = doc(database, "articles", params.id);
  const productDocRef = doc(database, "products", params.id);

  const [articleDocSnap, productDocSnap] = await Promise.all([
    getDoc(articleDocRef),
    getDoc(productDocRef),
  ]);

  let post = null;
  let contentType = null;

  if (articleDocSnap.exists()) {
    post = articleDocSnap.data();
    contentType = "article";
  } else if (productDocSnap.exists()) {
    post = productDocSnap.data();
    contentType = "product";
  } else {
    const data = {
      message: "Post not found",
      post,
      contentType,
    };
    return NextResponse.json(data, { status: 404 });
  }

  const data = {
    message: "Get post",
    post,
    contentType,
  };

  return NextResponse.json(data, { status: 200 });
}
