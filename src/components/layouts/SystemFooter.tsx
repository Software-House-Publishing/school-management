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
    <footer className="bg-white/30 backdrop-blur-xl border-t border-white/40 pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
            >
              <img src={Logo} alt="Classivo Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
              <span className="text-xl font-semibold tracking-tight text-classivo-black font-display">
                {t('app.name')}
              </span>
            </motion.div>
            <p className="text-classivo-black/60 text-sm leading-relaxed max-w-sm">
              Empowering education through technology. Simple, powerful, and designed for everyone.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-classivo-black/60 hover:text-classivo-blue hover:bg-white hover:shadow-md transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="font-semibold text-classivo-black mb-6">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavigation(link.path)}
                      className="text-sm text-classivo-black/60 hover:text-classivo-blue transition-colors text-left"
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
        <div className="pt-8 border-t border-classivo-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-classivo-black/40 text-center md:text-left">
            © {new Date().getFullYear()} Classivo Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <button 
               onClick={scrollToTop}
               className="flex items-center space-x-2 text-sm font-medium text-classivo-black/60 hover:text-classivo-blue transition-colors group"
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
