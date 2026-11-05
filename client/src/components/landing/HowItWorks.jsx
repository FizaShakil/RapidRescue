const steps = [
  {
    number: "01",
    title: "Register & Set Up Profile",
    description:
      "Create your account and fill in your medical profile including blood group, allergies, and emergency contacts.",
  },
  {
    number: "02",
    title: "Submit a Booking Request",
    description:
      "Choose emergency or non-emergency, enter pickup location, describe the situation, and submit your request.",
  },
  {
    number: "03",
    title: "Dispatch Assigns Resources",
    description:
      "Our dispatch team reviews your request and assigns the nearest available ambulance and qualified EMT.",
  },
  {
    number: "04",
    title: "Track & Receive Care",
    description:
      "Follow the ambulance live on the map. EMTs arrive with your medical information already in hand.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            From request to arrival, the entire process is streamlined so you can focus on what matters.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line (hidden on last item and mobile) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gray-200 -translate-x-4 z-0" />
              )}
              <div className="relative z-10">
                <span className="block text-5xl font-extrabold text-red-50 leading-none mb-2 select-none">
                  {step.number}
                </span>
                <h3 className="font-semibold text-gray-900 mb-2 -mt-4">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
