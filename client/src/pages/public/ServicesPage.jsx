import { Link } from "react-router-dom";

const services = [
  {
    title: "Emergency Ambulance Dispatch",
    description:
      "Immediate dispatch for life-threatening situations. Submit your request with pickup location and emergency description. Our control room assigns the nearest available unit within minutes.",
    type: "emergency",
  },
  {
    title: "Non-Emergency Scheduled Transport",
    description:
      "Plan ahead for hospital appointments, medical procedures, or inter-facility transfers. Choose your date, time, and pickup location.",
    type: "non_emergency",
  },
  {
    title: "Real-Time GPS Tracking",
    description:
      "Once dispatched, track your assigned ambulance live on the map. See the driver's current location and estimated arrival time.",
    type: "tracking",
  },
  {
    title: "Medical Profile Management",
    description:
      "Store your blood group, allergies, chronic conditions, current medications, and emergency contacts. This information is shared with the responding EMT automatically at the time of booking.",
    type: "profile",
  },
  {
    title: "EMT & Driver Portal",
    description:
      "Drivers and EMTs access a dedicated portal to receive assignment alerts, review patient medical data, and update their status — en-route, arrived, transporting.",
    type: "driver",
  },
  {
    title: "First Aid Guidance",
    description:
      "Interactive first aid instructions for common emergencies — CPR, choking, bleeding control, and more. Available to all users while waiting for the ambulance.",
    type: "firstaid",
  },
];

const ServicesPage = () => {
  return (
    <div>
      <section className="bg-gray-900 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">Our Services</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          Everything Rapid Rescue provides, in detail.
        </p>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          {services.map((s) => (
            <div key={s.type} className="flex gap-6 p-6 border border-gray-100 rounded-xl shadow-sm">
              <div className="w-1 shrink-0 bg-red-600 rounded" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-red-600 py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to use these services?</h2>
        <Link
          to="/register"
          className="inline-block px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition text-sm"
        >
          Create a Free Account
        </Link>
      </section>
    </div>
  );
};

export default ServicesPage;
