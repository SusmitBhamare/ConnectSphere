import z from 'zod';

export const signupSchema = z.object({
    name : z.string().min(3).max(255),
    username : z.string().min(3).max(255),
    email : z.string().email(),
    password : z.string().min(8).max(255),
})

export type SignupSchema = z.infer<typeof signupSchema>