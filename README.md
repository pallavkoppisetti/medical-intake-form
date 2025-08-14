# Medical Intake Form Application

A comprehensive React TypeScript application for creating and managing medical intake forms with professional PDF generation, designed specifically for Florida Division of Disability Determination consultative examinations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🏥 Overview

This application provides a multi-step medical intake form designed for healthcare professionals conducting Florida Division of Disability Determination consultative examinations. It features a modern, responsive interface with comprehensive form sections, professional PDF export capabilities, and real-time validation.

## ✨ Key Features

- **Multi-step Form**: 8 comprehensive sections with smart navigation
- **Real-time Validation**: Dynamic error checking and completion tracking
- **Professional PDF Export**: Florida CE Exam compliant format
- **Auto-save**: Automatic form data persistence with visual indicators
- **Responsive Design**: Mobile-first approach with touch-friendly controls
- **TypeScript**: Full type safety with comprehensive interfaces
- **Tag-based Input**: EMR-style tag system for medical data entry

## 📋 Form Sections

1. **Header Information** - Demographics and chief complaint
2. **Medical History** - Comprehensive medical background
3. **Functional Status** - Daily living activities assessment
4. **Physical Examination** - Systematic physical assessment
5. **Range of Motion** - Joint mobility measurements
6. **Gait & Station** - Walking and balance evaluation
7. **Assessment** - Clinical diagnosis and recommendations
8. **Review & Generate PDF** - Final review and export

## �️ Technology Stack

- **React 18** with TypeScript for strict type safety
- **Vite** for fast development and building
- **Tailwind CSS v4** for utility-first styling
- **shadcn/ui** components for consistent design
- **jsPDF** for professional PDF generation
- **Sonner** for toast notifications

## 📚 Documentation

For detailed documentation, please see the `/docs` folder:

- [Development Guide](./docs/DEVELOPMENT.md) - Setup and development workflow
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [PDF Generation Guide](./docs/PDF_GENERATION_GUIDE.md) - PDF export implementation
- [Form Layout Documentation](./docs/FormLayout.md) - Component structure and layout
- [Multi-Step Controller](./docs/MultiStepFormController.md) - Form navigation and state management
- [AWS Amplify Deployment](./docs/AWS_AMPLIFY_DEPLOYMENT_GUIDE.md) - Cloud deployment setup
- [Digital Signature Implementation](./docs/DIGITAL_SIGNATURE_IMPLEMENTATION.md) - Signature capture system
- [PDF Preview Implementation](./docs/PDF_PREVIEW_IMPLEMENTATION.md) - Preview functionality
- [Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md) - Pre-deployment verification
- [Changelog](./docs/CHANGELOG.md) - Version history and updates

## � Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Please read our [Development Guide](./docs/DEVELOPMENT.md) for details on our code of conduct and the process for submitting pull requests.

---


## 👨‍⚕️ Medical Disclaimer

This software is for educational and demonstration purposes only. It is not intended for actual medical use without proper validation, testing, and compliance with healthcare regulations (HIPAA, HITECH, etc.). 

**Important Considerations for Clinical Use:**
- Validate all generated PDFs against official CE Exam requirements
- Ensure compliance with local healthcare data protection regulations
- Implement proper security measures for patient data
- Conduct thorough testing in controlled environments
- Obtain legal and medical professional review before clinical deployment

Always consult with healthcare professionals, legal experts, and compliance officers before using in a clinical environment.

## 📞 Support & Contact

### Getting Help
- **Issues**: Report bugs or request features via GitHub Issues
- **Documentation**: Check the `/docs` folder for detailed guides
  - [Development Guide](docs/DEVELOPMENT.md) - Setup and development workflow
  - [Form Layout Documentation](docs/FormLayout.md) - Component structure
  - [Multi-Step Form Controller](docs/MultiStepFormController.md) - Navigation system
  - [Change Log](docs/CHANGELOG.md) - Version history and release notes
- **Development**: Contact maintainers for development questions

### Repository Information
- **Repository**: https://github.com/pallavkoppisetti/medical-intake-form
- **Main Branch**: `main`
- **Development**: Active development with regular updates
- **License**: MIT License (see LICENSE file)

### Acknowledgments
- Built with modern React and TypeScript best practices
- UI components based on shadcn/ui design system
- Medical workflow insights from healthcare professionals
- Accessibility guidelines following WCAG standards
- PDF generation optimized for professional medical documentation

---

**Version**: 2.0.0  
**Last Updated**: August 12, 2025  
**Compatibility**: React 18+, Node.js 18+, Modern Browsers
