import { useEffect, useState } from "react";

import config from "../config/config";
import type { Thing } from "../types/Thing";
import loadingStatus from "../helpers/loadingStatus";

const useThings = () => {
  const [things, setThings] = useState<Thing[]>([]);
  const [loadingState, setLoadingState] = useState(loadingStatus.isLoading);

  useEffect(() => {
    const fetchThings = async () => {
      setLoadingState(loadingStatus.isLoading);
      try {
        const response = await fetch(`${config.restApiUrl}/thing`);
        const things = await response.json();
        setThings(things);
        setLoadingState(loadingStatus.loaded);
      } catch {
        setLoadingState(loadingStatus.hasErrored);
      }
    };
    fetchThings();
  }, []);

  return { things, loadingState };
};

export default useThings;
