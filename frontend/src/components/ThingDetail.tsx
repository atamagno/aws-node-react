import { useParams } from "react-router";

import { LoadingStatus } from "../types/LoadingStatus";
import { useThingsDataContext } from "../contexts/ThingsDataContext";

const ThingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { loadingStatus, things } = useThingsDataContext();

  const thing = things.find((t) => t.id === id);

  if (loadingStatus === LoadingStatus.loading) {
    return <div>Loading...</div>;
  }

  if (loadingStatus === LoadingStatus.error) {
    return <div>Error</div>;
  }

  if (!thing) {
    return <div>Thing not found.</div>;
  }

  return (
    <div>
      <div>
        <h5>{thing.id}</h5>
      </div>
      <div>
        <h3>{thing.description}</h3>
      </div>
    </div>
  );
};

export default ThingDetail;
