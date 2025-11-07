import { useState } from "react";

import type { Thing } from "../types/Thing";

const ThingUpdateForm = ({
  updateThing,
  setThing,
  thing,
}: {
  updateThing: (thing: Thing, callbackDone: () => void) => void;
  setThing: (thing: Thing) => void;
  thing: Thing;
}) => {
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
      <button onClick={update} disabled={isUpdating || !thing.id}>
        {isUpdating ? "Updating Thing..." : "Update Thing"}
      </button>
    </>
  );
};

export default ThingUpdateForm;
