import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { database } from "@/libraries/firebase";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const docRef = doc(database, "articles", params.id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const article = docSnap.data();
    const responseData = {
      message: "Get article",
      article,
    };
    return NextResponse.json(responseData, { status: 200 });
  } else {
    const responseData = {
      message: "Article not found",
      article: null,
    };
    return NextResponse.json(responseData, { status: 404 });
  }
}
