import { generateMetadata } from "@/app/metadata"
import SignupForm from "@/components/auth/SignupForm"

export const metadata = generateMetadata({
  title: "Horace Learning Management Solution | Horace Member Signup",
  description:
    "Horace Online Courses. STEM focused online courses for all ages. Members Signup",
})

const SignUp = () => {
  return <SignupForm />
}

export default SignUp
