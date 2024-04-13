"use server";

import { database } from "@/libraries/firebase";
import { setDoc, doc } from "firebase/firestore";
import { customAlphabet } from "nanoid";
import { currentTimestamp } from "@/libraries/utils";
import { revalidatePath } from "next/cache";

type newArticleProps = {
  title: string;
  slug: string;
};

export async function CreateArticleAction(data: newArticleProps) {
  try {
    const nanoid = customAlphabet("1234567890", 5);
    const documentRef = doc(database, "articles", nanoid());

    const article = {
      title: data.title,
      slug: data.slug,
      meta_description: null,
      poster: null,
      images: [],
      content: null,
      status: "Draft",
      visibility: "Hidden",
      last_updated: currentTimestamp(),
      date_created: currentTimestamp(),
    };

    await setDoc(documentRef, article);
    console.log("New article added with ID:", documentRef.id);
    revalidatePath("/admin/blog");
  } catch (error) {
    console.error("Error saving article:", error);
  }
}
