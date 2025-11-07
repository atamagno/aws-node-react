import ThingRow from "./ThingRow";
import ThingAddForm from "./ThingAddForm";
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
                deleteThing={deleteThing}
                updateThing={updateThing}
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
