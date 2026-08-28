import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { TikTokIcon } from '../components/TikTokIcon';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product / Sizing Question');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  return (
    <div id="contact-page" className="min-h-screen bg-[#F5E6D3] text-[#4A382D] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#77553b] font-semibold block">
            Atelier Concierge
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#4A382D]">Get in Touch</h1>
          <p className="text-xs sm:text-sm text-[#82756c]">
            Have a question about fabric fit, order dispatch, or corporate gifts? Our team is at your disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Channels & Studio Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-lg font-serif text-[#4A382D] border-b border-[#d4c3b9] pb-3">
                Direct Channels
              </h2>

              <div className="space-y-4 text-xs">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 p-3 bg-[#F5E6D3]/40 hover:bg-[#F5E6D3] rounded-lg transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#4A382D] block">WhatsApp Concierge</span>
                    <span className="text-[#82756c]">{settings.whatsapp}</span>
                  </div>
                </a>

                {/* Vodafone Cash & Phone */}
                <div className="flex items-start gap-3 p-3 bg-[#F5E6D3]/40 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#E60000] text-white flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#4A382D] block">
                      Vodafone Cash Line & Phone
                    </span>
                    <span className="text-[#82756c] font-mono">{settings.phone}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-3 bg-[#F5E6D3]/40 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#77553b] text-white flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#4A382D] block">Customer Service</span>
                    <span className="text-[#82756c]">{settings.email}</span>
                  </div>
                </div>

                {/* Atelier Address */}
                <div className="flex items-start gap-3 p-3 bg-[#F5E6D3]/40 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#4A382D] text-white flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#4A382D] block">Atelier Location</span>
                    <span className="text-[#82756c]">{settings.address}</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="border-t border-[#d4c3b9] pt-4">
                <span className="text-[10px] uppercase font-sans tracking-widest text-[#77553b] font-semibold block mb-3">
                  Follow Our Journey
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-[#F5E6D3] text-[#4A382D] hover:bg-[#B89578] hover:text-[#FFFDF9] rounded-full transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-[#F5E6D3] text-[#4A382D] hover:bg-[#B89578] hover:text-[#FFFDF9] rounded-full transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={settings.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-[#F5E6D3] text-[#4A382D] hover:bg-[#B89578] hover:text-[#FFFDF9] rounded-full transition-colors"
                  >
                    <TikTokIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#FFFDF9] rounded-xl border border-[#d4c3b9] p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-serif text-[#4A382D] border-b border-[#d4c3b9] pb-3 mb-6">
                Send an Inquiry
              </h2>

              {submitted ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-serif text-emerald-800">Message Dispatched</h3>
                  <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                    Thank you, {name}. Our client experience team in Cairo will respond to your inquiry shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full text-xs p-3 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@domain.com"
                        className="w-full text-xs p-3 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                      Topic / Inquiry Type
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full text-xs p-3 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b] cursor-pointer"
                    >
                      <option value="Product / Sizing Question">Product / Sizing Advice</option>
                      <option value="Order Tracking / Delivery">Order Tracking / Delivery</option>
                      <option value="Payment Transfer Confirmation">Payment Transfer Confirmation</option>
                      <option value="Wholesale / Collaborations">Wholesale / Atelier Collaboration</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A382D] block mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can our atelier specialists assist you?"
                      className="w-full text-xs p-3 bg-[#F5E6D3]/30 border border-[#d4c3b9] rounded focus:outline-none focus:border-[#77553b]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#B89578] hover:bg-[#96745A] text-[#FFFDF9] text-xs font-sans uppercase tracking-wider font-semibold rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
