import { React, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Pagination from "react-bootstrap-4-pagination";
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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CAlert,
  CAlertHeading,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cibCplusplus,
  cilArrowLeft,
  cilArrowRight,
  cilBell,
  cilPencil,
  cilPlus,
  cilTrash,
  cilWarning,
  cilSearch,
  cilX,
  cilCloudDownload,
} from "@coreui/icons";
import axios from "axios";
import MultiSelect from "../../multi-select/Multiselect";

const Customer = () => {
  const [visibleXL, setVisibleXL] = useState(false);
  const [delModal, setDelVisible] = useState(false);
  const [formAction, setFormAction] = useState("Add");
  const [data, setData] = useState([]);
  const [customerData, setCategory] = useState({});
  const [errorObjData, setErrorObj] = useState([]);
  const [toast, setToast] = useState({
    visible: false,
    color: "primary",
    message: "Oops something went wrong!",
  });
  const [errorToast, setErrToast] = useState(false);
  const [errortToastMsg, setErrToastMsg] = useState("");
  const addForm = () => {
    resetForm();
    setFormAction("Add");
    setVisibleXL(true);
  };
  const { register, handleSubmit, reset, setValue } = useForm();
  const [activeKey, setActiveKey] = useState(1);
  const [validationAlert, setValidationAlert] = useState(false);
  const [contactPersons, setContacts] = useState([
    { saluation: "", fname: "", lname: "", email: "", phone: "" },
  ]);
  const [filterSelect, setFilterSelect] = useState(false);
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
        process.env.REACT_APP_API_URL + "/customers",
        { payload: data },
        { headers: { Authorization: localStorage.getItem("token") ?? null } }
      )
      .then((response) => {
        reset({
          sort: "",
          customer_name: "",
          parent_id: "",
        }); /* Empty the Form */
        setVisibleXL(false); /* Close the Pop Here */
        setToast({
          visible: true,
          color: "success",
          message: response.data.message ?? "Success",
        }); /* Toast */
        reload();
      })
      .catch((error) => {
        console.log(error.response.data);
        validationAlertPop({ err: error.response.data });
      });
  };

  const updateData = (data) => {
    axios
      .patch(
        process.env.REACT_APP_API_URL + "/customers",
        { payload: data },
        { headers: { Authorization: localStorage.getItem("token") ?? null } }
      )
      .then((response) => {
        reset({
          sort: "",
          customer_name: "",
          parent_id: "",
        }); /* Empty the Form */
        setVisibleXL(false); /* Close the Pop Here */
        setToast({
          visible: true,
          color: "success",
          message: response.data.message ?? "Success",
        }); /* Toast */
        reload();
      })
      .catch((error, response) => {
        console.log(error.response.data);
        validationAlertPop({ err: error.response.data });
      });
  };

  const onErrors = (errors) => {
    validationAlertPop(errors);
  };

  const customerOptions = {
    customer_type: { required: "Customer type is required" },
    saluation: { required: "Saluation is required" },
    first_name: { required: "First Names is required" },
    last_name: { required: "Last Name is required" },
    email: { required: "Please provide a valid Email", pattern: /^\S+@\S+$/i },
    mobile: { required: "Mobile number is required" },
    // saluation: { required: "Saluation is required" },
    // saluation: { required: "Saluation is required" },
    status: {
      required: "Status is required",
    },
    contact_persons: [],
  };

  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/(?: |\b)(\w)/g, function (key, p1) {
        return key.toUpperCase();
      });
  };

  const deleteAction = (data) => {
    axios
      .delete(process.env.REACT_APP_API_URL + "/customers", {
        headers: { Authorization: localStorage.getItem("token") ?? null },
        data: { _id: [data._id] },
      })
      .then((response) => {
        /* Empty the Form */
        setDelVisible(false); /* Close the Pop Here */
        setToast({
          visible: true,
          color: "success",
          message: response.data.message ?? "Deleted Successfully",
        }); /* Toast */
        reload();
      })
      .catch((error, response) => {
        console.log(response.data);
        setToast({
          visible: true,
          color: "danger",
          message: res.data.message ?? "Oops something went wrong!",
        });
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
  /* Get Data */
  useEffect(() => {
    reload();
  }, []);

  const reload = async (query = {}) => {
    query.page = query.page ?? 1;
    return await axios
      .get(process.env.REACT_APP_API_URL + "/customers", {
        params: query,
        headers: { Authorization: localStorage.getItem("token") ?? null },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        setToast({
          visible: true,
          color: "danger",
          message: res.data.message ?? "Oops something went wrong!",
        });
      });
  };

  /* Reset Form */
  const resetForm = () => {
    setActiveKey(1);
    setValidationAlert(false);
    reset({});
  };

  /* Edit Form */
  const onEdit = (data) => {
    resetForm();
    setFormAction("Update");
    setVisibleXL(!visibleXL);
    setValue("first_name", data.first_name);
    setValue("last_name", data.last_name);
    setValue("saluation", data.saluation);
    setValue("customer_type", data.customer_type);
    setValue("company_name", data.company_name);
    setValue("email", data.email);
    setValue("mobile", data.mobile);
    setValue("display_name", data.display_name);
    setValue("company_email", data.company_email);
    setValue("company_phone", data.company_phone);
    setValue("pan", data.pan);
    setValue("gst", data.gst);
    setValue("alt_email", data.alt_email);
    setValue("alt_phone", data.alt_phone);
    setValue("contacts", data.contacts);
    setValue("status", data.status);
    setValue("address", data.address);
    setValue("shiping_address", data.shiping_address);
    setValue("_id", data._id);
    setValue("notes", data.notes);
    setValue("whatsapp", data.social_info?.whatsapp);
    setValue("instagram", data.social_info?.instagram);
    setValue("twitter", data.social_info?.twitter);
    setValue("facebook", data.social_info?.facebook);
    setValue("website_url", data.social_info?.website_url);
    setContacts(data.contacts);
  };

  /* Delete  */
  const onDelete = (data) => {
    setCategory(data);
    setDelVisible(true);
  };

  /* Add More */
  function addMoreContactPersons() {
    setContacts([...contactPersons, { saluation: "", fname: "", lname: "" }]);
  }

  function removeContactPersonal(remInd) {
    const cps = contactPersons;
    console.log(remInd);
    if (contactPersons.length <= 1) {
      return;
    }
    const remEle = cps.filter(function (index, ele) {
      console.log(ele, remInd);
      return remInd != ele;
    });
    console.log(cps);
    setContacts(remEle);
  }

  function basicDetailsForm(type = 1) {
    setActiveKey(type);
  }

  const errorToastPop = (message = "Opps !") => {
    setErrToast(true);
    setErrToastMsg(message);
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

        <CToast
          autohide={true}
          delay={2000}
          visible={errorToast}
          color="danger"
          className="text-white align-items-center float-end"
        >
          <div className="d-flex">
            <CToastBody>{errortToastMsg}</CToastBody>
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
          Add Customers
        </CButton>
        <CCard className="mb-4">
          <CCardHeader>Customers</CCardHeader>
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
            {/* <DocsExample href="components/table"> */}
            {data?.docs?.length > 0 ? (
              <>
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Customer type
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {data.docs?.map((customer, index) => (
                      <CTableRow key={customer.id}>
                        <CTableHeaderCell scope="row">
                          {index + 1}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {customer.customer_type}
                        </CTableDataCell>
                        <CTableDataCell>{customer.name}</CTableDataCell>
                        <CTableDataCell>{customer.email}</CTableDataCell>
                        <CTableDataCell>{customer.mobile}</CTableDataCell>
                        <CTableDataCell>{customer.status}</CTableDataCell>
                        <CTableDataCell>
                          <CTooltip content="Edit" placement="top">
                            <CButton
                              color="info"
                              onClick={() => onEdit(customer)}
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
                              onClick={() => onDelete(customer)}
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
                    showMax={5}
                    prevNext
                    activeBgColor="#fffff"
                    activeBorderColor="#7bc9c9"
                    onClick={(page) => {
                      reload({ page });
                    }}
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
                  <CModalTitle>{formAction} Customers</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CCol xs={12}>
                    <CNav variant="pills" layout="fill" role="tablist">
                      <CNavItem>
                        <CNavLink
                          href="javascript:void(0);"
                          active={activeKey === 1}
                          onClick={() => setActiveKey(1)}
                        >
                          Basic Details
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          href="javascript:void(0);"
                          active={activeKey === 2}
                          onClick={() => setActiveKey(2)}
                        >
                          Other Details & Doc's
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          href="javascript:void(0);"
                          active={activeKey === 3}
                          onClick={() => setActiveKey(3)}
                        >
                          Address
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          href="javascript:void(0);"
                          active={activeKey === 5}
                          onClick={() => setActiveKey(5)}
                        >
                          Contact Person's
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          href="javascript:void(0);"
                          active={activeKey === 4}
                          onClick={() => setActiveKey(4)}
                        >
                          Notes
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabContent className="mt-4">
                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="home-tab"
                        visible={activeKey === 1}
                      >
                        <div className="row g-3 mt-4 px-3">
                          <CAlert
                            dismissible
                            visible={validationAlert}
                            onClose={() => setValidationAlert(false)}
                            color="danger"
                          >
                            <CAlertHeading tag="h4">Error !</CAlertHeading>
                            <ul>
                              {errorObjData?.map((ele) => {
                                return <li>{ele["message"]}</li>;
                              })}
                            </ul>
                            <hr />
                            {/* <p className="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p> */}
                          </CAlert>
                          <CCol md={3}>
                            <CFormSelect
                              name="Customer Type"
                              id="inputState"
                              label="Customer type"
                              {...register(
                                "customer_type",
                                customerOptions.customer_type
                              )}
                            >
                              <option value="">Choose...</option>
                              <option>Business</option>
                              <option>Individual</option>
                            </CFormSelect>
                          </CCol>
                          <CCol md={3}>
                            <CFormSelect
                              name="saluation"
                              id="inputState"
                              label="Saluation"
                              {...register(
                                "saluation",
                                customerOptions.saluation
                              )}
                            >
                              <option value="">Choose...</option>
                              <option>Mr.</option>
                              <option>Mrs.</option>
                              <option>Ms.</option>
                              <option>Miss.</option>
                              <option>Dr.</option>
                            </CFormSelect>
                          </CCol>
                          <CCol md={3}>
                            <CFormInput
                              type="text"
                              name="first_name"
                              id="inputFName4"
                              label="Fisrt Name"
                              {...register(
                                "first_name",
                                customerOptions.first_name
                              )}
                            />
                          </CCol>
                          <CCol md={3}>
                            <CFormInput
                              type="text"
                              name="last_name"
                              id="inputLName"
                              label="Last Name"
                              {...register(
                                "last_name",
                                customerOptions.last_name
                              )}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="email"
                              id="inputEmail4"
                              label="Email"
                              {...register("email", customerOptions.email)}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="mobile"
                              id="mobile"
                              label="Mobile"
                              {...register("mobile", customerOptions.mobile)}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="display_name"
                              id="inputDisplayname"
                              label="Display Name"
                              {...register(
                                "display_name",
                                customerOptions.display_name
                              )}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="company_name"
                              id="CompanyName"
                              label="Company Name"
                              {...register(
                                "company_name",
                                customerOptions.company_name
                              )}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="company_email"
                              id="inputEmail4"
                              label="Company's Email"
                              {...register(
                                "company_email",
                                customerOptions.company_email
                              )}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="company_phone"
                              id="company_phone"
                              label="Company's Phone"
                              {...register(
                                "company_phone",
                                customerOptions.company_phone
                              )}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormSelect
                              name="status"
                              id="inputState"
                              label="Status"
                              {...register("status", customerOptions.status)}
                            >
                              <option value="">Choose...</option>
                              <option>Active</option>
                              <option>In-Active</option>
                            </CFormSelect>
                          </CCol>
                          <CCol md={12}>
                            <div className="me-md-2 mt-4 float-end ">
                              <CButton
                                type="button"
                                disabled
                                className="me-md-2 "
                                color="primary"
                              >
                                <CIcon size={"sm"} icon={cilArrowLeft} />
                              </CButton>
                              <CButton
                                type="button"
                                className="me-md-2 "
                                onClick={() => basicDetailsForm(2)}
                                color="primary"
                              >
                                <CIcon size={"sm"} icon={cilArrowRight} />
                              </CButton>
                            </div>
                          </CCol>
                        </div>
                      </CTabPane>

                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="profile-tab"
                        visible={activeKey === 2}
                      >
                        <div className="row g-3 mt-4 px-3">
                          {/*  <CCol md={6}>
                      <CFormSelect name='Customer Type' id="inputState" label="Customer type" {...register("customer_type", customerOptions.customer_type)}>
                        <option>Choose...</option>
                        <option>Business</option>
                        <option>Individual</option>
                      </CFormSelect>
                    </CCol> */}
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="pan"
                              id="inputPan"
                              label="PAN"
                              {...register("pan", customerOptions.pan)}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="gst"
                              id="inputGst"
                              label="GST"
                              {...register("gst", customerOptions.gst)}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="file"
                              name="profile"
                              id="inputProfile"
                              label="Profile"
                              {...register("profile", customerOptions.profile)}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="alt_phone"
                              id="inputPhone4"
                              label="Alternative Phone"
                              {...register(
                                "alt_phone",
                                customerOptions.alt_phone
                              )}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="alt_email"
                              id="inputPhone4"
                              label="Alternative Email"
                              {...register(
                                "alt_email",
                                customerOptions.alt_email
                              )}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="whatsapp"
                              id="inputPhone4"
                              label="Whatsapp"
                              {...register(
                                "whatsapp",
                                customerOptions.whatsapp
                              )}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="instagram"
                              id="inputPhone4"
                              label="Instagram"
                              {...register(
                                "instagram",
                                customerOptions.instagram
                              )}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="twitter"
                              id="twitter"
                              label="Twitter"
                              {...register("twitter", customerOptions.twitter)}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              placeholder="Facebook URL"
                              name="Facebok"
                              id="facebok"
                              label="Facebok"
                              {...register(
                                "facebook",
                                customerOptions.facebook
                              )}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              placeholder="https://www.example.com/"
                              name="website_url"
                              id="website_url"
                              label="Website"
                              {...register(
                                "facebook",
                                customerOptions.website_url
                              )}
                            />
                          </CCol>
                          <CCol md={12}>
                            <div className="me-md-2 mt-4 float-end ">
                              <CButton
                                type="button"
                                className="me-md-2 "
                                onClick={() => basicDetailsForm(1)}
                                color="primary"
                              >
                                <CIcon size={"sm"} icon={cilArrowLeft} />
                              </CButton>
                              <CButton
                                type="button"
                                className="me-md-2 "
                                onClick={() => basicDetailsForm(3)}
                                color="primary"
                              >
                                <CIcon size={"sm"} icon={cilArrowRight} />
                              </CButton>
                            </div>
                          </CCol>
                        </div>
                      </CTabPane>
                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="contact-tab"
                        visible={activeKey === 3}
                      >
                        {/* Address Form */}
                        <div className="row g-3 mt-2 px-3">
                          {/*  <CCol md={6}>
                      <CFormSelect name='Customer Type' id="inputState" label="Customer type" {...register("customer_type", customerOptions.customer_type)}>
                        <option>Choose...</option>
                        <option>Business</option>
                        <option>Individual</option>
                      </CFormSelect>
                    </CCol> */}
                          <h5>Billing Address</h5>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="address.address_line1"
                              id="inputAdd"
                              label="Address Line 1"
                              {...register("address.address_line1")}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="address.address_line2"
                              id="inputAdd2"
                              label="Address Line 2"
                              {...register("address.address_line2")}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="address.city"
                              id="inputCity"
                              label="City"
                              {...register("address.city")}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="address.state"
                              id="inputState"
                              label="State"
                              {...register("address.state")}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="address.pincode"
                              id="inputPin"
                              label="Pincode"
                              {...register("address.pincode")}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="address.country"
                              id="inputCountry"
                              label="Country"
                              {...register("address.country")}
                            />
                          </CCol>

                          <hr className="mt-4 mb-4"></hr>

                          <h5>Shipping Address</h5>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="shiping_address.address_line1"
                              id="inputAdd"
                              label="Address Line 1"
                              {...register("shiping_address.address_line1")}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="shiping_address.address_line2"
                              id="inputAdd2"
                              label="Address Line 2"
                              {...register("shiping_address.address_line2")}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="shiping_address.city"
                              id="inputshiping_address.City"
                              label="City"
                              {...register("shiping_address.city")}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="shiping_address.state"
                              id="inputshiping_address.State"
                              label="State"
                              {...register("shiping_address.state")}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="shiping_address.pincode"
                              id="inputPin"
                              label="Pincode"
                              {...register("shiping_address.pincode")}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              type="text"
                              name="shiping_address.country"
                              id="inputshiping_address.Country"
                              label="Country"
                              {...register("shiping_address.country")}
                            />
                          </CCol>
                          <CCol md={12}>
                            <div className="me-md-2 mt-4 float-end ">
                              <CButton
                                type="button"
                                className="me-md-2 "
                                onClick={() => basicDetailsForm(2)}
                                color="primary"
                              >
                                <CIcon size={"sm"} icon={cilArrowLeft} />
                              </CButton>
                              <CButton
                                type="button"
                                className="me-md-2 "
                                onClick={() => basicDetailsForm(5)}
                                color="primary"
                              >
                                <CIcon size={"sm"} icon={cilArrowRight} />
                              </CButton>
                            </div>
                          </CCol>
                        </div>
                      </CTabPane>
                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="notes-tab"
                        visible={activeKey === 4}
                      >
                        <div className="row g-3 mt-2 px-2">
                          <CCol md={12}>
                            <CFormTextarea
                              id="notes"
                              name="notes"
                              label="Notes"
                              rows="6"
                              text="Max 1000 chars"
                              {...register("notes", customerOptions.notes)}
                            ></CFormTextarea>
                          </CCol>
                          <CCol md={12}>
                            <div className="me-md-2 mt-4 float-end ">
                              <CButton
                                type="button"
                                className="me-md-2 "
                                onClick={() => basicDetailsForm(5)}
                                color="primary"
                              >
                                <CIcon size={"sm"} icon={cilArrowLeft} />
                              </CButton>
                              <CButton
                                type="button"
                                disabled
                                className="me-md-2 "
                                onClick={() => basicDetailsForm(4)}
                                color="primary"
                              >
                                <CIcon size={"sm"} icon={cilArrowRight} />
                              </CButton>
                            </div>
                          </CCol>
                        </div>
                      </CTabPane>
                      <CTabPane
                        role="tabpanel"
                        aria-labelledby="contacts-tab"
                        visible={activeKey === 5}
                      >
                        <div id="placements">
                          <div className="row g-3">
                            <div className="pull-right">
                              <CIcon size={"sm"} icon={cilPlus} />
                              <a
                                href="javascript:void(0)"
                                onClick={() => addMoreContactPersons()}
                              >
                                Add More
                              </a>
                            </div>
                            {contactPersons?.map((element, index) => {
                              return (
                                <div className="row g-3">
                                  <CCol md={1}>
                                    <CFormSelect
                                      name={`contacts[${index}].saluation`}
                                      id="inputSal"
                                      label="Saluation"
                                      {...register(
                                        `contacts[${index}].saluation`,
                                        customerOptions.contact_persons[index]
                                          ?.saluation
                                      )}
                                    >
                                      <option value="">Choose...</option>
                                      <option>Mr.</option>
                                      <option>Mrs.</option>
                                      <option>Ms.</option>
                                      <option>Miss.</option>
                                      <option>Dr.</option>
                                    </CFormSelect>
                                  </CCol>
                                  <CCol md={2}>
                                    <CFormInput
                                      type="text"
                                      name={`contacts[${index}].fname`}
                                      id="inputPin"
                                      label="First name"
                                      {...register(`contacts[${index}].fname`)}
                                    />
                                  </CCol>
                                  <CCol md={2}>
                                    <CFormInput
                                      type="text"
                                      name={`contacts[${index}].lname`}
                                      id="inputPin"
                                      label="Last name"
                                      {...register(`contacts[${index}].lname`)}
                                    />
                                  </CCol>
                                  <CCol md={3}>
                                    <CFormInput
                                      type="text"
                                      name={`contacts[${index}].email`}
                                      id="inputPin"
                                      label="Email"
                                      {...register(`contacts[${index}].email`)}
                                    />
                                  </CCol>
                                  <CCol md={3}>
                                    <CFormInput
                                      type="text"
                                      name={`contacts[${index}].phone`}
                                      id="inputPin"
                                      label="Phone"
                                      {...register(`contacts[${index}].phone`)}
                                    />
                                  </CCol>
                                  <CCol md={1}>
                                    {" "}
                                    <CButton
                                      type="button"
                                      onClick={() => removeContactPersonal(0)}
                                      className="me-md-4"
                                      style={{ marginTop: "1.9rem" }}
                                      color="danger"
                                    >
                                      <CIcon size={"sm"} icon={cilTrash} />
                                    </CButton>
                                  </CCol>
                                </div>
                              );
                            })}
                            <div className="row g-3">
                              <CCol md={12}>
                                <div className="me-md-2 mt-4 float-end ">
                                  <CButton
                                    type="button"
                                    className="me-md-2 "
                                    onClick={() => basicDetailsForm(3)}
                                    color="primary"
                                  >
                                    <CIcon size={"sm"} icon={cilArrowLeft} />
                                  </CButton>
                                  <CButton
                                    type="button"
                                    className="me-md-2 "
                                    onClick={() => basicDetailsForm(4)}
                                    color="primary"
                                  >
                                    <CIcon size={"sm"} icon={cilArrowRight} />
                                  </CButton>
                                </div>
                              </CCol>
                            </div>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCol>
                </CModalBody>
                <CModalFooter className="mt-4">
                  <input
                    type="hidden"
                    {...register("_id", customerOptions._id)}
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
                    deleteAction(customerData);
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

export default Customer;
