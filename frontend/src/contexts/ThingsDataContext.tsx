import { type ReactNode, createContext, useState } from "react";

import useThingsData from "../hooks/useThingData";
import type { CreateThingDto, Thing } from "../types/Thing";

interface ThingsDataContextProps {
  thing: Thing;
  setThing: React.Dispatch<React.SetStateAction<Thing>>;
  things: Thing[];
  loadingStatus: string;
  createThing: (thing: CreateThingDto, callbackDone: () => void) => void;
  readThings: () => void;
  updateThing: (thing: Thing, callbackDone: () => void) => void;
  deleteThing: (id: string, callbackDone: () => void) => void;
}

export const ThingsContext = createContext<ThingsDataContextProps>({
  thing: {
    id: "",
    description: "",
  },
  setThing: () => {},
  things: [],
  loadingStatus: "",
  createThing: () => {},
  readThings: () => {},
  updateThing: () => {},
  deleteThing: () => {},
});

export const ThingsDataProvider = ({ children }: { children: ReactNode }) => {
  const {
    things,
    loadingStatus,
    createThing,
    readThings,
    updateThing,
    deleteThing,
  } = useThingsData();

  const [thing, setThing] = useState<Thing>({
    id: "",
    description: "",
  });

  const value = {
    thing,
    setThing,
    things,
    loadingStatus,
    createThing,
    readThings,
    updateThing,
    deleteThing,
  };

  return (
    <ThingsContext.Provider value={value}>{children}</ThingsContext.Provider>
  );
};
