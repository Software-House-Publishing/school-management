# School Management System

A comprehensive, multi-tenant school management system built with React, TypeScript, and modern web technologies. Designed for educational institutions including private schools, public schools, universities, private tuitions, language schools, and other teaching providers.

## 🌟 Features

### Core Functionality
- **Multi-tenant Architecture**: Support multiple schools/institutions on a single platform
- **Role-Based Access Control (RBAC)**: Granular permissions for different user roles
- **Multi-language Support**: English and Burmese (Myanmar) languages
- **Responsive Design**: Mobile-first, accessible design
- **Real-time Updates**: Live notifications and data synchronization

### Portal Access
- **Public Portal**: School landing pages, about, contact, and school rules
- **Student Portal**: Course management, exam scheduling, fee tracking, profile management
- **Teacher Portal**: Course creation, student management, exam grading, announcements
- **Admin Portal**: User management, financial operations, reporting, system settings

### Key Modules
- **Learning Management System (LMS)**
  - Course creation and management
  - Student enrollment and progress tracking
  - Exam scheduling and grading
  - Announcement system
  - Resource management

- **Financial Management**
  - Fee structure management
  - Payment processing
  - Salary and payroll management
  - Financial reporting

- **User Management**
  - Invitation-based staff registration
  - Student self-registration
  - Role-based permissions
  - Profile management

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd school-management

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components organized by portal
├── hooks/              # Custom React hooks
├── stores/             # Zustand state management
├── services/           # API service layers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── i18n/               # Internationalization
├── config/             # Configuration files
└── constants/          # Application constants
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: react-i18next
- **Notifications**: Sonner (toast notifications)
- **Charts**: Recharts for data visualization
- **Authentication**: Supabase Auth integration

### Design Patterns
- **Component-Based Architecture**: Modular, reusable components
- **Multi-layered Architecture**: Separation of concerns
- **Role-Based Access Control**: Granular permission system
- **Responsive Design**: Mobile-first approach

## 🔐 Role-Based Access Control

### User Roles
- **Director**: Executive authority across all modules
- **Administrator**: Platform operator with system-wide access
- **Manager**: Academic operations lead
- **Finance Officer**: Financial controller
- **Help Desk**: Support agent
- **Teacher**: Instructional staff
- **Student**: Learner

### Permission Matrix
Detailed permission matrix available in [`docs/rbac.md`](docs/rbac.md)

## 🌍 Internationalization

### Supported Languages
- **English** (Primary)
- **Burmese** (Myanmar) - Secondary

### Language Features
- Automatic language detection
- Persistent language preference
- RTL support for Burmese
- Comprehensive translation coverage

## 🔧 Development

### Available Scripts
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Run TypeScript type checking
npm run check

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Pre-commit hooks
- Comprehensive type definitions

## 📚 Documentation

### Available Documentation
- [`docs/architecture/frontend-architecture.md`](docs/architecture/frontend-architecture.md) - Technical architecture
- [`docs/components/component-library.md`](docs/components/component-library.md) - Component documentation
- [`docs/development/setup-guide.md`](docs/development/setup-guide.md) - Development setup
- [`docs/api/api-integration.md`](docs/api/api-integration.md) - API integration guide
- [`docs/deployment/deployment-guide.md`](docs/deployment/deployment-guide.md) - Deployment instructions
- [`docs/rbac.md`](docs/rbac.md) - Role-based access control specification

## 🚀 Deployment

### Supported Platforms
- **Vercel** (Recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **Docker**

### Environment Variables
```env
# Application Configuration
VITE_APP_NAME=School Management System
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_APP_URL=https://app.yourdomain.com

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

See [`docs/deployment/deployment-guide.md`](docs/deployment/deployment-guide.md) for detailed deployment instructions.

## 🧪 Testing

### Testing Strategy
- Unit tests for utilities and services
- Integration tests for components
- E2E tests for critical user flows
- Accessibility testing
- Performance testing

### Test Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔒 Security

### Security Features
- Input validation and sanitization
- XSS prevention
- CSRF protection
- Secure authentication
- Role-based authorization
- HTTPS enforcement

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

## 📊 Performance

### Performance Optimizations
- Code splitting and lazy loading
- Bundle optimization
- Image optimization
- Caching strategies
- Service worker implementation

### Monitoring
- Error tracking with Sentry
- Analytics with Google Analytics
- Performance monitoring
- Uptime monitoring

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Update documentation
5. Submit pull request with detailed description

### Code Standards
- Follow TypeScript best practices
- Use consistent naming conventions
- Write comprehensive tests
- Document complex logic
- Follow accessibility guidelines

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- Check existing documentation
- Review component examples
- Search existing issues
- Create detailed issue reports

### Issue Reporting
Include the following information:
- Environment details (browser, OS, Node version)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error messages
- Relevant code snippets

## 🗺️ Roadmap

### Planned Features
- Mobile PWA application
- Advanced analytics dashboard
- AI-powered recommendations
- Third-party integrations
- Offline functionality
- Advanced reporting tools

### Enhancement Plans
- Dark mode support
- Additional language support
- Advanced customization options
- Enhanced accessibility features
- Performance optimizations

## 🙏 Acknowledgments

- React community for excellent documentation
- Tailwind CSS team for utility-first styling
- Supabase team for authentication and database services
- All contributors and supporters

---

**Built with ❤️ for educational institutions worldwide**
