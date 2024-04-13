import { NextResponse, NextRequest } from "next/server";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { database } from "@/libraries/firebase";

interface FirebaseHomepageArticle {
  visibility: string;
  index: number;
  title: string;
}

interface HomepageArticle {
  id: string;
  visibility: string;
  index: number;
  title: string;
}

interface ArticleProps {
  id: string;
  poster: string;
  images: string[];
  status: string;
  title: string;
  visibility: string;
  content: string;
  slug: string;
  meta_description: string;
  date_created: string;
  last_updated: string;
}

const mergeArticleData = (
  articleData: ArticleProps,
  index: number
): ArticleProps & { index: number } => ({
  ...articleData,
  index,
});

export async function GET(_request: NextRequest) {
  const collectionRef = collection(database, "homepage_articles");
  const snapshot = await getDocs(collectionRef);

  const homepageArticles: HomepageArticle[] = snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as FirebaseHomepageArticle),
  }));

  const articlesPromises: Promise<(ArticleProps & { index: number }) | null>[] =
    homepageArticles.map(async (article) => {
      const articleDocRef = doc(database, "articles", article.id);
      const articleDoc = await getDoc(articleDocRef);

      if (articleDoc.exists()) {
        const articleData = articleDoc.data() as ArticleProps;

        if (
          articleData.visibility.toLowerCase() === "visible" &&
          articleData.status.toLowerCase() === "published"
        ) {
          return mergeArticleData(articleData, article.index);
        }
      }

      return null;
    });

  const articles = await Promise.all(articlesPromises);
  const validArticles = articles.filter(
    (article) => article !== null
  ) as (ArticleProps & { index: number })[];

  validArticles.sort((a, b) => a.index - b.index);

  return NextResponse.json(validArticles);
}
