import ProductsTable from "@/components/admin/products/ProductsTable";
import {
  NewProductButton,
  NewProductOverlay,
} from "@/components/admin/products/NewProduct";
import Link from "next/link";
import DropdownMenu from "@/components/admin/DropdownMenu";
import config from "@/libraries/config";

async function getProducts(): Promise<ProductProps[]> {
  const response = await fetch(`${config.BASE_URL}api/admin/products`, {
    cache: "no-store",
  });

  const responseData = await response.json();

  // Make sure the response data conforms to ProductProps[] type
  if (!Array.isArray(responseData)) {
    throw new Error("Invalid response format");
  }

  return responseData as ProductProps[];
}

export default async function Products() {
  const products = await getProducts();

  return (
    <>
      <header className="flex flex-col gap-[14px]">
        <DropdownMenu>
          <NewProductButton />
          <Link
            href="/admin/products/offers"
            className="w-max text-blue text-sm font-semibold cursor-pointer hover:underline"
          >
            Manage special offers
          </Link>
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
      <ProductsTable products={products} />
      <NewProductOverlay />
    </>
  );
}
