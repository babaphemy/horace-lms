export const dashboardStyles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: { xs: "column", md: "row" },
    alignItems: "center",
    borderBottom: "1px solid #EEF0F7",
    paddingBottom: "10px",
    my: "20px",
  },
  formControl: {
    minWidth: { xs: "100%", md: 140 },
    width: { xs: "100%", md: "auto" },
    fontSize: "14px",
  },
  select: {
    fontSize: "14px",
  },
  menuItem: {
    fontSize: "14px",
  },
  buttonContainer: {
    gap: "10px",
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
    maxWidth: "600px",
    width: { xs: "100%", md: "auto" },
  },
  button: {
    textTransform: "capitalize",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "13px",
    padding: "8px 20px",
    color: "#fff !important",
    width: { xs: "100%", md: "auto" },
  },
  icon: {
    position: "relative",
    top: "-1px",
  },
  textField: {
    flex: 1,
    maxWidth: "500px",
    mb: { xs: 3, md: 0 },
    mr: { xs: 0, md: 3 },
  },
  addContainer: {
    width: { xs: "100%", md: "auto" },
  },
}
