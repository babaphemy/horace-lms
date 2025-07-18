export interface State {
  loading: boolean
  user?: tUser | {}
  course: [tCourse] | []
}
export type tUser = {
  id?: string
  email: string
  phone?: string
  address?: string
  country?: string
  city?: string
  state?: string
  zip?: string
  type: string // e.g., "admin", "student", "instructor"
  dp?: string
  organization?: string
  organizationId?: string
  name?: string
  firstname: string
  lastname: string
  bio?: string
  roles: (string | undefined)[]
  status?: boolean | string
  token?: string
  updatedOn?: string
  createdOn?: string
  photo?: string
  gender?: string
}
export interface orgDto {
  id?: string
  name: string
  description?: string
  logo?: string
  website?: string
  address?: string
  phone?: string
  learnUrl?: string
  email?: string
  country?: string
  state?: string
  city?: string
  zip?: string
  createdBy?: string
}
export interface ProfileFormData {
  firstname: string
  lastname: string
  email: string
  phone?: string
  company?: string
  roles: (string | undefined)[]
  brief?: string
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
export enum LESSONTYPE {
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
  HTML = "HTML",
  PDF = "PDF",
  QUIZ = "QUIZ",
  TEXT = "TEXT",
  ASSIGNMENT = "ASSIGNMENT",
  PRESENTATION = "PRESENTATION",
  OTHER = "OTHER",
}
export interface CourseCreate {
  id?: string
  user: string
  courseName: string
  category?: string
  target?: string
  brief?: string
  overview: string
  price?: number
  tax?: number
  thumbnail?: string
  draft?: string
  currency?: string
  createdOn?: Date
  updatedOn?: Date
}
export interface CourseComplete {
  course: CourseCreate
  topics: TopicBase[]
}
export interface CurriculumMap {
  topic: TopicDto[]
  requirement: string[]
  objective: string[]
}
export type LessonBase = {
  title: string
  video?: string
  type: string
  content?: string
  orderIndex?: number
  dueDate?: Date
  createdOn?: Date
  updatedOn?: Date
}
export type TopicBase = {
  module: string
  description: string
  orderIndex?: number
  lessons?: LessonBase[]
  dueDate?: Date
  createdOn?: Date
  updatedOn?: Date
}
export type TopicDto = {
  id?: string
  module?: string
  title?: string
  description: string
  cid: string
  courseId?: string
  orderIndex?: number
  lessons?: LessonDto[]
  dueDate?: Date
  createdOn?: Date
  updatedOn?: Date
}
export interface UserResp {
  id: string
  name: string
  email: string
}
export interface PostResponse {
  id: string
  content: string
  createdOn: string // LocalDateTime (ISO string)
}

export interface CourseResponse {
  courseId: string
  courseName: string
  author: UserResp
  category: string
  target: string
  curriculum: CurriculumMap
  brief: string
  price: number
  tax: number
  posts: PostResponse[]
  signed: Record<string, string>[]
  assetCount: Record<string, number>
  createdOn: string // LocalDateTime (ISO string)
  thumbnail: string
  updatedOn: string // LocalDate (ISO string)
  totalSteps: number
  draft: boolean
  isRegistered: boolean
}

export type LessonDto = {
  id?: string
  tid: string
  title: string
  video?: string
  type: string
  content?: string
  orderIndex?: number
  dueDate?: Date
  assetKey?: string
  createdOn?: Date
  updatedOn?: Date
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
    students: number
    rating: number
    topicCount: number
    lessonCount: number
    labCount: number
    quizCount: number
    downloadCount: number
    noteCount: number
  }
}
export type tCourseLte = {
  author: string
  authorRole?: string
  authorCompany?: string
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
  organizationId?: string
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
  name?: string
  amount: number
  currency: "NGN" | "USD"
  tranx: string
  status?: string
  type?: string
  stripe_payment_method?: string
  firstname?: string
  callback_url?: string
}
export interface Tranx {
  id?: string
  amount?: number
  description?: string
  currency?: string
  payee?: UserDto
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phone?: string | null
  detail?: string | null
  tranx_type?: string
  receipt?: string | null
  ref?: number
  isp?: string | null
  stripe_payment_method?: string | null
  status?: string
  createdOn?: string
  modifiedOn?: string | null
  callback_url?: string | null
  stripeId?: string | null
  clientSecret?: string | null
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

export interface Payee {
  id: string
  firstname: string
  lastname: string
  country: string | null
  email: string
  token: string
  dp: string | null
  active: boolean
  createdOn: string
  modifiedOn: string | null
  lastLogin: string | null
  roles: string[]
}

export interface TransactionItem {
  id: string
  ref: number | null
  stripeId: string | null
  amount: number
  currency: "USD" | "NGN"
  callback: string | null
  type: string | null
  status: string | null
  description: string
  payee: Payee
  detail: string | null
  createdOn: string | null
  modifiedOn: string | null
}
export type TableClickType = "delete" | "edit" | "view"
export type CodeBlockProps = {
  children: React.ReactNode
  language?: string
  title?: string
  copyText?: string
  copyToClipboard: (text: string, id: string) => void
  copiedCode?: string
}
export type BadgeProps = {
  children: React.ReactNode
  variant?:
    | "default"
    | "post"
    | "get"
    | "put"
    | "delete"
    | "success"
    | "error"
    | "warning"
    | "info"
}
export type AlertProps = {
  children: React.ReactNode
  type?: "info" | "warning" | "error" | "success"
  icon?: React.ElementType
}

export type ParameterProps = {
  name: string
  type: string
  required?: boolean
  description?: string
  children?: React.ReactNode
}

export type ApiEndpointProps = {
  method: string
  path: string
  description: string
  children?: React.ReactNode
  parameters?: ParameterProps[]
}
export type Stat = {
  totalCourses: number
  activeStudents: number
  completedLessons: number
  revenue: number
}
export interface Event {
  id?: string
  userId: string
  organizationId: string
  title: string
  startTime: string
  course?: string
  createdOn?: string
  modifiedOn?: string
  attendees?: number
}
export interface Activity {
  id?: string
  userId: string
  activityType: string
  action: string
  description?: string
  organizationId: string
  createdOn?: string
  modifiedOn?: string
}
export type Uploader = {
  filename: string
  filetype: string
  expiration?: number | null
}
export type OrganizationMember = {
  id: string
  name: string
  firstname?: string
  lastname?: string
  email: string
  role: string
  roles?: string
  dp?: string
  joinedDate: string
  status: "active" | "inactive" | "pending"
  description?: string
  logo: string
  website: string
  address?: string
  phone: string
  country?: string
  state?: string
  city?: string
  zip?: string
  createdBy: string
  updatedOn?: string
  createdOn?: string
}
