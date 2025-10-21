import loadingStatus from '../helpers/loadingStatus';
import useHouses from '../hooks/useHouses';
import AddHouse from './AddHouse';
import ErrorBoundary from './ErrorBoundary';
import HouseRow from './HouseRow';
import LoadingIndicator from "./LoadingIndicator";

const HouseList = () => {
  const { houses, loadingState, addHouse } = useHouses();

  if (loadingState !== loadingStatus.loaded)
    return <LoadingIndicator loadingState={loadingState} />
 
  return (
    <>
      <div className="row mb-2">
        <h5 className="themeFontColor text-center">
          Houses currently on the market
        </h5>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Address</th>
            <th>Country</th>
            <th>Asking Price</th>
          </tr>
        </thead>
        <tbody>
          <ErrorBoundary fallback="Error loading house rows!">
            {houses.map(h => <HouseRow key={h.id} house={h} />)}
          </ErrorBoundary>
        </tbody>
      </table>
      <AddHouse addHouse={addHouse} />
    </>
  );
}

export default HouseList;