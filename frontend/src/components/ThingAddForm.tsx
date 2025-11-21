import { useState } from "react";

import { useThingsDataContext } from "../contexts/ThingsDataContext";

const ThingAddForm = () => {
  const { createThing } = useThingsDataContext();
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const add = () => {
    setIsAdding(true);
    const newThing = { description };
    createThing(newThing, () => {
      setIsAdding(false);
    });
    setDescription("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center gap-1 mb-3">
      <input
        className="form-control w-50"
        placeholder="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        required
      />
      <button onClick={add} disabled={isAdding || !description.trim()} className="btn btn-primary">
        {isAdding ? (
          <>
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            &nbsp;
            <span role="status">Adding Thing...</span>
          </>
        ) : (
          <span>Add Thing</span>
        )}
      </button>
    </div>
  );
};

export default ThingAddForm;
