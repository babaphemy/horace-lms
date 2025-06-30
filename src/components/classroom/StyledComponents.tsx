import { styled, Card, Box, Paper } from "@mui/material"

export const MainCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: theme.shadows[3],
  maxWidth: 1200,
  margin: "0 auto",
}))

export const ContentContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  marginBottom: theme.spacing(3),
}))

export const MaterialItem = styled(Paper)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[100],
  marginBottom: theme.spacing(1),
}))
