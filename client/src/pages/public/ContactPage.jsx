import { useState } from "react";

// No public contact API exists on the backend yet.
// This form is UI-complete and ready to wire up when the endpoint is available.
const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: connect to backend contact endpoint when available
    setSubmitted(true);
  };

  return (
    <div>
      <section className="bg-gray-900 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          For general enquiries, partnerships, or support — reach out below.
        </p>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="flex flex-col gap-5 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Emergency</p>
                <p>For active emergencies, do not use this form. Use the ambulance booking system or call your local emergency services.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Email</p>
                <p>support@rapidrescue.pk</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Phone</p>
                <p>+92 300 000 0000</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Availability</p>
                <p>Dispatch operations: 24/7<br />Admin support: Mon–Sat, 9am–6pm</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div className="p-8 bg-green-50 border border-green-200 rounded-xl text-center">
                <h3 className="font-semibold text-green-800 mb-2">Message Received</h3>
                <p className="text-green-700 text-sm">
                  Thank you for reaching out. We&apos;ll respond to your enquiry as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    id="name" name="name" type="text" required
                    value={form.name} onChange={handleChange}
                    placeholder="Your name"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email" name="email" type="email" required
                    value={form.email} onChange={handleChange}
                    placeholder="you@example.com"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                  <input
                    id="subject" name="subject" type="text" required
                    value={form.subject} onChange={handleChange}
                    placeholder="What is this regarding?"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message" name="message" rows={5} required
                    value={form.message} onChange={handleChange}
                    placeholder="Your message..."
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
