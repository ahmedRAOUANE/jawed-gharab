// prisma/seed.ts
import prisma from "@/lib/prisma";
import { ProjectStatus, ProjectType, RequestStatus, UserRole } from "@prisma/client";
import { hash } from "bcryptjs"; 

// Sample data arrays
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

// Request/Lead data
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

const icons = ["person", "business", "movie"];

// Team member data
const teamMemberNames = [
    "محمد خالد",
    "أحمد السديري",
    "سارة الشمري",
    "فهد العتيبي",
    "نورة العنزي",
    "عبدالله الحسني",
    "ريم الحربي",
    "خالد المالكي",
    "منى السعيد",
    "عمر الفهد",
    "جواهر العلي",
    "سلمان الدوسري",
    "روان القحطاني",
    "مشعل المطيري",
    "هيا اليوسف",
];

const teamMemberRoles = [
    "محرر فيديو",
    "مصور سينمائي",
    "مخرج فني",
    "مصمم جرافيك",
    "منتج تنفيذي",
    "مهندس صوت",
    "مؤثرات بصرية",
    "محرر نصوص",
    "مدير مشروع",
    "مساعد مونتاج",
];

const teamMemberSkills = [
    ["Adobe Premiere", "Final Cut Pro", "DaVinci Resolve"],
    ["تصوير سينمائي", "إضاءة"],
    ["إخراج", "توجيه فني"],
    ["After Effects", "Illustrator"],
    ["إنتاج", "تخطيط"],
    ["تسجيل صوتي", "ميكساج"],
    ["مؤثرات خاصة", "تلوين"],
    ["كتابة نصوص", "تحرير"],
    ["إدارة مشاريع", "تنسيق"],
    ["مونتاج", "تلوين"],
];

// Helper function to get random item from array
const randomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
};

// Helper function to get random number between min and max
const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get random date within last 6 months
const randomDate = (): Date => {
    const now = new Date();
    const daysAgo = randomInt(1, 180);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return date;
};

// Helper function to get random future date (for deadlines)
const randomFutureDate = (): Date => {
    const now = new Date();
    const daysAhead = randomInt(7, 90);
    const date = new Date(now);
    date.setDate(date.getDate() + daysAhead);
    return date;
};

async function main() {
    console.log("🌱 Starting database seeding...");

    // Clean up existing data (optional - for development only)
    await prisma.teamMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.request.deleteMany();
    await prisma.user.deleteMany();

    // 1. Create Admin User
    const admin = await prisma.user.create({
        data: {
            email: "admin@jawedgharab.com",
            password: await hash("admin123", 10), // will be hashed
            name: "أحمد المنصور",
            role: UserRole.ADMIN,
            avatarUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuB8amvLXePbS1IZORTo1vCf4QByU1UWsK58dHIk4g74Nq74i7cjkDHBViX86MXV7OWQveqkfh1eVU-VXWfuR4SH5ToVNTuG0qtEPZFgwYY7Wi9h2L7a34ZpxhOoF4z1RcumFetArepUdaFbwYLU-pBORnt-kRUbmCUV59jT4d8tKeAlO9keOZICoySEd2KoMn31nKMsYdojAKPUEkuvgax9qFOReIbpdKpnk0QSKguvq6Bedm3FifHoPQ571CBeXk4CcQlINfNJxUo",
            accountStatus: "نشط",
            profileProgress: 80,
            lastLogin: new Date(),
        },
    });

    console.log(`✅ Created admin user: ${admin.email}`);

    // 2. Create Additional Users (Editors and Directors)
    const extraUsers = [];
    for (let i = 0; i < 5; i++) {
        const user = await prisma.user.create({
            data: {
                email: `user${i + 1}@jawedgharab.com`,
                password: await hash("password123", 10),
                name: `محرر ${i + 1}`,
                role: randomItem([UserRole.EDITOR, UserRole.DIRECTOR, UserRole.VIEWER]),
                avatarUrl: "https://via.placeholder.com/100",
                accountStatus: "نشط",
                profileProgress: randomInt(50, 100),
                lastLogin: randomDate(),
            },
        });
        extraUsers.push(user);
    }
    console.log(`✅ Created ${extraUsers.length} additional users`);

    // 3. Create Projects
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
                thumbnailUrl:
                    "https://via.placeholder.com/400x225/2563eb/ffffff?text=MASTERY",
                projectLink: `https://example.com/project/${i + 1}`,
                userId: admin.id,
                createdAt: randomDate(),
                updatedAt: new Date(),
            },
        });
        projects.push(project);
    }
    console.log(`✅ Created ${projects.length} projects`);

    // 4. Create Requests (Leads)
    const requests = [];
    for (let i = 0; i < 15; i++) {
        const request = await prisma.request.create({
            data: {
                name: requestNames[i % requestNames.length],
                type: requestTypes[i % requestTypes.length],
                details: requestDetails[i % requestDetails.length],
                budget: `٥,٠٠٠ - ١٠,٠٠٠ ريال سعودي`,
                location: randomItem(["الرياض", "جدة", "الدمام", "مكة", "المدينة"]),
                deadline: randomFutureDate().toLocaleDateString("ar-SA"),
                status: randomItem(requestStatuses),
                icon: randomItem(icons),
                replied: Math.random() > 0.5,
                repliedAt: Math.random() > 0.5 ? new Date() : undefined,
                createdAt: randomDate(),
                updatedAt: new Date(),
            },
        });
        requests.push(request);
    }
    console.log(`✅ Created ${requests.length} requests`);

    // 5. Create Team Members and assign to projects
    const teamMembers = [];
    for (let i = 0; i < 25; i++) {
        // Randomly assign to a project
        const project = randomItem(projects);

        const member = await prisma.teamMember.create({
            data: {
                name: teamMemberNames[i % teamMemberNames.length],
                email: `team${i + 1}@jawedgharab.com`,
                role: randomItem(teamMemberRoles),
                avatar: "https://via.placeholder.com/50",
                skills: randomItem(teamMemberSkills),
                projectId: project.id,
                createdAt: randomDate(),
                updatedAt: new Date(),
            },
        });
        teamMembers.push(member);
    }
    console.log(`✅ Created ${teamMembers.length} team members`);

    // 6. Summary
    console.log("\n📊 Seeding Summary:");
    console.log(`- Users: ${1 + extraUsers.length}`);
    console.log(`- Projects: ${projects.length}`);
    console.log(`- Requests: ${requests.length}`);
    console.log(`- Team Members: ${teamMembers.length}`);

    console.log("\n✅ Database seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });