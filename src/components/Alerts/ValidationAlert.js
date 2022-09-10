import { React, useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import {
    CAlert,
    CAlertHeading
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
const ValidationAlert = (props) => {

    console.log(props);
    const [validationAlert,setValidationAlert] = useState(props.validate.visible);

    useEffect(() => {
        console.log(props.validate.visible);
        setValidationAlert(props.validate.visible)
    }, [validationAlert])

    return (
        <CAlert dismissible visible={validationAlert} onClose={() => setValidationAlert(false) } color="danger">
            <CAlertHeading tag="h4">Error !</CAlertHeading>
            <ul>
                {
                    props.validate.errorObjData?.map((ele,index) => {
                        return (<li key={index}>{ele['message']}</li>)
                    })
                }
            </ul>
            <hr />
            {/* <p className="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p> */}
        </CAlert>
    );

}

export default ValidationAlert