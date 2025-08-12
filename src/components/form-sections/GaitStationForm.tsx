import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormTextarea } from '../ui/FormTextarea';
import { FormSelect } from '../ui/FormSelect';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity, Users, CheckCircle } from 'lucide-react';

export function GaitStationForm() {
  const { getCurrentStepData, updateSection } = useMultiStepForm();
  const gaitData = getCurrentStepData();

  const handlePerformanceTestChange = (test: string, value: string) => {
    const performanceTests = gaitData?.performanceTests || {};
    const updatedTests = { ...performanceTests, [test]: value };
    updateSection('gaitStation', { ...gaitData, performanceTests: updatedTests });
  };

  const handleAssistiveDeviceChange = (field: string, value: any) => {
    const assistiveDevice = gaitData?.assistiveDevice || {};
    const updatedDevice = { ...assistiveDevice, [field]: value };
    updateSection('gaitStation', { ...gaitData, assistiveDevice: updatedDevice });
  };

  const handleUsageContextChange = (context: string, checked: boolean) => {
    const assistiveDevice = gaitData?.assistiveDevice || {};
    const currentContexts = assistiveDevice.usageContext || [];
    let updatedContexts;
    
    if (checked) {
      updatedContexts = [...currentContexts, context];
    } else {
      updatedContexts = currentContexts.filter((c: string) => c !== context);
    }
    
    handleAssistiveDeviceChange('usageContext', updatedContexts);
  };

  const performanceTests = [
    'gettingOnOffTable',
    'walkingOnHeels',
    'walkingOnToes',
    'squattingAndRising',
    'fingerToNose'
  ];

  const performanceTestLabels = {
    gettingOnOffTable: 'Getting on and off examination table',
    walkingOnHeels: 'Walking on Heels',
    walkingOnToes: 'Walking on Toes',
    squattingAndRising: 'Squatting and rising',
    fingerToNose: 'Finger to Nose'
  };

  const assistiveDeviceOptions = [
    { value: '', label: 'None' },
    { value: 'cane', label: 'Cane' },
    { value: 'walker', label: 'Walker' },
    { value: 'crutches', label: 'Crutches' },
    { value: 'wheelchair', label: 'Wheelchair' },
    { value: 'rollator', label: 'Rollator/Rolling Walker' },
    { value: 'quad-cane', label: 'Quad Cane' },
    { value: 'forearm-crutches', label: 'Forearm Crutches' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Activity className="w-6 h-6 text-green-600" />
          GAIT AND STATION ASSESSMENT
        </h2>
        <p className="text-sm text-gray-600 mt-2">Functional mobility and balance testing</p>
      </div>

      {/* Performance Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            Performance Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {performanceTests.map((test) => (
            <div key={test} className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">
                {performanceTestLabels[test as keyof typeof performanceTestLabels]}
              </h4>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={test}
                    value="able"
                    checked={gaitData?.performanceTests?.[test] === 'able'}
                    onChange={(e) => handlePerformanceTestChange(test, e.target.value)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Able to perform</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={test}
                    value="unable"
                    checked={gaitData?.performanceTests?.[test] === 'unable'}
                    onChange={(e) => handlePerformanceTestChange(test, e.target.value)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Unable to perform</span>
                </label>
              </div>
            </div>
          ))}

          {/* Straight Leg Raise Test */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700">
              Straight Leg Raise Test
            </h4>
            <div className="flex gap-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="straightLegRaise"
                  value="positive"
                  checked={gaitData?.performanceTests?.straightLegRaise === 'positive'}
                  onChange={(e) => handlePerformanceTestChange('straightLegRaise', e.target.value)}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Positive</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="straightLegRaise"
                  value="negative"
                  checked={gaitData?.performanceTests?.straightLegRaise === 'negative'}
                  onChange={(e) => handlePerformanceTestChange('straightLegRaise', e.target.value)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Negative</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assistive Device Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Assistive Device Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gait and Station Assessment */}
          <FormTextarea
            label="Gait and Station Assessment"
            value={gaitData?.assistiveDevice?.gaitAssessment || ''}
            onChange={(value) => handleAssistiveDeviceChange('gaitAssessment', value)}
            placeholder="Describe patient's gait pattern, balance, coordination, and overall station. Include observations about stride length, cadence, symmetry, and any abnormalities..."
            rows={4}
          />

          {/* Type of Assistive Device */}
          <FormSelect
            label="Type of Assistive Device"
            value={gaitData?.assistiveDevice?.deviceType || ''}
            onChange={(value) => handleAssistiveDeviceChange('deviceType', value)}
            options={assistiveDeviceOptions}
          />

          {/* Medical Conditions */}
          <FormTextarea
            label="Medical Conditions Assistive Device is Used For"
            value={gaitData?.assistiveDevice?.medicalConditions || ''}
            onChange={(value) => handleAssistiveDeviceChange('medicalConditions', value)}
            placeholder="List the specific medical conditions or diagnoses that necessitate the use of this assistive device..."
            rows={3}
          />

          {/* Usage Context */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Usage Context
            </label>
            <div className="space-y-2">
              {['walking', 'standing', 'both'].map((context) => (
                <label key={context} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={gaitData?.assistiveDevice?.usageContext?.includes(context) || false}
                    onChange={(e) => handleUsageContextChange(context, e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">{context}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Medical Necessity */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Medical Necessity
            </label>
            <div className="flex gap-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="medicalNecessity"
                  value="yes"
                  checked={gaitData?.assistiveDevice?.medicalNecessity === 'yes'}
                  onChange={(e) => handleAssistiveDeviceChange('medicalNecessity', e.target.value)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="medicalNecessity"
                  value="no"
                  checked={gaitData?.assistiveDevice?.medicalNecessity === 'no'}
                  onChange={(e) => handleAssistiveDeviceChange('medicalNecessity', e.target.value)}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          {/* Circumstances of Use */}
          <FormTextarea
            label="Circumstances of Use"
            value={gaitData?.assistiveDevice?.circumstancesOfUse || ''}
            onChange={(value) => handleAssistiveDeviceChange('circumstancesOfUse', value)}
            placeholder="Describe the specific circumstances, environments, or activities where the assistive device is used. Include frequency, duration, and situations..."
            rows={4}
          />

          {/* Patient Cooperation */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Patient Cooperation During Testing
            </label>
            <div className="flex gap-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="patientCooperation"
                  value="yes"
                  checked={gaitData?.assistiveDevice?.patientCooperation === 'yes'}
                  onChange={(e) => handleAssistiveDeviceChange('patientCooperation', e.target.value)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Yes - Cooperative</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="patientCooperation"
                  value="no"
                  checked={gaitData?.assistiveDevice?.patientCooperation === 'no'}
                  onChange={(e) => handleAssistiveDeviceChange('patientCooperation', e.target.value)}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">No - Uncooperative</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardContent className="pt-6">
          <FormTextarea
            label="Additional Observations and Notes"
            value={gaitData?.additionalNotes || ''}
            onChange={(value) => updateSection('gaitStation', { ...gaitData, additionalNotes: value })}
            placeholder="Any additional observations about the patient's gait, station, balance, or functional mobility that were not captured above..."
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
