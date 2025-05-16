export const formStyles = {
  label: {
    fontWeight: "500",
    fontSize: "14px",
    mb: "10px",
    display: "block",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: "30px",
  },
  formContainer: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    mb: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    mb: "30px",
    textAlign: "center",
    color: "#333333",
  },
  button: {
    mt: 2,
    textTransform: "capitalize",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "16px",
    padding: "12px 10px",
    color: "#ffffff !important",
    backgroundColor: "#802928",
    "&:hover": {
      backgroundColor: "#601d1d",
    },
  },
  loginLinkContainer: {
    display: "flex",
    justifyContent: "center",
    mt: "20px",
  },
  loginLink: {
    color: "#f69b9c",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}
