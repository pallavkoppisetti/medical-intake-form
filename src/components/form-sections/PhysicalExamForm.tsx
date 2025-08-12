import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormInput } from '../ui/FormInput';
import { FormTextarea } from '../ui/FormTextarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Stethoscope, Eye, Activity } from 'lucide-react';

export function PhysicalExamForm() {
  const { getCurrentStepData, updateSection } = useMultiStepForm();
  const physicalExamData = getCurrentStepData();

  const handleVitalSignChange = (field: string, value: string | number) => {
    const vitalSigns = physicalExamData?.vitalSigns || {};
    const updatedVitalSigns = { ...vitalSigns, [field]: value };
    updateSection('physicalExam', { ...physicalExamData, vitalSigns: updatedVitalSigns });
  };

  const handleSystemChange = (system: string, value: string) => {
    updateSection('physicalExam', { ...physicalExamData, [system]: value });
  };

  const handleBPChange = (type: 'systolic' | 'diastolic', value: string) => {
    const vitalSigns = physicalExamData?.vitalSigns || {};
    const bloodPressure = vitalSigns.bloodPressure || {};
    const updatedBP = { ...bloodPressure, [type]: parseInt(value) || 0 };
    const updatedVitalSigns = { ...vitalSigns, bloodPressure: updatedBP };
    updateSection('physicalExam', { ...physicalExamData, vitalSigns: updatedVitalSigns });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Stethoscope className="w-6 h-6 text-blue-600" />
          PHYSICAL EXAMINATION
        </h2>
      </div>

      {/* Vital Signs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Blood Pressure */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Blood Pressure</label>
              <div className="flex items-center gap-2">
                <FormInput
                  label=""
                  value={physicalExamData?.vitalSigns?.bloodPressure?.systolic || ''}
                  onChange={(value) => handleBPChange('systolic', value)}
                  placeholder="120"
                  type="number"
                  className="w-20"
                />
                <span className="text-gray-500">/</span>
                <FormInput
                  label=""
                  value={physicalExamData?.vitalSigns?.bloodPressure?.diastolic || ''}
                  onChange={(value) => handleBPChange('diastolic', value)}
                  placeholder="80"
                  type="number"
                  className="w-20"
                />
                <span className="text-sm text-gray-500">mmHg</span>
              </div>
            </div>

            {/* Weight */}
            <FormInput
              label="Weight"
              value={physicalExamData?.vitalSigns?.weight || ''}
              onChange={(value) => handleVitalSignChange('weight', parseFloat(value) || 0)}
              placeholder="150 lbs"
              type="number"
            />

            {/* Heart Rate */}
            <FormInput
              label="Heart Rate"
              value={physicalExamData?.vitalSigns?.heartRate || ''}
              onChange={(value) => handleVitalSignChange('heartRate', parseInt(value) || 0)}
              placeholder="72 bpm"
              type="number"
            />

            {/* O2 Saturation */}
            <FormInput
              label="O2 Saturation"
              value={physicalExamData?.vitalSigns?.oxygenSaturation || ''}
              onChange={(value) => handleVitalSignChange('oxygenSaturation', value)}
              placeholder="98%"
            />

            {/* Height */}
            <FormInput
              label="Height"
              value={physicalExamData?.vitalSigns?.height || ''}
              onChange={(value) => handleVitalSignChange('height', parseFloat(value) || 0)}
              placeholder="68 inches"
            />

            {/* Temperature */}
            <FormInput
              label="Temperature"
              value={physicalExamData?.vitalSigns?.temperature || ''}
              onChange={(value) => handleVitalSignChange('temperature', parseFloat(value) || 0)}
              placeholder="98.6°F"
              type="number"
            />
          </div>

          {/* Visual Acuity */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Visual Acuity</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600">Right Eye</label>
                <div className="grid grid-cols-2 gap-2">
                  <FormInput
                    label=""
                    value={physicalExamData?.vitalSigns?.visualAcuity?.right?.uncorrected || ''}
                    onChange={(value) => {
                      const visualAcuity = physicalExamData?.vitalSigns?.visualAcuity || {};
                      const right = visualAcuity.right || {};
                      handleVitalSignChange('visualAcuity', {
                        ...visualAcuity,
                        right: { ...right, uncorrected: value }
                      });
                    }}
                    placeholder="20/20 uncorrected"
                  />
                  <FormInput
                    label=""
                    value={physicalExamData?.vitalSigns?.visualAcuity?.right?.corrected || ''}
                    onChange={(value) => {
                      const visualAcuity = physicalExamData?.vitalSigns?.visualAcuity || {};
                      const right = visualAcuity.right || {};
                      handleVitalSignChange('visualAcuity', {
                        ...visualAcuity,
                        right: { ...right, corrected: value }
                      });
                    }}
                    placeholder="20/20 corrected"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600">Left Eye</label>
                <div className="grid grid-cols-2 gap-2">
                  <FormInput
                    label=""
                    value={physicalExamData?.vitalSigns?.visualAcuity?.left?.uncorrected || ''}
                    onChange={(value) => {
                      const visualAcuity = physicalExamData?.vitalSigns?.visualAcuity || {};
                      const left = visualAcuity.left || {};
                      handleVitalSignChange('visualAcuity', {
                        ...visualAcuity,
                        left: { ...left, uncorrected: value }
                      });
                    }}
                    placeholder="20/20 uncorrected"
                  />
                  <FormInput
                    label=""
                    value={physicalExamData?.vitalSigns?.visualAcuity?.left?.corrected || ''}
                    onChange={(value) => {
                      const visualAcuity = physicalExamData?.vitalSigns?.visualAcuity || {};
                      const left = visualAcuity.left || {};
                      handleVitalSignChange('visualAcuity', {
                        ...visualAcuity,
                        left: { ...left, corrected: value }
                      });
                    }}
                    placeholder="20/20 corrected"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamometer Hand Grip Strength */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Dynamometer Hand Grip Strength</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Right Hand (lbs)"
                value={physicalExamData?.vitalSigns?.handGripStrength?.right || ''}
                onChange={(value) => {
                  const handGripStrength = physicalExamData?.vitalSigns?.handGripStrength || {};
                  handleVitalSignChange('handGripStrength', {
                    ...handGripStrength,
                    right: value
                  });
                }}
                placeholder="45 lbs"
                type="number"
              />
              <FormInput
                label="Left Hand (lbs)"
                value={physicalExamData?.vitalSigns?.handGripStrength?.left || ''}
                onChange={(value) => {
                  const handGripStrength = physicalExamData?.vitalSigns?.handGripStrength || {};
                  handleVitalSignChange('handGripStrength', {
                    ...handGripStrength,
                    left: value
                  });
                }}
                placeholder="43 lbs"
                type="number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Body Systems Examination */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Physical Examination by Body Systems
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General */}
          <FormTextarea
            label="General"
            value={physicalExamData?.general || ''}
            onChange={(value) => handleSystemChange('general', value)}
            placeholder="Well-developed, well-nourished individual in no acute distress. Alert and oriented x3. Cooperative with examination."
            rows={3}
          />

          {/* Eyes */}
          <FormTextarea
            label="Eyes"
            value={physicalExamData?.eyes || ''}
            onChange={(value) => handleSystemChange('eyes', value)}
            placeholder="Pupils equal, round, reactive to light and accommodation. Extraocular movements intact. No nystagmus. Fundoscopic examination shows sharp disc margins bilaterally."
            rows={3}
          />

          {/* Ears/Nose/Throat */}
          <FormTextarea
            label="Ears/Nose/Throat"
            value={physicalExamData?.earsNoseThroat || ''}
            onChange={(value) => handleSystemChange('earsNoseThroat', value)}
            placeholder="External auditory canals clear. Tympanic membranes intact bilaterally. Nasal passages patent. Throat without erythema or exudate."
            rows={3}
          />

          {/* Head/Neck */}
          <FormTextarea
            label="Head/Neck"
            value={physicalExamData?.headNeck || ''}
            onChange={(value) => handleSystemChange('headNeck', value)}
            placeholder="Head normocephalic, atraumatic. Neck supple, full range of motion. No lymphadenopathy, thyromegaly, or masses palpated."
            rows={3}
          />

          {/* Respiratory */}
          <FormTextarea
            label="Respiratory"
            value={physicalExamData?.respiratory || ''}
            onChange={(value) => handleSystemChange('respiratory', value)}
            placeholder="Chest wall symmetrical, no retractions. Lungs clear to auscultation bilaterally. No wheezes, rales, or rhonchi. Good air movement throughout."
            rows={3}
          />

          {/* Cardiovascular */}
          <FormTextarea
            label="Cardiovascular"
            value={physicalExamData?.cardiovascular || ''}
            onChange={(value) => handleSystemChange('cardiovascular', value)}
            placeholder="Regular rate and rhythm. S1 and S2 normal. No murmurs, gallops, or rubs. Peripheral pulses palpable and equal bilaterally. No edema."
            rows={3}
          />

          {/* Abdomen */}
          <FormTextarea
            label="Abdomen"
            value={physicalExamData?.abdomen || ''}
            onChange={(value) => handleSystemChange('abdomen', value)}
            placeholder="Soft, non-tender, non-distended. Bowel sounds present in all quadrants. No masses, organomegaly, or hernias palpated."
            rows={3}
          />

          {/* Back */}
          <FormTextarea
            label="Back"
            value={physicalExamData?.back || ''}
            onChange={(value) => handleSystemChange('back', value)}
            placeholder="Spine alignment normal. No tenderness over spinous processes. Paraspinal muscles non-tender. No deformities or masses noted."
            rows={3}
          />

          {/* Skin */}
          <FormTextarea
            label="Skin"
            value={physicalExamData?.skin || ''}
            onChange={(value) => handleSystemChange('skin', value)}
            placeholder="Warm, dry, intact. No rashes, lesions, or ulcerations. Normal color and texture. No signs of infection or breakdown."
            rows={3}
          />

          {/* Musculoskeletal */}
          <FormTextarea
            label="Musculoskeletal"
            value={physicalExamData?.musculoskeletal || ''}
            onChange={(value) => handleSystemChange('musculoskeletal', value)}
            placeholder="Normal muscle bulk and tone. No joint swelling, deformity, or tenderness. Full range of motion of all major joints. Normal gait and station."
            rows={4}
          />

          {/* Neurological */}
          <FormTextarea
            label="Neurological"
            value={physicalExamData?.neurological || ''}
            onChange={(value) => handleSystemChange('neurological', value)}
            placeholder="Alert and oriented x3. Cranial nerves II-XII grossly intact. Motor strength 5/5 throughout. Sensation intact to light touch. Deep tendon reflexes 2+ and symmetric. Coordination intact."
            rows={4}
          />

          {/* Psychiatry */}
          <FormTextarea
            label="Psychiatry"
            value={physicalExamData?.psychiatry || ''}
            onChange={(value) => handleSystemChange('psychiatry', value)}
            placeholder="Appropriate mood and affect. Thought processes logical and goal-directed. No evidence of delusions or hallucinations. Insight and judgment intact."
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
