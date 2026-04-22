import { useEffect, useRef, useState } from "react";
import { JSX } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";

import { TooltipProps } from "../types/interface/PageInterface";

const StyledTooltip = ({ value, children }: TooltipProps): JSX.Element => {
  // 복사
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      timerRef.current = window.setTimeout(() => setCopied(false), 1000);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <Tooltip
        placement="bottom-start"
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -8],
                },
              },
            ],
          },
          tooltip: {
            sx: {
              fontSize: "14px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              borderRadius: "8px",
            },
          },
        }}
        title={
          <Box alignItems="center" display="flex" gap={1}>
            <span style={{ wordBreak: "break-word" }}>{value}</span>
            <IconButton
              aria-label="복사"
              size="small"
              sx={{ color: "#fff" }}
              onClick={() => handleCopy(value)}
            >
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
            </IconButton>
          </Box>
        }
      >
        <span>{children}</span>
      </Tooltip>
    </>
  );
};

export default StyledTooltip;
