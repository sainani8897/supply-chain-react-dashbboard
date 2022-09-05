import { React, useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCplusplus,
  cilBell, cilPencil, cilPlus, cilTrash,
} from '@coreui/icons'
import { DocsExample } from 'src/components'
import { Button } from '@coreui/coreui';
import axios from 'axios';
import { render } from '@testing-library/react';

const Category = () => {
  const columns = ["#", "class", "Heading", "Heading"];
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false)
  const [delModal, setDelVisible] = useState(false)
  const [formAction, setFormAction] = useState('Add');
  const [data, setData] = useState([]);
  const [categoryData, setCategory] = useState({});
  const [toast, setToast] = useState({ visible: false, color: "primary", message: "Oops something went wrong!" });
  const addForm = () => {
    reset({ sort: "", category_name: "", parent_id: "" });
    setFormAction('Add');
    setVisibleXL(true)
  }
  const { register, handleSubmit, reset, setValue } = useForm();
  const [activeKey, setActiveKey] = useState(1);

  const [contactPersons, setContacts] = useState([{ saluation: "", fname: "", lname: '', email: "", phone: "" }]);

  /* Form */
  const onFormSubmit = (data) => {
    if (formAction == 'Add') {
      create(data);
    }
    else {
      updateData(data)
    }
  };


  const create = (data) => {
    axios.post(process.env.REACT_APP_API_URL + "/customers",
      { payload: data },
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        reset({ sort: "", category_name: "", parent_id: "" }); /* Empty the Form */
        setVisibleXL(false) /* Close the Pop Here */
        setToast({ visible: true, color: "success", message: response.data.message ?? "Success" }) /* Toast */
        reload();
      })
      .catch((error, response) => {
        console.log(response.data);
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const updateData = (data) => {
    axios.patch(process.env.REACT_APP_API_URL + "/customers",
      { payload: data },
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        reset({ sort: "", category_name: "", parent_id: "" }); /* Empty the Form */
        setVisibleXL(false) /* Close the Pop Here */
        setToast({ visible: true, color: "success", message: response.data.message ?? "Success" }) /* Toast */
        reload();
      })
      .catch((error, response) => {
        console.log(response.data);
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const onErrors = (errors) => console.error(errors);

  const customerOptions = {
    category_name: { required: "Category Title is required" },
    status: {
      required: "Status is required",
    },
    parent_id: {
      required: "Parent Id"
    },
    contact_persons:[
      {
        saluation:'',
        fname:'',
        lname:'',
        email:'',
        phone:'',
      },
    ]

  };

  const deleteAction = (data) => {
    axios.delete(process.env.REACT_APP_API_URL + "/customers",
      { headers: { Authorization: localStorage.getItem('token') ?? null }, data: { _id: [data._id] } })
      .then((response) => {
        /* Empty the Form */
        setDelVisible(false) /* Close the Pop Here */
        setToast({ visible: true, color: "success", message: response.data.message ?? "Deleted Successfully" }) /* Toast */
        reload();
      })
      .catch((error, response) => {
        console.log(response.data);
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  /* Get Data */
  useEffect(() => {
    reload();
  }, [])

  const reload = async () => {
    return await axios
      .get(process.env.REACT_APP_API_URL + "/customers", { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setData(res.data.data);
        console.log(data);
      }).catch((err) => {
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  /* Edit Form */
  const onEdit = (data) => {
    console.log(data);
    setFormAction('Update');
    setVisibleXL(!visibleXL);
    setValue('category_name', data.category_name)
    setValue('sort', data.sort)
    setValue('status', data.status)
    setValue('parent_id', data.parent_id)
    setValue('_id', data._id)
  };

  /* Delete  */
  const onDelete = (data) => {
    setCategory(data);
    setDelVisible(true);
  }

  /* Add More */
  function addMoreContactPersons() {
    // const cp = customerOptions.contact_persons
    // customerOptions.contact_persons = [...cp, { saluation: "", fname: "", lname: '' }]
    // console.log(customerOptions.contact_persons);
    setContacts([...contactPersons, { saluation: "", fname: "", lname: '' }]);
  }

  function removeContactPersonal(remInd) {
    const cps = contactPersons;
    console.log(remInd);
    if (contactPersons.length <=1) {
      return ;
    }
    const remEle = cps.filter(function (index,ele) {
      console.log(ele,remInd);
      return remInd !=  ele
    });
    console.log(cps);
    setContacts(remEle);
   
  }

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
        <CButton color="info" onClick={() => { addForm() }} className="mb-4 text-white">Add Customers</CButton>
        <CCard className="mb-4">
          <CCardHeader>
            Customers
          </CCardHeader>
          <CCardBody>
            {/* <p className="text-medium-emphasis small">
              Using the most basic table CoreUI, here&#39;s how <code>&lt;CTable&gt;</code>-based
              tables look in CoreUI.
            </p> */}
            {/* <DocsExample href="components/table"> */}
            <CTable hover>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Parent</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Slug</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.docs?.map((category, index) =>
                  <CTableRow key={category.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{category.category_name}</CTableDataCell>
                    <CTableDataCell>{category.parent_id ?? 'Root'}</CTableDataCell>
                    <CTableDataCell>{category.slug}</CTableDataCell>
                    <CTableDataCell>{category.status}</CTableDataCell>
                    <CTableDataCell>
                      <CTooltip
                        content="Edit"
                        placement="top"
                      >
                        <CButton color="info" onClick={() => onEdit(category)} className="me-md-2"><CIcon className="text-white" size={'lg'} icon={cilPencil} /></CButton>
                      </CTooltip>
                      <CTooltip
                        content="Delete"
                        placement="top"
                      >
                        <CButton color="danger" onClick={() => onDelete(category)} className="me-md-2"><CIcon className="text-white" size={'lg'} icon={cilTrash} /></CButton>
                      </CTooltip>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {/* Modal start Here */}
            <CModal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)}>
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
                  <CTabContent className='mt-4'>
                    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                      <CForm className="row g-3" onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                        <CCol md={3}>
                          <CFormSelect name='Customer Type' id="inputState" label="Customer type" {...register("customer_type", customerOptions.customer_type)}>
                            <option>Choose...</option>
                            <option>Business</option>
                            <option>Individual</option>
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormSelect name='saluation' id="inputState" label="Saluation" {...register("saluation", customerOptions.saluation)}>
                            <option>Choose...</option>
                            <option>Mr.</option>
                            <option>Mrs.</option>
                            <option>Ms.</option>
                            <option>Miss.</option>
                            <option>Dr.</option>
                          </CFormSelect>
                        </CCol>
                        <CCol md={3}>
                          <CFormInput type="text" name='first_name' id="inputFName4" label="Fisrt Name" {...register("first_name", customerOptions.first_name)} />
                        </CCol>
                        <CCol md={3}>
                          <CFormInput type="text" name='last_name' id="inputLName" label="Last Name" {...register("last_name", customerOptions.last_name)} />
                        </CCol>
                        {/* <CCol md={6}>
                          <CFormInput type="text" name='company_name' id="inputEmail4" label="Company Name" {...register("company_name", customerOptions.company_name)} />
                        </CCol> */}
                        <CCol md={6}>
                          <CFormInput type="text" name='display_name' id="inputEmail4" label="Display Name" {...register("display_name", customerOptions.display_name)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='email' id="inputEmail4" label="Email" {...register("email", customerOptions.email)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='phone' id="inputPhone4" label="Phone" {...register("phone", customerOptions.phone)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormSelect name='status' id="inputState" label="Status" {...register("status", customerOptions.status)}>
                            <option>Choose...</option>
                            <option>Active</option>
                            <option>In-Active</option>
                          </CFormSelect>
                        </CCol>
                      </CForm>
                    </CTabPane>


                    <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
                      <div className="row g-3">
                        {/*  <CCol md={6}>
                      <CFormSelect name='Customer Type' id="inputState" label="Customer type" {...register("customer_type", customerOptions.customer_type)}>
                        <option>Choose...</option>
                        <option>Business</option>
                        <option>Individual</option>
                      </CFormSelect>
                    </CCol> */}
                        <CCol md={6}>
                          <CFormInput type="text" name='pan' id="inputEmail4" label="PAN" {...register("pan", customerOptions.pan)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='gst' id="inputEmail4" label="GST" {...register("gst", customerOptions.gst)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="file" name='profile' id="inputProfile" label="Profile" {...register("profile", customerOptions.profile)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='alt_phone' id="inputPhone4" label="Alternative Phone" {...register("alt_phone", customerOptions.alt_phone)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='alt_email' id="inputPhone4" label="Alternative Email" {...register("alt_email", customerOptions.alt_email)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='whatsapp' id="inputPhone4" label="Whatsapp" {...register("whatsapp", customerOptions.whatsapp)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='instagram' id="inputPhone4" label="Instagram" {...register("instagram", customerOptions.instagram)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='twitter' id="twitter" label="Twitter" {...register("twitter", customerOptions.twitter)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" placeholder='Facebook URL' name='Facebok' id="facebok" label="Facebok" {...register("facebook", customerOptions.facebook)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" placeholder='https://www.example.com/' name='website_url' id="website_url" label="Website" {...register("facebook", customerOptions.website_url)} />
                        </CCol>
                      </div>
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
                      {/* Address Form */}
                      <div className="row g-3">
                        {/*  <CCol md={6}>
                      <CFormSelect name='Customer Type' id="inputState" label="Customer type" {...register("customer_type", customerOptions.customer_type)}>
                        <option>Choose...</option>
                        <option>Business</option>
                        <option>Individual</option>
                      </CFormSelect>
                    </CCol> */}
                        <h5>Billing Address</h5>
                        <CCol md={6}>
                          <CFormInput type="text" name='address_line1' id="inputAdd" label="Address Line 1" {...register("address_line1", customerOptions.pan)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='address_line2' id="inputAdd2" label="Address Line 2" {...register("address_line2", customerOptions.address_line2)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='city' id="inputCity" label="City" {...register("city", customerOptions.city)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='state' id="inputState" label="State" {...register("state", customerOptions.state)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='pincode' id="inputPin" label="Pincode" {...register("pincode", customerOptions.pincode)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='country' id="inputCountry" label="Country" {...register("country", customerOptions.country)} />
                        </CCol>

                        <hr className='mt-4 mb-4'></hr>

                        <h5>Shipping Address</h5>
                        <CCol md={6}>
                          <CFormInput type="text" name='ship_address_line1' id="inputAdd" label="Address Line 1" {...register("ship_address_line1", customerOptions.ship_address_line1)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='ship_address_line2' id="inputAdd2" label="Address Line 2" {...register("ship_address_line2", customerOptions.ship_address_line2)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='ship_city' id="inputship_City" label="sCity" {...register("ship_city", customerOptions.ship_city)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='ship_state' id="inputship_State" label="State" {...register("ship_state", customerOptions.ship_state)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='ship_pincode' id="inputPin" label="Pincode" {...register("ship_pincode", customerOptions.ship_pincode)} />
                        </CCol>
                        <CCol md={6}>
                          <CFormInput type="text" name='ship_country' id="inputship_Country" label="Country" {...register("ship_country", customerOptions.country)} />
                        </CCol>
                      </div>

                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="notes-tab" visible={activeKey === 4}>
                      <div className="row g-3">
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
                      </div>
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="contacts-tab" visible={activeKey === 5}>
                      <div id="placements">
                        <div className="row g-3">
                          <div className='pull-right'>
                            <CIcon size={'sm'} icon={cilPlus} />
                            <a href="javascript:void(0)" onClick={() => addMoreContactPersons()}>Add More</a>
                          </div>
                          {contactPersons?.map((element,index) => {
                            console.log(customerOptions);
                            return (
                              <div className="row g-3">
                                <CCol md={1}>
                                  <CFormSelect name={`saluation_${index}`} id="inputSal" label="Saluation" {...register("contact_saluation", customerOptions.contact_persons[index]?.saluation)} >
                                    <option>Choose...</option>
                                    <option>Mr.</option>
                                    <option>Mrs.</option>
                                    <option>Ms.</option>
                                    <option>Miss.</option>
                                    <option>Dr.</option>
                                  </CFormSelect>
                                </CCol>
                                <CCol md={2}>
                                  <CFormInput type="text" name={`contact_fname_${index}]`} id="inputPin" label="First name" {...register(`contact_fname[${index}]`, customerOptions.contact_persons[index]?.fname)} />
                                </CCol>
                                <CCol md={2}>
                                  <CFormInput type="text" name={`contact_lname[${index}]`} id="inputPin" label="Last name" {...register(`contact_lname[${index}]`, customerOptions.contact_persons[index]?.lname)} />
                                </CCol>
                                <CCol md={3}>
                                  <CFormInput type="text" name={`contact_email[${index}]`} id="inputPin" label="Email" {...register(`contact_email[${index}]`, customerOptions.contact_persons[index]?.email)} />
                                </CCol>
                                <CCol md={3}>
                                  <CFormInput type="text" name={`contact_phone[${index}]`} id="inputPin" label="Phone" {...register(`contact_phone[${index}]`, customerOptions.contact_persons[index]?.phone)} />
                                </CCol>
                                <CCol md={1}> <CButton type="button" onClick={() => removeContactPersonal(0)} className="me-md-4 " color="danger"><CIcon size={'sm'} icon={cilTrash} /></CButton></CCol>

                              </div>)
                          })}
                        </div>
                      </div>
                    </CTabPane>
                  </CTabContent>

                </CCol>

              </CModalBody>
              <CModalFooter className='mt-4'>
                <input type="hidden"  {...register("_id", customerOptions._id)}></input>
                <CButton type="submit" className="me-md-2" >Submit</CButton>
                <CButton type="button" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2" color="secondary" variant="ghost">Close</CButton>
              </CModalFooter>
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
                <CButton color="danger" onClick={() => { deleteAction(categoryData) }} variant="ghost">Yes Continue</CButton>
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

export default Category
