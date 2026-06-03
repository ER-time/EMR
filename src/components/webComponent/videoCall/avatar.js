import React, { useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
// import { IMAGES } from "../../../assets";

export default function Avatar() {
  const [buttonList, setButtonList] = useState([]);
  const [buttonAdd, setButtonAdd] = useState(true);
  const [buttonModal, setButtonModal] = useState(false);
  const [buttonAxis, setButtonAxis] = useState();
  const [indexEditButton, setIndexEditButton] = useState();
  const [editButton, setEditButton] = useState(false);

  const [buttonListBack, setButtonListBack] = useState([]);
  const [buttonAddBack, setButtonAddBack] = useState(true);
  const [buttonModalBack, setButtonModalBack] = useState(false);
  const [buttonAxisBack, setButtonAxisBack] = useState();
  const [indexEditButtonBack, setIndexEditButtonBack] = useState();
  const [editButtonBack, setEditButtonBack] = useState(false);
  const [frontImage, setFrontImage] = useState("Front");

  const NewFunction = (e) => {
    if (buttonAdd) {
      let rect = e.target.getBoundingClientRect();
      setButtonModal(true);
      let button = {
        top: e.clientY - rect.top - 6,
        right: rect.right - e.clientX - 8,
      };
      setButtonAxis(button);
    }
  };
  const NewFunctionBack = (e) => {
    if (buttonAddBack) {
      let rect = e.target.getBoundingClientRect();
      setButtonModalBack(true);
      let button = {
        top: e.clientY - rect.top - 6,
        right: rect.right - e.clientX - 8,
      };
      setButtonAxisBack(button);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex col-12 justify-content-center">
        {/* <div className="mt-0">
          <Button className="float-right ms-2 avatar-btn-parent" type="submit">
            Save
          </Button>
          <Button
            className="float-right cancel-btn-generic-class btn btn-secondary"
            name="delete"
          >
            Delete
          </Button>
        </div> */}
        <div className="col-12 p-4 bg-white m-3">
          <>
            <span
              className="me-2 mb-3 span-class-style"
              onClick={() => setFrontImage("Front")}
            >
              {" "}
              Front
            </span>
            <span
              className="mr-1 mb-3 span-class-style"
              onClick={() => setFrontImage("Back")}
            >
              {" "}
              Back
            </span>
            {frontImage === "Front" ? (
              <>
                <div className="float-center Nav-scrollbar-check">
                  <div
                    style={{
                      position: "relative",
                    }}
                    onClick={NewFunction}
                  >
                    <img
                      src={"IMAGES.FRONTBODY"}
                      alt="picture1"
                      className="pointing-image-size"
                      // onClick={NewFunction}
                      // onClick={() => setButtonAdd(buttonAdd)}
                    />
                    {buttonList &&
                      buttonList.map((item, index) => (
                        <div key={index}
                          className="text-center"
                          style={{
                            position: "absolute",
                            top: item.top + "px",
                            right: item.right + "px",
                            backgroundColor: "blue",
                            borderRadius: "200px",
                            width: "1.3rem",
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setEditButton(true);
                            setIndexEditButton(index);
                            setButtonModal(true);
                          }}
                        >
                          {index + 1}
                        </div>
                      ))}
                  </div>
                </div>
                <ButtonPopUp
                  buttonModal={buttonModal}
                  setButtonModal={setButtonModal}
                  setButtonList={setButtonList}
                  buttonList={buttonList}
                  buttonAxis={buttonAxis}
                  setEditButton={setEditButton}
                  editButton={editButton}
                  indexEditButton={indexEditButton}
                />
              </>
            ) : (
              <>
                <div className="float-center Nav-scrollbar-check">
                  <div
                    style={{
                      position: "relative",
                    }}
                    onClick={NewFunctionBack}
                  >
                    <img
                      src={"IMAGES.BACKBODY"}
                      alt="picture1"
                      className="pointing-image-size"
                      onClick={() => setButtonAddBack(buttonAddBack)}
                    />
                    {buttonListBack &&
                      buttonListBack.map((item, index) => (
                        <div key={index}
                          className="text-center"
                          style={{
                            position: "absolute",
                            top: item.top + "px",
                            right: item.right + "px",
                            backgroundColor: "blue",
                            borderRadius: "200px",
                            width: "1.3rem",
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setEditButtonBack(!editButtonBack);
                            setIndexEditButtonBack(index);
                            setButtonModalBack(true);
                          }}
                        >
                          {index + 1}
                        </div>
                      ))}
                  </div>
                </div>
                <ButtonPopUpBack
                  buttonModalBack={buttonModalBack}
                  setButtonModalBack={setButtonModalBack}
                  setButtonListBack={setButtonListBack}
                  buttonListBack={buttonListBack}
                  buttonAxisBack={buttonAxisBack}
                  setEditButtonBack={setEditButtonBack}
                  editButtonBack={editButtonBack}
                  indexEditButtonBack={indexEditButtonBack}
                />
              </>
            )}
          </>
        </div>
      </div>
      {/* <ButtonPopUp
        buttonModal={buttonModal}
        setButtonModal={setButtonModal}
        setButtonList={setButtonList}
        buttonList={buttonList}
        buttonAxis={buttonAxis}
        setEditButton={setEditButton}
        editButton={editButton}
        indexEditButton={indexEditButton}
      /> */}
    </React.Fragment>
  );
}
function ButtonPopUp({
  buttonModal,
  setButtonModal,
  setButtonList,
  buttonList,
  buttonAxis,
  editButton,
  indexEditButton,
  setEditButton,
}) {
  const { register, handleSubmit } = useForm();
  const OnHandleSubmit = (data) => {
    if (!editButton) {
      let button = { ...buttonAxis, text: data.text };
      setButtonList([...buttonList, button]);
    } else {
      setButtonList([...buttonList]);
    }
    setButtonModal(false);
  };
  function onChangeText(value) {
    let navValue = [...buttonList];
    navValue[indexEditButton].text = value;
    setButtonList(navValue);
  }
  function OnDelete() {
    let tempList = [...buttonList];
    tempList.splice(indexEditButton, 1);
    setButtonList([...tempList]);
    setButtonModal(false);
    setEditButton(false);
  }
  return (
    <Modal
      show={buttonModal}
      onHide={() => {
        setButtonModal(false);
        setEditButton(false);
      }}
    >
      {editButton ? (
        <>
          <Modal.Header closeButton>
            <h3>Edit Disease</h3>
          </Modal.Header>
        </>
      ) : (
        <>
          <Modal.Header closeButton>
            <h3>Add Disease</h3>
          </Modal.Header>
        </>
      )}
      <Modal.Body>
        {editButton ? (
          <>
            <Form onSubmit={handleSubmit(OnHandleSubmit)}>
              <FloatingLabel
                controlId="floatingInput"
                label="Enter Your Disease"
                className=" input-field-position"
              >
                <Form.Control
                  type="text"
                  name="text"
                  placeholder="Enter Your Disease"
                  value={buttonList[indexEditButton].text}
                  onChange={(e) => onChangeText(e.target.value)}
                  ref={register({
                    required: true,
                  })}
                />
              </FloatingLabel>
              {/* <Form.Group>
                <Form.Label>Text :</Form.Label>
                <Form.Control
                  type="text"
                  name="text"
                  placeholder="Enter Your Disease"
                  value={buttonList[indexEditButton].text}
                  onChange={(e) => onChangeText(e.target.value)}
                  ref={register({
                    required: true,
                  })}
                />
              </Form.Group> */}
              <div className="mt-4">
                <Button
                  className="float-right ms-2 avatar-btn-parent"
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  className="float-right cancel-btn-generic-class btn btn-secondary"
                  name="delete"
                  onClick={() => {
                    OnDelete();
                  }}
                >
                  Delete
                </Button>
              </div>
            </Form>
          </>
        ) : (
          <Form onSubmit={handleSubmit(OnHandleSubmit)}>
            <FloatingLabel
              controlId="floatingInput"
              label="Enter Your Disease"
              className=" input-field-position"
            >
              <Form.Control
                name="text"
                type="text"
                placeholder="Degree name"
                ref={register({ required: true })}
              />
            </FloatingLabel>
            {/* <Form.Group>
              <Form.Label>Text :</Form.Label>
              <Form.Control
                type="text"
                name="text"
                ref={register({
                  required: true,
                })}
              />
            </Form.Group> */}
            <Button
              className="float-right mt-2 avatar-btn-parent btn-primary"
              // style={{
              //   backgroundColor: "#1E5C89",
              //   borderColor: "#1E5C89",
              // }}
              type="submit"
            >
              Save
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
function ButtonPopUpBack({
  buttonModalBack,
  setButtonModalBack,
  setButtonListBack,
  buttonListBack,
  buttonAxisBack,
  editButtonBack,
  indexEditButtonBack,
  setEditButtonBack,
}) {
  const { register, handleSubmit } = useForm();
  const OnHandleSubmit = (data) => {
    if (!editButtonBack) {
      let button = { ...buttonAxisBack, text: data.text };
      setButtonListBack([...buttonListBack, button]);
    } else {
      setButtonListBack([...buttonListBack]);
    }
    setButtonModalBack(false);
  };
  function onChangeText(value) {
    let navValue = [...buttonListBack];
    navValue[indexEditButtonBack].text = value;
    setButtonListBack(navValue);
  }
  function OnDelete() {
    let tempList = [...buttonListBack];
    tempList.splice(indexEditButtonBack, 1);
    setButtonListBack([...tempList]);
    setButtonModalBack(false);
    setEditButtonBack(false);
  }
  return (
    <Modal show={buttonModalBack} onHide={() => setButtonModalBack(false)}>
      {editButtonBack ? (
        <>
          <Modal.Header closeButton>
            <h3>Edit Disease</h3>
          </Modal.Header>
        </>
      ) : (
        <>
          <Modal.Header closeButton>
            <h3>Add Disease</h3>
          </Modal.Header>
        </>
      )}
      <Modal.Body>
        {editButtonBack ? (
          <>
            <Form onSubmit={handleSubmit(OnHandleSubmit)}>
              <FloatingLabel
                controlId="floatingInput"
                label="Enter Your Disease"
                className=" input-field-position"
              >
                <Form.Control
                  type="text"
                  name="text"
                  placeholder="Degree name"
                  value={buttonListBack[indexEditButtonBack].text}
                  onChange={(e) => onChangeText(e.target.value)}
                  ref={register({
                    required: true,
                  })}
                />
              </FloatingLabel>
              {/* <Form.Group>
                <Form.Label>Text :</Form.Label>
                <Form.Control
                  type="text"
                  name="text"
                  placeholder="Enter Your Disease"
                  value={buttonList[indexEditButton].text}
                  onChange={(e) => onChangeText(e.target.value)}
                  ref={register({
                    required: true,
                  })}
                />
              </Form.Group> */}
              <div className="mt-4">
                <Button
                  className="float-right ms-2 avatar-btn-parent"
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  className="float-right cancel-btn-generic-class btn btn-secondary"
                  name="delete"
                  onClick={() => {
                    OnDelete();
                  }}
                >
                  Delete
                </Button>
              </div>
            </Form>
          </>
        ) : (
          <Form onSubmit={handleSubmit(OnHandleSubmit)}>
            <FloatingLabel
              controlId="floatingInput"
              label="Enter Your Disease"
              className=" input-field-position"
            >
              <Form.Control
                name="text"
                type="text"
                placeholder="Degree name"
                ref={register({ required: true })}
              />
            </FloatingLabel>
            {/* <Form.Group>
              <Form.Label>Text :</Form.Label>
              <Form.Control
                type="text"
                name="text"
                ref={register({
                  required: true,
                })}
              />
            </Form.Group> */}
            <Button
              className="float-right mt-2 avatar-btn-parent btn-primary"
              // style={{
              //   backgroundColor: "#1E5C89",
              //   borderColor: "#1E5C89",
              // }}
              type="submit"
            >
              Save
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
