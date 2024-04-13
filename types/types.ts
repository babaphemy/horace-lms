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
    id: number;
    title: string;
    video: string;
    type: string;
    content?: any;
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
    author: tUser;
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
    posts?: any;
    assetCount: {
      lessonCount: number,
        labCount: number,
        quizCount: number,
        downloadCount: number,
        noteCount: number,
    }
  }
  export type tCourseLte = {
      "author": string;
      "id": string;
      "courseName": string;
      "brief": string;
      "createdOn": string;
      "updatedOn": string;
      "thumbnail": string;
      "category": string;
      "totalSteps": number;
      "activeStep": number | null;
      "students": number;
      "curriculum": null;
      "draft": boolean;
      "cost": number;
      "posts": tPost[]
  
    }

    
export type tNextPrev = {
  handlePrev: () => void;
  playId: any;
  course: any;
  handleNext: (id: number | undefined) => void;
  lessonCount: number
};

  export type tPost = {
      id: string;
      user: string;
      message: string;
      type: string;
      course: string;
      createdOn: string;
      modifiedOn: string;
      like: number;
      share: number;
      rating: number;
    
  }
  export type tLike = {
    likes: number[];
  }

  export type tReview = {
    user?: {
      id: string;
    },
     course: {
      id: string;
    },
    rating: number;
    type: string;
    message: string;
  }
  export type tStatus = { isPlaying: boolean };
    export type Action =
    | {
        type: "USER_ADD";
        data: [tUser];
      }
    | { type: "COURSE_SET"; data: tCourse | null } | { type: "COURSES_SET"; data: [tCourse] } 

  export interface Feature {
  icon: string;
  title: string;
  description: string;
}
export interface Plan {
    name: string;
    price: string;
    description: string;
}
  
  