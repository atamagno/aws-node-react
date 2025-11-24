import { useNavigate } from "react-router";

import type { Thing } from "../types/Thing";
import { useThingsDataContext } from "../contexts/ThingsDataContext";

const ThingRow = ({ thing }: { thing: Thing }) => {
  const navigate = useNavigate();
  const { setThing } = useThingsDataContext();

  return (
    <tr>
      <td role="button" onClick={() => navigate(`/thing/${thing.id}`)}>
        {thing.id}
      </td>
      <td>{thing.description}</td>
      <td className="text-end">
        <button
          onClick={() => {
            setThing(thing);
          }}
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#deleteThingModal"
        >
          Delete
        </button>
        &nbsp;
        <button
          onClick={() => {
            setThing(thing);
          }}
          className="btn btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#updateThingModal"
        >
          Update
        </button>
      </td>
    </tr>
  );
};

export default ThingRow;
