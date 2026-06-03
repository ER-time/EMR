import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import { CalendarToday as CalendarIcon } from "@mui/icons-material"; // MUI Calendar Icon

const moment = extendMoment(originalMoment);

// Styled container to position the input and icon
const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Styled calendar icon
const IconWrapper = styled.div`
  position: absolute;
  left: 10px;
  pointer-events: none;
  color: #888;
`;

// Styled input field
const StyledInput = styled.input`
  height: 40px;
  width: 100%;
  padding: 8px 8px 8px 35px;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 16px;
  padding-right: 30px;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border: 1px solid #d9d9d9;
    box-shadow: none;
  }
`;

const CalendarContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: ${(props) => props.width || "310px"};
`;

const DateRangePickerComp = ({ onDateChange, calendarWidth = "310px" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [dateText, setDateText] = useState("");
  const pickerRef = useRef(null);

  const onSelect = (value) => {
    setValue(value);
    setDateText(
      `${value.start.format("YYYY-MM-DD")} - ${value.end.format("YYYY-MM-DD")}`
    );
    if (onDateChange) {
      onDateChange(value.start, value.end);
    }
    setIsOpen(false);
  };

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const clearDate = () => {
    if (isOpen) {
      setIsOpen(false); // Ensure the calendar is closed before clearing
    }
    setValue(null);
    setDateText("");
    if (onDateChange) {
      onDateChange(null, null);
    }
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: "relative" }} ref={pickerRef}>
      <InputContainer>
        <IconWrapper>
          <CalendarIcon sx={{ width: "18px", color: "black" }} />
        </IconWrapper>
        <StyledInput
          type="text"
          value={dateText}
          onClick={onToggle}
          readOnly
          placeholder="Select date range"
        />
        {dateText && (
          <button
            onClick={clearDate}
            style={{
              position: "absolute",
              right: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: "#888",
            }}
          >
            &#x2715;
          </button>
        )}
      </InputContainer>

      {isOpen && (
        <CalendarContainer width={calendarWidth}>
          <DateRangePicker
            value={value}
            onSelect={onSelect}
            singleDateRange={true}
          />
        </CalendarContainer>
      )}
    </div>
  );
};

export default DateRangePickerComp;
