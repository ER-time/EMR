import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllSoapNoteAction,
  soapNotesAddOrUpdateAction,
} from "../../../app/features/doctor/videoConsultation/videoConsultation.slice";
import { FieldError } from "../../../assets";
import { TOASTER_STYLING_VALUES } from "../../../config";
import { useAuth } from "../../../Navigation/Auth/ProvideAuth";
export default function NotesdataSection(props) {
  const [key, setKey] = useState(1);
  const [subjectText, setSubjectText] = useState("");
  const [objectText, setObjectText] = useState("");
  const [planText, setPlanText] = useState("");
  const [assesmentText, setAssesmentText] = useState("");
  const { register, handleSubmit, errors } = useForm();
  let auth = useAuth();
  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getAllSoapNoteAction({
        patientId: props?.SlotListingData?.patientId,
        doctorId: auth?.intely_health_user?.userId,
        appointmentId: props?.SlotListingData?.appointmentId,
      })
    );
  }, [dispatch, props, auth]);
  let soapNotesList = useSelector((state) => state.vital);

  console.log(
    "soap notes data",
    subjectText,
    objectText,
    assesmentText,
    planText
  );

  function onSubmit(data) {
    if (
      subjectText !== null &&
      objectText !== null &&
      assesmentText !== null &&
      planText !== null
    ) {
      let finalData = {
        soapNoteId: soapNotesList?.getAllSoapNote?.soapNoteId || 0,
        patientAppointmentId: props?.SlotListingData?.appointmentId,
        subjective: subjectText,
        objective: objectText,
        assessment: assesmentText,
        plan: planText,
      };
      dispatch(
        soapNotesAddOrUpdateAction({ finalData, moveToNext, Notificiation })
      );
    } else {
      toast.error("Please Add Compelete SOAP Notes", TOASTER_STYLING_VALUES);
    }
  }

  function Notificiation(data, condition) {
    condition === "error"
      ? toast.error(data, TOASTER_STYLING_VALUES)
      : toast.success(data, TOASTER_STYLING_VALUES);
  }

  function moveToNext() {
    dispatch(
      getAllSoapNoteAction({
        patientId: props?.SlotListingData?.patientId,
        doctorId: auth?.intely_health_user?.userId,
        appointmentId: props?.SlotListingData?.appointmentId,
      })
    );
  }

  useEffect(() => {
    if (soapNotesList) {
      setAssesmentText(soapNotesList?.getAllSoapNote?.assessment || null);
      setPlanText(soapNotesList?.getAllSoapNote?.plan || null);
      setObjectText(soapNotesList?.getAllSoapNote?.objective || null);
      setSubjectText(soapNotesList?.getAllSoapNote?.subjective || null);
    }
  }, [soapNotesList]);

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card className="notes-data-parent-class">
          <Card.Header className="ps-0">
            <div className="  ms-1 media-query-d-flex">
              <div
                className={`text-center patient-view-tabs   ${
                  key === 1 && "active"
                }`}
                onClick={() => setKey(1)}
              >
                <p className="mb-0 tabs-name-text">{"Subjective"}</p>
              </div>
              <div
                className={` text-center patient-view-tabs  ${
                  key === 2 && "active"
                }`}
                onClick={() => setKey(2)}
              >
                <p className="mb-0 tabs-name-text">{"Objective"}</p>
              </div>

              <div
                className={` text-center patient-view-tabs  ${
                  key === 3 && "active"
                }`}
                onClick={() => setKey(3)}
              >
                <p className="mb-0 tabs-name-text">{"Assessment"}</p>
              </div>
              <div
                className={` text-center patient-view-tabs  ${
                  key === 4 && "active"
                }`}
                onClick={() => setKey(4)}
              >
                <p className="mb-0 tabs-name-text">{"Plan"}</p>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="px-0">
            <div className="row ">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 ">
                {key === 1 && (
                  <SubjectiveBody
                    subjectText={subjectText}
                    setSubjectText={setSubjectText}
                    errors={errors}
                    register={register}
                  />
                )}
                {key === 2 && (
                  <ObjectiveBody
                    objectText={objectText}
                    setObjectText={setObjectText}
                    errors={errors}
                    register={register}
                  />
                )}
                {key === 3 && (
                  <AssesmentBody
                    assesmentText={assesmentText}
                    setassesmentText={setAssesmentText}
                    errors={errors}
                    register={register}
                  />
                )}
                {key === 4 && (
                  <PlanBody
                    planText={planText}
                    setplanText={setPlanText}
                    errors={errors}
                    register={register}
                  />
                )}
              </div>
            </div>
          </Card.Body>
          <div>
            <Button
              type="submit"
              className="next-button next-button-icon ml-2 my-2 cursor"
            >
              Save
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
}
function SubjectiveBody(props) {
  return (
    <div className="">
      <textarea
        id="subjectText"
        name="subjectText"
        className="form-control text-area-size-message"
        placeholder="Consultation notes...."
        rows="10"
        cols="50"
        maxlength="250"
        value={props.subjectText}
        onChange={(e) => {
          props.setSubjectText(e.target.value);
        }}
        style={{
          borderColor:
            props.errors && props.errors.subjectText ? "#a80000" : "",
        }}
        ref={props.register({ required: true })}
      />
      <div className="soap-error-style">
        {props.errors.subjectText && (
          <FieldError message={"This Field is Required"} />
        )}
      </div>
    </div>
  );
}
function ObjectiveBody(props) {
  return (
    <div className="">
      <textarea
        id="objectText"
        name="objectText"
        className="form-control text-area-size-message"
        placeholder="Consultation notes...."
        rows="10"
        cols="50"
        maxlength="250"
        value={props.objectText}
        onChange={(e) => {
          props.setObjectText(e.target.value);
        }}
        style={{
          borderColor: props.errors && props.errors.objectText ? "#a80000" : "",
        }}
        ref={props.register({ required: true })}
      />
      <div className="soap-error-style">
        {props.errors.objectText && (
          <FieldError message={"This Field is Required"} />
        )}
      </div>
    </div>
  );
}
function PlanBody(props) {
  return (
    <div className="">
      <textarea
        id="planText"
        name="planText"
        className="form-control text-area-size-message"
        placeholder="Consultation notes...."
        rows="10"
        cols="50"
        maxlength="250"
        value={props.planText}
        onChange={(e) => {
          props.setplanText(e.target.value);
        }}
        style={{
          borderColor: props.errors && props.errors.planText ? "#a80000" : "",
        }}
        ref={props.register({ required: true })}
      />
      <div className="soap-error-style">
        {props.errors.planText && (
          <FieldError message={"This Field is Required"} />
        )}
      </div>
    </div>
  );
}
function AssesmentBody(props) {
  return (
    <div className="">
      <textarea
        id="assesmentText"
        name="assesmentText"
        className="form-control text-area-size-message"
        placeholder="Consultation notes...."
        rows="10"
        cols="50"
        maxlength="250"
        value={props.assesmentText}
        onChange={(e) => {
          props.setassesmentText(e.target.value);
        }}
        style={{
          borderColor:
            props.errors && props.errors.assesmentText ? "#a80000" : "",
        }}
        ref={props.register({ required: true })}
      />
      <div className="soap-error-style">
        {props.errors.assesmentText && (
          <FieldError message={"This Field is Required"} />
        )}
      </div>
    </div>
  );
}
