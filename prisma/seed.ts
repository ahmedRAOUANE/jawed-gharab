import prisma from "@/lib/prisma";
import { ProjectStatus, ProjectType, RequestIcon, RequestStatus, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

// Sample data arrays (keep existing)
const projectTitles = [
    "إعلان بنك المشرق 2024",
    "فيلم وثائقي: رمال الأمل",
    "موشن جرافيك: منصة أريد",
    "إعلان تجاري - علامة نايكم",
    "فيديو موسيقي - فنان سحاب",
    "وثائقي - رحلة في الصحراء",
    "إعلان شركة التقنية",
    "فيديو ترويجي - فلل الريم",
    "وثائقي - الحرف اليدوية",
    "موشن جرافيك - تطبيق جديد",
];

const clients = [
    "بنك المشرق",
    "وزارة الثقافة",
    "أريد للاتصالات",
    "شركة نايكم",
    "فنان سحاب",
    "هيئة السياحة",
    "شركة التقنية",
    "شركة نجد للتطوير",
    "وزارة التراث",
    "شركة أريد",
];

const projectDescriptions = [
    "إعلان تلفزيوني بجودة سينمائية لتعزيز العلامة التجارية للبنك.",
    "فيلم وثائقي قصير عن رمال الأمل في الصحراء العربية.",
    "موشن جرافيك بجودة عالية لإطلاق منصة جديدة.",
    "فيديو إعلاني مبتكر لعرض منتج جديد في السوق.",
    "فيديو موسيقي بأسلوب سينمائي حديث.",
    "وثائقي عن رحلة في الصحراء واستكشاف الطبيعة.",
    "إعلان تجاري لتسويق حلول تقنية متطورة.",
    "فيديو ترويجي لمجمع سكني فاخر.",
    "وثائقي عن الحرف اليدوية التقليدية في المنطقة.",
    "موشن جرافيك لتطبيق جوال مبتكر.",
];

const statuses = [
    ProjectStatus.START,
    ProjectStatus.EDITING,
    ProjectStatus.REVIEW,
    ProjectStatus.DELIVERED,
    ProjectStatus.ACTIVE,
];

const projectTypes = [
    ProjectType.COMMERCIAL,
    ProjectType.DOCUMENTARY,
    ProjectType.MOTION_GRAPHICS,
    ProjectType.MUSIC_VIDEO,
    ProjectType.OTHER,
];

const stages = [
    "تصحيح الألوان",
    "التعديل النهائي",
    "تجميع المقاطع",
    "مرحلة ما بعد الإنتاج",
    "اللمسات الأخيرة",
];

const requestNames = [
    "أحمد العمري",
    "شركة نجد للتطوير",
    "سارة منصور",
    "محمود الفارسي",
    "هدى العتيبي",
    "يوسف الحسين",
    "نورة السبيعي",
    "علي الجابر",
    "ريم السالم",
    "فهد القرني",
];

const requestTypes = [
    "إنتاج وثائقي",
    "فيديو إعلاني",
    "تعديل وتلوين",
    "إنتاج فيلم قصير",
    "تصوير منتجات",
    "تغطية مؤتمر",
    "إنتاج محتوى تعليمي",
    "فيديو موسيقي",
    "تصوير جوي",
    "مونتاج فيديو",
];

const requestDetails = [
    "نبحث عن شريك لإنتاج سلسلة وثائقية قصيرة (٣ حلقات) تسلط الضوء على الحرف اليدوية في المناطق الجبلية.",
    "تصوير فيديو ترويجي للمجمع السكني الجديد 'فلل الريم'. التركيز على الرفاهية والمساحات الخضراء.",
    "لدي مادة خام تم تصويرها بكاميرا RED ونحتاج إلى خبير تلوين لإعطاء الفيديو طابعاً سينمائياً.",
    "نرغب في إنتاج فيلم قصير عن القصص الملهمة في منطقتنا.",
    "نحتاج إلى تصوير منتجاتنا بطريقة احترافية لعرضها على الموقع الإلكتروني.",
    "نبحث عن مصور لتغطية مؤتمرنا السنوي القادم.",
    "نحتاج إلى إنتاج محتوى تعليمي تفاعلي للطلاب.",
    "نرغب في إنتاج فيديو موسيقي لأغنية جديدة مع رسوم متحركة.",
    "نحتاج إلى تصوير جوي لمنطقة المشروع السياحي الجديد.",
    "نبحث عن محترف مونتاج لفيديو يوتيوب طويل.",
];

const requestStatuses = [
    RequestStatus.NEW,
    RequestStatus.PENDING,
    RequestStatus.CONTACTED,
];

const icons = Object.values(RequestIcon);

// Helper functions
const randomItem = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = (): Date => {
    const now = new Date();
    const daysAgo = randomInt(1, 180);
    return new Date(now.setDate(now.getDate() - daysAgo));
};

const randomFutureDate = (): Date => {
    const now = new Date();
    const daysAhead = randomInt(7, 90);
    return new Date(now.setDate(now.getDate() + daysAhead));
};

// ----- MAIN SEED -----
async function main() {
    console.log("🌱 Starting database seeding...");

    // Clean up existing data (for development)
    await prisma.loginAttempt.deleteMany();
    await prisma.passwordResetToken.deleteMany();
    await prisma.emailVerificationToken.deleteMany();
    await prisma.project.deleteMany();
    await prisma.request.deleteMany();
    await prisma.user.deleteMany();

    console.log("🧹 Cleared existing data.");

    // ===== CREATE USERS =====
    // 1. Admin (verified)
    const adminPassword = await hash("Admin@123", 10);
    const admin = await prisma.user.create({
        data: {
            email: "admin@jawedgharab.com",
            password: adminPassword,
            name: "أحمد المنصور",
            role: UserRole.ADMIN,
            avatarUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuB8amvLXePbS1IZORTo1vCf4QByU1UWsK58dHIk4g74Nq74i7cjkDHBViX86MXV7OWQveqkfh1eVU-VXWfuR4SH5ToVNTuG0qtEPZFgwYY7Wi9h2L7a34ZpxhOoF4z1RcumFetArepUdaFbwYLU-pBORnt-kRUbmCUV59jT4d8tKeAlO9keOZICoySEd2KoMn31nKMsYdojAKPUEkuvgax9qFOReIbpdKpnk0QSKguvq6Bedm3FifHoPQ571CBeXk4CcQlINfNJxUo",
            accountStatus: "نشط",
            profileProgress: 80,
            emailVerified: true,
            lastLogin: new Date(),
        },
    });
    console.log(`✅ Created admin: ${admin.email} (verified)`);

    // 2. Editor (verified)
    const editorPassword = await hash("Editor@123", 10);
    const editor = await prisma.user.create({
        data: {
            email: "editor@jawedgharab.com",
            password: editorPassword,
            name: "سارة الشمري",
            role: UserRole.EDITOR,
            avatarUrl: "https://via.placeholder.com/100",
            accountStatus: "نشط",
            profileProgress: 65,
            emailVerified: true,
            lastLogin: randomDate(),
        },
    });
    console.log(`✅ Created editor: ${editor.email} (verified)`);

    // 3. Unverified user (to test email verification)
    const unverifiedPassword = await hash("Unverified@123", 10);
    const unverified = await prisma.user.create({
        data: {
            email: "unverified@jawedgharab.com",
            password: unverifiedPassword,
            name: "مستخدم غير موثق",
            role: UserRole.VIEWER,
            accountStatus: "نشط",
            profileProgress: 20,
            emailVerified: false,
            // Create an expired verification token for testing
            emailVerificationToken: "expired_token_123",
            emailVerificationExpires: new Date(Date.now() - 24 * 60 * 60 * 1000), // expired 24h ago
        },
    });
    console.log(`✅ Created unverified user: ${unverified.email}`);

    // 4. Additional users (some verified, some not)
    const extraUsers = [];
    for (let i = 0; i < 5; i++) {
        const isVerified = i % 2 === 0; // alternate
        const password = await hash(`User@${i}123`, 10);
        const user = await prisma.user.create({
            data: {
                email: `user${i + 1}@jawedgharab.com`,
                password,
                name: `مستخدم ${i + 1}`,
                role: randomItem([UserRole.EDITOR, UserRole.DIRECTOR, UserRole.VIEWER]),
                avatarUrl: "https://via.placeholder.com/100",
                accountStatus: "نشط",
                profileProgress: randomInt(30, 90),
                emailVerified: isVerified,
                lastLogin: isVerified ? randomDate() : undefined,
                // Add verification token for unverified users (if any)
                ...(isVerified ? {} : {
                    emailVerificationToken: `token_${i}`,
                    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // valid for 24h
                }),
            },
        });
        extraUsers.push(user);
    }
    console.log(`✅ Created ${extraUsers.length} extra users`);

    // ===== CREATE PROJECTS =====
    const projects = [];
    for (let i = 0; i < 12; i++) {
        const project = await prisma.project.create({
            data: {
                title: projectTitles[i % projectTitles.length],
                client: clients[i % clients.length],
                description: projectDescriptions[i % projectDescriptions.length],
                status: randomItem(statuses),
                projectType: randomItem(projectTypes),
                stage: randomItem(stages),
                progress: randomInt(0, 100),
                budget: randomInt(5000, 50000),
                deadline: randomFutureDate(),
                thumbnailUrl: "https://via.placeholder.com/400x225/2563eb/ffffff?text=MASTERY",
                projectLink: `https://example.com/project/${i + 1}`,
                userId: admin.id, // all projects owned by admin for now
                createdAt: randomDate(),
            },
        });
        projects.push(project);
    }
    console.log(`✅ Created ${projects.length} projects`);

    // ===== CREATE REQUESTS =====
    const requests = [];
    for (let i = 0; i < 15; i++) {
        const request = await prisma.request.create({
            data: {
                name: requestNames[i % requestNames.length],
                type: requestTypes[i % requestTypes.length],
                details: requestDetails[i % requestDetails.length],
                budget: `${randomInt(5, 20)},${randomInt(0, 9)}00 - ${randomInt(21, 40)},${randomInt(0, 9)}00 ريال سعودي`,
                location: randomItem(["الرياض", "جدة", "الدمام", "مكة", "المدينة"]),
                deadline: randomFutureDate().toLocaleDateString("ar-SA"),
                status: randomItem(requestStatuses),
                icon: randomItem(icons),
                replied: Math.random() > 0.5,
                repliedAt: Math.random() > 0.5 ? new Date() : undefined,
                createdAt: randomDate(),
            },
        });
        requests.push(request);
    }
    console.log(`✅ Created ${requests.length} requests`);

    // ===== CREATE AUTH TOKENS (for testing) =====

    // 1. Valid email verification token for admin (will be deleted after verification)
    await prisma.emailVerificationToken.create({
        data: {
            userId: admin.id,
            token: "valid_verification_token_abc123",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    });
    console.log(`✅ Created valid email verification token for admin`);

    // 2. Expired email verification token (for testing expiration)
    await prisma.emailVerificationToken.create({
        data: {
            userId: editor.id,
            token: "expired_verification_token_xyz789",
            expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // expired
        },
    });
    console.log(`✅ Created expired email verification token for editor`);

    // 3. Password reset token (valid)
    await prisma.passwordResetToken.create({
        data: {
            userId: admin.id,
            token: "valid_password_reset_token_abc123",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            used: false,
        },
    });
    console.log(`✅ Created valid password reset token for admin`);

    // 4. Used password reset token (for testing reuse prevention)
    await prisma.passwordResetToken.create({
        data: {
            userId: editor.id,
            token: "used_password_reset_token_xyz789",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            used: true,
        },
    });
    console.log(`✅ Created used password reset token for editor`);

    // ===== CREATE LOGIN ATTEMPTS =====
    // Some failed login attempts for admin
    for (let i = 0; i < 3; i++) {
        await prisma.loginAttempt.create({
            data: {
                userId: admin.id,
                success: false,
                ipAddress: "192.168.1.1",
                userAgent: "Mozilla/5.0 (Test)",
                createdAt: new Date(Date.now() - i * 5 * 60 * 1000), // spaced out
            },
        });
    }

    // One successful login for admin
    await prisma.loginAttempt.create({
        data: {
            userId: admin.id,
            success: true,
            ipAddress: "192.168.1.1",
            userAgent: "Mozilla/5.0 (Test)",
            createdAt: new Date(Date.now() - 10 * 60 * 1000),
        },
    });
    console.log(`✅ Created login attempts for admin`);

    // ===== SUMMARY =====
    console.log("\n📊 Seeding Summary:");
    console.log(`- Users (total): ${1 + 1 + 1 + extraUsers.length}`);
    console.log(`  - Admin (verified): ${admin.email}`);
    console.log(`  - Editor (verified): ${editor.email}`);
    console.log(`  - Unverified: ${unverified.email}`);
    console.log(`  - Extra users: ${extraUsers.length}`);
    console.log(`- Projects: ${projects.length}`);
    console.log(`- Requests: ${requests.length}`);
    console.log(`- Auth Tokens: EmailVerification (2), PasswordReset (2)`);
    console.log(`- Login Attempts: 4`);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n🔐 Test Accounts:");
    console.log(`  Admin:    admin@jawedgharab.com   / Admin@123`);
    console.log(`  Editor:   editor@jawedgharab.com  / Editor@123`);
    console.log(`  Unverified: unverified@jawedgharab.com / Unverified@123`);
}

main()
    .catch((e) => {
        console.error("❌ Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });