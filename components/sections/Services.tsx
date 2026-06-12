import ScrollReveal from "../providers/ScrollReveal";
import GlassCard from "../ui/GlassCard";
import { MdMovie, MdOutlineBolt, MdVideoLibrary, MdSmartDisplay, MdCampaign } from "react-icons/md";

const services = [
  {
    icon: MdMovie, // movie_edit
    title: "Video Editing",
    description: "مونتاج سينمائي للأفلام القصيرة والوثائقيات.",
  },
  {
    icon: MdOutlineBolt, // bolt
    title: "Short-form",
    description: "محتوى سريع وخاطف للأنظار لمنصات التواصل.",
  },
  {
    icon: MdVideoLibrary, // video_library
    title: "Reels & TikTok",
    description: "تحويل المقاطع الطويلة إلى فيديوهات عمودية جذابة.",
  },
  {
    icon: MdSmartDisplay, // smart_display
    title: "YouTube",
    description: "تنسيق متكامل لفيديوهات اليوتيوب الطويلة.",
  },
  {
    icon: MdCampaign, // campaign
    title: "Advertising",
    description: "فيديوهات إعلانية ترفع من معدل التحويل والمبيعات.",
  },
];

export default function Services() {
  return (
    <section className="py-24 px-6 md:px-margin-desktop bg-surface-container-low/50 backdrop-blur-sm">
      <div className="mb-16 text-center">
        <ScrollReveal>
          <h2 className="font-headline-lg text-headline-lg mb-4">خدمات احترافية</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </ScrollReveal>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {services.map((service, index) => (
          <ScrollReveal key={index}>
            <GlassCard hoverScale className="p-8 rounded-24 border-white/5">
              <service.icon className="text-primary text-4xl mb-6" />
              <h3 className="font-headline-md text-headline-md mb-3">{service.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {service.description}
              </p>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}