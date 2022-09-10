import { React, useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { toast }  from "react-toastify";
import ValidationAlert from '../../../components/Alerts/ValidationAlert'
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
  CFormFloating
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell, cilPencil, cilTrash,
} from '@coreui/icons'
import { DocsExample } from 'src/components'
import { Button } from '@coreui/coreui';
import axios from 'axios';

const Product = () => {
  const columns = ["#", "class", "Heading", "Heading"];
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false)
  const [delModal, setDelVisible] = useState(false)
  const [formAction, setFormAction] = useState('Add');
  const [data, setData] = useState([]);
  const [categories, setCategory] = useState({});
  const [productData, setProduct] = useState({});
  const [errorObjData, setErrorObj] = useState([]);
  const [validationAlert, setValidationAlert] = useState(false)

  const addForm = () => {
    resetForm()
    setFormAction('Add');
    setVisibleXL(true)
  }
  const { register, handleSubmit, reset, setValue , formState: { errors } } = useForm();

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
    axios.post(process.env.REACT_APP_API_URL + "/Products",
      { payload: data },
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        setVisibleXL(false) /* Close the Pop Here */
        reload();
        toast.success(response.data.message ?? "Success" )
      })
      .catch((error) => {
        const data = error.response.data
        const errObj = data.error.errors;
        toast.error(error.response.data.message ?? "Opps something went wrong!" )
        validationAlertPop({ err: error.response.data });
      })
  }

  const updateData = (data) => {
    axios.patch(process.env.REACT_APP_API_URL + "/Products",
      { payload: data },
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        reload();
        setVisibleXL(false) /* Close the Pop Here */
        toast.success(response.data.message ?? "Success" )
      })
      .catch((error, response) => {
        console.log(response.data);
        toast.error(response.data.message ?? "Opps something went wrong!" )
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
    axios.delete(process.env.REACT_APP_API_URL + "/Products",
      { headers: { Authorization: localStorage.getItem('token') ?? null }, data: { _id: [data._id] } })
      .then((response) => {
        toast.success(response.data.message ?? "Success" )
        /* Empty the Form */
        setDelVisible(false) /* Close the Pop Here */
        reload();
      })
      .catch((error, response) => {
        toast.error(response.data.message ?? "Opps something went wrong!" )
      })
  }

  /* Get Data */
  useEffect(() => {
    reload();
    getCategory();
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

  const getCategory = async () => {
    return await axios
      .get(process.env.REACT_APP_API_URL + "/categories", { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setCategory(res.data.data);
        console.log(data);
      }).catch((err) => {
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }


  /* Edit Form */
  const onEdit = (data) => {
    resetForm()
    console.log(data);
    setFormAction('Update');
    setVisibleXL(!visibleXL);
    setValue('name', data.name)
    setValue('qty', data.qty)
    setValue('status', data.status)
    setValue('cost', data.cost)
    setValue('sell_price', data.sell_price)
    setValue('brand', data.brand)
    setValue('length', data.length)
    setValue('height', data.height)
    setValue('weight', data.weight)
    setValue('width', data.width)
    setValue('weight_unit', data.weight_unit)
    setValue('dimension_unit', data.dimension_unit)
    setValue('category_id', data.category_id)
    setValue('isbn', data.isbn)
    setValue('ean', data.ean)
    setValue('upc', data.upc)
    setValue('manufacturer', data.manufacturer)
    setValue('serial_number', data.serial_number)
    setValue('description', data.description)
    setValue('sku', data.sku)
    setValue('units_of_measurement', data.units_of_measurement)
    setValue('type', data.type)
    setValue('_id', data._id)
  };

  /* Delete  */
  const onDelete = (data) => {
    setProduct(data);
    setDelVisible(true);
  }

  /* Reset Form */
  const resetForm = () => {
    setValidationAlert(false);
    setErrorObj([]);
    reset({});
  };


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
            Products
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
                    <CRow className="row g-3 px-3 mt-1 mb-5">
                      <ValidationAlert validate={{visible:validationAlert,errorObjData}} />
                      <fieldset className="row mb-1">
                        <legend className="col-form-label col-sm-2 pt-0">Item Type</legend>
                        <CCol sm={10} >
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value="product" label="Product" {...register("type",{required:true})} />
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value="service" label="Service" {...register("type",{required:true})} />
                          {errors.type && <div className='invalid-validation-css'>This field is required</div>}
                        </CCol>
                      </fieldset>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Name" {...register("name", options.name)} />
                        {errors.name && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputPassword4" floatingLabel="sku" {...register("sku", options.sku)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Units of Measurement" {...register("units_of_measurement")}>
                          <option value="">--Units--</option>
                          <option value="box">Box</option>
                          <option value="pcs">Pcs</option>
                          <option value="dz">Dozens</option>
                          <option value='cm'>Cm</option>
                          <option value='km'>Kilometers</option>
                          <option value='kg'>Kilograms</option>
                          <option value='gms'>grams</option>
                          <option value='ltrs'>Liters</option>
                          <option value='mg'>miligrams</option>
                          <option value='m'>meters</option>
                          <option value='lbs'>pounds</option>
                          <option value='mi'>miles</option>
                          <option value='ft'>feet</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Eligible for retrun" {...register("is_returnable")}>
                          <option value="">Choose..</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>

                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Vendor">
                          <option>Choose...</option>
                          <option>...</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Category" {...register("category_id", options.category_id)}>
                          <option value="">Choose...</option>
                          {categories.docs?.map((category, index) => {
                            return <option key={index} value={category._id}>{category.category_name}</option>
                          })};
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Track Inventory" {...register("track_inventory")}>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect name='status' id="inputState" floatingLabel="Status" aria-label="Works with selects" {...register("status", options.status)}>
                          <option>Choose...</option>
                          <option>Active</option>
                          <option>In-Active</option>
                        </CFormSelect>
                      </CCol>

                      <CCol xs={12}>
                        <CFormTextarea rows="6" id="inputAddress" floatingLabel="Description" {...register("description", options.description)} style={{ height: '200px' }} placeholder="Max 250 chars" ></CFormTextarea>
                      </CCol>

                      <h5>Dimensions</h5>
                      <CCol md={2}>
                        <CFormInput type="number" id="dimesion_length" floatingLabel="Length"  {...register("length", options.length)} />
                      </CCol>

                      <CCol md={2}>
                        <CFormInput type="number" id="dimesion_height" floatingLabel="Width"  {...register("height", options.height)} />
                      </CCol>
                      <CCol md={2}>
                        <CFormInput type="number" id="dimesion_width" floatingLabel="Height"  {...register("width", options.width)} />
                      </CCol>
                      <CCol md={3}>
                        <CFormSelect name='status' id="inputState" floatingLabel="units" {...register("dimension_unit", options.dimension_unit)}>
                          <option>cm</option>
                          <option>inc</option>
                          <option>m</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormInput type="number" id="dimesion_width" floatingLabel="Weight"  {...register("width", options.weight)} />
                      </CCol>
                      <CCol md={2}>
                        <CFormSelect name='status' id="inputState" floatingLabel="units" {...register("weight_unit", options.weight_unit)}>
                          <option>cm</option>
                          <option>inc</option>
                          <option>m</option>
                        </CFormSelect>
                      </CCol>
                      
                      <h5>Item Information</h5>

                      <CCol md={6}>
                        <CFormInput type="text" id="brand" floatingLabel="Brand"  {...register("brand", options.brand)} />
                      </CCol>

                      <CCol md={6}>
                        <CFormInput type="text" id="manufacture" floatingLabel="Manufacturer"  {...register("manufacturer", options.manufacturer)} />
                      </CCol>
                      
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Serial Numbers (MPN)"  {...register("serial_number", options.serial_number)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="upc" floatingLabel="UPC"  {...register("upc", options.upc)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="ean" floatingLabel="EAN"  {...register("ean", options.ean)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="isbn" floatingLabel="ISBN"  {...register("isbn", options.isbn)} />
                      </CCol>

                      <h5>Sales & Purshase Information</h5>

                      <CCol md={6}>
                        <CFormInput type="text" id="cost" floatingLabel="Sell Price" {...register("sell_price", options.sell_price)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="cost" floatingLabel="Cost Price" {...register("cost", options.cost)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="qty" floatingLabel="Qty" {...register("qty", options.qty)} />
                      </CCol>
                     
                      <CCol md={6}>
                        <CFormInput id="inputCity" floatingLabel="Units" />
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
                <CButton color="danger" onClick={() => { deleteAction(productData) }} variant="ghost">Yes Continue</CButton>
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

export default Product
