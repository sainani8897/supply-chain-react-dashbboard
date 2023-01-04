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
import { DocsExample } from "src/components";
import { Button } from "@coreui/coreui";
import axios from "axios";
import { doc } from "prettier";

const Roles = () => {
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false);
  const [delModal, setDelVisible] = useState(false);
  const [formAction, setFormAction] = useState("Add");
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState([]);
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
      // console.log(page);
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
    defaultValues: {},
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
    data.name = convertToSlug(data.display_text);
    axios
      .post(
        process.env.REACT_APP_API_URL + "/roles",
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

  const convertToSlug = (Text) => {
    return Text.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const updateData = (data) => {
    data.name = convertToSlug(data.display_text);
    data.package = shipmentData.package;
    data.sales_order = shipmentData.sales_order;
    axios
      .patch(
        process.env.REACT_APP_API_URL + "/roles",
        { payload: data },
        { headers: { Authorization: localStorage.getItem("token") ?? null } }
      )
      .then((response) => {
        reload();
        setVisibleXL(false); /* Close the Pop Here */
        toast.success(response.data.message ?? "Success");
      })
      .catch((error, response) => {
        const data = error.response.data;
        const errObj = data.error.errors;
        toast.error(
          error.response.data.message ?? "Opps something went wrong!"
        );
        validationAlertPop({ err: error.response.data });
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
      .delete(process.env.REACT_APP_API_URL + "/roles", {
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

  useEffect(() => {
    const currentParams = Object.fromEntries([...searchParams]);
    reload();
  }, [searchParams]);

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

  /* Get Data */
  useEffect(() => {
    // reload();
    getPermissions();
  }, []);

  const reload = async (query = {}) => {
    let page = searchParams.get("page") ?? 1;
    return await axios
      .get(process.env.REACT_APP_API_URL + "/roles", {
        params: query,
        headers: { Authorization: localStorage.getItem("token") ?? null },
      })
      .then((res) => {
        setData(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page;
      })
      .catch((err) => {
        toast.error(error.response.data.message ?? err.message);
      });
  };

  /* Edit Form */
  const onEdit = (data) => {
    resetForm();
    setFormAction("Update");
    setShipmentData(data);
    setVisibleXL(!visibleXL);
    setValue("display_text", data.display_text);
    setValue(
      "permissions[]",
      data.permissions.map((exe) => exe._id)
    );
    setValue("_id", data._id);
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

  /* Get Permissions */
  const getPermissions = async () => {
    let page = searchParams.get("page") ?? 1;
    return await axios
      .get(process.env.REACT_APP_API_URL + "/permissions", {
        params: { page },
        headers: { Authorization: localStorage.getItem("token") ?? null },
      })
      .then((res) => {
        const permissionsData = res.data.data.docs;
        let group = permissionsData.reduce((r, a) => {
          r[a.group_name] = [...(r[a.group_name] || []), a];
          return r;
        }, {});
        setPermissions(permissionsData);
        setGroupedPermissions(group);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page;
      })
      .catch((err) => {
        toast.error(err.response?.data?.message ?? err.message);
      });
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
        <CButton
          color="info"
          onClick={() => {
            addForm();
          }}
          className="mb-4 text-white"
        >
          Add Role
        </CButton>
        <CCard className="mb-4">
          <CCardHeader>Roles</CCardHeader>
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
                  {/* <CCol xs="auto">
                    <MultiSelect
                      data={{
                        clearValue: filterSelect,
                        name: "status",
                        options: [
                          {
                            value: "Active",
                            label: "Active",
                          },
                          {
                            value: "In-Active",
                            label: "In-Active",
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
                  </CCol> */}
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
            {data?.docs?.length > 0 ? (
              <>
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">.</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Roles </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {data.docs?.map((role, index) => (
                      <CTableRow key={role._id}>
                        <CTableHeaderCell scope="row">
                          {index + 1}
                        </CTableHeaderCell>
                        <CTableDataCell>{role.display_text}</CTableDataCell>
                        <CTableDataCell>
                          <CTooltip content="Edit" placement="top">
                            <CButton
                              color="info"
                              onClick={() => onEdit(role)}
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
                              onClick={() => onDelete(role)}
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
                    totalPages={data.totalPages ?? 1}
                    currentPage={data.page ?? 1}
                    showMax={7}
                    prevNext
                    activeBgColor="#fffff"
                    activeBorderColor="#7bc9c9"
                    href="http://localhost:3000/roles?page=*"
                    pageOneHref="http://localhost:3000/roles"
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
              size="lg"
              visible={visibleXL}
              onClose={() => setVisibleXL(false)}
              backdrop="static"
            >
              <CForm onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <CModalHeader>
                  <CModalTitle>{formAction} Role </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CCol xs={12}>
                    <CRow className="row g-3 px-3 mx-2 py-5">
                      <ValidationAlert
                        validate={{ visible: validationAlert, errorObjData }}
                      />

                      <CCol md={12}>
                        <CFormInput
                          type="text"
                          id="inputEmail4"
                          floatingLabel="Role Name"
                          {...register("display_text")}
                        />
                        {errors.shipment_no && (
                          <div className="invalid-validation-css">
                            This field is required
                          </div>
                        )}
                      </CCol>

                      <h4>Role Permission</h4>

                      {Object.keys(groupedPermissions)?.map((gp, index) => {
                        return (
                          <fieldset
                            className="form-group row mb-1 py-2"
                            key={index}
                          >
                            <legend className="col-sm-4 control-label col-form-label">
                              {gp}
                            </legend>
                            <div className="col-sm-8 checkbox-wrapper">
                              {groupedPermissions[gp]?.map((permission) => {
                                return (
                                  <div className="checkbox-inline">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="severity_0"
                                      value={permission._id}
                                      {...register("permissions[]", {})}
                                    />
                                    <label className="form-check-label mx-1 text-secondary">
                                      {permission.display_text}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </fieldset>
                        );
                      })}

                      {/* 
                      <CCol md={12} className="mt-4">
                        <div className='float-end'>
                          <input type="hidden" {...register("invoice")}></input>
                          <input type="hidden"  {...register("_id")} ></input>
                          <CButton type="submit" className="me-md-2" >Save & Continue </CButton>
                          <CButton type="button" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2" color="secondary" variant="ghost">Close</CButton>
                        </div>
                      </CCol> */}
                    </CRow>
                  </CCol>
                </CModalBody>
                <CModalFooter className="mt-4">
                  <input
                    type="hidden"
                    {...register("_id", options._id)}
                  ></input>
                  <CButton type="submit" className="me-md-2">
                    Submit
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
                </CModalFooter>
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

export default Roles;
