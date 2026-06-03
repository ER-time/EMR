import { DatePicker } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  Accordion,
  Button,
  Card,
  Dropdown,
  FloatingLabel,
  Form,
  Modal,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AiOutlineCloudUpload, AiOutlinePlus } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { RiArrowDropDownLine, RiArrowUpSLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import AWSImageUpload from "../../../app/features/AWSStorage/AWSupload.services";
import {
  addOrUpdateAction,
  getAllDoctorObservationAction,
  getAllLabTestAction,
  getAllPatientVitalAction,
  ObservationAddOrUpdateAction,
  PatientLabTestAddOrUpdateAction,
} from "../../../app/features/doctor/videoConsultation/videoConsultation.slice";
import { getAllMedicineAction } from "../../../app/features/lookUp/lookUp.slice";
import {
  addOrUpdateCurrentMedicationAction,
  getAllCurrentMedicationAction,
} from "../../../app/features/patient/patientInfo/patientCurrentMedication/patientCurrentMedication.slice";
import {
  convertBase64,
  FieldError,
  getCurrentTimeZone,
  IMAGES,
  Loader1,
  LoaderCenter,
} from "../../../assets";
import {
  MEDICATION_ROUTE,
  MEDICINE_DOSE_DATA,
  MEDICINE_FREQUENCY_DATA,
  TOASTER_STYLING_VALUES,
} from "../../../config";
import { useAuth } from "../../../Navigation/Auth/ProvideAuth";
import NotesdataSection from "./notesData";

const moment = require("moment-timezone");

export const MakeNotes = (props) => {
  return (
    <div>
      {" "}
      <div className="row py-3 card-height-style">
        <Accordion defaultActiveKey="" className="accordian-make-notes-parent">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="accordian-header-text">
              Vital
            </Accordion.Header>
            <Accordion.Body>
              <VitalsBody
                dispatch={props.dispatch}
                SlotListingData={props.SlotListingData}
              />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header className="accordian-header-text">
              SOAP notes <span className="text-danger">*</span>
            </Accordion.Header>
            <Accordion.Body>
              <SoapNotesBody SlotListingData={props.SlotListingData} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header className="accordian-header-text">
              Doctor Observation <span className="text-danger">*</span>
            </Accordion.Header>
            <Accordion.Body>
              <DoctorObservationBody SlotListingData={props.SlotListingData} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header className="accordian-header-text">
              Medication
            </Accordion.Header>
            <Accordion.Body className="mt-4">
              <MedicationBody SlotListingData={props.SlotListingData} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header className="accordian-header-text">
              Lab
            </Accordion.Header>
            <Accordion.Body>
              <LabBody SlotListingData={props.SlotListingData} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};
function SoapNotesBody(props) {
  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 col-sm-12 col-12 mb-2">
        <NotesdataSection SlotListingData={props.SlotListingData} />
      </div>
    </div>
  );
}

function VitalsBody(props) {
  const { register, handleSubmit, errors } = useForm();
  let dispatch = useDispatch();
  const [weight, setWeight] = useState(null);
  const [sugarLevel, setSugarLevel] = useState(null);
  const [height, setHeight] = useState(null);
  const [heartRate, setHeartRate] = useState(null);
  const [diastolicPressure, setDiastolicPressure] = useState(null);
  const [systolicPressure, setSystolicPressure] = useState(null);
  useEffect(() => {
    dispatch(
      getAllPatientVitalAction({
        patientId: props?.SlotListingData?.patientId,
        appointmentId: props?.SlotListingData?.appointmentId,
      })
    );
  }, [dispatch, props]);

  let vitalListing = useSelector((state) => state.vital);
  function onSubmit(data) {
    let finalData = {
      patientVitalId: vitalListing?.getAllPatientVital?.patientVitalId || 0,
      patientAppointmentId: props?.SlotListingData?.appointmentId,
      height: parseInt(height),
      weight: parseInt(weight),
      sugarLevel: parseInt(sugarLevel),
      heartRate: parseInt(heartRate),
      bloodPressureSystolic: parseInt(systolicPressure),
      bloodPressureDiastolic: parseInt(diastolicPressure),
    };
    props.dispatch(addOrUpdateAction({ finalData, moveToNext, Notificiation }));
  }

  function Notificiation(data, condition) {
    condition === "error"
      ? toast.error(data, TOASTER_STYLING_VALUES)
      : toast.success(data, TOASTER_STYLING_VALUES);
  }

  function moveToNext() {
    dispatch(
      getAllPatientVitalAction({
        patientId: props?.SlotListingData?.patientId,
        appointmentId: props?.SlotListingData?.appointmentId,
      })
    );
  }

  useEffect(() => {
    if (vitalListing) {
      setSystolicPressure(
        vitalListing?.getAllPatientVital?.bloodPressureSystolic || null
      );
      setDiastolicPressure(
        vitalListing?.getAllPatientVital?.bloodPressureDiastolic || null
      );
      setHeartRate(vitalListing?.getAllPatientVital?.heartRate || null);
      setHeight(vitalListing?.getAllPatientVital?.height || null);
      setSugarLevel(vitalListing?.getAllPatientVital?.sugarLevel || null);
      setWeight(vitalListing?.getAllPatientVital?.weight || null);
    }
  }, [vitalListing]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-lg-4 col-md-6 col-12 col-sm-12 mb-3">
          <FloatingLabel
            controlId="floatingInput"
            label="Weight"
            className=" input-field-position"
          >
            <Form.Control
              name="weight"
              type="number"
              placeholder="Enter Weight"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
              }}
              style={{ borderColor: errors?.weight ? "#a80000" : "" }}
              ref={register({ required: true })}
            />
            {errors?.weight && (
              <FieldError message={"This Field is Required"} />
            )}
          </FloatingLabel>
        </div>
        <div className="col-lg-4 col-md-6 col-12 col-sm-12 mb-3">
          <FloatingLabel
            controlId="floatingInput"
            label="Height"
            className=" input-field-position"
          >
            <Form.Control
              name="height"
              type="number"
              placeholder="Enter Height"
              value={height}
              onChange={(e) => {
                setHeight(e.target.value);
              }}
              style={{ borderColor: errors?.height ? "#a80000" : "" }}
              ref={register({ required: true })}
            />
            {errors?.height && (
              <FieldError message={"This Field is Required"} />
            )}
          </FloatingLabel>
        </div>
        <div className="col-lg-4 col-md-6 col-12 col-sm-12 mb-3">
          <FloatingLabel
            controlId="floatingInput"
            label="Sugar Level"
            className=" input-field-position"
          >
            <Form.Control
              name="sugarLevel"
              type="number"
              placeholder="Enter Sugar Level"
              value={sugarLevel}
              onChange={(e) => {
                setSugarLevel(e.target.value);
              }}
              style={{ borderColor: errors?.sugarLevel ? "#a80000" : "" }}
              ref={register({ required: true })}
            />
            {errors?.sugarLevel && (
              <FieldError message={"This Field is Required"} />
            )}
          </FloatingLabel>
        </div>
        <div className="col-lg-4 col-md-6 col-12 col-sm-12 mb-3">
          <FloatingLabel
            controlId="floatingInput"
            label="Heart Rate"
            className=" input-field-position"
          >
            <Form.Control
              name="heartRate"
              type="number"
              placeholder="Enter Heart Rate"
              value={heartRate}
              onChange={(e) => {
                setHeartRate(e.target.value);
              }}
              style={{ borderColor: errors?.heartRate ? "#a80000" : "" }}
              ref={register({ required: true })}
            />
            {errors?.heartRate && (
              <FieldError message={"This Field is Required"} />
            )}
          </FloatingLabel>
        </div>
        <div className="col-lg-4 col-md-6 col-12 col-sm-12 mb-3">
          <FloatingLabel
            controlId="floatingInput"
            label="Systolic Pressure"
            className=" input-field-position"
          >
            <Form.Control
              name="systolicPressure"
              type="number"
              placeholder="Enter Systolic Pressure"
              value={systolicPressure}
              onChange={(e) => {
                setSystolicPressure(e.target.value);
              }}
              style={{ borderColor: errors?.systolicPressure ? "#a80000" : "" }}
              ref={register({ required: true })}
            />
            {errors?.systolicPressure && (
              <FieldError message={"This Field is Required"} />
            )}
          </FloatingLabel>
        </div>
        <div className="col-lg-4 col-md-6 col-12 col-sm-12 mb-3">
          <FloatingLabel
            controlId="floatingInput"
            label="Diastolic Pressure"
            className=" input-field-position"
          >
            <Form.Control
              name="diastolicPressure"
              type="number"
              placeholder="Enter Blood Pressure"
              value={diastolicPressure}
              onChange={(e) => {
                setDiastolicPressure(e.target.value);
              }}
              style={{
                borderColor: errors?.diastolicPressure ? "#a80000" : "",
              }}
              ref={register({ required: true })}
            />
            {errors?.diastolicPressure && (
              <FieldError message={"This Field is Required"} />
            )}
          </FloatingLabel>
        </div>
        <div>
          <Button
            type="submit"
            className="next-button next-button-icon ml-2 cursor"
          >
            Save
          </Button>
        </div>
      </div>
    </Form>
  );
}

function DoctorObservationBody(props) {
  const { register, handleSubmit, errors } = useForm();
  const [doctorObservation, setDoctorObservation] = useState();
  let dispatch = useDispatch();
  let auth = useAuth();
  useEffect(() => {
    dispatch(
      getAllDoctorObservationAction({
        patientId: props?.SlotListingData?.patientId,
        doctorId: auth?.intely_health_user?.userId,
        appointmentId: props?.SlotListingData?.appointmentId,
      })
    );
  }, [dispatch, props, auth]);
  let observationListing = useSelector((state) => state.vital);

  function onSubmit(data) {
    let finalData = {
      doctorObservationId:
        observationListing?.getAllDoctorObservation?.doctorObservationId || 0,
      patientAppointmentId: props?.SlotListingData?.appointmentId,
      description: doctorObservation,
    };
    dispatch(
      ObservationAddOrUpdateAction({ finalData, moveToNext, Notificiation })
    );
  }

  let { isLoading } = useSelector((state) => state.vital);
  function Notificiation(data, condition) {
    condition === "error"
      ? toast.error(data, TOASTER_STYLING_VALUES)
      : toast.success(data, TOASTER_STYLING_VALUES);
  }

  function moveToNext() {
    dispatch(
      getAllDoctorObservationAction({
        patientId: props?.SlotListingData?.patientId,
        doctorId: auth.intely_health_user.userId,
        appointmentId: props?.SlotListingData?.appointmentId,
      })
    );
  }

  useEffect(() => {
    if (observationListing) {
      setDoctorObservation(
        observationListing?.getAllDoctorObservation?.description || null
      );
    }
  }, [observationListing]);

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-12 col-sm-12 mb-3">
            <textarea
              id="doctorObservation"
              name="doctorObservation"
              className="form-control text-area-size-message"
              placeholder="Your text will be here..."
              rows="4"
              maxlength="250"
              cols="10"
              value={doctorObservation}
              onChange={(e) => {
                setDoctorObservation(e.target.value);
              }}
              style={{
                borderColor:
                  errors && errors.doctorObservation ? "#a80000" : "",
              }}
              ref={register({ required: true })}
            />
            {errors.doctorObservation && (
              <FieldError message={"This Field is Required"} />
            )}
          </div>

          <div>
            {isLoading === true ? (
              <Loader1 />
            ) : (
              <>
                <Button
                  type="submit"
                  className="next-button next-button-icon ml-2 cursor"
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </Form>
    </>
  );
}

function MedicationBody(props) {
  let dispatch = useDispatch();
  let auth = useAuth();
  const [collapse, setCollapse] = React.useState({
    value: false,
    index: 0,
  });
  useEffect(() => {
    dispatch(
      getAllCurrentMedicationAction({
        userId: props?.SlotListingData?.patientId
          ? props?.SlotListingData?.patientId
          : "",
        medicationListType: "Current",
        doctorId: auth?.intely_health_user?.userId,
        patientAppointmentId: props?.SlotListingData?.appointmentId,
      })
    );
  }, [dispatch, props, auth]);

  let { getAllCurrentMedication, isSuccess } = useSelector(
    (state) => state.currentMedication
  );

  const [modalShow, setModalShow] = React.useState(false);
  return (
    <div className="row">
      <CurrentMedicationModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        SlotListingData={props.SlotListingData}
      />
      <div className="text-center">
        <Button
          type="button"
          className="add-button ml-2 d-flex justify-content-between align-items-center cursor m-auto  float-none"
          onClick={() => setModalShow(true)}
        >
          <span className="add-more-class">
            <AiOutlinePlus />
          </span>
          <span className="add-text-in-button">{"Add More"}</span>
        </Button>
      </div>
      {isSuccess === true ? (
        <>
          <div className="div-height-overflow-class me-3 mt-4">
            {getAllCurrentMedication.length === 0 ? (
              <p className="table-no-record-style">No Record Found</p>
            ) : (
              <>
                {getAllCurrentMedication?.map((item, index) => {
                  return (
                    <>
                      <Card className="mt-3 margin-left-alignment">
                        <div className="row p-4">
                          <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">
                                Physician Name
                              </p>
                              <p className=" patient-view-dob-text mb-4">
                                {item.doctorName}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">
                                Prescribed Date
                              </p>
                              <p className="patient-view-dob-text mb-4">
                                {`${
                                  getCurrentTimeZone(item?.prescribedDate).date
                                }`}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Start Date</p>
                              <p className="patient-view-dob-text mb-4">
                                {`${
                                  getCurrentTimeZone(item?.startedUsing).date
                                }`}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Medicine</p>
                              <p
                                className="patient-view-dob-text mb-4 truncated"
                                data-for="credits"
                                data-tip={item?.medicine}
                                data-iscapture="true"
                              >
                                {item.medicine}
                              </p>
                            </span>
                          </div>
                          <>
                            {collapse.value === true &&
                            collapse.index === index ? (
                              <span
                                className="plus-icon-styling"
                                onClick={() =>
                                  setCollapse({ value: false, index: index })
                                }
                              >
                                <RiArrowUpSLine className="fs-3" />
                              </span>
                            ) : (
                              <span
                                className="plus-icon-styling"
                                onClick={() => {
                                  setCollapse({ value: true, index: index });
                                  // setCollapseIndex(index);
                                }}
                              >
                                <BiChevronDown className="fs-3" />
                              </span>
                            )}
                          </>
                          {collapse.value === true &&
                          collapse.index === index ? (
                            <>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Reason</p>
                                  <p
                                    className="patient-view-dob-text mb-4 truncated"
                                    data-for="credits"
                                    data-tip={item?.reason}
                                    data-iscapture="true"
                                  >
                                    {item.reason}
                                  </p>
                                  <ReactTooltip
                                    id="credits"
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                    multiline={true}
                                  />
                                </span>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Dose</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item.dose}
                                  </p>
                                </span>
                              </div>

                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">
                                    Dose frequency
                                  </p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item.doseFrequency}
                                  </p>
                                </span>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Route</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item.route}
                                  </p>
                                </span>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">
                                    {" "}
                                    Contact Number
                                  </p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item.doctorContactNumber}
                                  </p>
                                </span>
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob "> Notes</p>
                                  <p
                                    className="patient-view-dob-text mb-4 truncated"
                                    data-for="credits"
                                    data-tip={item?.notes}
                                    data-iscapture="true"
                                  >
                                    {item.notes}
                                  </p>
                                  <ReactTooltip
                                    id="credits"
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                    multiline={true}
                                  />
                                </span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </Card>
                    </>
                  );
                })}
              </>
            )}
          </div>
        </>
      ) : (
        <Loader1 />
      )}
    </div>
  );
}

function CurrentMedicationModal(props) {
  const { register, handleSubmit, errors } = useForm();
  const [prescribeDate, setPrescribeDate] = useState("");
  const [usingDate, setUsingDate] = useState("");
  const [medication, setMedication] = useState("");
  const [medicationId, setMedicationId] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [dose, setDose] = useState("");
  const [doseId, setDoseId] = useState("");
  const [route, setRoute] = useState("");
  const [routeId, setRouteId] = useState("");
  const [doseFrequency, setDoseFrequency] = useState("");
  const [doseFrequencyId, setDoseFrequencyId] = useState("");
  const [docName, setDocName] = useState("");
  const [docNumber, setDocNumber] = useState("");
  let dispatch = useDispatch();
  let auth = useAuth();

  const PrescribeDate = moment(prescribeDate);
  const UsingDate = moment(usingDate);
  const formattedPrescribedDate = PrescribeDate.format("YYYY-MM-DD");
  const formattedUsingDate = UsingDate.format("YYYY-MM-DD");

  function onSubmitMedication(data) {
    if (
      medicationId &&
      doseId &&
      doseFrequencyId &&
      usingDate &&
      routeId &&
      prescribeDate
    ) {
      let finalData = {
        patientCurrentMedicationId: 0,
        doctorId: auth.intely_health_user.userId,
        patientId: props?.SlotListingData?.patientId,
        patientAppointmentId: props?.SlotListingData?.appointmentId,
        prescribedDate: formattedPrescribedDate,
        startedUsing: formattedUsingDate,
        medicineId: medicationId,
        reason: data.reason,
        doseId: doseId,
        doseFrequencyId: doseFrequencyId,
        doctorName: data.docName,
        doctorContactNumber: data.docNumber,
        notes: data.notes,
        routeId: routeId,
      };
      dispatch(
        addOrUpdateCurrentMedicationAction({
          finalData,
          moveToNext,
          Notificiation,
        })
      );
    } else {
      toast.error("Please Fill the Form ", TOASTER_STYLING_VALUES);
    }
  }
  function Notificiation(data, condition) {
    condition === "error"
      ? toast.error(data, TOASTER_STYLING_VALUES)
      : toast.success(data, TOASTER_STYLING_VALUES);
  }

  function moveToNext() {
    setPrescribeDate(null);
    setUsingDate(null);
    setMedication(null);
    setReason(null);
    setDose(null);
    setDocName(null);
    setRoute(null);
    setDocNumber(null);
    props.onHide();
    dispatch(
      getAllCurrentMedicationAction({
        userId: props?.SlotListingData?.patientId
          ? props?.SlotListingData?.patientId
          : "",
        medicationListType: "Current",
        doctorId: auth.intely_health_user.userId,
        patientAppointmentId: props?.SlotListingData?.appointmentId,
      })
    );
  }

  useEffect(() => {
    dispatch(getAllMedicineAction());
  }, [dispatch]);

  let { getAllMedicine } = useSelector((state) => state.lookUpLanguage);
  const updateSearch = (search) => {
    if (search.length >= 3) dispatch(getAllMedicineAction(search));
  };
  function validateFields(e) {
    e.target.value = e.target.value
      .replace(/[^0-9]/g, "")
      .replace(/(\..*)\./g, "$1");
  }
  function disabledDate(current) {
    // Disable all dates before today
    return current && current < moment(formattedPrescribedDate);
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="modal-header-color">
        <Modal.Title id="contained-modal-title-vcenter">
          Add current medication
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmitMedication)}>
          <div className="row my-4">
            <div className="col-md-6 col-12 mb-3 col-sm-12 col-lg-6 general-info-parent-class">
              <DatePicker
                selected={prescribeDate}
                label="Prescribed Date"
                className="mb-3 input-field-position form-control"
                onChange={(date) => setPrescribeDate(date)}
                withPortal={false}
                placeholder="Prescribed Date"
                readonly={false}
                shouldCloseOnSelect={true}
              />
              {/* <FloatingLabel
                controlId="floatingInput"
                label="Prescribed Date"
                className="input-field-position"
              >
                <Form.Control
                  name="prescribeDate"
                  type="date"
                  placeholder="Enter Prescribe Date"
                  value={prescribeDate}
                  onChange={(e) => {
                    setPrescribeDate(e.target.value);
                  }}
                  style={{
                    borderColor:
                      errors && errors.prescribeDate ? "#a80000" : "",
                  }}
                  ref={register({ required: true })}
                />
                {errors && errors.prescribeDate && (
                  <FieldError message={"This Field is Required"} />
                )}
              </FloatingLabel> */}
            </div>
            <div className="col-md-6 col-12 mb-3 col-sm-12 col-lg-6 general-info-parent-class">
              <DatePicker
                selected={usingDate}
                min={formattedPrescribedDate}
                // min={moment('2022-02-17').format("YYYY-MM-DD")}
                label="Started Using"
                disabledDate={disabledDate}
                className="mb-3 input-field-position form-control"
                onChange={(date) => setUsingDate(date)}
                withPortal={false}
                placeholder="Started Using"
                readonly={false}
                shouldCloseOnSelect={true}
              />
              {/* <FloatingLabel
                controlId="floatingInput"
                label="Started Using"
                className="input-field-position"
              >
                <Form.Control
                  name="usingDate"
                  type="date"
                  min={prescribeDate}
                  placeholder="Enter Using Date"
                  value={usingDate}
                  onChange={(e) => {
                    setUsingDate(e.target.value);
                  }}
                  style={{
                    borderColor: errors && errors.usingDate ? "#a80000" : "",
                  }}
                  ref={register({ required: true })}
                />
                {errors && errors.usingDate && (
                  <FieldError message={"This Field is Required"} />
                )}
              </FloatingLabel> */}
            </div>
            <div className="col-md-6 col-12 mb-3 col-sm-12 col-lg-6 general-info-parent-class medicine-dropdown-parent">
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  name="medication"
                  value={medication}
                  style={{
                    borderColor: props?.errors?.medication ? "#a80000" : "",
                  }}
                  ref={{ required: true }}
                  className="form-label text-left custom-dropdown-generic-css w-100"
                >
                  {medication ? medication : "Select Medicine"}
                  <RiArrowDropDownLine className="dropdown-arrow-styling" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow">
                  <div className="search_field p-2">
                    <Form.Control
                      name="searchLocation"
                      type="text"
                      placeholder="Search by name by atleast 3 characters"
                      autocomplete="off"
                      onChange={(e) => {
                        updateSearch(e.target.value);
                      }}
                      ref={register()}
                    />
                  </div>
                  {getAllMedicine?.map((item, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        name="searchLocation"
                        // onChange={handleChange}
                        onClick={(e) => {
                          setMedication(item.name);
                          setMedicationId(item.medicineId);
                        }}
                      >
                        {item.name}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-md-6 col-12 mb-3 col-sm-12 col-lg-6 general-info-parent-class medicine-dropdown-parent">
              {/* <label>Dose</label> */}
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  name="route"
                  value={route}
                  style={{
                    borderColor: props?.errors?.route ? "#a80000" : "",
                  }}
                  ref={{ required: true }}
                  className="form-label text-left custom-dropdown-generic-css w-100"
                >
                  {route ? route : "Select Route"}
                  <RiArrowDropDownLine className="dropdown-arrow-styling" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow">
                  {MEDICATION_ROUTE?.map((item, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        name="route"
                        // onChange={handleChange}
                        onClick={(e) => {
                          setRoute(item.value);
                          setRouteId(item.lookupId);
                        }}
                      >
                        {item.text}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-md-6 col-12 mb-3 col-sm-12 col-lg-6 general-info-parent-class">
              <FloatingLabel
                controlId="floatingInput"
                label="Reason for taking medicine"
                className="input-field-position"
              >
                <Form.Control
                  name="reason"
                  type="text"
                  placeholder="Enter Reason for taking medicine"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                  }}
                  style={{
                    borderColor: errors && errors.reason ? "#a80000" : "",
                  }}
                  ref={register({ required: true })}
                />
                {errors && errors.reason && (
                  <FieldError message={"This Field is Required"} />
                )}
              </FloatingLabel>
            </div>
            <div className="col-md-6 col-12 mb-3 col-sm-12 col-lg-6 general-info-parent-class">
              <FloatingLabel
                controlId="floatingInput"
                label="Physician Name"
                className="input-field-position"
              >
                <Form.Control
                  name="docName"
                  type="text"
                  placeholder="Enter Physician name"
                  value={docName}
                  onChange={(e) => {
                    setDocName(e.target.value);
                  }}
                  style={{
                    borderColor: errors && errors.docName ? "#a80000" : "",
                  }}
                  ref={register({ required: true })}
                />
                {errors && errors.docName && (
                  <FieldError message={"This Field is Required"} />
                )}
              </FloatingLabel>
            </div>
            <div className="col-md-6 col-12 mb-3 col-sm-12 col-lg-6 general-info-parent-class">
              <FloatingLabel
                controlId="floatingInput"
                label="Doctor Number"
                className="input-field-position"
              >
                <Form.Control
                  name="docNumber"
                  type="text"
                  maxLength="14"
                  onInput={(e) => validateFields(e)}
                  placeholder="Enter Doctor number"
                  value={docNumber}
                  onChange={(e) => {
                    setDocNumber(e.target.value);
                  }}
                  style={{
                    borderColor: errors && errors.docNumber ? "#a80000" : "",
                  }}
                  ref={register({ required: true })}
                />
                {errors && errors.docNumber && (
                  <FieldError message={"This Field is Required"} />
                )}
              </FloatingLabel>
            </div>
            <div className="col-md-6 col-12 mb-3 col-sm-12 col-lg-6 general-info-parent-class medicine-dropdown-parent">
              {/* <label>Dose</label> */}
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  name="dose"
                  value={dose}
                  style={{
                    borderColor: props?.errors?.dose ? "#a80000" : "",
                  }}
                  ref={{ required: true }}
                  className="form-label text-left custom-dropdown-generic-css w-100"
                >
                  {dose ? dose : "Select Dose"}
                  <RiArrowDropDownLine className="dropdown-arrow-styling" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow">
                  {MEDICINE_DOSE_DATA?.map((item, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        name="dose"
                        // onChange={handleChange}
                        onClick={(e) => {
                          setDose(item.value);
                          setDoseId(item.lookupId);
                        }}
                      >
                        {item.text}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-md-6 col-12 mb-3 col-sm-12 col-lg-6 general-info-parent-class medicine-dropdown-parent">
              {/* <label>Dose Frequency</label> */}
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  name="doseFrequency"
                  value={doseFrequency}
                  style={{
                    borderColor: props?.errors?.doseFrequency ? "#a80000" : "",
                  }}
                  ref={{ required: true }}
                  className="form-label text-left custom-dropdown-generic-css w-100"
                >
                  {doseFrequency ? doseFrequency : "Select Frequency"}
                  <RiArrowDropDownLine className="dropdown-arrow-styling" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow">
                  {MEDICINE_FREQUENCY_DATA?.map((item, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        name="doseFrequency"
                        // onChange={handleChange}
                        onClick={(e) => {
                          setDoseFrequency(item.value);
                          setDoseFrequencyId(item.lookupId);
                        }}
                      >
                        {item.text}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-md-6 col-6 mb-3 col-sm-12 col-lg-6 mb-2 general-info-parent-class">
              <FloatingLabel controlId="floatingTextarea2" label="Notes">
                <Form.Control
                  as="textarea"
                  maxlength="200"
                  name="notes"
                  placeholder="Reason of test"
                  style={{ height: "60px" }}
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                  }}
                  ref={register({ required: true })}
                />
              </FloatingLabel>
            </div>
            <div className="d-flex justify-content-center">
              <Button type="submit" className="save-button cursor py-3">
                <span className="sign-in-google-text">{"Save"}</span>
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function LabBody(props) {
  let dispatch = useDispatch();
  let auth = useAuth();
  useEffect(() => {
    dispatch(
      getAllLabTestAction({
        userId: props?.SlotListingData?.patientId
          ? props?.SlotListingData?.patientId
          : "",
        doctorId: auth.intely_health_user.userId,
        appointmentId: props?.SlotListingData?.appointmentId,
      })
    );
  }, [dispatch, props, auth]);
  let { getAllLabTest, isSuccess } = useSelector((state) => state.vital);
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <div className="row">
      <LabModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        SlotListingData={props.SlotListingData}
      />
      <div className="text-center">
        <Button
          type="button"
          className="add-button ml-2 d-flex justify-content-between align-items-center cursor m-auto  float-none"
          onClick={() => setModalShow(true)}
        >
          <span className="add-more-class">
            <AiOutlinePlus />
          </span>
          <span className="add-text-in-button">{"Add More"}</span>
        </Button>
      </div>
      {isSuccess === true ? (
        <>
          <div className="div-height-overflow-class me-3">
            {getAllLabTest.length === 0 ? (
              <p className="table-no-record-style">No Record Found</p>
            ) : (
              <>
                {getAllLabTest?.map((item, index) => {
                  return (
                    <>
                      <Card className="mt-3 margin-left-alignment">
                        <div className="row p-4">
                          <div className="col-lg-3 col-md-6 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Title</p>
                              <p className=" patient-view-dob-text mb-4">
                                {item.testName || "N/A"}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-3 col-md-6 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Date</p>
                              <p className="patient-view-dob-text mb-4">
                                {`${
                                  getCurrentTimeZone(item.recommendationDate)
                                    .date
                                }`}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-3 col-md-6 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Reason</p>
                              <p className="patient-view-dob-text mb-4">
                                {item.reason}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Lab Result</p>
                              <p className="patient-view-dob-text mb-0">
                                <span className="">
                                  {" "}
                                  <img
                                    src={
                                      item?.labTestUrl || IMAGES.NOIMAGEFOUND
                                    }
                                    alt="img"
                                    className="document-image-style"
                                  />
                                </span>
                              </p>
                            </span>
                          </div>
                        </div>
                      </Card>
                    </>
                  );
                })}
              </>
            )}
          </div>
        </>
      ) : (
        <Loader1 />
      )}
      {/* <div className="div-height-overflow-class me-3">
        {getAllLabTest?.map((item, index) => {
          return <></>;
        })}
      </div> */}
    </div>
  );
}

function LabModal(props) {
  const { register, handleSubmit, errors } = useForm();
  const [title, setTitle] = useState();
  const [date, setDate] = useState();
  const [reason, setReason] = useState();
  const [imageUrl, setImageUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  let auth = useAuth();
  let dispatch = useDispatch();

  const labDate = moment(date);
  const formattedlabDate = labDate.format("YYYY-MM-DD");

  function onSubmitLabs(data) {
    if (date) {
      let finalData = {
        patientAppointmentId: props?.SlotListingData?.appointmentId,
        patientLabTestId: 0,
        testName: data.title,
        reason: data.reason,
        recommendationDate: formattedlabDate,
        labTestUrl: imageUrl?.keyName,
      };
      dispatch(
        PatientLabTestAddOrUpdateAction({
          finalData,
          moveToNext,
          Notificiation,
        })
      );
    } else {
      toast.error("Please Fill the Form", TOASTER_STYLING_VALUES);
    }
  }

  // function onSubmitLabs() {
  //   let finalData = {
  //     patientLabTestId: 0,
  //     patientAppointmentId: props?.SlotListingData?.appointmentId,
  //     testName: title,
  //     reason: reason,
  //     recommendationDate: date,
  //   };
  //   dispatch(
  //     PatientLabTestAddOrUpdateAction({
  //       finalData,
  //       moveToNext,
  //       Notificiation,
  //     })
  //   );
  // }
  function Notificiation(data, condition) {
    condition === "error"
      ? toast.error(data, TOASTER_STYLING_VALUES)
      : toast.success(data, TOASTER_STYLING_VALUES);
  }

  function moveToNext() {
    setReason(null);
    setDate(null);
    setTitle(null);
    setImageUrl(null);
    props.onHide();
    dispatch(
      getAllLabTestAction({
        userId: props?.SlotListingData?.patientId
          ? props?.SlotListingData?.patientId
          : "",
        doctorId: auth.intely_health_user.userId,
        appointmentId: props?.SlotListingData?.appointmentId,
      })
    );
  }

  const handleChangeUpload = (e) => {
    let file = e.target.files[0];
    if (file) {
      const lastIndexOfDot = file.name.lastIndexOf(".");
      const name = file.name.slice(0, lastIndexOfDot);
      const ext = file.name.slice(lastIndexOfDot + 1, file.name.length);
      // convertBase64(file, (url) => {
      convertBase64(file).then((url) => {
        setLoading(true);
        const fileData = {
          fileName: name,
          base64address: url,
          extensions: `${ext}`,
        };
        AWSImageUpload(fileData).then((response) => {
          if (response?.httpStatusCode === 200) {
            setImageUrl(response?.data);
            setLoading(false);
          } else {
            // notification.error({
            //   message: response?.message,
            // });
          }
        });
      });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="modal-header-color">
        <Modal.Title id="contained-modal-title-vcenter">
          Add Lab Tests
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmitLabs)}>
          <div className="row my-4">
            <div className="col-md-6 col-12 mb-3 col-sm-12 col-lg-6 general-info-parent-class">
              <FloatingLabel
                controlId="floatingInput"
                label="Title"
                className="input-field-position"
              >
                <Form.Control
                  name="title"
                  type="text"
                  placeholder="Enter Prescribe Date"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  style={{
                    borderColor: errors && errors.title ? "#a80000" : "",
                  }}
                  ref={register({ required: true })}
                />
                {errors && errors.title && (
                  <FieldError message={"This Field is Required"} />
                )}
              </FloatingLabel>
            </div>
            <div className="col-md-6 col-12 mb-3 col-sm-12 col-lg-6 general-info-parent-class">
              <DatePicker
                selected={formattedlabDate}
                label="Date"
                className="mb-3 input-field-position form-control"
                onChange={(date) => setDate(date)}
                withPortal={false}
                placeholder="Date"
                readonly={false}
                shouldCloseOnSelect={true}
              />
            </div>
            <div className="col-md-12 col-12 mb-3 col-sm-12 col-lg-12 textarea-parent-class general-info-parent-class">
              <textarea
                rows="4"
                cols="50"
                name="reason"
                maxlength="250"
                className="form-control"
                placeholder=""
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                style={{
                  borderColor: errors && errors.reason ? "#a80000" : "",
                }}
                ref={register({ required: true })}
              />
              {errors.reason && (
                <FieldError message={"This Field is Required"} />
              )}
            </div>
            <div className="col-md-12 col-12 col-lg-12 mb-3">
              <div className="upload-signature-section border">
                <p className="lab-result-text">
                  Add your lab result files here
                </p>
                <div className="text-center py-2">
                  {loading ? (
                    <LoaderCenter />
                  ) : (
                    <img
                      className="doc-img mt-5"
                      src={imageUrl?.baseUrl || IMAGES.COPY}
                      alt="img"
                      // className="mt-5 mb-4"
                    />
                  )}
                  {/* <img
                    className="doc-img mt-5"
                    src={imageUrl?.baseUrl || IMAGES.COPY}
                    alt="img"
                    // className="mt-5 mb-4"
                  /> */}
                  <div className="mt-4">
                    <label
                      htmlFor="profile_image"
                      className="profile_image_label mb-2 upload-signature-button d-flex justify-content-start align-items-center mx-auto text-white"
                    >
                      <span className="upload-signature-class">
                        <AiOutlineCloudUpload className="signature-upload-svg-size" />
                      </span>
                      <p className="upload-file-text">Upload file</p>
                    </label>
                    <input
                      id="profile_image"
                      className="form-control"
                      type="file"
                      accept="image/*"
                      custom
                      bsCustomPrefix="form-file-input"
                      name="files"
                      data-browse="UPLOAD"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        handleChangeUpload(e);
                      }}
                      // onChange={(e) => onImageChange(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <Button type="submit" className="save-button cursor py-3">
                <span className="sign-in-google-text">{"Save"}</span>
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
