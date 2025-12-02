import {
  Skeleton,
  Box,
  Grid,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import { CardContainer } from "./Components";
import { useWindowSize } from "@uidotdev/usehooks";
import { isMobileWidth } from "..";

export const CardContainerSkeleton = ({ isMobile = false }) => {
  return (
    <div className="flex flex-col gap-4">
      <CardContainer
        extraClasses={isMobile ? "grid-cols-2" : ""}
        padding={isMobile ? "8px" : "16px"}
        gap={isMobile ? "8px" : "16px"}
      >
        {[...Array(8)]?.map((item, idx) => (
          <Skeleton
            key={`Skeleton-${idx}`}
            variant="rounded"
            width={"100%"}
            height={isMobile ? "160px" : "250px"}
          />
        ))}
      </CardContainer>
    </div>
  );
};

export const TableSkeleton = ({
  headers = [],
  rows = 3,
  cellsPerRow = 3,
  padding = null,
  backgroundColor = "#EBEBEB",
  backgroundColorRows = "#F5F5F5",
  disableHeader = false,
}) => {
  return (
    <TableContainer sx={{ overflowX: "scroll" }}>
      <Table>
        {disableHeader === false && (
          <TableHead>
            <TableRow sx={{ backgroundColor: backgroundColor }}>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    minWidth: "150px",
                    height: "20px",
                    padding: padding,
                  }}
                >
                  <Skeleton variant="rectangular" height="20px" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {[...Array(rows)].map((_, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{ backgroundColor: backgroundColorRows }}
            >
              {[...Array(cellsPerRow)].map((_, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  sx={{
                    padding: padding,
                  }}
                >
                  <Skeleton variant="rectangular" height="20px" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const OverviewFeedSkeleton = () => {
  return (
    <div className={`flex flex-col  bg-white rounded-lg p-4 gap-6 col-span-2`}>
      <div className="flex justify-between pb-3 pr-6 ">
        <Skeleton variant="rectangular" width={"100px"} height={"24px"} />
      </div>
      <div className={`grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-20`}>
        {[...Array(4)]?.map((item, idx) => (
          <div
            key={idx}
            className="w-full min-h-fit flex rounded-lg rounded-tr-none flex-col gap-4 p-1 sm:p-4 -mt-3 bg-[#F5F5F5] relative"
          >
            <div
              className="absolute py-4 pl-10 pr-4 flex text-sm sm:text-base gap-2 items-center justify-center bg-[#F5F5F5] rounded-t-lg -top-[50px] h-[50px] right-0"
              style={{
                clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            >
              <Skeleton variant="rectangular" width={"100px"} height={"24px"} />
            </div>
            <div className="w-full grid gap-4 h-fit lg:h-[100px] grid-cols-7">
              <div className="col-span-5 grid gap-4 sm:grid-cols-2">
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100px"}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100px"}
                />
              </div>
              <div className="col-span-2">
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100px"}
                />
              </div>
            </div>
            <div className="grid grid-cols-7 mt-2 grid-rows-1 gap-4 w-full">
              <div className="col-span-7 sm:col-span-5 w-full grid gap-4 ">
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"320px"}
                />
              </div>
              <div className="col-span-7 sm:col-span-2 w-full  grid gap-4 ">
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"320px"}
                />
              </div>
            </div>
            <div className="w-full grid">
              <Skeleton variant="rectangular" width={"100%"} height={"40px"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnalyticsSkeleton = ({
  height = "35vh",
  isCircular = true,
  isBar = true,
  showBar = true,
  showCircle = true,
}) => {
  const { width } = useWindowSize();
  const stackedColumnChart = Array.from(
    { length: width < 700 ? 4 : 7 },
    () => ({
      height: `${Math.floor(Math.random() * 51) + 50}%`,
    })
  );

  return (
    <div
      className="flex gap-4 mob:gap-14 flex-wrap items-stretch py-4 px-3p"
      style={{ height: "fit-content", minHeight: height }}
    >
      {showCircle && (
        <div className="flex flex-col gap-6 items-center flex-grow mob:flex-grow-0 flex-shrink-0">
          <Skeleton
            variant={isCircular ? "circular" : "rectangular"}
            width={width < isMobileWidth ? "200px" : "250px"}
            height={width < isMobileWidth ? "200px" : "250px"}
          />
        </div>
      )}
      {showBar &&
        (isBar ? (
          <div
            className="h-full w-[500px] flex justify-between items-end flex-grow relative"
            style={{
              height: width < isMobileWidth ? "300px" : height,
            }}
          >
            {stackedColumnChart?.map((bar, index) => (
              <Skeleton
                key={index}
                height={bar?.height}
                variant="rectangular"
                width="70px"
                sx={{
                  borderTopLeftRadius: "6px",
                  borderTopRightRadius: "6px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                }}
              />
            ))}

            <Skeleton
              width={"100%"}
              height={"16px"}
              variant="rectangular"
              sx={{
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                position: "absolute",
                bottom: 0,
              }}
            />
          </div>
        ) : (
          <div
            className="h-full w-[500px] flex flex-col flex-grow relative"
            style={{
              height: width < isMobileWidth ? "300px" : height,
            }}
          >
            {/* Horizontal axis */}
            <Skeleton
              width="100%"
              height="16px"
              variant="rectangular"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
              }}
            />

            {/* Vertical axis */}
            <Skeleton
              width="16px"
              height="100%"
              variant="rectangular"
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
              }}
            />

            {/* Line chart data */}
            <div className="flex flex-grow relative">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="relative flex-grow flex justify-center items-end"
                  style={{
                    height: `${Math.random() * 60 + 40}%`, // Randomized height for visual effect
                  }}
                >
                  <Skeleton
                    variant="circular"
                    width="16px"
                    height="16px"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                    }}
                  />
                  {/* {index > 0 && (
                  <Skeleton
                    width="100%"
                    height="2px"
                    variant="rectangular"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: "-50%",
                      transform: `rotate(${Math.random() * 30 - 15}deg)`, // Randomized angles
                      transformOrigin: "left center",
                    }}
                  />
                )} */}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export const BoxPlotSkeleton = ({ height = "100%" }) => {
  return (
    <div
      className="flex flex-col items-center space-y-4"
      style={{
        height: height,
      }}
    >
      {/* Box Plot Skeleton */}
      <div className="relative w-full border border-gray-200 rounded-md overflow-hidden h-full">
        {/* Background Skeleton */}
        <Skeleton
          variant="rectangular"
          className="absolute inset-0"
          height="100%"
          width="100%"
        />

        {/* Multiple Skeleton Boxes */}
        {[...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={Math.floor(Math.random() * 21) + 30 + "%"}
            width="8%"
            sx={{
              position: "absolute",
              backgroundColor: "#d1d5db",
              borderRadius: "4px",
              top: Math.floor(Math.random() * 31) + 20 + "%",
              left: `${index * 18 + 10}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const TimeLineSeriesSkeleton = ({ height = "100%" }) => {
  return (
    <div
      className="flex flex-col items-center space-y-4"
      style={{
        height: height,
      }}
    >
      {/* Box Plot Skeleton */}
      <div className="relative w-full border border-gray-200 rounded-md overflow-hidden h-full">
        {/* Background Skeleton */}
        <Skeleton
          variant="rectangular"
          className="absolute inset-0"
          height="100%"
          width="100%"
        />

        {/* Multiple Skeleton Boxes */}
        {[...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={Math.floor(Math.random() * 11) + 10 + "%"}
            height="8%"
            sx={{
              position: "absolute",
              backgroundColor: "#d1d5db",
              borderRadius: "4px",
              top: Math.floor(Math.random() * 90) + 5 + "%",
              left: `${index * 18 + 10}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const ReportSkeleton = ({
  rows = 5,
  showPagination = true,
  cellsPerRow = 5,
}) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {showPagination && (
        <Skeleton
          sx={{
            alignSelf: "end",
          }}
          variant="rectangular"
          width={"160px"}
          height={"36px"}
        />
      )}
      {[...Array(rows)]?.map((item, idx) => {
        return (
          <div
            className="w-fulf relative flex gap-2 justify-between items-center h-[80px] p-2"
            key={`report-skeleton-${idx}`}
          >
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"100%"}
              className="absolute inset-0 rounded"
            />
            {[...Array(cellsPerRow)]?.map((val, index) => (
              <div
                key={`children-${index}`}
                className="flex gap-1 flex-col w-[100px]"
              >
                <div className="w-[95%] h-4 bg-black bg-opacity-30 rounded" />
                <div className="w-[60%] h-2 bg-black bg-opacity-30 rounded" />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
