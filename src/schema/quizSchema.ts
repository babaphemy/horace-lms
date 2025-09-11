import { z } from "zod"

export const optionSchema = z.object({
  id: z.string().min(1, { message: "Option ID is required" }),
  text: z.string().min(1, { message: "Option text is required" }),
})

export const quizQuestionSchema = z.object({
  id: z.number().min(1, { message: "Question ID is required" }),
  type: z.enum(["multiple_choice", "true_false", "short_answer"], {
    errorMap: () => ({
      message:
        "Question type must be multiple_choice, true_false, or short_answer",
    }),
  }),
  question: z.string().min(3, { message: "Question is required" }),
  points: z.number().min(1, { message: "Points must be at least 1" }),
  options: z
    .array(optionSchema)
    .min(2, { message: "At least 2 options are required" }),
  correctAnswer: z.string().min(1, { message: "Correct answer is required" }),
  explanation: z.string().optional(),
})

export const contentSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  timeLimit: z
    .number()
    .min(1, { message: "Time limit must be at least 1 minute" }),
  passingScore: z
    .number()
    .min(0)
    .max(100, { message: "Passing score must be between 0 and 100" }),
  questions: z
    .array(quizQuestionSchema)
    .min(1, { message: "At least one question is required" }),
})

export const quizSchema = z.object({
  lessonId: z.string().min(1, { message: "Lesson ID is required" }),
  content: contentSchema,
})

export type TQuiz = z.infer<typeof quizSchema>
export type TQuizQuestion = z.infer<typeof quizQuestionSchema>
export type TOption = z.infer<typeof optionSchema>
