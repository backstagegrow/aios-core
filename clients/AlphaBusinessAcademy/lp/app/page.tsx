import Hero from "./components/Hero";
import PainCards from "./components/PainCards";
import Transition from "./components/Transition";
import Pillars from "./components/Pillars";
import EventDetails from "./components/EventDetails";
import SocialProof from "./components/SocialProof";
import PhotoGallery from "./components/PhotoGallery";
import Speakers from "./components/Speakers";
import Qualification from "./components/Qualification";
import FAQ from "./components/FAQ";
import ApplicationForm from "./components/ApplicationForm";
import Footer from "./components/Footer";
import ApplicationModal from "./components/ApplicationModal";

export default function Home() {
  return (
    <main>
      <Hero />
      <PainCards />
      <Transition />
      <Pillars />
      <EventDetails />
      <SocialProof />
      <PhotoGallery />
      <Speakers />
      <Qualification />
      <FAQ />
      <ApplicationForm />
      <Footer />
      <ApplicationModal />
    </main>
  );
}
