import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const orders = await prisma.order.findMany({
        orderBy: {
          id: "asc",
        },
        include: {
          customer: true,
          items: {
            select: {
              item: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
              quantity: true,
            },
          },
        },
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
