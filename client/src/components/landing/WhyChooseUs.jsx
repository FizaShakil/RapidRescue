const reasons = [
  {
    title: "Role-Based Access",
    description: "Separate secure portals for patients, drivers, and dispatch admin. Each role only sees what they need.",
  },
  {
    title: "Medical Profile on Arrival",
    description: "EMTs receive your blood group, allergies, medications, and emergency contacts before they reach you.",
  },
  {
    title: "Live Ambulance Tracking",
    description: "Real-time GPS updates so you and your family know exactly where the ambulance is at all times.",
  },
  {
    title: "Emergency & Scheduled",
    description: "Book an immediate emergency dispatch or schedule non-emergency transport in advance.",
  },
  {
    title: "24/7 Availability",
    description: "The platform operates around the clock. Medical emergencies don't follow business hours.",
  },
  {
    title: "Secure & Private",
    description: "Your medical data is protected with JWT authentication and role-based access control throughout.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-navy-900 bg-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Why Rapid Rescue</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Built specifically for emergency medical dispatch with coordination, safety, and speed as core priorities.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="border border-gray-700 rounded-xl p-6 bg-gray-800">
              <div className="w-6 h-1 bg-red-600 rounded mb-4" />
              <h3 className="font-semibold text-white mb-2">{r.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
