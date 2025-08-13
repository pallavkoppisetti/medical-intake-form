# Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- VS Code (recommended)

### Setup
```bash
git clone https://github.com/pallavkoppisetti/medical-intake-form.git
cd medical-intake-form
npm install
npm run dev
```

### Development Server
- **URL**: http://localhost:5173
- **Hot Reload**: Automatic code updates
- **TypeScript**: Full type checking enabled
- **ESLint**: Code quality enforcement
- **Test Features**: Development-only testing tools available

## 📁 Project Architecture

### Key Directories
- `src/components/` - All React components
- `src/components/form-sections/` - Individual CE Exam form sections
- `src/components/ui/` - shadcn/ui components and custom UI elements
- `src/contexts/` - React context providers for state management
- `src/types/` - TypeScript definitions for medical forms
- `src/hooks/` - Custom React hooks for form management
- `src/services/` - Business logic services (PDF generation, CE Exam compliance)
- `src/lib/` - Utility libraries and helpers
- `src/utils/` - Utility functions for validation and PDF handling
- `docs/` - Comprehensive documentation files

### State Management
- **Global State**: React Context with useReducer for complex form state
- **Form Data**: Centralized in `MultiStepFormContext` with auto-save
- **Persistence**: Automatic localStorage with visual indicators (30-second intervals)
- **Validation**: Real-time validation with section-level progress tracking
- **Navigation**: Smart navigation with prerequisites and completion checking

### Component Architecture
- **FormLayout**: Main responsive layout with sidebar navigation (fixed layout issues)
- **MultiStepFormController**: Central form management and step rendering
- **FormReviewAndGenerate**: PDF preview and generation with comprehensive test tools
- **SaveProgressIndicator**: Floating auto-save status indicator with animations
- **Form Sections**: Individual CE-compliant medical assessment components

## 🏥 CE Exam Compliance Architecture

### PDF Generation Service
- **PDFGeneratorService**: Main class for CE Exam format PDF generation
- **Exact Format Compliance**: Matches Florida Division of Disability Determination requirements
- **Professional Layout**: Header, disclaimer, claimant info box, structured sections
- **Table Generation**: Specialized methods for range of motion and assessment tables

### Medical Assessment Components
- **Neuromuscular Assessment**: Complete strength, manipulative skills, and reflexes
- **Range of Motion**: Bilateral joint measurements with CE Exam table format
- **Gait and Station**: Performance tests and assistive device assessment
- **Assessment**: Diagnosis, medical source statement, recommendations with exact formatting

### Form Data Structure
- **Comprehensive Types**: Full TypeScript coverage for all medical assessments
- **CE Exam Mapping**: Direct mapping from form fields to PDF output format
- **Validation Rules**: Medical-specific validation and required field enforcement

## 🔧 Development Workflow

### Adding a New Form Section

1. **Create the TypeScript interface** in `src/types/comprehensive-medical-form.ts`
2. **Create the form component** in `src/components/form-sections/`
3. **Add to FormSteps** in `src/contexts/MultiStepFormContext.tsx`
4. **Register in controller** in `src/components/MultiStepFormController.tsx`
5. **Add validation logic** in form component and context
6. **Update PDF generation** in `src/services/PDFGeneratorService.ts`
7. **Add helper text and examples** following existing patterns

### Example: Adding a New Section

```typescript
// 1. Add to types (src/types/comprehensive-medical-form.ts)
export interface NewSection {
  field1: string;
  field2: number;
  field3?: string; // Optional field
}
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

## 🧪 Development Testing Tools

### Test Data Generation (Development Mode Only)
The application includes comprehensive testing tools available only in development mode:

```tsx
// Access via FormReviewAndGenerate component
const isDevelopment = process.env.NODE_ENV === 'development';

// Features available in development:
- Orange "Test with Sample Data" button
- One-click population of realistic medical data
- Automatic PDF generation for format verification
- Complete CE Exam format testing
```

### Sample Data Coverage
- **Patient Demographics**: Jane Doe, DOB: 01/15/1980, Case: DDS-2024-12345
- **Complete Medical History**: 2-year chronic low back pain case
- **All Assessment Types**: Neuromuscular, range of motion, gait station
- **CE Exam Compliance**: All sections match exact format requirements
- **Realistic Values**: Normal ranges (5/5 strength, 2+ reflexes, normal ROM)

### Testing CE Exam Format
1. **Load Test Data**: Click "Test with Sample Data" button
2. **Generate PDF**: Automatic PDF creation and download
3. **Verify Format**: Compare against CE Exam requirements
4. **Check Sections**: All 8 sections populated with realistic data

## 🚢 Deployment

### Build Process
```bash
npm run build        # Create optimized production build
npm run preview      # Preview production build
npm run dev          # Development server with test features
```

### Production Optimizations
- **Chunk Splitting**: Separate vendor chunks for better caching
- **Tree Shaking**: Removes unused code automatically
- **Minification**: ESBuild minification for optimal performance
- **Asset Optimization**: Images and assets properly compressed

### Environment Variables
```env
# Development (.env.development)
VITE_APP_VERSION=2.0.0-dev
VITE_APP_ENV=development
VITE_ENABLE_TEST_DATA=true
VITE_ENABLE_CONSOLE_LOGS=true

# Production (.env.production)
VITE_APP_VERSION=2.0.0
VITE_APP_ENV=production
VITE_ENABLE_TEST_DATA=false
VITE_ENABLE_CONSOLE_LOGS=false
```

### AWS Amplify Deployment
1. **Build Configuration**: `amplify.yml` included for automatic deployment
2. **Production Settings**: Optimized Vite config with chunk splitting
3. **Environment Setup**: Production environment variables configured
4. **Deployment Guide**: Complete step-by-step guide in `AWS_AMPLIFY_DEPLOYMENT_GUIDE.md`

### Performance Monitoring
- **Chunk Size Warnings**: Set to 600KB limit
- **Build Analysis**: Manual chunk splitting for optimal loading
- **Core Web Vitals**: Performance metrics tracking ready
- **Bundle Size**: Optimized vendor chunks for better caching

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)

### Medical Form Standards
- Florida Division of Disability Determination CE Exam requirements
- HL7 FHIR for healthcare interoperability
- ICD-10 for diagnostic coding
- SNOMED CT for clinical terminology
- HIPAA compliance guidelines

### CE Exam Compliance Resources
- **Format Requirements**: Exact Florida DDD CE Exam formatting standards
- **Medical Terminology**: Professional medical language and abbreviations
- **Assessment Standards**: Clinical examination documentation requirements
- **PDF Layout**: Professional medical report formatting guidelines
