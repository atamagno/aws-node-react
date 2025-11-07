import axios from "axios";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

import config from "../config/config";
import type { Thing } from "../types/Thing";

const ThingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [thing, setThing] = useState<Thing>();

  useEffect(() => {
    const fetchThing = async () => {
      setLoading(true);
      const response = await axios.get(`${config.restApiUrl}/thing/${id}`);
      setThing(response.data);
      setLoading(false);
    };
    fetchThing();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
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
