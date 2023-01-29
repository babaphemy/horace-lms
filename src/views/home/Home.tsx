import { Box, Container, Typography } from "@mui/material";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

const Home = () => {
  return (
    <Box>
      <Header />
      <Container>
        <Typography variant="h1">Horace Learning</Typography>
      </Container>
      <Footer />
    </Box>
  );
};

export default Home;
