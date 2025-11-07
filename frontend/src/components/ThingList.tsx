import axios from "axios";
import { useEffect, useState } from "react";

import ThingRow from "./ThingRow";
import config from "../config/config";
import type { Thing } from "../types/Thing";
import ErrorBoundary from "./ErrorBoundary";
import { LoadingStatus } from "../types/LoadingStatus";

type ThingState = {
  things: Thing[];
  loadingStatus: LoadingStatus;
  error: string | undefined;
};

const ThingList = () => {
  const initialState: ThingState = {
    things: [],
    loadingStatus: LoadingStatus.loading,
    error: undefined,
  };

  const [thingsState, setThingsState] = useState<ThingState>(initialState);

  useEffect(() => {
    const fetchThings = async () => {
      try {
        const response = await axios.get(`${config.restApiUrl}/thing`);
        console.log(response);
        setThingsState({
          things: response.data,
          loadingStatus: LoadingStatus.loaded,
          error: undefined,
        });
      } catch (error) {
        setThingsState({
          ...thingsState,
          loadingStatus: LoadingStatus.error,
          error:
            error instanceof Error
              ? (error.message ?? "an unexpected error happened")
              : "an unexpected error happened",
        });
      }
    };
    fetchThings();
  }, []);

  if (thingsState.loadingStatus === LoadingStatus.loading) {
    return <div>Loading...</div>;
  }

  if (thingsState.loadingStatus === LoadingStatus.error) {
    return <div className="card">Error: {thingsState.error}</div>;
  }

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
            {thingsState.things.map((h) => (
              <ThingRow key={h.id} thing={h} />
            ))}
          </ErrorBoundary>
        </tbody>
      </table>
    </>
  );
};

export default ThingList;
