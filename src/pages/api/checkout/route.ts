import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, amount, id, customerEmail, customerName } = req.body;

    console.log("Received data:", {
      name,
      amount,
      id,
      customerEmail,
      customerName,
    });

    try {
      // Optionnel: Création d'un client Stripe
      const customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "klarna", "link", "paypal"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: name,
              },
              unit_amount: amount * 100, // Montant en centimes
            },
            quantity: 1,
          },
        ],
        customer: customer.id, // Associe la session au client Stripe
        mode: "payment",
        allow_promotion_codes: true,
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}`, //URL: /cancel/cancel
      });

      res.status(200).json({ id: session.id });
    } catch (err: any) {
      console.error("Stripe error:", err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
