"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

const schema = yup.object().shape({
  schoolName: yup.string().required("School name is required"),
  contactEmail: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  schoolId: yup.string().optional(),
  accountNumber: yup
    .string()
    .required("Account number is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits"),
  bankName: yup.string().required("Bank name is required"),
  accountName: yup.string().required("Account name is required"),
  useOwnGateway: yup.boolean(),
  termsAccepted: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
})

type FormValues = yup.InferType<typeof schema>

const OnlinePayment = () => {
  const [useOwnGateway, setUseOwnGateway] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const prefilled = {
        schoolName: params.get("name") || "",
        contactEmail: params.get("email") || "",
        schoolId: params.get("id") || "",
      }

      reset({ ...prefilled, useOwnGateway: false, termsAccepted: false })
    }
  }, [reset])

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/payment-activation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmissionSuccess(true)
      } else {
        throw new Error("Submission failed")
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  if (submissionSuccess) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 8,
          px: { xs: 2, sm: 6, lg: 8 },
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ maxWidth: 500, mx: "auto" }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Activation Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your payment integration has been successfully activated. You can
              now accept online payments.
            </Typography>
          </Paper>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        px: { xs: 2, sm: 4, lg: 8 },
        bgcolor: "background.default",
      }}
    >
      <Head>
        <title>Online Payment Activation | Horace Learning</title>
        <meta
          name="description"
          content="Activate online tuition payments for your school"
        />
      </Head>

      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Online Payment Activation
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Set up online tuition payments for your school
          </Typography>
        </Box>

        <Card
          sx={{
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          <CardHeader
            title="Payment Gateway Information"
            subheader="Configure how you want to accept online payments"
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Bank Details */}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bank Settlement Details
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="accountNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Account Number"
                        fullWidth
                        error={!!errors.accountNumber}
                        helperText={errors.accountNumber?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="bankName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Bank Name"
                        fullWidth
                        error={!!errors.bankName}
                        helperText={errors.bankName?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="accountName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Account Name"
                        fullWidth
                        error={!!errors.accountName}
                        helperText={errors.accountName?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>

            <Divider />

            {/* Terms and Conditions */}
            <CardContent>
              <Controller
                name="termsAccepted"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">
                          By submitting this form, you agree to the terms and
                          conditions and the information provided above.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          I understand that transaction fees will be passed to
                          the customer and this payment method is optional.
                        </Typography>
                        {errors.termsAccepted && (
                          <Typography color="error" variant="body2">
                            {errors.termsAccepted.message}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                )}
              />
            </CardContent>

            <Divider />
            {/* Payment Gateway Selection */}
            <CardContent>
              <Controller
                name="useOwnGateway"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked)
                          setUseOwnGateway(e.target.checked)
                        }}
                        color="primary"
                      />
                    }
                    label="I will use my own payment gateway integration"
                  />
                )}
              />
              {!useOwnGateway && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    Horace Payment Gateway Details
                  </Typography>
                  <Typography variant="body2">
                    Transaction Fee: 2% + NGN 100 (NGN 100 waived for
                    transactions under ₦2,500)
                  </Typography>
                  <Typography variant="body2">
                    International transactions: 3.9% + NGN 100
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Fees will be added to the customer&apos;s payment amount.
                    Customers will see &apos; Your School via Horace
                    Learning&apos; as the payment recipient.
                  </Typography>
                </Alert>
              )}

              {useOwnGateway && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    Custom Payment Gateway Setup
                  </Typography>
                  <Typography variant="body2">
                    You&apos;ll need to grant developer access to Horace on your
                    payment gateway integration. Our team will contact you after
                    form submission to complete the setup.
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Horace supports integration with all leading payment
                    gateways including Paystack, Flutterwave, Interswitch, Opay,
                    Moniepoint, and others.
                  </Typography>
                </Alert>
              )}
            </CardContent>
            <Divider />

            {/* Submit Button */}
            <CardContent sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || !isValid}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? "Processing..." : "Activate Online Payments"}
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Fee Information Box */}
        <Card sx={{ mt: 4, mx: "auto", maxWidth: 800 }}>
          <CardHeader title="Transaction Fee Details" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2">
                    Local Transactions
                  </Typography>
                  <Typography variant="body2">
                    <Box component="span" fontWeight="bold">
                      2% + NGN 100
                    </Box>{" "}
                    per transaction
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    * NGN 100 fee is waived for transactions under ₦2,500
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2">
                    International Transactions
                  </Typography>
                  <Typography variant="body2">
                    <Box component="span" fontWeight="bold">
                      3.9% + NGN 100
                    </Box>{" "}
                    per transaction
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    * Applies to foreign currency payments
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <Box component="span" fontWeight="bold">
                  Note:
                </Box>{" "}
                The transaction fee will be calculated for each transaction and
                added to the amount the customer is paying. This payment method
                is optional; customers should only use it if they agree with the
                fee.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default OnlinePayment
