import { NextResponse, NextRequest } from "next/server";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { database } from "@/libraries/firebase";
import { customAlphabet } from "nanoid";

interface PageHeroProps {
  image?: string | null;
  title?: string | null;
  url?: string | null;
  visibility: string;
}

interface ResponseDataProps {
  id: string;
  image: string | null;
  title: string | null;
  url: string | null;
  visibility: string;
}

const defaultPageHero = {
  image: null,
  title: null,
  url: null,
  visibility: "HIDDEN",
};

async function createOrUpdatePageHero() {
  const collectionRef = collection(database, "page_hero");
  const snapshot = await getDocs(collectionRef);

  if (snapshot.empty) {
    const nanoid = customAlphabet("1234567890", 5);
    const id = nanoid();
    const pageHeroRef = doc(database, "page_hero", id);
    await setDoc(pageHeroRef, defaultPageHero);
  } else {
    // If the collection is not empty, update the existing document with missing fields
    const existingPageHeroDoc = snapshot.docs[0];
    const existingPageHeroData = existingPageHeroDoc.data() as PageHeroProps;
    const updatedPageHeroData: PageHeroProps = {
      ...defaultPageHero,
      ...existingPageHeroData,
    };

    await setDoc(existingPageHeroDoc.ref, updatedPageHeroData);
  }
}

export async function GET(_request: NextRequest) {
  await createOrUpdatePageHero();

  const pageHeroCollection = collection(database, "page_hero");
  const snapshot = await getDocs(pageHeroCollection);
  const document = snapshot.docs[0];
  const data = { id: document.id, ...document.data() } as ResponseDataProps;

  return NextResponse.json(data, { status: 200 });
}
