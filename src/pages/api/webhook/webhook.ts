import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
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
    } catch (err) {
      if (err instanceof Error) {
        console.error("Webhook Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      } else {
        console.error("Unknown error occurred");
        return res.status(400).send("Webhook Error: An unknown error occurred");
      }
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const idCustomer = session.metadata?.idCustomer;
      const items = JSON.parse(session.metadata?.items || "[]");

      const customerDetails = session.customer_details;
      const customerEmail = customerDetails?.email || "";
      const customerName = customerDetails?.name || "";
      const orderCost = session.amount_total! / 100;

      // Enregistre les informations de l'acheteur dans la base de données Prisma
      const order = await prisma.order.create({
        data: {
          customerName: customerName,
          email: customerEmail,
          payment: "Not captured",
          fulfillment: "Not fulfilled",
          total: orderCost,
          customerId: idCustomer ? parseInt(idCustomer) : undefined,
        },
      });

      // Enregistrement des items avec id
      for (const item of items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id, //Relation avec la commande
            itemId: parseInt(item.id),
            quantity: parseInt(item.quantity),
          },
        });
      }
    }
    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
