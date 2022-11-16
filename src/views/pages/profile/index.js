import { React, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ValidationAlert from "../../../components/Alerts/ValidationAlert"
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilPencil, cilTrash } from "@coreui/icons";
import { DocsExample } from "src/components";
import { Button } from "@coreui/coreui";
import axios from "axios";

const Profile = () => {
  const columns = ["#", "class", "Heading", "Heading"];
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false);
  const [delModal, setDelVisible] = useState(false);
  const [formAction, setFormAction] = useState("Add");
  const [data, setData] = useState({});
  const [categoryData, setCategory] = useState({});
  const [validationAlert, setValidationAlert] = useState(false);
  const [errorObjData, setErrorObj] = useState([]);

  const addForm = () => {
    reset({ sort: "", category_name: "", parent_id: "" });
    setFormAction("Add");
    setVisibleXL(true);
  };
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  /* Form */
  const onFormSubmit = (data) => {
    updateProfile(data);
  };

  const updateProfile = (postdata) => {
    //Adding roles 
    postdata.roles = data.roles ?? []
    axios.patch(process.env.REACT_APP_API_URL + "/users",
      postdata,
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        reload();
        toast.success("Profile Updated Successfully")
      })
      .catch((error, response) => {
        console.log(error);
        toast.error(response?.data.message ?? "Opps something went wrong!")
      })
  }


  const onErrors = (errors) => console.error(errors);


  /* Get Data */
  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    return await axios
      .get(process.env.REACT_APP_API_URL + "/profile", {
        headers: { Authorization: localStorage.getItem("token") ?? null },
      })
      .then((res) => {
        setData(res.data.data);
        onEdit(res.data.data)
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
    setFormAction("Update");
    setVisibleXL(!visibleXL);
    setValue("first_name", data.first_name);
    setValue("last_name", data.last_name);
    setValue("phone_number", data.phone_number);
    setValue("email", data.email);
    setValue("_id", data._id);
  };

  /* Delete  */
  const onDelete = (data) => {
    setCategory(data);
    setDelVisible(true);
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
        <>
          <div className="container rounded bg-white mt-5 mb-5">
            <div className="row">
              <div className="col-md-3 border-right">
                <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                  <img
                    className="rounded-circle mt-5"
                    width="150px"
                    src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                  />
                  <span className="font-weight-bold">{data.first_name} {data.last_name}</span>
                  <span className="text-black-50">mail:{data.email}</span>
                  <span className="text-black-50">phone:{data.phone_number}</span>
                  <span className="text-black-50">Role: </span>
                </div>
              </div>
              <div className="col-md-5 border-right">
                <div className="p-3 py-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-right">Profile Settings</h4>
                  </div>
                  <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                    <div className="row mt-2">
                      <div className="col-md-6">
                        <label className="labels">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="first name"
                          {...register("first_name", { required: true })}
                        />
                        {errors.first_name && (
                          <div className="invalid-validation-css">
                            This field is required
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="labels">Last name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Last name"
                          {...register("last_name", { required: true })}
                        />
                        {errors.last_name && (
                          <div className="invalid-validation-css">
                            This field is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <label className="labels">Mobile Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="enter phone number"
                          disabled
                          {...register("phone_number", { required: true })}
                        />
                      </div>
                      {/* <div className="col-md-12">
                        <label className="labels">Address Line 1</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="enter address line 1"
                          value=""
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="labels">Address Line 2</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="enter address line 2"
                          value=""
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="labels">Postcode</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="enter address line 2"
                          value=""
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="labels">State</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="enter address line 2"
                          value=""
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="labels">Area</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="enter address line 2"
                          value=""
                        />
                      </div> */}
                      <div className="col-md-12">
                        <label className="labels">Email ID</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="enter email id"
                          disabled
                          {...register("email", { required: true })}
                        />
                      </div>
                    </div>
                    <div className="mt-5 text-center">
                      <button
                        className="btn btn-primary profile-button"
                        type="submit"
                      >
                        Save Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 py-5">
                  <div className="d-flex justify-content-between align-items-center experience">
                    <span>Organization Details</span>
                    <span className="border px-3 p-1 add-experience">
                      <i className="fa fa-plus"></i>&nbsp;Details
                    </span>
                  </div>
                  <br />
                  <div className="col-md-12">
                    <label className="labels">Orgnization Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="experience"
                      disabled
                      value={data?.org_id?.name}
                    />
                  </div>
                  <br />
                  <div className="col-md-12">
                    <label className="labels">Organization Email</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="experience"
                      disabled
                      value={data?.org_id?.org_email}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </CCol>
    </CRow>
  );
};

export default Profile;
