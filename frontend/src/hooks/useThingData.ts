import config from "../config/config";
import type { CreateThingDto, Thing } from "../types/Thing";
import useGeneralizedCrudMethods from "./useGeneralizedCrudMethods";

const useThingsData = () => {
  const {
    data,
    error,
    loadingStatus,
    createRecord,
    readRecords,
    updateRecord,
    deleteRecord,
  } = useGeneralizedCrudMethods<Thing>(`${config.restApiUrl}/thing`);

  const createThing = (thing: CreateThingDto, callbackDone: () => void) => {
    createRecord<CreateThingDto>(thing, callbackDone);
  };

  const readThings = () => {
    readRecords();
  };

  const updateThing = (thing: Thing, callbackDone: () => void) => {
    updateRecord<Thing>(thing, callbackDone);
  };

  const deleteThing = (id: string, callbackDone: () => void) => {
    deleteRecord(id, callbackDone);
  };

  return {
    things: data,
    loadingStatus,
    error,
    createThing,
    readThings,
    updateThing,
    deleteThing,
  };
};

export default useThingsData;
