import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, gte, lte, type SQL } from "drizzle-orm";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, color, featured } = req.query;

    const conditions: SQL[] = [];

    if (category && category !== "all") {
      conditions.push(eq(productsTable.categorySlug, category as string));
    }

    if (search) {
      conditions.push(ilike(productsTable.name, `%${search}%`));
    }

    if (minPrice) {
      conditions.push(gte(productsTable.price, minPrice as string));
    }

    if (maxPrice) {
      conditions.push(lte(productsTable.price, maxPrice as string));
    }

    if (featured === "true") {
      conditions.push(eq(productsTable.featured, true));
    }

    const rows =
      conditions.length > 0
        ? await db
            .select()
            .from(productsTable)
            .where(and(...conditions))
        : await db.select().from(productsTable);

    const products = rows
      .filter((p) => {
        if (color && p.colors) {
          return (p.colors as string[]).some((c) =>
            c.toLowerCase().includes((color as string).toLowerCase())
          );
        }
        return true;
      })
      .map(mapProduct);

    res.json(products);
  } catch (err) {
    req.log.error({ err }, "Error fetching products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(mapProduct(product));
  } catch (err) {
    req.log.error({ err }, "Error fetching product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const cats = await db.select().from(categoriesTable);
    const counts = await db
      .select({ categorySlug: productsTable.categorySlug })
      .from(productsTable);

    const countMap: Record<string, number> = {};
    for (const row of counts) {
      countMap[row.categorySlug] = (countMap[row.categorySlug] || 0) + 1;
    }

    res.json(
      cats.map((c) => ({
        ...c,
        productCount: countMap[c.slug] || 0,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Error fetching categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

function mapProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price as string),
    discountPrice: p.discountPrice ? parseFloat(p.discountPrice as string) : undefined,
    category: p.category,
    categorySlug: p.categorySlug,
    imageUrl: p.imageUrl,
    images: (p.images as string[]) || [],
    colors: (p.colors as string[]) || [],
    sizes: (p.sizes as string[]) || [],
    inStock: p.inStock,
    featured: p.featured,
    rating: parseFloat(p.rating as string),
    reviewCount: p.reviewCount,
    brand: p.brand,
    material: p.material,
    length: p.length,
    diameter: p.diameter,
    tags: (p.tags as string[]) || [],
    videoUrl: p.videoUrl,
  };
}

export default router;
