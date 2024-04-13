import { NextResponse, NextRequest } from "next/server";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { database } from "@/libraries/firebase";

export async function GET(_request: NextRequest) {
  const firestoreCollectionRef = collection(database, "collections");
  const snapshot = await getDocs(firestoreCollectionRef);

  const collections: CollectionProps[] = snapshot.docs.map((document) => {
    const data = document.data();

    const result: CollectionProps = {
      id: document.id,
      index: data.index,
      title: data.title,
      slug: data.slug,
      campaign_duration: data.campaign_duration,
      collection_type: data.collection_type,
      products: data.products,
      status: data.status,
      visibility: data.visibility,
      date_created: data.date_created,
      last_updated: data.last_updated,
    };

    if (data.image) {
      result.image = data.image;
    }

    return result;
  });

  collections.sort((a, b) => a.index - b.index);

  return NextResponse.json(collections);
}
