import { useState } from "react";

import { useThingsDataContext } from "../contexts/ThingsDataContext";

const ThingAddForm = () => {
  const { createThing } = useThingsDataContext();
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const add = () => {
    setIsAdding(true);
    const newThing = { description };
    createThing(newThing, () => {
      setIsAdding(false);
    });
    setDescription("");
  };

  return (
    <>
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        required
      />
      <button onClick={add} disabled={isAdding}>
        {isAdding ? "Adding Thing..." : "Add Thing"}
      </button>
    </>
  );
};

export default ThingAddForm;
