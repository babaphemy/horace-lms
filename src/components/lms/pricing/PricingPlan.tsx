import { Plan } from "@/types/types"
import CheckIcon from "@mui/icons-material/Check"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material"
import React from "react"

interface PricingPlanProps {
  plan: Plan
}

const PricingPlan: React.FC<PricingPlanProps> = ({ plan }) => (
  <div className="max-w-sm w-full">
    <Card className="min-h-[36rem] flex flex-col justify-between shadow-lg rounded-2xl">
      <CardHeader
        title={plan.name}
        titleTypographyProps={{ variant: "h4", textAlign: "center" }}
        subheader={
          <Typography
            variant="subtitle1"
            textAlign="center"
            color="text.secondary"
          >
            {plan.description}
          </Typography>
        }
      />
      <CardContent className="flex flex-col items-center">
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          {plan.price}
        </Typography>
        {plan.duration && (
          <Typography variant="body2" color="text.secondary">
            {plan.duration}
          </Typography>
        )}
        <Divider sx={{ my: 3, width: "100%" }} />
        <Stack spacing={2} width="100%">
          {plan.features?.map((feature, index) => (
            <FeatureItem key={index}>{feature}</FeatureItem>
          ))}
        </Stack>
      </CardContent>
      <CardFooter>
        <Button fullWidth variant="contained" size="large" color="primary">
          Choose Plan
        </Button>
      </CardFooter>
    </Card>
  </div>
)

export default PricingPlan

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <CheckIcon color="success" fontSize="small" />
      <Typography variant="body1">{children}</Typography>
    </Stack>
  )
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <CardContent>
      <Stack spacing={2} mt={2}>
        {children}
      </Stack>
    </CardContent>
  )
}
