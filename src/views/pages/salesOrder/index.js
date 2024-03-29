import { React, useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import ValidationAlert from "../../../components/Alerts/ValidationAlert";
import Pagination from "react-bootstrap-4-pagination";
import { useSearchParams, Link } from "react-router-dom";
import { DateTime } from "luxon";
import DropzoneHandler from "../../../components/Dropzone";
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
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CToast,
  CToastBody,
  CModalFooter,
  CToastClose,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilArrowCircleRight,
  cilBell,
  cilPencil,
  cilTrash,
  cilWarning,
  cilSearch,
  cilX,
  cilCloudDownload,
} from "@coreui/icons";
import { DocsExample } from "src/components";
import { Button } from "@coreui/coreui";
import axios from "axios";
import SelectAsync from "../../select-async/SelectAsync";
import MultiSelect from "../../multi-select/Multiselect";

const SalesOrder = () => {
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false);
  const [delModal, setDelVisible] = useState(false);
  const [formAction, setFormAction] = useState("Add");
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategory] = useState({});
  const [salesExecutives, setSalesExe] = useState({});
  const [customers, setCustomers] = useState({});
  const [productData, setProduct] = useState({});
  const [errorObjData, setErrorObj] = useState([]);
  const [validationAlert, setValidationAlert] = useState(false);
  const [searchParams] = useSearchParams();
  const [addItems, setItems] = useState([
    { product_id: "", qty: 0.0, rate: 0.0, amount: 0.0 },
  ]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [customerSelected, setCustomerSelected] = useState([]);
  const [salesExeOptions, setSalesExeOptions] = useState([]);
  const [salesExeSelected, setSalesExeSelected] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filterSelect, setFilterSelect] = useState(false);

  let paginationConfig = {
    totalPages: 1,
    currentPage: 1,
    showMax: 5,
    size: "sm",
    threeDots: true,
    prevNext: true,
    onClick: function (page) {
      console.log(page);
    },
  };

  const addForm = () => {
    resetForm();
    setFormAction("Add");
    setVisibleXL(true);
  };
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: [{ product_id: "", qty: 0.0, rate: 0.0, amount: 0.0 }],
    },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "items", // unique name for your Field Array
    }
  );
  const watchItems = watch("items");

  /* Form */
  const onFormSubmit = (data) => {
    if (formAction == "Add") {
      create(data);
    } else {
      updateData(data);
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
    setErrorObj(err);
  };

  const create = (data) => {
    axios
      .post(
        process.env.REACT_APP_API_URL + "/sales-order",
        { payload: data },
        { headers: { Authorization: localStorage.getItem("token") ?? null } }
      )
      .then((response) => {
        setVisibleXL(false); /* Close the Pop Here */
        reload();
        toast.success(response.data.message ?? "Success");
      })
      .catch((error) => {
        const data = error.response.data;
        const errObj = data.error.errors;
        toast.error(
          error.response.data.message ?? "Opps something went wrong!"
        );
        validationAlertPop({ err: error.response.data });
      });
  };

  const updateData = (data) => {
    axios
      .patch(
        process.env.REACT_APP_API_URL + "/sales-order",
        { payload: data },
        { headers: { Authorization: localStorage.getItem("token") ?? null } }
      )
      .then((response) => {
        reload();
        setVisibleXL(false); /* Close the Pop Here */
        toast.success(response.data.message ?? "Success");
      })
      .catch((error, response) => {
        console.log(response.data);
        toast.error(response.data.message ?? "Opps something went wrong!");
      });
  };

  const onErrors = (errors) => {
    validationAlertPop(errors);
  };

  const options = {
    name: { required: "Product name is required" },
    status: {
      required: "Status is required",
    },
    qty: {
      required: "In-Hand Qty is required",
    },
  };

  const deleteAction = (data) => {
    axios
      .delete(process.env.REACT_APP_API_URL + "/sales-order", {
        headers: { Authorization: localStorage.getItem("token") ?? null },
        data: { _id: [data._id] },
      })
      .then((response) => {
        toast.success(response.data.message ?? "Success");
        /* Empty the Form */
        setDelVisible(false); /* Close the Pop Here */
        reload();
      })
      .catch((error, response) => {
        toast.error(response.data.message ?? "Opps something went wrong!");
      });
  };

  useEffect(() => {
    const currentParams = Object.fromEntries([...searchParams]);
    console.log(currentParams); // get new values onchange
    reload();
  }, [searchParams]);

  /* Get Data */
  useEffect(() => {
   // reload();
    getProducts();
    getCustomers();
    getUsers();
  }, []);

  const reload = async (query = {}) => {
    query.page = query.page ?? 1;
    return await axios
      .get(process.env.REACT_APP_API_URL + "/sales-order", {
        params: query,
        headers: { Authorization: localStorage.getItem("token") ?? null },
      })
      .then((res) => {
        setData(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page;
        console.log(data);
      })
      .catch((err) => {
        setToast({
          visible: true,
          color: "danger",
          message: res.data.message ?? "Oops something went wrong!",
        });
      });
  };

  const getProducts = async () => {
    let page = searchParams.get("page") ?? 1;
    return await axios
      .get(process.env.REACT_APP_API_URL + "/Products", {
        params: { page },
        headers: { Authorization: localStorage.getItem("token") ?? null },
      })
      .then((res) => {
        setProducts(res.data.data);
        const pgdata = res.data.data;
        paginationConfig.currentPage = pgdata.page;
        console.log(data);
      })
      .catch((err) => {
        setToast({
          visible: true,
          color: "danger",
          message: res.data.message ?? "Oops something went wrong!",
        });
      });
  };

  const getCustomers = async () => {
    let page = searchParams.get("page") ?? 1;
    return await axios
      .get(process.env.REACT_APP_API_URL + "/customers", {
        params: { page },
        headers: { Authorization: localStorage.getItem("token") ?? null },
      })
      .then((res) => {
        setCustomers(res.data.data);
        const customersData = res?.data?.data?.docs?.map((option) => {
          return {
            value: option._id,
            label: option.name,
          };
        });
        setCustomerOptions(customersData);
      })
      .catch((err) => {
        setToast({
          visible: true,
          color: "danger",
          message: res.data.message ?? "Oops something went wrong!",
        });
      });
  };

  const getUsers = async () => {
    return await axios
      .get(process.env.REACT_APP_API_URL + "/users", {
        headers: { Authorization: localStorage.getItem("token") ?? null },
      })
      .then((res) => {
        setSalesExe(res.data.data);
        const customersData = res?.data?.data?.docs?.map((option) => {
          return {
            value: option._id,
            label: option.name,
          };
        });
        setSalesExeOptions(customersData);
      })
      .catch((err) => {
        setToast({
          visible: true,
          color: "danger",
          message: res.data.message ?? "Oops something went wrong!",
        });
      });
  };

  const gerProductById = async (id, index) => {
    // const filter = {_id:id}
    return await axios
      .get(process.env.REACT_APP_API_URL + "/Products", {
        params: { _id: id },
        headers: { Authorization: localStorage.getItem("token") ?? null },
      })
      .then((res) => {
        const items = getValues("items");
        const product = res.data.data?.docs[0] ?? {};
        console.log(product, product.sell_price);

        // console.log(items);
        const item = items[index];

        let qty = 1;
        let rate = !isNaN(product.sell_price) ? product.sell_price : 0.0;
        let amount = !isNaN(qty * rate) ? qty * rate : 0.0;

        setValue(`items.${index}.qty`, qty);
        setValue(`items.${index}.rate`, rate);
        setValue(`items.${index}.amount`, amount);
        setValue(`items.${index}.product._id`, id);
        subTotalCal();
      })
      .catch((err) => {
        console.error(err);
        // setToast({ visible: true, color: "danger", message: res.data.message ?? "Oops something went wrong!" })
      });
  };

  function subTotalCal() {
    const items = getValues("items");
    let sub_total = 0;
    let total = 0;
    items.forEach((item) => {
      sub_total += parseFloat(item.amount);
    });
    total = sub_total;
    setValue("sale_details.sub_total", sub_total);
    setValue("sale_details.total", total);
  }

  const handleQtyChange = async (qty, index) => {
    const items = getValues("items");
    const item = items[index];
    let rate = !isNaN(item["rate"]) ? item["rate"] : 0.0;
    let amount = !isNaN(qty * rate) ? qty * rate : 0.0;
    setValue(`items.${index}.amount`, parseFloat(amount));
    subTotalCal();
  };

  const handleSubTotal = async (qty, index) => {
    const items = getValues("items");
    const item = items[index];
    let rate = !isNaN(item["rate"]) ? item["rate"] : 0.0;
    let amount = !isNaN(qty * rate) ? qty * rate : 0.0;
    items[index]["qty"] = qty;
    items[index]["rate"] = rate;
    items[index]["amount"] = amount;
    setValue("items", items);
  };

  /* Edit Form */
  const onEdit = (data) => {
    resetForm();
    setFormAction("Update");
    setVisibleXL(!visibleXL);
    setValue("customer_id", data.customer_id._id);
    setValue("order_no", data.order_no);
    setValue("status", data.status);
    setValue("reference", data.reference);
    setValue(
      "sale_date",
      DateTime.fromISO(data.sale_date).toFormat("yyyy-MM-dd")
    );
    setValue(
      "shipment_date",
      DateTime.fromISO(data.shipment_date).toFormat("yyyy-MM-dd")
    );
    setValue(
      "sales_executives",
      data.sales_executives.map((exe) => exe._id)
    );

    data.items.forEach((item, index) => {
      append({
        product_id: item.product_id,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount,
      });
    });

    setValue("sale_details", data.sale_details);
    setValue("notes", data.customer_notes);
    setValue("shipping_notes", data.shipping_notes);
    setValue("dimension_unit", data.dimension_unit);
    setValue("category_id", data.category_id);
    setValue("isbn", data.isbn);
    setValue("ean", data.ean);
    setValue("upc", data.upc);
    setValue("manufacturer", data.manufacturer);
    setValue("serial_number", data.serial_number);
    setValue("description", data.description);
    setValue("sku", data.sku);
    setValue("units_of_measurement", data.units_of_measurement);
    setValue("type", data.type);
    setValue("_id", data._id);
    setCustomerSelected({
      label: data.customer_id?.name,
      value: data.customer_id?._id,
    });
    setSalesExeSelected(
      data.sales_executives?.map((sales) => {
        return { label: sales.name, value: sales._id };
      })
    );
    setUploadedFiles(data.docs ?? []);
  };

  /* Delete  */
  const onDelete = (data) => {
    setProduct(data);
    setDelVisible(true);
  };

  /* Reset Form */
  const resetForm = () => {
    setValidationAlert(false);
    setErrorObj([]);
    reset({});
  };

  const addRow = () => {
    append({ product_id: "", qty: 0.0, rate: 0.0, amount: 0.0 });
  };

  function removeItem(remInd) {
    const allItems = getValues("items");
    if (allItems.length <= 1) {
      return;
    }
    remove(remInd);
    subTotalCal();
    return true;
  }

  function pluck(array, key) {
    return array.map((o) => o[key]);
  }

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    reset: reset2,
  } = useForm({});

  const onFilterSubmit = (data) => {
    reload(data);
    setFilterSelect(false);
  };

  const clearAll = () => {
    reset2();
    setFilterSelect(true);
    reload();
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CToast
          autohide={true}
          delay={2000}
          visible={toast.visible}
          color={toast.color}
          className="text-white align-items-center float-end"
        >
          <div className="d-flex">
            <CToastBody>{toast.message}</CToastBody>
            <CToastClose className="me-2 m-auto" />
          </div>
        </CToast>
      </CCol>

      <CCol xs={12}>
        <CButton
          color="info"
          onClick={() => {
            addForm();
          }}
          className="mb-4 text-white"
        >
          Add Sales Order
        </CButton>
        <CCard className="mb-4">
          <CCardHeader>Sales Order</CCardHeader>
          <CCardBody>
            <CForm className="row" onSubmit={handleSubmit2(onFilterSubmit)}>
              <CCol sm={8}>
                <CRow className="g-3">
                  <CCol xs="auto">
                    <CFormInput
                      style={{ padding: "0.48rem 0.5rem" }}
                      type="text"
                      size="sm"
                      id="inputPassword2"
                      placeholder="Search"
                      {...register2("search")}
                    />
                  </CCol>
                  <CCol xs="auto">
                    <MultiSelect
                      data={{
                        name: "status",
                        clearValue: filterSelect,
                        options: [
                          {
                            value: "Order Created",
                            label: "Order Created",
                          },
                          {
                            value: "Shipping",
                            label: "Shipping",
                          },
                          {
                            value: "Delivered",
                            label: "Delivered",
                          },
                          {
                            value: "Closed",
                            label: "Closed",
                          },
                        ],
                        selected: [],
                      }}
                      onSelect={(value) => {
                        setValue2(
                          "status[]",
                          value.map((o) => o["value"]) ?? []
                        );
                      }}
                    />
                  </CCol>
                  <CCol xs="auto">
                    <CButton
                      style={{ padding: "0.48rem 0.5rem" }}
                      size="sm"
                      type="submit"
                      color="success"
                      className="mb-3"
                      variant="outline"
                    >
                      <CIcon icon={cilSearch} size="custom-size" /> Filter
                    </CButton>
                    <CButton
                      style={{ padding: "0.48rem 0.5rem" }}
                      size="sm"
                      type="button"
                      color="secondary"
                      variant="outline"
                      className="mb-3 mx-1"
                      onClick={clearAll}
                    >
                      <CIcon icon={cilX} size="sm" /> Clear all
                    </CButton>
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm={4} className="d-flex flex-column align-items-end">
                <CCol xs="auto">
                  <CButton
                    style={{ padding: "0.48rem 0.5rem" }}
                    size="sm"
                    type="submit"
                    color="info"
                    className="mb-3"
                    variant="outline"
                  >
                    <CIcon icon={cilCloudDownload} size="custom-size" /> Export
                  </CButton>
                </CCol>
              </CCol>
            </CForm>
            {/* <p className="text-medium-emphasis small">
              Using the most basic table CoreUI, here&#39;s how <code>&lt;CTable&gt;</code>-based
              tables look in CoreUI.
            </p> */}
            {/* <DocsExample href="components/table"> */}
            {data?.docs?.length > 0 ? (
              <>
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Customer </CTableHeaderCell>
                      <CTableHeaderCell scope="col">#Order Id</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Sale Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {data.docs?.map((product, index) => (
                      <CTableRow key={product.id}>
                        <CTableHeaderCell scope="row">
                          {index + 1}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {product.customer_id.name}
                        </CTableDataCell>
                        <CTableDataCell>{product.order_no}</CTableDataCell>
                        <CTableDataCell>{product.sale_date}</CTableDataCell>
                        <CTableDataCell>
                          {product.sale_details?.total}
                        </CTableDataCell>
                        <CTableDataCell>{product.status}</CTableDataCell>
                        <CTableDataCell>
                          <CTooltip content="Edit" placement="top">
                            <CButton
                              color="info"
                              onClick={() => onEdit(product)}
                              className="me-md-2"
                            >
                              <CIcon
                                className="text-white"
                                size={"lg"}
                                icon={cilPencil}
                              />
                            </CButton>
                          </CTooltip>
                          <CTooltip content="Delete" placement="top">
                            <CButton
                              color="danger"
                              onClick={() => onDelete(product)}
                              className="me-md-2"
                            >
                              <CIcon
                                className="text-white"
                                size={"lg"}
                                icon={cilTrash}
                              />
                            </CButton>
                          </CTooltip>
                          <CTooltip content="View Order" placement="top">
                            <Link to={`/sales-pipeline/${product._id}`}>
                              <CButton color="info" className="me-md-2">
                                <CIcon
                                  className="text-white"
                                  size={"lg"}
                                  icon={cilArrowCircleRight}
                                />
                              </CButton>
                            </Link>
                          </CTooltip>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <div className="mt-2 px-2 float-end">
                  <Pagination
                    threeDots
                    totalPages={data.totalPages}
                    currentPage={data.page}
                    showMax={7}
                    prevNext
                    activeBgColor="#fffff"
                    activeBorderColor="#7bc9c9"
                    href="http://localhost:3000/sales-orders?page=*"
                    pageOneHref="http://localhost:3000/sales-orders"
                  />
                </div>
              </>
            ) : (
              <>
                <CCol md={12}>
                  <span className="d-block p-5 bg-light text-secondary text-center rounded ">
                    <CIcon size={"xl"} icon={cilWarning} /> No Data Found
                  </span>
                </CCol>
              </>
            )}

            {/* Modal start Here */}
            <CModal
              size="xl"
              visible={visibleXL}
              onClose={() => setVisibleXL(false)}
              backdrop="static"
            >
              <CForm onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <CModalHeader>
                  <CModalTitle>{formAction} Sales Order</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CCol xs={12}>
                    <CRow className="row g-3 px-3 mt-1 mb-5">
                      <ValidationAlert
                        validate={{ visible: validationAlert, errorObjData }}
                      />
                      {/* <fieldset className="row mb-1">
                        <legend className="col-form-label col-sm-2 pt-0">Item Type</legend>
                        <CCol sm={10} >
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value="product" label="Product" {...register("type",{required:true})} />
                          <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value="service" label="Service" {...register("type",{required:true})} />
                          {errors.type && <div className='invalid-validation-css'>This field is required</div>}
                        </CCol>
                      </fieldset> */}
                      <CCol md={8}>
                        <CFormLabel
                          htmlFor="exampleFormControlInput1"
                          className="text-dark"
                        >
                          Customer
                        </CFormLabel>

                        <SelectAsync
                          data={{
                            options: customerOptions,
                            selected: customerSelected,
                          }}
                          onSelect={(value) => {
                            setValue("customer_id", value.value);
                          }}
                          {...register("customer_id", { required: true })}
                        />
                        {errors.customer_id && (
                          <div className="invalid-validation-css">
                            This field is required
                          </div>
                        )}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          id="inputEmail4"
                          floatingLabel="Sales Order#"
                          {...register("order_no", options.order_no)}
                        />
                        {errors.order_no && (
                          <div className="invalid-validation-css">
                            This field is required
                          </div>
                        )}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="text"
                          id="inputEmail4"
                          floatingLabel="Reference#"
                          {...register("reference", options.reference)}
                        />
                        {errors.reference && (
                          <div className="invalid-validation-css">
                            This field is required
                          </div>
                        )}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="date"
                          id="inputPassword4"
                          floatingLabel="Sales Order Date"
                          {...register("sale_date", options.sale_date)}
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="date"
                          id="inputPassword4"
                          floatingLabel="Shipment Date"
                          {...register("shipment_date", options.shipment_date)}
                        />
                      </CCol>

                      <CCol md={6}>
                        <CFormLabel
                          htmlFor="exampleFormControlInput1"
                          className="text-dark"
                        >
                          Sales Executive's
                        </CFormLabel>
                        <MultiSelect
                          data={{
                            options: salesExeOptions,
                            selected: salesExeSelected,
                          }}
                          onSelect={(value) => {
                            setValue(
                              "sales_executives[]",
                              pluck(value, "value")
                            );
                          }}
                        />
                      </CCol>

                      <h5>Items</h5>
                      {/* Product Info */}
                      <div className="container">
                        <div className="row clearfix">
                          <div className="col-md-12">
                            <table
                              className="table table-bordered table-hover"
                              id="tab_logic"
                            >
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
                                    <tr id="addr0">
                                      <td>{index + 1}</td>
                                      <td>
                                        <CFormSelect
                                          className="form-control"
                                          key={index}
                                          id="inputState"
                                          {...register(
                                            `items[${index}].product_id`
                                          )}
                                          onChange={(e) => {
                                            gerProductById(
                                              e.target.value,
                                              index
                                            );
                                          }}
                                        >
                                          <option value="">
                                            ... Select Product ...
                                          </option>
                                          {products.docs?.map(
                                            (product, index) => {
                                              return (
                                                <option
                                                  key={index}
                                                  value={product._id}
                                                >
                                                  {product.name}
                                                </option>
                                              );
                                            }
                                          )}
                                          ;
                                        </CFormSelect>
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="number"
                                          id="inputPassword4"
                                          {...register(`items[${index}].qty`)}
                                          onChange={(e) => {
                                            handleQtyChange(
                                              e.target.value,
                                              index
                                            );
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="number"
                                          id="inputPassword4"
                                          {...register(`items[${index}].rate`)}
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <CFormInput
                                          type="number"
                                          id="inputPassword4"
                                          {...register(
                                            `items[${index}].amount`
                                          )}
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <CButton
                                          type="button"
                                          onClick={() => removeItem(index)}
                                          className="me-md-2"
                                          color="danger"
                                        >
                                          <CIcon size={"sm"} icon={cilTrash} />
                                        </CButton>
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr id="addr1"></tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="row clearfix">
                          <div className="col-md-12">
                            <button
                              id="add_row"
                              type="button"
                              onClick={() => {
                                addRow();
                              }}
                              className="btn btn-default pull-left"
                            >
                              Add Row
                            </button>
                          </div>
                        </div>
                        <div
                          className="row clearfix"
                          style={{ "margin-top": "20px" }}
                        >
                          {" "}
                          {/* style={"margin-top:20px"} */}
                          <div className="col-md-4">
                            <table
                              className="table table-bordered table-hover"
                              id="tab_logic_total"
                            >
                              <tbody>
                                <tr>
                                  <th className="text-center">Sub Total</th>
                                  <td className="text-center">
                                    <input
                                      type="text"
                                      placeholder="0.00"
                                      className="form-control"
                                      id="sub_total"
                                      readOnly
                                      {...register(`sale_details.sub_total`)}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-center">Tax</th>
                                  <td className="text-center">
                                    <div className="input-group mb-2 mb-sm-0">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="tax"
                                        placeholder="0"
                                        {...register(`sale_details.tax_id`)}
                                      />
                                      <div className="input-group-addon">%</div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-center">Total Tax</th>
                                  <td className="text-center">
                                    <input
                                      type="text"
                                      {...register(`sale_details.tax_amount`)}
                                      id="tax_amount"
                                      placeholder="0.00"
                                      className="form-control"
                                      readOnly
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-center">Grand Total</th>
                                  <td className="text-center">
                                    <input
                                      type="text"
                                      name="total_amount"
                                      id="total_amount"
                                      placeholder="0.00"
                                      className="form-control"
                                      readOnly
                                      {...register(`sale_details.total`)}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <h5>Additional Information</h5>

                      <CCol md={6}>
                        <CFormTextarea
                          id="cost_data"
                          floatingLabel="Customer Notes"
                          style={{ height: "100px" }}
                          {...register("notes", options.notes)}
                          rows="6"
                        ></CFormTextarea>
                      </CCol>
                      <CCol md={6}>
                        <CFormTextarea
                          id="cost_data"
                          floatingLabel="Shipping Notes"
                          style={{ height: "100px" }}
                          {...register("shipping_notes", options.notes)}
                          rows="6"
                        ></CFormTextarea>
                      </CCol>

                      <CCol md={12}>
                        <CFormLabel
                          htmlFor="exampleFormControlInput1"
                          className="text-dark"
                        >
                          Attachment's
                        </CFormLabel>
                        <DropzoneHandler
                          options={{
                            multiple: true,
                            uploadedFile: uploadedFiles,
                          }}
                          onFileUpload={(value) => {
                            setValue("docs[]", pluck(value, "_id"));
                          }}
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CModalBody>
                <CModalFooter className="mt-4">
                  <input
                    type="hidden"
                    {...register("_id", options._id)}
                  ></input>
                  <CButton type="submit" className="me-md-2">
                    Submit
                  </CButton>
                  <CButton
                    type="button"
                    onClick={() => setVisibleXL(!visibleXL)}
                    className="me-md-2"
                    color="secondary"
                    variant="ghost"
                  >
                    Close
                  </CButton>
                </CModalFooter>
              </CForm>
            </CModal>

            <CModal
              alignment="center"
              visible={delModal}
              onClose={() => setDelVisible(false)}
            >
              <CModalHeader>
                {/* <CModalTitle>Modal title</CModalTitle> */}
              </CModalHeader>
              <CModalBody className="text-center">
                <CIcon size={"4xl"} icon={cilTrash} />
                {/* <CIcon icon={cilPencil} customClassName="nav-icon" /> */}
                <h3 className="mt-4 mb-4">Are you Sure? </h3>
                <p>
                  Do you really want to delete these records? This process
                  cannot be undone.
                </p>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setDelVisible(false)}>
                  Close
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => {
                    deleteAction(productData);
                  }}
                  variant="ghost"
                >
                  Yes Continue
                </CButton>
              </CModalFooter>
            </CModal>

            {/* Modal ends Here  */}
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default SalesOrder;
