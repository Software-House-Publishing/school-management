import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Users, BookOpen, CreditCard, Shield, ChevronDown } from 'lucide-react';

export default function SystemHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveSection('home');
    else if (path === '/contact') setActiveSection('contact');
    else if (path === '/terms') setActiveSection('terms');
    else if (path === '/privacy') setActiveSection('privacy');
  }, [location.pathname]);

  const navigationItems = [
    { id: 'home', label: t('navigation.home'), path: '/', icon: Globe },
    { id: 'features', label: 'Features', path: '/#features', icon: BookOpen },
    { id: 'contact', label: t('navigation.contact'), path: '/contact', icon: Users },
    { id: 'terms', label: 'Terms', path: '/terms', icon: Shield },
    { id: 'privacy', label: 'Privacy', path: '/privacy', icon: Shield },
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
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-[#D1D1D6]/60' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg' 
                  : 'bg-slate-900/30 backdrop-blur-sm border border-white/20'
              }`}>
                <BookOpen className={`w-5 h-5 ${isScrolled ? 'text-white' : 'text-white'}`} />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-600' : 'text-gray-900 drop-shadow-lg'
              }`}>
                {t('app.name')}
              </span>
            </motion.div>

            {/* Desktop Navigation - Dynamic Island Style */}
            <div className="hidden md:flex items-center">
              <motion.nav 
                className={`flex items-center space-x-1 rounded-full px-2 py-1 transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-[#F2F2F7]/80 backdrop-blur-sm' 
                    : 'bg-slate-900/30 backdrop-blur-sm border border-white/20'
                }`}
                initial={false}
                animate={{ 
                  boxShadow: isScrolled 
                    ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
                    : '0 4px 20px rgba(255, 255, 255, 0.2)' 
                }}
              >
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        activeSection === item.id
                          ? isScrolled
                            ? 'text-blue-600 bg-white shadow-md'
                            : 'text-blue-900 bg-white/95 shadow-md'
                          : isScrolled
                            ? 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#F2F2F7]'
                            : 'text-gray-900 hover:bg-gray-900/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {activeSection === item.id && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-600/10"
                          layoutId="activeTab"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </motion.nav>

              {/* Auth Buttons */}
              <div className="ml-6 flex items-center space-x-3">
                <motion.button
                  onClick={() => navigate('/login')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isScrolled
                      ? 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#F2F2F7]'
                      : 'text-gray-900 hover:bg-gray-900/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('navigation.login')}
                </motion.button>
                <motion.button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={`md:hidden p-2 rounded-full transition-colors duration-300 ${
                isScrolled ? 'text-[#6e6e73] hover:bg-[#F2F2F7]' : 'text-gray-900 hover:bg-gray-900/10'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeSection === item.id
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <motion.button
                    onClick={() => navigate('/login')}
                    className="w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('navigation.login')}
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/register')}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div className="h-16" />
    </>
  );
}