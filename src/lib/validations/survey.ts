import { z } from "zod";

export const AnswerSchema = z.object({
  questionId: z.string().cuid(),
  answer: z.string().min(1, "Vui lòng nhập câu trả lời"),
  timeSpentMs: z.number().int().nonnegative(),
  startTime: z.number().int().nonnegative(),
  endTime: z.number().int().nonnegative(),
});

export const SurveySubmissionSchema = z.object({
  answers: z.array(AnswerSchema).min(1, "Danh sách câu trả lời không được để trống"),
  totalTimeSpend: z.number().int().nonnegative(),
});

export const QuestionSchema = z.object({
  text: z.string().min(3, "Nội dung câu hỏi quá ngắn"),
  type: z.enum(["choice", "text"]),
  options: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type SurveySubmissionInput = z.infer<typeof SurveySubmissionSchema>;
export type QuestionInput = z.infer<typeof QuestionSchema>;
