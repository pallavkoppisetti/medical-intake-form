# Medical Intake Form Application

A comprehensive React TypeScript application for creating and managing medical intake forms with professional PDF generation, designed specifically for Florida Division of Disability Determination consultative examinations (CE Exam compliance).

## 🏥 Overview

This application provides a multi-step medical intake form designed for healthcare professionals conducting Florida Division of Disability Determination consultative examinations. It features a modern, responsive interface with comprehensive form sections, professional PDF export capabilities, and development testing tools.

## ✨ Key Features

### 🎨 Professional Healthcare UI
- Modern, clean design with healthcare-focused blue color scheme
- Responsive layout optimized for desktop, tablet, and mobile
- Professional medical interface with intuitive sidebar navigation
- Accessibility-first design with ARIA labels and keyboard navigation
- Real-time auto-save with visual indicators
- Floating save progress indicator with status updates

### 📋 Comprehensive Form Sections (Florida CE Exam Compliant)
1. **Header Information** - Claimant demographics, case details, and chief complaint
2. **History** - Detailed medical history, present illness, and comprehensive review of systems
3. **Functional Status** - Activities of daily living and functional capacity assessment
4. **Medical Information** - Current medications, allergies, surgical history, and family history
5. **Physical Examination** - Systematic physical assessment with complete vital signs
6. **Range of Motion** - Joint mobility assessment with active/passive measurements and tables
7. **Gait & Station** - Walking pattern, balance evaluation, and coordination testing
8. **Assessment** - Clinical diagnosis, medical source statement, and professional recommendations
9. **Review & Generate PDF** - Print-preview layout with professional PDF export functionality

### 🔧 Advanced Functionality
- **Multi-step Navigation** - Smart sidebar navigation with section validation and progress tracking
- **Real-time Validation** - Comprehensive form validation with error highlighting and completion indicators
- **Auto-save System** - Automatic form data persistence using localStorage with visual feedback
- **Progress Tracking** - Visual progress indicators, completion status, and section-by-section validation
- **Professional PDF Generation** - PDF export matching exact Florida CE Exam format requirements
- **Print Preview Mode** - Review all form data in professional CE format before PDF generation
- **Missing Field Detection** - Highlights incomplete required fields with navigation to edit sections
- **Toast Notifications** - User feedback for actions, validation, and system status
- **Responsive Design** - Mobile-first approach with touch-friendly controls and adaptive layouts
- **TypeScript** - Full type safety with comprehensive interfaces and strict validation
- **Development Test Tools** - Built-in sample data generator for format verification (dev mode only)

### 📄 Professional PDF Export Features
- **CE Exam Format Compliance** - Matches Florida Division of Disability Determination official format
- **Professional Layout** - Official header, disclaimer, structured sections, and proper formatting
- **Smart Filename Generation** - `CE_Exam_[PatientName]_[ExamDate].pdf` format with date formatting
- **Form Validation** - Ensures minimum data requirements (50%+ completion) before export
- **Multi-page Support** - Automatic page breaks, proper content flow, and professional page numbering
- **Table Formatting** - Professional tables for range of motion data with proper borders and spacing
- **Section Organization** - All sections properly formatted, labeled, and structured per CE requirements
- **Two-pass Generation** - Advanced PDF generation with accurate page counting and numbering

### 🧪 Development Tools (Development Mode Only)
- **Test with Sample Data** - One-click population of realistic medical examination data
- **Automatic PDF Generation** - Instant PDF creation after data population for format verification
- **Sample Patient Data** - Comprehensive test case (Jane Doe, DOB: 01/15/1980, Case: DDS-2024-12345)
- **Development Notice** - Clear indication of test features with usage instructions
- **Format Verification** - Easy verification that PDF output matches CE Exam requirements exactly

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript for strict type safety
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS v4 for utility-first styling and responsive design
- **UI Components**: shadcn/ui component library for consistent design system
- **State Management**: React Context with useReducer for complex form state
- **PDF Generation**: jsPDF for professional document creation with exact formatting
- **Icons**: Lucide React for modern, consistent iconography
- **Notifications**: Sonner for professional toast messages and user feedback
- **Form Helpers**: Professional helper text, placeholders, and realistic examples
- **Additional Libraries**:
  - date-fns for date handling and formatting
  - clsx and tailwind-merge for conditional styling
  - html2canvas for document capture capabilities

## � Documentation

### Available Documentation
- **[Development Guide](docs/DEVELOPMENT.md)** - Setup, architecture, and development workflow
- **[Form Layout Documentation](docs/FormLayout.md)** - Component structure and layout system
- **[Multi-Step Form Controller](docs/MultiStepFormController.md)** - Navigation and state management
- **[Change Log](docs/CHANGELOG.md)** - Complete version history and release notes

### Quick Links
- [Installation & Setup](#️-installation--setup)
- [Usage Instructions](#-usage)
- [PDF Generation Workflow](#-pdf-generation-workflow)
- [Development Testing Tools](#-development-tools-development-mode-only)
- [Contributing Guidelines](#-contributing)

## �📁 Project Structure

```
src/
├── components/
│   ├── form-sections/           # Individual form section components
│   │   ├── CEHeaderForm.tsx            # Header information with disclaimer
│   │   ├── HistoryFormNew.tsx          # Medical history with detailed examples
│   │   ├── FunctionalStatusFormNew.tsx # Functional capacity assessment
│   │   ├── MedicalInfoForm.tsx         # Medications, allergies, history
│   │   ├── PhysicalExamForm.tsx        # Physical examination with vitals
│   │   ├── RangeOfMotionForm.tsx       # Joint mobility with measurements
│   │   ├── GaitStationForm.tsx         # Gait and balance assessment
│   │   └── AssessmentForm.tsx          # Clinical assessment and diagnosis
│   ├── ui/                      # Base UI components (shadcn/ui)
│   │   ├── button.tsx, card.tsx, form.tsx, input.tsx, label.tsx
│   │   ├── badge.tsx, FormInput.tsx, FormTextarea.tsx, FormSelect.tsx
│   │   └── FormCheckbox.tsx
│   ├── FormLayout.tsx           # Main responsive layout with fixed bottom nav
│   ├── FormNavigation.tsx       # Sticky bottom navigation with progress
│   ├── MultiStepFormController.tsx # Main form controller and logic
│   ├── FormReviewAndGenerate.tsx # PDF review with print preview styling
│   ├── SaveProgressIndicator.tsx # Floating auto-save indicator
│   ├── ProgressBar.tsx          # Progress tracking components
│   └── PDFExportButton.tsx      # PDF export functionality
├── contexts/                    # React contexts for state management
│   └── MultiStepFormContext.tsx # Main form state and navigation
├── hooks/                       # Custom React hooks
│   ├── useFormManager.ts        # Form data management
│   └── useFormValidation.ts     # Validation logic
├── lib/                         # Utility libraries
│   ├── form-storage.ts          # localStorage persistence
│   └── utils.ts                 # Common utilities (shadcn/ui)
├── services/                    # Business logic services
│   └── PDFGeneratorService.ts   # Professional PDF generation
├── types/                       # TypeScript type definitions
│   └── comprehensive-medical-form.ts # Complete form type definitions
└── utils/                       # Utility functions
    └── pdfUtils.ts              # PDF generation utilities
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/pallavkoppisetti/medical-intake-form.git
   cd medical-intake-form
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📱 Usage

### Development Commands
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production with optimization
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality
```

### Key Features Usage

#### Navigation
- Use the sidebar to navigate between form sections
- Progress indicators show completion status for each section
- Required sections are marked with red asterisks
- Sections unlock as prerequisites are completed

#### Auto-save
- Form data is automatically saved to localStorage
- Floating indicator shows save status in real-time
- Data persists across browser sessions
- Manual save option available in sidebar

#### PDF Generation
1. Complete form sections (minimum 50% completion required)
2. Navigate to "Review & Generate PDF" section
3. Review all data in print-preview format
4. Click "Download PDF" to generate professional CE Exam report
5. PDF automatically downloads with proper filename format

#### Development Testing (Development Mode Only)
1. Navigate to "Review & Generate PDF" section
2. Look for orange "Test with Sample Data" button
3. Click to populate all sections with realistic medical data
4. PDF automatically generates for format verification
5. Use this to verify CE Exam compliance without manual data entry

## 🎯 Form Sections Detail

### Implemented Sections

#### 1. Header Information
- Claimant name, DOB, case number, exam date
- Chief complaint with professional examples
- Official disclaimer text with proper formatting
- Required field validation

#### 2. History (Comprehensive)
- History of present illness with detailed examples
- Review of systems (positive/negative findings)
- Past medical and surgical history
- Current medications with dosages and frequencies
- Allergies in NKDA format
- Social history (smoking, alcohol, occupation)
- Family history with relevant conditions

#### 3. Functional Status
- Dominant hand preference
- Activity tolerances (sitting, standing, walking)
- Best day vs. worst day comparisons
- Activities of daily living assessment
- Functional capacity descriptions
- Mobility and independence evaluation

#### 4. Medical Information
- Current medications list
- Known allergies and reactions
- Surgical history timeline
- Family medical history
- Social history factors

#### 5. Physical Examination
- Complete vital signs (BP, HR, temp, height, weight)
- Visual acuity testing
- System-by-system examination
- General appearance and presentation
- Cardiovascular, pulmonary, musculoskeletal findings
- Neurological assessment

#### 6. Range of Motion
- Cervical spine measurements (flexion, extension, rotation)
- Lumbar spine mobility assessment
- Bilateral shoulder range of motion
- Active and passive measurements
- Professional table formatting in PDF

#### 7. Gait & Station
- Gait pattern analysis
- Balance and coordination testing
- Stance and posture evaluation
- Mobility aid usage
- Functional mobility assessment

#### 8. Assessment
- Primary and secondary diagnoses
- Clinical impressions with detailed examples
- Functional limitations assessment
- Work-related restrictions
- Treatment recommendations
- Medical records review statement
- Examiner credentials and licensing

## 📄 PDF Generation Workflow

### Complete Workflow

1. **Form Completion**
   - Fill out required form sections (minimum 50% completion)
   - Each section validates in real-time with immediate feedback
   - Missing required fields are highlighted in red
   - Progress tracking shows completion percentage

2. **Review Section**
   - Navigate to "Review & Generate PDF" section
   - Review step shows professional print-preview layout
   - All data displayed in exact CE Exam format
   - Section-by-section validation status with edit buttons

3. **Validation Check**
   - Missing fields highlighted in red with clear indicators
   - Edit buttons provide quick navigation back to sections
   - Completion percentage must reach 50% minimum
   - All required fields must be completed

4. **PDF Generation**
   - Click "Generate PDF" to create professional document
   - Loading spinner shows generation progress
   - Two-pass generation ensures accurate page numbering
   - Success notification confirms completion

5. **Download**
   - Click "Download PDF" for automatic file download
   - Filename format: `CE_Exam_[PatientName]_[ExamDate].pdf`
   - Professional format matching Florida CE requirements exactly
   - Multi-page support with proper headers and page numbers

### PDF Features Detail
- **Official Format**: Matches Florida Division of Disability Determination requirements
- **Professional Layout**: Official header, disclaimer, and structured sections
- **Complete Data Integration**: All form sections included with proper formatting
- **Table Support**: Range of motion data in professional tables with borders
- **Multi-page**: Automatic page breaks and professional page numbering
- **Validation**: Ensures data completeness and format compliance

## 🔒 Data Management

### Local Storage
- Automatic form data persistence across sessions
- Progress tracking and section completion status
- User preference storage for UI settings
- Draft data recovery after browser refresh

### Validation System
- Real-time field validation with immediate feedback
- Section-level completion checking with progress indicators
- Comprehensive error reporting with specific field guidance
- Type-safe validation rules with TypeScript interfaces

### Security Considerations
- Client-side only storage (no server transmission)
- Local data encryption considerations for production use
- HIPAA compliance considerations for clinical deployment
- Data clearing options for shared computers

## 🎨 Design System

### Color Palette
- **Primary Blue**: #2563eb (medical professionalism)
- **Success Green**: #16a34a (completed sections)
- **Warning Orange**: #ea580c (attention items)
- **Error Red**: #dc2626 (validation errors)
- **Neutral Grays**: #f8fafc to #1e293b (backgrounds and text)

### Typography
- Clean, readable fonts optimized for medical forms
- Proper hierarchy with consistent heading sizes
- Accessible contrast ratios (WCAG AA compliant)
- Professional medical appearance with proper spacing

### Component Design
- Consistent spacing using Tailwind CSS grid system
- Professional card layouts with subtle shadows
- Interactive elements with hover and focus states
- Mobile-responsive design with touch-friendly controls

## 🧪 Development & Testing

### Development Tools
- **Hot Reload**: Instant feedback during development
- **TypeScript**: Full type safety with comprehensive interfaces
- **ESLint**: Code quality and consistency enforcement
- **Tailwind CSS**: Utility-first styling with design system

### Testing Features
- **Sample Data Generator**: Realistic medical examination data
- **PDF Format Verification**: Instant format compliance checking
- **Development Mode Indicators**: Clear separation of test features
- **Comprehensive Test Cases**: Complete patient scenarios for validation

### Code Quality
- TypeScript strict mode enabled
- Comprehensive type definitions for all medical form data
- ESLint configuration for React and TypeScript best practices
- Consistent code formatting and organization

## 🚧 Roadmap & Future Enhancements

### Completed Features ✅
- ✅ Complete multi-step form with all CE sections
- ✅ Professional PDF generation with exact CE format
- ✅ Real-time validation and progress tracking
- ✅ Auto-save functionality with visual indicators
- ✅ Responsive design for all device sizes
- ✅ Development testing tools for format verification
- ✅ Professional helper text and examples throughout
- ✅ Print preview mode with CE-compliant formatting

### Near Term Roadmap 🔄
- [ ] Enhanced accessibility features (WCAG 2.1 AA compliance)
- [ ] Advanced form validation with medical logic
- [ ] Export to additional formats (Word, Excel)
- [ ] Form templates for different examination types
- [ ] Improved mobile user experience

### Future Enhancements 🚀
- [ ] Multi-language support (Spanish, French)
- [ ] Dark mode theme option
- [ ] Offline functionality with service workers
- [ ] Integration with EMR/EHR systems
- [ ] Advanced reporting and analytics
- [ ] User authentication and role management
- [ ] Cloud storage integration options
- [ ] Digital signature capabilities

## 🤝 Contributing

### How to Contribute

1. **Fork the repository**
   ```bash
   git fork https://github.com/pallavkoppisetti/medical-intake-form.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code patterns and TypeScript conventions
   - Add appropriate validation for new form fields
   - Ensure responsive design for new components
   - Add comprehensive helper text and examples

4. **Test your changes**
   - Test all form sections and navigation
   - Verify PDF generation with new features
   - Check responsive design on multiple screen sizes
   - Validate accessibility with screen readers

5. **Commit and push**
   ```bash
   git commit -m 'Add amazing feature with detailed description'
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide detailed description of changes
   - Include screenshots for UI changes
   - Reference any related issues

### Development Guidelines
- Maintain type safety with comprehensive TypeScript definitions
- Follow existing design patterns and component structure
- Ensure all new features are accessible and responsive
- Add appropriate validation and error handling
- Include realistic helper text and examples for medical fields

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
