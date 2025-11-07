import axios from "axios";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

import config from "../config/config";
import type { Thing } from "../types/Thing";
import { LoadingStatus } from "../types/LoadingStatus";

type ThingDetailState = {
  thing: Thing | undefined;
  loadingStatus: LoadingStatus;
  error: string | undefined;
};

const ThingDetail = () => {
  const { id } = useParams<{ id: string }>();

  const initialState: ThingDetailState = {
    thing: undefined,
    loadingStatus: LoadingStatus.loading,
    error: undefined,
  };

  const [thingState, setThingState] = useState<ThingDetailState>(initialState);

  useEffect(() => {
    const fetchThing = async () => {
      try {
        const response = await axios.get(`${config.restApiUrl}/thing/${id}`);
        setThingState({
          thing: response.data,
          loadingStatus: LoadingStatus.loaded,
          error: undefined,
        });
      } catch (error) {
        setThingState((prevState) => ({
          ...prevState,
          loadingStatus: LoadingStatus.error,
          error:
            error instanceof Error
              ? (error.message ?? "an unexpected error happened")
              : "an unexpected error happened",
        }));
      }
    };
    fetchThing();
  }, [id]);

  if (thingState.loadingStatus === LoadingStatus.loading) {
    return <div>Loading...</div>;
  }

  if (thingState.loadingStatus === LoadingStatus.error) {
    return <div className="card">Error: {thingState.error}</div>;
  }

  if (!thingState.thing) {
    return <div>Thing not found.</div>;
  }

  return (
    <div>
      <div>
        <h5>{thingState.thing.id}</h5>
      </div>
      <div>
        <h3>{thingState.thing.description}</h3>
      </div>
    </div>
  );
};

export default ThingDetail;
