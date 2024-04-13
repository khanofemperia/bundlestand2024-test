import DropdownMenu from "@/components/admin/DropdownMenu";
import {
  ArrangeHomepageArticlesButton,
  ArrangeHomepageArticlesOverlay,
} from "@/components/admin/blog/ArrangeHomepageArticles";
import ArticlesTable from "@/components/admin/blog/ArticlesTable";
import {
  NewArticleButton,
  NewArticleOverlay,
} from "@/components/admin/blog/NewArticle";
import config from "@/libraries/config";
import Link from "next/link";

async function getArticles(): Promise<ArticleProps[]> {
  const response = await fetch(`${config.BASE_URL}api/admin/articles`, {
    cache: "no-store",
  });

  const responseData = await response.json();

  // Make sure the response data conforms to ArticleProps[] type
  if (!Array.isArray(responseData)) {
    throw new Error("Invalid response format");
  }

  return responseData as ArticleProps[];
}

export default async function Articles() {
  const articles = await getArticles();

  return (
    <>
      <header className="flex flex-col gap-[14px]">
        <DropdownMenu>
          <NewArticleButton />
          <ArrangeHomepageArticlesButton />
        </DropdownMenu>
        <Link
          href="/"
          className="w-max text-blue text-sm font-semibold cursor-pointer hover:underline"
        >
          Access the public website
        </Link>
        <Link
          href="/logout"
          className="w-max text-blue text-sm font-semibold cursor-pointer hover:underline"
        >
          Sign out of your administrator account
        </Link>
      </header>
      <ArticlesTable articles={articles} />
      <NewArticleOverlay />
      <ArrangeHomepageArticlesOverlay />
    </>
  );
}
