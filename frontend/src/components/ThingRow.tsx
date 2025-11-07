import { useNavigate } from "react-router";

import type { Thing } from "../types/Thing";

const ThingRow = ({
  thing,
  handleDelete,
  handleUpdate,
}: {
  thing: Thing;
  handleDelete: (id: string) => void;
  handleUpdate: (thing: Thing) => void;
}) => {
  const navigate = useNavigate();
  return (
    <tr>
      <td onClick={() => navigate(`/thing/${thing.id}`)}>{thing.id}</td>
      <td>{thing.description}</td>
      <td>
        <button
          onClick={() => {
            handleDelete(thing.id);
          }}
        >
          Delete
        </button>
        <button
          onClick={() => {
            handleUpdate({ ...thing, description: "UPDATED " + Math.random() });
          }}
        >
          Update
        </button>
      </td>
    </tr>
  );
};

export default ThingRow;
