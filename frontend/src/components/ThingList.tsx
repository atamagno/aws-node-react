import ThingRow from "./ThingRow";
import useThings from "../hooks/useThing";
import ErrorBoundary from "./ErrorBoundary";
import LoadingIndicator from "./LoadingIndicator";
import loadingStatus from "../helpers/loadingStatus";

const ThingList = () => {
  const { things, loadingState } = useThings();

  if (loadingState !== loadingStatus.loaded)
    return <LoadingIndicator loadingState={loadingState} />;

  return (
    <>
      <div>
        <h5>Things List</h5>
      </div>
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
    </>
  );
};

export default ThingList;
