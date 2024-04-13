import { NextResponse, NextRequest } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { database } from "@/libraries/firebase";

export async function GET(_request: NextRequest) {
  const collectionRef = collection(database, "articles");
  const snapshot = await getDocs(collectionRef);

  const articles: ArticleProps[] = snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      poster: data.poster,
      images: data.images,
      status: data.status,
      title: data.title,
      visibility: data.visibility,
      content: data.content,
      slug: data.slug,
      meta_description: data.meta_description,
      date_created: data.date_created,
      last_updated: data.last_updated,
    };
  });

  articles.sort(
    (a, b) =>
      new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
  );

  return NextResponse.json(articles);
}
