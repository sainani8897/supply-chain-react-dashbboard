import React, { useEffect, useState, useRef } from "react";
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils";
import CIcon from "@coreui/icons-react";
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from "@coreui/icons";

import avatar1 from "src/assets/images/avatars/1.jpg";
import avatar2 from "src/assets/images/avatars/2.jpg";
import avatar3 from "src/assets/images/avatars/3.jpg";
import avatar4 from "src/assets/images/avatars/4.jpg";
import avatar5 from "src/assets/images/avatars/5.jpg";
import avatar6 from "src/assets/images/avatars/6.jpg";

import WidgetsBrand from "../widgets/WidgetsBrand";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import SalesWidget from "../dashboard-widgets/SalesWidget";
import PurchaseWidget from "../dashboard-widgets/PurchaseWidget";
import Widgets from "../dashboard-widgets/Widgets";
import { useSearchParams, useNavigate } from "react-router-dom";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState({});
  const [salesReport, setSalesReport] = useState([]);
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const chartRef = useRef(null);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const random = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  function pluck(array, key) {
    return array.map((o) => o[key]);
  }

  /* Get Data */
  useEffect(() => {
    const currentParams = Object.fromEntries([...searchParams]);
    reload();
  }, [searchParams]);

  useEffect(() => {
    const chart = chartRef.current;
    setSalesReport(data?.value?.salesReport ?? []);
    console.log("After data=====", data);
    console.log(pluck(data?.value?.salesReport ?? [], "sales"));
    if (data?.value?.salesReport) {
      chart.update();
    }
  }, [data]);

  /* Get Data */
  useEffect(() => {}, []);

  const reload = async (page = 1) => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_URL + "/dashboard",
        {
          params: { page },
          headers: { Authorization: localStorage.getItem("token") ?? null },
        }
      );
      setData(data.data?.docs[0] ?? {});
      return data;
    } catch (error) {
      navigate("/500", { replace: true });
    }
  };

  return (
    <>
    <h5 className="mb-5">Company Name</h5>
    
      <SalesWidget data={data?.value} />
      {/* <PurchaseWidget /> */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Sales Report
              </h4>
              <div className="small text-medium-emphasis">
                January - July 2021
              </div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {["Day", "Month", "Year"].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === "Month"}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          {/* <CChartLine
            style={{ height: "300px", marginTop: "40px" }}
            data={{
              labels: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
              ],
              datasets: [
                {
                  label: "My First dataset",
                  backgroundColor: hexToRgba(getStyle("--cui-info"), 10),
                  borderColor: getStyle("--cui-info"),
                  pointHoverBackgroundColor: getStyle("--cui-info"),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                  fill: true,
                },
                {
                  label: "My Second dataset",
                  backgroundColor: "transparent",
                  borderColor: getStyle("--cui-success"),
                  pointHoverBackgroundColor: getStyle("--cui-success"),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                },
                {
                  label: "My Third dataset",
                  backgroundColor: "transparent",
                  borderColor: getStyle("--cui-danger"),
                  pointHoverBackgroundColor: getStyle("--cui-danger"),
                  borderWidth: 1,
                  borderDash: [8, 5],
                  data: [65, 65, 65, 65, 65, 65, 65],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          /> */}
          <Line
            ref={chartRef}
            style={{ height: "300px", marginTop: "40px" }}
            options={{
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 6,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0,
                },
              },
            }}
            data={{
              labels: pluck(salesReport ?? [], "_id"),
              datasets: [
                {
                  backgroundColor: hexToRgba(getStyle("--cui-info"), 10),
                  borderColor: getStyle("--cui-info"),
                  pointHoverBackgroundColor: getStyle("--cui-info"),
                  borderWidth: 2,
                  label: "Total Sales",
                  data: pluck(salesReport ?? [], "sales"),
                },
              ],
            }}
          />
        </CCardBody>
      </CCard>

      <Widgets data={data?.value} />
    </>
  );
};

export default Dashboard;
