import React, { useState } from 'react';
import { Mail, MessageSquare, Send, ArrowRight } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Since there's no backend yet, fallback to opening mail client
      window.location.href = `mailto:hello@flowmatch.tech?subject=${encodeURIComponent(formData.subject || 'FlowMatch Inquiry')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
      
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEOHead 
        title="Contact Us" 
        description="Get in touch with the FlowMatch team. We'd love to hear your feedback, questions, or integration requests."
        path="/contact" 
      />
      
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
          Get in Touch
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Have a question about FlowMatch? Want to request a specific n8n workflow? 
          Or just want to say hi? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        
        {/* Contact Info Sidebar */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Contact Info</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">Email Us</p>
                  <a href="mailto:hello@flowmatch.tech" className="text-zinc-500 dark:text-zinc-400 text-sm hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    hello@flowmatch.tech
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">Twitter / X</p>
                  <a href="https://twitter.com/progvision" target="_blank" rel="noopener noreferrer" className="text-zinc-500 dark:text-zinc-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    @progvision
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">GitHub</p>
                  <a href="https://github.com/ganeshkrishnareddy/FlowMatch" target="_blank" rel="noopener noreferrer" className="text-zinc-500 dark:text-zinc-400 text-sm hover:text-zinc-900 dark:hover:text-white transition-colors">
                    github.com/ganeshkrishnareddy
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-3">Found a Bug?</h3>
            <p className="text-violet-100 text-sm mb-6 leading-relaxed">
              If you found an issue with the website or a workflow template, please open an issue on our GitHub repository.
            </p>
            <a 
              href="https://github.com/ganeshkrishnareddy/FlowMatch/issues/new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors w-full justify-center"
            >
              Report an Issue
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900/40 rounded-2xl p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-violet-500" />
                Send us a Message
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            
            {isSuccess && (
              <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                <div className="mt-0.5 shrink-0">✨</div>
                <div>
                  <h4 className="font-semibold text-sm">Message Prepared!</h4>
                  <p className="text-xs mt-1 opacity-90">Your default email client should open with your message. If it didn't, you can email us directly at hello@flowmatch.tech.</p>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-shadow"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-shadow"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-shadow"
                >
                  <option value="" disabled>Select a topic...</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                  <option value="Workflow Request">Workflow Request</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-shadow resize-y"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl px-8 py-3.5 text-sm font-bold hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
              >
                {isSubmitting ? 'Preparing Message...' : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
