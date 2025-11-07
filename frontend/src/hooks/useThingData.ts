import config from "../config/config";
import type { CreateThingDto, Thing } from "../types/Thing";
import useGeneralizedCrudMethods from "./useGeneralizedCrudMethods";

const useThingsData = () => {
  const {
    data,
    loadingStatus,
    createRecord,
    readRecords,
    updateRecord,
    deleteRecord,
  } = useGeneralizedCrudMethods<Thing>(`${config.restApiUrl}/thing`);

  const createThing = (thing: CreateThingDto) => {
    createRecord<CreateThingDto>(thing);
  };

  const readThings = () => {
    readRecords();
  };

  const updateThing = (thing: Thing) => {
    updateRecord<Thing>(thing);
  };

  const deleteThing = (id: string) => {
    deleteRecord(id);
  };

  return {
    things: data,
    loadingStatus,
    createThing,
    readThings,
    updateThing,
    deleteThing,
  };
};

export default useThingsData;
