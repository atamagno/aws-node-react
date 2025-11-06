import axios from "axios";
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
        const response = await axios.get(`${config.restApiUrl}/thing`);
        setThings(response.data);
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
