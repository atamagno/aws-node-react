import type { Thing } from "../types/Thing";

const ThingRow = ({ thing: thing }: { thing: Thing }) => {
  return (
    <tr>
      <td>{thing.id}</td>
      <td>{thing.description}</td>
    </tr>
  );
};

export default ThingRow;
