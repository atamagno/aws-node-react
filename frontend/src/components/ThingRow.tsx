import { useState } from "react";
import { useNavigate } from "react-router";

import type { Thing } from "../types/Thing";
import { useThingsDataContext } from "../contexts/ThingsDataContext";

const ThingRow = ({ thing }: { thing: Thing }) => {
  const navigate = useNavigate();
  const { setThing, deleteThing } = useThingsDataContext();
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
            setThing(thing);
          }}
        >
          Update
        </button>
      </td>
    </tr>
  );
};

export default ThingRow;
