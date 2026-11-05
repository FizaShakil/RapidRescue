import { Link } from "react-router-dom";

const ambulances = [
  {
    badge: "BLS",
    name: "Basic Life Support",
    color: "bg-blue-100 text-blue-700",
    description:
      "BLS ambulances are designed for patients who are stable and do not require advanced medical intervention during transport.",
    equipment: [
      "Oxygen supply system",
      "Basic airway management tools",
      "Stretcher and immobilization equipment",
      "Automated External Defibrillator (AED)",
      "Bandaging and wound care supplies",
      "Blood pressure and pulse oximetry monitoring",
    ],
    staff: "Trained Emergency Medical Technicians (EMTs)",
    suitable: "Non-emergency transfers, stable post-surgical patients, routine medical transport",
  },
  {
    badge: "ALS",
    name: "Advanced Life Support",
    color: "bg-amber-100 text-amber-700",
    description:
      "ALS units carry advanced equipment and are staffed by paramedics capable of administering medications and performing complex procedures in the field.",
    equipment: [
      "Advanced airway management (intubation, BVM)",
      "12-lead ECG cardiac monitor",
      "Manual defibrillator / cardioversion",
      "IV access and fluid therapy",
      "Emergency medications (epinephrine, atropine, etc.)",
      "Pulse oximetry, capnography",
    ],
    staff: "Certified Paramedics",
    suitable: "Cardiac emergencies, respiratory failure, trauma, stroke, severe allergic reactions",
  },
  {
    badge: "ICU",
    name: "Mobile Intensive Care Unit",
    color: "bg-red-100 text-red-700",
    description:
      "ICU ambulances are fully equipped mobile critical care environments for the most severely ill patients requiring continuous monitoring and advanced support during transport.",
    equipment: [
      "Mechanical ventilator",
      "Continuous multi-parameter monitoring",
      "Infusion pumps and syringe drivers",
      "Portable ultrasound",
      "Advanced cardiac and respiratory support devices",
      "Full emergency drug cabinet",
    ],
    staff: "Intensive Care Paramedics or Critical Care Nurses",
    suitable: "Critical care inter-hospital transfers, severe trauma, post-surgical critical patients",
  },
];

const AmbulanceTypesPage = () => {
  return (
    <div>
      <section className="bg-gray-900 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">Ambulance Types & Equipment</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          Our fleet is categorised by level of care. The dispatch team assigns the appropriate unit based on the emergency type.
        </p>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
          {ambulances.map((a) => (
            <div key={a.badge} className="border border-gray-100 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${a.color}`}>
                  {a.badge}
                </span>
                <h2 className="text-xl font-bold text-gray-900">{a.name}</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{a.description}</p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Equipment</h4>
                  <ul className="space-y-2">
                    {a.equipment.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 shrink-0 bg-red-600 rounded-full mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Staffing</h4>
                    <p className="text-sm text-gray-700">{a.staff}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Suitable For</h4>
                    <p className="text-sm text-gray-700">{a.suitable}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-4 text-center border-t border-gray-100">
        <p className="text-gray-600 text-sm mb-4">
          The dispatch team assigns the appropriate ambulance type based on your emergency details.
        </p>
        <Link
          to="/register"
          className="inline-block px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Book an Ambulance
        </Link>
      </section>
    </div>
  );
};

export default AmbulanceTypesPage;
