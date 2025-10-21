import { useNavigate } from "react-router";
import logo from "../assets/GloboLogo.png";
import styles from "./Banner.module.css";

const subtitleStyle = {
  fontStyle: "italic",
  fontSize: "x-large",
  color: "coral",
};

type BannerProps = { children: React.ReactNode };

const Banner = ({ children }: BannerProps) => {
  const navigate = useNavigate();
  return (
    <header className="row mb-4">
      <div className="col-5">
        <img src={logo} className={styles.logo} alt="logo"
          onClick={() => navigate("/")}/>
      </div>
      <div className="col-7 mt-5" style={subtitleStyle}>
        {children}
      </div>
    </header>
  );
}

export default Banner;