import { React, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const Register = () => {
  const [token, setToken] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const baseUrl = process.env.REACT_APP_API_URL;
  
  let navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onFormSubmit = (data) => {
    axios
      .post(baseUrl + "/register", data)
      .then((response) => {
        setToken(response.data.data.token);
        localStorage.setItem("token", response.data.data.token);
        toast.success(response.data.message ?? "Created Successfuly");
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 3000);
      })
      .catch((error) => {
        toast.error(error.message ?? "Created Successfuly");
      });
    console.log(data);
  };
  const onErrors = (errors) => console.error(errors);

  const [visible, setVisible] = useState(false);

  const registerOptions = {
    email: { required: "Email is required" },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must have at least 8 characters",
      },
    },
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CAlert
                  color="danger"
                  dismissible
                  visible={visible}
                  onClose={() => setVisible(false)}
                >
                  Please Check Validations
                </CAlert>
                <CForm onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                  <h1>Sign Up</h1>
                  <p className="text-medium-emphasis">Personal Information</p>

                  <CCol className="mb-3">
                    <CFormInput
                      placeholder="First Name"
                      autoComplete="first_name"
                      required
                      floatingLabel="First Name"
                      type="text"
                      {...register("first_name", {required:true})}
                    />
                    {errors.first_name && (
                      <div className="invalid-validation-css">
                        First Name is required
                      </div>
                    )}
                  </CCol>

                  
                  <CCol className="mb-3">
                    <CFormInput
                      placeholder="Last Name"
                      autoComplete="last_name"
                      required
                      floatingLabel="Last Name"
                      type="text"
                      {...register("last_name", {required:true})}
                    />
                    {errors.last_name && (
                      <div className="invalid-validation-css">
                        Last Name is required
                      </div>
                    )}
                  </CCol>

                  <CCol className="mb-3">
                    <CFormInput
                      placeholder="E-mail"
                      autoComplete="email"
                      required
                      floatingLabel="E-mail"
                      type="text"
                      {...register("email", {required:true})}
                    />
                    {errors.email && (
                      <div className="invalid-validation-css">
                        Email is required
                      </div>
                    )}
                  </CCol>

                  <CCol className="mb-3">
                    <CFormInput
                      placeholder="Password"
                      autoComplete="name"
                      required
                      floatingLabel="Password"
                      type="password"
                      {...register("password", {required:true})}
                    />
                    {errors.password && (
                      <div className="invalid-validation-css">
                        Password is required
                      </div>
                    )}
                  </CCol>

                  <CCol className="mb-3">
                    <CFormInput
                      placeholder="Confirm Password"
                      autoComplete="name"
                      required
                      floatingLabel="Confirm Password"
                      type="password"
                      {...register("password_confirmation", {required:true})}
                    />
                    {errors.password_confirmation && (
                      <div className="invalid-validation-css">
                        This field is required
                      </div>
                    )}
                  </CCol>

                  

                  <p className="text-medium-emphasis">Organization Details</p>
                  <CCol className="mb-3">
                    <CFormInput
                      type="text"
                      id="input_end_date"
                      floatingLabel="Organization name"
                      {...register("org_name", {
                        required: "Organization name is required",
                      })}
                    />
                    {errors.org_name && (
                      <div className="invalid-validation-css">
                        Organization name is required
                      </div>
                    )}
                  </CCol>

                  <CCol className="mb-3">
                    <CFormInput
                      type="text"
                      id="input_end_date"
                      floatingLabel="Organization email"
                      {...register("org_email", {
                        required: "Organization name is required",
                      })}
                    />
                    {errors.org_email && (
                      <div className="invalid-validation-css">
                        Organization email is required
                      </div>
                    )}
                  </CCol>

                  <div className="d-grid">
                    <CButton type="submit" color="success">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
