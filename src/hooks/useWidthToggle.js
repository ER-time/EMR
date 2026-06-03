"use client";

import { useState, useEffect } from "react";

const useWidthToggle = (initialWidth, reducedWidth, screenWidthThreshold) => {
  const [width, setWidth] = useState(initialWidth);
  const [screenWidth, setScreenWidth] = useState(null);
  const [isFixedWidth, setIsFixedWidth] = useState(false);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (screenWidth < screenWidthThreshold) {
      setWidth(reducedWidth);
      setIsFixedWidth(true);
    } else {
      setWidth(initialWidth);
      setIsFixedWidth(false);
    }
  }, [screenWidth, initialWidth, reducedWidth, screenWidthThreshold]);

  const toggleWidth = () => {
    if (isFixedWidth) {
      setWidth(initialWidth);
      setIsFixedWidth(false);
    } else {
      setWidth(reducedWidth);
      setIsFixedWidth(true);
    }
  };

  const shouldRenderButton = screenWidth >= screenWidthThreshold;

  return [width, toggleWidth, shouldRenderButton];
};

export default useWidthToggle;
