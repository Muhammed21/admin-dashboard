import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (req.method === "GET") {
    try {
      const product = await prisma.item.findUnique({
        where: { id: parseInt(id) },
        include: {
          category: true,
          images: true,
        },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  } else if (req.method === "PUT") {
    try {
      const { name, price, quantity, categoryId, headerItem } = req.body;

      if (
        !name ||
        price === undefined ||
        quantity === undefined ||
        categoryId === undefined ||
        headerItem === undefined
      ) {
        return res.status(400).json({ error: "Missing fields" });
      }

      // Si `headerItem` est à `true`, on doit d'abord mettre à jour tous les autres produits
      if (headerItem === true) {
        // D'abord, mettre tous les autres `headerItem` à `false`
        await prisma.item.updateMany({
          where: {
            headerItem: true,
          },
          data: {
            headerItem: false,
          },
        });
      }

      const updatedProduct = await prisma.item.update({
        where: { id: parseInt(id) },
        data: {
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          categoryId: parseInt(categoryId),
          headerItem, // Mise à jour de categoryId
        },
      });

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
