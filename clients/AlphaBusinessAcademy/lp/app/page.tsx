import Hero from "./components/sections/Hero";
import PainCards from "./components/sections/PainCards";
import Transition from "./components/sections/Transition";
import Pillars from "./components/sections/Pillars";
import EventDetails from "./components/sections/EventDetails";
import PhotoGallery from "./components/sections/PhotoGallery";
import Speakers from "./components/sections/Speakers";
import Qualification from "./components/sections/Qualification";
import FAQ from "./components/sections/FAQ";
import ApplicationForm from "./components/sections/ApplicationForm";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <PainCards />
      <Transition />
      <Pillars />
      <EventDetails />
      <PhotoGallery />
      <Speakers />
      <Qualification />
      <FAQ />
      <Footer />
    </main>
  );
}
