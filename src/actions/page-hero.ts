"use server";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "@/libraries/firebase";
import { statusCodes } from "@/libraries/utils";
import { revalidatePath } from "next/cache";

interface UpdatePageHeroProps {
  id: string;
  image: string | null;
  title: string | null;
  url: string | null;
  visibility: string;
}

type ProductDetailsProps = {
  id: string;
  name: string;
  price: string;
};

type AddProductsProps = {
  pageHeroId: string;
  product: ProductDetailsProps;
};

type RemoveProductsProps = {
  pageHeroId: string;
  productId: string;
};

type UpdatedProductsProps = {
  id: string;
  index: number;
  name: string;
  price: string;
};

type ChangeProductIndexProps = {
  pageHeroId: string;
  productId: string;
  productIndex: number;
};

function generateResponse(
  code: number,
  message: string
): GenerateResponseProps {
  return {
    status: {
      code,
      flag: code === statusCodes.success.code ? "success" : "failed",
      message,
    },
  };
}

export async function UpdatePageHeroAction(data: UpdatePageHeroProps) {
  try {
    const { id, ...updatedPageHeroData } = data;

    const documentRef = doc(database, "page_hero", id);
    await updateDoc(documentRef, updatedPageHeroData);

    revalidatePath("/admin/storefront");

    return generateResponse(statusCodes.success.code, "Changes saved");
  } catch (error) {
    console.error("Error updating page hero:", error);
    return generateResponse(
      statusCodes.failed.code,
      "Failed to update page hero"
    );
  }
}
