import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-red-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">RR</span>
              </span>
              <span className="font-bold text-white text-base">
                Rapid<span className="text-red-500">Rescue</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Fast, reliable ambulance dispatch and emergency medical response for your community.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Services", to: "/services" },
                { label: "Contact", to: "/contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Services</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Emergency Booking", to: "/services" },
                { label: "Ambulance Types", to: "/ambulance-types" },
                { label: "First Aid Guide", to: "/first-aid" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Emergency</h3>
            <p className="text-sm mb-3">For life-threatening emergencies, always call your local emergency services first.</p>
            <Link
              to="/register"
              className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Book an Ambulance
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Rapid Rescue. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
