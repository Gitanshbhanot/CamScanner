import { useWindowSize } from "@uidotdev/usehooks";
import { useRef } from "react";
import ReactApexChart from "react-apexcharts";
import { isMobileWidth } from "..";

export const LineChart = ({
  series = [],
  colors = [],
  categories = [],
  xType = "category",
  width = "300px",
  height = "300px",
  otherOptions = {},
  title = "",
  alignTitle = "center",
  xTitle = "",
  yTitle = "",
  yAxisCount = 1,
}) => {
  const options = applyResponsiveFontSize({
    ...otherOptions,
    chart: {
      type: "line",
      width: width,
      height: height,
      animations: {
        enabled: false,
      },
      zoom: {
        allowMouseWheelZoom: false,
      },
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true | '<CustomImg src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      ...otherOptions?.chart,
    },
    colors: colors,
    yaxis: Array.from({ length: yAxisCount })
      .fill(1)
      .map((item, idx) => {
        if (Array.isArray(otherOptions.yaxis)) {
          return {
            tickAmount: 5,
            showAlways: true,
            ...otherOptions?.yaxis[idx],
            labels: {
              ...otherOptions?.yaxis[idx]?.labels,
              style: {
                colors: "#525056",
                fontSize: "14px",
                fontFamily: "Lexend, Helvetica, sans-serif",
                fontWeight: 600,
                ...otherOptions?.yaxis[idx]?.labels?.style,
              },
            },
            title: {
              text: yTitle?.[idx],
              style: {
                colors: "#525056",
                fontSize: "14px",
                fontFamily: "Lexend, Helvetica, sans-serif",
                fontWeight: 600,
                ...otherOptions?.yaxis[idx]?.title?.style,
              },
              ...otherOptions?.yaxis[idx]?.title,
            },
          };
        } else
          return {
            tickAmount: 5,
            showAlways: true,
            ...otherOptions?.yaxis,
            labels: {
              ...otherOptions?.yaxis?.labels,
              style: {
                colors: "#525056",
                fontSize: "14px",
                fontFamily: "Lexend, Helvetica, sans-serif",
                fontWeight: 600,
                ...otherOptions?.yaxis?.labels?.style,
              },
            },
            title: {
              text: yTitle,
              style: {
                colors: "#525056",
                fontSize: "14px",
                fontFamily: "Lexend, Helvetica, sans-serif",
                fontWeight: 600,
                ...otherOptions?.yaxis?.title?.style,
              },
              ...otherOptions?.yaxis?.title,
            },
          };
      }),
    grid: {
      ...otherOptions?.grid,
      borderColor: "#BCBAC0",
      strokeDashArray: 2,
    },
    legend: {
      showForSingleSeries: true,
      ...otherOptions?.legend,
      fontSize: "14px",
      fontFamily: "Lexend, Helvetica, sans-serif",
      fontWeight: 600,
      markers: {
        ...otherOptions?.legend?.markers,
        size: 7,
        shape: "circle",
      },
    },
    xaxis: {
      ...otherOptions?.xaxis,
      type: xType,
      categories: categories,
      labels: {
        format: xType === "datetime" ? "HH:mm" : undefined,
        ...otherOptions?.xaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.xaxis?.title,
        text: xTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.title?.style,
        },
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            show: true,
            position: "bottom",
          },
        },
      },
    ],
    title: {
      ...otherOptions?.title,
      text: title,
      align: alignTitle,
      style: {
        colors: "#525056",
        fontSize: "14px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
        ...otherOptions?.title?.style,
      },
    },
  });

  return (
    <ResponsiveChartContainer categories={categories} multiplyFactor={40}>
      <ReactApexChart
        series={series}
        options={options}
        type="line"
        width={width}
        height={height}
      />
    </ResponsiveChartContainer>
  );
};

export const AreaChart = ({
  series = [],
  colors = [],
  categories = [],
  xType = "category",
  width = "300px",
  height = "300px",
  opacity = 1,
  otherOptions = {},
  title = "",
  alignTitle = "center",
  xTitle = "",
  yTitle = "",
  yAxisCount = 1,
}) => {
  const options = applyResponsiveFontSize({
    ...otherOptions,
    chart: {
      type: "area",
      width: width,
      height: height,
      animations: {
        enabled: false,
      },
      zoom: {
        allowMouseWheelZoom: false,
      },
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true | '<CustomImg src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      ...otherOptions?.chart,
    },
    colors: colors,
    yaxis: Array.from({ length: yAxisCount })
      .fill(1)
      .map((item, idx) => {
        if (Array.isArray(otherOptions.yaxis)) {
          return {
            tickAmount: 5,
            showAlways: true,
            ...otherOptions?.yaxis[idx],
            labels: {
              ...otherOptions?.yaxis[idx]?.labels,
              style: {
                colors: "#525056",
                fontSize: "14px",
                fontFamily: "Lexend, Helvetica, sans-serif",
                fontWeight: 600,
                ...otherOptions?.yaxis[idx]?.labels?.style,
              },
            },
            title: {
              text: yTitle,
              style: {
                colors: "#525056",
                fontSize: "14px",
                fontFamily: "Lexend, Helvetica, sans-serif",
                fontWeight: 600,
                ...otherOptions?.yaxis[idx]?.title?.style,
              },
              ...otherOptions?.yaxis[idx]?.title,
            },
          };
        } else
          return {
            tickAmount: 5,
            showAlways: true,
            ...otherOptions?.yaxis,
            labels: {
              ...otherOptions?.yaxis?.labels,
              style: {
                colors: "#525056",
                fontSize: "14px",
                fontFamily: "Lexend, Helvetica, sans-serif",
                fontWeight: 600,
                ...otherOptions?.yaxis?.labels?.style,
              },
            },
            title: {
              text: yTitle,
              style: {
                colors: "#525056",
                fontSize: "14px",
                fontFamily: "Lexend, Helvetica, sans-serif",
                fontWeight: 600,
                ...otherOptions?.yaxis?.title?.style,
              },
              ...otherOptions?.yaxis?.title,
            },
          };
      }),
    grid: {
      ...otherOptions?.grid,
      borderColor: "#BCBAC0",
      strokeDashArray: 2,
    },
    legend: {
      showForSingleSeries: true,
      ...otherOptions?.legend,
      fontSize: "14px",
      fontFamily: "Lexend, Helvetica, sans-serif",
      fontWeight: 600,
      markers: {
        ...otherOptions?.legend?.markers,
        size: 7,
        shape: "circle",
      },
    },
    xaxis: {
      ...otherOptions?.xaxis,
      type: xType,
      categories: categories,
      labels: {
        format: xType === "datetime" ? "HH:mm" : undefined,
        ...otherOptions?.xaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.xaxis?.title,
        text: xTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.title?.style,
        },
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            show: true,
            position: "bottom",
          },
        },
      },
    ],
    fill: {
      colors: colors,
      opacity: opacity,
      ...otherOptions?.fill,
    },
    title: {
      ...otherOptions?.title,
      text: title,
      align: alignTitle,
      style: {
        colors: "#525056",
        fontSize: "14px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
        ...otherOptions?.title?.style,
      },
    },
  });

  return (
    <ResponsiveChartContainer categories={categories} multiplyFactor={70}>
      <ReactApexChart
        type="area"
        options={options}
        width={width}
        height={height}
        series={series}
      />
    </ResponsiveChartContainer>
  );
};

export const DonutChart = ({
  series = [],
  colors = [],
  categories = [],
  width = "300px",
  height = "300px",
  otherOptions = {},
  title = "",
  alignTitle = "center",
}) => {
  const options = applyResponsiveFontSize({
    ...otherOptions,
    chart: {
      type: "donut",
      width: width,
      height: height,
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true | '<CustomImg src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      animations: {
        enabled: false,
      },
      ...otherOptions?.chart,
    },
    dataLabels: {
      ...otherOptions?.dataLabels,
      style: {
        ...otherOptions?.dataLabels?.style,
        fontSize: "12px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
      },
      background: {
        ...otherOptions?.dataLabels?.background,
        enabled: true,
        foreColor: "#525056",
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#BCBAC0",
        opacity: 1,
      },
      dropShadow: {
        enabled: false,
      },
    },
    labels: categories,
    colors: colors,
    title: {
      ...otherOptions?.title,
      text: title,
      align: alignTitle,
      offsetY: -5,
      style: {
        colors: "#525056",
        fontSize: "14px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
        ...otherOptions?.title?.style,
      },
    },
  });

  return (
    <ReactApexChart
      type="donut"
      options={options}
      width={width}
      height={height}
      series={series}
    />
  );
};

export const RadialBar = ({
  series = [],
  colors = [],
  categories = [],
  width = "300px",
  height = "300px",
  otherOptions = {},
  title = "",
  alignTitle = "center",
  startAngle = 0,
  endAngle = 270,
}) => {
  const options = applyResponsiveFontSize({
    ...otherOptions,
    chart: {
      type: "radialBar",
      width: width,
      height: height,
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true | '<CustomImg src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      animations: {
        enabled: false,
      },
      ...otherOptions?.chart,
    },
    plotOptions: {
      ...otherOptions?.plotOptions,
      radialBar: {
        ...otherOptions?.plotOptions?.radialBar,
        offsetY: 0,
        startAngle: startAngle,
        endAngle: endAngle,
        hollow: {
          margin: 5,
          size: "10%",
          background: "transparent",
          image: undefined,
          ...otherOptions?.plotOptions?.radialBar?.hollow,
        },
        dataLabels: {
          ...otherOptions?.plotOptions?.radialBar?.dataLabels,
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
        barLabels: {
          enabled: true,
          useSeriesColors: false,
          offsetX: -8,
          fontSize: "12px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          formatter: function (seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
          },
          ...otherOptions?.plotOptions?.radialBar?.barLabels,
        },
      },
    },
    dataLabels: {
      ...otherOptions?.dataLabels,
      style: {
        ...otherOptions?.dataLabels?.style,
        fontSize: "12px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
      },
      background: {
        ...otherOptions?.dataLabels?.background,
        enabled: true,
        foreColor: "#525056",
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#BCBAC0",
        opacity: 1,
      },
      dropShadow: {
        enabled: false,
      },
    },
    labels: categories,
    colors: colors,
    title: {
      ...otherOptions?.title,
      text: title,
      align: alignTitle,
      offsetY: -6,
      style: {
        colors: "#525056",
        fontSize: "14px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
        ...otherOptions?.title?.style,
      },
    },
  });

  return (
    <ReactApexChart
      type="radialBar"
      options={options}
      width={width}
      height={height}
      series={series}
    />
  );
};

export const StackedBarChart = ({
  series = [],
  colors = [],
  categories = [],
  xType = "category",
  width = "300px",
  height = "300px",
  stackType = "normal",
  otherOptions = {},
  isStacked = true,
  title = "",
  alignTitle = "center",
  xTitle = "",
  yTitle = "",
  multiplyFactor = 100,
  maxWAllowd = 600,
}) => {
  const options = applyResponsiveFontSize({
    ...otherOptions,
    chart: {
      type: "bar",
      width: width,
      height: height,
      stacked: isStacked,
      stackType,
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true | '<CustomImg src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      animations: {
        enabled: false,
      },
      zoom: {
        allowMouseWheelZoom: false,
        enabled: false,
        ...otherOptions?.chart?.zoom,
      },
      ...otherOptions?.chart,
    },
    plotOptions: {
      ...otherOptions?.plotOptions,
      bar: {
        ...otherOptions?.plotOptions?.bar,
        borderRadius: 4,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    colors: colors,
    yaxis: {
      showAlways: true,
      ...otherOptions?.yaxis,
      labels: {
        ...otherOptions?.yaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.yaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.yaxis?.title,
        text: yTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.yaxis?.title?.style,
        },
      },
    },
    grid: {
      ...otherOptions?.grid,
      borderColor: "#BCBAC0",
      strokeDashArray: 2,
    },
    dataLabels: {
      ...otherOptions?.dataLabels,
    },
    legend: {
      showForSingleSeries: true,
      position: "right",
      offsetX: -30,
      offsetY: 0,
      ...otherOptions?.legend,
      fontSize: "14px",
      fontFamily: "Lexend, Helvetica, sans-serif",
      fontWeight: 600,
      markers: {
        ...otherOptions?.legend?.markers,
        size: 7,
        shape: "circle",
      },
      alignLabels: true,
      itemMargin: {
        horizontal: 0,
        vertical: 5,
        ...otherOptions?.legend?.itemMargin,
      },
    },
    xaxis: {
      ...otherOptions?.xaxis,
      type: xType,
      categories: categories,
      labels: {
        ...otherOptions?.xaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.xaxis?.title,
        text: xTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.title?.style,
        },
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            show: true,
            position: "bottom",
          },
        },
      },
    ],
    title: {
      ...otherOptions?.title,
      text: title,
      align: alignTitle,
      style: {
        colors: "#525056",
        fontSize: "14px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
        ...otherOptions?.title?.style,
      },
    },
  });

  return (
    <ResponsiveChartContainer
      multiplyFactor={multiplyFactor}
      categories={categories}
      maxWAllowd={maxWAllowd}
    >
      <ReactApexChart
        type="bar"
        options={options}
        width={width}
        height={height}
        series={series}
      />
    </ResponsiveChartContainer>
  );
};

export const SpiderChart = ({
  series = [],
  colors = [],
  categories = [],
  xType = "category",
  width = "300px",
  height = "300px",
  otherOptions = {},
  title = "",
  alignTitle = "center",
}) => {
  const options = applyResponsiveFontSize({
    ...otherOptions,
    chart: {
      type: "radar",
      width: width,
      height: height,
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true | '<CustomImg src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      animations: {
        enabled: false,
      },
      ...otherOptions?.chart,
    },
    colors: colors,
    yaxis: {
      ...otherOptions?.yaxis,
      labels: {
        ...otherOptions?.yaxis?.labels,
        style: {
          colors: "#5A5760",
          fontSize: "10px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 400,
          ...otherOptions?.yaxis?.labels?.style,
        },
      },
    },
    legend: {
      ...otherOptions?.legend,
      fontSize: "14px",
      fontFamily: "Lexend, Helvetica, sans-serif",
      fontWeight: 600,
      markers: {
        ...otherOptions?.legend?.markers,
        size: 7,
        shape: "circle",
      },
    },
    xaxis: {
      ...otherOptions?.xaxis,
      type: xType,
      categories: categories,
      labels: {
        ...otherOptions?.xaxis?.labels,
        style: {
          ...otherOptions?.xaxis?.labels?.style,
          colors: new Array(categories?.length)?.fill("#5A5760"),
          fontSize: "12px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
        },
      },
    },
    title: {
      ...otherOptions?.title,
      text: title,
      align: alignTitle,
      style: {
        colors: "#525056",
        fontSize: "14px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
        ...otherOptions?.title?.style,
      },
    },
  });
  return (
    <ReactApexChart
      type="radar"
      options={options}
      width={width}
      height={height}
      series={series}
    />
  );
};

export const BoxPlotChart = ({
  series = [],
  colors = [],
  categories = [],
  xType = "category",
  width = "300px",
  height = "300px",
  otherOptions = {},
  title = "",
  alignTitle = "center",
  xTitle = "",
  yTitle = "",
}) => {
  const options = applyResponsiveFontSize({
    ...otherOptions,
    chart: {
      type: "boxPlot",
      width: width,
      height: height,
      animations: {
        enabled: false,
      },
      zoom: {
        allowMouseWheelZoom: false,
      },
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true | '<CustomImg src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      ...otherOptions?.chart,
    },
    colors: colors,
    yaxis: {
      showAlways: true,
      ...otherOptions?.yaxis,
      labels: {
        ...otherOptions?.yaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.yaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.yaxis?.title,
        text: yTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.yaxis?.title?.style,
        },
      },
    },
    grid: {
      ...otherOptions?.grid,
      borderColor: "#BCBAC0",
      strokeDashArray: 2,
    },
    legend: {
      ...otherOptions?.legend,
      fontSize: "14px",
      fontFamily: "Lexend, Helvetica, sans-serif",
      fontWeight: 600,
      markers: {
        ...otherOptions?.legend?.markers,
        size: 7,
        shape: "circle",
      },
    },
    xaxis: {
      ...otherOptions?.xaxis,
      type: xType,
      categories: categories,
      labels: {
        ...otherOptions?.xaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.xaxis?.title,
        text: xTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.title?.style,
        },
      },
    },
    title: {
      ...otherOptions?.title,
      text: title,
      align: alignTitle,
      style: {
        colors: "#525056",
        fontSize: "14px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
        ...otherOptions?.title?.style,
      },
    },
  });

  return (
    <ResponsiveChartContainer
      categories={categories?.length > 0 ? categories : series?.[0]?.data}
    >
      <ReactApexChart
        series={series}
        options={options}
        type="boxPlot"
        width={width}
        height={height}
      />
    </ResponsiveChartContainer>
  );
};

export const CustomRangebar = ({
  series = [],
  colors = [],
  categories = [],
  xType = "datetime",
  width = "300px",
  height = "300px",
  otherOptions = {},
  title = "",
  alignTitle = "center",
  xTitle = "",
  yTitle = "",
}) => {
  const options = applyResponsiveFontSize({
    ...otherOptions,
    chart: {
      type: "rangeBar",
      width: width,
      height: height,
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true | '<CustomImg src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      zoom: {
        allowMouseWheelZoom: false,
      },
      animations: {
        enabled: false,
      },
      ...otherOptions?.chart,
    },
    plotOptions: {
      ...otherOptions?.plotOptions,
      bar: {
        ...otherOptions?.plotOptions?.bar,
        horizontal: true,
      },
    },
    colors: colors,
    yaxis: {
      showAlways: true,
      ...otherOptions?.yaxis,
      labels: {
        ...otherOptions?.yaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.yaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.yaxis?.title,
        text: yTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.yaxis?.title?.style,
        },
      },
    },
    grid: {
      ...otherOptions?.grid,
      borderColor: "#BCBAC0",
      strokeDashArray: 2,
    },
    legend: {
      showForSingleSeries: true,
      position: "right",
      offsetX: -30,
      offsetY: 0,
      onItemClick: {
        toggleDataSeries: false,
      },
      ...otherOptions?.legend,
      fontSize: "14px",
      fontFamily: "Lexend, Helvetica, sans-serif",
      fontWeight: 600,
      markers: {
        ...otherOptions?.legend?.markers,
        size: 7,
        shape: "circle",
      },
      alignLabels: true,
      itemMargin: {
        horizontal: 0,
        vertical: 5,
        ...otherOptions?.legend?.itemMargin,
      },
    },
    xaxis: {
      ...otherOptions?.xaxis,
      type: xType,
      categories: categories,
      labels: {
        ...otherOptions?.xaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.xaxis?.title,
        text: xTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.title?.style,
        },
      },
    },
    fill: {
      type: "solid",
      opacity: 0.6,
      ...otherOptions?.fill,
    },
    title: {
      ...otherOptions?.title,
      text: title,
      align: alignTitle,
      style: {
        colors: "#525056",
        fontSize: "14px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
        ...otherOptions?.title?.style,
      },
    },
  });

  return (
    <ResponsiveChartContainer
      categories={categories?.length > 0 ? categories : series?.[0]?.data}
    >
      <ReactApexChart
        type="rangeBar"
        options={options}
        width={width}
        height={height}
        series={series}
      />
    </ResponsiveChartContainer>
  );
};

export const PointChart = ({
  series = [],
  colors = [],
  categories = [],
  xType = "category",
  width = "300px",
  height = "300px",
  otherOptions = {},
  title = "",
  alignTitle = "center",
  xTitle = "",
  yTitle = "",
  multiplyFactor = 80,
  maxWAllowd = 600,
}) => {
  const options = applyResponsiveFontSize({
    ...otherOptions,
    chart: {
      type: "scatter",
      width: width,
      height: height,
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true | '<CustomImg src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      zoom: {
        allowMouseWheelZoom: false,
      },
      animations: {
        enabled: false,
      },
      ...otherOptions?.chart,
    },
    colors: colors,
    markers: {},
    yaxis: {
      showAlways: true,
      ...otherOptions?.yaxis,
      labels: {
        ...otherOptions?.yaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.yaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.yaxis?.title,
        text: yTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.yaxis?.title?.style,
        },
      },
    },
    grid: {
      ...otherOptions?.grid,
      borderColor: "#BCBAC0",
      strokeDashArray: 2,
    },
    legend: {
      showForSingleSeries: true,
      position: "right",
      offsetX: -30,
      offsetY: 0,
      ...otherOptions?.legend,
      fontSize: "14px",
      fontFamily: "Lexend, Helvetica, sans-serif",
      fontWeight: 600,
      markers: {
        ...otherOptions?.legend?.markers,
        size: 7,
        shape: "circle",
      },
      alignLabels: true,
      itemMargin: {
        horizontal: 0,
        vertical: 5,
        ...otherOptions?.legend?.itemMargin,
      },
    },
    xaxis: {
      ...otherOptions?.xaxis,
      type: xType,
      categories: categories,
      labels: {
        ...otherOptions?.xaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.xaxis?.title,
        text: xTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.title?.style,
        },
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            show: true,
            position: "bottom",
          },
        },
      },
    ],
    title: {
      ...otherOptions?.title,
      text: title,
      align: alignTitle,
      style: {
        colors: "#525056",
        fontSize: "14px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
        ...otherOptions?.title?.style,
      },
    },
  });

  return (
    <ResponsiveChartContainer
      multiplyFactor={multiplyFactor}
      maxWAllowd={maxWAllowd}
      categories={categories?.length > 0 ? categories : series?.[0]?.data}
    >
      <ReactApexChart
        type="scatter"
        options={options}
        width={width}
        height={height}
        series={series}
      />
    </ResponsiveChartContainer>
  );
};

export const HeatMapChart = ({
  series = [],
  colors = [],
  categories = [],
  xType = "category",
  width = "300px",
  height = "300px",
  otherOptions = {},
  title = "",
  alignTitle = "center",
  xTitle = "",
  yTitle = "",
  removeResponsiveContainer = false,
}) => {
  const options = applyResponsiveFontSize({
    ...otherOptions,
    chart: {
      type: "heatmap",
      width: width,
      height: height,
      toolbar: {
        tools: {
          download: false,
          selection: false,
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true | '<CustomImg src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      zoom: {
        allowMouseWheelZoom: false,
      },
      animations: {
        enabled: false,
      },
      ...otherOptions?.chart,
    },
    plotOptions: {
      ...otherOptions?.plotOptions,
      heatmap: {
        radius: 2,
        ...otherOptions?.plotOptions?.heatmap,
      },
    },
    colors: colors,
    yaxis: {
      ...otherOptions?.yaxis,
      labels: {
        ...otherOptions?.yaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "12px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.yaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.yaxis?.title,
        text: yTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.yaxis?.title?.style,
        },
      },
    },
    grid: {
      ...otherOptions?.grid,
      borderColor: "#BCBAC0",
      strokeDashArray: 2,
    },
    legend: {
      ...otherOptions?.legend,
      fontSize: "14px",
      fontFamily: "Lexend, Helvetica, sans-serif",
      fontWeight: 600,
      markers: {
        ...otherOptions?.legend?.markers,
        size: 7,
        shape: "circle",
      },
      alignLabels: true,
    },
    xaxis: {
      ...otherOptions?.xaxis,
      type: xType,
      categories: categories,
      labels: {
        ...otherOptions?.xaxis?.labels,
        style: {
          colors: "#525056",
          fontSize: "12px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.labels?.style,
        },
      },
      title: {
        ...otherOptions?.xaxis?.title,
        text: xTitle,
        style: {
          colors: "#525056",
          fontSize: "14px",
          fontFamily: "Lexend, Helvetica, sans-serif",
          fontWeight: 600,
          ...otherOptions?.xaxis?.title?.style,
        },
      },
    },
    title: {
      ...otherOptions?.title,
      text: title,
      align: alignTitle,
      style: {
        colors: "#525056",
        fontSize: "14px",
        fontFamily: "Lexend, Helvetica, sans-serif",
        fontWeight: 600,
        ...otherOptions?.title?.style,
      },
    },
  });

  return removeResponsiveContainer ? (
    <ReactApexChart
      type="heatmap"
      options={options}
      width={width}
      height={height}
      series={series}
    />
  ) : (
    <ResponsiveChartContainer
      categories={categories?.length > 0 ? categories : series?.[0]?.data}
    >
      <ReactApexChart
        type="heatmap"
        options={options}
        width={width}
        height={height}
        series={series}
      />
    </ResponsiveChartContainer>
  );
};

export const ResponsiveChartContainer = ({
  children,
  categories = null,
  multiplyFactor = 100,
  maxWAllowd = 600,
}) => {
  const { width } = useWindowSize();
  const ref = useRef();

  const calculateModWidth = () => {
    if (categories && categories.length > 3 && width && width < 768) {
      const calculatedWidth = Math.max(
        categories.length * multiplyFactor, // Minimum width based on categories
        300, // Fallback minimum width
        ref?.current?.getBoundingClientRect()?.width || 0 // Actual container width
      );
      return `${Math.min(calculatedWidth, maxWAllowd)}px`; // Cap the width at 600px
    }
    return "100%";
  };

  let modWidth = calculateModWidth();

  return (
    <div className="h-full w-full overflow-visible" ref={ref}>
      {/* <div
        className="h-full"
        style={{
          width: modWidth,
        }}
        key={`width-container-with-${modWidth}`}
      > */}
      {children}
      {/* </div> */}
    </div>
  );
};

export const applyResponsiveFontSize = (
  options,
  smallFontSize = "10px",
  defaultFontSize = "14px"
) => {
  const isSmallScreen = window.innerWidth < isMobileWidth;
  const newFontSize = isSmallScreen ? smallFontSize : defaultFontSize;
  const axisRotateAlways = isSmallScreen ? true : false;
  const legendMarkerSize = isSmallScreen ? 4 : 7; // Reduce marker size for small screens
  const pointChartMarkerSize = isSmallScreen ? 3 : 7; // Reduce marker size for small screens

  // Default locations where fontSize should be applied if missing
  const defaultFontSizeKeys = [
    "title",
    "labels",
    "tooltip",
    "dataLabels",
    "legend",
    "annotations",
  ];

  // Recursive function to update all font sizes & special styles
  const updateFontSize = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj.map(updateFontSize); // Recursively update each item in an array
    }

    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];

      if (typeof value === "object") {
        acc[key] = updateFontSize(value);

        // Apply default fontSize if key is in defaultFontSizeKeys but fontSize is missing
        if (defaultFontSizeKeys.includes(key) && !acc[key]?.style?.fontSize) {
          acc[key].style = {
            ...acc[key].style,
            fontSize: newFontSize,
          };
        }
      } else if (
        key === "fontSize" &&
        typeof value === "string" &&
        value.endsWith("px")
      ) {
        acc[key] = newFontSize;
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});
  };

  // Apply updates and override specific properties for axis & legend markers
  const updatedOptions = updateFontSize(options);

  // Ensure x-axis labels rotate at 30° on small screens
  // if (updatedOptions.xaxis?.labels) {
  //   updatedOptions.xaxis.labels.rotateAlways = axisRotateAlways;
  // }
  // if (updatedOptions.yaxis?.labels) {
  //   updatedOptions.xaxis.labels.rotateAlways = axisRotateAlways;
  // }

  if (updatedOptions?.chart?.type === "scatter") {
    updatedOptions.markers.size = pointChartMarkerSize;
  }

  // Reduce legend marker size for small screens
  if (updatedOptions.legend?.markers) {
    updatedOptions.legend.markers.size = legendMarkerSize;
  }

  return updatedOptions;
};
