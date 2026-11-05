const guides = [
  {
    id: "cpr",
    title: "CPR — Cardiopulmonary Resuscitation",
    urgency: "Life-threatening",
    steps: [
      "Ensure the scene is safe. Check if the person is responsive by tapping their shoulders and calling out.",
      "Call for emergency services immediately or ask someone nearby to call.",
      "Lay the person flat on their back on a firm surface.",
      "Place the heel of your hand on the centre of their chest (lower half of breastbone).",
      "Interlock your fingers and keep your arms straight. Compress at least 2 inches deep at a rate of 100–120 per minute.",
      "After 30 compressions, give 2 rescue breaths: tilt the head back, lift the chin, pinch the nose, and breathe into the mouth until the chest rises.",
      "Continue the 30:2 cycle until emergency services arrive or the person regains consciousness.",
    ],
  },
  {
    id: "choking",
    title: "Choking — Adult",
    urgency: "Immediate action required",
    steps: [
      "Ask the person if they are choking. If they can cough or speak, encourage them to keep coughing.",
      "If they cannot cough, speak, or breathe, act immediately.",
      "Give 5 firm back blows between the shoulder blades with the heel of your hand.",
      "If the object is not dislodged, perform 5 abdominal thrusts (Heimlich manoeuvre): stand behind the person, make a fist above the navel, cover with your other hand, and thrust inward and upward.",
      "Alternate 5 back blows and 5 abdominal thrusts until the object is cleared or the person loses consciousness.",
      "If they lose consciousness, begin CPR and call emergency services.",
    ],
  },
  {
    id: "bleeding",
    title: "Severe Bleeding",
    urgency: "Act within minutes",
    steps: [
      "Wear gloves if available. If not, use a cloth barrier.",
      "Apply firm, direct pressure to the wound with a clean cloth or bandage.",
      "Maintain continuous pressure. Do not remove the cloth if it soaks through — add more material on top.",
      "If the wound is on a limb and bleeding is severe, raise the limb above heart level while maintaining pressure.",
      "If bleeding does not stop and you have a tourniquet, apply it 5–7 cm above the wound and note the time of application.",
      "Keep the person still and warm. Call emergency services or transport to hospital immediately.",
    ],
  },
  {
    id: "burns",
    title: "Burns",
    urgency: "Cool immediately",
    steps: [
      "Move the person away from the source of the burn. Ensure your own safety first.",
      "Cool the burn with cool (not cold) running water for at least 20 minutes.",
      "Do not use ice, butter, toothpaste, or any home remedies.",
      "Remove clothing and jewellery near the burn unless stuck to the skin.",
      "Cover the burn loosely with a clean non-fluffy material (cling film or a clean plastic bag works well).",
      "For large burns, chemical burns, or burns on the face, hands, or genitals — call emergency services.",
    ],
  },
  {
    id: "fracture",
    title: "Suspected Fracture",
    urgency: "Immobilise and transport",
    steps: [
      "Do not attempt to straighten the limb.",
      "Immobilise the injured area in the position found using a splint, padding, or firm object.",
      "Apply ice wrapped in a cloth to reduce swelling. Do not place ice directly on skin.",
      "Elevate the injured limb if possible and if it does not cause more pain.",
      "For suspected spinal injuries, do not move the person unless they are in immediate danger.",
      "Call emergency services for open fractures, suspected spinal fractures, or fractures in children.",
    ],
  },
];

const urgencyColor = {
  "Life-threatening": "bg-red-100 text-red-700",
  "Immediate action required": "bg-orange-100 text-orange-700",
  "Act within minutes": "bg-amber-100 text-amber-700",
  "Cool immediately": "bg-blue-100 text-blue-700",
  "Immobilise and transport": "bg-gray-100 text-gray-700",
};

const FirstAidPage = () => {
  return (
    <div>
      <section className="bg-gray-900 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">First Aid Guide</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          Step-by-step first aid instructions for common emergencies. These are basic guidelines — always call emergency services for serious situations.
        </p>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {guides.map((guide) => (
            <article key={guide.id} className="border border-gray-100 rounded-2xl p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-900">{guide.title}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${urgencyColor[guide.urgency]}`}>
                  {guide.urgency}
                </span>
              </div>
              <ol className="space-y-3 list-none">
                {guide.steps.map((step, i) => (
                  <li key={i} className="flex gap-4 text-sm text-gray-700">
                    <span className="shrink-0 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-12 max-w-xl mx-auto">
          This guide is for basic emergency preparedness only. It does not replace professional medical training. Always call emergency services in life-threatening situations.
        </p>
      </section>
    </div>
  );
};

export default FirstAidPage;
