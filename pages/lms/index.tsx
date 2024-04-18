import { Box, Container } from '@mui/material';
import Head from 'next/head';
import Header from '../../components/Header';
import SchoolLogos from '../../components/lms/SchoolLogos';
import ContactLms from '../../components/lms/ContactLms';
import Pricing from '../../components/lms/pricing/Pricing';
import FeatureList from '../../components/lms/feature/FeatureList';
import Footer from '../../components/Footer';
import FooterLte from '../../components/layout/FooterLte';
import HeaderBanner from '../../components/lms/Headerbanner';

const Lms = () => {
  return (
    <Box>
      <Head>
        <title>Horace Learning Management Solution and School ERP</title>
        <meta
          property="og:title"
          content="Horace Learning Management Solution and School ERP"
          key="title"
        />
        <meta
          title="description"
          name="description"
          key="desc"
          content="Horace Learning Management Solution, Online courses, School ERP, LMS"
        />
        <meta
          property="og:description"
          key="desc"
          content="Horace Learning Management Solution, LMS, ERP, Online courses"
        />
      </Head>
      <Header />
      <HeaderBanner />
      <Container>
        <Box>
          <FeatureList />
          <Pricing />
          <SchoolLogos />
          <ContactLms />
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};
export default Lms;
