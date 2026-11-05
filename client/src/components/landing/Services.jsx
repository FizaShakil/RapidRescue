import { Link } from "react-router-dom";

const services = [
  {
    title: "Emergency Dispatch",
    description:
      "Immediate ambulance dispatch for life-threatening emergencies. Submit a request and our team responds without delay.",
  },
  {
    title: "Non-Emergency Transport",
    description:
      "Schedule ambulance transport for hospital transfers, routine medical procedures, or non-critical patient movement.",
  },
  {
    title: "Real-Time GPS Tracking",
    description:
      "Track the assigned ambulance live from dispatch to arrival so you always know how far help is.",
  },
  {
    title: "Medical Profile Sharing",
    description:
      "Store blood group, allergies, chronic conditions, and emergency contacts. EMTs receive this before they arrive.",
  },
  {
    title: "EMT / Driver Portal",
    description:
      "Dedicated portal for drivers and EMTs to receive assignments, review patient details, and update live status.",
  },
  {
    title: "First Aid Guidance",
    description:
      "Interactive first aid instructions to help bystanders provide basic care while waiting for the ambulance.",
  },
];

const Services = () => {
  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">What We Provide</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            End-to-end emergency and non-emergency medical transport services, built around speed, safety, and coordination.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="w-2 h-6 bg-red-600 rounded mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition text-sm"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
