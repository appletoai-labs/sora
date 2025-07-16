import Hero from "@/components/Hero";
import CoreFunctions from "@/components/CoreFunctions";
import About from "@/components/About";

const Index = () => {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <div id="functions">
          <CoreFunctions />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="integration">
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">For Professionals</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Integrate SORA into your practice to enhance patient care and streamline therapy sessions.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-3">Clinical Integration</h3>
                  <p className="text-muted-foreground">
                    Seamlessly integrate SORA's AI capabilities into your existing workflow for enhanced patient support.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-3">Professional Dashboard</h3>
                  <p className="text-muted-foreground">
                    Monitor patient progress and access detailed analytics through our professional interface.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
