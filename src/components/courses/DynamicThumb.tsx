"use client"
import Box from "@mui/material/Box"
import Image from "next/image"
import { useState } from "react"
import { cardStyles } from "../home/PopularCard"

const DynamicThumbnail = ({
  thumbnail,
  title = "Content",
}: {
  thumbnail: string
  title: string
}) => {
  const [imageError, setImageError] = useState(false)

  const bgColors = [
    "#f9d5e5", // Pink
    "#d5f9e5", // Mint
    "#e5d5f9", // Lavender
    "#f9e5d5", // Peach
    "#d5e5f9", // Light Blue
  ]

  const getBgColor = () => {
    if (!title) return bgColors[Math.floor(Math.random() * bgColors.length)]

    const charSum = title
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return bgColors[charSum % bgColors.length]
  }

  const getInitials = () => {
    if (!title) return "?"

    return title
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <Box sx={cardStyles.image}>
      {thumbnail && !imageError ? (
        <Image
          src={`${thumbnail}`}
          width={400}
          height={250}
          alt={title || "Thumbnail image"}
          style={{
            borderRadius: "15px",
            width: "100%",
            height: "20rem",
            objectFit: "cover",
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <svg
          width="400"
          height="250"
          viewBox="0 0 400 250"
          style={{
            borderRadius: "15px",
            width: "100%",
            height: "20rem",
          }}
        >
          <rect width="400" height="250" fill={getBgColor()} rx="15" ry="15" />

          <circle cx="320" cy="50" r="30" fill="rgba(255, 255, 255, 0.2)" />
          <circle cx="80" cy="200" r="40" fill="rgba(255, 255, 255, 0.2)" />

          <path
            d="M30,100 Q100,50 170,120 T300,150"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="8"
            fill="none"
          />

          <text
            x="200"
            y="125"
            fontFamily="Arial, sans-serif"
            fontSize="60"
            fontWeight="bold"
            fill="rgba(80, 80, 80, 0.8)"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {getInitials()}
          </text>

          <text
            x="200"
            y="180"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fill="rgba(80, 80, 80, 0.7)"
            textAnchor="middle"
          >
            {title && title.length > 25
              ? title.substring(0, 22) + "..."
              : title}
          </text>
        </svg>
      )}
    </Box>
  )
}
export default DynamicThumbnail
