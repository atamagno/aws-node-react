import { useState } from "react";

import { useThingsDataContext } from "../contexts/ThingsDataContext";

const ThingUpdateForm = () => {
  const { thing, setThing, updateThing } = useThingsDataContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const update = () => {
    setIsUpdating(true);
    updateThing(thing, () => {
      setIsUpdating(false);
    });
    setThing({ id: "", description: "" });
  };

  return (
    <div className="d-flex justify-content-center align-items-center gap-1 mb-3">
      <input
        className="form-control w-50"
        placeholder="Description"
        value={thing.description}
        onChange={(e) => {
          setThing({
            ...thing,
            description: e.target.value,
          });
        }}
        required
      />
      <button onClick={update} disabled={isUpdating || !thing.id || !thing.description.trim()} className="btn btn-primary">
        {isUpdating ? (
          <>
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            &nbsp;
            <span role="status">Updating Thing...</span>
          </>
        ) : (
          <span>Update Thing</span>
        )}
      </button>
    </div>
  );
};

export default ThingUpdateForm;
