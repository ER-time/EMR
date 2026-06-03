import React, { useEffect } from "react";
import { Accordion, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmergencyContactAction } from "../../../app/features/patient/patientInfo/patientEmergencyContact/patientEmergencyContact.slice";
import { getPatientPersonalInfoByIdAction } from "../../../app/features/patient/patientInfo/patientGeneralInfo/patientGeneralInfo.slice";
import { getAllPatientGuardianAction } from "../../../app/features/patient/patientInfo/patientGuardian/patientGuardian.slice";
import { Loader1 } from "../../../assets";
export default function PatientInfo(props) {
  return (
    <div>
      <div className="row py-3 card-height-style">
        <Accordion
          defaultActiveKey=""
          className="accordian-make-notes-parent my-3"
        >
          <Accordion.Item eventKey="0">
            <Accordion.Header className="accordian-header-text">
              Personal inforamtion
            </Accordion.Header>
            <Accordion.Body>
              <PersonalInformationBody
                SlotListingData={props?.SlotListingData}
              />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header className="accordian-header-text">
              Emergency contacts
            </Accordion.Header>
            <Accordion.Body className="mt-4">
              <EmergencyContactBody SlotListingData={props?.SlotListingData} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header className="accordian-header-text">
              Patient guardian
            </Accordion.Header>
            <Accordion.Body>
              <PatientGuardianBody SlotListingData={props?.SlotListingData} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}
function PersonalInformationBody(props) {
  let dispatch = useDispatch();
  useEffect(() => {
    if (props?.SlotListingData?.appointmentId) {
      dispatch(
        getPatientPersonalInfoByIdAction(props?.SlotListingData?.patientId)
      );
    }
  }, [dispatch, props]);
  let { getPatientPersonalInfoById, isSuccess } = useSelector(
    (state) => state.patientPersonalInfo
  );
  let patientinfoArray = [];
  patientinfoArray.push(getPatientPersonalInfoById);
  return (
    <div className="row">
      <div className="div-height-overflow-class me-3">
        {isSuccess === true ? (
          <>
            <div className="div-height-overflow-class me-3">
              {patientinfoArray?.length > 0 ? (
                <>
                  {patientinfoArray &&
                    patientinfoArray?.map((item, index) => {
                      return (
                        <>
                          <Card key={index} className=" margin-left-alignment">
                            <div className="row p-4">
                              <div className="col-lg-3 col-md-6 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">
                                    {" "}
                                    First Name
                                  </p>
                                  <p className=" patient-view-dob-text mb-4">
                                    {item?.firstName}
                                  </p>
                                </span>
                              </div>
                              <div className="col-lg-3 col-md-6 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Last Name</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item?.lastName}
                                  </p>
                                </span>
                              </div>
                              <div className="col-lg-3 col-md-6 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">DOB</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item?.dateOfBirth
                                      ? item?.dateOfBirth.split("T")[0]
                                      : "N/A"}
                                  </p>
                                </span>
                              </div>
                              {/* <div className="col-lg-3 col-md-6 col-sm-12 col-12 ">
                             <span>
                               <p className="patient-view-dob ">Email</p>
                               <p className="patient-view-dob-text mb-4">
                                 {item?.email}
                               </p>
                             </span>
                           </div> */}
                              <div className="col-lg-3 col-md-6 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Gender</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item?.gender}
                                  </p>
                                </span>
                              </div>
                              <div className="col-lg-3 col-md-6 col-sm-12 col-12 ">
                                <span>
                                  <p className="patient-view-dob ">Phone</p>
                                  <p className="patient-view-dob-text mb-4">
                                    {item?.phoneNumber}
                                  </p>
                                </span>
                              </div>
                            </div>
                          </Card>
                        </>
                      );
                    })}
                </>
              ) : (
                <p className="table-no-record-style">No Record Found</p>
              )}
            </div>
          </>
        ) : (
          <Loader1 />
        )}
      </div>
    </div>
  );
}

function PatientGuardianBody(props) {
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getAllPatientGuardianAction({
        userId: props?.SlotListingData?.patientId,
      })
    );
  }, [dispatch, props]);

  let { getAllPatientGuardian, isSuccess } = useSelector(
    (state) => state.patientGuardian
  );

  return (
    <div className="row">
      {isSuccess === true ? (
        <>
          <div className="div-height-overflow-class me-3">
            {getAllPatientGuardian.length === 0 ? (
              <p className="table-no-record-style">No Record Found</p>
            ) : (
              <>
                {getAllPatientGuardian?.map((item, index) => {
                  return (
                    <>
                      <Card className=" margin-left-alignment">
                        <div className="row p-4">
                          <div className="col-lg-6 col-xl-4   col-md-2 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob "> Name</p>
                              <p className=" patient-view-dob-text mb-4">
                                {item.fullName}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-6 col-xl-4   col-md-2 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Relationship</p>
                              <p className="patient-view-dob-text mb-4">
                                {item.relationship}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-6 col-xl-4   col-md-2 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Work Contact</p>
                              <p className="patient-view-dob-text mb-4">
                                {item.workContact}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-6 col-xl-4   col-md-2 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Home Contact</p>
                              <p className="patient-view-dob-text mb-4">
                                {item.homeContact}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-6 col-xl-4   col-md-2 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Country</p>
                              <p className="patient-view-dob-text mb-4">
                                {item.country}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-6 col-xl-4   col-md-2 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">State</p>
                              <p className="patient-view-dob-text mb-4">
                                {item.state}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-6 col-xl-4   col-md-2 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">City</p>
                              <p className="patient-view-dob-text mb-4">
                                {item.city}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-6 col-xl-4   col-md-2 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Zip Code</p>
                              <p className="patient-view-dob-text mb-4">
                                {item.zipCode}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-6 col-md-4 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Address</p>
                              <p className="patient-view-dob-text mb-4">
                                {item.address}
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

function EmergencyContactBody(props) {
  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getAllEmergencyContactAction({
        userId: props?.SlotListingData?.patientId,
      })
    );
  }, [dispatch, props]);
  let { getAllEmergencyContact, isSuccess } = useSelector(
    (state) => state.patientEmergencyContact
  );

  return (
    <div className="row">
      {isSuccess === true ? (
        <>
          <div className="div-height-overflow-class me-3">
            {getAllEmergencyContact.length === 0 ? (
              <p className="table-no-record-style">No Record Found</p>
            ) : (
              <>
                {getAllEmergencyContact?.map((item, index) => {
                  return (
                    <>
                      <Card className=" margin-left-alignment">
                        <div className="row p-4">
                          <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Full Name</p>
                              <p
                                className=" patient-view-dob-text mb-0 truncated"
                                data-for="credits"
                                data-tip={item?.fullName}
                                data-iscapture="true"
                              >
                                {item.fullName}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Email</p>
                              <p
                                className="patient-view-dob-text mb-0 truncated"
                                data-for="credits"
                                data-tip={item?.email}
                                data-iscapture="true"
                              >
                                {item.email}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Contact</p>
                              <p
                                className="patient-view-dob-text mb-0 truncated"
                                data-for="credits"
                                data-tip={item?.phoneNumber}
                                data-iscapture="true"
                              >
                                {item.phoneNumber}
                              </p>
                            </span>
                          </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-12 ">
                            <span>
                              <p className="patient-view-dob ">Relationship</p>
                              <p className="patient-view-dob-text mb-0">
                                {item.relationship}
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
