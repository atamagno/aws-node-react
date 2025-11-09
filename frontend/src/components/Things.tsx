import ThingList from "./ThingList";
import { ThingsDataProvider } from "../contexts/ThingsDataContext";

const Things = () => {
  return (
    <ThingsDataProvider>
      <ThingList />
    </ThingsDataProvider>
  );
};

export default Things;
