import { LESSONTYPE } from "@/types/types"
import * as yup from "yup"
export const courseCreateSchema = yup.object().shape({
  courseName: yup.string().required("Course name is required"),
  category: yup.string().optional(),
  target: yup.string().optional(),
  brief: yup.string().optional(),
  overview: yup.string().required("Overview is required"),
  price: yup.number().optional().min(0, "Price must be positive"),
  tax: yup.number().optional().min(0, "Tax must be 0 or positive"),
  thumbnail: yup.string().url("Thumbnail must be a valid URL").optional(),
  draft: yup.string().optional(),
  currency: yup.string().optional(),
  createdOn: yup.date().optional(),
  updatedOn: yup.date().optional(),
})
export const courseCompleteSchema = yup.object().shape({
  course: courseCreateSchema,
  topics: yup
    .array()
    .of(
      yup.object().shape({
        module: yup.string().required("Topic title is required"),
        description: yup.string().required("Topic description is required"),
        orderIndex: yup
          .number()
          .optional()
          .integer("Order index must be an integer"),
        lessons: yup
          .array()
          .of(
            yup.object().shape({
              title: yup.string().required("Lesson title is required"),
              type: yup.string().required("Lesson type is required"),
              orderIndex: yup
                .number()
                .optional()
                .integer("Order index must be an integer"),
              video: yup.string().optional(),
              content: yup.string().optional(),
              createdOn: yup.date().optional(),
              updatedOn: yup.date().optional(),
            })
          )
          .min(1, "At least one lesson is required"),
        createdOn: yup.date().optional(),
        updatedOn: yup.date().optional(),
      })
    )
    .min(1, "At least one topic is required"),
})
export const curriculumMapSchema = yup.object().shape({
  topic: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().optional(),
        module: yup.string().required("Topic title is required"),
        description: yup.string().required("Topic description is required"),
        cid: yup.string().required("Course ID is required"),
        orderIndex: yup
          .number()
          .optional()
          .integer("Order index must be an integer"),
        lessons: yup
          .array()
          .of(
            yup.object().shape({
              id: yup.string().optional(),
              title: yup.string().required("Lesson title is required"),
              tid: yup.string().required("Topic ID is required"),
              type: yup
                .mixed<LESSONTYPE>()
                .oneOf(Object.values(LESSONTYPE), "Invalid lesson type"),
              orderIndex: yup
                .number()
                .optional()
                .integer("Order index must be an integer"),
              video: yup.string().optional(),
              content: yup.string().optional(),
              createdOn: yup.date().optional(),
              updatedOn: yup.date().optional(),
            })
          )
          .min(1, "At least one lesson is required"),
        dueDate: yup.date().optional(),
        createdOn: yup.date().optional(),
        updatedOn: yup.date().optional(),
      })
    )
    .min(1, "At least one topic is required"),
  requirement: yup.array().of(yup.string()).optional(),
  objective: yup.array().of(yup.string()).optional(),
})
export const courseSchema = yup.object().shape({
  user: yup.string().required("User ID is required"),
  courseName: yup.string().required("Course name is required"),
  category: yup.string().required("Category is required"),
  target: yup.string().required("Target audience is required"),
  brief: yup.string().required("Brief description is required"),
  overview: yup.string().required("Overview is required"),
  price: yup
    .number()
    .min(0, "Price must be positive")
    .required("Price is required"),
  tax: yup.number().min(0, "Tax must be positive").required("Tax is required"),
  currency: yup.string().required("Currency is required"),
  cost: yup.number().optional(),
})

export const topicSchema = yup.object().shape({
  id: yup.string().optional(),
  cid: yup.string().required("Course ID is required"),
  title: yup.string(),
  module: yup.string(),
  description: yup.string().required("Description is required"),
  dueDate: yup.date().required("Due date is required"),
})

export const lessonSchema = yup.object().shape({
  tid: yup.string().required("Topic ID is required"),
  title: yup.string().required("Lesson title is required"),
  video: yup.string().optional(),
  orderIndex: yup.number().optional().integer("Order index must be an integer"),
  type: yup
    .mixed<LESSONTYPE>()
    .oneOf(Object.values(LESSONTYPE), "Invalid lesson type")
    .required("Lesson type is required"),
  content: yup.string(),
  assetKey: yup.string().optional(),
})
