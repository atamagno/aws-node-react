import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate("/")}>
      <p>Header</p>
    </div>
  );
};

export default Header;
