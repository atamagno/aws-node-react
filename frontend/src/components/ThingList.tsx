import { useState } from "react";

import ThingRow from "./ThingRow";
import type { Thing } from "../types/Thing";
import ErrorBoundary from "./ErrorBoundary";
import useThingsData from "../hooks/useThingData";
import { LoadingStatus } from "../types/LoadingStatus";

const ThingList = () => {
  const {
    things,
    loadingStatus,
    createThing,
    readThings,
    updateThing,
    deleteThing,
  } = useThingsData();
  const [description, setDescription] = useState("");

  const handleDelete = (id: string) => {
    deleteThing(id);
  };

  const handleUpdate = (thing: Thing) => {
    updateThing(thing);
  };

  const add = () => {
    const newThing = { description };
    createThing(newThing);
    setDescription("");
  };

  if (loadingStatus === LoadingStatus.loading) {
    return <div>Loading...</div>;
  }

  if (loadingStatus === LoadingStatus.error) {
    return <div>Error</div>;
  }

  return (
    <>
      <div>
        <h5>Things List</h5>
      </div>
      <button
        onClick={() => {
          readThings();
        }}
      >
        Get Things
      </button>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <ErrorBoundary fallback="Error loading thing rows!">
            {things.map((h) => (
              <ThingRow
                key={h.id}
                thing={h}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            ))}
          </ErrorBoundary>
        </tbody>
      </table>
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        required
      />
      <button onClick={add}>{"Add Thing"}</button>
      {/* <button onClick={add} disabled={isAdding}>
        {isAdding ? "Adding Thing..." : "Add Thing"}
      </button> */}
    </>
  );
};

export default ThingList;
