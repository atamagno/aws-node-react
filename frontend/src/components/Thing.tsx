import { useLocation } from "react-router";

const Thing = () => {
  const location = useLocation();
  const { thing } = location.state;

  return (
    <div className="row">
      <div className="row mt-2">
        <h5 className="col-12">{thing.country}</h5>
      </div>
      <div className="row">
        <h3 className="col-12">{thing.address}</h3>
      </div>
      <div className="row">
        <h2 className="themeFontColor col-12">{thing.price}</h2>
      </div>
      <div className="row">
        <div className="col-12 mt-3">{thing.description}</div>
      </div>
    </div>
  );
};

export default Thing;
