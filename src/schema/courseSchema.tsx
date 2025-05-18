import { LESSONTYPE } from "@/types/types"
import * as yup from "yup"
export const courseCreateSchema = yup.object().shape({
  courseName: yup.string().required("Course name is required"),
  category: yup.string().optional(),
  target: yup.string().optional(),
  brief: yup.string().optional(),
  overview: yup.string().required("Overview is required"),
  price: yup.number().optional().positive("Price must be positive"),
  tax: yup.number().optional().positive("Tax must be positive"),
  thumbnail: yup.string().url("Thumbnail must be a valid URL").optional(),
  draft: yup.string().optional(),
  currency: yup.string().optional(),
  createdOn: yup.date().optional(),
  updatedOn: yup.date().optional(),
})
export const courseCompleteSchema = courseCreateSchema.shape({
  topics: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string().required("Topic title is required"),
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
        dueDate: yup.date().optional(),
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
        title: yup.string().required("Topic title is required"),
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
