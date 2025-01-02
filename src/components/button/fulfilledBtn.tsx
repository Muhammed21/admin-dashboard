import { TbArrowBackUp } from "react-icons/tb";
import { Typographie } from "../typographie/typographie";
import clsx from "clsx";
import { getFulfillmentEmailContent } from "@/lib/template/emailTemplate";

interface FulfilledBtnProps {
  id: number;
  onFulfilled: () => void;
  email: string;
}

export const FulfilledBtn = ({ id, onFulfilled, email }: FulfilledBtnProps) => {
  const markFulffiled = async () => {
    try {
      const response = await fetch(`/api/order/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillment: "Fulfilled",
        }),
      });
      const data = await response.json();
      console.log(data);

      onFulfilled();

      // Générer le contenu de l'e-mail
      const { subject, text, html } = getFulfillmentEmailContent({
        id,
        customerName: email,
      });

      const emailResponse = await fetch(`/api/mail/sendMail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          subject,
          text,
          html,
        }),
      });

      const emailData = await emailResponse.json();
      if (emailResponse.ok) {
        console.log("E-mail envoyé avec succès :", emailData);
      } else {
        console.error("Erreur lors de l'envoi de l'e-mail :", emailData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex bg-black/15 border-b border-white/5 p-4 items-center justify-between w-full h-max">
      <div className="flex gap-2">
        <TbArrowBackUp className="rotate-180" size={14} />
        <Typographie size="h2" balise="h2" weight="regular">
          <span className="font-medium">Order #{id}</span> is ready to be
          fulfilled
        </Typographie>
      </div>
      <button
        onClick={id ? markFulffiled : undefined}
        disabled={!id}
        className={clsx(!id && "cursor-not-allowed")}
      >
        <Typographie
          size="h3"
          balise="h3"
          weight="regular"
          theme="gray"
          className="bg-bg-filed p-1.5 rounded-md border border-gray/15 hover:bg-bg-filed/40 transition-all duration-200 ease-in-out"
        >
          Mark as fulfilled
        </Typographie>
      </button>
    </div>
  );
};
