# Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- VS Code (recommended)

### Setup
```bash
git clone https://github.com/[username]/medical-intake-form.git
cd medical-intake-form
npm install
npm run dev
```

## 📁 Project Architecture

### Key Directories
- `src/components/` - All React components
- `src/components/form-sections/` - Individual form pages
- `src/components/ui/` - Reusable UI components
- `src/contexts/` - React context providers
- `src/types/` - TypeScript definitions
- `src/hooks/` - Custom React hooks
- `docs/` - Documentation files

### State Management
- **Global State**: React Context with useReducer
- **Form Data**: Centralized in `MultiStepFormContext`
- **Persistence**: Auto-save to localStorage
- **Validation**: Real-time with section-level tracking

## 🔧 Development Workflow

### Adding a New Form Section

1. **Create the TypeScript interface** in `src/types/comprehensive-medical-form.ts`
2. **Create the form component** in `src/components/form-sections/`
3. **Add to FormSteps** in `src/contexts/MultiStepFormContext.tsx`
4. **Register in controller** in `src/components/MultiStepFormController.tsx`
5. **Add validation logic** in `src/hooks/useFormValidation.ts`

### Example: Adding a New Section

```typescript
// 1. Add to types
export interface NewSection {
  field1: string;
  field2: number;
  // ... other fields
}

// 2. Update main form interface
export interface CompleteMedicalIntakeForm {
  // ... existing sections
  newSection?: NewSection;
}

// 3. Create component
export function NewSectionForm() {
  const { state, updateSection } = useMultiStepForm();
  const data = state.formData.newSection || {};
  
  const updateField = (field: string, value: any) => {
    updateSection('newSection', { ...data, [field]: value });
  };
  
  return (
    // Form JSX
  );
}

// 4. Add to FORM_STEPS
export const FORM_STEPS = [
  // ... existing steps
  { id: 'newSection', title: 'New Section', required: false },
];

// 5. Add case in MultiStepFormController
case X: // Replace X with step number
  return <NewSectionForm />;
```

## 🎨 Styling Guidelines

### Tailwind CSS Classes
- **Primary Colors**: `blue-*` for main theme
- **Success**: `green-*` for completed states
- **Warning**: `yellow-*` or `orange-*` for alerts
- **Error**: `red-*` for validation errors
- **Neutral**: `gray-*` for backgrounds and text

### Component Structure
```jsx
// Standard form section layout
<div className="space-y-8">
  {/* Header */}
  <div className="flex items-center space-x-3 mb-6">
    <div className="p-2 bg-blue-100 rounded-lg">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Section Title</h2>
      <p className="text-gray-600">Section description</p>
    </div>
  </div>

  {/* Form groups */}
  <div className="bg-gray-50 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Subsection Title
    </h3>
    {/* Form fields */}
  </div>
</div>
```

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Testing Guidelines
- Unit tests for utility functions
- Component tests for form sections
- Integration tests for form flow
- E2E tests for critical paths

## 📝 Code Style

### TypeScript
- Use strict mode
- Prefer interfaces over types for objects
- Use proper generic constraints
- Document complex types

### React
- Functional components with hooks
- Use proper dependency arrays
- Avoid unnecessary re-renders
- Follow React best practices

### Naming Conventions
- **Files**: PascalCase for components, kebab-case for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types**: PascalCase

## 🔍 Debugging

### Development Tools
- React Developer Tools
- Redux DevTools (for context debugging)
- VS Code debugger
- Browser console

### Common Issues
1. **Form not saving**: Check localStorage permissions
2. **Validation errors**: Verify field names match interface
3. **Navigation issues**: Check step requirements and validation
4. **Styling problems**: Verify Tailwind classes and PostCSS config

## 📋 Code Review Checklist

### Before Submitting PR
- [ ] Code follows style guidelines
- [ ] TypeScript errors resolved
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Accessibility checked
- [ ] Mobile responsiveness verified
- [ ] Performance impact considered

### Review Focus Areas
- Type safety
- Component reusability
- Performance implications
- Accessibility compliance
- Medical accuracy (for healthcare features)

## 🚢 Deployment

### Build Process
```bash
npm run build        # Create production build
npm run preview      # Preview production build
```

### Environment Variables
Create `.env.local` for local development:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_VERSION=1.0.0
```

### Production Considerations
- Enable error reporting
- Configure analytics
- Set up monitoring
- Implement proper logging
- Consider HIPAA compliance for healthcare use

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Medical Form Standards
- HL7 FHIR for healthcare interoperability
- ICD-10 for diagnostic coding
- SNOMED CT for clinical terminology
- HIPAA compliance guidelines
