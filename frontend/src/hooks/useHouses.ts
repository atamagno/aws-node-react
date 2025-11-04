import { useEffect, useState } from "react";
import loadingStatus from "../helpers/loadingStatus";
import type { CreateHouseDto, House } from "../types/House";
import config from "../config/config";

const useHouses = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [loadingState, setLoadingState] = useState(loadingStatus.isLoading);

  useEffect(() => {
    const fetchHouses = async () => {
      setLoadingState(loadingStatus.isLoading);
      try {
        const response = await fetch(`${config.restApiUrl}/house`);
        const houses = await response.json();
        setHouses(houses);
        setLoadingState(loadingStatus.loaded);
      } catch {
        setLoadingState(loadingStatus.hasErrored);
      }
    };
    fetchHouses();
  }, []);

  const postHouse = async (house: CreateHouseDto): Promise<House> => {
    const rsp = await fetch(`${config.restApiUrl}/house`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(house),
    });
    return await rsp.json();
  };

  const addHouse = async (house: CreateHouseDto) => {
    const postedHouse = await postHouse(house);
    setHouses([...houses, postedHouse]);
  };

  return { houses, loadingState, addHouse };
};

export default useHouses;
