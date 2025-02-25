import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
const SESSION_URL = "/api/checkout/route";

interface CheckoutFormProps {
  name: string;
  amount: number;
  id: number;
  itemId: number;
  quantity: number;
  idCustomer: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  name,
  amount,
  id,
  itemId,
  quantity,
  idCustomer,
}) => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    console.log("Sending data to API:", {
      name,
      amount,
      id,
      idCustomer,
      itemId,
      quantity,
    });

    try {
      const res = await fetch(SESSION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          amount,
          id,
          idCustomer,
          itemId,
          quantity,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await res.json();

      const result = await stripe!.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        setError(result.error.message || "An unknown error occurred");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading ? (
        <button disabled={loading}>Chargement en cours</button>
      ) : (
        <button>Comptant -:- {amount}€</button>
      )}
      {error && <p>{error}</p>}
    </form>
  );
};

const Checkout: React.FC<{
  name: string;
  amount: number;
  id: number;
  itemsId: number;
  quantity: number;
  idCustomer: number;
}> = ({ name, amount, id, idCustomer, itemsId, quantity }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm
      name={name}
      amount={amount}
      id={id}
      idCustomer={idCustomer}
      itemId={itemsId}
      quantity={quantity}
    />
  </Elements>
);

export default Checkout;
