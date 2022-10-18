import { React, useState, useEffect } from 'react'
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import ValidationAlert from '../../../components/Alerts/ValidationAlert'
import Pagination from "react-bootstrap-4-pagination";
import { useSearchParams,Link } from 'react-router-dom';
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

const Shipment = () => {
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false)
  const [delModal, setDelVisible] = useState(false)
  const [formAction, setFormAction] = useState('Add');
  const [data, setData] = useState([]);
  const [products, setPackages] = useState([]);
  const [categories, setCategory] = useState({});
  const [salesExecutives, setSalesExe] = useState({});
  const [vendors, setVendors] = useState({});
  const [packageData, setPackage] = useState({});
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
    axios.post(process.env.REACT_APP_API_URL + "/shipment",
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

    data.package = packageData.package;
    data.sales_order = packageData.sales_order;

    axios.patch(process.env.REACT_APP_API_URL + "/shipment",
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
    axios.delete(process.env.REACT_APP_API_URL + "/shipment",
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
    getProducts();
    getVendors();
    getUsers();
  }, [])

  const reload = async () => {
    let page = searchParams.get('page') ?? 1
    return await axios
      .get(process.env.REACT_APP_API_URL + "/shipment", { params: { page }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setData(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page
        console.log(data);
      }).catch((err) => {
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const getProducts = async () => {
    let page = searchParams.get('page') ?? 1
    return await axios
      .get(process.env.REACT_APP_API_URL + "/Products", { params: { page }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setPackages(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page
        console.log(data);
      }).catch((err) => {
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const getVendors = async () => {
    let page = searchParams.get('page') ?? 1
    return await axios
      .get(process.env.REACT_APP_API_URL + "/vendors", { params: { page }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setVendors(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page
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

  const getUsers = async () => {
    return await axios
      .get(process.env.REACT_APP_API_URL + "/users", { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setSalesExe(res.data.data);
        console.log(data);
      }).catch((err) => {
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const gerProductById = async (id, index) => {
    // const filter = {_id:id} 
    return await axios
      .get(process.env.REACT_APP_API_URL + "/Products", { params: { _id: id }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        const items = getValues('items');
        const product = res.data.data?.docs[0] ?? {};
        console.log(product, product.sell_price);

        // console.log(items);
        const item = items[index];

        let qty = 1
        let rate = !isNaN(product.sell_price) ? product.sell_price : 0.00
        let amount = !isNaN(qty * rate) ? qty * rate : 0.00

        setValue(`items.${index}.qty`, qty);
        setValue(`items.${index}.rate`, rate);
        setValue(`items.${index}.amount`, amount);
        setValue(`items.${index}.product._id`, id);
        subTotalCal();

      }).catch((err) => {
        console.error(err);
        // setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }


  function subTotalCal() {
    const items = getValues('items');
    let sub_total = 0;
    let total = 0;
    items.forEach(item => {
      console.log(item.amount);
      sub_total += item.amount;
    });
    total = sub_total;
    setValue('sale_details.sub_total', sub_total);
    setValue('sale_details.total', total)
  }


  const handleQtyChange = async (qty, index) => {
    const items = getValues('items');
    const item = items[index];
    let rate = !isNaN(item['rate']) ? item['rate'] : 0.00
    let amount = !isNaN(qty * rate) ? qty * rate : 0.00
    setValue(`items.${index}.amount`, amount);
    subTotalCal();
  }



  const handleSubTotal = async (qty, index) => {
    const items = getValues('items');
    const item = items[index];
    let rate = !isNaN(item['rate']) ? item['rate'] : 0.00
    let amount = !isNaN(qty * rate) ? qty * rate : 0.00
    items[index]['qty'] = qty;
    items[index]['rate'] = rate;
    items[index]['amount'] = amount;
    setValue('items', items);
  }

  /* Edit Form */
  const onEdit = (data) => {
    resetForm()
    setFormAction('Update');
    setPackage(data);
    // console.log(data.sales_executives.map((exe) => exe._id));
    setVisibleXL(!visibleXL);
    setValue('_id', data._id)
    setValue('package_slip', data.package_slip)
    setValue('status', data.status)
    setValue('date', DateTime.fromISO(data.date).toFormat('yyyy-MM-dd'))
    setValue('package_notes', data.package_notes)

  };

  /* Delete  */
  const onDelete = (data) => {
    setPackage(data);
    setDelVisible(true);
  }

  /* Reset Form */
  const resetForm = () => {
    setValidationAlert(false);
    setErrorObj([]);
    reset({});
  };

  const addRow = () => {
    append({ product_id: "", qty: 0.00, rate: 0.00, amount: 0.00, })
  }

  function removeItem(remInd) {
    const allItems = getValues('items');
    if (allItems.length <= 1) {
      return;
    }
    remove(remInd);
    subTotalCal()
    return true;
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
        <CButton color="info" onClick={() => { addForm() }} className="mb-4 text-white">Add Shipment</CButton>
        <CCard className="mb-4">
          <CCardHeader>
            Shipments
          </CCardHeader>
          <CCardBody>
            {/* <p className="text-medium-emphasis small">
              Using the most basic table CoreUI, here&#39;s how <code>&lt;CTable&gt;</code>-based
              tables look in CoreUI.
            </p> */}
            {/* <DocsExample href="components/table"> */}
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col"># Package Slip </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Associated Sales </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Shipment Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</  CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.docs?.map((product, index) =>
                  <CTableRow key={product.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>#{product.shipment_no}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/sales-pipeline/${product?.sales_order._id}`} >#{product?.sales_order?.order_no}</Link>
                    </CTableDataCell>
                    <CTableDataCell>{DateTime.fromISO(product.shipment_date).toFormat('yyyy LLL dd')}</CTableDataCell>
                    <CTableDataCell>{product?.sales_order?.sale_details.total}</CTableDataCell>
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
                href="http://localhost:3000/packages?page=*"
                pageOneHref="http://localhost:3000/packages"
              />
            </div>

            {/* Modal start Here */}
            <CModal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)}>
              <CForm onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <CModalHeader>
                  <CModalTitle>{formAction} Package </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CCol xs={12}>

                    {/* Show Package Form  */}
                    <CRow className="row g-3 px-3 mt-1 mb-5">
                      <ValidationAlert validate={{ visible: validationAlert, errorObjData }} />
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" disabled floatingLabel="Package Slip#" {...register("package_slip")} />
                        {errors.order_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" disabled floatingLabel="Date" {...register("date")} />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Packaging Status"{...register("status")}>
                          <option value="">...</option>
                          <option>Ready to Ship</option>
                          <option>Packed</option>
                          <option>Closed</option>
                          <option>Not Found</option>
                        </CFormSelect>
                      </CCol>
                      <h5>Items</h5>
                      {/* Product Info */}
                      <div className="container">
                        <div className="row clearfix">
                          <div className="col-md-12">
                            <table className="table table-bordered table-hover" id="tab_logic">
                              <thead>
                                <tr>
                                  <th className="text-center"> # </th>
                                  <th className="text-center"> Product </th>
                                  <th className="text-center"> .Pcs </th>
                                </tr>
                              </thead>
                              <tbody>
                                {packageData?.package?.map((element, index) => {
                                  return (
                                    <tr id='addr0'>
                                      <td>{index + 1}</td>
                                      <td>
                                        <div><b>ITEM: </b>{element.product_id?.name}</div>
                                        {/* <div>Qty:{element.qty}</div> */}
                                        <div><b>Rate: </b><span className='text-secondary'>{element.product_id?.sell_price}</span></div>
                                        <div><b>Description: </b><span className='text-secondary'>{element.product_id?.description}</span></div>
                                        <CFormInput type="hidden" id="inputPcs"  {...register(`package[${index}].product_id`)} />
                                      </td>
                                      <td>{element.pcs}</td>
                                    </tr>)
                                }
                                )}
                                <tr id='addr1'></tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {/* <div className="row clearfix">
                          <div className="col-md-12">
                            <button id="add_row" type='button' onClick={() => { addRow() }} className="btn btn-default pull-left">Add Row</button>
                            <button id='delete_row' type='button' onClick={() => { alert(2) }} className="float-end btn btn-default">Delete Row</button>
                          </div>
                        </div> */}
                      </div>

                      <h5>Additional Information</h5>

                      <CCol md={12}>
                        <CFormTextarea id="cost_data" floatingLabel="Package Notes" style={{ height: '100px' }} {...register("package_notes")} rows="6">
                        </CFormTextarea>
                      </CCol>

                      <CCol md={12} className="mt-4">
                        <div className='float-end'>
                          {/* <input type="hidden"  {...register("sales_order")} value={}></input> */}
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
                <CButton color="danger" onClick={() => { deleteAction(packageData) }} variant="ghost">Yes Continue</CButton>
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

export default Shipment
