import { Link } from "react-router-dom";

const types = [
  {
    name: "BLS — Basic Life Support",
    badge: "BLS",
    description:
      "Equipped for non-critical patient transport. Carries oxygen, first aid supplies, and basic monitoring equipment. Staffed by trained EMTs.",
    suitable: "Non-emergency transfers, stable patients",
  },
  {
    name: "ALS — Advanced Life Support",
    badge: "ALS",
    description:
      "Carries advanced airway management tools, IV medications, cardiac monitors, and defibrillators. Staffed by paramedics.",
    suitable: "Cardiac events, respiratory emergencies, trauma",
  },
  {
    name: "ICU — Mobile Intensive Care",
    badge: "ICU",
    description:
      "Fully equipped mobile intensive care unit for critically ill patients requiring continuous monitoring and advanced intervention during transport.",
    suitable: "Critical care transfers, severe trauma, post-surgical",
  },
];

const badgeColor = { BLS: "bg-blue-100 text-blue-700", ALS: "bg-amber-100 text-amber-700", ICU: "bg-red-100 text-red-700" };

const AmbulanceTypes = () => {
  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ambulance Fleet</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Our fleet covers the full spectrum of medical transport requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {types.map((t) => (
            <div key={t.badge} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
              <span className={`self-start px-3 py-1 rounded-full text-xs font-bold ${badgeColor[t.badge]}`}>
                {t.badge}
              </span>
              <h3 className="font-semibold text-gray-900">{t.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t.description}</p>
              <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
                <span className="font-medium text-gray-600">Suitable for: </span>
                {t.suitable}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/ambulance-types"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition text-sm"
          >
            Full Equipment Details
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AmbulanceTypes;
