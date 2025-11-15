import HeroHeader from "@/src/components/organisms/HeroHeader";
import Header from "@/src/components/organisms/Header/Header";
import ProjectsSection from "@/src/components/organisms/ProjectsSection";
import AboutSection from "@/src/components/organisms/AboutSection";
import ExperienceSection from "@/src/components/organisms/ExperienceSection";

export default function Home() {

  return (
      <>

          <Header/>

          <HeroHeader />

          <div className={"bg-[linear-gradient(to_right,#8080804D_1px,transparent_1px),linear-gradient(to_bottom,#80808090_1px,transparent_1px)] [background-size:60px_60px] bg-secondary-background"}>

              <AboutSection />
              <ExperienceSection/>
              <ProjectsSection />

          </div>

      </>

  );
}
