import { z } from 'zod'

export const reviewSubmissionSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review_text: z.string()
    .max(5000, 'Review too long')    
    .optional()                       
    .default(''),                     
})

export type ReviewSubmission = z.infer<typeof reviewSubmissionSchema>

export const reviewResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    user_response: z.string(),
  }).optional(),
  error: z.string().optional(),
})

export type ReviewResponse = z.infer<typeof reviewResponseSchema>
