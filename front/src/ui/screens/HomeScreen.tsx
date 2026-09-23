import Header from "@/src/ui/components/organisms/Header/Header";
import HeroHeader from "@/src/ui/components/organisms/HeroHeader";
import AboutSection from "@/src/ui/components/organisms/AboutSection";
import ExperienceSection from "@/src/ui/components/organisms/ExperienceSection";
import ProjectsSection from "@/src/ui/components/organisms/ProjectsSection";
import BlogSection from "@/src/ui/components/organisms/BlogSection";

export default function HomeScreen() {
    return (
        <>
            <Header />
            <HeroHeader />
            <div className="bg-[linear-gradient(to_right,#8080804D_1px,transparent_1px),linear-gradient(to_bottom,#80808090_1px,transparent_1px)] bg-size-[60px_60px] bg-secondary-background">
                <AboutSection />
                <ExperienceSection />
                <ProjectsSection />
                <BlogSection />
            </div>
        </>
    );
}
