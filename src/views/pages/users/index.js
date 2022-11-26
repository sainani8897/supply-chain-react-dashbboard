import { React, useState, useEffect } from 'react'
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import ValidationAlert from '../../../components/Alerts/ValidationAlert'
import Pagination from "react-bootstrap-4-pagination";
import { useSearchParams, Link } from 'react-router-dom';
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
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell, cilPencil, cilTrash,
} from '@coreui/icons'
import { DocsExample } from 'src/components'
import { Button } from '@coreui/coreui';
import axios from 'axios';
import { doc } from 'prettier';

const Users = () => {
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false)
  const [delModal, setDelVisible] = useState(false)
  const [formAction, setFormAction] = useState('Add');
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState([]);
  const [shipmentData, setShipmentData] = useState({});
  const [errorObjData, setErrorObj] = useState([]);
  const [validationAlert, setValidationAlert] = useState(false)
  const [searchParams] = useSearchParams();
  const [addItems, setItems] = useState([{ product_id: "", qty: 0.00, rate: 0.00, amount: 0.00, }]);

  let paginationConfig = {
    totalPages: 1,
    currentPage: 1,
    showMax: 5,
    size: "sm",
    threeDots: true,
    prevNext: true,
    onClick: function (page) {
      // console.log(page);
    }
  };

  const addForm = () => {
    resetForm()
    append({ product_id: "", qty: 0.00, rate: 0.00, amount: 0.00, });
    setFormAction('Add');
    setVisibleXL(true)
  }
  const { register, handleSubmit, reset, setValue, getValues, watch, control, formState: { errors } } = useForm({
    defaultValues: {}
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "items", // unique name for your Field Array
  });
  const watchItems = watch("items");

  /* Form */
  const onFormSubmit = (data) => {
    if (formAction == 'Add') {
      create(data);
    }
    else {
      updateData(data)
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
    setErrorObj(err)
  }


  const create = (data) => {
    axios.post(process.env.REACT_APP_API_URL + "/users",
      data,
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        setVisibleXL(false) /* Close the Pop Here */
        reload();
        toast.success(response.data.message ?? "Success")
      })
      .catch((error) => {
        const data = error.response.data
        const errObj = data.error.errors;
        toast.error(error.response.data.message ?? "Opps something went wrong!")
        validationAlertPop({ err: error.response.data });
      })
  }

  const convertToSlug = (Text) => {
    return Text.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  const updateData = (data) => {
    axios.patch(process.env.REACT_APP_API_URL + "/users",
      data,
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        reload();
        setVisibleXL(false) /* Close the Pop Here */
        toast.success(response.data.message ?? "Success")
      })
      .catch((error, response) => {
        const data = error.response.data
        const errObj = data.error.errors;
        toast.error(error.response.data.message ?? "Opps something went wrong!")
        validationAlertPop({ err: error.response.data });
      })
  }

  const onErrors = (errors) => {
    validationAlertPop(errors);
  };

  const options = {
    name: { required: "Product name is required" },
    status: {
      required: "Status is required",
    },
    qty: {
      required: "In-Hand Qty is required"
    }
  };

  const deleteAction = (data) => {
    axios.delete(process.env.REACT_APP_API_URL + "/users",
      { headers: { Authorization: localStorage.getItem('token') ?? null }, data: { _id: [data._id] } })
      .then((response) => {
        toast.success(response.data.message ?? "Success")
        /* Empty the Form */
        setDelVisible(false) /* Close the Pop Here */
        reload();
      })
      .catch((error, response) => {
        toast.error(response.data.message ?? "Opps something went wrong!")
      })
  }

  useEffect(() => {
    const currentParams = Object.fromEntries([...searchParams]);
    reload();
  }, [searchParams]);

  /* Get Data */
  useEffect(() => {
    // reload();
    getRoles();
  }, [])

  const reload = async () => {
    let page = searchParams.get('page') ?? 1
    return await axios
      .get(process.env.REACT_APP_API_URL + "/users", { params: { page }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setData(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page
      }).catch((err) => {
        toast.error(error.response.data.message ?? err.message)
      })
  }


  /* Edit Form */
  const onEdit = (data) => {
    resetForm()
    setFormAction('Update');
    setShipmentData(data);
    setVisibleXL(!visibleXL);
    setValue('first_name', data.first_name)
    setValue('last_name', data.last_name)
    setValue('email', data.email)
    setValue('phone', data.phone_number)
    setValue('status', data.status)
    setValue('start_date', data.start_date)
    setValue('end_date', data.end_date)
    setValue('status', data.status)
    setValue('roles[]', data.roles.map((exe) => exe._id))
    setValue('_id', data._id)


  };

  /* Delete  */
  const onDelete = (data) => {
    setShipmentData(data);
    setDelVisible(true);
  }

  /* Reset Form */
  const resetForm = () => {
    setValidationAlert(false);
    setErrorObj([]);
    reset({});
  };

  /* Get Roles */
  const getRoles = async () => {
    let page = searchParams.get('page') ?? 1
    return await axios
      .get(process.env.REACT_APP_API_URL + "/roles", { params: { page,not_admin:true }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        const rolesData = res.data.data;
        setRoles(rolesData);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page
      }).catch((err) => {
        toast.error(err.response?.data?.message ?? err.message)
      })
  }

  const pluck = (arr, key) => arr.map(i => i[key]);



  return (
    <CRow>
      <CCol xs={12}>
        <CToast autohide={true} delay={2000} visible={toast.visible} color={toast.color} className="text-white align-items-center float-end" >
          <div className="d-flex">
            <CToastBody>{toast.message}</CToastBody>
            <CToastClose className="me-2 m-auto" />
          </div>
        </CToast>
      </CCol>

      <CCol xs={12}>
        <CButton color="info" onClick={() => { addForm() }} className="mb-4 text-white">Add User</CButton>
        <CCard className="mb-4">
          <CCardHeader>
            Users
          </CCardHeader>
          <CCardBody>
            {/* <p className="text-medium-emphasis small">
              Using the most basic table CoreUI, here&#39;s how <code>&lt;CTable&gt;</code>-based
              tables look in CoreUI.
            </p> */}
            {/* <div class="form-group  pull-right py-4">
              <input type="text" class="search form-control" placeholder="What you looking for?" />
            </div> */}
            {/* <DocsExample href="components/table"> */}
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell scope="col">.</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Phone </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Role </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.docs?.map((user, index) =>
                  <CTableRow key={user._id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{user.name}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.phone_number}</CTableDataCell>
                    <CTableDataCell>{pluck(user.roles, "display_text")?.map((role, key) => {
                      return (
                        <CBadge color="primary">{role}</CBadge>
                      );
                    })}</CTableDataCell>
                    <CTableDataCell>{user.status}</CTableDataCell>
                    <CTableDataCell>
                      <CTooltip
                        content="Edit"
                        placement="top"
                      >
                        <CButton color="info" onClick={() => onEdit(user)} className="me-md-2"><CIcon className="text-white" size={'lg'} icon={cilPencil} /></CButton>
                      </CTooltip>
                      <CTooltip
                        content="Delete"
                        placement="top"
                      >
                        <CButton color="danger" onClick={() => onDelete(user)} className="me-md-2"><CIcon className="text-white" size={'lg'} icon={cilTrash} /></CButton>
                      </CTooltip>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>

            </CTable>
            <div className='mt-2 px-2 float-end'>
              <Pagination
                threeDots
                totalPages={data.totalPages ?? 1}
                currentPage={data.page ?? 1}
                showMax={7}
                prevNext
                activeBgColor="#fffff"
                activeBorderColor="#7bc9c9"
                href="http://localhost:3000/users?page=*"
                pageOneHref="http://localhost:3000/users"
              />
            </div>

            {/* Modal start Here */}
            <CModal size="lg" visible={visibleXL} onClose={() => setVisibleXL(false)} backdrop='static'>
              <CForm onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <CModalHeader>
                  <CModalTitle>{formAction} User  </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CCol xs={12}>
                    <CRow className="row g-3 px-3 mx-2 py-5">
                      <ValidationAlert validate={{ visible: validationAlert, errorObjData }} />

                      <CCol md={6}>
                        <CFormInput type="text" id="fname" floatingLabel="First Name" {...register("first_name")} />
                        {errors.first_name && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>

                      <CCol md={6}>
                        <CFormInput type="text" id="lnmame" floatingLabel="Last Name" {...register("last_name")} />
                        {errors.last_name && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>

                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Email" {...register("email")} />
                        {errors.email && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>

                      <CCol md={6}>
                        <CFormInput type="text" id="inputphone4" floatingLabel="Phone" {...register("phone")} />
                        {errors.shipment_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>

                      {formAction == 'Add' ? (
                        <>
                          <CCol md={6}>
                            <CFormInput type="password" id="inputpassword4" floatingLabel="Password" {...register("password")} />
                            {errors.email && <div className='invalid-validation-css'>This field is required</div>}
                          </CCol>

                          <CCol md={6}>
                            <CFormInput type="password" id="inputconf_pass4" floatingLabel="Confirm Password" {...register("password_confirmation")} />
                            {errors.shipment_no && <div className='invalid-validation-css'>This field is required</div>}
                          </CCol>
                        </>
                      ) : ("")}


                      <CCol md={6}>
                        <CFormInput type="datetime-local" id="input_start_date" floatingLabel="Start Date" {...register("start_date")} />
                        {errors.email && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>

                      <CCol md={6}>
                        <CFormInput type="datetime-local" id="input_end_date" floatingLabel="End Date" {...register("start_date")} />
                        {errors.shipment_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>

                      <CCol md={6}>
                        <CFormSelect name='status' id="inputState" floatingLabel="Status" aria-label="Works with selects" {...register("status")}>
                          <option>Choose...</option>
                          <option>Active</option>
                          <option>In-Active</option>
                        </CFormSelect>
                      </CCol>

                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Roles" multiple {...register("roles[]", options.category_id)}>
                          <option value="">Choose...</option>
                          {roles.docs?.map((role, index) => {
                            return <option key={index} value={role._id}>{role.display_text}</option>
                          })};
                        </CFormSelect>
                      </CCol>





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
                <CModalFooter className='mt-4'>
                  <input type="hidden"  {...register("_id", options._id)}></input>
                  <CButton type="submit" className="me-md-2" >Submit</CButton>
                  <CButton type="button" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2" color="secondary" variant="ghost">Close</CButton>
                </CModalFooter>
              </CForm>
            </CModal>

            <CModal alignment="center" visible={delModal} onClose={() => setDelVisible(false)}>
              <CModalHeader>
                {/* <CModalTitle>Modal title</CModalTitle> */}
              </CModalHeader>
              <CModalBody className='text-center'>
                <CIcon size={'4xl'} icon={cilTrash} />
                {/* <CIcon icon={cilPencil} customClassName="nav-icon" /> */}
                <h3 className='mt-4 mb-4'>Are you Sure? </h3>
                <p>
                  Do you really want to delete these records? This process cannot be undone.
                </p>

              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setDelVisible(false)}>
                  Close
                </CButton>
                <CButton color="danger" onClick={() => { deleteAction(shipmentData) }} variant="ghost">Yes Continue</CButton>
              </CModalFooter>
            </CModal>

            {/* Modal ends Here  */}
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
