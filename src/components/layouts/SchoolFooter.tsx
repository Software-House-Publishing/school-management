import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Facebook,
  Twitter,
  Instagram,
  ArrowUp
} from 'lucide-react';

interface SchoolFooterData {
  schoolName: string;
  tagline?: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  primaryColor?: string;
}

export default function SchoolFooter() {
  const navigate = useNavigate();
  const { schoolId } = useParams<{ schoolId: string }>();
  const [schoolData, setSchoolData] = useState<SchoolFooterData | null>(null);

  useEffect(() => {
    // TODO: Fetch school footer data from backend API
    const mockSchoolData: SchoolFooterData = {
      schoolName: "Example School",
      tagline: "Empowering Education Everywhere",
      contactInfo: {
        email: "info@exampleschool.edu",
        phone: "+1 (555) 123-4567",
        address: "123 Education Street, Learning City, LC 12345"
      },
      socialLinks: {
        facebook: "https://facebook.com/exampleschool",
        twitter: "https://twitter.com/exampleschool",
        instagram: "https://instagram.com/exampleschool"
      },
      primaryColor: "from-blue-500 to-blue-600"
    };

    setSchoolData(mockSchoolData);
  }, [schoolId]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Academics',
      links: [
        { label: 'Curriculum', path: `/${schoolId}/academics`, icon: BookOpen },
        { label: 'Faculty', path: `/${schoolId}/faculty`, icon: Users },
        { label: 'Library', path: `/${schoolId}/library`, icon: Globe },
        { label: 'Programs', path: `/${schoolId}/programs`, icon: FileText },
      ]
    },
    {
      title: 'Admissions',
      links: [
        { label: 'Apply Now', path: `/${schoolId}/register`, icon: Users },
        { label: 'Requirements', path: `/${schoolId}/requirements`, icon: FileText },
        { label: 'Tuition & Fees', path: `/${schoolId}/pricing`, icon: Globe },
        { label: 'Scholarships', path: `/${schoolId}/scholarships`, icon: Shield },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Student Portal', path: `/${schoolId}/login`, icon: Users },
        { label: 'Parent Portal', path: `/${schoolId}/parent-login`, icon: Users },
        { label: 'Calendar', path: `/${schoolId}/calendar`, icon: Globe },
        { label: 'News & Events', path: `/${schoolId}/news`, icon: FileText },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', path: `/${schoolId}/contact`, icon: Globe },
        { label: 'Help Center', path: `/${schoolId}/help`, icon: BookOpen },
        { label: 'Privacy Policy', path: `/${schoolId}/privacy`, icon: Shield },
        { label: 'Terms of Service', path: `/${schoolId}/terms`, icon: FileText },
      ]
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (!schoolData) {
    return null; // Or a loading skeleton
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate(`/${schoolId}`)}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${schoolData.primaryColor} flex items-center justify-center shadow-lg`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{schoolData.schoolName}</h3>
                <p className="text-gray-400 text-sm">{schoolData.tagline}</p>
              </div>
            </motion.div>
            
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Comprehensive educational institution dedicated to providing quality education and fostering academic excellence in a nurturing environment.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{schoolData.contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>{schoolData.contactInfo.phone}</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <span>{schoolData.contactInfo.address}</span>
              </div>
            </div>

            {/* Social Links */}
            {schoolData.socialLinks && (
              <div className="flex space-x-4">
                {schoolData.socialLinks.facebook && (
                  <motion.a
                    href={schoolData.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 flex items-center justify-center transition-all duration-200 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                  </motion.a>
                )}
                {schoolData.socialLinks.twitter && (
                  <motion.a
                    href={schoolData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 flex items-center justify-center transition-all duration-200 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                  </motion.a>
                )}
                {schoolData.socialLinks.instagram && (
                  <motion.a
                    href={schoolData.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 flex items-center justify-center transition-all duration-200 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                  </motion.a>
                )}
              </div>
            )}
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
                Get the latest news, events, and educational updates from our school delivered to your inbox.
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
              <span>© 2024 {schoolData.schoolName}. All rights reserved.</span>
              <div className="hidden md:flex items-center space-x-4">
                <button 
                  onClick={() => navigate(`/${schoolId}/sitemap`)} 
                  className="hover:text-white transition-colors duration-200"
                >
                  Sitemap
                </button>
                <span>•</span>
                <button 
                  onClick={() => navigate(`/${schoolId}/accessibility`)} 
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
              onClick={() => navigate(`/${schoolId}/sitemap`)} 
              className="hover:text-white transition-colors duration-200"
            >
              Sitemap
            </button>
            <span>•</span>
            <button 
              onClick={() => navigate(`/${schoolId}/accessibility`)} 
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