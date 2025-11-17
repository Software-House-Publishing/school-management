import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Users, BookOpen, Phone, Info } from 'lucide-react';

interface SchoolHeaderData {
  schoolName: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function SchoolHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { schoolId } = useParams<{ schoolId: string }>();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [schoolData, setSchoolData] = useState<SchoolHeaderData | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/home') || path === `/school/${schoolId}`) setActiveSection('home');
    else if (path.includes('/about')) setActiveSection('about');
    else if (path.includes('/pricing')) setActiveSection('pricing');
    else if (path.includes('/contact')) setActiveSection('contact');
  }, [location.pathname, schoolId]);

  useEffect(() => {
    // TODO: Fetch school header data from backend API
    const mockSchoolData: SchoolHeaderData = {
      schoolName: "Example School",
      primaryColor: "from-blue-500 to-blue-600",
      secondaryColor: "from-purple-500 to-purple-600"
    };

    setSchoolData(mockSchoolData);
  }, [schoolId]);

  const navigationItems = [
    { id: 'home', label: 'Home', path: `/school/${schoolId}`, icon: Globe },
    { id: 'about', label: 'About Us', path: `/school/${schoolId}/about`, icon: Info },
    { id: 'pricing', label: 'Pricing', path: `/school/${schoolId}/pricing`, icon: BookOpen },
    { id: 'contact', label: 'Contact', path: `/school/${schoolId}/contact`, icon: Phone },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  if (!schoolData) {
    return null; // Or a loading skeleton
  }

  return (
    <>
      <header className={
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-xl shadow-lg border-b border-[#E5E5EA]/60'
      }>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate(`/school/${schoolId}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={
                `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-br ${schoolData.primaryColor} shadow-lg`
              }>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className={'text-xl font-bold transition-colors duration-300 text-gray-900'}>
                {schoolData.schoolName}
              </span>
            </motion.div>

            {/* Desktop Navigation - Dynamic Island Style */}
            <div className="hidden md:flex items-center">
              <motion.nav 
                className={'flex items-center space-x-1 rounded-full px-2 py-1 transition-all duration-300 bg-[#FBFBFD]/90 backdrop-blur-sm'}
                initial={false}
                animate={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
              >
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        activeSection === item.id
                          ? 'text-blue-600 bg-white shadow-md'
                          : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#F2F2F7]'
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
                  onClick={() => navigate(`/school/${schoolId}/login`)}
                  className={'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#F2F2F7]'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate(`/school/${schoolId}/register`)}
                  className={`px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${schoolData.primaryColor} text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply Now
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={'md:hidden p-2 rounded-full transition-colors duration-300 text-[#6e6e73] hover:bg-[#F2F2F7]'}
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
                    onClick={() => navigate(`/school/${schoolId}/login`)}
                    className="w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    onClick={() => navigate(`/school/${schoolId}/register`)}
                    className={`w-full px-4 py-3 rounded-xl bg-gradient-to-r ${schoolData.primaryColor} text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply Now
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