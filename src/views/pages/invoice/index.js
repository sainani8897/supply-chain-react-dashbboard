import { React, useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import ValidationAlert from "../../../components/Alerts/ValidationAlert";
import Pagination from "react-bootstrap-4-pagination";
import { useSearchParams, Link } from "react-router-dom";
import { DateTime } from "luxon";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CButton,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
  CToast,
  CToastBody,
  CModalFooter,
  CToastClose,
  CPopover,
  CTooltip,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CFormFloating,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilPencil,
  cilTrash,
  cilWarning,
  cilSearch,
  cilX,
  cilCloudDownload,
} from "@coreui/icons";
import axios from "axios";
import MultiSelect from "../../multi-select/Multiselect";

const Invoice = () => {
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false);
  const [delModal, setDelVisible] = useState(false);
  const [formAction, setFormAction] = useState("Add");
  const [data, setData] = useState([]);
  const [shipment, setShipment] = useState([]);
  const [categories, setCategory] = useState({});
  const [salesExecutives, setSalesExe] = useState({});
  const [vendors, setVendors] = useState({});
  const [shipmentData, setShipmentData] = useState({});
  const [errorObjData, setErrorObj] = useState([]);
  const [validationAlert, setValidationAlert] = useState(false);
  const [searchParams] = useSearchParams();
  const [addItems, setItems] = useState([
    { product_id: "", qty: 0.0, rate: 0.0, amount: 0.0 },
  ]);
  const [filterSelect, setFilterSelect] = useState(false);

  let paginationConfig = {
    totalPages: 1,
    currentPage: 1,
    showMax: 5,
    size: "sm",
    threeDots: true,
    prevNext: true,
    onClick: function (page) {
      console.log(page);
    },
  };

  const addForm = () => {
    resetForm();
    append({ product_id: "", qty: 0.0, rate: 0.0, amount: 0.0 });
    setFormAction("Add");
    setVisibleXL(true);
  };
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: [{ product_id: "", qty: 0.0, rate: 0.0, amount: 0.0 }],
    },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "items", // unique name for your Field Array
    }
  );
  const watchItems = watch("items");

  /* Form */
  const onFormSubmit = (data) => {
    if (formAction == "Add") {
      create(data);
    } else {
      updateData(data);
    }
  };

  const validationAlertPop = (errorObj) => {
    setValidationAlert(true);
    const err = [];
    for (const key in errorObj) {
      if (Object.hasOwnProperty.call(errorObj, key)) {
        const element = errorObj[key];
        err.push(element);
      }
    }
    setErrorObj(err);
  };

  const create = (data) => {
    axios
      .post(
        process.env.REACT_APP_API_URL + "/shipment",
        { payload: data },
        { headers: { Authorization: localStorage.getItem("token") ?? null } }
      )
      .then((response) => {
        setVisibleXL(false); /* Close the Pop Here */
        reload();
        toast.success(response.data.message ?? "Success");
      })
      .catch((error) => {
        const data = error.response.data;
        const errObj = data.error.errors;
        toast.error(
          error.response.data.message ?? "Opps something went wrong!"
        );
        validationAlertPop({ err: error.response.data });
      });
  };

  const updateData = (data) => {
    data.package = shipmentData.package;
    data.sales_order = shipmentData.sales_order;

    axios
      .patch(
        process.env.REACT_APP_API_URL + "/invoice",
        { payload: data },
        { headers: { Authorization: localStorage.getItem("token") ?? null } }
      )
      .then((response) => {
        reload();
        setVisibleXL(false); /* Close the Pop Here */
        toast.success(response.data.message ?? "Success");
      })
      .catch((error, response) => {
        console.log(response.data);
        toast.error(response.data.message ?? "Opps something went wrong!");
      });
  };

  const onErrors = (errors) => {
    validationAlertPop(errors);
  };

  const options = {
    name: { required: "Product name is required" },
    status: {
      required: "Status is required",
    },
    qty: {
      required: "In-Hand Qty is required",
    },
  };

  const deleteAction = (data) => {
    axios
      .delete(process.env.REACT_APP_API_URL + "/invoice", {
        headers: { Authorization: localStorage.getItem("token") ?? null },
        data: { _id: [data._id] },
      })
      .then((response) => {
        toast.success(response.data.message ?? "Success");
        /* Empty the Form */
        setDelVisible(false); /* Close the Pop Here */
        reload();
      })
      .catch((error, response) => {
        toast.error(response.data.message ?? "Opps something went wrong!");
      });
  };

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    reset: reset2,
  } = useForm({});

  const onFilterSubmit = (data) => {
    reload(data);
    setFilterSelect(false);
  };

  const clearAll = () => {
    reset2();
    setFilterSelect(true);
    reload();
  };

  useEffect(() => {
    const currentParams = Object.fromEntries([...searchParams]);
    reload();
  }, [searchParams]);

  const reload = async (query = {}) => {
    query.page = query.page ?? 1;
    return await axios
      .get(process.env.REACT_APP_API_URL + "/invoice", {
        params: query,
        headers: { Authorization: localStorage.getItem("token") ?? null },
      })
      .then((res) => {
        setData(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page;
        console.log(data);
      })
      .catch((err) => {
        setToast({
          visible: true,
          color: "danger",
          message: res.data.message ?? "Oops something went wrong!",
        });
      });
  };

  /* Edit Form */
  const onEdit = (data) => {
    resetForm();
    setFormAction("Update");
    setShipmentData(data);
    // console.log(data.sales_executives.map((exe) => exe._id));
    setVisibleXL(!visibleXL);
    setValue("_id", data._id);
    setValue("shipping_type", data.shipping_type);
    setValue("shipment_no", data.shipment_no);
    setValue("tracking_no", data.tracking_no);
    setValue("status", data.status);
    setValue(
      "shipment_date",
      DateTime.fromISO(data.shipment_date).toFormat("yyyy-MM-dd")
    );
    setValue("shipping_notes", data.shipping_notes);
  };

  /* Delete  */
  const onDelete = (data) => {
    setShipmentData(data);
    setDelVisible(true);
  };

  /* Reset Form */
  const resetForm = () => {
    setValidationAlert(false);
    setErrorObj([]);
    reset({});
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CToast
          autohide={true}
          delay={2000}
          visible={toast.visible}
          color={toast.color}
          className="text-white align-items-center float-end"
        >
          <div className="d-flex">
            <CToastBody>{toast.message}</CToastBody>
            <CToastClose className="me-2 m-auto" />
          </div>
        </CToast>
      </CCol>

      <CCol xs={12}>
        {/* <CButton color="info" onClick={() => { addForm() }} className="mb-4 text-white">Add Shipment</CButton> */}
        <CCard className="mb-4">
          <CCardHeader>Invoices</CCardHeader>
          <CCardBody>
            <CForm className="row" onSubmit={handleSubmit2(onFilterSubmit)}>
              <CCol sm={8}>
                <CRow className="g-3">
                  <CCol xs="auto">
                    <CFormInput
                      style={{ padding: "0.48rem 0.5rem" }}
                      type="text"
                      size="sm"
                      id="inputPassword2"
                      placeholder="Search"
                      {...register2("search")}
                    />
                  </CCol>
                  <CCol xs="auto">
                    <MultiSelect
                      data={{
                        clearValue: filterSelect,
                        name: "status",
                        options: [
                          {
                            value: "Created",
                            label: "Created",
                          },
                          {
                            value: "Completed",
                            label: "Completed",
                          },
                          {
                            value: "Sent",
                            label: "Sent",
                          },
                          {
                            value: "Closed",
                            label: "Closed",
                          },
                        ],
                        selected: [],
                      }}
                      onSelect={(value) => {
                        setValue2(
                          "status[]",
                          value.map((o) => o["value"]) ?? []
                        );
                      }}
                    />
                  </CCol>
                  <CCol xs="auto">
                    <MultiSelect
                      data={{
                        clearValue: filterSelect,
                        name: "payment_status",
                        options: [
                          {
                            value: "Paid",
                            label: "Paid",
                          },
                          {
                            value: "Un-paid",
                            label: "Un-paid",
                          },
                          {
                            value: "Partially-Paid",
                            label: "Partially-Paid",
                          },
                          {
                            value: "Closed",
                            label: "Closed",
                          },
                        ],
                        selected: [],
                      }}
                      onSelect={(value) => {
                        setValue2(
                          "payment_status[]",
                          value.map((o) => o["value"]) ?? []
                        );
                      }}
                    />
                  </CCol>
                  {/* <CCol xs="auto">
                    <MultiSelect
                      data={{
                        name: "roles",
                        options: rolesOptions,
                        selected: [],
                      }}
                     
                    />
                  </CCol> */}
                  <CCol xs="auto">
                    <CButton
                      style={{ padding: "0.48rem 0.5rem" }}
                      size="sm"
                      type="submit"
                      color="success"
                      className="mb-3"
                      variant="outline"
                    >
                      <CIcon icon={cilSearch} size="custom-size" /> Filter
                    </CButton>
                    <CButton
                      style={{ padding: "0.48rem 0.5rem" }}
                      size="sm"
                      type="button"
                      color="secondary"
                      variant="outline"
                      className="mb-3 mx-1"
                      onClick={clearAll}
                    >
                      <CIcon icon={cilX} size="sm" /> Clear all
                    </CButton>
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm={4} className="d-flex flex-column align-items-end">
                <CCol xs="auto">
                  <CButton
                    style={{ padding: "0.48rem 0.5rem" }}
                    size="sm"
                    type="submit"
                    color="info"
                    className="mb-3"
                    variant="outline"
                  >
                    <CIcon icon={cilCloudDownload} size="custom-size" /> Export
                  </CButton>
                </CCol>
              </CCol>
            </CForm>
            {/* <p className="text-medium-emphasis small">
              Using the most basic table CoreUI, here&#39;s how <code>&lt;CTable&gt;</code>-based
              tables look in CoreUI.
            </p> */}
            {/* <div class="form-group  pull-right py-4">
              <input type="text" class="search form-control" placeholder="What you looking for?" />
            </div> */}
            {/* <DocsExample href="components/table"> */}
            {data?.docs?.length > 0 ? (
              <>
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Invoice Id{" "}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Invoice Date
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Associated Sales{" "}
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Payment</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {data.docs?.map((product, index) => (
                      <CTableRow key={product.id}>
                        <CTableHeaderCell scope="row">
                          {index + 1}
                        </CTableHeaderCell>
                        <CTableDataCell>#{product.invoice_no}</CTableDataCell>
                        <CTableDataCell>
                          {DateTime.fromISO(product.invoice_date).toFormat(
                            "yyyy/MM/dd"
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <Link
                            to={`/sales-pipeline/${product?.sales_order?._id}`}
                          >
                            #{product?.sales_order?.order_no}
                          </Link>
                        </CTableDataCell>
                        <CTableDataCell>
                          {product?.sale_details.total}
                        </CTableDataCell>
                        <CTableDataCell>{product.status}</CTableDataCell>
                        <CTableDataCell>{product.payment}</CTableDataCell>
                        <CTableDataCell>
                          <CTooltip content="Edit" placement="top">
                            <CButton
                              color="info"
                              onClick={() => onEdit(product)}
                              className="me-md-2"
                            >
                              <CIcon
                                className="text-white"
                                size={"lg"}
                                icon={cilPencil}
                              />
                            </CButton>
                          </CTooltip>
                          <CTooltip content="Delete" placement="top">
                            <CButton
                              color="danger"
                              onClick={() => onDelete(product)}
                              className="me-md-2"
                            >
                              <CIcon
                                className="text-white"
                                size={"lg"}
                                icon={cilTrash}
                              />
                            </CButton>
                          </CTooltip>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <div className="mt-2 px-2 float-end">
                  <Pagination
                    threeDots
                    totalPages={data.totalPages}
                    currentPage={data.page}
                    showMax={7}
                    prevNext
                    activeBgColor="#fffff"
                    activeBorderColor="#7bc9c9"
                    href="http://localhost:3000/invoice?page=*"
                    pageOneHref="http://localhost:3000/invoice"
                  />
                </div>
              </>
            ) : (
              <>
                <CCol md={12}>
                  <span className="d-block p-5 bg-light text-secondary text-center rounded ">
                    <CIcon size={"xl"} icon={cilWarning} /> No Data Found
                  </span>
                </CCol>
              </>
            )}
            {/* Modal start Here */}
            <CModal
              size="xl"
              visible={visibleXL}
              onClose={() => setVisibleXL(false)}
              backdrop="static"
            >
              <CForm onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <CModalHeader>
                  <CModalTitle>{formAction} Package </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CCol xs={12}>
                    <CRow className="row g-3 px-3 mt-1 mb-5">
                      <ValidationAlert
                        validate={{ visible: validationAlert, errorObjData }}
                      />

                      <CCol md={6}>
                        <CFormSelect
                          id="inputState"
                          floatingLabel="Shpiment type"
                          {...register("shipping_type")}
                        >
                          <option value="">...</option>
                          <option>Manual</option>
                          <option>Easy Post</option>
                          <option>Xpress Bee</option>
                          <option>DHL</option>
                          <option>Others</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          id="inputEmail4"
                          floatingLabel="Shipment No#"
                          {...register("shipment_no")}
                        />
                        {errors.shipment_no && (
                          <div className="invalid-validation-css">
                            This field is required
                          </div>
                        )}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          id="inputEmail4"
                          floatingLabel="Tracking No#"
                          {...register("tracking_no")}
                        />
                        {errors.tracking_no && (
                          <div className="invalid-validation-css">
                            This field is required
                          </div>
                        )}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="date"
                          id="inputPassword4"
                          floatingLabel="Shipment Date"
                          {...register("shipment_date")}
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect
                          id="inputState"
                          floatingLabel="Shpiment Status"
                          {...register("status")}
                        >
                          <option value="">...</option>
                          <option>Shipped</option>
                          <option>On-Transit</option>
                          <option>Delivered</option>
                          <option>Un-Delivered</option>
                        </CFormSelect>
                      </CCol>

                      <h5>Additional Information</h5>

                      <CCol md={12}>
                        <CFormTextarea
                          id="cost_data"
                          floatingLabel="Shipping Notes"
                          style={{ height: "100px" }}
                          {...register("shipping_notes")}
                          rows="6"
                        ></CFormTextarea>
                      </CCol>

                      <CCol md={12} className="mt-4">
                        <div className="float-end">
                          <input
                            type="hidden"
                            {...register("shipment._id")}
                          ></input>
                          <CButton type="submit" className="me-md-2">
                            Save & Continue{" "}
                          </CButton>
                          <CButton
                            type="button"
                            onClick={() => setVisibleXL(!visibleXL)}
                            className="me-md-2"
                            color="secondary"
                            variant="ghost"
                          >
                            Close
                          </CButton>
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>
                </CModalBody>
              </CForm>
            </CModal>

            <CModal
              alignment="center"
              visible={delModal}
              onClose={() => setDelVisible(false)}
            >
              <CModalHeader>
                {/* <CModalTitle>Modal title</CModalTitle> */}
              </CModalHeader>
              <CModalBody className="text-center">
                <CIcon size={"4xl"} icon={cilTrash} />
                {/* <CIcon icon={cilPencil} customClassName="nav-icon" /> */}
                <h3 className="mt-4 mb-4">Are you Sure? </h3>
                <p>
                  Do you really want to delete these records? This process
                  cannot be undone.
                </p>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setDelVisible(false)}>
                  Close
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => {
                    deleteAction(shipmentData);
                  }}
                  variant="ghost"
                >
                  Yes Continue
                </CButton>
              </CModalFooter>
            </CModal>

            {/* Modal ends Here  */}
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Invoice;
