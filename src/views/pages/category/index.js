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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell, cilTrash,
} from '@coreui/icons'
import { DocsExample } from 'src/components'
import { Button } from '@coreui/coreui';
import axios from 'axios';

const Category = () => {
  const columns = ["#", "class", "Heading", "Heading"];
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false)
  const [delModal, setDelVisible] = useState(false)
  const [formAction, setFormAction] = useState('Add');
  const [data, setData] = useState([]);
  const [toast, setToast] = useState({ visible: false, color: "primary", message: "Oops something went wrong!" });
  const addForm = () => {
    setFormAction('Add');
    setVisibleXL(true)
  }
  const { register, handleSubmit, reset, setValue } = useForm();

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
    axios.post(process.env.REACT_APP_API_URL + "/categories",
      { payload: data },
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        reset({ sort: "", category_name: "", parent_id: "" }); /* Empty the Form */
        setVisibleXL(false) /* Close the Pop Here */
        setToast({ visible: true, color: "success", message: response.data.message ?? "Success" }) /* Toast */
      })
      .catch((error, response) => {
        console.log(response.data);
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const updateData = (data) => {
    axios.patch(process.env.REACT_APP_API_URL + "/categories",
      { payload: data },
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        reset({ sort: "", category_name: "", parent_id: "" }); /* Empty the Form */
        setVisibleXL(false) /* Close the Pop Here */
        setToast({ visible: true, color: "success", message: response.data.message ?? "Success" }) /* Toast */
      })
      .catch((error, response) => {
        console.log(response.data);
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const onErrors = (errors) => console.error(errors);

  const categoryOptions = {
    category_name: { required: "Category Title is required" },
    status: {
      required: "Status is required",
    },
    parent_id: {
      required: "Parent Id"
    }
  };

  /* Get Data */
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/categories", { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setData(res.data.data);
        console.log(data);
      }).catch((err) => {
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }, [])

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
    console.log(data);
    setDelVisible(true);
  }


  return (
    <CRow>
      <CCol xs={12}>
        <CToast autohide={true} delay={2000} visible={toast.visible} color={toast.color} className="text-white align-items-center float-end" >
          <div className="d-flex">
            <CToastBody>{toast.message}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      </CCol>

      <CCol xs={12}>
        <CButton color="info" onClick={() => { addForm() }} className="mb-4">Add Categories</CButton>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Categories</strong>
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
                      <CButton color="info" onClick={() => onEdit(category)} className="me-md-2">Edit</CButton>
                      <CButton color="danger" onClick={() => onDelete(category)} className="me-md-2">Delete</CButton>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {/* Modal start Here */}
            <CModal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)}>
              <CModalHeader>
                <CModalTitle>{formAction} Categories</CModalTitle>
              </CModalHeader>
              <CModalBody>

                <CCol xs={12}>


                  <CForm className="row g-3" onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                    <CCol md={6}>
                      <CFormInput type="text" name='category_name' id="inputEmail4" label="Title" {...register("category_name", categoryOptions.category_name)} />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput type="number" name='sort' id="inputPassword4" label="Sort Order" {...register("sort", categoryOptions.sort)} />
                    </CCol>
                    <CCol md={6}>
                      <CFormSelect name="parent_id" id="inputState" label="Parent" {...register("parent_id", categoryOptions.parent_id)}>
                        <option value="">Choose...</option>
                        {data.docs?.map((category, index) => {
                          return <option key={index} value={category._id}>{category.category_name}</option>
                        })};
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormSelect name='status' id="inputState" label="Status" {...register("status", categoryOptions.status)}>
                        <option>Choose...</option>
                        <option>Active</option>
                        <option>In-Active</option>
                      </CFormSelect>
                    </CCol>

                    <CCol xs={12} className="mt-4">
                      <input type="hidden"  {...register("_id", categoryOptions._id)}></input>
                      <CButton type="submit" className="me-md-2" >Submit</CButton>
                      <CButton type="button" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2" color="secondary" variant="ghost">Close</CButton>
                    </CCol>
                  </CForm>
                </CCol>

              </CModalBody>
            </CModal>

            <CModal alignment="center" visible={delModal} onClose={() => setDelVisible(false)}>
              <CModalHeader>
                <CModalTitle>Modal title</CModalTitle>
              </CModalHeader>
              <CModalBody className='text-center'>
              <CIcon icon={cilTrash} size="xl"/>
              {/* <CIcon icon={cilPencil} customClassName="nav-icon" /> */}
                <h5>Are you Sure?</h5>
                <p>
                 This Action cannot be undone!
                </p>
                
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setDelVisible(false)}>
                  Close
                </CButton>
                <CButton color="primary">Save changes</CButton>
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
