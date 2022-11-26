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
  cilBell, cilPencil, cilSitemap, cilTrash,
} from '@coreui/icons'
import { DocsExample } from 'src/components'
import { Button } from '@coreui/coreui';
import axios from 'axios';

const PurchaseOrder = () => {
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false)
  const [delModal, setDelVisible] = useState(false)
  const [formAction, setFormAction] = useState('Add');
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategory] = useState({});
  const [salesExecutives, setSalesExe] = useState({});
  const [vendors, setVendors] = useState({});
  const [productData, setProduct] = useState({});
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

  const updateData = (data) => {
    axios.patch(process.env.REACT_APP_API_URL + "/purchase-order",
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
      .get(process.env.REACT_APP_API_URL + "/purchase-order", { params: { page }, headers: { Authorization: localStorage.getItem('token') ?? null } })
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
        setProducts(res.data.data);
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
    // console.log(data.sales_executives.map((exe) => exe._id));
    setVisibleXL(!visibleXL);
    setValue('vendor_id', data.vendor_id._id)
    setValue('order_no', data.order_no)
    setValue('status', data.status)
    setValue('reference', data.reference)
    setValue('shipment_type', data.shipment_type)
    setValue('sale_date', DateTime.fromISO(data.sale_date).toFormat('yyyy-MM-dd'))
    setValue('delivery_date', DateTime.fromISO(data.delivery_date).toFormat('yyyy-MM-dd'))

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
        <CButton color="info" onClick={() => { addForm() }} className="mb-4 text-white">Add Purchase Order</CButton>
        <CCard className="mb-4">
          <CCardHeader>
            Purchase Order
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
                  <CTableHeaderCell scope="col">Customer </CTableHeaderCell>
                  <CTableHeaderCell scope="col">#Order Id</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Sale Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Delivery Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</  CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.docs?.map((product, index) =>
                  <CTableRow key={product.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{product.vendor_id?.display_name}</CTableDataCell>
                    <CTableDataCell>{product.order_no}</CTableDataCell>
                    <CTableDataCell>{product.sale_date}</CTableDataCell>
                    <CTableDataCell>{product.delivery_date}</CTableDataCell>
                    <CTableDataCell>{product.sale_details?.total}</CTableDataCell>
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
                      <Link to={`/purchase-pipeline/${product._id}`}>
                        <CButton color="info" className="me-md-2"><CIcon className="text-white" size={'lg'} icon={cilSitemap} /></CButton>
                      </Link>
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
                href="http://localhost:3000/purchase-order?page=*"
                pageOneHref="http://localhost:3000/purchase-order"
              />
            </div>

            {/* Modal start Here */}
            <CModal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)} backdrop='static'>
              <CForm onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <CModalHeader>
                  <CModalTitle>{formAction} Purchase Order</CModalTitle>
                </CModalHeader>
                <CModalBody>
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
                        <CFormSelect id="inputState" floatingLabel="Vendor" {...register("vendor_id", options.vendor_id)}>
                          <option value="">...</option>
                          {vendors.docs?.map((vendor, index) => {
                            return <option key={index} value={vendor._id}>{vendor.display_name}</option>
                          })};
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Purchase Order#" {...register("order_no", options.order_no)} />
                        {errors.order_no && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="text" id="inputEmail4" floatingLabel="Reference#" {...register("reference", options.reference)} />
                        {errors.reference && <div className='invalid-validation-css'>This field is required</div>}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" floatingLabel="Purchase Order Date" {...register("sale_date", options.sale_date)} />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput type="date" id="inputPassword4" floatingLabel="Expected Delivery Date" {...register("delivery_date", options.delivery_date)} />
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
                        <CFormSelect id="inputState" floatingLabel="Shipment type" {...register("shipment_type", options.sales_executive)}>
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
                                  <th className="text-center"> . </th>
                                </tr>
                              </thead>
                              <tbody>
                                {fields?.map((element, index) => {
                                  return (
                                    <tr id='addr0'>
                                      <td>{index + 1}</td>
                                      <td>
                                        <CFormSelect className="form-control" key={index} id="inputState"  {...register(`items[${index}].product_id`)} onChange={(e) => { gerProductById(e.target.value, index) }} >
                                          <option value="">... Select Product ...</option>
                                          {products.docs?.map((product, index) => {
                                            return <option key={index} value={product._id}>{product.name}</option>
                                          })};
                                        </CFormSelect>
                                      </td>
                                      <td><CFormInput type="number" id="inputPassword4"  {...register(`items[${index}].qty`)} onChange={(e) => { handleQtyChange(e.target.value, index) }} /></td>
                                      <td><CFormInput type="number" id="inputPassword4"  {...register(`items[${index}].rate`)} readOnly /></td>
                                      <td><CFormInput type="number" id="inputPassword4"  {...register(`items[${index}].amount`)} readOnly /></td>
                                      <td><CButton type="button" onClick={() => removeItem(index)} className="me-md-2" color="danger"><CIcon size={'sm'} icon={cilTrash} /></CButton></td>
                                    </tr>)
                                }
                                )}
                                <tr id='addr1'></tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="row clearfix">
                          <div className="col-md-12">
                            <button id="add_row" type='button' onClick={() => { addRow() }} className="btn btn-default pull-left">Add Row</button>
                            {/* <button id='delete_row' type='button' onClick={() => { alert(2) }} className="float-end btn btn-default">Delete Row</button> */}
                          </div>
                        </div>
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

export default PurchaseOrder
