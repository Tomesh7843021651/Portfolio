import Hero from "../components/home/Hero"
import AboutPreview from "../components/home/AboutPreview"
import ProjectsPreview from "../components/home/ProjectsPreview"
import SkillsPreview from "../components/home/SkillsPreview"
import CTA from "../components/home/CTA"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import Gallery from "../components/home/GalleryShowcase"



export default function Home() {
  return (
    <>
     <Navbar />
      <Hero />
      <AboutPreview />
      <Gallery />
      <ProjectsPreview />
      <SkillsPreview />
      <CTA />
      <Footer/>
      
    </>
  )
}
