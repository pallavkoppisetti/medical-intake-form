import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { Activity, Heart, Zap } from 'lucide-react';

export function FunctionalStatusForm() {
  const { state, updateSection } = useMultiStepForm();
  const data = state.formData.functionalStatus || {};

  const updateField = (field: string, value: any) => {
    updateSection('functionalStatus', { ...data, [field]: value });
  };

  const adlOptions = [
    { value: '', label: 'Select...' },
    { value: 'independent', label: 'Independent' },
    { value: 'needs-assistance', label: 'Needs Assistance' },
    { value: 'dependent', label: 'Dependent' },
  ];

  const mobilityOptions = [
    { value: '', label: 'Select...' },
    { value: 'unlimited', label: 'Unlimited' },
    { value: 'blocks', label: 'Several Blocks' },
    { value: 'household', label: 'Household Only' },
    { value: 'wheelchair', label: 'Wheelchair' },
    { value: 'bedbound', label: 'Bedbound' },
  ];

  const stairOptions = [
    { value: '', label: 'Select...' },
    { value: 'independent', label: 'Independent' },
    { value: 'needs-rail', label: 'Needs Rail' },
    { value: 'needs-assistance', label: 'Needs Assistance' },
    { value: 'unable', label: 'Unable' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Activity className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Functional Status Assessment</h2>
          <p className="text-gray-600">Evaluate the patient's daily living activities and mobility</p>
        </div>
      </div>

      {/* Activities of Daily Living */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 text-red-500 mr-2" />
          Activities of Daily Living (ADL)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bathing <span className="text-red-500">*</span>
            </label>
            <select
              value={(data as any).bathing || ''}
              onChange={(e) => updateField('bathing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {adlOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Dressing <span className="text-red-500">*</span>
            </label>
            <select
              value={(data as any).dressing || ''}
              onChange={(e) => updateField('dressing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {adlOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Toileting <span className="text-red-500">*</span>
            </label>
            <select
              value={(data as any).toileting || ''}
              onChange={(e) => updateField('toileting', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {adlOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Transferring <span className="text-red-500">*</span>
            </label>
            <select
              value={(data as any).transferring || ''}
              onChange={(e) => updateField('transferring', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {adlOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Feeding <span className="text-red-500">*</span>
            </label>
            <select
              value={(data as any).feeding || ''}
              onChange={(e) => updateField('feeding', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {adlOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Continence
            </label>
            <select
              value={(data as any).continence || ''}
              onChange={(e) => updateField('continence', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {adlOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobility Assessment */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 text-orange-500 mr-2" />
          Mobility Assessment
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Walking Distance <span className="text-red-500">*</span>
            </label>
            <select
              value={(data as any).walkingDistance || ''}
              onChange={(e) => updateField('walkingDistance', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {mobilityOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Stair Climbing
            </label>
            <select
              value={(data as any).stairClimbing || ''}
              onChange={(e) => updateField('stairClimbing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {stairOptions.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(data as any).balanceProblems || false}
                onChange={(e) => updateField('balanceProblems', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                History of Balance Problems
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(data as any).fallHistory || false}
                onChange={(e) => updateField('fallHistory', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                History of Falls
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Work and Recreation */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Work & Recreation Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Work Status
            </label>
            <select
              value={(data as any).workStatus || ''}
              onChange={(e) => updateField('workStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="retired">Retired</option>
              <option value="disability">Disability</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Assistive Devices Used
            </label>
            <textarea
              value={(data as any).assistiveDevices || ''}
              onChange={(e) => updateField('assistiveDevices', e.target.value)}
              placeholder="List any assistive devices (walker, cane, wheelchair, etc.)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recreational Activities
          </label>
          <textarea
            value={(data as any).recreationalActivities || ''}
            onChange={(e) => updateField('recreationalActivities', e.target.value)}
            placeholder="Describe hobbies, sports, and recreational activities"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
          />
        </div>
      </div>

      {/* Pain Assessment */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pain Assessment</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={(data as any).hasPain || false}
                onChange={(e) => updateField('hasPain', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                Patient reports pain
              </span>
            </label>
          </div>

          {(data as any).hasPain && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pain Scale (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={(data as any).painScale || ''}
                    onChange={(e) => updateField('painScale', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pain Location
                  </label>
                  <input
                    type="text"
                    value={(data as any).painLocation || ''}
                    onChange={(e) => updateField('painLocation', e.target.value)}
                    placeholder="e.g., Lower back, Right knee"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pain Description
                </label>
                <textarea
                  value={(data as any).painDescription || ''}
                  onChange={(e) => updateField('painDescription', e.target.value)}
                  placeholder="Describe the pain characteristics (sharp, dull, burning, etc.)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
