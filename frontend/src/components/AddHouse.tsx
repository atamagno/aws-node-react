import { useState, useTransition } from "react";
import type { CreateHouseDto } from "../types/House";

const AddHouse = ({ addHouse }: { addHouse: (house: CreateHouseDto) => Promise<void> }) => {
  const [isPending, startTransition] = useTransition();

  // const emptyHouse: CreateHouseDto = {
  //   address: "",
  //   country: "",
  //   description: "",
  //   price: 0,
  // };

  // TODO: Replace with form inputs to create a new house
  const emptyHouse: CreateHouseDto = {
    address: "12 Valley of Kings, Geneva",
    country: "Switzerland",
    description: "A beautiful house located in the heart of Geneva.",
    price: 900000,
  };

  const [newHouse, setNewHouse] = useState(emptyHouse);

  const onHouseSubmitClick = () => {
    startTransition(async () => {
      await addHouse(newHouse);
    });
    setNewHouse(emptyHouse);
  };

  return (
    <>
      <button 
        onClick={onHouseSubmitClick}
        className="btn btn-primary"
        disabled={isPending}
      >
        Add
      </button>
    </>
  );
};

export default AddHouse;