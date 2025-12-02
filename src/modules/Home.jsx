import { useState, useEffect } from "react";
import {
  CustomButton,
  CustomCheckbox,
  CustomSelect,
  FilterContainer,
  LottieLoader,
} from "../Common/Components";
import { useToast } from "../Common/Toast";
import {
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff, FileDownload } from "@mui/icons-material";
import Animation from "../Lotties/CamSearchAnimation.json";

// Helper function to validate IPv4 addresses
const validateIPv4 = (ip) => {
  const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(regex);
  if (!match) return false;
  return match
    .slice(1)
    .every((num) => parseInt(num) >= 0 && parseInt(num) <= 255);
};

// Helper function to convert IP to number
const ipToNumber = (ip) => {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
};

// Helper function to calculate IP range from IP and subnet mask
const calculateIpRange = (ip, netmask) => {
  const ipParts = ip.split(".").map(Number);
  const maskParts = netmask.split(".").map(Number);

  // Calculate network address (IP & mask)
  const network = ipParts.map((part, i) => part & maskParts[i]);

  // Calculate broadcast address (IP | ~mask)
  const broadcast = ipParts.map((part, i) => part | (~maskParts[i] & 255));

  // Start IP: network + 1
  const start = [...network];
  start[3] += 1;

  // End IP: broadcast - 1
  const end = [...broadcast];
  end[3] -= 1;

  // Calculate total usable addresses
  const bits = maskParts
    .map((part) => part.toString(2).split("1").length - 1)
    .reduce((sum, count) => sum + count, 0);
  const totalAddresses = Math.pow(2, 32 - bits) - 2; // Exclude network and broadcast

  return {
    start: start.join("."),
    end: end.join("."),
    totalAddresses,
  };
};

// Error checking for form validation
const errorCheck = ({
  user = "",
  pass = "",
  manual = false,
  isOnvif = false,
  start = "",
  end = "",
  toast = () => {},
}) => {
  let error = [];
  if (user || pass || isOnvif) {
    if (!user?.trim()) error.push("Please enter username");
    if (!pass?.trim()) error.push("Please enter password");
  }
  if (manual) {
    if (!validateIPv4(start))
      error.push("Invalid start IP: must be a valid IPv4 address");
    if (!validateIPv4(end))
      error.push("Invalid end IP: must be a valid IPv4 address");
    if (validateIPv4(start) && validateIPv4(end)) {
      const startNum = ipToNumber(start);
      const endNum = ipToNumber(end);
      if (startNum > endNum) {
        error.push("Start IP must be less than or equal to end IP");
      }
    }
  }

  if (error?.length > 0) {
    toast({
      title: "Error",
      description: (
        <div>
          {error?.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      ),
      status: "error",
      position: "top-right",
      duration: 6000,
      isClosable: true,
    });
    return true;
  }
  return false;
};

const Home = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [scanRange, setScanRange] = useState({ start: "", end: "" });
  const [manualScan, setManualScan] = useState(false);
  const [isOnvif, setIsOnvif] = useState(true);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const toast = useToast();

  // Fetch network interfaces on component mount
  useEffect(() => {
    const fetchBaseIp = async () => {
      try {
        const networkList = await window.electronAPI.getBaseIp();
        const enrichedNetworks = networkList.map((net) => {
          const range = calculateIpRange(net.ip, net.netmask);
          return {
            ...net,
            ...range,
          };
        });
        setNetworks(enrichedNetworks);
        if (enrichedNetworks.length > 0) {
          // Default to the first network
          setSelectedNetwork(enrichedNetworks[0].ip);
          setScanRange({
            start: enrichedNetworks[0].start,
            end: enrichedNetworks[0].end,
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: `Failed to fetch network details: ${err.message}`,
          status: "error",
          position: "top-right",
          duration: 6000,
          isClosable: true,
        });
      }
    };
    fetchBaseIp();
  }, []);

  // Update scanRange when selected network changes
  useEffect(() => {
    const selected = networks.find((net) => net.ip === selectedNetwork);
    if (selected) {
      setScanRange({
        start: selected.start,
        end: selected.end,
      });
    }
  }, [selectedNetwork, networks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      errorCheck({
        user: username,
        pass: password,
        manual: manualScan,
        isOnvif,
        start: scanRange.start,
        end: scanRange.end,
        toast,
      })
    )
      return;
    setResults(null);
    setLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.runDiscovery({
        username: username,
        password: password,
        scanRange: manualScan ? scanRange : null,
        onvif: isOnvif,
      });
      setResults(
        result?.reduce((a, b) => {
          b?.rtsp?.forEach((item) => {
            a?.push({
              ip: b?.ip ? b?.ip : new URL(b?.url).hostname,
              hardware: b?.hardware,
              manufacturer: b?.manufacturer,
              rtsp: item,
            });
          });
          return a;
        }, [])
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!results || results.length === 0) return;
    
    // Create CSV header
    const csvHeader = ["IP", "Hardware", "Manufacturer", "RTSP Link"];
    
    // Create CSV content
    const csvContent = [
      csvHeader.join(","),
      ...results.map(device => [
        device?.ip || "",
        device?.hardware || "",
        device?.manufacturer || "",
        device?.rtsp || ""
      ].join(","))
    ].join("\n");
    
    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "camera_discovery_results.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-grow justify-center items-center p-8 h-full">
      <div className="max-w-4xl min-w-[70dvw] bg-white rounded shadow p-6 overflow-y-auto h-fit max-h-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          RTSP Camera Discovery
        </h1>

        {loading ? (
          <LottieLoader
            animationData={Animation}
            width="300px"
            height="auto"
            showText
            intervalDuration={3000}
            textOptions={[
              "🔍 Scanning the network for cameras...",
              "🕵️‍♂️ Hunting down hidden cameras...",
              "🌐 Exploring your digital neighborhood...",
              "📡 Sending out camera detection pulses...",
              "👀 Looking for unblinking electronic eyes...",
              "🤖 Deploying camera-seeking nanobots...",
              "🖥️ Checking all the nooks and crannies of your network...",
              "🛰️ Initiating camera reconnaissance protocol...",
              "📹 Seeking video devices...",
              "🔦 Shining light on network-connected cameras...",
              "🕵️‍♀️ Investigating suspicious devices...",
              "🚀 Launching camera detection sequence...",
              "🔭 Peering through the network for lenses...",
              "🖲️ Probing for surveillance devices...",
              "⚡ Electrifying camera search in progress...",
              "🔄 Rotating through IP addresses...",
              "📶 Analyzing network traffic for camera signals...",
              "🕵️ Decrypting the network's secrets...",
              "🔢 Calculating possible camera locations...",
              "🎯 Narrowing down camera candidates...",
            ]}
          />
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {networks.length > 0 && (
              <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded">
                <div className="flex gap-2 items-center">
                  {" "}
                  <Typography variant="h6" className="mb-2">
                    Available Networks
                  </Typography>
                  <FilterContainer
                    elements={[
                      <CustomSelect
                        options={networks}
                        setValue={setSelectedNetwork}
                        value={selectedNetwork}
                        isPlain={false}
                        displayKey="ip"
                        title="Network"
                        valueKey="ip"
                      />,
                    ]}
                  />
                </div>
                <div className="flex gap-4 flex-wrap">
                  {networks.map((net) => (
                    <div key={net.ip} className="mb-2">
                      <Typography variant="body2">
                        <strong>IP:</strong> {net.ip}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Subnet Mask:</strong> {net.netmask}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Range:</strong> {net.start} to {net.end} (
                        {net.totalAddresses} addresses)
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="w-fit">
              <CustomCheckbox
                text="Use Onvif"
                isChecked={isOnvif}
                handleChange={() => setIsOnvif((prev) => !prev)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value?.trim())}
                fullWidth
                placeholder="Camera username"
                size="small"
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value?.trim())}
                fullWidth
                placeholder="Camera password"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="w-fit">
              <CustomCheckbox
                text="Manual Scanning"
                isChecked={manualScan}
                handleChange={() => setManualScan((prev) => !prev)}
              />
            </div>

            {manualScan && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                  label="IP Range Start"
                  variant="outlined"
                  value={scanRange.start}
                  onChange={(e) =>
                    setScanRange({
                      ...scanRange,
                      start: e.target.value.trim(),
                    })
                  }
                  fullWidth
                  size="small"
                  placeholder="e.g., 192.168.1.1"
                />
                <TextField
                  label="IP Range End"
                  variant="outlined"
                  value={scanRange.end}
                  onChange={(e) =>
                    setScanRange({
                      ...scanRange,
                      end: e.target.value.trim(),
                    })
                  }
                  fullWidth
                  size="small"
                  placeholder="e.g., 192.168.1.254"
                />
                <div className="self-center">
                  <CustomButton
                    label="Reset Range"
                    onClick={async () => {
                      const selected = networks.find(
                        (net) => net.ip === selectedNetwork
                      );
                      if (selected) {
                        setScanRange({
                          start: selected.start,
                          end: selected.end,
                        });
                      }
                    }}
                    loading={loading}
                    variant="outlined"
                    minHeight="40px"
                  />
                </div>
              </div>
            )}

            <CustomButton
              label="Discover Cameras"
              onClick={handleSubmit}
              loading={loading}
              minHeight="40px"
              variant="contained"
            />
          </div>
        )}

        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        {results && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6" className="font-semibold">
                Discovery Results
              </Typography>
              {results.length > 0 && (
                <Tooltip title="Download Results" arrow>
                  <IconButton onClick={downloadCSV} color="primary">
                    <FileDownload />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            
            {results.length > 0 ? (
              <TableContainer component={Paper} className="shadow-md">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-semibold">IP</TableCell>
                      <TableCell className="font-semibold">Hardware</TableCell>
                      <TableCell className="font-semibold">
                        Manufacturer
                      </TableCell>
                      <TableCell className="font-semibold">RTSP Links</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((device, index) => (
                      <TableRow key={`${index}-${index}`}>
                        <TableCell>{device?.ip}</TableCell>
                        <TableCell>{device?.hardware}</TableCell>
                        <TableCell>{device?.manufacturer}</TableCell>
                        <TableCell>
                          <Tooltip title={device?.rtsp} arrow placement="top">
                            <p
                              onClick={() =>
                                window.electronAPI.openRtspLink(device?.rtsp)
                              }
                              className="text-blue-500 hover:underline cursor-pointer"
                            >
                              Camera {index + 1}
                            </p>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" className="mb-6">
                <div className="flex flex-col gap-2">
                  <Typography>No cameras were found with the current settings.</Typography>
                  <div>
                    <Typography variant="body2" className="mb-2">Try the following:</Typography>
                    <ul className="list-disc ml-6">
                      <li>Check your camera username and password</li>
                      <li>Try a different IP range</li>
                      <li>Ensure cameras are powered on and connected to the network</li>
                      <li>Toggle Onvif setting and try again</li>
                    </ul>
                  </div>
                  <CustomButton
                    label="Try Different Settings"
                    onClick={() => setResults(null)}
                    variant="outlined"
                    className="mt-2 self-start"
                  />
                </div>
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
