import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Désactive le parser JSON par défaut de Next.js
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const buf = await buffer(req); // Convertit le flux de données en un Buffer
    const sig = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      // Vérifie la signature du webhook pour s'assurer qu'il provient de Stripe
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const customerDetails = session.customer_details;
      const customerEmail = customerDetails?.email || "";
      const customerName = customerDetails?.name || "";

      // Enregistre les informations de l'acheteur dans la base de données Prisma
      await prisma.order.create({
        data: {
          customerName: customerName,
          email: customerEmail,
          payment: "Not captured",
          fulfillment: "Not fulfilled",
          total: 250,
        },
      });
    }
    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
