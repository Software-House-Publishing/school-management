import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ArrowUp
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
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/schoolmanagement' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/company/schoolmanagement' },
    { icon: Github, label: 'GitHub', url: 'https://github.com/schoolmanagement' },
    { icon: Instagram, label: 'Instagram', url: 'https://instagram.com/schoolmanagement' },
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
    <footer className="bg-white/50 backdrop-blur-md border-t border-white/60 pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
            >
              <img src={Logo} alt="Classivo Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-semibold tracking-tight text-classivo-black font-display">
                {t('app.name')}
              </span>
            </motion.div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Empowering education through technology. Simple, powerful, and designed for everyone.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-classivo-blue hover:shadow-md transition-all border border-gray-100"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-wide font-display">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavigation(link.path)}
                      className="text-sm text-gray-500 hover:text-classivo-blue transition-colors"
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
        <div className="pt-8 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {t('app.name')}. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Operational</span>
            </div>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white hover:bg-gray-50 text-gray-400 hover:text-classivo-blue transition-all shadow-sm border border-gray-100"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
