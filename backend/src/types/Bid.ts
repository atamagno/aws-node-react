export interface Bid {
  id: string;
  houseId: string;
  bidder: string;
  amount: number;
}

export type CreateBidDto = Omit<Bid, 'id'>;
