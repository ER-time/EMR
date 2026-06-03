import { Box } from "@/components";
import Image from "next/image";

export default function VideoCalling() {
  return (
    <Box
      width="100%"
      height="100%"
      sx={{
        position: "relative",
      }}
    >
      <Image
        src={"/images/publisher.png"}
        loading="lazy"
        layout="fill"
        objectFit="contain"
        style={{
          objectFit: "cover",
        }}
        alt="user-img"
      />

      <Image
        src={"/images/subscriber.png"}
        loading="lazy"
        width={300}
        height={200}
        objectFit="contain"
        style={{
          objectFit: "cover",
          position: "absolute",
          bottom: 20,
          right: 20,
          borderRadius: "10px",
        }}
        alt="user-img"
      />
    </Box>
  );
}
