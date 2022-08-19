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
  cilBell, cilPencil, cilTrash,
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
  const [categoryData, setCategory] = useState({});
  const [toast, setToast] = useState({ visible: false, color: "primary", message: "Oops something went wrong!" });
  const addForm = () => {
    reset({ sort: "", category_name: "", parent_id: "" });
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
    axios.post(process.env.REACT_APP_API_URL + "/Products",
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
    axios.patch(process.env.REACT_APP_API_URL + "/Products",
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
    axios.delete(process.env.REACT_APP_API_URL + "/Products",
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
      .get(process.env.REACT_APP_API_URL + "/Products", { headers: { Authorization: localStorage.getItem('token') ?? null } })
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
    setValue('name', data.name)
    setValue('qty', data.qty)
    setValue('status', data.status)
    setValue('cost', data.cost)
    setValue('sell_price', data.sell_price)
    setValue('_id', data._id)
  };

  /* Delete  */
  const onDelete = (data) => {
    setCategory(data);
    setDelVisible(true);
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
        <CButton color="info" onClick={() => { addForm() }} className="mb-4 text-white">Add Products</CButton>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Products</strong>
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
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Sku</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Qty</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cost</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.docs?.map((product, index) =>
                  <CTableRow key={product.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{product.name}</CTableDataCell>
                    <CTableDataCell>{product.sku}</CTableDataCell>
                    <CTableDataCell>{product.qty}</CTableDataCell>
                    <CTableDataCell>{product.cost}</CTableDataCell>
                    <CTableDataCell>{product.sell_price ?? 0.00}</CTableDataCell>
                    <CTableDataCell>{product.status}</CTableDataCell>
                    <CTableDataCell>
                      <CTooltip
                        content="Edit"
                        placement="top"
                      >
                        <CButton color="info" onClick={() => onEdit(product)} className="me-md-2"><CIcon className="text-white" size={'lg'} icon={cilPencil} /></CButton>
                      </CTooltip>
                      <CTooltip
                        content="Delete"
                        placement="top"
                      >
                        <CButton color="danger" onClick={() => onDelete(product)} className="me-md-2"><CIcon className="text-white" size={'lg'} icon={cilTrash} /></CButton>
                      </CTooltip>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {/* Modal start Here */}
            <CModal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)}>
              <CForm onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <CModalHeader>
                  <CModalTitle>{formAction} Products</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CCol xs={12}>
                    <CRow className="row g-3">
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" label="Name" {...register("name", options.name)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputPassword4" label="sku" {...register("sku", options.sku)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" label="Serial Numbers"  {...register("serial_number", options.serial_number)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="qty" label="Qty" {...register("qty", options.qty)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="cost" label="Cost Price" {...register("cost", options.cost)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="cost" label="Sell Price" {...register("sell_price", options.sell_price)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" label="Category">
                          <option>Choose...</option>
                          <option>...</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormInput id="inputCity" label="Units" />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" label="Vendor">
                          <option>Choose...</option>
                          <option>...</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect name='status' id="inputState" label="Status" {...register("status", options.status)}>
                          <option>Choose...</option>
                          <option>Active</option>
                          <option>In-Active</option>
                        </CFormSelect>
                      </CCol>

                      <CCol xs={12}>
                        <CFormTextarea rows="6" id="inputAddress" label="Description" {...register("description", options.description)} placeholder="Max 250 chars" ></CFormTextarea>
                      </CCol>
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
