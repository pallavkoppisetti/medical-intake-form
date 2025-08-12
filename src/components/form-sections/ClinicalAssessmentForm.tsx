import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export function ClinicalAssessmentForm() {
  const { state, updateSection } = useMultiStepForm();
  const data = state.formData.assessment || {};

  const updateField = (field: string, value: any) => {
    updateSection('assessment', { ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <FileText className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clinical Assessment</h2>
          <p className="text-gray-600">Professional assessment and treatment recommendations</p>
        </div>
      </div>

      {/* Clinical Findings */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          Clinical Findings
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primary Diagnosis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={(data as any).primaryDiagnosis || ''}
              onChange={(e) => updateField('primaryDiagnosis', e.target.value)}
              placeholder="e.g., Lumbar disc herniation L4-L5 with radiculopathy"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Diagnoses
            </label>
            <textarea
              value={(data as any).secondaryDiagnoses || ''}
              onChange={(e) => updateField('secondaryDiagnoses', e.target.value)}
              placeholder="e.g., Chronic pain syndrome, muscle spasm, decreased functional mobility secondary to primary diagnosis"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Clinical Impression <span className="text-red-500">*</span>
            </label>
            <textarea
              value={(data as any).clinicalImpression || ''}
              onChange={(e) => updateField('clinicalImpression', e.target.value)}
              placeholder="e.g., The patient presents with a 2-year history of chronic low back pain with left lower extremity radiculopathy. Physical examination reveals decreased lumbar range of motion, positive straight leg raise test on the left, and diminished strength in L5 distribution. The patient demonstrates functional limitations in prolonged sitting, standing, and walking. Based on clinical findings and history, the patient would benefit from a comprehensive rehabilitation program..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              required
            />
          </div>
        </div>
      </div>

      {/* Treatment Plan */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
          Treatment Plan
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Short-term Goals <span className="text-red-500">*</span>
            </label>
            <textarea
              value={(data as any).shortTermGoals || ''}
              onChange={(e) => updateField('shortTermGoals', e.target.value)}
              placeholder="e.g., 1. Reduce pain levels from 7/10 to 4/10 within 2 weeks. 2. Improve lumbar flexion ROM by 15 degrees. 3. Increase sitting tolerance to 30 minutes without significant pain exacerbation."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Long-term Goals <span className="text-red-500">*</span>
            </label>
            <textarea
              value={(data as any).longTermGoals || ''}
              onChange={(e) => updateField('longTermGoals', e.target.value)}
              placeholder="e.g., 1. Return to work activities with minimal to no pain within 8-12 weeks. 2. Achieve full functional mobility for activities of daily living. 3. Establish independent home exercise program for long-term management. 4. Prevent re-injury through proper body mechanics education."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Treatment Interventions <span className="text-red-500">*</span>
            </label>
            <textarea
              value={(data as any).treatmentInterventions || ''}
              onChange={(e) => updateField('treatmentInterventions', e.target.value)}
              placeholder="e.g., Manual therapy techniques including joint mobilization L4-L5, soft tissue mobilization to lumbar paraspinals, therapeutic exercises focusing on core strengthening and lumbar stabilization, postural education, ergonomic training, modalities as appropriate (heat/cold therapy), progressive activity program..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              required
            />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations & Follow-up</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Frequency of Treatment
              </label>
              <select
                value={(data as any).treatmentFrequency || ''}
                onChange={(e) => updateField('treatmentFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select...</option>
                <option value="daily">Daily</option>
                <option value="3x-week">3x per week</option>
                <option value="2x-week">2x per week</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="as-needed">As needed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Expected Duration
              </label>
              <input
                type="text"
                value={(data as any).expectedDuration || ''}
                onChange={(e) => updateField('expectedDuration', e.target.value)}
                placeholder="e.g., 6-8 weeks, 3 months"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Home Exercise Program
            </label>
            <textarea
              value={(data as any).homeExerciseProgram || ''}
              onChange={(e) => updateField('homeExerciseProgram', e.target.value)}
              placeholder="Describe home exercises or self-management strategies"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Precautions & Contraindications
            </label>
            <textarea
              value={(data as any).precautions || ''}
              onChange={(e) => updateField('precautions', e.target.value)}
              placeholder="List any precautions, contraindications, or safety considerations"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Referrals & Additional Services
            </label>
            <textarea
              value={(data as any).referrals || ''}
              onChange={(e) => updateField('referrals', e.target.value)}
              placeholder="Any referrals to other providers or services needed"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
            />
          </div>
        </div>
      </div>

      {/* Provider Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Provider Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={(data as any).providerName || ''}
              onChange={(e) => updateField('providerName', e.target.value)}
              placeholder="Full name of treating provider"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Provider Title/Credentials <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={(data as any).providerCredentials || ''}
              onChange={(e) => updateField('providerCredentials', e.target.value)}
              placeholder="e.g., PT, DPT, OTR/L, MD"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date of Assessment <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={(data as any).assessmentDate || ''}
              onChange={(e) => updateField('assessmentDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              License Number
            </label>
            <input
              type="text"
              value={(data as any).licenseNumber || ''}
              onChange={(e) => updateField('licenseNumber', e.target.value)}
              placeholder="Provider license number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
