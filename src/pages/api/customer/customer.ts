import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const customer = await prisma.customer.findMany({
        orderBy: {
          id: "asc",
        },
      });
      res.status(200).json(customer);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
