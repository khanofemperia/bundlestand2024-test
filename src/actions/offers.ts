"use server";

import { database } from "@/libraries/firebase";
import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { customAlphabet } from "nanoid";
import { currentTimestamp, statusCodes } from "@/libraries/utils";
import { revalidatePath } from "next/cache";

type newOfferProps = {
  poster: string;
  price: string;
  sale_price: string;
};

type ProductDetailsProps = {
  id: string;
  name: string;
  price: string;
};

type AddProductsProps = {
  offerId: string;
  productId: string;
};

type RemoveProductProps = {
  offerId: string;
  productId: string;
};

type UpdatedProductsProps = {
  id: string;
  index: number;
};

type ChangeProductIndexProps = {
  offerId: string;
  productId: string;
  productIndex: number;
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

export async function CreateOfferAction(data: newOfferProps) {
  try {
    const nanoid = customAlphabet("1234567890", 5);
    const documentRef = doc(database, "special_offers", nanoid());

    const offer = {
      poster: data.poster,
      price: data.price,
      sale_price: data.sale_price,
      products: [],
      visibility: "Hidden",
      last_updated: currentTimestamp(),
      date_created: currentTimestamp(),
    };

    await setDoc(documentRef, offer);
    console.log("New offer added with ID:", documentRef.id);
    revalidatePath("/admin/products/offers");
  } catch (error) {
    console.error(error);
  }
}

export async function AddProductAction(data: AddProductsProps) {
  try {
    const { offerId, productId } = data;

    const offerRef = doc(database, "special_offers", offerId);
    const offerSnapshot = await getDoc(offerRef);

    const existingProducts = offerSnapshot.data()?.products || [];

    const existingProductIndex = existingProducts.findIndex(
      (existingProduct: UpdatedProductsProps) =>
        existingProduct.id === productId
    );

    if (existingProductIndex !== -1) {
      const result = {
        updatedProducts: [],
        status: {
          code: statusCodes.failed.code,
          flag: statusCodes.failed.flag,
          message: "Product already exists",
        },
      };

      return result;
    }

    const productsCollectionRef = collection(database, "products");
    const productQuery = query(
      productsCollectionRef,
      where("id", "==", productId)
    );
    const productSnapshot = await getDocs(productQuery);

    if (productSnapshot.empty) {
      const result = {
        updatedProducts: [],
        status: {
          code: statusCodes.failed.code,
          flag: statusCodes.failed.flag,
          message: "Product not found",
        },
      };

      return result;
    }

    const newProduct = { index: 1, id: productId };
    const updatedProducts: UpdatedProductsProps[] = existingProducts.map(
      (product: ProductDetailsProps, index: number) => ({
        ...product,
        index: index + 2,
      })
    );

    const combinedProducts = [newProduct, ...updatedProducts];
    combinedProducts.sort((a, b) => a.index - b.index);

    await updateDoc(offerRef, { products: combinedProducts });
    revalidatePath("/admin/products/offers/[id]", "page");

    const productIds = combinedProducts.map(
      (product: OfferProductProps) => product.id
    );
    const productsQuery = query(
      collection(database, "products"),
      where("id", "in", productIds)
    );
    const productDocs = await getDocs(productsQuery);

    const products = productDocs.docs.map((doc) => {
      const data = doc.data();
      const productIndex = combinedProducts.findIndex(
        (product: OfferProductProps) => product.id === data.id
      );

      return {
        id: data.id,
        index: combinedProducts[productIndex].index,
        poster: data.poster,
        name: data.name,
        price: data.price,
      };
    });

    const result = {
      updatedProducts: products.sort((a, b) => a.index - b.index),
      status: {
        code: statusCodes.success.code,
        flag: statusCodes.success.flag,
        message: "Product added",
      },
    };

    return result;
  } catch (error) {
    console.error("Error updating offer:", error);
    const result = {
      updatedProducts: [],
      status: {
        code: statusCodes.failed.code,
        flag: statusCodes.failed.flag,
        message: "Error, reload and try again",
      },
    };

    return result;
  }
}

export async function RemoveProductAction(data: RemoveProductProps) {
  try {
    const { offerId, productId } = data;

    const offerRef = doc(database, "special_offers", offerId);
    const offerSnapshot = await getDoc(offerRef);

    const existingProducts = offerSnapshot.data()?.products || [];

    const existingProductIndex = existingProducts.findIndex(
      (product: UpdatedProductsProps) => product.id === productId
    );

    if (existingProductIndex === -1) {
      const result = {
        updatedProducts: [],
        status: {
          code: statusCodes.failed.code,
          flag: statusCodes.failed.flag,
          message: "Product not found",
        },
      };

      return result;
    }

    const updatedProducts: UpdatedProductsProps[] = existingProducts.filter(
      (product: UpdatedProductsProps) => product.id !== productId
    );

    updatedProducts.forEach((product: UpdatedProductsProps, index: number) => {
      product.index = index + 1;
    });

    updatedProducts.sort((a, b) => a.index - b.index);
    await updateDoc(offerRef, { products: updatedProducts });
    revalidatePath("/admin/products/offers/[id]", "page");

    const productIds = updatedProducts.map(
      (product: OfferProductProps) => product.id
    );
    const productsQuery = query(
      collection(database, "products"),
      where("id", "in", productIds)
    );
    const productDocs = await getDocs(productsQuery);

    const products = productDocs.docs.map((doc) => {
      const data = doc.data();
      const productIndex = updatedProducts.findIndex(
        (product: OfferProductProps) => product.id === data.id
      );

      return {
        id: data.id,
        index: updatedProducts[productIndex].index,
        poster: data.poster,
        name: data.name,
        price: data.price,
      };
    });

    const result = {
      updatedProducts: products.sort((a, b) => a.index - b.index),
      status: {
        code: statusCodes.success.code,
        flag: statusCodes.success.flag,
        message: "Product removed",
      },
    };

    return result;
  } catch (error) {
    console.error("Error removing product:", error);
    const result = {
      updatedProducts: [],
      status: {
        code: statusCodes.failed.code,
        flag: statusCodes.failed.flag,
        message: "Error, reload and try again",
      },
    };

    return result;
  }
}

export async function ChangeProductIndexAction(data: ChangeProductIndexProps) {
  try {
    const { offerId, productId, productIndex } = data;

    const offerRef = doc(database, "special_offers", offerId);
    const offerSnapshot = await getDoc(offerRef);

    const existingProducts = offerSnapshot.data()?.products || [];

    const productOne = existingProducts.find(
      (product: UpdatedProductsProps) => product.id === productId
    );

    if (
      !productOne ||
      isNaN(productIndex) ||
      productIndex < 1 ||
      productIndex > existingProducts.length
    ) {
      const result = {
        updatedProducts: [],
        status: {
          code: statusCodes.failed.code,
          flag: statusCodes.failed.flag,
          message: !productOne
            ? "Product not found"
            : "Index is invalid or out of range",
        },
      };

      return result;
    }

    const productTwo = existingProducts.find(
      (product: UpdatedProductsProps) => product.index === productIndex
    );

    if (!productTwo) {
      const result = {
        updatedProducts: [],
        status: {
          code: statusCodes.failed.code,
          flag: statusCodes.failed.flag,
          message: "No product to switch indexes with",
        },
      };

      return result;
    }

    const updatedProducts = [...existingProducts];
    [productOne.index, productTwo.index] = [productTwo.index, productOne.index];
    updatedProducts.sort((a, b) => a.index - b.index);

    await updateDoc(offerRef, { products: updatedProducts });
    revalidatePath("/admin/products/offers/[id]", "page");

    const productIds = updatedProducts.map(
      (product: OfferProductProps) => product.id
    );
    const productsQuery = query(
      collection(database, "products"),
      where("id", "in", productIds)
    );
    const productDocs = await getDocs(productsQuery);

    const products = productDocs.docs.map((doc) => {
      const data = doc.data();
      const productIndex = updatedProducts.findIndex(
        (product: OfferProductProps) => product.id === data.id
      );

      return {
        id: data.id,
        index: updatedProducts[productIndex].index,
        poster: data.poster,
        name: data.name,
        price: data.price,
      };
    });

    const result = {
      updatedProducts: products.sort((a, b) => a.index - b.index),
      status: {
        code: statusCodes.success.code,
        flag: statusCodes.success.flag,
        message: "Product index changed",
      },
    };
    return result;
  } catch (error) {
    console.error("Error changing product index:", error);
    const result = {
      updatedProducts: [],
      status: {
        code: statusCodes.failed.code,
        flag: statusCodes.failed.flag,
        message: "Error, reload and try again",
      },
    };
    return result;
  }
}

export async function UpdateOfferAction(data: {
  offerId: string;
  poster: string;
  price: string;
  sale_price: string;
  visibility: string;
}) {
  try {
    const offerRef = doc(database, "special_offers", data.offerId);

    await updateDoc(offerRef, {
      poster: data.poster,
      price: data.price,
      sale_price: data.sale_price,
      visibility: data.visibility,
      last_updated: currentTimestamp(),
    });

    revalidatePath("/admin/storefront/collections/[id]", "page");

    return generateResponse(statusCodes.success.code, "Changes saved");
  } catch (error) {
    console.error("Error updating collection:", error);
    return generateResponse(statusCodes.failed.code, "An error occurred");
  }
}
