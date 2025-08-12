# Medical Intake Form Application

A comprehensive React TypeScript application for creating and managing medical intake forms with professional PDF generation, designed specifically for Florida CE Exam compliance.

## 🏥 Overview

This application provides a multi-step medical intake form designed for healthcare professionals conducting Florida Division of Disability Determination consultative examinations. It features a modern, responsive interface with comprehensive form sections and professional PDF export capabilities.

## ✨ Features

### 🎨 Professional Healthcare UI
- Modern, clean design with healthcare-focused blue color scheme
- Responsive layout optimized for desktop, tablet, and mobile
- Professional medical interface with intuitive navigation
- Accessibility-first design with ARIA labels and keyboard navigation

### 📋 Comprehensive Form Sections (Florida CE Exam Compliant)
1. **Header Information** - Claimant demographics and case details
2. **History** - Medical history and present illness documentation
3. **Functional Status** - Activities of daily living and mobility assessment
4. **Medical Information** - Current medications, allergies, and medical history
5. **Physical Examination** - Systematic physical assessment with vital signs
6. **Range of Motion** - Joint mobility assessment with active/passive measurements
7. **Gait & Station** - Walking pattern and balance evaluation
8. **Assessment** - Clinical diagnosis, medical source statement, and recommendations
9. **Review & Generate PDF** - Print-preview layout with PDF export functionality

### 🔧 Advanced Functionality
- **Multi-step Navigation** - Smart navigation with section validation
- **Real-time Validation** - Comprehensive form validation with error highlighting
- **Auto-save** - Automatic form data persistence using localStorage
- **Progress Tracking** - Visual progress indicators and completion status
- **PDF Generation** - Professional PDF export matching CE Exam format
- **Print Preview** - Review all form data before PDF generation
- **Missing Field Detection** - Highlights incomplete required fields
- **Toast Notifications** - User feedback for actions and validation
- **Responsive Design** - Mobile-first approach with touch-friendly controls
- **TypeScript** - Full type safety with comprehensive interfaces

### � PDF Export Features
- **CE Exam Format Compliance** - Matches Florida Division of Disability Determination format
- **Professional Layout** - Official header, disclaimer, and structured sections
- **Smart Filename Generation** - `CE_Exam_[PatientName]_[Date].pdf` format
- **Form Validation** - Ensures minimum data requirements before export
- **Multi-page Support** - Automatic page breaks and page numbering
- **Table Formatting** - Professional tables for range of motion data
- **Section Organization** - All sections properly formatted and labeled

## �🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS v4 for utility-first styling
- **UI Components**: shadcn/ui for consistent design system
- **Form Management**: React Hook Form with Zod validation
- **State Management**: React Context with useReducer
- **PDF Generation**: jsPDF for professional document creation
- **Icons**: Lucide React for modern iconography
- **Notifications**: Sonner for toast messages
- **Additional Libraries**:
  - date-fns for date handling
  - clsx and tailwind-merge for conditional styling
  - html2canvas for document capture

## 📁 Project Structure

```
src/
├── components/
│   ├── form-sections/   # Individual form section components
│   │   ├── CEHeaderForm.tsx
│   │   ├── HistoryFormNew.tsx
│   │   ├── FunctionalStatusFormNew.tsx
│   │   ├── MedicalInfoForm.tsx
│   │   ├── PhysicalExamForm.tsx
│   │   ├── RangeOfMotionForm.tsx
│   │   ├── GaitStationForm.tsx
│   │   └── AssessmentForm.tsx
│   ├── ui/              # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   └── [other-ui-components].tsx
│   ├── FormLayout.tsx   # Main layout component
│   ├── MultiStepFormController.tsx # Main form controller
│   ├── FormReviewAndGenerate.tsx # PDF review and export
│   ├── PDFExportButton.tsx # PDF export button component
│   └── ProgressBar.tsx  # Progress tracking components
├── contexts/            # React contexts for state management
│   └── MultiStepFormContext.tsx
├── hooks/               # Custom React hooks
│   ├── useFormManager.ts
│   └── useFormValidation.ts
├── lib/                 # Utility libraries
│   ├── form-storage.ts
│   └── utils.ts
├── services/            # Business logic services
│   └── PDFGeneratorService.ts # PDF generation service
├── types/               # TypeScript type definitions
│   └── comprehensive-medical-form.ts
├── utils/               # Utility functions
│   └── pdfUtils.ts      # PDF-related utilities
└── styles/              # Global styles and CSS
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/[username]/medical-intake-form.git
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

4. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Usage

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Key Components

#### FormLayout
The main layout component providing the professional medical interface:
- Responsive sidebar navigation
- Progress tracking
- Section status indicators
- Auto-save functionality

#### MultiStepFormController
Manages the multi-step form flow:
- Section navigation logic
- Form validation coordination
- Data persistence
- Progress calculation
- PDF export integration

#### FormReviewAndGenerate
Comprehensive review and PDF generation component:
- Print-preview style layout matching CE Exam format
- Section-by-section data display with validation status
- Missing field highlighting in red
- Edit buttons for quick navigation back to sections
- Floating action bar with PDF generation and download
- Success notifications and loading states

#### PDFGeneratorService
Professional PDF generation service:
- Florida CE Exam format compliance
- Official header and disclaimer
- Structured section layout with proper formatting
- Table generation for range of motion data
- Multi-page support with page numbering
- Smart page breaks and content flow

#### Form Sections
Individual components for each medical assessment area:
- Type-safe data handling
- Real-time validation
- Professional medical layouts
- Accessibility compliance
- CE Exam format compliance

## 🎯 Form Sections Detail

### Implemented Sections

#### 1. Basic Information
- Patient demographics
- Contact information
- Emergency contacts
- Insurance details

#### 2. Medical History
- Past medical history
- Current medications
- Allergies and reactions
- Family medical history

#### 3. Functional Status
- Activities of Daily Living (ADL)
- Instrumental ADL
- Mobility assessment
- Pain evaluation

#### 4. Vital Signs
- Blood pressure, heart rate, temperature
- Respiratory rate and oxygen saturation
- Height, weight, and BMI
- Additional measurements

#### 5. Physical Examination
- General appearance
- System-by-system examination
- Cardiovascular, respiratory, musculoskeletal
- Neurological assessment

#### 6. Neuromuscular Assessment
- Manual muscle testing
- Deep tendon reflexes
- Sensory assessment
- Coordination testing

#### 7. Clinical Assessment
- Primary and secondary diagnoses
- Clinical impressions
- Treatment goals and interventions
- Provider information

## � PDF Generation Workflow

### How to Generate PDF Reports

1. **Complete Form Sections**
   - Fill out required form sections (minimum 50% completion)
   - Each section validates in real-time
   - Missing required fields are highlighted

2. **Navigate to Review Step**
   - Use navigation or complete all previous steps
   - Review step shows print-preview layout
   - All data displayed in CE Exam format

3. **Review and Validate**
   - Check completion status for each section
   - Missing fields highlighted in red
   - Use section edit buttons to make corrections

4. **Generate PDF**
   - Click "Generate PDF" to create document
   - Loading spinner shows generation progress
   - Success notification confirms completion

5. **Download PDF**
   - Click "Download PDF" for file download
   - Filename format: `CE_Exam_[PatientName]_[Date].pdf`
   - Professional format matching Florida CE requirements

### PDF Features
- **Official Format**: Matches Florida Division of Disability Determination requirements
- **Professional Layout**: Official header, disclaimer, and structured sections
- **Complete Data**: All form sections included with proper formatting
- **Table Support**: Range of motion data in professional tables
- **Multi-page**: Automatic page breaks and numbering
- **Validation**: Ensures data completeness before generation

## �🔒 Data Management

### Local Storage
- Automatic form data persistence
- Progress tracking across sessions
- User preference storage

### Validation System
- Real-time field validation
- Section-level completion checking
- Comprehensive error reporting
- Type-safe validation rules

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for medical professionalism
- **Success**: Green for completed sections
- **Warning**: Orange for attention items
- **Error**: Red for validation errors
- **Neutral**: Gray scale for backgrounds and text

### Typography
- Clean, readable fonts
- Proper hierarchy with headings
- Accessible contrast ratios
- Professional medical appearance

## 🚧 Roadmap

### Near Term
- [ ] Complete remaining form sections (Range of Motion, Gait & Station)
- [ ] PDF export functionality
- [ ] Print-friendly views
- [ ] Enhanced validation rules

### Future Enhancements
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Offline functionality
- [ ] Integration with EMR systems
- [ ] Advanced reporting features
- [ ] User authentication system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍⚕️ Medical Disclaimer

This software is for educational and demonstration purposes only. It is not intended for actual medical use without proper validation, testing, and compliance with healthcare regulations (HIPAA, etc.). Always consult with healthcare professionals and legal experts before using in a clinical environment.

## 📞 Support

For questions, suggestions, or issues:
- Open an issue on GitHub
- Contact the maintainers
- Check the documentation in the `/docs` folder

## 🙏 Acknowledgments

- Built with modern React and TypeScript practices
- UI components inspired by medical software best practices
- Accessibility guidelines following WCAG standards
- Healthcare workflow insights from medical professionals
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Accessibility**: Built with accessibility best practices and ARIA compliance
- **Modern UI Components**: Using shadcn/ui component library for consistent design

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide React** - Beautiful, customizable icons

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   └── PersonalInfoForm.tsx
├── pages/               # Page-level components
│   └── MedicalIntakePage.tsx
├── types/               # TypeScript type definitions
│   └── medical-form.ts
├── utils/               # Utility functions
│   ├── validation.ts    # Form validation helpers
│   └── form-storage.ts  # LocalStorage management
├── styles/              # Custom styles
└── App.tsx             # Main application component
```

## Form Sections

### Implemented
- ✅ **Personal Information**: Name, contact details, address, demographics
- ✅ **Progress Tracking**: Visual step indicator and navigation
- ✅ **Review & Submit**: Form summary and submission

### To Be Implemented
- 🔄 **Insurance Information**: Provider details, policy numbers
- 🔄 **Medical History**: Allergies, medications, past procedures
- 🔄 **Current Visit**: Chief complaint, symptoms, pain assessment
- 🔄 **Emergency Contact**: Emergency contact information

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medical-intake-form
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Linting

```bash
npm run lint
```

## Development Guidelines

### Adding New Form Sections

1. Define types in `src/types/medical-form.ts`
2. Create form component following the pattern in `PersonalInfoForm.tsx`
3. Add validation logic using utilities from `src/utils/validation.ts`
4. Integrate the new section into `MedicalIntakePage.tsx`

### Styling Guidelines

- Use Tailwind CSS utility classes for styling
- Follow the existing design patterns and spacing
- Ensure responsive design with mobile-first approach
- Use shadcn/ui components for consistency

### Type Safety

- All form data should use the defined TypeScript interfaces
- Add proper type annotations for new functions and components
- Use the existing validation utilities for form inputs

## Data Management

The application uses localStorage to automatically save form progress:

- **Auto-save**: Form data is saved on every change
- **Resume**: Users can close and reopen the form without losing progress
- **Clear**: Option to clear saved draft data

## Contributing

1. Follow the existing code patterns and conventions
2. Ensure all new components are properly typed
3. Add appropriate validation for new form fields
4. Test responsive design on multiple screen sizes
5. Maintain accessibility standards

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please contact the development team or create an issue in the project repository.
