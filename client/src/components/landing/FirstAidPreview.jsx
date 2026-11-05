import { Link } from "react-router-dom";

const tips = [
  {
    label: "CPR",
    instruction: "30 chest compressions followed by 2 rescue breaths. Push hard and fast — at least 2 inches deep.",
  },
  {
    label: "Choking",
    instruction: "5 back blows between shoulder blades, then 5 abdominal thrusts. Repeat until the object is dislodged.",
  },
  {
    label: "Bleeding",
    instruction: "Apply firm direct pressure with a clean cloth. Do not remove the cloth if it soaks through — add more on top.",
  },
];

const FirstAidPreview = () => {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded-full border border-red-100">
            While You Wait
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Basic First Aid Guide
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            While waiting for the ambulance, the right actions in the first few minutes can make a critical difference. Our first aid guide covers the most common emergencies with clear, step-by-step instructions.
          </p>
          <Link
            to="/first-aid"
            className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition text-sm"
          >
            Open First Aid Guide
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {tips.map((tip) => (
            <div key={tip.label} className="flex gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <span className="shrink-0 w-12 h-8 bg-red-600 text-white text-xs font-bold rounded flex items-center justify-center">
                {tip.label}
              </span>
              <p className="text-gray-600 text-sm leading-relaxed">{tip.instruction}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FirstAidPreview;
