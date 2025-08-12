<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Medical Intake Form Application Instructions

This is a React TypeScript application built with Vite for creating medical intake forms. The application uses:

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components for consistent UI design
- **Local storage** for auto-saving form progress

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components
- `src/types/` - TypeScript type definitions for medical forms
- `src/utils/` - Utility functions for validation and data management
- `src/styles/` - Custom styles and CSS files

## Key Features

- Multi-step form with progress tracking
- Form validation with real-time feedback
- Auto-save functionality using localStorage
- Responsive design optimized for mobile and desktop
- Type-safe medical form data structures

## Development Guidelines

When working with this codebase:

1. Use the existing type definitions in `src/types/medical-form.ts`
2. Follow the established component patterns using shadcn/ui
3. Implement proper form validation using the utilities in `src/utils/validation.ts`
4. Maintain accessibility standards with proper labeling and ARIA attributes
5. Use Tailwind CSS classes for styling consistency
6. Ensure mobile-responsive design for all new components

## Medical Form Sections

The intake form includes these main sections:
- Personal Information (implemented)
- Insurance Information (to be implemented)
- Medical History (to be implemented)
- Current Visit Information (to be implemented)
- Emergency Contact (to be implemented)
- Review & Submission (basic implementation)

When adding new form sections, follow the pattern established in `PersonalInfoForm.tsx` for consistency.
