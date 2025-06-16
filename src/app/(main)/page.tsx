import ContactLms from "@/components/lms/ContactLms"
import HeaderBanner from "@/components/lms/Headerbanner"
import SchoolLogos from "@/components/lms/SchoolLogos"
import FeatureList from "@/components/lms/feature/FeatureList"
import Pricing from "@/components/lms/pricing/Pricing"
import { Box } from "@mui/material"
import { generateMetadata } from "../metadata"
export const metadata = generateMetadata({
  title: "Horace Learning Mamagement Solution",
  description:
    "Horace Learning Management Solution, School Management Solution, School ERP",
})
const Lms = () => {
  return (
    <Box>
      <HeaderBanner />
      <Box>
        <FeatureList />
        <Pricing />
        <SchoolLogos />
        <ContactLms />
      </Box>
    </Box>
  )
}
export default Lms
