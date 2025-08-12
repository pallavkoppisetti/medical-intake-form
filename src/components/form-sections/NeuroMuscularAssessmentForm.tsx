import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { Brain, Zap } from 'lucide-react';

export function NeuroMuscularAssessmentForm() {
  const { state, updateSection } = useMultiStepForm();
  const data = state.formData.neuroMuscularAssessment || {};

  const updateField = (field: string, value: any) => {
    updateSection('neuroMuscularAssessment', { ...data, [field]: value });
  };

  const strengthOptions = [
    { value: '', label: 'Select...' },
    { value: '0', label: '0/5 - No contraction' },
    { value: '1', label: '1/5 - Trace contraction' },
    { value: '2', label: '2/5 - Poor' },
    { value: '3', label: '3/5 - Fair' },
    { value: '4', label: '4/5 - Good' },
    { value: '5', label: '5/5 - Normal' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Brain className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Neuromuscular Assessment</h2>
          <p className="text-gray-600">Evaluate neurological and muscular function</p>
        </div>
      </div>

      {/* Muscle Strength Testing */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 text-orange-500 mr-2" />
          Muscle Strength Testing (Manual Muscle Testing)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Upper Extremity - Right</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Shoulder:</label>
                <select
                  value={(data as any).rightShoulderStrength || ''}
                  onChange={(e) => updateField('rightShoulderStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Elbow:</label>
                <select
                  value={(data as any).rightElbowStrength || ''}
                  onChange={(e) => updateField('rightElbowStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Wrist:</label>
                <select
                  value={(data as any).rightWristStrength || ''}
                  onChange={(e) => updateField('rightWristStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Upper Extremity - Left</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Shoulder:</label>
                <select
                  value={(data as any).leftShoulderStrength || ''}
                  onChange={(e) => updateField('leftShoulderStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Elbow:</label>
                <select
                  value={(data as any).leftElbowStrength || ''}
                  onChange={(e) => updateField('leftElbowStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Wrist:</label>
                <select
                  value={(data as any).leftWristStrength || ''}
                  onChange={(e) => updateField('leftWristStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Lower Extremity - Right</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Hip:</label>
                <select
                  value={(data as any).rightHipStrength || ''}
                  onChange={(e) => updateField('rightHipStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Knee:</label>
                <select
                  value={(data as any).rightKneeStrength || ''}
                  onChange={(e) => updateField('rightKneeStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Ankle:</label>
                <select
                  value={(data as any).rightAnkleStrength || ''}
                  onChange={(e) => updateField('rightAnkleStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Lower Extremity - Left</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Hip:</label>
                <select
                  value={(data as any).leftHipStrength || ''}
                  onChange={(e) => updateField('leftHipStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Knee:</label>
                <select
                  value={(data as any).leftKneeStrength || ''}
                  onChange={(e) => updateField('leftKneeStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="w-24 text-sm text-gray-700">Ankle:</label>
                <select
                  value={(data as any).leftAnkleStrength || ''}
                  onChange={(e) => updateField('leftAnkleStrength', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strengthOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reflexes */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deep Tendon Reflexes</h3>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">Scale: 0 = Absent, 1+ = Hypoactive, 2+ = Normal, 3+ = Hyperactive, 4+ = Hyperactive with clonus</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Right Side</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <label className="w-20 text-sm text-gray-700">Biceps:</label>
                <select
                  value={(data as any).rightBicepsReflex || ''}
                  onChange={(e) => updateField('rightBicepsReflex', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="0">0 - Absent</option>
                  <option value="1">1+ - Hypoactive</option>
                  <option value="2">2+ - Normal</option>
                  <option value="3">3+ - Hyperactive</option>
                  <option value="4">4+ - Hyperactive with clonus</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="w-20 text-sm text-gray-700">Triceps:</label>
                <select
                  value={(data as any).rightTricepsReflex || ''}
                  onChange={(e) => updateField('rightTricepsReflex', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="0">0 - Absent</option>
                  <option value="1">1+ - Hypoactive</option>
                  <option value="2">2+ - Normal</option>
                  <option value="3">3+ - Hyperactive</option>
                  <option value="4">4+ - Hyperactive with clonus</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Left Side</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <label className="w-20 text-sm text-gray-700">Biceps:</label>
                <select
                  value={(data as any).leftBicepsReflex || ''}
                  onChange={(e) => updateField('leftBicepsReflex', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="0">0 - Absent</option>
                  <option value="1">1+ - Hypoactive</option>
                  <option value="2">2+ - Normal</option>
                  <option value="3">3+ - Hyperactive</option>
                  <option value="4">4+ - Hyperactive with clonus</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="w-20 text-sm text-gray-700">Triceps:</label>
                <select
                  value={(data as any).leftTricepsReflex || ''}
                  onChange={(e) => updateField('leftTricepsReflex', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="0">0 - Absent</option>
                  <option value="1">1+ - Hypoactive</option>
                  <option value="2">2+ - Normal</option>
                  <option value="3">3+ - Hyperactive</option>
                  <option value="4">4+ - Hyperactive with clonus</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sensation */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensory Assessment</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Light Touch
            </label>
            <textarea
              value={(data as any).lightTouch || ''}
              onChange={(e) => updateField('lightTouch', e.target.value)}
              placeholder="Describe light touch sensation findings"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sharp/Dull Discrimination
            </label>
            <textarea
              value={(data as any).sharpDull || ''}
              onChange={(e) => updateField('sharpDull', e.target.value)}
              placeholder="Describe sharp/dull discrimination findings"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional Neurological Notes
            </label>
            <textarea
              value={(data as any).additionalNotes || ''}
              onChange={(e) => updateField('additionalNotes', e.target.value)}
              placeholder="Any additional neurological findings or observations"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
