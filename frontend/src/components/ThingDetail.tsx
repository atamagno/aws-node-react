import { useEffect } from "react";
import { useParams } from "react-router";

import { LoadingStatus } from "../types/LoadingStatus";
import { useThingsDataContext } from "../contexts/ThingsDataContext";

const ThingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { thing, loadingStatus, readThingById } = useThingsDataContext();

  useEffect(() => {
    if (id) {
      readThingById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loadingStatus === LoadingStatus.loading) {
    return <div>Loading...</div>;
  }

  if (loadingStatus === LoadingStatus.error) {
    return <div>Error loading thing</div>;
  }

  console.log("ThingDetail thing:", thing);
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
