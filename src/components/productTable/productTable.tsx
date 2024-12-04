import { useState, useEffect } from "react";
import { Input } from "../input/input";
import { Typographie } from "../typographie/typographie";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";

interface Items {
  id: number;
  createdAt: string;
  name: string;
  price: number;
  quantity: number;
}

interface APIItems {
  id: number;
  createdAt: string;
  name: string;
  price: number;
  quantity: number;
}

export const ProductTable = () => {
  const [items, setItems] = useState<Items[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<Items | null>(null);
  const [editedValues, setEditedValues] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/product/product");
        const data: APIItems[] = await response.json();

        const formattedData: Items[] = data.map((item) => ({
          id: item.id,
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }));
        setItems(formattedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleEditClick = (item: Items) => {
    setEditingItem(item);
    setEditedValues({
      name: item.name,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
    });
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      const updatedItem = {
        ...editingItem,
        ...editedValues,
        price: parseFloat(editedValues.price),
        quantity: parseInt(editedValues.quantity),
      };
      const response = await fetch(`/api/product/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === editingItem.id ? updatedItem : item
          )
        );
        setEditingItem(null);
      } else {
        console.error("Erreur lors de la mise à jour de l'élément.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const filteredItem = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
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
        <div className="flex flex-col pb-4 w-full">
          <Typographie balise="h1" theme="white" className="pl-5 text-[18px]">
            Produits
          </Typographie>
        </div>
        <hr className="border-none bg-white/5 h-[1px]" />
        <table className="border-collapse table-auto w-full text-sm">
          <thead className="bg-bg-filed">
            <tr>
              <td className="border-b border-white/5 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-left">
                Items
              </td>
              <td className="border-b border-white/5 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-left">
                CreatedAt
              </td>
              <td className="border-b border-white/5 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-left">
                Name
              </td>
              <td className="border-b border-white/5 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-left">
                Quantity
              </td>
              <td className="border-b border-white/5 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-left">
                Price TTC
              </td>
              <td className="border-b border-white/5 pr-8 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-right"></td>
            </tr>
          </thead>
          <tbody className="bg-bg-filed">
            {filteredItem.map((item) => (
              <tr key={item.id}>
                {editingItem?.id === item.id ? (
                  <>
                    <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                      #{item.id}
                    </td>
                    <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                      {item.createdAt}
                    </td>
                    <td className="border-b border-white/5 p-2 pl-5 text-[#A1A1AA] text-h2">
                      <Input
                        type="text"
                        value={editedValues.name}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            name: e.target.value,
                          })
                        }
                      ></Input>
                    </td>
                    <td className="border-b border-white/5 p-2 pl-5 text-[#A1A1AA] text-h2">
                      <Input
                        type="number"
                        value={editedValues.quantity}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            quantity: e.target.value,
                          })
                        }
                      ></Input>
                    </td>
                    <td className="border-b border-white/5 p-2 pl-5 text-[#A1A1AA] text-h2">
                      <Input
                        type="number"
                        value={editedValues.price}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            price: e.target.value,
                          })
                        }
                      ></Input>
                    </td>
                    <div className="flex justify-end gap-4 border-b border-white/5 pr-8 p-4 pl-5 text-[#A1A1AA] text-h2 text-right">
                      <button
                        onClick={handleSave}
                        className="bg-white/5 hover:bg-white/10 transition-all ease-in-out delay-75 menuLink rounded-md py-2 px-2 text-h2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-white/5 hover:bg-white/10 transition-all ease-in-out delay-75 menuLink rounded-md py-2 px-2 text-h2"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                      #{item.id}
                    </td>
                    <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                      {item.createdAt}
                    </td>
                    <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                      {item.name}
                    </td>
                    <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                      {item.quantity}
                    </td>
                    <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                      € {item.price} EUR
                    </td>
                    <td className="border-b border-white/5 pr-8 p-4 pl-5 text-[#A1A1AA] text-h2 text-right">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="justify-end items-end bg-white/5 hover:bg-white/10 transition-all ease-in-out delay-75 menuLink rounded-md py-2 px-2 text-h2"
                      >
                        <FiEdit2 />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <Typographie size="h2" balise="h2" theme="white" className="pl-5 pt-5">
          1 — {filteredItem.length} résultat(s)
        </Typographie>
      </div>
    </div>
  );
};
