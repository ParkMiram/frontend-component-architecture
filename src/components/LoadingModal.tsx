import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { ModalTitle } from "../molecules/Title";

const LoadingModal = () => {
  return (
    <div
      className="modal-backdrop"
      // onClick={onBackdropClick}
      style={{ zIndex: 1 }}
    >
      <div className="modal-container">
        <div className="modal-header">
          <ModalTitle>
            <FontAwesomeIcon icon={faSpinner} />
            Loading
          </ModalTitle>

          <div className="modal-content">
            {/*<CircularProgress />*/}
            <p className="error-message">{/* 메세지 */}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
