import { useState } from "react";
import { Modal } from "bootstrap";

import { useThingsDataContext } from "../contexts/ThingsDataContext";

const ThingUpdateForm = () => {
  const { thing, setThing, updateThing } = useThingsDataContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const update = () => {
    setIsUpdating(true);
    updateThing(thing, () => {
      setIsUpdating(false);
      setThing({ id: "", description: "" });
      const modalEl = document.getElementById("updateThingModal");
      if (modalEl) {
        const modal = Modal.getInstance(modalEl);
        if (modal) {
          modal.hide();
        }
      }
    });
  };

  return (
    <div
      className="modal fade"
      id="updateThingModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="updateThingModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="updateThingModalLabel">
              Update Thing
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <input
              className="form-control"
              placeholder="Description"
              disabled={isUpdating}
              value={thing.description}
              onChange={(e) => {
                setThing({
                  ...thing,
                  description: e.target.value,
                });
              }}
              required
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
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
        </div>
      </div>
    </div>
  );
};

export default ThingUpdateForm;
