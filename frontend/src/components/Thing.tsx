import type { Thing } from "../types/Thing";

const Thing = ({ thing }: { thing: Thing }) => {
  return (
    <div>
      <div>
        <h5>{thing.id}</h5>
      </div>
      <div>
        <h3>{thing.description}</h3>
      </div>
    </div>
  );
};

export default Thing;
