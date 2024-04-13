"use server";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { database } from "@/libraries/firebase";
import { currentTimestamp, statusCodes } from "@/libraries/utils";
import { revalidatePath } from "next/cache";

type CategoryProps = {
  id: string;
  visibility: string;
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

export default async function UpdateProductCategoriesAction(
  data: CategoryProps[]
) {
  try {
    // Update visibility for each category in the request
    const updatePromises = data.map(async ({ id, visibility }) => {
      const documentRef = doc(database, "product_categories", id);
      await updateDoc(documentRef, {
        visibility: visibility,
      });
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    revalidatePath("/admin/storefront");
    return generateResponse(statusCodes.success.code, "Changes saved");
  } catch (error) {
    console.error("Error updating categories:", error);
    return generateResponse(
      statusCodes.failed.code,
      "Failed to update categories"
    );
  }
}
