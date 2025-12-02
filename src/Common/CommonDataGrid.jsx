import { capitalize, IconButton, Portal } from "@mui/material";
import { styled } from "@mui/material/styles";

import {
  DataGridPro,
  getGridDateOperators,
  getGridNumericOperators,
  GridPagination,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid-pro";
import { humanReadableString } from "../util/V2/humanReadableString";
import { formatDateTime } from "../util/V2/FormatDateTimeAMPM";
import CustomDateTimeSelector from "./CustomDateTime";
import { CustomButton, UserAction } from "./Components";
import { severity, severityColorMap } from "./CommonAction";
import { isMobileWidth } from "..";
import { useWindowSize } from "@uidotdev/usehooks";
import { Visibility } from "@mui/icons-material";

// footer with only pagination and page select option
export const CustomFooter = (props) => {
  return (
    <>
      <div className="flex flex-row gap-0 items-center h-9 justify-end border-t border-gray-200">
        <GridPagination
          sx={{
            "& .MuiToolbar-root": {
              minHeight: "36px",
              height: "36px",
              overflow: "clip",
              "& .MuiTablePagination-actions": {
                marginLeft: "8px",
              },
            },
          }}
        />
      </div>
    </>
  );
};

export function GridFilterDateInput(props) {
  const { item, showTime, applyValue, apiRef } = props;

  const handleFilterChange = (newValue) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <div className="h-full overflow-clip w-full flex items-end border-b border-[#949494] hover:border-b-2 hover:border-[#212121]">
      <CustomDateTimeSelector
        value={item.value ? item?.value : null}
        type={showTime ? "dateTime" : "date"}
        ampm={showTime ? true : false}
        text={apiRef.current.getLocaleText("filterPanelInputLabel")}
        paddingTop="15px"
        paddingBottom="5px"
        setDateTime={handleFilterChange}
      />
    </div>
  );
}

export const generateDynamicColumns = (columnNames) => {
  //   dynamic columns
  const bucketRegex =
    /\b\d{1,2}(\.\d+)?[-+]\d{1,2}(\.\d+)?mm\b|\b\d{1,2}(\.\d+)?[-+]mm\b/;
  const dynamicColumns = columnNames.map((columnName) => {
    let columnConfig = {
      field: columnName,
      headerName: humanReadableString(columnName),
      flex: 1,
      type: "string",
      headerAlign: "left",
      align: "left",
      minWidth: 140,
    };

    // add column specific props
    switch (columnName) {
      case "duration":
        columnConfig.type = "number";
        columnConfig.valueGetter = (value) => {
          return (value / (60 * 1000))?.toFixed(2);
        };
        columnConfig.valueFormatter = (value) => {
          return value + " min";
        };
        break;
      case "length":
      case "breadth":
      case "depth":
        columnConfig.type = "number";
        columnConfig.headerName += " (m)";
        break;
      case "overSpeeding":
      case "congestion":
      case "incorrectParking":
      case "zone":
      case "checksPassed":
      case "checksFailed":
      case "Ladle movement":
      case "PPE Kit":
      case "Helmets":
      case "No Overcrowding":
      case "hookingOccurences":
      case "loadingOccurences":
      case "loadedOccurences":
      case "slabsPassed":
      case "slabsFailed":
      case "bagsNeeded":
      case "healthIndex":
      case "dumpNo":
      case "feeder":
      case "hopperUpper":
      case "hopperLower":
      case "flammable":
      case "nonMetallic":
        columnConfig.type = "number";
        break;
      case "plantName":
        columnConfig.flex = 0.3;
        break;
      case "camera":
      case "cameraId":
        columnConfig.headerName = "Camera ID";
        columnConfig.flex = 0.3;
        columnConfig.minWidth = 190;
        break;
      case "mps":
        columnConfig.headerName = "MPS (mm)";
        columnConfig.type = "number";
        break;
      case "black":
      case "gray":
        columnConfig.headerName = columnConfig.headerName + " %";
        columnConfig.type = "number";
        break;
      case "gcv":
        columnConfig.headerName = "GCV (Kcal/Kg)";
        columnConfig.type = "number";
        break;
      case "hotIndex":
        columnConfig.type = "number";
        break;
      case "temperature":
        columnConfig.headerName = "Temperature (°C)";
        columnConfig.type = "number";
        break;
      case "averageTemperature":
        columnConfig.headerName = "Average Temperature (°C)";
        columnConfig.type = "number";
        break;
      case "pipeDiameter":
        columnConfig.headerName = "Pipe Diameter (mm)";
        columnConfig.type = "number";
        break;
      case "downtime":
        columnConfig.headerName = "Downtime %";
        columnConfig.type = "number";
        break;
      case "moisture":
        columnConfig.headerName = "Moisture %";
        columnConfig.type = "number";
        break;
      case "ladleWeight":
        columnConfig.headerName = "Ladle weight (Kg)";
        columnConfig.minWidth = 160;
        columnConfig.type = "number";
        break;
      case "averageVolume":
        columnConfig.headerName = "Average volume (m\u00B3)";
        columnConfig.type = "number";
        break;
      case "recipeQuantity":
      case "oneBagWeight":
      case "looseWeightNeeded":
      case "actualLooseWeight":
        columnConfig.type = "number";
        columnConfig.headerName += " (Kg)";
        break;
      case "startTime":
      case "endTime":
      case "createdAt":
      case "truckInTime":
      case "truckOutTime":
      case "lastUpdatedAt":
      case "timestamp":
        columnConfig.type = "datetime";
        columnConfig.filterOperators = getGridDateOperators(true)?.map(
          (item) => ({
            ...item,
            InputComponent: GridFilterDateInput,
            InputComponentProps: { showTime: true },
          })
        );
        columnConfig.valueFormatter = (value, row) => {
          if (value) {
            return formatDateTime(value?.getTime());
          }
          return "";
        };
        columnConfig.valueGetter = (value, row) => {
          if (value) {
            if (typeof value === "object") return value;
            else if (
              value.toString().length === 13 ||
              typeof value === "string"
            ) {
              return new Date(value);
            }
            return new Date(value * 1000);
          }
        };
        columnConfig.flex = 0.8;
        columnConfig.minWidth = 210;
        break;
      case "alertMessages":
        columnConfig.headerName = "Alert Reason";
        columnConfig.type = "string";
        columnConfig.valueGetter = (value) => {
          if (typeof value === "string") return value;
          else if (Array.isArray(value)) return value?.join(",");
        };
        columnConfig.valueFormatter = (value) => {
          return value?.split(",")?.join("\n");
        };
        break;
      case "userAction":
        columnConfig.headerName = "User Action";
        columnConfig.type = "actions";
        columnConfig.renderCell = ({ value }) => (
          <UserAction feedback={value} />
        );
        break;
      case "severity":
        columnConfig.headerName = "Severity";
        columnConfig.type = "singleSelect";
        columnConfig.valueOptions = severity.map((item) => ({
          value: item,
          label: capitalize(item),
        }));
        columnConfig.minWidth = 80;
        columnConfig.flex = 0.25;
        columnConfig.renderCell = ({ value }) => (
          <p className={severityColorMap[value]}>{value}</p>
        );
        break;
      default:
        break;
    }

    // specific to conditions
    if (
      columnName?.includes("%") ||
      columnName?.includes("avg") ||
      columnName?.toLowerCase()?.includes("count") ||
      columnName?.toLowerCase()?.includes("total") ||
      columnConfig?.headerName?.startsWith("No ") ||
      columnConfig?.headerName?.startsWith("No. ")
    ) {
      columnConfig.type = "number";
    }

    if (bucketRegex?.test(columnName)) {
      columnConfig.headerName += "%";
      columnConfig.type = "number";
    }

    if (columnConfig.type === "number") {
      columnConfig.filterOperators = getGridNumericOperators()?.map((item) => ({
        ...item,
        InputComponentProps: {
          ...item?.InputComponentProps,
          onWheel: (event) => event.target.blur(),
        },
      }));
    }

    return columnConfig;
  });
  return [...(dynamicColumns || [])];
};

// portal for taking filter's out of the heirarchy of data grid
export const CustomToolbar = (props) => {
  return (
    <>
      {props?.toolBarId && (
        <Portal container={() => document.getElementById(props?.toolBarId)}>
          <GridToolbarQuickFilter
            variant={"outlined"}
            label={"Search Board"}
            placeholder={""}
            size={"small"}
          />
        </Portal>
      )}
    </>
  );
};
// material data grid with custom styling
const StyledDataGrid = styled(DataGridPro)({
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#EBEBEB",
    // textTransform: "capitalize",
    color: "#605D64",
    border: "none",
    padding: window.innerWidth < isMobileWidth ? "4px 6px" : "12px 16px",
    fontSize: window.innerWidth < isMobileWidth ? "12px" : "14px",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "500 !important",
  },
  "& .MuiDataGrid-cell": {
    borderColor: "#CECCD1",
    padding: window.innerWidth < isMobileWidth ? "0px 6px" : "0px 16px",
  },
  "& .MuiDataGrid-row": {
    color: "#0B2F65",
    fontWeight:
      window.innerWidth < isMobileWidth ? "500 !important" : "600 !important",
    backgroundColor: "#F5F5F5",
    fontSize: window.innerWidth < isMobileWidth ? "12px" : "16px",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#F5F5F5",
    },
  },
  "& .css-9vna8i-MuiButtonBase-root-MuiIconButton-root": {
    color: "white !important",
  },
  "&.MuiDataGrid-root": {
    border: "none",
  },
  "& .MuiDataGrid-menuIconButton": {
    color: "#3E3C42",
  },
});

export const dataGridBorderHeaderClasses = {
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    border: "0px !important",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#EBEBEB",
    // textTransform: "capitalize",
    color: "#605D64",
    border: "1px solid #D9D9D9",
    padding: window.innerWidth < isMobileWidth ? "1px 6px" : "1px 16px",
    fontSize: window.innerWidth < isMobileWidth ? "12px" : "14px",
  },
};

export const dataGridBorderCellClasses = {
  "& .MuiDataGrid-cell": {
    borderColor: "#CECCD1",
    border: "1px solid #D9D9D9",
    padding: window.innerWidth < isMobileWidth ? "0px 6px" : "0px 16px",
  },
};

export const dataGridMultiLineHeaderClasses = {
  "& .MuiDataGrid-columnHeaderTitle": {
    textOverflow: "clip",
    whiteSpace: "break-spaces",
    lineHeight: 1,
  },
};

export const ReponsiveViewButton = ({
  onClick = "",
  label = "",
  variant = "",
}) => {
  const { width } = useWindowSize();
  if (width < isMobileWidth) {
    return (
      <IconButton size="small" color="primary" onClick={onClick}>
        <Visibility
          sx={{
            fontSize: "24px",
          }}
        />
      </IconButton>
    );
  } else
    return <CustomButton variant={variant} label={label} onClick={onClick} />;
};

export const CustomStyledDataGrid = (props) => {
  const { width } = useWindowSize();
  let modProps = { ...props };
  if (width < isMobileWidth) {
    modProps = {
      ...modProps,
      columns: modProps?.columns?.map((item) => {
        if (item?.field === "viewDetail") {
          return {
            ...item,
            width: 48,
            minWidth: 48,
          };
        } else if (item?.field === "userAction") {
          return {
            ...item,
            minWidth: 132,
          };
        } else
          return {
            ...item,
            minWidth: 96,
          };
      }),
      sx: {
        ...modProps?.sx,
        // for less space consuming column header filter and sort icons
        "& .MuiDataGrid-iconButtonContainer": {
          display: "none",
        },
        "& .MuiDataGrid-menuIcon": {
          visibility: "hidden",
          width: 0,
        },
        "& .MuiDataGrid-columnHeader:hover": {
          "& .MuiDataGrid-iconButtonContainer": {
            display: "flex",
          },
          "& .MuiDataGrid-menuIcon": {
            visibility: "visible",
            width: "auto",
          },
        },
        "& .MuiDataGrid-columnHeader.MuiDataGrid-columnHeader--sorted": {
          "& .MuiDataGrid-iconButtonContainer": {
            display: "flex",
          },
        },
      },
      slots: {
        ...modProps?.slots,
        footer: CustomFooter,
      },
      getRowHeight: () => 36,
      columnHeaderHeight: 32,
    };
  }
  return <StyledDataGrid {...modProps} />;
};
