import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  FileText, 
  Users, 
  Globe,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ArrowUp
} from 'lucide-react';

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
        { label: 'Features', path: '/#features', icon: BookOpen },
        { label: 'Pricing', path: '/pricing', icon: Globe },
        { label: 'API Documentation', path: '/docs', icon: FileText },
        { label: 'Status', path: '/status', icon: Shield },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about', icon: Users },
        { label: 'Careers', path: '/careers', icon: Users },
        { label: 'Press', path: '/press', icon: Globe },
        { label: 'Contact', path: '/contact', icon: Mail },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', path: '/terms', icon: FileText },
        { label: 'Privacy Policy', path: '/privacy', icon: Shield },
        { label: 'Cookie Policy', path: '/cookies', icon: FileText },
        { label: 'GDPR', path: '/gdpr', icon: Shield },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/help', icon: BookOpen },
        { label: 'Documentation', path: '/docs', icon: FileText },
        { label: 'Community', path: '/community', icon: Users },
        { label: 'System Status', path: '/status', icon: Shield },
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
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t('app.name')}</h3>
                <p className="text-gray-400 text-sm">Empowering Education Everywhere</p>
              </div>
            </motion.div>
            
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Comprehensive school management system designed to streamline educational operations, 
              enhance learning experiences, and connect students, teachers, and parents in one unified platform.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@schoolmanagement.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <span>
                  123 Education Street<br />
                  Learning City, LC 12345<br />
                  United States
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 flex items-center justify-center transition-all duration-200 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">{section.title}</h4>
              <div className="space-y-3">
                {section.links.map((link, linkIndex) => {
                  const Icon = link.icon;
                  return (
                    <motion.button
                      key={link.label}
                      onClick={() => handleNavigation(link.path)}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 text-sm group w-full text-left"
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sectionIndex * 0.1 + linkIndex * 0.05 }}
                    >
                      <Icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
                      <span>{link.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm">
                Get the latest updates, features, and educational insights delivered to your inbox.
              </p>
            </div>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <motion.button
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2024 {t('app.name')}. All rights reserved.</span>
              <div className="hidden md:flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/sitemap')} 
                  className="hover:text-white transition-colors duration-200"
                >
                  Sitemap
                </button>
                <span>•</span>
                <button 
                  onClick={() => navigate('/accessibility')} 
                  className="hover:text-white transition-colors duration-200"
                >
                  Accessibility
                </button>
              </div>
            </div>

            {/* Scroll to Top Button */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 text-gray-300 hover:text-white transition-all duration-200 text-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-4 h-4" />
              <span>Back to Top</span>
            </motion.button>
          </div>

          {/* Mobile Links */}
          <div className="md:hidden mt-4 flex items-center space-x-4 text-sm text-gray-400 border-t border-gray-800 pt-4">
            <button 
              onClick={() => navigate('/sitemap')} 
              className="hover:text-white transition-colors duration-200"
            >
              Sitemap
            </button>
            <span>•</span>
            <button 
              onClick={() => navigate('/accessibility')} 
              className="hover:text-white transition-colors duration-200"
            >
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}