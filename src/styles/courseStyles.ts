const detailStyles = {
  sidebar: {
    width: 1 / 6,
    height: "100vh",
    backgroundColor: "black",
    color: "white",
  },
}
const courseStyles = {
  title: { fontWeight: "bold", my: 4 },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 4,
  },
  searchBox: {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    outline: "none",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff !important",
    p: "10px",
    my: 2,
    flex: 1,
    mr: 2,
    maxWidth: "600px",

    "&:hover": {
      border: "2px solid #e0e0e0",
    },

    "&:focus-within": {
      border: "2px solid #e0e0e0",
    },
  },
  searchInput: {
    outline: "none",
    border: "none",
    width: "100%",
    padding: 3,
    marginLeft: 2,
    color: "#000",
    backgroundColor: "#fff !important",
  },
  filterButton: {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    outline: "none",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff !important",
    p: "10px 20px",
    my: 4,
  },
  filterText: {
    display: { xs: "none", md: "block" },
    fontWeight: "bold",
    mr: 2,
  },
}
export { detailStyles, courseStyles }
