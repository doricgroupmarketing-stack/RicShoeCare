import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'name' ? 'firstName' : id === 'lastname' ? 'lastName' : id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = '254732746630';
    const text = `Hello, my name is ${formData.firstName} ${formData.lastName}.%0A%0A*Email:* ${formData.email}%0A*Subject:* ${formData.subject}%0A%0A*Message:*%0A${formData.message}`;
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <SEOHead 
        title="Contact Us" 
        description="Get in touch with RIC Shoe Care for orders, inquiries, or feedback. Visit us in Nairobi or contact us via phone or email."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900">Get in Touch</h1>
          <p className="mt-4 text-lg text-gray-500">
            Have questions about your order or our services? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100 text-primary-600">
                      <MapPin size={24} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Find us</h4>
                    <p className="mt-1 text-gray-500">
                      Doric Industrial Park<br />
                      Along Nairobi-Namanga Road<br />
                      Behind NITA
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      P.O. Box 58097 - 00200, Nairobi
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100 text-primary-600">
                      <Phone size={24} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Call Us</h4>
                    <p className="mt-1 text-gray-500">
                      +254 732 746 630
                    </p>
                    <p className="text-sm text-gray-400">Mon-Fri 9am to 6pm</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100 text-primary-600">
                      <Mail size={24} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Email Us</h4>
                    <p className="mt-1 text-gray-500">
                      doricindustries@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gray-100 opacity-60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="bg-white/90 px-4 py-2 rounded-lg shadow-sm font-medium text-gray-600">Map Integration Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" id="name" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 border p-3" placeholder="John" />
                </div>
                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" id="lastname" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 border p-3" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 border p-3" placeholder="john@example.com" />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <select id="subject" value={formData.subject} onChange={handleChange} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 border p-3">
                  <option>General Inquiry</option>
                  <option>Order Status</option>
                  <option>Corporate Services</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" value={formData.message} onChange={handleChange} required rows={4} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 border p-3" placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-[#25D366] hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] transition-colors">
                <Send size={20} className="mr-2" /> Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;