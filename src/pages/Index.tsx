import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CoreFunctions from "@/components/CoreFunctions";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <div id="functions">
          <CoreFunctions />
        </div>
        <div id="about">
          <About />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
