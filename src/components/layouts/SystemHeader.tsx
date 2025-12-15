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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isScrolled
          ? 'glass-panel m-4 mt-4 rounded-2xl border-white/40'
          : 'bg-transparent pt-6 border-transparent'
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
            <div className="relative">
              <div className="absolute inset-0 bg-classivo-blue/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img src={Logo} alt="Classivo Logo" className="w-10 h-10 object-contain drop-shadow-md relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight text-classivo-black font-display">
              {t('app.name')}
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-white/30 backdrop-blur-md rounded-full px-1.5 py-1.5 border border-white/40 shadow-inner">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-out ${activeSection === item.id
                  ? 'text-classivo-blue bg-white shadow-sm'
                  : 'text-classivo-black/70 hover:text-classivo-blue hover:bg-white/40'
                  }`}
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="pill-tab"
                    className="absolute inset-0 bg-white rounded-full shadow-sm z-[-1]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-classivo-black/70 hover:text-classivo-blue transition-colors px-4 py-2"
            >
              Log in
            </button>
            <Button
              onClick={() => navigate('/register')}
              variant="default"
              size="sm"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-white/40 backdrop-blur-md text-classivo-black hover:bg-white/60 transition-colors border border-white/40"
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
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-white/80 backdrop-blur-3xl md:hidden pt-32 px-6 pb-10 flex flex-col"
          >
            {/* Background Blobs for Mobile Menu */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[60%] bg-classivo-lightblue/30 blur-[100px] rounded-full mix-blend-multiply opacity-50" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[60%] bg-classivo-blue/20 blur-[100px] rounded-full mix-blend-multiply opacity-50" />
            </div>

            <div className="flex flex-col space-y-4 flex-1">
              {navigationItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center justify-between w-full p-5 rounded-2xl bg-white/40 border border-white/60 text-left text-lg font-medium text-classivo-black hover:bg-white transition-all shadow-sm active:scale-[0.98]"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-5 h-5 text-classivo-black/40" />
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto pt-8 flex flex-col space-y-4"
            >
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full justify-center h-14 text-base"
              >
                Log in
              </Button>
              <Button
                onClick={() => navigate('/register')}
                variant="default"
                className="w-full justify-center h-14 text-base"
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
