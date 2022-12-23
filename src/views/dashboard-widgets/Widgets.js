import React from "react";
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCol,
  CLink,
  CRow,
  CWidgetStatsB,
  CWidgetStatsC,
  CWidgetStatsE,
  CWidgetStatsF,
} from "@coreui/react";
import { getStyle } from "@coreui/utils";
import CIcon from "@coreui/icons-react";
import {
  cilArrowRight,
  cilBasket,
  cilBell,
  cilChartPie,
  cilMoon,
  cilLaptop,
  cilPeople,
  cilSettings,
  cilSpeech,
  cilSpeedometer,
  cilUser,
  cilUserFollow,
} from "@coreui/icons";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";
import { DocsExample } from "src/components";

import WidgetsBrand from "./WidgetsBrand";
import WidgetsDropdown from "./SalesWidget";

const Widgets = () => {
  const random = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  return (
    <>
      <CRow>
        <CCol xs={12} sm={6} lg={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Products"
            value="89.9%"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CWidgetStatsF
            className="mb-3"
            color="warning"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Categories"
            value="89.9%"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CWidgetStatsF
            className="mb-3"
            color="danger"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Out of Stock"
            value="89.9%"
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} sm={6} lg={4}>
          <CWidgetStatsF
            className="mb-3"
            color="info"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Customers"
            value="89.9%"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CWidgetStatsF
            className="mb-3"
            color="success"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Vendors"
            value="89.9%"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CWidgetStatsF
            className="mb-3"
            color="dark"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Users"
            value="89.9%"
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            progress={{ value: 100 }}
            text="Widget helper text"
            title="Sales"
            value="89.9%"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            progress={{ value: 100 }}
            text="Widget helper text"
            title="Packages"
            value="89.9%"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            progress={{ value: 100 }}
            text="Widget helper text"
            title="Shipments"
            value="89.9%"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            progress={{ value: 100 }}
            text="Widget helper text"
            title="Invoices"
            value="89.9%"
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            progress={{ value: 100 }}
            text="Widget helper text"
            title="Purchases"
            value="89.9%"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            progress={{ value: 100 }}
            text="Widget helper text"
            title="Bills"
            value="89.9%"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            progress={{ value: 100 }}
            text="Payments Made to Vendors"
            title="Payments Made to Vendors"
            value="89.9%"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            progress={{ value: 100 }}
            text="Widget helper text"
            title="Expenses"
            value="89.9%"
          />
        </CCol>
      </CRow>
    </>
  );
};

export default Widgets;
