import { React, useState } from 'react'
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
  CFormTextarea
} from '@coreui/react'
import { DocsExample } from 'src/components'
import { Button } from '@coreui/coreui';


const Products = () => {
  const columns = ["#", "class", "Heading", "Heading"];
  const items = [];
  const [visibleXL, setVisibleXL] = useState(false)
  const [formAction,setFormAction] = useState('Add');
  const addForm = ()=>{
    setFormAction('Add');
    setVisibleXL(true)
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CButton color="info" onClick={()=>{addForm()}} className="mb-4">Add Products</CButton>
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
                  <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell scope="row">1</CTableHeaderCell>
                  <CTableDataCell>Mark</CTableDataCell>
                  <CTableDataCell>Otto</CTableDataCell>
                  <CTableDataCell>@mdo</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2">Edit</CButton>
                    <CButton color="danger" className="me-md-2">Delete</CButton>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">2</CTableHeaderCell>
                  <CTableDataCell>Jacob</CTableDataCell>
                  <CTableDataCell>Thornton</CTableDataCell>
                  <CTableDataCell>@fat</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" className="me-md-2">Edit</CButton>
                    <CButton color="danger" className="me-md-2">Delete</CButton>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">3</CTableHeaderCell>
                  <CTableDataCell colSpan="2">Larry the Bird</CTableDataCell>
                  <CTableDataCell>@twitter</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" className="me-md-2">Edit</CButton>
                    <CButton color="danger" className="me-md-2">Delete</CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            {/* Modal start Here */}
            <CModal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)}>
              <CModalHeader>
                <CModalTitle>{formAction} Products</CModalTitle>
              </CModalHeader>
              <CModalBody>

                <CCol xs={12}>


                  <CForm className="row g-3">
                    <CCol md={6}>
                      <CFormInput type="text" id="inputEmail4" label="Name" />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput type="text" id="inputPassword4" label="sku" />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput type="text" id="inputEmail4" label="Serial Numbers" />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput type="text" id="qty" label="Qty" />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput type="text" id="cost" label="Cost Price" />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput type="text" id="cost" label="Sell Price" />
                    </CCol>
                    <CCol xs={12}>
                      <CFormTextarea rows="3" id="inputAddress" label="Description" placeholder="Max 250 chars" ></CFormTextarea>
                    </CCol>
                    <CCol md={4}>
                      <CFormSelect id="inputState" label="Category">
                        <option>Choose...</option>
                        <option>...</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={2}>
                      <CFormInput id="inputCity" label="Units" />
                    </CCol>
                    <CCol md={4}>
                      <CFormSelect id="inputState" label="Vendor">
                        <option>Choose...</option>
                        <option>...</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={2}>
                      <CFormSelect id="inputState" label="State">
                        <option>Choose...</option>
                        <option>Active</option>
                        <option>In-Active</option>
                      </CFormSelect>
                    </CCol>
                    <CCol xs={12} className="mt-4">
                      <CButton type="submit" className="me-md-2" >Sign in</CButton>
                      <CButton type="button" onClick={() => setVisibleXL(!visibleXL)} className="me-md-2" color="secondary" variant="ghost">Close</CButton>
                    </CCol>
                  </CForm>
                </CCol>

              </CModalBody>
            </CModal>
            {/* Modal ends Here  */}
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Products
