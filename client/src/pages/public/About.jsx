import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      {/* Header */}
      <section className="bg-gray-900 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">About Rapid Rescue</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          Our mission, how we operate, and who we serve.
        </p>
      </section>

      {/* Mission */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Rapid Rescue was built to address the critical gap in emergency medical dispatch — the delay between a patient&apos;s call for help and the arrival of trained medical personnel.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              By digitizing the dispatch workflow and connecting patients, EMTs, and administrators in a single coordinated platform, we aim to reduce response times and improve patient outcomes.
            </p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
            <ul className="space-y-4 text-sm text-gray-700">
              {[
                "Real-time ambulance dispatch and GPS tracking",
                "Medical profile access for EMTs before arrival",
                "Role-based access for users, drivers, and admins",
                "24/7 platform availability for emergency services",
                "Secure, privacy-first handling of medical data",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-4 h-4 shrink-0 bg-red-600 rounded-full mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Who We Serve</h2>
        </div>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
          {[
            {
              role: "Patients & Users",
              desc: "Individuals requesting emergency or non-emergency ambulance services. Can manage medical profiles and track dispatch.",
            },
            {
              role: "Drivers & EMTs",
              desc: "Qualified emergency personnel with access to patient medical data, assignment details, and live status updates.",
            },
            {
              role: "Dispatch Admin",
              desc: "Control room personnel managing the fleet, assigning resources, and monitoring all active emergency requests.",
            },
          ].map((item) => (
            <div key={item.role} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="w-2 h-5 bg-red-600 rounded mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{item.role}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-12 px-4 text-center border-t border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to get started?</h3>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/register" className="px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition">
            Register Now
          </Link>
          <Link to="/contact" className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:border-gray-400 transition">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
