import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

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
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
          customer: true,
          items: {
            select: {
              item: true,
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  } else if (req.method === "PUT") {
    try {
      const { fulfillment } = req.body;

      if (!fulfillment) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(id) },
        data: {
          fulfillment,
        },
      });

      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
