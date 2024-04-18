import { Box } from '@mui/material';
import Head from 'next/head';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import ContactLms from '../../components/lms/ContactLms';
import HeaderBanner from '../../components/lms/Headerbanner';
import SchoolLogos from '../../components/lms/SchoolLogos';
import FeatureList from '../../components/lms/feature/FeatureList';
import Pricing from '../../components/lms/pricing/Pricing';

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
      <Box>
        <FeatureList />
        <Pricing />
        <SchoolLogos />
        <ContactLms />
      </Box>
      <Footer />
    </Box>
  );
};
export default Lms;
