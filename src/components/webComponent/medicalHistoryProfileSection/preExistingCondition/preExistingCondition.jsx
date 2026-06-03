import { Grid, IconButton, Menu, MenuItem, Select } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MuiTypography from "@/components/core/Typography";
import { Box, Button, GenericModal } from "@/components";
import AddIcon from "@mui/icons-material/Add";
import InputField from "@/components/core/Input";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styled from "styled-components";
import * as Yup from "yup";
import {
  useDeletePreExistingConditionMutation,
  useGetAllPreExistingConditionQuery,
  usePreExistingConditionAddOrUpdateMutation,
} from "@/redux/slices/userProfile";
import { BeatLoader } from "react-spinners";
import { getSession, useSession } from "next-auth/react";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
import { useDispatch } from "react-redux";
import { useGetAllDropdownsQuery } from "@/redux/slices/user";
import AddPresExistingConditions from "./addPreExistingCondidtionModal";
import Table from "@/components/core/Table";
import { DeleteModal } from "../..";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";

const INPUT_LABEL_PROPS = {
  variant: "subtitle1",
  component: "label",
  fontWeight: "500",
  spacing: "0.1px",
};

const INPUT_FIELD_PROPS = {
  label: "",
  fullWidth: true,
  variant: "standard",
};

const INPUT_FIELD_STYLES = {
  sx: {
    margin: "0px 0px",
    height: "50px",
    "& fieldset": { border: "1px solid #E2E5ED" },
  },
};

const columns = [
  // {
  //   header: "Patient Name",
  //   accessorKey: "patient",
  // },
  {
    header: "Disease Type",
    accessorKey: "diseaseTpye",
  },
  {
    header: "Existing Condition Duration",
    accessorKey: "existingConditionDuration",
  },
  // {
  //   header: "Reason",
  //   accessorKey: "reason",
  // },
];

const StyledMenu = styled(Menu)`
  box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.16);

  && {
    .MuiPaper-elevation {
      min-width: 216px;
      border-radius: 12px;
    }
    .MuiMenu-list li:hover {
      background: #fce9e9;
      color: #e02828;
    }
  }
`;

export default function PreExistingCondition() {
  const [open, setOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleClose = () => setOpen(false);
  const [preMedicalHistoryData, setPreMedicalHistoryData] = useState(null);
  const [clearFields, setClearFields] = useState(false);
  const handleOpen = () => {
    setPreMedicalHistoryData(null);
    setClearFields(!clearFields);
    setOpen(true);
  };

  const handleCloseEditModal = () => setShowEditModal(false);
  const [userId, setuserId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const dispatch = useDispatch();
  const GetAllPreExistingCondition = useGetAllPreExistingConditionQuery({
    patientId: userId,
  });
  const getAllLookup = useGetAllDropdownsQuery();
  getSession().then((session) => {
    setuserId(session?.user?.user?.userId);
  });
  const [
    preExistingConditionAddOrUpdate,
    { isLoading, isError, error, isSuccess },
  ] = usePreExistingConditionAddOrUpdateMutation();

  const [
    deletePreExistingCondition,
    {
      data: deletePreExistingConditionData,
      isLoading: deletePreExistingConditionLoading,
    },
  ] = useDeletePreExistingConditionMutation();

  const initialValues = {
    diseaseType: preMedicalHistoryData
      ? preMedicalHistoryData?.diseaseTypeId
      : "",
    year: "" || preMedicalHistoryData?.existingConditionDuration,
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      let finalPayload = {
        preExistingId: preMedicalHistoryData?.preExistingId || 0,
        diseaseTypeId: values.diseaseType,
        existingConditionDuration: values.year,
        patientId: userId,
      };
      const resp = await preExistingConditionAddOrUpdate(finalPayload).unwrap();
      if (resp?.succeeded === true) {
        handleClose();
        resetForm();
        dispatch(
          onSuccess({
            message: resp?.message || "Success",
          })
        );
      } else {
        dispatch(
          onFailure({
            message: resp?.message || "Failure",
          })
        );
      }
    } catch (err) {
      dispatch(
        onFailure({
          message: resp?.message || "Failure",
        })
      );
    }
  };

  const handleDeleteMedication = async () => {
    try {
      const response = await deletePreExistingCondition(
        preMedicalHistoryData?.preExistingId
      ).unwrap();
      if (response.succeeded) {
        dispatch(
          onSuccess({
            message: "Record Deleted Successfully" || "Success",
          })
        );
      }
      setPreMedicalHistoryData(null);
      setDeleteModal(false);
      // onConfirm();
    } catch (error) {
      dispatch(
        onFailure({
          message: "Error While deleting Pre-Existing Condition",
        })
      );
    }
  };

  const validationSchema = Yup.object({
    diseaseType: Yup.string().required("Field is Required!"),
    year: Yup.string()
      .required("Field is Required!")
      .matches(/^\d{4}$/, "Year must be a 4-digit number")
      .test("is-not-future-year", "Year cannot be in the future", (value) => {
        const currentYear = new Date().getFullYear();
        return parseInt(value) <= currentYear;
      }),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  useEffect(() => {
    formik.setFieldValue("diseaseType", preMedicalHistoryData?.diseaseTypeId);
    formik.setFieldValue(
      "year",
      preMedicalHistoryData?.existingConditionDuration
    );
  }, [preMedicalHistoryData]);
  useEffect(() => {
    formik.setFieldValue("diseaseType", "");
    formik.setFieldValue("year", "");
  }, [clearFields]);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (data, event, cell) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
    setPreMedicalHistoryData(cell?.row?.original);
  };
  const handleEdit = (row) => {
    setOpen(true);
  };

  return (
    <>
      <Box display="flex" justifyContent="center" my="15px">
        <div>{GetAllPreExistingCondition?.isLoading && <BeatLoader />}</div>
      </Box>
      <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          variant={`${
            GetAllPreExistingCondition?.data?.data?.length > 0 ? "" : "outlined"
          }`}
          height="45px"
          radius="12px"
          bg={`${
            GetAllPreExistingCondition?.data?.data?.length > 0 ? "#E02828" : ""
          }`}
          sx={{
            margin: `${
              GetAllPreExistingCondition?.data?.data?.length > 0
                ? "15px "
                : "15px auto"
            }`,
          }}
          startIcon={
            GetAllPreExistingCondition?.data?.data?.length > 0 ? (
              ""
            ) : (
              <AddIcon />
            )
          }
          onClick={handleOpen}
        >
          Add Pre-Existing Condition
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* {GetAllPreExistingCondition?.isSuccess && (
          <>
            {GetAllPreExistingCondition?.data?.data?.map(
              (conditionItem, index) => {
                return (
                  <Grid item xs={12} lg={6} key={index}>
                    <FiberManualRecordIcon
                      sx={{ fontSize: "10px", color: "#348AF4", mr: 1 }}
                    />
                    <MuiTypography
                      variant="subtitle1"
                      color="#333"
                      component="span"
                      fontWeight="300"
                    >
                      {conditionItem.diseaseTpye || "Cancer"}
                      <span style={{ color: "#666" }}>{`(${
                        conditionItem.existingConditionDuration || "2024"
                      })`}</span>
                    </MuiTypography>
                  </Grid>
                );
              }
            )}
          </>
        )} */}
        <Grid item xs={12}>
          {GetAllPreExistingCondition?.isSuccess && (
            <>
              <Table
                columns={columns}
                data={GetAllPreExistingCondition?.data?.data || []}
                enableRowSelection={false}
                enableRowActions={true}
                renderRowActions={({ cell, row }) => (
                  <IconButton
                    disableRipple={true}
                    size="large"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    onClick={(event) => handleOpenUserMenu(row, event, cell)}
                    role="button"
                    tabIndex="0"
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                    color="inherit"
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              />
              <StyledMenu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={anchorElUser}
                onClose={handleCloseUserMenu}
              >
                {/* <MenuItem
              onClick={() => {
                setAnchorElUser(null);
              }}
            >
              <VisibilityIcon sx={{ fontSize: "20px" }} />
              <MuiTypography
                variant="subtitle1"
                fontWeight="400"
                component="span"
                ml={0.5}
              >
                View
              </MuiTypography>
            </MenuItem> */}
                <MenuItem onClick={(row) => handleEdit(row)}>
                  <ModeEditIcon sx={{ fontSize: "20px" }} />
                  <MuiTypography
                    variant="subtitle1"
                    fontWeight="400"
                    component="span"
                    ml={0.5}
                  >
                    Edit
                  </MuiTypography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setDeleteModal(true);
                    setAnchorElUser(null);
                  }}
                >
                  <DeleteIcon sx={{ fontSize: "20px" }} />
                  <MuiTypography
                    variant="subtitle1"
                    fontWeight="400"
                    component="span"
                    ml={0.5}
                  >
                    Delete
                  </MuiTypography>
                </MenuItem>
              </StyledMenu>
            </>
          )}
        </Grid>

        {open && (
          <GenericModal
            show={open}
            onHide={handleClose}
            tittle="Pre-Existing Condition"
          >
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3} height="300px">
                <Grid item xs={12} md={5}>
                  <Box width="100%">
                    <MuiTypography
                      {...INPUT_LABEL_PROPS}
                      htmlFor="reaction"
                      gutterBottom={true}
                    >
                      Disease
                    </MuiTypography>
                    <Select
                      // value={10}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      label=""
                      fullWidth={true}
                      sx={INPUT_FIELD_STYLES.sx}
                      {...formik.getFieldProps("diseaseType")}
                      MenuProps={{
                        style: {
                          maxHeight: 300,
                          maxWidth: 150,
                        },
                      }}
                    >
                      {getAllLookup?.data?.data
                        ?.filter((item) => item?.type === "DiseaseType")
                        ?.map((lookupItem, index) => (
                          <MenuItem key={index} value={lookupItem?.lookupId}>
                            {lookupItem?.value}
                          </MenuItem>
                        ))}
                    </Select>
                    {formik.touched.diseaseType && formik.errors.diseaseType ? (
                      <MuiTypography
                        variant="span"
                        component="span"
                        color="#E02828"
                      >
                        {formik.errors.diseaseType}
                      </MuiTypography>
                    ) : null}
                  </Box>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Box width="100%">
                    <MuiTypography
                      {...INPUT_LABEL_PROPS}
                      htmlFor="year"
                      gutterBottom={true}
                    >
                      Year
                    </MuiTypography>
                    <InputField
                      id="yearId"
                      type="number"
                      name="year"
                      placeholder="2021"
                      {...INPUT_FIELD_PROPS}
                      sx={INPUT_FIELD_STYLES.sx}
                      {...formik.getFieldProps("year")}
                    />
                    {formik.touched.year && formik.errors.year ? (
                      <MuiTypography
                        variant="span"
                        component="span"
                        color="#E02828"
                      >
                        {formik.errors.year}
                      </MuiTypography>
                    ) : null}
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Box display="flex" justifyContent="flex-end" my="15px">
                    <Button
                      type="submit"
                      variant="contain"
                      bg="#E02828"
                      color="#fff"
                      height="45px"
                      radius="12px"
                    >
                      {isLoading ? (
                        <BeatLoader color="#fff" size="10px" />
                      ) : preMedicalHistoryData ? (
                        "Update"
                      ) : (
                        "Save"
                      )}{" "}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
            {/* <div style={{ border: "1px solid #F2F2F2" }}>
              <Grid container spacing={3}>
                {GetAllPreExistingCondition?.isSuccess && (
                  <>
                    {GetAllPreExistingCondition?.data?.data?.map(
                      (conditionItem, index) => (
                        <Grid item xs={12} lg={6} key={index}>
                          <FiberManualRecordIcon
                            sx={{ fontSize: "10px", color: "#348AF4", mr: 1 }}
                          />
                          <MuiTypography
                            variant="subtitle1"
                            color="#333"
                            component="span"
                            fontWeight="300"
                          >
                            {conditionItem.diseaseTpye || "Cancer"}
                            <span style={{ color: "#666" }}>{`(${
                              conditionItem.existingConditionDuration || "2024"
                            })`}</span>
                          </MuiTypography>
                        </Grid>
                      )
                    )}
                  </>
                )}
              </Grid>
            </div> */}
          </GenericModal>
        )}
        {/* {showEditModal && <AddPresExistingConditions />} */}

        {deleteModal && (
          <DeleteModal
            open={deleteModal}
            handleClose={() => setDeleteModal(false)}
            tittle="Delete Pre-Existing Condition"
            onConfirm={handleDeleteMedication}
            loading={deletePreExistingConditionLoading}
          />
        )}
      </Grid>
    </>
  );
}
