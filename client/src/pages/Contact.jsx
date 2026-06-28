import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-maroon">Contact Support</h1>
        <p className="text-black opacity-80">
          Get in touch with the Eventra Student Coordinating Committee for scheduling or award concerns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border border-lightgray p-6 rounded-lg text-center space-y-3">
          <div className="inline-flex p-3 bg-lightgray/10 text-maroon rounded-full">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="font-display font-semibold text-maroon">Email Us</h3>
          <p className="text-sm text-black opacity-85">events@college.edu</p>
          <p className="text-xs text-black opacity-60">24h response time</p>
        </div>

        <div className="border border-lightgray p-6 rounded-lg text-center space-y-3">
          <div className="inline-flex p-3 bg-lightgray/10 text-maroon rounded-full">
            <Phone className="h-6 w-6" />
          </div>
          <h3 className="font-display font-semibold text-maroon">Call Helpdesk</h3>
          <p className="text-sm text-black opacity-85">+1 (555) 123-4567</p>
          <p className="text-xs text-black opacity-60">Mon - Fri, 9am - 5pm</p>
        </div>

        <div className="border border-lightgray p-6 rounded-lg text-center space-y-3">
          <div className="inline-flex p-3 bg-lightgray/10 text-maroon rounded-full">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="font-display font-semibold text-maroon">Office Location</h3>
          <p className="text-sm text-black opacity-85">Student Council, Block D</p>
          <p className="text-xs text-black opacity-60">Academic Campus</p>
        </div>
      </div>

      {submitted && (
        <div className="p-4 mb-6 bg-lightgray/10 border border-maroon text-maroon font-semibold rounded-md flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>Thank you! Your message has been received. We will get back to you shortly.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 border border-lightgray p-8 rounded-lg bg-white">
        <h3 className="font-display font-bold text-xl text-maroon">Send a Message</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contact-name-page" className="block text-sm font-medium text-black mb-1">Name</label>
            <input
              id="contact-name-page"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
            />
          </div>
          <div>
            <label htmlFor="contact-email-page" className="block text-sm font-medium text-black mb-1">Email</label>
            <input
              id="contact-email-page"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact-message-page" className="block text-sm font-medium text-black mb-1">Message</label>
          <textarea
            id="contact-message-page"
            required
            rows="5"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-maroon text-white font-medium rounded-md hover:opacity-90 transition-opacity"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
