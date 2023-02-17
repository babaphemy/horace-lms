import { Box, CircularProgress, Container, Typography } from "@mui/material";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import useAuth from "../../hooks/useAuth";

const Home = () => {
  const [users, loading] = useAuth();
  return (
    <Box>
      <Header />
      <Container>
        {loading && <CircularProgress />}
        <Typography variant="h1">Horace Learning</Typography>
        {users?.map((user: any) => (
          <Typography key={user.id}>{user.email}</Typography>
        ))}
      </Container>
      <Footer />
    </Box>
  );
};

export default Home;
