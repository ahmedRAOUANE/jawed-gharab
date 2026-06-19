import { z } from "zod";

// Project validation
export const ProjectSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  client: z.string().min(1, "اسم العميل مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  status: z.enum(["START", "EDITING", "REVIEW", "DELIVERED"]).default("START"),
  projectType: z.enum(["COMMERCIAL", "DOCUMENTARY", "MOTION_GRAPHICS", "MUSIC_VIDEO", "OTHER"]).default("OTHER"),
  stage: z.string().optional(),
  progress: z.number().int().min(0).max(100).default(0),
  budget: z.number().positive("الميزانية يجب أن تكون رقمًا موجبًا"),
  deadline: z.string().datetime({ offset: true }).or(z.date()), // ISO string or Date
  thumbnailUrl: z.string().url().optional(),
  projectLink: z.string().url().optional(),
  userId: z.number().int().positive("معرف المستخدم مطلوب"),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

// Project update (partial)
export const ProjectUpdateSchema = ProjectSchema.partial();

export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;

// Request (Lead) validation
export const RequestSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  type: z.string().min(1, "نوع الطلب مطلوب"),
  details: z.string().min(1, "التفاصيل مطلوبة"),
  budget: z.string().optional(),
  location: z.string().optional(),
  deadline: z.coerce.date().optional(),
  status: z.enum(["NEW", "PENDING", "CONTACTED"]).default("NEW"),
  icon: z.enum(["person", "business", "movie"]).default("person"),
  replied: z.boolean().default(false),
  repliedAt: z.date()
});

export type RequestInput = z.infer<typeof RequestSchema>;

export const RequestUpdateSchema = RequestSchema.partial();

export type RequestUpdateInput = z.infer<typeof RequestUpdateSchema>;

// Status update for request
export const RequestStatusSchema = z.object({
  status: z.enum(["NEW", "PENDING", "CONTACTED"]),
});

// TeamMember validation
export const TeamMemberSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  role: z.string().min(1, "الدور مطلوب"),
  avatar: z.string().url().optional(),
  skills: z.array(z.string()).optional(),
  projectId: z.number().int().positive("معرف المشروع مطلوب"),
});

export type TeamMemberInput = z.infer<typeof TeamMemberSchema>;

// User profile update
export const UserUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(["ADMIN", "DIRECTOR", "EDITOR", "VIEWER"]).optional(),
  accountStatus: z.string().optional(),
  profileProgress: z.number().int().min(0).max(100).optional(),
});

export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;

// Pagination query params
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

// Combined schemas for specific endpoints
export const CreateProjectSchema = ProjectSchema.omit({ userId: true }).extend({
  // we'll get userId from session later, but for now we'll keep it optional in body
  userId: z.number().int().positive().optional(),
});

export const CreateRequestSchema = RequestSchema.omit({ status: true, replied: true, repliedAt: true });