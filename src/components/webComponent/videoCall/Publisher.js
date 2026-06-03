import React, { useState } from "react";
import { OTPublisher } from "opentok-react";
import {
  FaMicrophoneAlt,
  FaMicrophoneAltSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import { useSession } from "next-auth/react";
import { APPOINTMENT_STATUSES, USER_ROLE } from "@/config";
import {
  useAddOrUpdateMutation,
  useEndSessionAndAppointmentMutation,
  useUpdateAppointmentStatusMutation,
} from "@/redux/slices/appointments";
import { useParams, useRouter } from "next/navigation";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
import { BeatLoader } from "react-spinners";

export default function Publisher(props) {
  const [feedbackShowModal, setFeedbackShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const session = useSession();
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();

  const [
    updateAppointmentStatus,
    { data: addUpdateData, isLoading, isError, isSuccess },
  ] = useUpdateAppointmentStatusMutation();
  const [
    endSessionAndAppointment,
    { data, isLoading: endSessionAndAppointmentLoading },
  ] = useEndSessionAndAppointmentMutation();
  console.log("session", session);
  const discounthandler = async () => {
    await props.otSession.current.sessionHelper.session.destroy();
    setFeedbackShowModal(true);
  };

  const discounthandlerEnd = async () => {
    try {
      const payload = {
        appointmentId: params?.appointment,
        // statusId: APPOINTMENT_STATUSES.COMPLETED,
      };
      const resp = await endSessionAndAppointment(payload).unwrap();

      if (resp?.succeeded === true) {
        await props.otSession.current.sessionHelper.session.destroy();
        dispatch(
          onSuccess({
            message: "Call ended" || "Success",
          })
        );
        router.push("/doctor/appointments");
      } else {
        dispatch(
          onFailure({
            message:
              session.data?.user?.user?.roleId === USER_ROLE.doctor
                ? "Please add SOAP notes and HOPI."
                : "Please wait for the doctor to add SOAP notes and HOPI before leaving.",
          })
        );
      }
    } catch (error) {
      dispatch(
        onFailure({
          message: error.message || "Failure",
        })
      );
    }
  };

  const onError = (err) => {
    setError(`Failed to subscribe: ${err.message}`);
  };

  let ref = React.useRef();

  return (
    <div className="publisher--container">
      <OTPublisher
        ref={ref}
        properties={{
          subscribeToAudio: audio,
          subscribeToVideo: video,
          publishAudio: audio,
          publishVideo: video,
          resolution: "1280x720",
          frameRate: 30,
        }}
        onError={onError}
      />
      <div className="handler-row">
        <div className="randox-div">
          <div className="position_set">
            <div className="">
              {audio ? (
                <FaMicrophoneAlt
                  className="strem--controls-icon cursor m-2"
                  size={24}
                  onClick={() => setAudio(false)}
                />
              ) : (
                <FaMicrophoneAltSlash
                  className="strem--controls-icon cursor m-2"
                  size={24}
                  onClick={() => setAudio(true)}
                />
              )}
              {/* {session?.data?.user?.user?.roleId === USER_ROLE?.doctor && ( */}
              <span className="appointment-last-span">
                <React.Fragment>
                  <div
                    className="end_call"
                    onClick={async () => {
                      discounthandlerEnd();
                    }}
                  >
                    {endSessionAndAppointmentLoading ? (
                      <BeatLoader />
                    ) : (
                      <MdCallEnd />
                    )}
                  </div>
                </React.Fragment>
              </span>
              {/* )} */}
              {video ? (
                <Box
                // sx={{
                //   ml:
                //     session?.data?.user?.user?.roleId === USER_ROLE?.patient
                //       ? 3
                //       : 0,
                // }}
                >
                  <FaVideo
                    sx={{ pl: "200px" }}
                    className="strem--controls-icon cursor m-2"
                    size={24}
                    onClick={() => setVideo(false)}
                  />
                </Box>
              ) : (
                <Box
                // sx={{
                //   ml:
                //     session?.data?.user?.user?.roleId === USER_ROLE?.patient
                //       ? 3
                //       : 0,
                // }}
                >
                  <FaVideoSlash
                    className="strem--controls-icon cursor m-2"
                    size={24}
                    onClick={() => setVideo(true)}
                  />
                </Box>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
