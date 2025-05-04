export interface State {
  loading: boolean
  user?: tUser | {}
  course: [tCourse] | []
}
export type tUser = {
  id?: number
  email: string
  phone?: string
  firstname: string
  lastname?: string
  roles: string[]
  status?: boolean | string
  token?: string
  updatedOn: string
  photo?: string
}
export type CardDto = {
  amount?: number // corresponds to int amount
  amt: number // corresponds to Long amt
  currency: string
  usr?: string
  email?: string
  name?: string
  description: string
}
export type tMeta = { [key: string]: string | number }
export type Questionnaire = {
  id: string
  response: Record<string, unknown>
  createdOn: string // ISO date string representation of LocalDateTime
}
export type tRegisterUser = {
  email: string
  password: string | number
  firstname: string
  lastname?: string
  dp?: string
  age?: string | number
  country?: string
  meta?: tMeta
}
export type tLoginUser = {
  email: string
  password: string | number
}
export type tQuiz = {
  id: number
  title: string
  options: [string]
  answer: string
}
export type tLecture = {
  id?: number
  title: string
  video?: string
  quiz?: string
  type: string
  content?: string
  open?: boolean
}
export type tContact = {
  firstname: string
  lastname: string
  email: string
  phone: string
  message: string
  type: string
}
export type tSection = {
  title: string
  description: string
  id: string
  lecture: tLecture[]
}
export type tCurriculum = {
  section: tSection[]
  objective?: string[]
  requirement?: string[]
}
export type tCourse = {
  id: string
  author: tUser
  courseName: string
  category: string
  target: string
  description: string
  image: string
  price: number
  status: boolean
  curriculum: tCurriculum
  brief: string
  tax: number
  createdOn: string
  thumbnail: string
  updatedOn: string
  totalSteps: number
  draft: boolean
  posts?: tPost[]
  assetCount: {
    lessonCount: number
    labCount: number
    quizCount: number
    downloadCount: number
    noteCount: number
  }
}
export type tCourseLte = {
  author: string
  id: string
  courseName: string
  brief: string
  createdOn: string
  updatedOn: string
  thumbnail: string
  category: string
  totalSteps: number
  activeStep?: number | null
  students?: number
  curriculum: null
  draft: boolean
  cost?: number
  posts: tPost[]
}

export type tNextPrev = {
  handlePrev: () => void
  playId: string
  course: tCourse
  handleNext: (_id: number | undefined) => void
  lessonCount: number
}

export type tPost = {
  id: string
  user: string
  message: string
  type: string
  course: string
  createdOn: string
  modifiedOn: string
  like: number
  share: number
  rating: number
  createdAt: string
  updatedAt?: string
}
export type tLike = {
  likes: number[]
}

export type UserDto = {
  id?: string
  firstname: string
  lastname: string
  country?: string
  password: string
  email: string
  phone?: string
  type: string
  updatedOn?: string // representing ISO date string
  modifiedOn?: string // representing ISO date string
  token?: string
  dp?: string
  status?: boolean
  roles?: string[]
  message?: string
  courses?: string[]
  rating?: number
  reviews?: string[]
}

export type tReview = {
  user?: {
    id: string
  }
  course: {
    id: string
  }
  rating: number
  type: string
  message: string
}
export type tStatus = { isPlaying: boolean }
export type Action =
  | {
      type: "USER_ADD"
      data: [tUser]
    }
  | { type: "COURSE_SET"; data: tCourse | null }
  | { type: "COURSES_SET"; data: [tCourse] }

export interface Feature {
  icon: React.ElementType
  title: string
  description: string
}

export interface PriceByCountry {
  NG: string
  US: string
}
export interface Plan {
  name: string
  slug: string
  price: {
    US: string
    NG: string
  }
  description: string
  duration?: string
  features?: string[]
}

export interface IPerson {
  fullname?: string
  email?: string
  phone?: string
}
export interface IAnswer {
  alignment: string
  misalignment: string
  hardest: string
  whyHardest?: string
  currentSolution?: string
  strengthsCurrentSolution: string
  weaknessCurrentSolution: string
  problemtime?: number
  painpoint: string
  willTryHorace?: string
}

export type tInterview = {
  response: {
    person: IPerson
    answer: IAnswer
  }
}
export interface TransactionData {
  payee: string
  description: string
  amount: number
  currency: "NGN" | "USD"
  tranx: string
}
export interface Tranx {
  id: string
  amount: number
  description: string
  currency: string
  payee: UserDto
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  detail: string | null
  tranx_type: string
  receipt: string | null
  ref: number
  isp: string | null
  stripe_payment_method: string | null
  status: string
  createdOn: string
  modifiedOn: string | null
  callback_url: string | null
  stripeId: string | null
}
export interface Address {
  street: string
  city: string
  state: string
  country: string
  phone_number: string
  zip_code: string
  email: string
}
export interface UserPayload {
  id?: number
  first_name: string
  last_name: string
  email: string
  roles: string[]
  status: string
  timestamp?: string
  password?: string
  is_active?: boolean
  gender?: string
  address?: Address
}
export type TCountryCode = "NG" | "US"
