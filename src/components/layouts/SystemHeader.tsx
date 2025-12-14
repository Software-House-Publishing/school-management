import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Logo from '@/assets/Logo.png';

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
    else if (path === '/pricing') setActiveSection('pricing');
    else if (path === '/about') setActiveSection('about');
  }, [location.pathname]);

  const navigationItems = [
    { id: 'home', label: t('navigation.home'), path: '/' },
    { id: 'features', label: 'Features', path: '/#features' },
    { id: 'pricing', label: 'Pricing', path: '/pricing' },
    { id: 'about', label: 'About', path: '/about' },
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? 'glass-panel m-4 mt-4 rounded-2xl'
            : 'bg-transparent pt-4'
          }`}
        style={isScrolled ? { width: 'calc(100% - 2rem)', left: '1rem' } : {}}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src={Logo} alt="Classivo Logo" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="text-xl font-semibold tracking-tight text-classivo-black font-display">
              {t('app.name')}
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-white/30 backdrop-blur-md rounded-full px-1.5 py-1.5 border border-white/40 shadow-sm">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-out ${activeSection === item.id
                    ? 'text-classivo-blue bg-white shadow-sm'
                    : 'text-gray-600 hover:text-classivo-blue hover:bg-white/40'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-gray-600 hover:text-classivo-blue transition-colors px-4 py-2"
            >
              Log in
            </button>
            <Button
              onClick={() => navigate('/register')}
              className="glass-button rounded-full text-classivo-blue hover:text-classivo-blue px-8 shadow-lg"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-white/50 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/80 backdrop-blur-3xl md:hidden pt-28 px-6"
          >
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/40 border border-white/60 text-left text-lg font-medium text-gray-900 hover:bg-white transition-all shadow-sm"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
              <div className="pt-8 flex flex-col space-y-4">
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="w-full justify-center rounded-xl h-12 text-base border-white/60 bg-white/40 backdrop-blur-md"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="w-full justify-center rounded-xl h-12 text-base glass-button text-classivo-blue"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
