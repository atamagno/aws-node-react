import ThingRow from "./ThingRow";
import ThingAddForm from "./ThingAddForm";
import ErrorBoundary from "./ErrorBoundary";
import ThingUpdateForm from "./ThingUpdateForm";
import { LoadingStatus } from "../types/LoadingStatus";
import { useThingsDataContext } from "../contexts/ThingsDataContext";

const ThingList = () => {
  const { things, loadingStatus, readThings } = useThingsDataContext();

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
      <ThingUpdateForm />
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
              <ThingRow key={h.id} thing={h} />
            ))}
          </ErrorBoundary>
        </tbody>
      </table>
      <ThingAddForm />
    </>
  );
};

export default ThingList;
