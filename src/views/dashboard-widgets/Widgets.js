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
  CButton,
  CTable,
  CTableRow,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTooltip,
} from "@coreui/react";
import { getStyle } from "@coreui/utils";
import CIcon from "@coreui/icons-react";
import { CChart } from "@coreui/react-chartjs";
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
  cilCloudDownload,
} from "@coreui/icons";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";
import { DocsExample } from "src/components";

import WidgetsBrand from "./WidgetsBrand";
import WidgetsDropdown from "./SalesWidget";

const Widgets = (props) => {
  const random = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);
  console.log(props);
  return (
    <>
      <CRow>
        <CCol xs={12} sm={6} lg={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Products"
            value={props?.data?.productsCount}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CWidgetStatsF
            className="mb-3"
            color="warning"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Categories"
            value={props?.data?.categoriesCount}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CWidgetStatsF
            className="mb-3"
            color="danger"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Out of Stock"
            value={props?.data?.productsOutStockCount}
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
            value={props?.data?.customersCount}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CWidgetStatsF
            className="mb-3"
            color="success"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Vendors"
            value={props?.data?.vendorsCount}
          />
        </CCol>
        <CCol xs={12} sm={6} lg={4}>
          <CWidgetStatsF
            className="mb-3"
            color="dark"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Users"
            value={props?.data?.usersCount}
          />
        </CCol>
      </CRow>

      {/* <CRow>
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
      </CRow> */}

      {/* <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            progress={{ color:"success", value: 100 }}
            text="Widget helper text"
            title="Purchases"
            value="89.9%"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsC
            className="mb-3"
            icon={<CIcon icon={cilChartPie} height={36} />}
            progress={{ color:"warning", value: 100 }}
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
      </CRow> */}

      <CRow>
        <CCol xs={12} sm={6} lg={6}>
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    Product Report
                  </h4>
                  <div className="small text-medium-emphasis">
                    January - July 2021
                  </div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CTooltip content="View more" placement="top">
                    <CButton color="light" className="float-end">
                      <CIcon icon={cilArrowRight} />
                    </CButton>
                  </CTooltip>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={12}>
                  <CTable className="mt-4">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Total Sales
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Gross Sale
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {props?.data?.productsSales?.map((item, index) => {
                        return (
                          <CTableRow key={index}>
                            <CTableHeaderCell scope="row">
                              {index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>
                              {item?.product_doc[0]?.name ?? "N/A"}
                            </CTableDataCell>
                            <CTableDataCell>{item?.total_sales}</CTableDataCell>
                            <CTableDataCell>{item?.total}</CTableDataCell>
                          </CTableRow>
                        );
                      })}
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={6}>
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    Product Analytics
                  </h4>
                  <div className="small text-medium-emphasis">
                    January - July 2021
                  </div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CTooltip content="Download" placement="top">
                    <CButton color="primary" className="float-end">
                      <CIcon icon={cilCloudDownload} />
                    </CButton>
                  </CTooltip>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={12}>
                  <CChart
                    type="bar"
                    data={{
                      labels: ["January", "February", "March", "April", "May"],
                      datasets: [
                        {
                          label: "Sales",
                          backgroundColor: "#07bc0c",
                          data: [40, 20, 12, 39, 10],
                        },
                      ],
                    }}
                    labels="months"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} sm={6} lg={6}>
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    Category Sales
                  </h4>
                  <div className="small text-medium-emphasis">
                    January - July 2021
                  </div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CTooltip content="View more" placement="top">
                    <CButton color="light" className="float-end">
                      <CIcon icon={cilArrowRight} />
                    </CButton>
                  </CTooltip>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={12}>
                  <CTable striped className="mt-4">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Category
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Sales</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                        <CTableDataCell>Mark</CTableDataCell>
                        <CTableDataCell>Otto</CTableDataCell>
                        <CTableDataCell>@mdo</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell scope="row">2</CTableHeaderCell>
                        <CTableDataCell>Jacob</CTableDataCell>
                        <CTableDataCell>Thornton</CTableDataCell>
                        <CTableDataCell>@fat</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                        <CTableDataCell colSpan={2}>
                          Larry the Bird
                        </CTableDataCell>
                        <CTableDataCell>@twitter</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                        <CTableDataCell colSpan={2}>
                          Larry the Bird
                        </CTableDataCell>
                        <CTableDataCell>@twitter</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                        <CTableDataCell colSpan={2}>
                          Larry the Bird
                        </CTableDataCell>
                        <CTableDataCell>@twitter</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={6}>
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={8}>
                  <h4 id="traffic" className="card-title mb-0">
                    Category Analytics
                  </h4>
                  <div className="small text-medium-emphasis">
                    January - July 2021
                  </div>
                </CCol>
                <CCol sm={4} className="d-none d-md-block">
                  <CButton color="primary" className="float-end">
                    <CIcon icon={cilCloudDownload} />
                  </CButton>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={12}>
                  <CChart
                    type="bar"
                    data={{
                      labels: ["January", "February", "March", "April", "May"],
                      datasets: [
                        {
                          label: "Sales",
                          backgroundColor: "#3498db",
                          data: [40, 20, 12, 39, 10],
                        },
                      ],
                    }}
                    labels="months"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} sm={6} lg={6}>
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    Low / Out of Stock Alert
                  </h4>
                  <div className="small text-medium-emphasis">
                    January - July 2021
                  </div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CTooltip content="View more" placement="top">
                    <CButton color="light" className="float-end">
                      <CIcon icon={cilArrowRight} />
                    </CButton>
                  </CTooltip>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={12}>
                  <CTable responsive className="mt-4">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          In-Hand Qty
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {props?.data?.lowQtyProducts?.map((item, index) => {
                        return (
                          <CTableRow key={index}>
                            <CTableHeaderCell scope="row">
                              {index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>{item?.name}</CTableDataCell>
                            <CTableDataCell>{item?.qty}</CTableDataCell>
                            <CTableDataCell>{item?.status}</CTableDataCell>
                          </CTableRow>
                        );
                      })}
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={6}>
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h5 id="traffic" className="card-title mb-0">
                    Recent Invoices
                  </h5>
                  <div className="small text-medium-emphasis">
                    January - July 2021
                  </div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CTooltip content="View more" placement="top">
                    <CButton color="light" className="float-end">
                      <CIcon icon={cilArrowRight} />
                    </CButton>
                  </CTooltip>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={12}>
                  <CTable className="mt-4">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Invoice</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Payment</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {props?.data?.recentInvoice?.map((item, index) => {
                        return (
                          <CTableRow key={index}>
                            <CTableHeaderCell scope="row">
                              {item?.invoice_no}
                            </CTableHeaderCell>
                            <CTableDataCell>{item?.payment}</CTableDataCell>
                          </CTableRow>
                        );
                      })}
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={6} lg={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h5 id="traffic" className="card-title mb-0">
                    Recent Customers
                  </h5>
                  <div className="small text-medium-emphasis">
                    January - July 2021
                  </div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CTooltip content="View more" placement="top">
                    <CButton color="light" className="float-end">
                      <CIcon icon={cilArrowRight} />
                    </CButton>
                  </CTooltip>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={12}>
                  <CTable responsive className="mt-4">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Customer
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Customer type</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                    {props?.data?.recentCustomers?.map((customer, index) => {
                        return (
                          <CTableRow key={index}>
                            <CTableHeaderCell scope="row">
                              {index+1}
                            </CTableHeaderCell>
                            <CTableDataCell>{customer?.name}</CTableDataCell>
                            <CTableDataCell>{customer?.createdAt}</CTableDataCell>
                            <CTableDataCell>{customer?.customer_type}</CTableDataCell>
                            <CTableDataCell>{customer?.status}</CTableDataCell>
                          </CTableRow>
                        );
                      })}
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Widgets;
