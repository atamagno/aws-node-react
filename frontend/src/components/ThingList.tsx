import axios from "axios";
import { useEffect, useState } from "react";

import ThingRow from "./ThingRow";
import config from "../config/config";
import ErrorBoundary from "./ErrorBoundary";
import { LoadingStatus } from "../types/LoadingStatus";
import type { CreateThingDto, Thing } from "../types/Thing";

type ThingListState = {
  things: Thing[];
  loadingStatus: LoadingStatus;
  error: string | undefined;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ThingList = () => {
  const initialState: ThingListState = {
    things: [],
    loadingStatus: LoadingStatus.loading,
    error: undefined,
  };

  const [thingsState, setThingsState] = useState<ThingListState>(initialState);
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchThings = async () => {
      try {
        await delay(1000);
        const response = await axios.get(`${config.restApiUrl}/thing`);
        setThingsState({
          things: response.data,
          loadingStatus: LoadingStatus.loaded,
          error: undefined,
        });
      } catch (error) {
        setThingsState((prevState) => ({
          ...prevState,
          loadingStatus: LoadingStatus.error,
          error:
            error instanceof Error
              ? (error.message ?? "an unexpected error happened")
              : "an unexpected error happened",
        }));
      }
    };
    fetchThings();
  }, []);

  const createThing = (thing: CreateThingDto) => {
    const addData = async () => {
      try {
        setIsAdding(true);
        await delay(1000);
        const response = await axios.post(`${config.restApiUrl}/thing`, thing);
        const newThing = response.data;
        setIsAdding(false);
        setThingsState({
          ...thingsState,
          things: [newThing, ...thingsState.things],
        });
      } catch (error) {
        setIsAdding(false);
        setThingsState({
          ...thingsState,
          error:
            error instanceof Error
              ? (error.message ?? "an unexpected error happened")
              : "an unexpected error happened",
        });
      }
    };
    addData();
  };

  const handleAddClick = () => {
    const newThing = { description };
    createThing(newThing);
    setDescription("");
  };

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
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        required
      />
      <button onClick={handleAddClick} disabled={isAdding}>
        {isAdding ? "Adding Thing..." : "Add Thing"}
      </button>
    </>
  );
};

export default ThingList;
