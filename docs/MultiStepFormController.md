# MultiStepFormController Documentation

## Overview

The `MultiStepFormController` is a comprehensive React component that manages complex multi-step forms using React Context and useReducer. It provides advanced features like progress tracking, validation state management, auto-save functionality, and flexible navigation.

## Architecture

### Core Components

1. **MultiStepFormContext** (`/src/contexts/MultiStepFormContext.tsx`)
   - Central state management using useReducer
   - Form data persistence with localStorage
   - Validation state tracking
   - Progress calculation
   - Auto-save functionality

2. **MultiStepFormController** (`/src/components/MultiStepFormController.tsx`)
   - Main form container component
   - Renders current form step
   - Handles navigation and actions
   - Preview mode for form data

3. **ProgressBar** (`/src/components/ProgressBar.tsx`)
   - Visual progress tracking
   - Step navigation interface
   - Completion status indicators
   - Error state visualization

4. **FormNavigation** (`/src/components/FormNavigation.tsx`)
   - Step-by-step navigation controls
   - Current step information display
   - Completion status indicators

## Usage

### Basic Setup

```tsx
import { MultiStepFormProvider } from './contexts/MultiStepFormContext';
import { MultiStepFormController } from './components/MultiStepFormController';

function App() {
  return (
    <MultiStepFormProvider>
      <MultiStepFormController />
    </MultiStepFormProvider>
  );
}
```

### Advanced Configuration

```tsx
function App() {
  const handleFormSubmit = async (formData: CompleteMedicalIntakeForm) => {
    // Submit to your API
    const response = await fetch('/api/medical-intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return response.ok;
  };

  return (
    <MultiStepFormProvider
      autoSave={true}
      autoSaveInterval={30000} // 30 seconds
      storageKey="custom-form-key"
      onSubmit={handleFormSubmit}
      onStepChange={(step) => console.log('Step changed:', step)}
      onSectionComplete={(sectionId) => console.log('Section completed:', sectionId)}
    >
      <MultiStepFormController
        showProgressBar={true}
        progressBarOrientation="horizontal"
        enablePreview={true}
        autoSave={true}
      />
    </MultiStepFormProvider>
  );
}
```

## Key Features

### 1. State Management
- **useReducer**: Centralized state management with predictable updates
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Immutable Updates**: State changes through dispatch actions

### 2. Navigation Control
- **Step Validation**: Navigate only to accessible steps
- **Completion Tracking**: Visual indicators for completed sections
- **Flexible Navigation**: Click on any accessible step to navigate

### 3. Validation System
- **Real-time Validation**: Validates sections as data changes
- **Error Display**: Shows validation errors clearly
- **Completion Tracking**: Tracks completion percentage per section

### 4. Progress Tracking
- **Overall Progress**: Calculated across all form sections
- **Section Progress**: Individual completion percentages
- **Visual Indicators**: Color-coded status (complete, errors, in-progress)

### 5. Data Persistence
- **Auto-save**: Configurable automatic saving to localStorage
- **Manual Save**: Save button for explicit data persistence
- **Load on Mount**: Automatically restores saved form data

### 6. Preview Mode
- **Form Preview**: View all entered data in a formatted layout
- **JSON View**: Raw data inspection for developers
- **Section Editing**: Quick navigation to edit specific sections

## State Structure

```typescript
interface FormState {
  // Navigation
  currentStep: number;
  visitedSteps: Set<number>;
  
  // Data
  formData: Partial<CompleteMedicalIntakeForm>;
  
  // Validation
  validationState: ValidationState;
  
  // Progress
  overallProgress: number;
  completedSections: Set<FormStepId>;
  
  // Persistence
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  
  // UI
  isSubmitting: boolean;
  submitAttempted: boolean;
}
```

## Available Actions

### Navigation Actions
- `nextStep()` - Move to next step
- `previousStep()` - Move to previous step
- `goToStep(stepIndex)` - Jump to specific step
- `canNavigateToStep(stepIndex)` - Check if step is accessible

### Data Actions
- `updateSection(sectionId, data)` - Update section data
- `validateSection(sectionId)` - Validate specific section
- `validateAllSections()` - Validate entire form

### Persistence Actions
- `saveForm()` - Manual save to localStorage
- `loadForm()` - Load saved data
- `resetForm()` - Clear all form data

### Submit Actions
- `submitForm()` - Submit completed form

## Form Steps Configuration

```typescript
export const FORM_STEPS = [
  { id: 'basicInfo', title: 'Basic Information', required: true },
  { id: 'history', title: 'Medical History', required: true },
  { id: 'functionalStatus', title: 'Functional Status', required: false },
  { id: 'vitalSigns', title: 'Vital Signs', required: true },
  { id: 'physicalExam', title: 'Physical Exam', required: false },
  { id: 'neuroMuscularAssessment', title: 'Neuromuscular', required: false },
  { id: 'rangeOfMotion', title: 'Range of Motion', required: false },
  { id: 'gaitAndStation', title: 'Gait & Station', required: false },
  { id: 'clinicalAssessment', title: 'Clinical Assessment', required: true },
] as const;
```

## Customization

### Adding New Form Sections

1. **Update the form steps configuration**:
```typescript
const FORM_STEPS = [
  // existing steps...
  { id: 'newSection', title: 'New Section', required: false },
];
```

2. **Create the form component**:
```typescript
export function NewSectionForm({ data, onChange, onNext, onPrevious }) {
  // Your form implementation
}
```

3. **Add to the controller's render method**:
```typescript
case 'newSection':
  return (
    <NewSectionForm
      data={currentStepData}
      onChange={handleSectionUpdate}
      onNext={nextStep}
      onPrevious={previousStep}
    />
  );
```

### Custom Progress Bar

```tsx
<ProgressBar
  orientation="vertical"
  showStepNumbers={false}
  showPercentages={true}
  className="custom-progress-bar"
/>
```

### Custom Validation

```typescript
const customValidation = useCallback((sectionId, data) => {
  // Custom validation logic
  return {
    isValid: true,
    errors: [],
    isComplete: true,
    completionPercentage: 100
  };
}, []);
```

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces for form data
2. **Validation**: Implement comprehensive validation for all form sections
3. **Auto-save**: Enable auto-save for better user experience
4. **Error Handling**: Provide clear error messages and recovery options
5. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
6. **Performance**: Use React.memo() for form components that don't change frequently

## Integration with APIs

```typescript
const handleSubmit = async (formData: CompleteMedicalIntakeForm) => {
  try {
    // Validate data before submission
    const validation = await validateFormData(formData);
    if (!validation.isValid) {
      throw new Error('Form validation failed');
    }

    // Submit to API
    const response = await submitToAPI(formData);
    
    // Handle success
    if (response.ok) {
      // Redirect or show success message
      return true;
    }
    
    throw new Error('Submission failed');
  } catch (error) {
    // Handle errors
    console.error('Form submission error:', error);
    return false;
  }
};
```

This architecture provides a robust, scalable foundation for complex multi-step forms with excellent user experience and developer flexibility.
