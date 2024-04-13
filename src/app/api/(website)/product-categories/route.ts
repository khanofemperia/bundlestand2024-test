import { NextResponse, NextRequest } from "next/server";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { database } from "@/libraries/firebase";
import { customAlphabet } from "nanoid";

const defaultCategories = [
  { index: 1, name: "Dresses", image: "dresses.png", visibility: "VISIBLE" },
  { index: 2, name: "Tops", image: "tops.png", visibility: "VISIBLE" },
  {
    index: 3,
    name: "Bottoms",
    image: "bottoms.png",
    visibility: "VISIBLE",
  },
  {
    index: 4,
    name: "Outerwear",
    image: "outerwear.png",
    visibility: "VISIBLE",
  },
  { index: 5, name: "Shoes", image: "shoes.png", visibility: "VISIBLE" },
  {
    index: 6,
    name: "Accessories",
    image: "accessories.png",
    visibility: "VISIBLE",
  },
  {
    index: 7,
    name: "Men",
    image: "men.png",
    visibility: "VISIBLE",
  },
  {
    index: 8,
    name: "Catch-All",
    image: "catch-all.png",
    visibility: "VISIBLE",
  },
];

async function createOrUpdateCategories() {
  const snapshot = await getDocs(collection(database, "product_categories"));

  const existingCategories: CategoryProps[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      index: data.index,
      name: data.name,
      image: data.image,
      visibility: data.visibility,
    };
  });

  const categoriesToAddOrUpdate: CategoryProps[] = [];

  for (const defaultCategory of defaultCategories) {
    const existingCategory = existingCategories.find(
      (cat) => cat.name === defaultCategory.name
    );

    if (!existingCategory) {
      const nanoid = customAlphabet("1234567890", 5);
      const newCategoryId = nanoid();
      categoriesToAddOrUpdate.push({ ...defaultCategory, id: newCategoryId });
    } else {
      // If the category exists but is incomplete
      const isComplete =
        existingCategory.index === defaultCategory.index &&
        existingCategory.image === defaultCategory.image;

      if (!isComplete) {
        categoriesToAddOrUpdate.push({
          ...existingCategory,
          index: defaultCategory.index,
          image: defaultCategory.image,
        });
      }
    }
  }

  // Create or update categories as needed
  for (const category of categoriesToAddOrUpdate) {
    const documentRef = doc(database, "product_categories", category.id);
    await setDoc(documentRef, {
      index: category.index,
      name: category.name,
      image: category.image,
      visibility: category.visibility,
    });
  }
}

export async function GET(_request: NextRequest) {
  await createOrUpdateCategories();

  const snapshot = await getDocs(collection(database, "product_categories"));

  const categories: CategoryProps[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      index: data.index,
      name: data.name,
      image: data.image,
      visibility: data.visibility,
    };
  });

  categories.sort((a, b) => a.index - b.index);

  return NextResponse.json(categories, { status: 200 });
}
