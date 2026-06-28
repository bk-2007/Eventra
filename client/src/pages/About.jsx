import React from 'react';
import { Award, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-maroon">About Eventra</h1>
        <p className="text-black opacity-80 max-w-2xl mx-auto text-lg">
          Empowering student innovation and simplifying certificate verification through automated systems.
        </p>
      </div>

      {/* Detail section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-maroon">Our Vision</h2>
          <p className="text-black opacity-85 leading-relaxed">
            At Eventra, our goal is to eliminate paper lists, slow check-ins, and manual certificate design bottlenecks that occur during campus events.
          </p>
          <p className="text-black opacity-85 leading-relaxed">
            By consolidating technical and creative cultural competitions under a single portal, students can assemble teams, keep track of schedules, and download instant PDFs of their certificates that can be shared on professional portals.
          </p>
        </div>
        <div className="h-64 bg-lightgray rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
            alt="Students collaborating"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Core Values */}
      <div className="border-t border-lightgray pt-12">
        <h3 className="text-2xl font-display font-bold text-center text-maroon mb-10">Why Choose Our Portal</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 text-center">
            <div className="inline-flex p-3 bg-lightgray/10 text-maroon rounded-full">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-maroon text-lg">Instant Tracking</h4>
            <p className="text-xs text-black opacity-80">Track registrations, slots, schedules, and locations instantly in real time.</p>
          </div>
          <div className="space-y-3 text-center">
            <div className="inline-flex p-3 bg-lightgray/10 text-maroon rounded-full">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-maroon text-lg">Secure Verification</h4>
            <p className="text-xs text-black opacity-80">Every certificate gets a unique ID printed onto the PDF for easy recruitment checks.</p>
          </div>
          <div className="space-y-3 text-center">
            <div className="inline-flex p-3 bg-lightgray/10 text-maroon rounded-full">
              <Award className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-maroon text-lg">Bulk Automated Flow</h4>
            <p className="text-xs text-black opacity-80">Administrators mark attendance and trigger bulk PDFs for all present participants.</p>
          </div>
          <div className="space-y-3 text-center">
            <div className="inline-flex p-3 bg-lightgray/10 text-maroon rounded-full">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-maroon text-lg">Team Signups</h4>
            <p className="text-xs text-black opacity-80">Form teams inside registrations with user roll numbers in a simple form flow.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
