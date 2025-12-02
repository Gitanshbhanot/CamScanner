import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { CustomImg } from "./Components";
import { Skeleton } from "@mui/material";
import { HeatMapChart } from "./Charts";
import { memo } from "react";

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateHeatmapData = (data, keyName) => {
  // Define the intervals and series structure
  const intervals = [4, 8, 12, 16, 20, 24];
  const series = intervals?.map((interval) => ({
    name: `${interval}`,
    data: [],
  }));

  // Helper function to format the date as DD/MM/YY
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  };

  // Group data by day
  const groupedByDay = data
    ?.sort((a, b) => new Date(a?.[keyName]) - new Date(b?.[keyName]))
    ?.reduce((acc, obj) => {
      const date = new Date(obj[keyName]);
      const dayKey = formatDate(date);
      if (!acc[dayKey]) acc[dayKey] = [];
      acc[dayKey].push(obj);
      return acc;
    }, {});
  let noAlertCount = Math.round(
    intervals?.length * Object?.keys(groupedByDay)?.length * 0.3
  );
  // Process each day
  for (const [day, alerts] of Object.entries(groupedByDay)) {
    // Iterate through intervals
    for (let i = 0; i < intervals.length; i++) {
      const startHour = i === 0 ? 0 : intervals[i - 1];
      const endHour = intervals[i];

      // Filter alerts within the current interval
      const alertsInInterval = alerts.filter((alert) => {
        const hour = new Date(alert[keyName]).getHours();
        return hour >= startHour && hour < endHour;
      });

      const alertCount = alertsInInterval.length;

      // Add data to the corresponding series
      series[i].data.push({ x: day, y: alertCount });
      if (alertCount === 0) noAlertCount--;
    }
  }
  for (const seriesItem of series) {
    if (noAlertCount === 0) break; // Stop if the count is exhausted
    for (const dataPoint of seriesItem.data) {
      if (noAlertCount === 0) break; // Stop if the count is exhausted
      if (dataPoint.y === 0) continue; // Skip if already 0
      // 1-in-5 chance to set `y` to 0
      if (Math.random() < 0.4) {
        dataPoint.y = 0; // Update the value
        noAlertCount--; // Decrement the remaining count
      }
    }
  }

  return series;
};

export const AlertSummary = memo(
  ({
    alerts = [],
    isLoading = true,
    threshold = 10,
    timeKey = "timestamp",
  }) => {
    const checkTodayDate = (time) => {
      const latestAlertDate = new Date(time).getDate();
      const currentDate = new Date().getDate();
      return latestAlertDate === currentDate;
    };
    const clonedAlerts = [...alerts];

    const timeDifferenceInMinutes = () => {
      if (!clonedAlerts?.length) return "No Alerts";

      const latestAlert = clonedAlerts?.sort(
        (a, b) => new Date(b?.[timeKey]) - new Date(a?.[timeKey])
      )?.[0];

      // Check if the alert is from a previous day
      if (!checkTodayDate(latestAlert?.[timeKey])) return "N/A";

      const diffInMs =
        new Date().getTime() - new Date(latestAlert?.[timeKey])?.getTime();
      const diffInMinutes = Math.round(diffInMs / 60000); // Convert ms to minutes

      return `${diffInMinutes} Mins`;
    };

    const heatMapRange = [
      {
        from: 0,
        to: 0,
        color: "#D9D9D9",
        name: "No Alert",
      },
      {
        from: 1,
        to: threshold,
        color: "#F5C9C6",
        name: `Medium Count(<=${threshold})`,
      },
      {
        from: threshold + 1,
        to: 100,
        color: "#E36059",
        name: `High Count(>${threshold})`,
      },
    ];

    const heatMapData = generateHeatmapData(clonedAlerts, timeKey) || [];

    const alertStats = [
      {
        title: "Total\nAlerts",
        icon: "/alertSummaryIcons/alert.svg",
        value: clonedAlerts?.length,
      },
      {
        title: "Time To\nAction",
        icon: "/alertSummaryIcons/timeToAction.svg",
        value:
          clonedAlerts?.length > 0 ? getRandomInt(10, 30) + " Mins" : "N/A",
        arrowUp: Boolean(getRandomInt(0, 1)), // true for up else down
        arrowPerc: getRandomInt(1, 9) + "%",
      },
      {
        title: "Last Alert\nTime",
        icon: "/alertSummaryIcons/alertTime.svg",
        value: timeDifferenceInMinutes(),
      },
      {
        title: "Preventable\nAlerts",
        icon: "/alertSummaryIcons/alertSheild.svg",
        value: Math.round(
          clonedAlerts?.filter((item) => item?.severity === "low")?.length *
            0.34
        ),
        arrowUp: Boolean(getRandomInt(0, 1)), // true for up else down
        arrowPerc: getRandomInt(1, 9) + "%",
      },
    ];

    const alertResolutionStats = [
      {
        title: "Resolved",
        color: "#8FC44A",
        value: clonedAlerts?.filter((item) => item?.userAction)?.length,
      },
      {
        title: "Unresolved",
        color: "#FFC107",
        textColor: "#3E3C42",
        value: clonedAlerts?.filter(
          (item) => !item?.userAction && checkTodayDate(item?.[timeKey])
        )?.length,
      },
      {
        title: "Overdue",
        color: "#E46962",
        value: clonedAlerts?.filter(
          (item) => !item?.userAction && !checkTodayDate(item?.[timeKey])
        )?.length,
      },
    ];

    const alertSeverityStats = [
      {
        title: "Low Severity",
        color: "#F2B8B5",
        textColor: "#3E3C42",
        value: clonedAlerts?.filter((item) => item?.severity === "low")?.length,
        arrowUp: Boolean(getRandomInt(0, 1)), // true for up else down
      },
      {
        title: "Medium Severity",
        color: "#E46962",
        value: clonedAlerts?.filter((item) => item?.severity === "medium")
          ?.length,
        arrowUp: Boolean(getRandomInt(0, 1)), // true for up else down
      },
      {
        title: "High Severity",
        color: "#B3261E",
        value: clonedAlerts?.filter((item) => item?.severity === "high")
          ?.length,
        arrowUp: Boolean(getRandomInt(0, 1)), // true for up else down
      },
    ];

    if (isLoading) {
      return (
        <div className="flex flex-col gap-4">
          <Skeleton variant="rectangular" width={"120px"} height={"40px"} />
          <div className="flex gap-2 items-stretch h-fit flex-wrap min-[1390px]:flex-nowrap flex-grow">
            <div className="grid grid-cols-1 min-w-[300px] sm:min-w-[600px] sm:grid-cols-2 gap-2 flex-1">
              {[...Array(4)]?.map((item, idx) => (
                <Skeleton
                  key={`alert-summary-stats-${idx}`}
                  variant="rounded"
                  width={"100%"}
                  className="!h-[40px] mob:!h-[95px]"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-2 min-w-[300px] sm:min-w-[350px] flex-1 bg-[#F5F5F5] rounded p-2">
              <div className="grid grid-cols-3 gap-[6px]">
                {[...Array(3)]?.map((item, idx) => (
                  <Skeleton
                    key={`alert-resolution-skeleton-${idx}`}
                    variant="rounded"
                    width={"100%"}
                    className="!h-[58px] mob:!h-[86px]"
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-[6px]">
                {[...Array(3)]?.map((item, idx) => (
                  <Skeleton
                    key={`alert-severity-skeleton-${idx}`}
                    variant="rounded"
                    width={"100%"}
                    className="!h-[58px] mob:!h-[86px]"
                  />
                ))}
              </div>
            </div>
            <div className="rounded flex flex-col gap-1 bg-[#F5F5F5] p-2 flex-grow min-w-[350px]">
              <Skeleton variant="rounded" width={"100%"} height={"185px"} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <p className="text-[ #3E3C42] text-lg mob:text-[20px] font-medium">
          Alert Summary
        </p>
        <div className="flex gap-2 items-stretch flex-wrap min-[1390px]:flex-nowrap">
          <div className="grid grid-cols-1 min-w-[300px] sm:min-w-[600px] sm:grid-cols-2 gap-2 flex-1">
            {alertStats?.map((item) => (
              <div
                className="p-2 bg-[#F5F5F5] rounded flex justify-between items-center"
                key={`alert-stats-card-${item?.title}`}
              >
                <div className="flex gap-1 items-center">
                  <CustomImg
                    src={item?.icon}
                    alt={item?.title}
                    className="w-6 h-6 mob:w-12 mob:h-12"
                  />
                  <p className="text-[#605D64] text-sm mob:text-lg font-medium whitespace-nowrap mob:whitespace-pre-line">
                    {item?.title}
                  </p>
                </div>
                <div className="flex gap-1 items-center whitespace-nowrap">
                  <p className="text-[#525056] font-bold text-lg mob:text-2xl">
                    {item?.value}
                  </p>
                  {clonedAlerts?.length && "arrowUp" in item ? (
                    <>
                      {item?.arrowUp ? (
                        <TrendingUpRoundedIcon
                          sx={{
                            color: "#B3261E",
                          }}
                        />
                      ) : (
                        <TrendingDownRoundedIcon
                          sx={{
                            color: "#90C44B",
                          }}
                        />
                      )}
                      <p className="text-[#605D64] text-lg font-medium">
                        {item?.arrowPerc}
                      </p>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 min-w-[300px] sm:min-w-[350px] flex-1 bg-[#F5F5F5] rounded p-2">
            <div className="grid grid-cols-3 gap-[6px]">
              {alertResolutionStats?.map((item) => (
                <div
                  className="rounded p-2 flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: item?.color,
                    color: item?.textColor || "#FFF",
                  }}
                  key={`alert-resolution-card-${item?.title}`}
                >
                  <p className="text-sm mob:text-lg font-medium">
                    {item?.title}
                  </p>
                  <p className="text-lg mob:text-2xl font-bold">
                    {item?.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-[6px]">
              {alertSeverityStats?.map((item) => (
                <div
                  className="rounded p-2 flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: item?.color,
                    color: item?.textColor || "#FFF",
                  }}
                  key={`alert-severity-card-${item?.title}`}
                >
                  <p className="text-xs mob:text-sm font-medium truncate">
                    {item?.title}
                  </p>
                  <div className="flex gap-1 items-center">
                    <p className="text-lg mob:text-2xl font-bold">
                      {item?.value}
                    </p>
                    {clonedAlerts?.length ? (
                      item?.arrowUp ? (
                        <TrendingUpRoundedIcon
                          sx={{
                            color: "inherit",
                          }}
                        />
                      ) : (
                        <TrendingDownRoundedIcon
                          sx={{
                            color: "inherit",
                          }}
                        />
                      )
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded flex flex-col gap-1 bg-[#F5F5F5] px-[6px] py-[2px] flex-grow min-w-[350px]">
            <p className="text-[#605D64] text-lg font-medium">
              Historical Alert Trend
            </p>
            <div className="w-full h-[180px] relative">
              <HeatMapChart
                series={structuredClone(heatMapData)}
                width="100%"
                height="100%"
                otherOptions={{
                  legend: {
                    show: false,
                  },
                  chart: {
                    animations: {
                      enabled: false,
                    },
                  },
                  xaxis: {
                    labels: {
                      formatter: (value) =>
                        String(value)?.split("/")?.slice(0, 2)?.join("/"),
                    },
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => value + " alerts",
                      title: {
                        formatter: (
                          value,
                          { series, seriesIndex, dataPointIndex, w }
                        ) => {
                          let { x } =
                            heatMapData?.[seriesIndex]?.data?.[dataPointIndex];
                          let name = heatMapData?.[seriesIndex]?.name;
                          return `${x} ${parseInt(name) - 4}:00 to ${
                            parseInt(name) - 1
                          }:59:`;
                        },
                      },
                    },
                  },
                  plotOptions: {
                    heatmap: {
                      enableShades: false,
                      distributed: true,
                      colorScale: {
                        ranges: heatMapRange,
                      },
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                }}
                yTitle="Time in hours"
              />
              <div className="flex gap-2 flex-wrap absolute top-0 left-0">
                {heatMapRange?.map((item) => (
                  <div
                    className="flex gap-[1px] items-center"
                    key={`heatmap-range-legend-${item?.name}`}
                  >
                    <div
                      className="h-3 w-[6px] rounded"
                      style={{
                        backgroundColor: item?.color,
                      }}
                    />
                    <p className="text-[#605D64] text-sm sm:text-base font-medium">
                      {item?.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
