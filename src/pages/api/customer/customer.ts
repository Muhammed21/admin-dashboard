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
  } else if (req.method === "POST") {
    try {
      const { email, password, name, adress, postal, city } = req.body;

      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Invalid 'email' field" });
      }
      if (!password || typeof password !== "string") {
        return res.status(400).json({ error: "Invalid 'password' field" });
      }
      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Invalid 'name' field" });
      }
      if (!adress || typeof adress !== "string") {
        return res.status(400).json({ error: "Invalid 'adress' field" });
      }
      if (!postal || typeof postal !== "string") {
        return res.status(400).json({ error: "Invalid 'postal' field" });
      }
      if (!city || typeof city !== "string") {
        return res.status(400).json({ error: "Invalid 'city' field" });
      }

      const newCustomer = await prisma.customer.create({
        data: {
          email,
          password,
          name,
          adress,
          postal,
          city,
        },
      });
      res.status(201).json(newCustomer);
    } catch (error) {
      console.error("Error creating item:", error);
      res.status(500).json({ error: "Failed to create item" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, email, password, name, adress, postal, city } = req.body;

      if (!id || typeof id !== "number") {
        return res.status(400).json({ error: "Invalid 'id' field" });
      }

      const updatedCustomer = await prisma.customer.update({
        where: { id },
        data: {
          email,
          password,
          name,
          adress,
          postal,
          city,
        },
      });
      res.status(200).json(updatedCustomer);
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ error: "Failed to update item" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
