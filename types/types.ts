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
  export type tCourse = {
    id: number;
    title: string;
    options: [string];
    answer: string;
  };

  export type tStatus = { isPlaying: boolean };
    export type Action =
    | {
        type: "USER_ADD";
        data: [tUser];
      }
    | { type: "COURSE_SET"; data: tCourse | null } | { type: "COURSES_SET"; data: [tCourse] };
  