import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Récupérer les items avec leurs catégories associées
      const orders = await prisma.item.findMany({
        orderBy: {
          id: "asc",
        },
        include: {
          category: true, // Inclure les catégories dans la réponse
          images: true,
        },
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, price, quantity, categoryId } = req.body;

      // Validation des données
      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Invalid 'name' field" });
      }
      if (!price || typeof price !== "number" || price <= 0) {
        return res.status(400).json({ error: "Invalid 'price' field" });
      }
      if (!quantity || typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ error: "Invalid 'quantity' field" });
      }
      if (!categoryId || typeof categoryId !== "number") {
        return res.status(400).json({ error: "Invalid 'categoryId' field" });
      }

      // Création de l'élément dans la base de données
      const newItem = await prisma.item.create({
        data: {
          name,
          price,
          quantity,
          categoryId,
        },
      });

      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error creating item:", error);
      res.status(500).json({ error: "Failed to create item" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
