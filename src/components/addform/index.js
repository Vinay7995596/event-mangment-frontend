import axios from "axios";
import { Formik, ErrorMessage, Field, Form } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import './index.css'
import { useNavigate } from "react-router-dom";
const Addingevent = () => {
  const navigate = useNavigate()
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    descreption: "",
  });

  const validation = Yup.object().shape({
    name: Yup.string().required("please enter user name"),
    date: Yup.string().required("enter date"),
    descreption: Yup.string().required("description is manditory"),
  });

  const submitEventData = async (values, {resetForm}) => {
    try {
      const formattedValues = {
        ...values,
        date: new Date(values.date).toISOString(), // Ensure date is in ISO format
      };
      const response = await axios.post(
        "https://event-managment-hfd8.onrender.com/api/events",
        formattedValues, {headers : {
            Authorization : localStorage.getItem('token')
        }}
      );
      if (response.status === 200) {
        navigate('/home')
        resetForm()
      }
      resetForm()
    } catch (e) {
      console.log("event data is not submit.", e);
    }
  };
  return (
    <div className="add-event-form">
      <h2 className="add-event-title">Event Creation Form</h2>
      <Formik
        initialValues={eventData}
        validationSchema={validation}
        onSubmit={submitEventData}
      >
        <Form>
          <div className="form-field">
            <label>User Name</label>
            <Field
              className="form-input"
              name="name"
              placeholder="Enter user name"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="error-message"
            />
          </div>

          <div className="form-field">
            <label>Date</label>
            <Field className="form-input" name="date" type="date" />
            <ErrorMessage
              name="date"
              component="div"
              className="error-message"
            />
          </div>

          <div className="form-field">
            <label>Description</label>
            <Field
              className="form-input"
              name="descreption"
              placeholder="Enter description"
            />
            <ErrorMessage
              name="descreption"
              component="div"
              className="error-message"
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Addingevent;
