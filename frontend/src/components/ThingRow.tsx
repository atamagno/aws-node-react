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
      <td role="button" onClick={() => navigate(`/thing/${thing.id}`)}>
        {thing.id}
      </td>
      <td>{thing.description}</td>
      <td className="text-end">
        <button onClick={deleteHandler} disabled={isDeleting} className="btn btn-primary">
          {isDeleting ? (
            <>
              <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
              &nbsp;
              <span role="status">Deleting...</span>
            </>
          ) : (
            <span>Delete</span>
          )}
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
