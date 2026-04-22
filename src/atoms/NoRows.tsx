import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const NoRows = () => (
  <div className="no-rows">
    <FontAwesomeIcon icon={faCircleXmark} />
    <span>NO DATA</span>
  </div>
);

export default NoRows;
