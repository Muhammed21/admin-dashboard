import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Typographie } from "@/components/typographie/typographie";
import {Input} from "@/components/input/input";

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
  const [search, setSearch] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch("/api/customer/customer");
        const data: CustomerTableProps[] = await response.json();
        // console.log(data);
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

  const filteredCustomers = customers.filter((customer) => {
    return customer.name.toLowerCase().includes(search.toLowerCase())
  })

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
    <div className="flex flex-col gap-1 w-full h-max bg-bg-filed border border-white/5 rounded-lg py-5">
      <div className="flex flex-col gap-4 w-full">
        <Typographie balise="h1" theme="white" className="pl-5 text-[18px]">
          Clients
        </Typographie>
        <hr className="border-none bg-white/5 h-[1px]"/>
        <div className="pl-5">
          <Input
              type="text"
              value="Search a customer"
              onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <hr className="border-none bg-white/5 h-[1px]"/>
      </div>
      <table className="border-collapse table-auto w-full text-sm">
        <thead className="bg-bg-filed">
        <tr>
          <td className="border-b border-white/5 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-left">
            Customers
          </td>
          <td className="border-b border-white/5 p-4 py-3 text-[#dfdfeb] text-h2 text-left">
            Since
          </td>
          <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-left">
            FirstName/LastName
          </td>
          <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-left">
            E-mail
          </td>
          <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-left">
            Adress
          </td>
          <td className="border-b border-white/5 p-4 pr-8 py-3 text-[#dfdfeb] text-h2 text-right">
            ZIP Code
          </td>
        </tr>
        </thead>
        <tbody className="bg-bg-filed">
        {filteredCustomers.map((customer) => (
            <tr
                key={customer.id}
                className="transition ease-in-out delay-100"
            >
              <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                #{customer.id}
              </td>
              <td className="border-b border-white/5 p-4 text-[#A1A1AA] text-h2">
                {customer.createdAt.slice(0, 10)}
              </td>
              <td className="border-b border-white/5 p-4 pr-5 text-[#A1A1AA] text-h2">
                {customer.name}
              </td>
              <td className="border-b border-white/5 p-4 pr-5 text-[#A1A1AA] text-h2">
                {customer.email}
              </td>
              <td className="border-b border-white/5 p-4 pr-5 text-[#A1A1AA] text-h2">
                {customer.city}, {customer.adress}
              </td>
              <td className="border-b border-white/5 p-4 pr-8 text-[#A1A1AA] text-h2 text-right">
                {customer.postal}
              </td>
            </tr>
        ))}
        </tbody>
      </table>
      <Typographie size="h2" balise="h2" theme="white" className="pl-5 pt-5">
        1 — {filteredCustomers.length} résultat(s)
      </Typographie>
    </div>
  </div>
)
  ;
};
