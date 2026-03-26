import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/orders", async (req, res) => {
  try {
    const { items, customerEmail, customerName, shippingAddress, paymentMethod, cardLastFour } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Items are required" });
      return;
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, item.productId));

      if (!product) continue;

      const price = product.discountPrice
        ? parseFloat(product.discountPrice as string)
        : parseFloat(product.price as string);

      total += price * item.quantity;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price,
        color: item.color,
        size: item.size,
      });
    }

    const orderNumber = `PX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const [order] = await db
      .insert(ordersTable)
      .values({
        orderNumber,
        customerEmail,
        customerName,
        shippingAddress,
        paymentMethod,
        cardLastFour,
        status: "confirmed",
        total: total.toFixed(2),
        items: orderItems,
      })
      .returning();

    res.status(201).json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: parseFloat(order.total as string),
      items: order.items,
      createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error creating order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
