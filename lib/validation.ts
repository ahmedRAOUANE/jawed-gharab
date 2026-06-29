import { ProjectStatus, ProjectType, RequestIcon, RequestStatus, UserRole } from "@prisma/client";
import { z } from "zod";

// Project validation
export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "العنوان مطلوب"),
  client: z.string().min(1, "اسم العميل مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  status: z.enum(ProjectStatus).default(ProjectStatus.START),
  projectType: z.enum(ProjectType).default(ProjectType.OTHER), 
  stage: z.string().optional(),
  progress: z.number().int().min(0).max(100).default(0),
  budget: z.number().positive("الميزانية يجب أن تكون رقمًا موجبًا"),
  deadline: z.coerce.date(), 
  thumbnailUrl: z.url().optional().nullable(),
  projectLink: z.url().optional(),
  userId: z.number().int().positive("معرف المستخدم مطلوب"),
});

export const projectCreateSchema = ProjectSchema.omit({ id: true, userId: true });

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;

export const ProjectUpdateSchema = ProjectSchema.omit({ userId: true  }).partial();

export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;

export const AdminProjectDisplayDetailSchema = ProjectSchema.omit({
  userId: true,
})

export type AdminProjectDetailed = z.infer<typeof AdminProjectDisplayDetailSchema>

export const AdminProjectDisplayOverviewSchema = ProjectSchema.omit({
  client: true,
  stage: true,
  budget: true,
  deadline: true,
  userId: true,
})

export type AdminProjectOverview = z.infer<typeof AdminProjectDisplayOverviewSchema>

export const ProjectPublicDisplaySchema = ProjectSchema.omit({
  client: true,
  budget: true,
  status: true,
  stage: true,
  progress: true,
  deadline: true,
  userId: true,
})

export type PublicProject = z.infer<typeof ProjectPublicDisplaySchema>

// Request (Lead) validation
export const RequestSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.email(),
  type: z.enum(ProjectType, {
    error: (issue) =>
      issue.input === undefined
        ? "نوع الطلب مطلوب"
        : "نوع الطلب غير صالح",
  }),
  details: z.string().min(1, "التفاصيل مطلوبة"),
  budget: z.string().optional(),
  location: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  icon: z.enum(RequestIcon).default(RequestIcon.person),
  status: z.enum(RequestStatus).default(RequestStatus.NEW),
  replied: z.boolean().default(false),
  repliedAt: z.date(),
  createdAt: z.date(),
});

export const RequestCreateSchema = RequestSchema.omit({
  id: true,
  replied: true,
  repliedAt: true,
  createdAt: true,
  icon: true,
  status: true,
})

export type RequestCreateInput = z.infer<typeof RequestCreateSchema>;

export const RequestUpdateSchema = RequestSchema.pick({
  status: true,
  replied: true,
  repliedAt: true,
});

export type RequestUpdateInput = z.infer<typeof RequestUpdateSchema>;

// User profile update
export const UserUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  avatarUrl: z.url().optional(),
  role: z.enum(UserRole).optional(),
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

// ==================== AUTHENTICATION SCHEMAS ====================

export const LoginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const SignupSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, "يجب الموافقة على الشروط والأحكام"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof SignupSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "الرمز مطلوب"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, "الرمز مطلوب"),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

export const ResendVerificationSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "كلمة المرور الحالية مطلوبة"),
    newPassword: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;