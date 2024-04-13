"use server";

import { database } from "@/libraries/firebase";
import {
  setDoc,
  doc,
  getDocs,
  collection,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { customAlphabet } from "nanoid";
import { currentTimestamp, statusCodes } from "@/libraries/utils";
import { revalidatePath } from "next/cache";

type DataProps = {
  title: string;
  slug: string;
  collection_type: string;
  campaign_duration: {
    start_date: string;
    end_date: string;
  };
};

type CollectionDataProps = {
  image: string;
  title: string;
  slug: string;
  campaign_duration: {
    start_date: string;
    end_date: string;
  };
  visibility: string;
  status: string;
  collection_type: string;
  index: number;
  last_updated: string;
  date_created: string;
  products: { id: string; index: number }[];
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

export async function CreateCollectionAction(data: DataProps) {
  try {
    const nanoid = customAlphabet("1234567890", 5);
    const documentRef = doc(database, "collections", nanoid());

    const newCollection = {
      ...data,
      index: 1,
      products: [],
      status: "DRAFT",
      visibility: "HIDDEN",
      last_updated: currentTimestamp(),
      date_created: currentTimestamp(),
    };

    const existingCollections = await getDocs(
      collection(database, "collections")
    );

    for (const collectionDoc of existingCollections.docs) {
      const collectionRef = doc(database, "collections", collectionDoc.id);
      await updateDoc(collectionRef, { index: collectionDoc.data().index + 1 });
    }

    await setDoc(documentRef, newCollection);
    revalidatePath("/admin/storefront");

    return generateResponse(
      statusCodes.success.code,
      "Collection created successfully"
    );
  } catch (error) {
    console.error("Error creating collection:", error);
    return generateResponse(
      statusCodes.failed.code,
      "Failed to create collection"
    );
  }
}

export async function AddCollectionProductAction(data: {
  collectionId: string;
  productId: string;
}) {
  try {
    const { collectionId, productId } = data;
    const productRef = doc(database, "products", productId);
    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      return generateResponse(statusCodes.success.code, "Product not found");
    }

    const collectionRef = doc(database, "collections", collectionId);
    const collectionSnapshot = await getDoc(collectionRef);

    if (!collectionSnapshot.exists()) {
      return generateResponse(statusCodes.success.code, "Collection not found");
    }

    const newProduct = {
      index: 1,
      id: productId,
    };

    const collectionData = collectionSnapshot.data();

    const collectionProducts = Array.isArray(collectionData.products)
      ? collectionData.products
      : [];

    const productAlreadyExists = collectionProducts.some(
      (product) => product.id === productId
    );

    if (productAlreadyExists) {
      return generateResponse(
        statusCodes.success.code,
        "Product already exists in the collection"
      );
    }

    collectionProducts.sort((a, b) => a.index - b.index);

    // Update the index for existing products
    const updatedProducts = collectionProducts.map((product, index) => {
      product.index = index + 2;
      return { ...product };
    });

    // Add the new product at the beginning of the array
    updatedProducts.unshift(newProduct);

    await updateDoc(collectionRef, {
      products: updatedProducts,
      last_updated: currentTimestamp(),
    });

    revalidatePath("/admin/storefront/collections/[id]", "page");

    return generateResponse(
      statusCodes.success.code,
      "Product added to collection"
    );
  } catch (error) {
    console.error("Error adding product to collection:", error);
    return generateResponse(
      statusCodes.failed.code,
      "Failed to add product to collection"
    );
  }
}

export async function RemoveCollectionProductAction(data: {
  collectionId: string;
  productId: string;
}) {
  try {
    const { collectionId, productId } = data;
    const productRef = doc(database, "products", productId);
    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      return generateResponse(statusCodes.failed.code, "Product not found");
    }

    const collectionRef = doc(database, "collections", collectionId);
    const collectionSnapshot = await getDoc(collectionRef);

    if (!collectionSnapshot.exists()) {
      return generateResponse(statusCodes.failed.code, "Collection not found");
    }

    const collectionData = collectionSnapshot.data() as CollectionDataProps;

    const updatedProducts = collectionData.products.filter(
      (product) => product.id !== productId
    );

    updatedProducts.forEach((product, index) => {
      product.index = index + 1;
    });

    await updateDoc(collectionRef, {
      products: updatedProducts,
      last_updated: currentTimestamp(),
    });

    revalidatePath("/admin/storefront/collections/[id]", "page");

    return generateResponse(
      statusCodes.success.code,
      "Product removed from collection"
    );
  } catch (error) {
    console.error("Error removing product from collection:", error);
    return generateResponse(
      statusCodes.failed.code,
      "Failed to remove product from collection"
    );
  }
}

export async function ChangeProductIndexAction(data: {
  collectionId: string;
  product: {
    id: string;
    index: number;
  };
}) {
  try {
    const { collectionId, product: productOneChanges } = data;
    const productOneChangesRef = doc(
      database,
      "products",
      productOneChanges.id
    );
    const productOneChangesSnapshot = await getDoc(productOneChangesRef);

    if (!productOneChangesSnapshot.exists()) {
      return generateResponse(statusCodes.failed.code, "Product not found");
    }

    const collectionRef = doc(database, "collections", collectionId);
    const collectionSnapshot = await getDoc(collectionRef);

    if (!collectionSnapshot.exists()) {
      return generateResponse(statusCodes.failed.code, "Collection not found");
    }

    const collectionData = collectionSnapshot.data() as CollectionDataProps;

    if (
      isNaN(productOneChanges.index) ||
      productOneChanges.index < 1 ||
      productOneChanges.index > collectionData.products.length
    ) {
      return generateResponse(
        statusCodes.failed.code,
        "Index is invalid or out of range"
      );
    }

    const productOne = collectionData.products.find(
      (item) => item.id === productOneChanges.id
    );

    const productOneIndexBeforeSwap = productOne?.index;

    const productTwo = collectionData.products.find(
      (item) => item.index === productOneChanges.index
    );

    if (!productTwo) {
      return generateResponse(
        statusCodes.failed.code,
        "There's no product to switch indexes with"
      );
    }

    if (productOne !== undefined && productOneIndexBeforeSwap !== undefined) {
      productOne.index = productOneChanges.index;
      productTwo.index = productOneIndexBeforeSwap;

      await updateDoc(collectionRef, {
        products: collectionData.products,
        last_updated: currentTimestamp(),
      });

      revalidatePath("/admin/storefront/collections/[id]", "page");

      return generateResponse(
        statusCodes.success.code,
        "Product index changed"
      );
    } else {
      return generateResponse(
        statusCodes.failed.code,
        "Failed to change product index"
      );
    }
  } catch (error) {
    console.error("Error changing product index:", error);
    return generateResponse(statusCodes.failed.code, "An error occurred");
  }
}

export async function UpdateCollectionAction(data: {
  collectionId: string;
  campaignDuration?: { start_date: string; end_date: string };
  image?: string;
  title?: string;
  slug?: string;
  status?: string;
  visibility?: string;
}) {
  try {
    const collectionRef = doc(database, "collections", data.collectionId);
    const collectionSnapshot = await getDoc(collectionRef);

    if (!collectionSnapshot.exists()) {
      return generateResponse(statusCodes.failed.code, "Collection not found");
    }

    const updateData: Record<string, any> = {};

    if (data.campaignDuration) {
      updateData.campaign_duration = data.campaignDuration;
    }

    if (data.image) {
      updateData.image = data.image;
    }

    if (data.title) {
      updateData.title = data.title;
    }

    if (data.slug) {
      updateData.slug = data.slug;
    }

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.visibility) {
      updateData.visibility = data.visibility;
    }

    await updateDoc(collectionRef, {
      ...updateData,
      last_updated: currentTimestamp(),
    });

    revalidatePath("/admin/storefront/collections/[id]", "page");

    return generateResponse(statusCodes.success.code, "Changes saved");
  } catch (error) {
    console.error("Error updating collection:", error);
    return generateResponse(statusCodes.failed.code, "An error occurred");
  }
}

export async function ChangeCollectionIndexAction(data: {
  id: string;
  index: number;
}) {
  try {
    const { id, index } = data;

    const collectionOneRef = doc(database, "collections", id);
    const collectionOneSnapshot = await getDoc(collectionOneRef);
    const existingCollections = await getDocs(
      collection(database, "collections")
    );

    if (
      !collectionOneSnapshot.exists() ||
      isNaN(index) ||
      index < 1 ||
      index > existingCollections.size
    ) {
      return generateResponse(
        statusCodes.success.code,
        !collectionOneSnapshot.exists()
          ? "Collection not found"
          : "Index is invalid or out of range"
      );
    }

    const collectionTwoId = existingCollections.docs.find(
      (collection) => collection.data().index === index
    )?.id;

    if (!collectionTwoId) {
      return generateResponse(
        statusCodes.failed.code,
        "No collection to switch indexes with"
      );
    }

    const collectionOneBeforeUpdate = collectionOneSnapshot.data();
    const collectionTwoRef = doc(database, "collections", collectionTwoId);

    await Promise.all([
      updateDoc(collectionOneRef, { index, last_updated: currentTimestamp() }),
      updateDoc(collectionTwoRef, {
        index: collectionOneBeforeUpdate.index,
      }),
    ]);

    revalidatePath("/admin/storefront");

    return generateResponse(
      statusCodes.success.code,
      "Collection index changed"
    );
  } catch (error) {
    console.error("Error changing collection index:", error);
    return generateResponse(
      statusCodes.failed.code,
      "Error, reload and try again"
    );
  }
}
