import { Link } from "react-router-dom";

const ContactCTA = () => {
  return (
    <section className="bg-red-600 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Need an Ambulance Right Now?
        </h2>
        <p className="text-red-100 text-sm mb-8">
          Register for a free account to book emergency or non-emergency ambulance services. Our dispatch team is available 24/7.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition text-sm"
          >
            Book an Ambulance
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 border border-red-200 text-white font-semibold rounded-lg hover:bg-red-700 transition text-sm"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
