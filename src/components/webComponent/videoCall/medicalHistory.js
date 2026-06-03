import React, { useEffect } from "react";
import { Accordion, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BiChevronDown } from "react-icons/bi";
import { RiArrowUpSLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { getAllAllergyHistoryAction } from "../../../app/features/patient/patientInfo/patientAllergyHistory/patientAllergyHistory.slice";
import { getAllCurrentMedicationAction } from "../../../app/features/patient/patientInfo/patientCurrentMedication/patientCurrentMedication.slice";
import { getAllIllnessHistoryAction } from "../../../app/features/patient/patientInfo/patientIllnessHistory/patientIllnessHistory.slice";
import { getAllSocialHistoryAction } from "../../../app/features/patient/patientInfo/patientSocialHistory/patientSocialHistory.slice";
import { getAllPatientSurgeryHistoryAction } from "../../../app/features/patient/patientInfo/patientSurgeryHistory/patientSurgeryHistory.slice";
import { getCurrentTimeZone, Loader1 } from "../../../assets";
import { useAuth } from "../../../Navigation/Auth/ProvideAuth";
export default function MedicalHistory(props) {
  const { handleSubmit } = useForm();
  function onSubmit() {
    // dispatch(UserLogin(data, setCookiesforUser, notification));
  }
  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Accordion
          defaultActiveKey=""
          className="accordian-make-notes-parent my-3 card-height-style"
        >
          <Accordion.Item eventKey="0">
            <Accordion.Header className="accordian-header-text">
              Current Medication
            </Accordion.Header>
            <Accordion.Body>
              <CurrentMedicationBody SlotListingData={props.SlotListingData} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header className="accordian-header-text">
              Disease Hisotry
            </Accordion.Header>
            <Accordion.Body className="mt-4">
              <IllnessHistoryBody SlotListingData={props.SlotListingData} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header className="accordian-header-text">
              Social History
            </Accordion.Header>
            <Accordion.Body>
              <SocialHistoryBody SlotListingData={props.SlotListingData} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header className="accordian-header-text">
              Surgery History
            </Accordion.Header>
            <Accordion.Body>
              <SurgeryHistoryBody SlotListingData={props.SlotListingData} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header className="accordian-header-text">
              Allergies History
            </Accordion.Header>
            <Accordion.Body>
              <AllergiesHistoryBody SlotListingData={props.SlotListingData} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form>
    </div>
  );
}
function CurrentMedicationBody(props) {
  const [collapse, setCollapse] = React.useState({
    value: false,
    index: 0,
  });
  let dispatch = useDispatch();
  let auth = useAuth();
  useEffect(() => {
    dispatch(
      getAllCurrentMedicationAction({
        userId: props?.SlotListingData?.patientId,
        medicationListType: "Past",
        doctorId: 0,
        patientAppointmentId: 0,
      })
    );
  }, [dispatch, props, auth]);

  let { getAllCurrentMedication, isSuccess } = useSelector(
    (state) => state.currentMedication
  );

  return (
    <div className="row">
      {isSuccess === true ? (
        <>
          <div className="div-height-overflow-class me-3">
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
                              <p className="patient-view-dob ">Date</p>
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
                                  <p className="patient-view-dob ">Frequency</p>
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
                                  <p className="patient-view-dob "> Number</p>
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

function IllnessHistoryBody(props) {
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllIllnessHistoryAction(props?.SlotListingData?.patientId));
  }, [dispatch, props]);

  let { getAllIllnessHistory, isSuccess } = useSelector(
    (state) => state.IllnessHistory
  );

  return (
    <div className="row">
      {isSuccess === true ? (
        <>
          <div className="div-height-overflow-class me-3">
            {getAllIllnessHistory.length === 0 ? (
              <p className="table-no-record-style">No Record Found</p>
            ) : (
              <>
                {getAllIllnessHistory?.map((item, index) => {
                  return (
                    <>
                      <Card className="mt-3 margin-left-alignment">
                        <div className="row p-4">
                          <div className="col-lg-4 col-md-4 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Disease Name</p>
                              <p
                                className="patient-view-dob-text mb-0 truncated"
                                data-for="credits"
                                data-tip={item?.diseaseName}
                                data-iscapture="true"
                              >
                                {item.diseaseName}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Treatment</p>
                              <p className="patient-view-dob-text mb-4">
                                {item.treatment}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Description</p>
                              <p
                                className="patient-view-dob-text mb-0 truncated"
                                data-for="credits"
                                data-tip={item?.description}
                                data-iscapture="true"
                              >
                                {item.description}
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
    </div>
  );
}

function SocialHistoryBody(props) {
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSocialHistoryAction(props?.SlotListingData?.patientId));
  }, [dispatch, props]);

  let { getAllSocialHistory, isSuccess } = useSelector(
    (state) => state.socialHistory
  );

  return (
    <div className="row">
      {isSuccess === true ? (
        <>
          <div className="div-height-overflow-class me-3">
            {getAllSocialHistory.length === 0 ? (
              <p className="table-no-record-style">No Record Found</p>
            ) : (
              <>
                {getAllSocialHistory?.map((item, index) => {
                  return (
                    <>
                      <Card className="mt-3 margin-left-alignment">
                        <div className="row p-4">
                          {item.isConsumingTea === true ? (
                            <>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Tea</p>
                                  <p className=" patient-view-dob-text mb-4">
                                    {item.teaConsumingYears}Year
                                  </p>
                                </span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {item.isConsumingCoffee === true ? (
                            <>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Coffe</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item.coffeeConsumingYears}Year
                                  </p>
                                </span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {item.isConsumingCigerattes === true ? (
                            <>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Cigeratte</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item.cigeratteConsumingYears}Year
                                  </p>
                                </span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {item.isConsumingVape === true ? (
                            <>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Vape</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item.vapeConsumingYears}Year
                                  </p>
                                </span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {item.isConsumingAlcohal === true ? (
                            <>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Alcohol</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item.alcohalConsumingYears}Year
                                  </p>
                                </span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {item.isConsumingECTA === true ? (
                            <>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">ECTA</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item.isConsumingECTA}Year
                                  </p>
                                </span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {item.isConsumingLSD === true ? (
                            <>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">LSD</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item.lsdConsumingYears}Year
                                  </p>
                                </span>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {item.isConsumingCannabis === true ? (
                            <>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Cannabis</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item.cannabisConsumingYears}Year
                                  </p>
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

function SurgeryHistoryBody(props) {
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getAllPatientSurgeryHistoryAction(props?.SlotListingData?.patientId)
    );
  }, [dispatch, props]);

  let { getAllPatientSurgeryHistory, isSuccess } = useSelector(
    (state) => state.patientSurgeryHistory
  );

  return (
    <div className="row">
      {isSuccess === true ? (
        <>
          <div className="div-height-overflow-class me-3">
            {getAllPatientSurgeryHistory.length === 0 ? (
              <p className="table-no-record-style">No Record Found</p>
            ) : (
              <>
                {getAllPatientSurgeryHistory?.map((item, index) => {
                  return (
                    <>
                      <Card className="mt-3 margin-left-alignment">
                        <div className="row p-4">
                          <div className="col-lg-2 col-md-2 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob "> Type</p>
                              <p
                                className="patient-view-dob-text mb-0 truncated"
                                data-for="credits"
                                data-tip={item?.surgeryType}
                                data-iscapture="true"
                              >
                                {item.surgeryType}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-2 col-md-2 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob "> Name</p>
                              <p
                                className="patient-view-dob-text mb-0 truncated"
                                data-for="credits"
                                data-tip={item?.surgeonName}
                                data-iscapture="true"
                              >
                                {item.surgeonName}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-2 col-md-2 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob "> Year</p>
                              <p className="patient-view-dob-text mb-4">
                                {item.surgeryYear}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Notes</p>
                              <p
                                className="patient-view-dob-text mb-0 truncated"
                                data-for="credits"
                                data-tip={item?.notes}
                                data-iscapture="true"
                              >
                                {item.notes}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Reason</p>
                              <p
                                className="patient-view-dob-text mb-0 truncated"
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

function AllergiesHistoryBody(props) {
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllAllergyHistoryAction(props?.SlotListingData?.patientId));
  }, [dispatch, props]);

  let { getAllAllergyHistory, isSuccess } = useSelector(
    (state) => state.allergyHistory
  );

  return (
    <div className="row">
      <div className="div-height-overflow-class me-3">
        {getAllAllergyHistory.length === 0 ? (
          <p className="table-no-record-style">No Record Found</p>
        ) : (
          <>
            {getAllAllergyHistory?.map((item, index) => {
              return (
                <>
                  <Card className="mt-3 margin-left-alignment">
                    <div className="row p-4">
                      <div className="col-lg-3 col-md-3 col-sm-12 col-12  ">
                        <span>
                          <p className="patient-view-dob ">Allergy To</p>
                          <p
                            className="patient-view-dob-text mb-0 truncated"
                            data-for="credits"
                            data-tip={item?.allergyTo}
                            data-iscapture="true"
                          >
                            {item.allergyTo}
                          </p>
                        </span>
                      </div>
                      <div className="col-lg-3 col-md-3 col-sm-12 col-12  ">
                        <span>
                          <p className="patient-view-dob ">Reaction</p>
                          <p
                            className="patient-view-dob-text mb-0 truncated"
                            data-for="credits"
                            data-tip={item?.reaction}
                            data-iscapture="true"
                          >
                            {item.reaction}
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
                      <div className="col-lg-3 col-md-3 col-sm-12 col-12  ">
                        <span>
                          <p className="patient-view-dob ">Medication</p>
                          <p
                            className="patient-view-dob-text mb-0 truncated"
                            data-for="credits"
                            data-tip={item?.medicaiton}
                            data-iscapture="true"
                          >
                            {item.medication}
                          </p>
                        </span>
                      </div>
                      <div className="col-lg-3 col-md-3 col-sm-12 col-12  ">
                        <span>
                          <p className="patient-view-dob ">Notes</p>
                          <p
                            className="patient-view-dob-text mb-0 truncated"
                            data-for="credits"
                            data-tip={item?.notes}
                            data-iscapture="true"
                          >
                            {item.notes}
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
    </div>
  );
}
