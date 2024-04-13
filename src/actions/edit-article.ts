"use server";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { database } from "@/libraries/firebase";
import { currentTimestamp } from "@/libraries/utils";
import { revalidatePath } from "next/cache";

type EditArticle = {
  id: string;
  poster?: string;
  images?: string[];
  status?: string;
  title?: string;
  visibility?: string;
  content?: string;
  slug?: string;
  meta_description?: string;
};

export default async function EditArticleAction(data: EditArticle) {
  const articleRef = doc(database, "articles", data.id);
  const snapshot = await getDoc(articleRef);

  if (snapshot.exists()) {
    const existingArticle = snapshot.data();

    const updatedArticle = {
      ...existingArticle,
      ...data,
      last_updated: currentTimestamp(),
    };

    await setDoc(articleRef, updatedArticle);
    console.log("Updated article successfully");

    const synchronizeData = async () => {
      const homepageArticleRef = doc(database, "homepage_articles", data.id);
      const snapshot = await getDoc(homepageArticleRef);

      if (snapshot.exists()) {
        await updateDoc(homepageArticleRef, { title: updatedArticle.title, visibility: updatedArticle.visibility });
        console.log("Updated homepage article title");
      }
    };

    await synchronizeData();

    revalidatePath("/admin/blog/articles/[id]", "page");
  }
}
