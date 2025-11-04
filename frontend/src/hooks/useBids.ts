import { useEffect, useState } from "react";
import loadingStatus from "../helpers/loadingStatus";
import type { Bid, CreateBidDto } from "../types/Bid";
import config from "../config/config";

const useBids = (houseId: string) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loadingState, setLoadingState] = useState(loadingStatus.isLoading);

  useEffect(() => {
    const fetchBids = async () => {
      setLoadingState(loadingStatus.isLoading);
      try {
        const response = await fetch(`${config.restApiUrl}/bid/${houseId}`);
        const bids = await response.json();
        setBids(bids);
        setLoadingState(loadingStatus.loaded);
      } catch {
        setLoadingState(loadingStatus.hasErrored);
      }
    };
    fetchBids();
  }, [houseId]);

  const postBid = async (bid: CreateBidDto): Promise<Bid> => {
    const rsp = await fetch(`${config.restApiUrl}/bid`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bid),
    });
    return await rsp.json();
  };

  const addBid = async (bid: CreateBidDto) => {
    const postedBid = await postBid(bid);
    setBids([...bids, postedBid]);
  };

  return { bids, loadingState, addBid };
};

export default useBids;
