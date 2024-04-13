"use server";

import { database } from "@/libraries/firebase";
import { setDoc, doc } from "firebase/firestore";
import { customAlphabet } from "nanoid";
import { currentTimestamp } from "@/libraries/utils";
import { revalidatePath } from "next/cache";

type newProductProps = {
  name: string;
  slug: string;
  price: string;
};

export async function CreateProductAction(data: newProductProps) {
  try {
    const nanoid = customAlphabet("1234567890", 5);
    const documentRef = doc(database, "products", nanoid());

    const product = {
      name: data.name,
      slug: data.slug,
      price: data.price,
      status: "Draft",
      visibility: "Hidden",
      poster: null,
      description: null,
      images: null,
      colors: null,
      sizes: null,
      last_updated: currentTimestamp(),
      date_created: currentTimestamp(),
    };

    await setDoc(documentRef, product);
    console.log("New product added with ID:", documentRef.id);
    revalidatePath("/admin/products");
  } catch (error) {
    console.error(error);
  }
}
