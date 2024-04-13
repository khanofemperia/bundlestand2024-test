import { NextResponse, NextRequest } from "next/server";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { database } from "@/libraries/firebase";
import { statusCodes } from "@/libraries/utils";

interface ArticleDataProps {
  id: string;
  title: string;
  visibility: string;
}

interface HomepageArticleProps {
  id: string;
  index: number;
  title: string;
  visibility: string;
}

export async function GET(_request: NextRequest) {
  const snapshot = await getDocs(collection(database, "homepage_articles"));

  const articles: HomepageArticleProps[] = [];

  for (const document of snapshot.docs) {
    const data = document.data();
    const articleId = document.id;
    let visibility = data.visibility || "";

    if (visibility !== "deleted") {
      const articleSnapshot = await getDoc(
        doc(database, "articles", articleId)
      );

      if (!articleSnapshot.exists()) {
        visibility = "deleted";
        await updateDoc(doc(database, "homepage_articles", articleId), {
          visibility: "deleted",
        });
      }
    }

    articles.push({
      id: articleId,
      index: data.index || 0,
      title: data.title || "",
      visibility,
    });
  }

  articles.sort((a, b) => a.index - b.index);

  return NextResponse.json(articles, { status: 200 });
}

export async function POST(request: NextRequest) {
  const homepageArticles = await getHomepageArticles();

  try {
    const { id } = await request.json();
    const existingArticleSnapshot = await getDoc(
      doc(database, "homepage_articles", id)
    );

    if (existingArticleSnapshot.exists()) {
      const result = {
        status: statusCodes.already_exists,
        data: homepageArticles,
      };

      return NextResponse.json(result, {
        status: statusCodes.already_exists.code,
      });
    }

    const articleSnapshot = await getDoc(doc(database, "articles", id));

    if (articleSnapshot.exists()) {
      const articleData = articleSnapshot.data() as ArticleDataProps;

      const newArticle: HomepageArticleProps = {
        index: 1,
        id: articleSnapshot.id,
        title: articleData.title,
        visibility: articleData.visibility,
      };

      homepageArticles.forEach((article) => (article.index += 1));
      homepageArticles.unshift(newArticle);

      await updateHomepageArticles(homepageArticles);

      console.log("New article added to homepage_articles.");

      const updatedHomepageArticles = await getHomepageArticles();
      const result = {
        status: statusCodes.success,
        data: updatedHomepageArticles,
      };
      return NextResponse.json(result, { status: result.status.code });
    }

    const result = {
      status: statusCodes.not_found,
      data: homepageArticles,
    };

    return NextResponse.json(result, { status: statusCodes.not_found.code });
  } catch (error) {
    console.error("Error adding article:", error);

    const result = {
      status: statusCodes.failed,
      data: homepageArticles,
    };

    return NextResponse.json(result, { status: statusCodes.failed.code });
  }
}

export async function PUT(request: NextRequest) {
  const homepageArticles = await getHomepageArticles();
  const data = await request.json();
  const articleOneId = String(data.id);
  const articleOneIndex = parseInt(data.index);

  const generateFailedResponse = (message: string) => {
    const result = {
      message,
      status: statusCodes.failed,
      data: homepageArticles,
    };
    return NextResponse.json(result);
  };

  try {
    const articleOneRef = doc(database, "homepage_articles", articleOneId);
    const articleOneSnapshot = await getDoc(articleOneRef);

    if (
      !articleOneSnapshot.exists() ||
      isNaN(articleOneIndex) ||
      articleOneIndex < 1 ||
      articleOneIndex > homepageArticles.length
    ) {
      return generateFailedResponse(
        !articleOneSnapshot.exists()
          ? "Article not found"
          : "Index is invalid or out of range"
      );
    }

    const articleTwoId = homepageArticles.find(
      (article) => article.index === articleOneIndex
    )?.id;

    if (!articleTwoId) {
      return generateFailedResponse(
        "There's no article to switch indexes with"
      );
    }

    const article = await getDoc(articleOneRef);
    const articleOneBeforeUpdate = article.data() as HomepageArticleProps;
    const articleTwoRef = doc(database, "homepage_articles", articleTwoId);

    await Promise.all([
      updateDoc(articleOneRef, { index: articleOneIndex }),
      updateDoc(articleTwoRef, { index: articleOneBeforeUpdate.index }),
    ]);

    console.log("Article index changed");

    const updatedHomepageArticles = await getHomepageArticles();
    const result = {
      message: "Article index changed",
      status: statusCodes.success,
      data: updatedHomepageArticles,
    };
    return NextResponse.json(result, { status: result.status.code });
  } catch (error) {
    console.error("An error occurred:", error);
    return generateFailedResponse("An error occurred");
  }
}

export async function DELETE(request: NextRequest) {
  const homepageArticles = await getHomepageArticles();
  const { id } = await request.json();

  const generateFailedResponse = (message: string) => {
    const result = {
      message,
      status: statusCodes.failed,
      data: homepageArticles,
    };
    return NextResponse.json(result);
  };

  try {
    const articleRef = doc(database, "homepage_articles", id);
    const articleSnapshot = await getDoc(articleRef);

    if (!articleSnapshot.exists()) {
      return generateFailedResponse("Article not found");
    }

    await deleteDoc(articleRef);
    console.log("Article removed from homepage");

    // Update the indices of remaining articles
    const remainingArticles = homepageArticles.filter(
      (article) => article.id !== id
    );
    const updatedArticles = remainingArticles.map((article, index) => ({
      ...article,
      index: index + 1,
    }));

    await updateHomepageArticles(updatedArticles);

    const updatedHomepageArticles = await getHomepageArticles();
    const result = {
      message: "Article removed",
      status: statusCodes.success,
      data: updatedHomepageArticles,
    };
    return NextResponse.json(result, { status: result.status.code });
  } catch (error) {
    console.error("An error occurred:", error);
    return generateFailedResponse("An error occurred");
  }
}

async function getHomepageArticles(): Promise<HomepageArticleProps[]> {
  const collectionRef = collection(database, "homepage_articles");
  const snapshot = await getDocs(collectionRef);

  const articles: HomepageArticleProps[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      index: data.index || 0,
      title: data.title || "",
      visibility: data.visibility || "",
    };
  });

  articles.sort((a, b) => a.index - b.index);

  return articles;
}

async function updateHomepageArticles(
  articles: HomepageArticleProps[]
): Promise<void> {
  const updatePromises = articles.map(async (article) => {
    const existingArticleRef = doc(database, "homepage_articles", article.id);
    const existingArticle = await getDoc(existingArticleRef);

    if (existingArticle.exists()) {
      await updateDoc(existingArticleRef, { index: article.index });
    } else {
      await setDoc(existingArticleRef, {
        index: article.index,
        title: article.title,
        visibility: article.visibility,
      });
    }
  });

  await Promise.all(updatePromises);
}
