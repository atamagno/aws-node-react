import { useState } from "react";
import { useNavigate } from "react-router";

import type { Thing } from "../types/Thing";

const ThingRow = ({
  thing,
  deleteThing,
  handleUpdate,
}: {
  thing: Thing;
  deleteThing: (id: string, callbackDone: () => void) => void;
  handleUpdate: (thing: Thing) => void;
}) => {
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteHandler = () => {
    setIsDeleting(true);
    deleteThing(thing.id, () => {
      setIsDeleting(false);
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
        <button
          onClick={() => {
            handleUpdate(thing);
          }}
        >
          Update
        </button>
      </td>
    </tr>
  );
};

export default ThingRow;
