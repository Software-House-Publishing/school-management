import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ArrowUp,
  Mail,
  MapPin
} from 'lucide-react';
import Logo from '@/assets/Logo.png';

export default function SystemFooter() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', path: '/#features' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'API Documentation', path: '/docs' },
        { label: 'Status', path: '/status' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press', path: '/press' },
        { label: 'Contact', path: '/contact' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Cookie Policy', path: '/cookies' },
        { label: 'GDPR', path: '/gdpr' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/help' },
        { label: 'Documentation', path: '/docs' },
        { label: 'Community', path: '/community' },
        { label: 'System Status', path: '/status' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/classivo' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/company/classivo' },
    { icon: Github, label: 'GitHub', url: 'https://github.com/classivo' },
    { icon: Instagram, label: 'Instagram', url: 'https://instagram.com/classivo' },
  ];

  const handleNavigation = (path: string) => {
    if (path.includes('#')) {
      const section = path.split('#')[1];
      navigate('/');
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="relative mt-auto border-t border-white/40 bg-white/40 backdrop-blur-3xl overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[0%] left-[20%] w-[40%] h-[40%] bg-classivo-lightblue/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-classivo-blue/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img src={Logo} alt="Classivo Logo" className="w-12 h-12 object-contain drop-shadow-sm relative z-10" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-classivo-black font-display">
                {t('app.name')}
              </span>
            </motion.div>

            <p className="text-classivo-black/70 text-base leading-relaxed max-w-sm font-light">
              Empowering education through technology. Simple, powerful, and designed for everyone who cares about learning.
            </p>

            <div className="flex flex-col gap-3 text-sm text-classivo-black/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-classivo-blue" />
                <span>San Francisco, CA 94103</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-classivo-blue" />
                <span>hello@classivo.io</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center text-classivo-black/70 hover:text-white hover:bg-classivo-blue hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-white/50"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="font-semibold text-classivo-black mb-6 text-lg">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavigation(link.path)}
                      className="text-sm text-classivo-black/60 hover:text-classivo-blue transition-colors text-left hover:translate-x-1 duration-200 inline-block font-medium"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-classivo-black/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-classivo-black/40 text-center md:text-left font-medium">
            © {new Date().getFullYear()} Classivo Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
            </div>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-sm font-semibold text-classivo-black/60 hover:text-classivo-blue transition-colors group px-4 py-2 rounded-lg hover:bg-white/50"
            >
              <span>Back to top</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
