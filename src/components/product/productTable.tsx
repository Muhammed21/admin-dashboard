import { useState, useEffect } from "react";
import { Input } from "../input/input";
import { Typographie } from "../typographie/typographie";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import clsx from "clsx";

interface Items {
  id: number;
  createdAt: string;
  name: string;
  price: number;
  quantity: number;
  headerItem: boolean;
  categoryId: number;
}

interface APIItems {
  id: number;
  createdAt: string;
  name: string;
  price: number;
  quantity: number;
  headerItem: boolean;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

export const ProductTable = () => {
  const [items, setItems] = useState<Items[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedHeaderItem, setSelectedHeaderItem] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<Items | null>(null);
  const [editedValues, setEditedValues] = useState({
    name: "",
    price: "",
    quantity: "",
    categoryId: 0,
  });
  const [createdValues, setCreatedValues] = useState({
    name: "",
    price: 0,
    quantity: 0,
    categoryId: 0,
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
          headerItem: item.headerItem,
          categoryId: item.categoryId,
        }));
        setItems(formattedData);
        console.log("Fetched items:", formattedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Charger les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/product/category");
        const data: Category[] = await response.json();
        setCategories(data); // Mettre à jour l'état avec les catégories récupérées
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSetHeaderItem = async (id: number) => {
    console.log("Clicked 'Mettre dans l'en tête' with ID:", id); // Log de l'ID sélectionné

    // Vérifie d'abord que l'élément existe dans `items`
    const selectedItem = items.find((item) => item.id === id);
    if (!selectedItem) {
      console.error("Item not found in local state");
      return;
    }

    // Mettre à jour le produit dans la base de données avec headerItem à true
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headerItem: true, // Marquer l'élément comme produit en tête
          name: selectedItem.name, // Optionnel, si tu veux aussi mettre à jour ces champs
          price: selectedItem.price,
          quantity: selectedItem.quantity,
          categoryId: selectedItem.categoryId, // Ces valeurs peuvent être laissées à "" ou 0 si non modifiées
        }),
      });

      if (response.ok) {
        // Si la mise à jour est réussie, mettre à jour l'état local
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id
              ? { ...item, headerItem: true }
              : { ...item, headerItem: false }
          )
        );
      } else {
        console.error("Erreur lors de la mise à jour du produit.");
      }
    } catch (error) {
      console.error(
        "Erreur réseau lors de la mise à jour de l'élément :",
        error
      );
    }
  };

  const handleEditClick = (item: Items) => {
    setEditingItem(item);
    setEditedValues({
      name: item.name,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      categoryId: item.categoryId,
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
        categoryId: editedValues.categoryId,
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

  const createProduct = async () => {
    try {
      const response = await fetch("/api/product/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdValues),
      });

      if (response.ok) {
        const data: APIItems = await response.json();
        const newItem: Items = {
          id: data.id,
          createdAt: new Date(data.createdAt).toLocaleDateString(),
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          headerItem: data.headerItem,
          categoryId: data.categoryId,
        };
        console.log(data.categoryId);
        setItems((prevItems) => [newItem, ...prevItems]);
      } else {
        console.error("Erreur lors de la création du produit.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  // Fonction pour obtenir le nom de la catégorie en fonction de l'id
  const getCategoryNameById = (categoryId: number) => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : "Inconnue";
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
    <div className="flex flex-col gap-3 p-3 w-full h-max">
      {/* HEADER PRODUCT */}
      <div className="flex flex-col gap-1 w-full h-max bg-bg-filed border border-white/5 rounded-lg py-5">
        <div className="flex flex-col pb-4 w-full">
          <Typographie balise="h1" theme="white" className="pl-5 text-[18px]">
            Produit d&apos;en tête
          </Typographie>
        </div>
        <hr className="border-none bg-white/5 h-[1px]" />
        {items.map((item) => (
          <>
            {item.headerItem === true && (
              <table className="border-collapse table-auto w-full text-sm">
                <thead className="bg-bg-filed">
                  <tr>
                    <td className="border-b border-white/5 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-left">
                      Produit
                    </td>
                    <td className="border-b border-white/5 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-left">
                      Nom du produit
                    </td>
                    <td className="border-b border-white/5 pr-8 p-4 pl-5 py-3 text-[#dfdfeb] text-h2 text-right">
                      État
                    </td>
                  </tr>
                </thead>
                <tbody className="bg-bg-filed">
                  <tr>
                    <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                      #{item.id}
                    </td>
                    <td className="border-b border-white/5 p-4 pl-5 text-[#A1A1AA] text-h2">
                      {item.name}
                    </td>
                    <td className="border-b border-white/5 p-4 pr-8 text-[#A1A1AA] text-h2 text-right">
                      <div className="flex gap-2 justify-end items-center">
                        <div className="w-[9px] h-[9px] rounded-sm border border-[#379374] bg-[#10B981]"></div>
                        Actif
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </>
        ))}
        <div className="flex pl-5 pr-8 pt-4 w-full h-max items-center justify-between">
          <select
            className="input border-[1.5px] border-white/5 bg-bg-filed text-white px-4 py-[7px] rounded-md text-h2"
            value={selectedHeaderItem || ""}
            onChange={(e) => setSelectedHeaderItem(parseInt(e.target.value))}
          >
            {items.length !== 0 ? (
              <>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </>
            ) : (
              <div>Aucun element trouvé</div>
            )}
          </select>
          <button
            onClick={() => handleSetHeaderItem(selectedHeaderItem!)}
            className="text-[#A1A1AA] bg-white/5 hover:bg-white/10 w-max h-max transition-all ease-in-out delay-75 menuLink rounded-md py-2 px-2 text-h2"
          >
            Mettre dans l&apos;en tête
          </button>
        </div>
      </div>
      {/* ADD PRODUITS */}
      <div className="flex flex-col gap-1 w-full h-max bg-bg-filed border border-white/5 rounded-lg py-5">
        <div className="flex flex-col pb-4 w-full">
          <Typographie balise="h1" theme="white" className="pl-5 text-[18px]">
            Ajouter un produits
          </Typographie>
        </div>
        <hr className="border-none bg-white/5 h-[1px]" />
        <div className="flex w-full items-center justify-between text-[#A1A1AA] pl-5 pr-8 pt-4">
          <div className="flex gap-4">
            <Input
              type="text"
              value="Name"
              onChange={(e) =>
                setCreatedValues({
                  ...createdValues,
                  name: e.target.value,
                })
              }
            ></Input>
            <Input
              type="number"
              value="Quantity"
              onChange={(e) =>
                setCreatedValues({
                  ...createdValues,
                  quantity: parseInt(e.target.value),
                })
              }
            ></Input>
            <select
              value={createdValues.categoryId}
              onChange={(e) =>
                setCreatedValues({
                  ...createdValues,
                  categoryId: parseInt(e.target.value),
                })
              }
              className="input border-[1.5px] border-white/5 bg-bg-filed text-white px-4 py-[7px] rounded-md text-h2"
            >
              {categories.length !== 0 ? (
                <>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </>
              ) : (
                <div>Sélectionnez</div>
              )}
            </select>
            <Input
              type="number"
              value="Price"
              onChange={(e) =>
                setCreatedValues({
                  ...createdValues,
                  price: parseInt(e.target.value),
                })
              }
            ></Input>
          </div>
          <button
            onClick={createProduct}
            disabled={
              createdValues.name === "" ||
              createdValues.price === 0 ||
              createdValues.quantity === 0
            }
            className={clsx(
              createdValues.name === "" ||
                createdValues.price === 0 ||
                createdValues.quantity === 0
                ? "cursor-not-allowed"
                : "cursor-pointer",
              "bg-white/5 hover:bg-white/10 w-max h-max transition-all ease-in-out delay-75 menuLink rounded-md py-2 px-2 text-h2"
            )}
          >
            Ajouter le produit
          </button>
        </div>
      </div>

      {/* PRODUITS */}
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
                Category
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
                      <select
                        value={editedValues.categoryId}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            categoryId: parseInt(e.target.value),
                          })
                        }
                        className="input  border-[1.5px] border-white/5 bg-bg-filed text-white px-4 py-2 rounded-md"
                      >
                        {categories.length !== 0 ? (
                          <>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </>
                        ) : (
                          <div>Sélectionnez</div>
                        )}
                      </select>
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
                    <td className="flex justify-end gap-4 border-b border-white/5 pr-8 p-4 pl-5 text-[#A1A1AA] text-h2 text-right">
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
                    </td>
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
                      {getCategoryNameById(item.categoryId)}
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
