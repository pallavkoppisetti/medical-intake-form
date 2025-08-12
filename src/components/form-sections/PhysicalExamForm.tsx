import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { Target, Eye, Stethoscope } from 'lucide-react';

export function PhysicalExamForm() {
  const { state, updateSection } = useMultiStepForm();
  const data = state.formData.physicalExam || {};

  const updateField = (field: string, value: any) => {
    updateSection('physicalExam', { ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Target className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Physical Examination</h2>
          <p className="text-gray-600">Systematic physical assessment findings</p>
        </div>
      </div>

      {/* General Appearance */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Eye className="w-5 h-5 text-blue-500 mr-2" />
          General Appearance
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              General Appearance
            </label>
            <textarea
              value={(data as any).generalAppearance || ''}
              onChange={(e) => updateField('generalAppearance', e.target.value)}
              placeholder="Describe patient's general appearance, posture, and presentation"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mental Status
              </label>
              <select
                value={(data as any).mentalStatus || ''}
                onChange={(e) => updateField('mentalStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select...</option>
                <option value="alert-oriented">Alert and Oriented</option>
                <option value="confused">Confused</option>
                <option value="agitated">Agitated</option>
                <option value="lethargic">Lethargic</option>
                <option value="unresponsive">Unresponsive</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cooperation Level
              </label>
              <select
                value={(data as any).cooperation || ''}
                onChange={(e) => updateField('cooperation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select...</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="unable">Unable to cooperate</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* System Examination */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Stethoscope className="w-5 h-5 text-red-500 mr-2" />
          System Examination
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cardiovascular
            </label>
            <textarea
              value={(data as any).cardiovascular || ''}
              onChange={(e) => updateField('cardiovascular', e.target.value)}
              placeholder="Heart sounds, rhythm, circulation findings"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Respiratory
            </label>
            <textarea
              value={(data as any).respiratory || ''}
              onChange={(e) => updateField('respiratory', e.target.value)}
              placeholder="Breath sounds, breathing pattern, respiratory effort"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Musculoskeletal
            </label>
            <textarea
              value={(data as any).musculoskeletal || ''}
              onChange={(e) => updateField('musculoskeletal', e.target.value)}
              placeholder="Joint mobility, muscle tone, deformities, alignment"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Neurological
            </label>
            <textarea
              value={(data as any).neurological || ''}
              onChange={(e) => updateField('neurological', e.target.value)}
              placeholder="Reflexes, sensation, coordination, balance"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Skin and Integumentary
            </label>
            <textarea
              value={(data as any).skin || ''}
              onChange={(e) => updateField('skin', e.target.value)}
              placeholder="Skin condition, wounds, scars, surgical sites"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>
        </div>
      </div>

      {/* Additional Findings */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Findings</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Remarkable Findings
            </label>
            <textarea
              value={(data as any).remarkableFindings || ''}
              onChange={(e) => updateField('remarkableFindings', e.target.value)}
              placeholder="Any significant or abnormal findings"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Normal Findings
            </label>
            <textarea
              value={(data as any).normalFindings || ''}
              onChange={(e) => updateField('normalFindings', e.target.value)}
              placeholder="Systems and areas that appear normal"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
