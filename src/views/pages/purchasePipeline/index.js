import { React, useState, useEffect } from 'react'
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import ValidationAlert from '../../../components/Alerts/ValidationAlert'
import Pagination from "react-bootstrap-4-pagination";
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { DateTime } from "luxon";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCardText,
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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CAlert,
  CAlertHeading,
  CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell, cilPencil, cilTrash,
} from '@coreui/icons'
import { DocsExample } from 'src/components'
import { Button } from '@coreui/coreui';
import axios from 'axios';

const PurchasePipeline = () => {
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false)
  const [showBillModal, setBillModal] = useState(false)
  const [delModal, setDelVisible] = useState(false)
  const [formAction, setFormAction] = useState('Add');
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategory] = useState({});
  const [salesExecutives, setSalesExe] = useState({});
  const [vendors, setVendors] = useState({});
  const [order, setOrder] = useState({});
  const [packageData, setPackage] = useState(null);
  const [shipmentData, setShipment] = useState(null);
  const [invoiceData, setInvoice] = useState(null);
  const [errorObjData, setErrorObj] = useState([]);
  const [validationAlert, setValidationAlert] = useState(false)
  const [searchParams] = useSearchParams();
  const [addItems, setItems] = useState([{ product_id: "", qty: 0.00, rate: 0.00, amount: 0.00, }]);
  const [activeKey, setActiveKey] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageTab, setpackageTab] = useState(false)
  const [shipmentTab, setShipmentTab] = useState(false)
  const [invoiceTab, setInvoiceTab] = useState(false)
  const [packageItems, setPackageItems] = useState({});

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

  const { register: register2, formState: { errors: errors2 }, handleSubmit: handleSubmit2,setValue:setValue2 } = useForm({});


  const { register: register3, formState: { errors: errors3 }, handleSubmit: handleSubmit3,setValue:setValue3 } = useForm({});


  

  const watchItems = watch("items");

  /* Form */
  const onFormSubmit = (data) => {
    updateData(data)
  };

  /* Package Form */
  const onBillSubmit = (data) => {
    createBill(data);
  };

  /* Shipping Form */
  const onReceive = ({ receive }) => {
    createReceivables(receive);
  };

  /* Payment Form */
  const onPaymentSubmit = ({ payment }) => {
    console.log(payment);
    createPayment(payment);
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
    axios.post(process.env.REACT_APP_API_URL + "/purchase-order",
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


  const createBill = ({ bill }) => {
    axios.post(process.env.REACT_APP_API_URL + "/bills",
      { payload: bill },
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        setActiveKey(4);
        setBillModal(false);
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

  const createReceivables = (data) => {
    let method = 'post'
    if (data?._id) {
      method = 'patch'
    }
    const headers = { Authorization: localStorage.getItem('token') ?? null }
    axios({
      method,
      url: process.env.REACT_APP_API_URL + "/receivables",
      data: { payload: data },
      headers: headers
    })
      .then((response) => {
        getShipmentData({ sales_order: id });
        toast.success(response.data.message ?? "Success")
        setActiveKey(4);
      })
      .catch((error) => {
        toast.error(error.message ?? "Opps something went wrong!")
      })
  }

  const createPayment = (data) => {
    console.log(data);
    let method = 'post'
    if (data?._id) {
      method = 'patch'
    }
    const headers = { Authorization: localStorage.getItem('token') ?? null }
    axios({
      method,
      url: process.env.REACT_APP_API_URL + "/payment",
      data: { payload: data },
      headers: headers
    })
      .then((response) => {
        getShipmentData({ sales_order: id });
        toast.success(response.data.message ?? "Success")
        setActiveKey(4);
      })
      .catch((error) => {
        toast.error(error.response.data.message ?? "Opps something went wrong!")
        validationAlertPop({ err: error.response.data });
      })
  }

  const updateData = (data) => {
    axios.patch(process.env.REACT_APP_API_URL + "/purchase-order",
      { payload: data },
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        toast.success('Saved Successfully!')
        setpackageTab(false);
        setActiveKey(2);

      })
      .catch((error, response) => {
        toast.error(response.data.message ?? "Opps something went wrong!")
      })
  }

  const updatePackage = (data) => {
    axios.patch(process.env.REACT_APP_API_URL + "/packages",
      { payload: data },
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        toast.success('Saved Successfully!')
        setpackageTab(false);
        setActiveKey(2);

      })
      .catch((error, response) => {
        toast.error(response.data.message ?? "Opps something went wrong!")
      })
  }

  const getBillsData = (data) => {
    axios.get(process.env.REACT_APP_API_URL + "/receivables", { params: { purchase_order: id }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        setPackage(response.data.data?.docs[0] ?? null);
      })
      .catch((error) => {
        toast.error("Opps something went wrong!")
      })
  }


  const getInvoice = (data) => {
    axios.get(process.env.REACT_APP_API_URL + "/bills", { params: { purchase_order: id }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        setInvoice(response.data.data?.docs[0] ?? null);
        console.log(invoiceData);
      })
      .catch((error) => {
        toast.error("Opps something went wrong!")
      })
  }

  const onErrors = (errors) => {
    validationAlertPop(errors);
  };

  const onPackageErrors = (errors) => {
    validationAlertPop(errors);
  };

  const onShippingErrors = (errors) => {
    console.log(errors);
    validationAlertPop(errors);
  };

  const onPaymentErrors = (errors) => {
    validationAlertPop(errors);
  };

  const onBillErrors = (errors) => {
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
    axios.delete(process.env.REACT_APP_API_URL + "/purchase-order",
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
    reload();
    getProducts();
    getVendors();
    getUsers();
    getOrder(id);

  }, [])


  useEffect(() => {
    if (shipmentData != null) {
      shipmentData.shipment_date = DateTime.fromISO(shipmentData.shipment_date).toFormat('yyyy-MM-dd');
      setValue("shipment", shipmentData)
    }
  }, [shipmentData]);

  const reload = async () => {
    let page = searchParams.get('page') ?? 1
    return await axios
      .get(process.env.REACT_APP_API_URL + "/purchase-order", { params: { page }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setData(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page
      }).catch((err) => {
        // setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const getProducts = async () => {
    let page = searchParams.get('page') ?? 1
    return await axios
      .get(process.env.REACT_APP_API_URL + "/Products", { params: { page }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setProducts(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page
      }).catch((err) => {
        // setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
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
      }).catch((err) => {
        // setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const getUsers = async () => {
    return await axios
      .get(process.env.REACT_APP_API_URL + "/users", { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setSalesExe(res.data.data);
      }).catch((err) => {
        // setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const getProductById = async (id, index) => {
    // const filter = {_id:id} 
    return await axios
      .get(process.env.REACT_APP_API_URL + "/Products", { params: { _id: id }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        const items = getValues('items');
        const product = res.data.data?.docs[0] ?? {};
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

  const getOrder = async (id, index) => {
    return await axios
      .get(process.env.REACT_APP_API_URL + "/purchase-order", { params: { _id: id }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        if (res.data.status === 404)
          return navigate('/404')
        const order = res.data.data?.docs[0] ?? {};
        onOrder(order)
        setOrder(order);
      }).catch((err) => {
        console.error(err);
        return navigate('/500');
      })
  }


  function subTotalCal() {
    const items = getValues('items');
    let sub_total = 0;
    let total = 0;
    items.forEach(item => {
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
  const onOrder = (data) => {
    resetForm()
    setValue('vendor_id', data.vendor_id._id)
    setValue('order_no', data.order_no)
    setValue('status', data.status)
    setValue('reference', data.reference)
    setValue('sale_date', DateTime.fromISO(data.sale_date).toFormat('yyyy-MM-dd'))
    setValue('delivery_date', DateTime.fromISO(data.delivery_date).toFormat('yyyy-MM-dd'))
    data.items.forEach((item, index) => {
      append({ product_id: item.product_id, qty: item.qty, rate: item.rate, amount: item.amount })
    })
    setValue2('bill.items',data.items);
    setValue('shipment_type', data.shipment_type)
    setValue('sale_details', data.sale_details)
    setValue2('bill.sale_details', data.sale_details)
    setValue('notes', data.customer_notes)
    setValue('shipping_notes', data.shipping_notes)
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
    setValue('package', data.items);

    /* Set Items */
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

  /* Handle Submit */
  const handleBills = () => {
    getInvoice({ purchase_order: id });
    setActiveKey(2);
  }

  /* Handle Receviables */
  const hanldeReceivables = () => {
    getBillsData({ purchase_order: id });
    setActiveKey(3);
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

        <CCard className="mb-4">
          <CCardHeader>
            <CNav variant="pills" className="card-header-pills" layout="fill" role="tablist">
              <CNavItem>
                <CNavLink
                  href="#!"
                  active={activeKey === 1}
                  onClick={() => setActiveKey(1)}
                >
                  Purchase Order
                </CNavLink>
              </CNavItem>

              <CNavItem>
                <CNavLink
                  href="#!"
                  active={activeKey === 2}
                  onClick={() => handleBills()}
                  disabled={invoiceTab}
                >
                  Bills
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="#!"
                  active={activeKey === 3}
                  onClick={() => hanldeReceivables()}
                  disabled={packageTab}
                >
                  Purchase Received
                </CNavLink>
              </CNavItem>
            </CNav>
          </CCardHeader>
          <CCardBody>

            <CTabContent className="mt-4">
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
                <CForm onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                  <CCol xs={12}>
                    <CRow className="row g-3 px-3 mt-1 mb-5">
                      {/* <ValidationAlert validate={{ visible: validationAlert, errorObjData }} /> */}
                      {/* <fieldset className="row mb-1">
                        <legend className="col-form-label col-sm-2 pt-0">Item Type</legend>
                        <CCol sm={10} >
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value="product" label="Product" {...register("type",{required:true})} />
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value="service" label="Service" {...register("type",{required:true})} />
                          {errors.type && <div className='invalid-validation-css'>This field is required</div>}
                        </CCol>
                      </fieldset> */}
                      <CCol md={6}>
                        <CFormSelect id="inputState" disabled floatingLabel="Vendor" {...register("vendor_id", options.vendor_id)}>
                          <option value="">...</option>
                          {vendors.docs?.map((vendor, index) => {
                            return <option key={index} value={vendor._id}>{vendor.display_name}</option>
                          })};
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" disabled floatingLabel="Purchase Order#" {...register("order_no", options.order_no)} />
                        {errors.order_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" disabled floatingLabel="Reference#" {...register("reference", options.reference)} />
                        {errors.reference && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" disabled floatingLabel="Purchase Order Date" {...register("sale_date", options.sale_date)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" disabled floatingLabel="Expected Delivery Date" {...register("delivery_date", options.delivery_date)} />
                      </CCol>

                      {/* <CCol md={6}>
                        <CFormSelect id="inputState" multiple floatingLabel="Sales Executive" {...register("sales_executives[]", options.sales_executive)}>
                          <option value="">...</option>
                          {salesExecutives.docs?.map((user, index) => {
                            return <option key={index} value={user._id}>{user.name}</option>
                          })};
                        </CFormSelect>
                      </CCol> */}

                      <CCol md={6}>
                        <CFormSelect id="inputState" disabled floatingLabel="Shipment type" {...register("shipment_type", options.sales_executive)}>
                          <option value="">...</option>
                          <option value="manual">Manual</option>
                          <option value="Easy Post">Easy Post</option>
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
                                  <th className="text-center"> Qty </th>
                                  <th className="text-center"> Price </th>
                                  <th className="text-center"> Total </th>
                                </tr>
                              </thead>
                              <tbody>
                                {fields?.map((element, index) => {
                                  return (
                                    <tr id='addr0'>
                                      <td>{index + 1}</td>
                                      <td>
                                        <CFormSelect disabled className="form-control" key={index} id="inputState"  {...register(`items[${index}].product_id`)} onChange={(e) => { gerProductById(e.target.value, index) }} >
                                          <option value="">... Select Product ...</option>
                                          {products.docs?.map((product, index) => {
                                            return <option key={index} value={product._id}>{product.name}</option>
                                          })};
                                        </CFormSelect>
                                      </td>
                                      <td><CFormInput disabled type="number" id="inputPassword4"  {...register(`items[${index}].qty`)} onChange={(e) => { handleQtyChange(e.target.value, index) }} /></td>
                                      <td><CFormInput disabled type="number" id="inputPassword4"  {...register(`items[${index}].rate`)} readOnly /></td>
                                      <td><CFormInput disabled type="number" id="inputPassword4"  {...register(`items[${index}].amount`)} readOnly /></td>
                                    </tr>)
                                }
                                )}
                                <tr id='addr1'></tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="row clearfix" style={{ marginTop: "20px" }} > {/* style={"margin-top:20px"} */}
                          <div className="col-md-4">
                            <table className="table table-bordered table-hover" id="tab_logic_total">
                              <tbody>
                                <tr>
                                  <th className="text-center">Sub Total</th>
                                  <td className="text-center">
                                    <input type="text" disabled placeholder='0.00' className="form-control" id="sub_total" readOnly {...register(`sale_details.sub_total`)} />
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-center">Tax</th>
                                  <td className="text-center"><div className="input-group mb-2 mb-sm-0">
                                    <input type="text" className="form-control" id="tax" disabled placeholder="0" {...register(`sale_details.tax_id`)} />
                                    <div className="input-group-addon">%</div>
                                  </div></td>
                                </tr>
                                <tr>
                                  <th className="text-center">Tax Amount</th>
                                  <td className="text-center">
                                    <input type="text" {...register(`sale_details.tax_amount`)} id="tax_amount" disabled placeholder='0.00' className="form-control" readOnly />
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-center">Grand Total</th>
                                  <td className="text-center"><input type="text" name='total_amount' id="total_amount" disabled placeholder='0.00' className="form-control" readOnly {...register(`sale_details.total`)} /></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <h5>Additional Information</h5>

                      <CCol md={6}>
                        <CFormTextarea id="cost_data" floatingLabel="Customer Notes" style={{ height: '100px' }} {...register("notes", options.notes)} rows="6">
                        </CFormTextarea>
                      </CCol>
                      <CCol md={6}>
                        <CFormTextarea id="cost_data" floatingLabel="Shipping Notes" style={{ height: '100px' }} {...register("shipping_notes", options.notes)} rows="6">
                        </CFormTextarea>
                      </CCol>

                      <CCol md={12} className="mt-4">
                        <div className='float-end'>
                          <input type="hidden"  {...register2("_id")}></input>
                          <CButton type="submit" className="me-md-2" >Save & Continue </CButton>
                          {/* <CButton type="button" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2" color="secondary" variant="ghost">Close</CButton> */}
                        </div>
                      </CCol>


                    </CRow>
                  </CCol>
                </CForm>
              </CTabPane>

              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 2}>
                <div className='mt-5 px-2'>

                  {!invoiceData ?

                    /* create invoice  */
                    (<div className="container py-4">
                      <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col">

                          <div className="card card-stepper" style={{ borderRadius: "10px" }} >
                            <div className="card-body p-4">

                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column">
                                  <span className="lead fw-normal">P.O: #{order.order_no}</span>
                                  <span className="text-muted small">{DateTime.fromISO(order.sale_date).toFormat('dd LLL , yyyy')}</span>
                                </div>
                                <div className="d-flex flex-column">
                                  <span className="lead fw-normal">Delivery Expected On</span>
                                  <span className="text-muted small">{DateTime.fromISO(order.delivery_date).toFormat('dd/MM/yyyy')}</span>
                                </div>
                                <div><span>Status:<strong> {order.status}</strong></span></div>
                                <div>
                                  <button className="btn btn-outline-primary mx-2" onClick={() => { setBillModal(true) }} type="button">Convert to Invoice</button>
                                  {/* <button className="btn btn-outline-primary" type="button">Make Payment</button> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>)

                    :
                    (
                      <div className="container">
                        <div className="row d-flex justify-content-center align-items-center h-100 mb-4">
                          <div className="col">

                            <div className="card card-stepper" style={{ borderRadius: "10px" }} >
                              <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex flex-column">
                                    <span className="lead fw-normal"> #{invoiceData.bill_no}</span>
                                    <span className="text-muted small">{DateTime.fromISO(invoiceData.bill_date).toFormat('dd LLL , yyyy')}</span>
                                  </div>
                                  <div className="d-flex flex-column">
                                    <span className="fw-normal">Balace: <strong>${invoiceData.sale_details.total}</strong></span>
                                    <span className="text-muted small">Due on {DateTime.fromISO(invoiceData.due_date).toFormat('dd/LLL/yyyy')}</span>
                                  </div>
                                  <div className="d-flex flex-column">
                                    <span className="fw-normal">Payment</span>
                                    <CBadge color={invoiceData.payment == 'Paid' ? 'success' : 'warning'}>{invoiceData.payment}</CBadge>
                                  </div>
                                  <div>
                                    {invoiceData.payment == "Paid" ? ('') : (<button className="btn btn-outline-primary" onClick={() => { setVisibleXL(true) }} type="button">Make Payment</button>)}

                                    <button className="btn btn-outline-primary mx-2" type="button">Send Invoice</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-body">
                            <div id="invoice">
                              <div className="toolbar hidden-print">
                                <div className="text-end">
                                  <button type="button" className="btn btn-dark mx-2"><i className="fa fa-print"></i> Print </button>
                                  <button type="button" className="btn btn-danger"><i className="fa fa-file-pdf-o"></i> Export as PDF</button>
                                </div>
                                <hr />
                              </div>
                              <div className="invoice overflow-auto">
                                <div style={{ "min-width": "600px" }}>
                                  <header>
                                    <div className="row">
                                      <div className="col">
                                        <a href="#!" >
                                          <img src="assets/images/logo-icon.png" width="80" alt="" />
                                        </a>
                                      </div>
                                      <div className="col company-details">
                                        <h2 className="name">
                                          <a target="_blank" href="#!" >
                                            Dcodelabs
                                          </a>
                                        </h2>
                                        <div>455 Foggy Heights, AZ 85004, US</div>
                                        <div>(123) 456-789</div>
                                        <div>company@example.com</div>
                                      </div>
                                    </div>
                                  </header>
                                  <main>
                                    <div className="row contacts">
                                      <div className="col invoice-to">
                                        <div className="text-gray-light">INVOICE TO:</div>
                                        <h2 className="to">{invoiceData.vendor_id?.name}</h2>
                                        <div className="email"><a href="mailto:john@example.com">{invoiceData.vendor_id?.email}</a>
                                          <div className="address">{invoiceData.vendor_id?.address.address_line1} {invoiceData.vendor_id?.address.address_line2}</div>
                                          <div className="address">{invoiceData.vendor_id?.address.city}</div>
                                        </div>
                                      </div>
                                      <div className="col invoice-details">
                                        <h1 className="invoice-id">{invoiceData.invoice_no}</h1>
                                        <div className="date">Date of Invoice: {invoiceData.bill_date}</div>
                                        <div className="date">Due Date: {invoiceData.due_date}</div>
                                      </div>
                                    </div>
                                    <table>
                                      <thead>
                                        <tr>
                                          <th>#</th>
                                          <th className="text-left">ITEMS & DESCRIPTION</th>
                                          <th className="text-right">Qty</th>
                                          <th className="text-right">Rate</th>
                                          <th className="text-right">TOTAL</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {invoiceData.items?.map((item, index) => {
                                          return (
                                            <tr key={index}>
                                              <td className="no">{index + 1}</td>
                                              <td className="text-left">
                                                <h3>{item.product_id?.name}</h3>
                                                <p>{item.product_id?.description}</p>
                                              </td>
                                              <td className="unit">${item.qty}</td>
                                              <td className="qty">${item.rate}</td>
                                              <td className="total">${item.amount}</td>
                                            </tr>
                                          )
                                        })}
                                      </tbody>
                                      <tfoot>
                                        <tr>
                                          <td colSpan="2"></td>
                                          <td colSpan="2">SUBTOTAL</td>
                                          <td>${invoiceData.sale_details?.sub_total}</td>
                                        </tr>
                                        <tr>
                                          <td colSpan="2"></td>
                                          <td colSpan="2">TAX {/* 25% */}</td>
                                          <td>${invoiceData.sale_details?.tax}</td>
                                        </tr>
                                        <tr>
                                          <td colSpan="2"></td>
                                          <td colSpan="2">GRAND TOTAL</td>
                                          <td>${invoiceData.sale_details?.total}</td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                    <div className="thanks">Thank you!</div>
                                    <div className="notices">
                                      <div>NOTICE:</div>
                                      <div className="notice">{invoiceData.notes}</div>
                                    </div>
                                  </main>
                                  <footer>Invoice was created on a computer and is valid without the signature and seal.</footer>
                                </div>
                                {/* <!--DO NOT DELETE THIS div. IT is responsible for showing footer always at the bottom--> */}
                                <div></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>)}

                </div>
              </CTabPane>

              <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 3}>
                {/* Packages Form */}


                {
                  packageData ?

                    (<div>
                      <section className="vh-10" > {/* style="background-color: #eee;" */}
                        <div className="container py-5">
                          <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col">
                              <div className="card card-stepper" style={{ borderRadius: "10px" }} >
                                <div className="card-body p-4">

                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex flex-column">
                                      <span className="lead fw-normal"># {packageData.receivable_no}</span>
                                      <span className="text-muted small">{DateTime.fromISO(packageData.date).toFormat('dd LLL , yyyy')}</span>
                                    </div>
                                    <div>
                                      <span className="mx-5">Status: <strong style={{ "color": "green" }}>{packageData.status}</strong></span>
                                      <button className="btn btn-outline-primary mx-2" type="button">Mark as Delivered</button>
                                      {/* <button className="btn btn-outline-primary" type="button">Create Shipment</button> */}
                                    </div>
                                  </div>
                                  <hr className="my-4" />

                                  <div className="d-flex flex-row justify-content-between align-items-center align-content-center">
                                    <span className="dot"></span>
                                    <hr className="flex-fill track-line" /><span className="dot"></span>
                                    <hr className="flex-fill track-line" /><span className="dot"></span>
                                    <hr className="flex-fill track-line" /><span className="dot"></span>
                                    <hr className="flex-fill track-line" /><span
                                      className="d-flex justify-content-center align-items-center big-dot dot">
                                      <i className="fa fa-check text-white"></i></span>
                                  </div>

                                  <div className="d-flex flex-row justify-content-between align-items-center">
                                    <div className="d-flex flex-column align-items-start"><span>15 Mar</span><span>Order placed</span>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center"><span>15 Mar</span><span>Order
                                      placed</span></div>
                                    <div className="d-flex flex-column justify-content-center align-items-center"><span>15
                                      Mar</span><span>Order Dispatched</span></div>
                                    <div className="d-flex flex-column align-items-center"><span>15 Mar</span><span>Out for
                                      delivery</span></div>
                                    <div className="d-flex flex-column align-items-end"><span>15 Mar</span><span>Delivered</span></div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Product Info */}
                      <div className="container">
                        <div className="row clearfix">
                          <div className="col-md-12">
                            <table className="table table-hover" id="tab_logic">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col"> # </th>
                                  <th scope="col"> Product </th>
                                  <th scope="col"> Ordered Qty</th>
                                  <th scope="col"> Received Qty</th>
                                </tr>
                              </thead>
                              <tbody>
                                {packageData?.receivable?.map((element, index) => {
                                  return (
                                    <tr id={index + "addr2"}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {element.product_id?.name}
                                        <CFormInput type="hidden" id="inputPcs"  {...register(`package[${index}].product_id`)} />
                                      </td>
                                      <td>{element.ordered_qty}</td>
                                      <td>{element.received_qty}</td>
                                    </tr>)
                                }
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className='mt-2 mb-5'>
                          <div>Notes</div>
                          <p className='mx-2'>
                            <small>{packageData.additional_notes}</small>
                          </p>
                        </div>

                      </div>
                    </div>)
                    : (
                      <CForm onSubmit={handleSubmit(onReceive, onPackageErrors)}>
                        <CCol xs={12}>

                          {/* Show Package Form  */}
                          <CRow className="row g-3 px-3 mt-1 mb-5">
                            <ValidationAlert validate={{ visible: validationAlert, errorObjData }} />
                            <CCol md={6}>
                              <CFormInput type="text" id="inputEmail4" floatingLabel="Purchase Receive#" {...register("receive.receivable_no")} />
                              {errors.order_no && <div className='invalid-validation-css'>This field is required</div>}
                            </CCol>
                            <CCol md={6}>
                              <CFormInput type="date" id="inputPassword4" floatingLabel="Date" {...register("receive.date")} />
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
                                        <th className="text-center"> Order Qty </th>
                                        <th className="text-center"> QUANTITY TO RECEIVE  </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {fields?.map((element, index) => {
                                        return (
                                          <tr id='addr0'>
                                            <td>{index + 1}</td>
                                            <td>
                                              <div><b>ITEM:</b>{element.product_id}</div>
                                              <div>Qty:{element.qty}</div>
                                              <div>Rate:{element.rate}</div>
                                              <CFormInput type="hidden" id="inputPcs" value={element.product_id}  {...register(`receive.receivable[${index}].product_id`)} />
                                              <CFormInput type="hidden" id="inputPcs" value={element.qty}  {...register(`receive.receivable[${index}].ordered_qty`)} />
                                            </td>
                                            <td>{element.qty}</td>
                                            <td><CFormInput type="number" id="inputRecQty"  {...register(`receive.receivable[${index}].received_qty`)} /></td>
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
                              <CFormTextarea id="cost_data" floatingLabel="Package Notes" style={{ height: '100px' }} {...register("additional_notes")} rows="6">
                              </CFormTextarea>
                            </CCol>

                            <CCol md={12} className="mt-4">
                              <div className='float-end'>
                                <input type="hidden"  {...register("receive.purchase_order")} value={id}></input>
                                <CButton type="submit" className="me-md-2" >Save & Continue </CButton>
                                <CButton type="button" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2" color="secondary" variant="ghost">Close</CButton>
                              </div>
                            </CCol>

                          </CRow>

                        </CCol>
                      </CForm>
                    )
                }



              </CTabPane>

            </CTabContent>


            {/* Modal start Here */}
            {invoiceData ? (
              <CModal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)} backdrop='static'>
                <CModalHeader>
                  <CModalTitle>Payment for ({invoiceData?.bill_no})</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit3(onPaymentSubmit, onPackageErrors)}>
                  <CCol xs={12}>
                    <CRow className="row g-3 px-3 mx-2 py-5">
                      <ValidationAlert validate={{ visible: validationAlert, errorObjData }} />

                      <fieldset className="row mb-1">
                        <legend className="col-form-label col-sm-2 pt-0">Payment In</legend>
                        <CCol sm={10} >
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value="full_amount" label="Full amount" {...register3("payment.payment_type", { required: true })} />
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value="Partial amount" label="Partial amount" {...register3("payment.payment_type", { required: true })} />
                          {errors.payment?.payment_type && <div className='invalid-validation-css'>This field is required</div>}
                        </CCol>
                      </fieldset>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Payment No#" {...register3("payment.payment_no")} />
                        {errors.shipment_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Payment Mode"{...register3("payment.payment_mode")}>
                          <option value="">...</option>
                          <option>Cash</option>
                          <option>Bank Transfer</option>
                          <option>Cheque</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Reference No#" {...register3("payment.reference")} />
                        {errors.tracking_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputAmount" readOnly value={invoiceData?.sale_details.total} floatingLabel="Amount" {...register3("payment.amount")} />
                        {errors.tracking_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" floatingLabel="Payment Date" {...register3("payment.payment_date")} />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Payment Deposit to"{...register3("payment.deposit_to")}>
                          <option value="">...</option>
                          <option>Petty Cash</option>
                          <option>Undeposited Funds</option>
                          <option>Other Expense</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Payment Status"{...register3("payment.status")}>
                          <option value="">...</option>
                          <option>Completed</option>
                          <option>On-Hold</option>
                          <option>Cancelled</option>
                          <option>Refunded</option>
                        </CFormSelect>
                      </CCol>

                      <h5>Additional Information</h5>

                      <CCol md={12}>
                        <CFormTextarea id="cost_data" floatingLabel="Notes" style={{ height: '100px' }} {...register3("payment.notes")} rows="6">
                        </CFormTextarea>
                      </CCol>

                      <CCol md={12} className="mt-4">
                        <div className='float-end'>
                          <input type="hidden" value={invoiceData._id}  {...register3("payment.invoice")}></input>
                          <input type="hidden" value={invoiceData._id}  {...register3("payment.payable")}></input>
                          <input type="hidden"  {...register3("payment.onModel")} value="Bill"></input>
                          <CButton type="submit" className="me-md-2" >Save & Continue </CButton>
                          <CButton type="button" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2" color="secondary" variant="ghost">Close</CButton>
                        </div>
                      </CCol>

                    </CRow>
                  </CCol>
                </CForm>
              </CModal>
            ) : ""}


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

            <CModal size="xl" visible={showBillModal} onClose={() => setBillModal(false)} backdrop='static'>
              <CForm onSubmit={handleSubmit2(onBillSubmit, onBillErrors)}>
                <CModalHeader>
                  <CModalTitle>Create Bill</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CCol xs={12}>

                    {/* Show Package Form  */}
                    <CRow className="row g-3 px-3 mt-1 mb-5">
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" disabled value={order.order_no} floatingLabel="Purchase Order#" />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Bill No#" {...register2("bill.bill_no", { required: "Bill No is required" })} />
                        {errors.bill?.bill_no && <div className='invalid-validation-css'>Bill No is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" floatingLabel="Bill Date" {...register2("bill.bill_date")} />
                        {errors.bill?.bill_date && <div className='invalid-validation-css'>Bill date is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" floatingLabel="Due Date" {...register2("bill.due_date")} />
                        {errors.bill?.due_date && <div className='invalid-validation-css'>Bill due date is required</div>}
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
                                  <th className="text-center"> Qty </th>
                                  <th className="text-center"> Price </th>
                                  <th className="text-center"> Total </th>
                                </tr>
                              </thead>
                              <tbody>
                                {fields?.map((element, index) => {
                                  return (
                                    <tr id='addr0'>
                                      <td>{index + 1}</td>
                                      <td>
                                        <CFormSelect className="form-control" key={index} id="inputState"  {...register2(`bill.items[${index}].product_id`)} disabled onChange={(e) => { gerProductById(e.target.value, index) }} >
                                          <option value="">... Select Product ...</option>
                                          {products.docs?.map((product, index) => {
                                            return <option key={index} value={product._id}>{product.name}</option>
                                          })};
                                        </CFormSelect>
                                      </td>
                                      <td><CFormInput type="number" id="inputPassword4" disabled {...register2(`bill.items[${index}].qty`)} onChange={(e) => { handleQtyChange(e.target.value, index) }} /></td>
                                      <td><CFormInput type="number" id="inputPassword4" disabled {...register2(`bill.items[${index}].rate`)} readOnly /></td>
                                      <td><CFormInput type="number" id="inputPassword4" disabled {...register2(`bill.items[${index}].amount`)} readOnly /></td>
                                    </tr>)
                                }
                                )}
                                <tr id='addr1'></tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="row clearfix" style={{ marginTop: "20px" }} > {/* style={"margin-top:20px"} */}
                          <div className="col-md-4">
                            <table className="table table-bordered table-hover" id="tab_logic_total">
                              <tbody>
                                <tr>
                                  <th className="text-center">Sub Total</th>
                                  <td className="text-center">
                                    <input type="text" placeholder='0.00' className="form-control" id="sub_total" readOnly {...register2(`bill.sale_details.sub_total`)} />
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-center">Tax</th>
                                  <td className="text-center"><div className="input-group mb-2 mb-sm-0">
                                    <input type="text" className="form-control" id="tax" placeholder="0" {...register2(`bill.sale_details.tax_id`)} />
                                    <div className="input-group-addon">%</div>
                                  </div></td>
                                </tr>
                                <tr>
                                  <th className="text-center">Tax Amount</th>
                                  <td className="text-center">
                                    <input type="text" {...register2(`bill.sale_details.tax_amount`)} id="tax_amount" placeholder='0.00' className="form-control" readOnly />
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-center">Grand Total</th>
                                  <td className="text-center"><input type="text" name='total_amount' id="total_amount" placeholder='0.00' className="form-control" readOnly {...register2(`bill.sale_details.total`)} /></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <h5>Additional Information</h5>

                      <CCol md={12}>
                        <CFormTextarea id="cost_data" floatingLabel="Bill Notes" style={{ height: '100px' }} {...register2("package_notes")} rows="6">
                        </CFormTextarea>
                      </CCol>

                    </CRow>

                  </CCol>
                </CModalBody>
                <CModalFooter className='mt-4'>
                  <input type="hidden"  {...register2("_id", options._id)}></input>
                  <input type="hidden" value={order._id}  {...register2("bill.purchase_order")}></input>
                  <input type="hidden" value={order.vendor_id?._id}  {...register2("bill.vendor_id")}></input>
                  <CButton type="submit" className="me-md-2" >Submit</CButton>
                  <CButton type="button" onClick={() => setBillModal(!showBillModal)} className="me-md-2" color="secondary" variant="ghost">Close</CButton>
                </CModalFooter>
              </CForm>
            </CModal>
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PurchasePipeline
