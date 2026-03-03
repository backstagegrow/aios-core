import Hero from "./components/Hero";
import PainCards from "./components/PainCards";
import Transition from "./components/Transition";
import Pillars from "./components/Pillars";
import EventDetails from "./components/EventDetails";
import SocialProof from "./components/SocialProof";
import Speakers from "./components/Speakers";
import Qualification from "./components/Qualification";
import FAQ from "./components/FAQ";
import ApplicationForm from "./components/ApplicationForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <PainCards />
      <Transition />
      <Pillars />
      <EventDetails />
      <SocialProof />
      <Speakers />
      <Qualification />
      <FAQ />
      <ApplicationForm />
      <Footer />
    </main>
  );
}
