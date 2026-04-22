import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faArrowLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress } from "@mui/material";

import { PageTitle } from "../molecules/Title";
import { DetailPageContentProps } from "../types/interface/PageInterface";
import { Button } from "../atoms/Button";

const DetailPageContent = ({
  link,
  title,
  id,
  infoData,
  keys,
}: DetailPageContentProps) => {
  // loading
  const [loading, setLoading] = useState<boolean>(true);
  const arrayToString = (item: unknown) => {
    if (item === null) return null;
    if (item instanceof Date) return item.toLocaleString();
    if (typeof item === "boolean") return item ? "TRUE" : "FALSE";
    if (typeof item === "bigint") return item.toString();
    if (typeof item === "object") return JSON.stringify(item);

    return String(item);
  };

  useEffect(() => {
    if (keys !== null) setLoading(false);
  }, [keys]);

  return (
    <>
      <div className="detail-header">
        <Button className="back-button">
          <Link to={link}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </Button>
        <PageTitle>{title}</PageTitle>
      </div>
      <div className="detail-content">
        <p className="data-id">
          <FontAwesomeIcon icon={faCaretRight} />
          {id}
        </p>
        {!loading ? (
          <ul className="data-list">
            {keys?.map((item, index) => (
              <li key={index} className="data-item">
                <p className="data-key">{item}</p>
                <p className="data-value">{arrayToString(infoData?.[item])}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="loading">
            <CircularProgress />
          </div>
        )}
      </div>
    </>
  );
};

export default DetailPageContent;
