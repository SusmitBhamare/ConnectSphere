
import z from 'zod';

export const workspaceSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(8).max(255),
})

export type WorkspaceSchema = z.infer<typeof workspaceSchema>