import { GridOverlay } from "@mui/x-data-grid";
import { Box, Skeleton } from "@mui/material";

export const GridSkeleton = () => {
  return (
    <GridOverlay>
      <Box sx={{ width: "100%", height: "100%", p: 0 }}>
        <Skeleton
          animation="wave"
          height="46px"
          style={{
            backgroundColor: "var(--gray-100)",
          }}
          variant="rounded"
          width="100%"
        />
      </Box>
    </GridOverlay>
  );
};

export const skeletonColumns = Array.from({ length: 5 }).map((_, i) => ({
  field: `__skeleton_${i}`,
  width: 160,
  sortable: false,
  filterable: false,
  // 헤더 스켈레톤
  renderHeader: () => <Skeleton variant="text" width={80} />,
}));
