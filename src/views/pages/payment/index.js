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
  CFormFloating
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell, cilPencil, cilTrash,
} from '@coreui/icons'
import { DocsExample } from 'src/components'
import { Button } from '@coreui/coreui';
import axios from 'axios';

const Payment = () => {
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false)
  const [delModal, setDelVisible] = useState(false)
  const [formAction, setFormAction] = useState('Add');
  const [data, setData] = useState([]);
  const [shipment, setShipment] = useState([]);
  const [categories, setCategory] = useState({});
  const [salesExecutives, setSalesExe] = useState({});
  const [vendors, setVendors] = useState({});
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
      console.log(page);
    }
  };

  const addForm = () => {
    resetForm()
    append({ product_id: "", qty: 0.00, rate: 0.00, amount: 0.00, });
    setFormAction('Add');
    setVisibleXL(true)
  }
  const { register, handleSubmit, reset, setValue, getValues, watch, control, formState: { errors } } = useForm({
    defaultValues: {
      items: [{ product_id: "", qty: 0.00, rate: 0.00, amount: 0.00, }]
    }
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
    axios.post(process.env.REACT_APP_API_URL + "/payment",
      { payload: data },
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

  const updateData = (data) => {

    data.package = shipmentData.package;
    data.sales_order = shipmentData.sales_order;

    axios.patch(process.env.REACT_APP_API_URL + "/payment",
      { payload: data },
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        reload();
        setVisibleXL(false) /* Close the Pop Here */
        toast.success(response.data.message ?? "Success")
      })
      .catch((error, response) => {
        console.log(response.data);
        toast.error(response.data.message ?? "Opps something went wrong!")
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
    axios.delete(process.env.REACT_APP_API_URL + "/payment",
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
    console.log(currentParams); // get new values onchange
    reload();
  }, [searchParams]);

  /* Get Data */
  useEffect(() => {
    reload();
  }, [])

  const reload = async () => {
    let page = searchParams.get('page') ?? 1
    return await axios
      .get(process.env.REACT_APP_API_URL + "/payment", { params: { page }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setData(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page
        console.log(data);
      }).catch((err) => {
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }


  /* Edit Form */
  const onEdit = (data) => {
    resetForm()
    setFormAction('Update');
    setShipmentData(data);
    console.log(data);
    // console.log(data.sales_executives.map((exe) => exe._id));
    setVisibleXL(!visibleXL);
    setValue('_id', data._id)
    setValue('invoice', data.invoice)
    setValue('reference', data.reference)
    setValue('payment_no', data.payment_no)
    setValue('payment_type', data.payment_type)
    setValue('payment_mode', data.payment_mode)
    setValue('amount', data.amount)
    setValue('deposit_to', data.deposit_to)
    setValue('status', data.status)
    setValue('payment_date', DateTime.fromISO(data.payment_date).toFormat('yyyy-MM-dd'))
    setValue('notes', data.notes)

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
        {/* <CButton color="info" onClick={() => { addForm() }} className="mb-4 text-white">Add Shipment</CButton> */}
        <CCard className="mb-4">
          <CCardHeader>
            Payments Received
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
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Payment Id </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Payment Mode</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Associated Invoice </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Shipment Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Remaining Due</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</  CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.docs?.map((product, index) =>
                  <CTableRow key={product.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>#{product.payment_no}</CTableDataCell>
                    <CTableDataCell>{product.payment_mode}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/invoice/${product.invoice}`} >#Inv Id</Link>
                    </CTableDataCell>
                    <CTableDataCell>{DateTime.fromISO(product.payment_date).toFormat('yyyy LLL dd')}</CTableDataCell>
                    <CTableDataCell>{product.amount}</CTableDataCell>
                    <CTableDataCell>{product.remaining_due}</CTableDataCell>
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
            <div className='mt-2 px-2 float-end'>
              <Pagination
                threeDots
                totalPages={data.totalPages}
                currentPage={data.page}
                showMax={7}
                prevNext
                activeBgColor="#fffff"
                activeBorderColor="#7bc9c9"
                href="http://localhost:3000/payment?page=*"
                pageOneHref="http://localhost:3000/payment"
              />
            </div>

            {/* Modal start Here */}
            <CModal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)} backdrop='static'>
              <CForm onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <CModalHeader>
                  <CModalTitle>{formAction} Payment </CModalTitle>
                </CModalHeader>
                <CModalBody>
                <CCol xs={12}>
                    <CRow className="row g-3 px-3 mx-2 py-5">
                      <ValidationAlert validate={{ visible: validationAlert, errorObjData }} />

                      <fieldset className="row mb-1">
                        <legend className="col-form-label col-sm-2 pt-0">Payment In</legend>
                        <CCol sm={10} >
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value="full_amount" label="Full amount" {...register("payment_type", { required: true })} />
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value="partial_amount" label="Partial amount" {...register("payment_type", { required: true })} />
                          {errors.payment_type && <div className='invalid-validation-css'>This field is required</div>}
                        </CCol>
                      </fieldset>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Payment No#" {...register("payment_no")} />
                        {errors.shipment_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Payment Mode"{...register("payment_mode")}>
                          <option value="">...</option>
                          <option>Cash</option>
                          <option>Bank Transfer</option>
                          <option>Cheque</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Reference No#" {...register("reference")} />
                        {errors.tracking_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputAmount" readOnly floatingLabel="Amount" {...register("amount")} />
                        {errors.tracking_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" floatingLabel="Payment Date" {...register("payment_date")} />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Payment Deposit to"{...register("deposit_to")}>
                          <option value="">...</option>
                          <option>Petty Cash</option>
                          <option>Undeposited Funds</option>
                          <option>Other Expense</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Payment Status"{...register("status")}>
                          <option value="">...</option>
                          <option>Completed</option>
                          <option>On-Hold</option>
                          <option>Cancelled</option>
                          <option>Refunded</option>
                        </CFormSelect>
                      </CCol>

                      <h5>Additional Information</h5>

                      <CCol md={12}>
                        <CFormTextarea id="cost_data" floatingLabel="Notes" style={{ height: '100px' }} {...register("notes")} rows="6">
                        </CFormTextarea>
                      </CCol>

                      <CCol md={12} className="mt-4">
                        <div className='float-end'>
                          <input type="hidden" {...register("invoice")}></input>
                          <input type="hidden"  {...register("_id")} ></input> 
                          <CButton type="submit" className="me-md-2" >Save & Continue </CButton>
                          <CButton type="button" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2" color="secondary" variant="ghost">Close</CButton>
                        </div>
                      </CCol>

                    </CRow>
                  </CCol>
                </CModalBody>
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

export default Payment
