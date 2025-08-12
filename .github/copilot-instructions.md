<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Medical Intake Form Application Instructions

This is a React TypeScript application built with Vite for creating medical intake forms specifically designed for Florida Division of Disability Determination consultative examinations. The application uses:

- **React 18** with TypeScript for strict type safety
- **Vite** for fast development and building
- **Tailwind CSS v4** for utility-first styling
- **shadcn/ui** components for consistent UI design
- **jsPDF** for professional PDF generation
- **Sonner** for toast notifications
- **Local storage** for auto-saving form progress

## Project Structure

- `src/components/` - Reusable UI components and form sections
- `src/components/form-sections/` - Individual CE Exam form sections
- `src/contexts/` - React Context for global state management
- `src/services/` - Business logic services (PDF generation)
- `src/types/` - TypeScript type definitions for medical forms
- `src/utils/` - Utility functions for validation and PDF handling
- `src/lib/` - Utility libraries and storage functions

## Key Features

- Multi-step form with smart navigation and progress tracking
- Real-time form validation with error highlighting
- Auto-save functionality using localStorage
- Professional PDF generation matching CE Exam format
- Print-preview review component with missing field detection
- Responsive design optimized for mobile and desktop
- Strict TypeScript for robust type safety
- Toast notifications for user feedback

## Development Guidelines

When working with this codebase:

1. Use the existing type definitions in `src/types/comprehensive-medical-form.ts`
2. Follow the established component patterns using shadcn/ui
3. Implement proper form validation and error handling
4. Maintain accessibility standards with proper labeling and ARIA attributes
5. Use Tailwind CSS v4 classes for styling consistency
6. Ensure mobile-responsive design for all new components
7. Follow the PDFGeneratorService pattern for document generation
8. Use the context pattern for state management
9. Implement toast notifications for user actions

## Medical Form Sections (Florida CE Exam Compliant)

The intake form includes these main sections:
- **Header Information** - Claimant demographics and case details (implemented)
- **History** - Medical history and present illness (implemented)
- **Functional Status** - Activities of daily living assessment (implemented)
- **Medical Information** - Medications, allergies, surgical history (implemented)
- **Physical Examination** - Systematic physical assessment (implemented)
- **Range of Motion** - Joint mobility with active/passive measurements (implemented)
- **Gait & Station** - Walking pattern and balance evaluation (implemented)
- **Assessment** - Clinical diagnosis and medical source statement (implemented)
- **Review & Generate PDF** - Comprehensive review with PDF export (implemented)

## PDF Generation

The application includes a comprehensive PDF generation system:
- Use `PDFGeneratorService` class for document creation
- Follow CE Exam format requirements strictly
- Include all sections with proper formatting
- Implement validation before PDF generation
- Use the `FormReviewAndGenerate` component for user interface

When adding new form sections, follow the pattern established in existing form components and ensure CE Exam compliance.
