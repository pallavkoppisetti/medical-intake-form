import { useEffect, useState } from 'react';
import { useMultiStepForm } from '../contexts/MultiStepFormContext';
import { Check, Clock } from 'lucide-react';

export function SaveProgressIndicator() {
  const { state } = useMultiStepForm();
  const [showSaving, setShowSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Show saving indicator when there are unsaved changes
  useEffect(() => {
    if (state.hasUnsavedChanges && !showSaving) {
      setShowSaving(true);
      setShowSaved(false);
    }
  }, [state.hasUnsavedChanges, showSaving]);

  // Show saved indicator when data is saved
  useEffect(() => {
    if (!state.hasUnsavedChanges && state.lastSaved && showSaving) {
      setShowSaving(false);
      setShowSaved(true);
      
      // Hide the saved indicator after 3 seconds
      const timer = setTimeout(() => {
        setShowSaved(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [state.hasUnsavedChanges, state.lastSaved, showSaving]);

  if (!showSaving && !showSaved) {
    return null;
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out
          ${showSaving 
            ? 'bg-amber-100 border border-amber-300 text-amber-800' 
            : 'bg-green-100 border border-green-300 text-green-800'
          }
        `}
      >
        {showSaving ? (
          <>
            <Clock className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">Saving progress...</span>
          </>
        ) : (
          <>
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">
              Saved at {state.lastSaved ? formatTime(state.lastSaved) : ''}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
