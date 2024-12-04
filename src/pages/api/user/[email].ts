import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.query;

  if (req.method === "DELETE") {
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email invalide." });
    }

    try {
      await prisma.user.delete({
        where: { email },
      });

      return res
        .status(200)
        .json({ message: "Utilisateur supprimé avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'utilisateur." });
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
}
