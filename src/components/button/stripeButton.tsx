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
  idCustomer: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  name,
  amount,
  id,
  idCustomer,
}) => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(SESSION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, amount, id, idCustomer }),
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
  idCustomer: number;
}> = ({ name, amount, id, idCustomer }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm name={name} amount={amount} id={id} idCustomer={idCustomer} />
  </Elements>
);

export default Checkout;
