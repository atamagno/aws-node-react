import { useNavigate } from "react-router";

import type { Thing } from "../types/Thing";

const ThingRow = ({ thing: thing }: { thing: Thing }) => {
  const navigate = useNavigate();
  return (
    <tr>
      <td onClick={() => navigate(`/thing/${thing.id}`)}>{thing.id}</td>
      <td>{thing.description}</td>
    </tr>
  );
};

export default ThingRow;
