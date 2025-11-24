import { useState } from "react";
import { Modal } from "bootstrap";

import { useThingsDataContext } from "../contexts/ThingsDataContext";

const ThingDeleteForm = () => {
  const { thing, deleteThing } = useThingsDataContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteThingHandler = () => {
    setIsDeleting(true);
    deleteThing(thing.id, () => {
      setIsDeleting(false);
      const modalEl = document.getElementById("deleteThingModal");
      if (modalEl) {
        const modal = Modal.getInstance(modalEl);
        if (modal) {
          modal.hide();
        }
      }
    });
  };

  return (
    <div className="modal fade" id="deleteThingModal" tabIndex={-1} aria-labelledby="deleteThingModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="deleteThingModalLabel">
              Delete Thing
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete the thing with ID <strong>{thing.id}</strong>?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button onClick={deleteThingHandler} disabled={isDeleting || !thing.id} className="btn btn-danger">
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  &nbsp;
                  <span role="status">Deleting Thing...</span>
                </>
              ) : (
                <span>Delete Thing</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThingDeleteForm;
