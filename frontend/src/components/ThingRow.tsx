import { useState } from "react";
import { useNavigate } from "react-router";

import type { Thing } from "../types/Thing";

const ThingRow = ({
  thing,
  deleteThing,
  updateThing,
}: {
  thing: Thing;
  deleteThing: (id: string, callbackDone: () => void) => void;
  updateThing: (thing: Thing, callbackDone: () => void) => void;
}) => {
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const deleteHandler = () => {
    setIsDeleting(true);
    deleteThing(thing.id, () => {
      setIsDeleting(false);
    });
  };

  const updateHandler = () => {
    setIsUpdating(true);
    const updatedThing = { ...thing, description: "UPDATED " + Math.random() }; // TODO: remove this hardcoded update
    updateThing(updatedThing, () => {
      setIsUpdating(false);
    });
  };

  return (
    <tr>
      <td onClick={() => navigate(`/thing/${thing.id}`)}>{thing.id}</td>
      <td>{thing.description}</td>
      <td>
        <button onClick={deleteHandler} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button onClick={updateHandler} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </td>
    </tr>
  );
};

export default ThingRow;
