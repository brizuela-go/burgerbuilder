import { useState } from "react";
import { IIngredient } from "../interfaces/IIngredient";

interface IngredientCheckboxProps {
  ingredient: IIngredient;
  onChange: Function;
}

const IngredientCheckbox = ({
  ingredient,
  onChange,
}: IngredientCheckboxProps) => {
  const [quantity, setQuantity] = useState(0);

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
    } else {
      onChange((prev: any[]) =>
        prev.filter((item: { id: any }) => item.id !== ingredient.id)
      );
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
      <input
        type="number"
        value={quantity || ""}
        onChange={handleQuantityChange}
      />
    </div>
  );
};

export default IngredientCheckbox;
