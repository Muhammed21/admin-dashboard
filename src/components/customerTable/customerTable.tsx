import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Typographie } from "@/components/typographie/typographie";

interface CustomerTableProps {
  id: number;
  email: string;
  password: string;
  name: string;
  adress: string;
  postal: number;
  city: string;
  createdAt: string;
}

export const CustomerTable = () => {
  const [customers, setCustomers] = useState<CustomerTableProps[]>([]);
  // const [search, setSearch] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch("/api/customer/customer");
        const data: CustomerTableProps[] = await response.json();
        console.log(data);
        setCustomers(data);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        }
      } finally {
        setIsLoaded(false);
      }
    };
    fetchCustomer();
  }, []);

  if (isLoaded)
    return (
      <div className="w-full h-full grid place-content-center">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <AiOutlineLoading3Quarters
            size={20}
            color="gray"
            className="animate-spin"
          />
          <Typographie size="h2" balise="h2" theme="gray">
            Chargement en cours
          </Typographie>
        </div>
      </div>
    );

  return (
    <div className="p-3 w-full">
      {customers.map((customer) => (
        <div key={customer.id}>
          <div>{customer.name}</div>
          <div>{customer.email}</div>
          <div>{customer.adress}</div>
        </div>
      ))}
    </div>
  );
};
