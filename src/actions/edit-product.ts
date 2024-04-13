"use server";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { database } from "@/libraries/firebase";
import { currentTimestamp, statusCodes } from "@/libraries/utils";
import { revalidatePath } from "next/cache";

type ColorProps = {
  name: string;
  image: string;
};

type EditProduct = {
  id: string;
  name?: string;
  price?: string;
  slug?: string;
  description?: string;
  poster?: string;
  images?: string[];
  sizes?: SizeChartProps;
  colors?: ColorProps[];
  status?: string;
  visibility?: string;
};

type GenerateResponseProps = {
  status: {
    code: number;
    flag: "success" | "failed";
    message: string;
  };
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

export default async function EditProductAction(data: EditProduct) {
  try {
    const docRef = doc(database, "products", data.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingProduct = docSnap.data();

      const updatedProduct = {
        ...existingProduct,
        ...data,
        last_updated: currentTimestamp(),
      };

      await setDoc(docRef, updatedProduct);
      revalidatePath("/admin/products/[id]", "page");

      return generateResponse(statusCodes.success.code, "Product updated");
    } else {
      throw new Error("Product does not exist");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return generateResponse(
      statusCodes.failed.code,
      "Failed to update product"
    );
  }
}
