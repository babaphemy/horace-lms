export interface State {
    loading: boolean;
    user?: tUser | {};
    course: [tCourse] | [];
  }
  export type tUser = {
    id: number;
    email: string;
    firstname: string;
    lastname?: string;
    roles: string[];
    status?: boolean | string;
    token?: string;
    updatedOn: string;
    photo: string;
  };
  export type tRegisterUser = {
    email: string;
    password: string | number;
    firstname: string;
    lastname?: string;
    dp?: string;
    age?: string | number;
    country?: string;
    meta?: any;
  }
  export type tLoginUser = {
    email: string;
    password: string | number;
  }
  export type tQuiz = {
    id: number;
    title: string;
    options: [string];
    answer: string;
  };
  export type tLecture = {
    title: string;
    video: string;
    type: string;
    open: boolean;
  };
  export type tSection = {
    title: string;
    description: string;
    id: string;
    lecture: tLecture[]
  }
  export type tCurriculum = {
    section: tSection[];
    objective?: string[];
    requirement?: string[];
  };
  export type tCourse = {
    id: string;
    authhor: tUser;
    courseName: string;
    category: string;
    target: string;
    description: string;
    image: string;
    price: number;
    status: boolean;
    curriculum: tCurriculum;
    brief: string;
    tax: number;
    createdOn: string;
    thumbnail: string;
    updatedOn: string;
    totalSteps: number;
    draft: boolean;
  }

  export type tStatus = { isPlaying: boolean };
    export type Action =
    | {
        type: "USER_ADD";
        data: [tUser];
      }
    | { type: "COURSE_SET"; data: tCourse | null } | { type: "COURSES_SET"; data: [tCourse] } | { type: "LECTURE_SET"; data: tLecture } 
  