interface EmailTemplateProps {
  id: number;
  customerName: string;
}

export const getFulfillmentEmailContent = ({
  id,
  customerName,
}: EmailTemplateProps) => {
  const subject = `Order #${id} Fulfilled`;
  const text = `Dear ${customerName},
  
  Your order #${id} has been marked as fulfilled. 
  Thank you for shopping with us!
  
  Best regards,
  Cheap Store`;

  const html = `
      <p>Dear ${customerName},</p>
      <p>Your order <strong>#${id}</strong> has been marked as fulfilled.</p>
      <p>Thank you for shopping with us!</p>
      <p>Best regards,<br>Cheap Store</p>
    `;

  return { subject, text, html };
};
