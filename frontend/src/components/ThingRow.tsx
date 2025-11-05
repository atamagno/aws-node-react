import { useNavigate } from "react-router";

import type { Thing } from "../types/Thing";

const ThingRow = ({ thing: thing }: { thing: Thing }) => {
  const navigate = useNavigate();
  return (
    <tr onClick={() => navigate(`/thing`, { state: { thing } })}>
      <td>{thing.address}</td>
      <td>{thing.country}</td>
      <td>{thing.price}</td>
    </tr>
  );
};

export default ThingRow;
