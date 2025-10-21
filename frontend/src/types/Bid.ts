export interface Bid {
  id: number;
  houseId: number;
  bidder: string;
  amount: number;
}

export type CreateBidDto = Omit<Bid, 'id'>;