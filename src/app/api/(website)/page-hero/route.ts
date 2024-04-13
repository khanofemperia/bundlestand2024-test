import { NextResponse, NextRequest } from "next/server";
import { collection, getDocs, where, query } from "firebase/firestore";
import { database } from "@/libraries/firebase";

export async function GET(_request: NextRequest) {
  const collectionRef = collection(database, "page_hero");
  const q = query(collectionRef, where("visibility", "==", "VISIBLE"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return NextResponse.json({}, { status: 404 });
  }

  const data = snapshot.docs[0].data();
  const responseData = {
    id: snapshot.docs[0].id,
    title: data.title,
    visibility: data.visibility,
    image: data.image,
    url: data.url,
  };

  return NextResponse.json(responseData);
}
