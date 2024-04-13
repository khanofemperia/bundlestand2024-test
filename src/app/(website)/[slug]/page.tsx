import Article from "@/components/website/Article";
import Product from "@/components/website/Product/ProductDetails";
import config from "@/libraries/config";

function isValidSlug(input: string): boolean {
  const regex = /^[a-zA-Z0-9-]+-\d{5}$/;
  return regex.test(input);
}

async function getData(slug: string) {
  const id = slug.split("-").pop();
  const response = await fetch(`${config.BASE_URL}api/posts/${id}`, {
    cache: "no-cache",
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  data.post = { ...data.post, id };

  return data;
}

export default async function Post({ params }: { params: { slug: string } }) {
  if (!isValidSlug(params.slug)) {
    return (
      <div>
        <h1>Invalid Slug</h1>
        <p>The provided slug is not in the expected format.</p>
      </div>
    );
  }

  const data = await getData(params.slug);
  const post = data.post;

  return (
    <div className="mt-[80px]">
      {data.contentType === "article" ? (
        <Article data={post} />
      ) : (
        <Product data={post} />
      )}
    </div>
  );
}
