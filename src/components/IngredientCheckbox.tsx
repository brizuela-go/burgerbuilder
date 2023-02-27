import { useState } from "react";
import { IIngredient } from "../interfaces/IIngredient";

type IngredientCheckboxProps = {
  ingredient: IIngredient;
  onChange: Function;
  index: number;
};

const IngredientCheckbox = ({
  ingredient,
  onChange,
}: IngredientCheckboxProps) => {
  const intitialChecks = Array(ingredient.quantity).fill(false);

  const [quantity, setQuantity] = useState(0);
  const [checks, setChecks] = useState<boolean[]>(intitialChecks);
  const [showQuantity, setShowQuantity] = useState<boolean>(false);

  const handleChange = (event: { target: { checked: any } }) => {
    const checked = event.target.checked;

    if (checked) {
      onChange((prev: any) => [
        ...prev,
        {
          id: ingredient.id,
          name: ingredient.name,
          quantity,
          icon: ingredient.icon,
        },
      ]);
      setChecks(Array(quantity).fill(true));
      setShowQuantity(true);
    } else {
      onChange((prev: any[]) => {
        const filtered = prev.filter(
          (item: { id: any }) => item.id !== ingredient.id
        );
        setChecks(Array(filtered.length).fill(true));
        setShowQuantity(filtered.length > 0);
        return filtered;
      });
    }
  };

  const handleQuantityChange = (event: { target: { value: string } }) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
      onChange((prev: { id: any }[]) =>
        prev.map((item: { id: any }) =>
          item.id === ingredient.id ? { ...item, quantity: value } : item
        )
      );
    }
  };

  return (
    <div>
      <input type="checkbox" onChange={handleChange} />
      {ingredient.name}
      {ingredient.icon}
      {showQuantity && (
        <input
          type="number"
          value={quantity || ""}
          onChange={handleQuantityChange}
        />
      )}
    </div>
  );
};

export default IngredientCheckbox;
