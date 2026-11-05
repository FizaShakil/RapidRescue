import Hero from "../../components/landing/Hero";
import Services from "../../components/landing/Services";
import HowItWorks from "../../components/landing/HowItWorks";
import AmbulanceTypes from "../../components/landing/AmbulanceTypes";
import WhyChooseUs from "../../components/landing/WhyChooseUs";
import FirstAidPreview from "../../components/landing/FirstAidPreview";
import ContactCTA from "../../components/landing/ContactCTA";

// Each section is an independent component. This file only controls order.
const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <HowItWorks />
      <AmbulanceTypes />
      <WhyChooseUs />
      <FirstAidPreview />
      <ContactCTA />
    </>
  );
};

export default Home;
