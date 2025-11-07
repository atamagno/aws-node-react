import axios from "axios";
import { useEffect, useState } from "react";

import ThingRow from "./ThingRow";
import config from "../config/config";
import type { Thing } from "../types/Thing";
import ErrorBoundary from "./ErrorBoundary";

const ThingList = () => {
  const [loading, setLoading] = useState(true);
  const [things, setThings] = useState<Thing[]>([]);

  useEffect(() => {
    const fetchThings = async () => {
      setLoading(true);
      const response = await axios.get(`${config.restApiUrl}/thing`);
      setThings(response.data);
      setLoading(false);
    };
    fetchThings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
