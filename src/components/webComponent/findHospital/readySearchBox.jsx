import React, { useState, useRef, useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useJsApiLoader } from "@react-google-maps/api";
import { GOOLE_PLACES_API } from "@/config";

export function SearchBox({
  onSelectAddress,
  currentPage,
  defaultValue,
  ...props
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOLE_PLACES_API,
    libraries: ["places"],
  });

  if (!isLoaded) return null;
  if (loadError) return <div>Error</div>;
  return (
    <ReadySearchBox
      currentPage={currentPage}
      onSelectAddress={onSelectAddress}
      defaultValue={defaultValue}
      {...props}
    />
  );
}

const ReadySearchBox = ({
  onSelectAddress,
  currentPage,
  defaultValue,
  ...props
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { data, status },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300, defaultValue });

  const [showDropdown, setDropdown] = useState(false);
  const divRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // This effect runs only in the browser environment
    const style = document.createElement("style");
    style.textContent = css;
    document.head.append(style);
    return () => {
      // Cleanup the added styles when the component unmounts
      document.head.removeChild(style);
    };
  }, []);

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setDropdown(false);
      onSelectAddress(address, lat, lng);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setDropdown(true);
    if (e.target.value === "") {
      onSelectAddress("", null, null);
    }
  };

  const renderSuggestions = () =>
    data.map((suggestion, index) => {
      const {
        place_id,
        description,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          className={`suggestion-item ${
            index !== data.length - 1 ? "border-b" : ""
          }`}
          key={place_id}
          onClick={() => handleSelect(description)}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div style={{ position: "relative" }}>
      <input
        id="search"
        value={value}
        onChange={handleChange}
        disabled={!ready}
        placeholder="Search Location"
        autoComplete="off"
        style={{
          backgroundColor: currentPage === "map" ? "white" : "",
          width: currentPage === "map" ? "400px" : "95%",
          height: "20px",
          zIndex: 20,
          boxShadow:
            currentPage === "map" ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "",
          padding: "10px",
          borderRadius: currentPage === "map" ? "50px" : "4px",
          border: "1px solid #E6E8E9",
          outline: "none",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontSize: "14px",
        }}
      />
      {showDropdown === true && status === "OK" && (
        <ul ref={divRef} className="dropdown">
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
};

// Add some CSS for the dropdown and suggestions
const css = `
  .dropdown {
  padding-left:0px !important;
    margin-top: 10px;
    border: 1px solid #E6E8E9;
    border-radius: 4px;
    background-color: white;
    padding-top: 10px;
    padding-bottom: 10px;
    list-style-type: none;
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;  /* Prevent horizontal scroll */
    width: 100%;  /* Ensure the width matches the input */
  }
  
  .suggestion-item {
    padding: 8px;
    cursor: pointer;
  }
  
  .suggestion-item:hover {
    background-color: #f0f0f0;
  }
  
  .border-b {
    border-bottom: 1px solid #E6E8E9;
  }
`;

export default SearchBox;
