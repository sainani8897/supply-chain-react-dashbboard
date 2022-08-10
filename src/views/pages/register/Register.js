import {React,useState} from 'react'
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
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios';

const Register = () => {

  const [token, setToken] = useState("");
  const { register, handleSubmit } = useForm();
  const baseUrl = "http://52.66.240.197/api/v1";
  const onFormSubmit = (data) => {
    axios.post(baseUrl+"/register",data)
    .then((response)=>{
      console.log(response);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
    })
    .catch((error)=>{
      setVisible(true);
    })
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
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                    <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                        placeholder="Fullname"
                        autoComplete="name"
                        required
                        type="name"
                        // onChange={()=>{setUsername(this.value)}}
                        name="name"
                        {...register("name", registerOptions.username)}
                      />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      @
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
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      name="password"
                      {...register("password", registerOptions.username)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      name="password_confirmation"
                      {...register("password_confirmation", registerOptions.username)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="success">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
