import { Resource } from "@/types/types"

const reviews = {
  posts: [
    {
      id: "3",
      user: {
        name: "Carl Hend",
        avatar: "assets/images/avatars/carl.webp",
      },
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat. Aenean lorem ex, ultrices sit amet ligula sed...",
      time: "June 1, 2015",
      type: "review",
      like: 4,
      share: 1,
    },
    {
      id: 1,
      user: {
        name: "Carl Henderson",
        avatar: "assets/images/avatars/carl.webp",
      },
      message:
        "ipsum Lorem dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat. Aenean lorem ex, ultrices sit amet ligula sed...",
      time: "June 10, 2015",
      like: 4,
      share: 1,
      rating: 4,
      comments: [
        {
          id: 1,
          type: "comment",
          message: "nice one keep it up, you were absolutely right",
          user: {
            name: "Carl Henderson",
            avatar: "assets/images/avatars/carl.webp",
          },
          time: "June 10, 2015",
        },
      ],
    },
  ],
}
const author = {
  id: "63e1e5cbe46dc2016009e6c6",
  firstname: "morayo",
  lastname: "ayobami",
  country: "US",
  email: "babaphemy@yahoo.com",
  token: "ee522873-c242-4262-b466-d63016981608",
  dp: null,
  active: true,
  createdOn: "2023-02-06T23:46:51.384",
  modifiedOn: "2023-02-06T23:49:12.354",
  lastLogin: "2023-02-13",
  roles: ["INSTRUCTOR", "USER"],
}

const sample = [
  {
    id: "63e95bd0785d575f5cd04ffa",
    author: {
      id: "63e1e5cbe46dc2016009e6c6",
      firstname: "morayo",
      lastname: "ayobami",
      country: "US",
      email: "babaphemy@yahoo.com",
      token: "ee522873-c242-4262-b466-d63016981608",
      dp: null,
      active: true,
      createdOn: "2023-02-06T23:46:51.384",
      modifiedOn: "2023-02-06T23:49:12.354",
      lastLogin: "2023-02-13",
      roles: ["INSTRUCTOR", "USER"],
    },
    courseName: "Build Native Android & iOS App Using EXPO",
    category: "mobile",
    target: "beginner, intermediate",
    curriculum: {
      section: [
        {
          title: "Introduction",
          description: "what is React",
          id: "9405652c",
          lecture: [
            {
              title: "Welcome",
              video: "react-intro.mp4",
              type: "lecture",
            },
            {
              title: "Why React?",
              video: "why-react-2_1.mp4",
              type: "lecture",
            },
            {
              title: "Folder Structure",
              video: "3-folder-b.mp4",
              type: "lecture",
            },
          ],
        },
        {
          title: "Getting Started",
          description: "Installation and system requirements",
          id: "beb653b0",
          lecture: [
            {
              title: "system setup",
              video: "lesson-4-a.mp4",
              type: "lecture",
            },
            {
              title: "installing node",
              quiz: "quiz-1.json",
              type: "quiz",
            },
          ],
        },
        {
          title: "Our First Component",
          description: "Lets build our first react component",
          id: "e259eeed",
          lecture: [],
        },
      ],
    },
    brief:
      "Learn to build web applications using the most popular web framework with the highest job openings.",
    price: 105.0,
    tax: 5.0,
    createdOn: null,
    thumbnail: "react-logo.webp",
    updatedOn: null,
    totalSteps: 4,
    draft: false,
  },
  {
    id: "63e8887fc8fbd71825d11124",
    author: {
      id: "63e1e5cbe46dc2016009e6c6",
      firstname: "morayo",
      lastname: "ayobami",
      country: "US",
      email: "babaphemy@yahoo.com",
      token: "ee522873-c242-4262-b466-d63016981608",
      dp: null,
      active: true,
      createdOn: "2023-02-06T23:46:51.384",
      modifiedOn: "2023-02-06T23:49:12.354",
      lastLogin: "2023-02-13",
      roles: ["INSTRUCTOR", "USER"],
    },
    courseName: "Introduction to Javascript",
    category: "mobile",
    target: "beginner, intermediate",
    curriculum: {
      section: [
        {
          title: "Introduction",
          description: "what is React",
          id: "94cf516f",
          lecture: [
            {
              title: "Javascript",
              video: "https://www.youtube.com/embed/QH2-TGUlwu4",
            },
            {
              title: "Javascript Basics",
              video: "https://www.youtube.com/embed/QH2-TGUlwu4",
            },
          ],
        },
      ],
    },
  },
]
const resources: Resource[] = [
  {
    id: 1,
    title: "Horace Demo",
    type: "video",
    category: "Demo",
    description:
      "Complete walkthrough of the Horace platform features and capabilities",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
    content: "https://femi.b-cdn.net/horace-demo.mp4",
    duration: "12:34",
    date: "2024-07-15",
  },
  {
    id: 2,
    title: "Product Release v1.9 Documentation",
    type: "document",
    category: "Documentation",
    description:
      "Comprehensive documentation for the latest Horace release including new features and improvements",
    content: "https://docs.horace.com/release-v1.9.pdf",
    date: "2024-07-10",
  },
  {
    id: 3,
    title: "Summer Camp",
    type: "document",
    category: "Campaign",
    description: "Horace summer camp bootcamp",
    content: "https://femi.b-cdn.net/summer%20camp.pdf",
    readTime: "1 min read",
    date: "2024-07-08",
  },
  {
    id: 4,
    title: "API Integration Guide",
    type: "document",
    category: "Documentation",
    description:
      "Complete guide for integrating Horace APIs into your applications",
    content: "https://lms.horacelearning.com/dashboard/api-docs",
    date: "2024-07-05",
  },
  {
    id: 5,
    title: "Student Assessment System",
    type: "document",
    category: "Documentation",
    description:
      "the student assessment and grading system for Horace platform",
    content:
      "https://femi.b-cdn.net/Student%20Assessment%20System%20Documentation.pdf",
    readTime: "3 min read",
    date: "2024-07-01",
  },
]
export { reviews, author, sample, resources }
