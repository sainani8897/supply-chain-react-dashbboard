import { React, useRef, useState, useEffect, userRef } from "react";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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

const Login = () => {
  /* State Hook */

  const [token, setToken] = useState("");
  const { register, handleSubmit } = useForm();
  const baseUrl = process.env.REACT_APP_API_URL;
  const { setAuth } = useAuth();
  const { auth } = useAuth;

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');


  useEffect(() => {
    setErrMsg('');
  }, [user, pwd])

  let navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onFormSubmit = (data) => {
    return axios.post(baseUrl + "/login", data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })
      .then(({ data }) => {
        const token = "Bearer " + data.token
        setAuth({ user: data.user,token:data.token,auth:data });
        localStorage.setItem("token", token);
        localStorage.setItem("refresh_token", data.user.refresh_token);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message ?? error.message)
      })

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
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CAlert
                    color="danger"
                    dismissible
                    visible={visible}
                    onClose={() => setVisible(false)}
                  >
                    Invalid Logins
                  </CAlert>
                  <CForm onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">
                      Sign In to your account
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="example@example.com"
                        autoComplete="email"
                        required
                        type="email"
                        // onChange={()=>{setUsername(this.value)}}
                        name="email"
                        {...register("email", registerOptions.username)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                        {...register("password", registerOptions.password)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white bg-primary py-5"
                /* style={{ width: "44%" }} */
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Don't have account SignUp Here.
                    </p>
                    <Link to="/register">
                      <CButton
                        color="primary"
                        className="mt-3"
                        active
                        tabIndex={-1}
                      >
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
