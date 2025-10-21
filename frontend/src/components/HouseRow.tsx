import { useNavigate } from "react-router";
import currencyFormatter from "../helpers/currencyFormatter";
import type { House } from "../types/House";

const HouseRow = ({ house }: { house: House }) => {
  const navigate = useNavigate();
  return (
    <tr onClick={() => navigate(`/house/`, { state: { house } })}>
      <td>{house.address}</td>
      <td>{house.country}</td>
      {house.price && (
        <td className={`${house.price >= 500000 ? "text-primary" : ""}`}>
          {currencyFormatter.format(house.price)}
        </td>
      )}
    </tr>
  );
}

export default HouseRow;