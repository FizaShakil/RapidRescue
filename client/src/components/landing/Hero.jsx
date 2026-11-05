import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded-full border border-red-100">
            Emergency Medical Dispatch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Rapid Ambulance Response <br />
            <span className="text-red-600">When Every Second Counts</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
            Rapid Rescue connects patients to dispatched ambulances instantly. Request emergency or scheduled medical transport, share your medical profile, and track your ambulance in real time.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition text-sm"
            >
              Book an Ambulance
            </Link>
            <Link
              to="/services"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition text-sm"
            >
              See Our Services
            </Link>
          </div>
        </div>

        {/* Visual panel */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 flex flex-col gap-5">
          {[
            { step: "1", text: "Create your account and fill your medical profile" },
            { step: "2", text: "Submit an emergency or non-emergency booking request" },
            { step: "3", text: "Dispatch team assigns an ambulance and driver" },
            { step: "4", text: "Track your ambulance in real time until arrival" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <span className="w-8 h-8 shrink-0 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {item.step}
              </span>
              <p className="text-gray-700 text-sm leading-relaxed pt-1">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
