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
      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <div className="fw-medium fs-5">Things List</div>
        <button
          className="btn btn-primary"
          onClick={() => {
            readThings();
          }}
        >
          Get Things
        </button>
      </div>
      <ThingAddForm />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Description</th>
            <th></th>
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
      <ThingUpdateForm />
    </>
  );
};

export default ThingList;
