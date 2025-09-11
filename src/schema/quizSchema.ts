import { z } from "zod"

export const optionSchema = z.object({
  optionId: z.string(),
  option: z.string(),
  isAnswer: z.string(),
})

export const optionsSchema = z.array(optionSchema)

export const quizQuestionSchema = z.object({
  question: z.string().min(3, { message: "Question is required" }),
  questionImage: z.string().optional(),
  duration: z.string().optional(),
  points: z.string().optional(),
  feedBack: z.string().optional(),
  options: optionsSchema,
})

export const accessibilitySchema = z.object({
  review: z.boolean(),
  countdown: z.boolean(),
  countdownTransition: z.boolean(),
  countDown: z.number(),
  showAnswer: z.boolean(),
  showResult: z.boolean(),
})

export const quizSchema = z.object({
  quizName: z.string().min(1, { message: "Quiz name is required" }),
  lessonId: z.string(),
  createdBy: z.string().optional(),
  courseId: z.string().min(1, { message: "Course ID is required" }),
  coverTitle: z.string().min(1, { message: "Cover title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  coverImage: z.string().optional(),
  questions: z
    .array(quizQuestionSchema)
    .min(1, { message: "At least one question is required" }),
  totalDuration: z.number(),
  totalPoints: z.number(),
  accessibility: accessibilitySchema,
})

export type TQuiz = z.infer<typeof quizSchema>
export type TQuizQuestion = z.infer<typeof quizQuestionSchema>
