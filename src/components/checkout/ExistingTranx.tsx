"use client"
import { Plan, TCountryCode, Tranx } from "@/types/types"
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Chip,
} from "@mui/material"
import { formatAmount } from "@/utils/pay"
interface TranxProps {
  data: Tranx[]
  setSelectedTransactions: React.Dispatch<React.SetStateAction<string[]>>
  selectedTransactions: string[]
  selectedTotal: number
  locale: TCountryCode
  planDetail: Plan
}
const ExistingTranx: React.FC<TranxProps> = ({
  data,
  setSelectedTransactions,
  selectedTotal,
  selectedTransactions,
  locale,
  planDetail,
}) => {
  const handleCheckbox = (tranxId: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(tranxId)
        ? prev.filter((id) => id !== tranxId)
        : [...prev, tranxId]
    )
  }
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
        }}
        id="tranx"
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                <TableCell padding="checkbox">Select</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((tranx: Tranx) => (
                <TableRow
                  key={tranx.id}
                  sx={{
                    "& > td": { borderTop: 1, borderColor: "divider" },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        tranx.id
                          ? selectedTransactions.includes(tranx.id)
                          : false
                      }
                      onChange={() => handleCheckbox(tranx.id ?? "")}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{tranx.ref}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{tranx.description}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Plan: {planDetail.name} - {planDetail.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {formatAmount(tranx.amount ?? 0, locale)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tranx.status}
                      size="small"
                      color={
                        tranx.status === "Pending"
                          ? "warning"
                          : tranx.status === "Completed"
                            ? "success"
                            : "default"
                      }
                      sx={{
                        bgcolor:
                          tranx.status === "Pending"
                            ? "warning.100"
                            : tranx.status === "Completed"
                              ? "success.100"
                              : "grey.100",
                        color:
                          tranx.status === "Pending"
                            ? "warning.800"
                            : tranx.status === "Completed"
                              ? "success.800"
                              : "grey.800",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Typography variant="subtitle1" fontWeight="600">
            Selected Total: {formatAmount(selectedTotal, locale)}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  )
}
export default ExistingTranx
