import { useContext } from "react";

import ThingRow from "./ThingRow";
import ThingAddForm from "./ThingAddForm";
import type { Thing } from "../types/Thing";
import ErrorBoundary from "./ErrorBoundary";
import ThingUpdateForm from "./ThingUpdateForm";
import { LoadingStatus } from "../types/LoadingStatus";
import { ThingsContext } from "../contexts/ThingsDataContext";

const ThingList = () => {
  const {
    thing,
    setThing,
    things,
    loadingStatus,
    createThing,
    readThings,
    updateThing,
    deleteThing,
  } = useContext(ThingsContext);

  const handleUpdate = (thing: Thing) => {
    setThing(thing);
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
      <br />
      <br />
      <ThingUpdateForm
        updateThing={updateThing}
        setThing={setThing}
        thing={thing}
      />
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
                deleteThing={deleteThing}
                handleUpdate={handleUpdate}
              />
            ))}
          </ErrorBoundary>
        </tbody>
      </table>
      <ThingAddForm createThing={createThing} />
    </>
  );
};

export default ThingList;
