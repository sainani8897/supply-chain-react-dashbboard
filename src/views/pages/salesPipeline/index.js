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

const SalesPipeline = () => {
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false)
  const [delModal, setDelVisible] = useState(false)
  const [formAction, setFormAction] = useState('Add');
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategory] = useState({});
  const [salesExecutives, setSalesExe] = useState({});
  const [customers, setCustomers] = useState({});
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

  const { register: register2,formState: { errors: errors2 }, handleSubmit: handleSubmit2, } = useForm({ });

  const watchItems = watch("items");

  /* Form */
  const onFormSubmit = (data) => {
    updateData(data)
  };

  /* Package Form */
  const onPackageSubmit = (data) => {
    createPackage(data);
  };

  /* Shipping Form */
  const onShippingSubmit = ({ shipment }) => {
    createShipping(shipment);
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
    axios.post(process.env.REACT_APP_API_URL + "/sales-order",
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


  const createPackage = (data) => {
    axios.post(process.env.REACT_APP_API_URL + "/packages",
      { payload: data },
      { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        setActiveKey(4);
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

  const createShipping = (data) => {
    let method = 'post'
    if (data._id) {
      method = 'patch'
    }
    const headers = { Authorization: localStorage.getItem('token') ?? null }
    axios({
      method,
      url: process.env.REACT_APP_API_URL + "/shipment",
      data: { payload: data },
      headers: headers
    })
      .then((response) => {
        getShipmentData({ sales_order: id });
        toast.success(response.data.message ?? "Success")
        setActiveKey(4);
      })
      .catch((error) => {
        const data = error.response.data
        const errObj = data.error.errors;
        toast.error(error.response.data.message ?? "Opps something went wrong!")
        validationAlertPop({ err: error.response.data });
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
        const data = error.response.data
        const errObj = data.error.errors;
        toast.error(error.response.data.message ?? "Opps something went wrong!")
        validationAlertPop({ err: error.response.data });
      })
  }

  const updateData = (data) => {
    axios.patch(process.env.REACT_APP_API_URL + "/sales-order",
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

  const getpackageData = (data) => {
    axios.get(process.env.REACT_APP_API_URL + "/packages", { params: { sales_order: id }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        setPackage(response.data.data?.docs[0] ?? null);
      })
      .catch((error) => {
        toast.error("Opps something went wrong!")
      })
  }

  const getShipmentData = (data) => {
    axios.get(process.env.REACT_APP_API_URL + "/shipment", { params: { sales_order: id }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((response) => {
        setShipment(response.data.data?.docs[0] ?? null);
      })
      .catch((error) => {
        toast.error("Opps something went wrong!")
      })
  }


  const getInvoice = (data) => {
    axios.get(process.env.REACT_APP_API_URL + "/invoice", { params: { sales_order: id }, headers: { Authorization: localStorage.getItem('token') ?? null } })
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
    axios.delete(process.env.REACT_APP_API_URL + "/sales-order",
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
    getCustomers();
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
      .get(process.env.REACT_APP_API_URL + "/sales-order", { params: { page }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setData(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page
      }).catch((err) => {
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
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
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const getCustomers = async () => {
    let page = searchParams.get('page') ?? 1
    return await axios
      .get(process.env.REACT_APP_API_URL + "/customers", { params: { page }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setCustomers(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page
      }).catch((err) => {
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      })
  }

  const getUsers = async () => {
    return await axios
      .get(process.env.REACT_APP_API_URL + "/users", { headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        setSalesExe(res.data.data);
      }).catch((err) => {
        setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
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
      .get(process.env.REACT_APP_API_URL + "/sales-order", { params: { _id: id }, headers: { Authorization: localStorage.getItem('token') ?? null } })
      .then((res) => {
        if (res.data.status === 404)
          return navigate('/404')
        const order = res.data.data?.docs[0] ?? {};
        onOrder(order)
        setOrder(order);
      }).catch((err) => {
        console.error(err);
        navigate('/500');
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
    setValue('customer_id', data.customer_id._id)
    setValue('order_no', data.order_no)
    setValue('status', data.status)
    setValue('reference', data.reference)
    setValue('sale_date', DateTime.fromISO(data.sale_date).toFormat('yyyy-MM-dd'))
    setValue('shipment_date', DateTime.fromISO(data.shipment_date).toFormat('yyyy-MM-dd'))
    setValue('sales_executives', data.sales_executives.map((exe) => exe._id))

    data.items.forEach((item, index) => {
      append({ product_id: item.product_id, qty: item.qty, rate: item.rate, amount: item.amount })
    })

    setValue('sale_details', data.sale_details)
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
  const handlePackage = () => {
    getpackageData({ sales_order: id });
    setActiveKey(2);
  }

  /* Handle Shipment */
  const handleShipment = () => {
    getShipmentData({ sales_order: id });
    setActiveKey(3);
  }

  /* Handle Shipment */
  const hanldeInvoice = () => {
    getInvoice({ sales_order: id });
    setActiveKey(4);
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
                  href="javascript:void(0);"
                  active={activeKey === 1}
                  onClick={() => setActiveKey(1)}
                >
                  Sales Order
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey === 2}
                  onClick={() => handlePackage()}
                  disabled={packageTab}
                >
                  Packages
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey === 3}
                  onClick={() => handleShipment()}
                  disabled={shipmentTab}
                >
                  Shipment
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={activeKey === 4}
                  onClick={() => hanldeInvoice()}
                  disabled={invoiceTab}
                >
                  Invoice
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
                      <ValidationAlert validate={{ visible: validationAlert, errorObjData }} />
                      {/* <fieldset className="row mb-1">
                        <legend className="col-form-label col-sm-2 pt-0">Item Type</legend>
                        <CCol sm={10} >
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value="product" label="Product" {...register("type",{required:true})} />
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value="service" label="Service" {...register("type",{required:true})} />
                          {errors.type && <div className='invalid-validation-css'>This field is required</div>}
                        </CCol>
                      </fieldset> */}
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Customer" disabled  {...register("customer_id", options.customer_id)}>
                          <option value="">...</option>
                          {customers.docs?.map((customer, index) => {
                            return <option key={index} value={customer._id}>{customer.name}</option>
                          })};
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" disabled floatingLabel="Sales Order#" {...register("order_no", options.order_no)} />
                        {errors.order_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" disabled floatingLabel="Reference#" {...register("reference", options.reference)} />
                        {errors.reference && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" disabled floatingLabel="Sales Order Date" {...register("sale_date", options.sale_date)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" disabled floatingLabel="Shipment Date" {...register("shipment_date", options.shipment_date)} />
                      </CCol>

                      <CCol md={6}>
                        <CFormSelect id="inputState" multiple disabled floatingLabel="Sales Executive" {...register("sales_executives[]", options.sales_executive)}>
                          <option value="">...</option>
                          {salesExecutives.docs?.map((user, index) => {
                            return <option key={index} value={user._id}>{user.name}</option>
                          })};
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
                                        <CFormSelect disabled className="form-control" key={index} id="inputState"  {...register(`items[${index}].product_id`)} onChange={(e) => { getProductById(e.target.value, index) }} >
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
                        {/* <div className="row clearfix">
                          <div className="col-md-12">
                            <button id="add_row" type='button' onClick={() => { addRow() }} className="btn btn-default pull-left">Add Row</button>
                            <button id='delete_row' type='button' onClick={() => { alert(2) }} className="float-end btn btn-default">Delete Row</button>
                          </div>
                        </div> */}
                        <div className="row clearfix" style={{ marginTop: "20px" }} > {/* style={"margin-top:20px"} */}
                          <div className="col-md-4">
                            <table className="table table-bordered table-hover" id="tab_logic_total">
                              <tbody>
                                <tr>
                                  <th className="text-center">Sub Total</th>
                                  <td className="text-center">
                                    <input type="text" placeholder='0.00' className="form-control" id="sub_total" readOnly {...register(`sale_details.sub_total`)} />
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-center">Tax</th>
                                  <td className="text-center"><div className="input-group mb-2 mb-sm-0">
                                    <input type="text" className="form-control" id="tax" placeholder="0" {...register(`sale_details.tax_id`)} />
                                    <div className="input-group-addon">%</div>
                                  </div></td>
                                </tr>
                                <tr>
                                  <th className="text-center">Tax Amount</th>
                                  <td className="text-center">
                                    <input type="text" {...register(`sale_details.tax_amount`)} id="tax_amount" placeholder='0.00' className="form-control" readOnly />
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-center">Grand Total</th>
                                  <td className="text-center"><input type="text" name='total_amount' id="total_amount" placeholder='0.00' className="form-control" readOnly {...register(`sale_details.total`)} /></td>
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
                          <input type="hidden"  {...register("_id", options._id)}></input>
                          <CButton type="submit" className="me-md-2" >Save & Continue </CButton>
                          <CButton type="button" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2" color="secondary" variant="ghost">Close</CButton>
                        </div>
                      </CCol>

                    </CRow>
                  </CCol>
                </CForm>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
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
                                      <span className="lead fw-normal"># {packageData.package_slip}</span>
                                      <span className="text-muted small">{DateTime.fromISO(packageData.date).toFormat('dd LLL , yyyy')}</span>
                                    </div>
                                    <div>
                                      <span className="mx-5">Status: <strong style={{ "color": "green" }}>{packageData.status}</strong></span>
                                      <button className="btn btn-outline-primary mx-2" type="button">Mark as Delivered</button>
                                      <button className="btn btn-outline-primary" type="button">Create Shipment</button>
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
                                  <th scope="col"> Qty </th>
                                </tr>
                              </thead>
                              <tbody>
                                {packageData?.package?.map((element, index) => {
                                  return (
                                    <tr id={index + "addr2"}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {element.product_id?.name}
                                        <CFormInput type="hidden" id="inputPcs"  {...register(`package[${index}].product_id`)} />
                                      </td>
                                      <td>1</td>
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
                            <small>{packageData.package_notes}</small>
                          </p>
                        </div>

                      </div>
                    </div>)
                    : (
                      <CForm onSubmit={handleSubmit(onPackageSubmit, onPackageErrors)}>
                        <CCol xs={12}>

                          {/* Show Package Form  */}
                          <CRow className="row g-3 px-3 mt-1 mb-5">
                            <ValidationAlert validate={{ visible: validationAlert, errorObjData }} />
                            <CCol md={6}>
                              <CFormInput type="text" id="inputEmail4" floatingLabel="Package Slip#" {...register("package_slip", options.order_no)} />
                              {errors.order_no && <div className='invalid-validation-css'>This field is required</div>}
                            </CCol>
                            <CCol md={6}>
                              <CFormInput type="date" id="inputPassword4" floatingLabel="Date" {...register("date", options.date)} />
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
                                      {fields?.map((element, index) => {
                                        return (
                                          <tr id='addr0'>
                                            <td>{index + 1}</td>
                                            <td>
                                              <div><b>ITEM:</b>{element.product_id}</div>
                                              <div>Qty:{element.qty}</div>
                                              <div>Rate:{element.rate}</div>
                                              <CFormInput type="hidden" id="inputPcs"  {...register(`package[${index}].product_id`)} />
                                            </td>
                                            <td><CFormInput type="number" id="inputPcs"  {...register(`package[${index}].pcs`)} /></td>
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
                                <input type="hidden"  {...register("sales_order")} value={id}></input>
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
              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
                <CForm onSubmit={handleSubmit(onShippingSubmit, onShippingErrors)}>
                  <CCol xs={12}>
                    <CRow className="row g-3 px-3 mt-1 mb-5">
                      <ValidationAlert validate={{ visible: validationAlert, errorObjData }} />

                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Shpiment type"{...register("shipment.shipping_type")}>
                          <option value="">...</option>
                          <option>Manual</option>
                          <option>Easy Post</option>
                          <option>Xpress Bee</option>
                          <option>DHL</option>
                          <option>Others</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Shipment No#" {...register("shipment.shipment_no")} />
                        {errors.shipment_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Tracking No#" {...register("shipment.tracking_no")} />
                        {errors.tracking_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" floatingLabel="Shipment Date" {...register("shipment.shipment_date")} />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Shpiment Status"{...register("shipment.status")}>
                          <option value="">...</option>
                          <option>Shipped</option>
                          <option>On-Transit</option>
                          <option>Delivered</option>
                          <option>Un-Delivered</option>
                        </CFormSelect>
                      </CCol>


                      <h5>Additional Information</h5>

                      <CCol md={12}>
                        <CFormTextarea id="cost_data" floatingLabel="Shipping Notes" style={{ height: '100px' }} {...register("shipment.shipping_notes")} rows="6">
                        </CFormTextarea>
                      </CCol>

                      <CCol md={12} className="mt-4">
                        <div className='float-end'>
                          <input type="hidden"  {...register("shipment._id")}></input>
                          <input type="hidden"  {...register("shipment.sales_order")} value={id}></input>
                          <CButton type="submit" className="me-md-2" >Save & Continue </CButton>
                          <CButton type="button" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2" color="secondary" variant="ghost">Close</CButton>
                        </div>
                      </CCol>

                    </CRow>
                  </CCol>
                </CForm>
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 4}>
                
              </CTabPane>
            </CTabContent>


            {/* Modal start Here */}
            {invoiceData ? (
              <CModal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)}>
                <CModalHeader>
                  <CModalTitle>Payment for ({invoiceData?.invoice_no})</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit2(onPaymentSubmit, onPaymentErrors)}>
                  <CCol xs={12}>
                    <CRow className="row g-3 px-3 mx-2 py-5">
                      <ValidationAlert validate={{ visible: validationAlert, errorObjData }} />

                      <fieldset className="row mb-1">
                        <legend className="col-form-label col-sm-2 pt-0">Payment In</legend>
                        <CCol sm={10} >
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value="full_amount" label="Full amount" {...register2("payment.payment_type", { required: true })} />
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value="Partial amount" label="Partial amount" {...register2("payment.payment_type", { required: true })} />
                          {errors.payment?.payment_type && <div className='invalid-validation-css'>This field is required</div>}
                        </CCol>
                      </fieldset>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Payment No#" {...register2("payment.payment_no")} />
                        {errors.shipment_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Payment Mode"{...register2("payment.payment_mode")}>
                          <option value="">...</option>
                          <option>Cash</option>
                          <option>Bank Transfer</option>
                          <option>Cheque</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Reference No#" {...register2("payment.reference")} />
                        {errors.tracking_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputAmount" readOnly value={invoiceData?.sale_details.total} floatingLabel="Amount" {...register2("payment.amount")} />
                        {errors.tracking_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" floatingLabel="Payment Date" {...register2("payment.payment_date")} />
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Payment Deposit to"{...register2("payment.deposit_to")}>
                          <option value="">...</option>
                          <option>Petty Cash</option>
                          <option>Undeposited Funds</option>
                          <option>Other Expense</option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormSelect id="inputState" floatingLabel="Payment Status"{...register2("payment.status")}>
                          <option value="">...</option>
                          <option>Completed</option>
                          <option>On-Hold</option>
                          <option>Cancelled</option>
                          <option>Refunded</option>
                        </CFormSelect>
                      </CCol>

                      <h5>Additional Information</h5>

                      <CCol md={12}>
                        <CFormTextarea id="cost_data" floatingLabel="Notes" style={{ height: '100px' }} {...register2("payment.notes")} rows="6">
                        </CFormTextarea>
                      </CCol>

                      <CCol md={12} className="mt-4">
                        <div className='float-end'>
                          <input type="hidden" value={invoiceData._id}  {...register2("payment.invoice")}></input>
                          {/* <input type="hidden"  {...register("payment.")} value={id}></input> */}
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
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default SalesPipeline
