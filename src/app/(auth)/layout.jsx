"use client";

import { Box } from "@/components";
import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div>
      <Image
        src={"/images/sign-in-bg.png"}
        loading="eager"
        layout="fill"
        objectFit="cover"
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
        objectPosition="center"
        alt="user-img"
      />
      <Box
        bgcolor="rgba(224, 40, 40, .7)"
        minHeight="100vh"
        height="100%"
        width="100%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Box
          bgcolor="#fff"
          maxWidth="600px"
          width="100%"
          height="100%"
          minHeight="85vh"
          mx="50px"
          my="20px"
          borderRadius="12px"
          p="30px"
          display="flex"
          justifyContent="space-evenly"
          flexDirection="column"
        >
          <div style={{ position: "relative", height: "130px" }}>
            <Image
              src={"/images/medical-ai-full-logo.png"}
              loading="eager"
              layout="fill"
              objectFit="contain"
              style={{
                objectFit: "contain",
              }}
              alt="user-img"
            />
          </div>
          {children}
        </Box>
      </Box>
    </div>
  );
}
