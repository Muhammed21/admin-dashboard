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

  if (req.method === "PUT") {
    try {
      const { name, price, quantity } = req.body;

      if (!name || price === undefined || quantity === undefined) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const updatedProduct = await prisma.item.update({
        where: { id: parseInt(id) },
        data: { name, price: parseFloat(price), quantity: parseInt(quantity) },
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
