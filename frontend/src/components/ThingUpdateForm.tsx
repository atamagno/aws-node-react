import { useState } from "react";

import { useThingsDataContext } from "../contexts/ThingsDataContext";

const ThingUpdateForm = () => {
  const { thing, setThing, updateThing } = useThingsDataContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const update = () => {
    setIsUpdating(true);
    updateThing(thing, () => {
      setIsUpdating(false);
    });
    setThing({ id: "", description: "" });
  };

  return (
    <>
      <input
        placeholder="Description"
        value={thing.description}
        onChange={(e) => {
          setThing({
            ...thing,
            description: e.target.value,
          });
        }}
        required
      />
      <button
        onClick={update}
        disabled={isUpdating || !thing.id || !thing.description.trim()}
      >
        {isUpdating ? "Updating Thing..." : "Update Thing"}
      </button>
    </>
  );
};

export default ThingUpdateForm;
