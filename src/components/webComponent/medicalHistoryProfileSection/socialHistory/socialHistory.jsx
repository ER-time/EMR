import { Grid, IconButton, Menu, MenuItem, Select } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MuiTypography from "@/components/core/Typography";
import { Box, Button, GenericModal } from "@/components";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import InputField from "@/components/core/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useDeleteSocialHistoryMutation,
  useGetAllSocialHistoryQuery,
  useSocialHistoryAddOrUpdateMutation,
} from "@/redux/slices/userProfile";
import { BeatLoader } from "react-spinners";
import { getSession } from "next-auth/react";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useGetAllDropdownsQuery } from "@/redux/slices/user";
import Table from "@/components/core/Table";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styled from "styled-components";
import { DeleteModal } from "../..";

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
const INPUT_YEAR_FIELD_STYLES = {
  sx: {
    margin: "0px 0px",
    height: "46px",
    "& fieldset": { border: "1px solid #E2E5ED" },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
  },
};
const columns = [
  {
    header: "Social Addiction",
    accessorKey: "socialAddictionType",
  },
  {
    header: "Duration",
    accessorKey: "duration",
  },
  // {
  //   header: "Existing Condition Duration",
  //   accessorKey: "existingConditionDuration",
  // },
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

export default function SocialHistory() {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [clearFields, setClearFields] = useState(true);
  const [userId, setuserId] = useState(null);
  const [SocialHistory, setSocialHistoryData] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const getAllLookup = useGetAllDropdownsQuery();
  getSession().then((session) => {
    setuserId(session?.user?.user?.userId);
  });

  const handleOpen = () => {
    setSocialHistoryData(null);
    setClearFields(!clearFields);
    setOpen(true);
  };
  const [
    deleteSocialHistory,
    { data: deleteSocialHistoryData, isLoading: deleteSocialHistoryLoading },
  ] = useDeleteSocialHistoryMutation();
  const GetAllSocialHistory = useGetAllSocialHistoryQuery({
    patientId: userId,
  });
  const [socialHistoryAddOrUpdate, { isLoading, isError, error, isSuccess }] =
    useSocialHistoryAddOrUpdateMutation();

  const initialValues = {
    addiction: "",
    year: "",
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      let finalPayload = {
        socialHistoryId: SocialHistory?.socialHistoryId || 0,
        socialAddictionTypeId: values.addiction,
        duration: values.year,
        patientId: userId,
      };
      const resp = await socialHistoryAddOrUpdate(finalPayload).unwrap();
      if (resp?.succeeded === true) {
        dispatch(
          onSuccess({
            message: SocialHistory ?"Record Updated Successfully" :"Record Saved Successfully",
          })
        );
        resetForm();
        handleClose();
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

  const handleDeleteSocial = async () => {
    try {
      const response = await deleteSocialHistory(
        SocialHistory?.socialHistoryId
      ).unwrap();
      if (response.succeeded) {
        dispatch(
          onSuccess({
            message: "Record Deleted Successfully" || "Success",
          })
        );
      }
      setSocialHistoryData(null);
      setDeleteModal(false);
      // onConfirm();
    } catch (error) {
      dispatch(
        onFailure({
          message: "Error While deleting Social History",
        })
      );
    }
  };

  const validationSchema = Yup.object({
    year: Yup.string()
      .required("Field is Required!")
      .matches(/^\d{4}$/, "Year must be a 4-digit number"),
    addiction: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (data, event, cell) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
    setSocialHistoryData(cell?.row?.original);
  };

  const handleEdit = () => {
    setOpen(true);
  };

  useEffect(() => {
    formik.setFieldValue("addiction", SocialHistory?.socialAddictionTypeId);
    formik.setFieldValue("year", SocialHistory?.duration);
  }, [SocialHistory]);
  useEffect(() => {
    formik.setFieldValue("addiction", "");
    formik.setFieldValue("year", "");
  }, [clearFields]);

  return (
    <>
      <Box display="flex" justifyContent="center" my="15px">
        <div>{GetAllSocialHistory?.isLoading && <BeatLoader />}</div>
      </Box>
      <Box
        History
        display="flex"
        justifyContent={`${
          GetAllSocialHistory?.data?.data?.length > 0 ? "flex-end" : "center"
        }`}
        sx={{ mt: 2 }}
      >
        <Button
          variant={`${
            GetAllSocialHistory?.data?.data?.length > 0 ? "" : "outlined"
          }`}
          height="45px"
          radius="12px"
          bg={`${GetAllSocialHistory?.data?.data?.length > 0 ? "#E02828" : ""}`}
          sx={{
            margin: `${
              GetAllSocialHistory?.data?.data?.length > 0
                ? "15px "
                : "15px auto"
            }`,
          }}
          startIcon={
            GetAllSocialHistory?.data?.data?.length > 0 ? "" : <AddIcon />
          }
          onClick={handleOpen}
        >
          Add Social History
        </Button>
      </Box>
      <Grid container spacing={3}>
        {/* {GetAllSocialHistory?.isSuccess && (
          <>
            {GetAllSocialHistory?.data?.data?.map((conditionItem, index) => (
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
                  {conditionItem.socialAddictionType}
                  <span style={{ color: "#666" }}>{`(${
                    conditionItem.duration || "2024"
                  })`}</span>
                </MuiTypography>
              </Grid>
            ))}
          </>
        )} */}
        <Grid item xs={12}>
          {GetAllSocialHistory?.isSuccess && (
            <>
              <Table
                columns={columns}
                data={GetAllSocialHistory?.data?.data || []}
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
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleEdit}>
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
            tittle="Social History"
            
          >
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3} height="250px">
                <Grid item xs={12} md={4}>
                  <Box width="100%">
                    <MuiTypography
                      {...INPUT_LABEL_PROPS}
                      htmlFor="addiction"
                      gutterBottom={true}
                    >
                      Social Addiction
                    </MuiTypography>
                    <Select
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      label=""
                      fullWidth={true}
                      sx={INPUT_FIELD_STYLES.sx}
                      {...formik.getFieldProps("addiction")}
                      MenuProps={{
                        style: {
                          maxHeight: 250,
                        },
                      }}
                    >
                      {getAllLookup?.data?.data
                        ?.filter((item) => item?.type === "SocialAddictionType")
                        ?.map((lookupItem, index) => (
                          <MenuItem key={index} value={lookupItem?.lookupId}>
                            {lookupItem?.value}
                          </MenuItem>
                        ))}
                    </Select>
                    {formik.touched.addiction && formik.errors.addiction ? (
                      <MuiTypography
                        variant="span"
                        component="span"
                        color="#E02828"
                      >
                        {formik.errors.addiction}
                      </MuiTypography>
                    ) : null}
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
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
                      sx={INPUT_YEAR_FIELD_STYLES.sx}
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
                <Box display="flex" justifyContent="flex-end" my="15px">
                  {/* <Button
                    variant="outlined"
                    height="45px"
                    radius="12px"
                    sx={{ mr: 1 }}
                    startIcon={<AddIcon />}
                  >
                    Add Medicine
                  </Button> */}
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
                    ) : SocialHistory ? (
                      "Update"
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Box>
              </Grid>
            </form>
            <div style={{ border: "1px solid #F2F2F2" }}>
              {/* <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                boxSizing="border-box"
                style={{ background: "#F9FAFC", padding: "8px 14px" }}
              >
                <MuiTypography variant="h6" component="h6" fontWeight="500">
                  Allergy
                </MuiTypography>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="contain"
                    bg="none"
                    color="#666666"
                    height="45px"
                    startIcon={<DeleteOutlinedIcon />}
                    radius="12px"
                    className="me-2"
                    style={{ marginRight: "10px" }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contain"
                    bg="none"
                    color="#666666"
                    height="45px"
                    startIcon={<EditOutlinedIcon />}
                    radius="12px"
                  >
                    Edit
                  </Button>
                </div>
              </Box> */}
              {/* <Grid container spacing={3}>
                {GetAllSocialHistory?.isSuccess && (
                  <>
                    {GetAllSocialHistory?.data?.data?.map(
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
                            {conditionItem.socialAddictionType}
                            <span style={{ color: "#666" }}>{`(${
                              conditionItem.duration || "2024"
                            })`}</span>
                          </MuiTypography>
                        </Grid>
                      )
                    )}
                  </>
                )}
              </Grid> */}
            </div>
          </GenericModal>
        )}

        {deleteModal && (
          <DeleteModal
            open={deleteModal}
            handleClose={() => setDeleteModal(false)}
            tittle="Delete Social History"
            onConfirm={handleDeleteSocial}
            loading={deleteSocialHistoryLoading}
          />
        )}
      </Grid>
    </>
  );
}
