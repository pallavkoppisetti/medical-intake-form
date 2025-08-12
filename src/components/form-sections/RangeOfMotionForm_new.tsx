import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormInput } from '../ui/FormInput';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RotateCcw, Ruler } from 'lucide-react';

export function RangeOfMotionForm() {
  const { getCurrentStepData, updateSection } = useMultiStepForm();
  const romData = getCurrentStepData();

  // Helper function to handle single joint measurements
  const handleSingleJointChange = (section: string, field: string, value: string) => {
    const currentSection = romData?.[section] || {};
    const updatedSection = { ...currentSection, [field]: parseInt(value) || 0 };
    updateSection('rangeOfMotion', { ...romData, [section]: updatedSection });
  };

  // Helper function to handle bilateral joint measurements
  const handleBilateralChange = (section: string, side: 'left' | 'right', field: string, value: string) => {
    const currentSection = romData?.[section] || {};
    const currentSide = currentSection[side] || {};
    const updatedSide = { ...currentSide, [field]: parseInt(value) || 0 };
    const updatedSection = { ...currentSection, [side]: updatedSide };
    updateSection('rangeOfMotion', { ...romData, [section]: updatedSection });
  };

  // Helper function to handle effort on exam
  const handleEffortChange = (value: string) => {
    updateSection('rangeOfMotion', { ...romData, effortOnExam: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <RotateCcw className="w-6 h-6 text-blue-600" />
          RANGE OF MOTION MEASUREMENTS
        </h2>
        <p className="text-sm text-gray-600 mt-2">All measurements in degrees - Normal ranges shown in parentheses</p>
      </div>

      {/* Effort on Exam */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-green-500" />
            Effort on Examination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            {['Good', 'Fair', 'Poor'].map((effort) => (
              <label key={effort} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="effort"
                  value={effort}
                  checked={romData?.effortOnExam === effort}
                  onChange={(e) => handleEffortChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">{effort}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cervical Spine */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">CERVICAL SPINE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormInput
              label="Forward Flexion (0-60°)"
              type="number"
              min="0"
              max="90"
              value={romData?.cervicalSpine?.forwardFlexion?.toString() || ''}
              onChange={(value) => handleSingleJointChange('cervicalSpine', 'forwardFlexion', value)}
              placeholder="60"
            />
            <FormInput
              label="Extension (0-60°)"
              type="number"
              min="0"
              max="90"
              value={romData?.cervicalSpine?.extension?.toString() || ''}
              onChange={(value) => handleSingleJointChange('cervicalSpine', 'extension', value)}
              placeholder="60"
            />
            <FormInput
              label="Lateral Flexion R (0-45°)"
              type="number"
              min="0"
              max="60"
              value={romData?.cervicalSpine?.lateralFlexionRight?.toString() || ''}
              onChange={(value) => handleSingleJointChange('cervicalSpine', 'lateralFlexionRight', value)}
              placeholder="45"
            />
            <FormInput
              label="Lateral Flexion L (0-45°)"
              type="number"
              min="0"
              max="60"
              value={romData?.cervicalSpine?.lateralFlexionLeft?.toString() || ''}
              onChange={(value) => handleSingleJointChange('cervicalSpine', 'lateralFlexionLeft', value)}
              placeholder="45"
            />
            <FormInput
              label="Rotation R (0-80°)"
              type="number"
              min="0"
              max="90"
              value={romData?.cervicalSpine?.rotationRight?.toString() || ''}
              onChange={(value) => handleSingleJointChange('cervicalSpine', 'rotationRight', value)}
              placeholder="80"
            />
            <FormInput
              label="Rotation L (0-80°)"
              type="number"
              min="0"
              max="90"
              value={romData?.cervicalSpine?.rotationLeft?.toString() || ''}
              onChange={(value) => handleSingleJointChange('cervicalSpine', 'rotationLeft', value)}
              placeholder="80"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lumbar Spine */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">LUMBAR SPINE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormInput
              label="Forward Flexion (0-90°)"
              type="number"
              min="0"
              max="120"
              value={romData?.lumbarSpine?.forwardFlexion?.toString() || ''}
              onChange={(value) => handleSingleJointChange('lumbarSpine', 'forwardFlexion', value)}
              placeholder="90"
            />
            <FormInput
              label="Extension (0-25°)"
              type="number"
              min="0"
              max="40"
              value={romData?.lumbarSpine?.extension?.toString() || ''}
              onChange={(value) => handleSingleJointChange('lumbarSpine', 'extension', value)}
              placeholder="25"
            />
            <FormInput
              label="Lateral Flexion R (0-25°)"
              type="number"
              min="0"
              max="40"
              value={romData?.lumbarSpine?.lateralFlexionRight?.toString() || ''}
              onChange={(value) => handleSingleJointChange('lumbarSpine', 'lateralFlexionRight', value)}
              placeholder="25"
            />
            <FormInput
              label="Lateral Flexion L (0-25°)"
              type="number"
              min="0"
              max="40"
              value={romData?.lumbarSpine?.lateralFlexionLeft?.toString() || ''}
              onChange={(value) => handleSingleJointChange('lumbarSpine', 'lateralFlexionLeft', value)}
              placeholder="25"
            />
          </div>
        </CardContent>
      </Card>

      {/* Shoulders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">SHOULDERS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Left Shoulder */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Left Shoulder</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormInput
                  label="Flexion (0-180°)"
                  type="number"
                  min="0"
                  max="200"
                  value={romData?.shoulders?.left?.flexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'left', 'flexion', value)}
                  placeholder="180"
                />
                <FormInput
                  label="Extension (0-60°)"
                  type="number"
                  min="0"
                  max="80"
                  value={romData?.shoulders?.left?.extension?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'left', 'extension', value)}
                  placeholder="60"
                />
                <FormInput
                  label="Abduction (0-180°)"
                  type="number"
                  min="0"
                  max="200"
                  value={romData?.shoulders?.left?.abduction?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'left', 'abduction', value)}
                  placeholder="180"
                />
                <FormInput
                  label="Adduction (0-50°)"
                  type="number"
                  min="0"
                  max="70"
                  value={romData?.shoulders?.left?.adduction?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'left', 'adduction', value)}
                  placeholder="50"
                />
                <FormInput
                  label="Internal Rotation (0-90°)"
                  type="number"
                  min="0"
                  max="110"
                  value={romData?.shoulders?.left?.internalRotation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'left', 'internalRotation', value)}
                  placeholder="90"
                />
                <FormInput
                  label="External Rotation (0-90°)"
                  type="number"
                  min="0"
                  max="110"
                  value={romData?.shoulders?.left?.externalRotation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'left', 'externalRotation', value)}
                  placeholder="90"
                />
              </div>
            </div>

            {/* Right Shoulder */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Right Shoulder</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormInput
                  label="Flexion (0-180°)"
                  type="number"
                  min="0"
                  max="200"
                  value={romData?.shoulders?.right?.flexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'right', 'flexion', value)}
                  placeholder="180"
                />
                <FormInput
                  label="Extension (0-60°)"
                  type="number"
                  min="0"
                  max="80"
                  value={romData?.shoulders?.right?.extension?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'right', 'extension', value)}
                  placeholder="60"
                />
                <FormInput
                  label="Abduction (0-180°)"
                  type="number"
                  min="0"
                  max="200"
                  value={romData?.shoulders?.right?.abduction?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'right', 'abduction', value)}
                  placeholder="180"
                />
                <FormInput
                  label="Adduction (0-50°)"
                  type="number"
                  min="0"
                  max="70"
                  value={romData?.shoulders?.right?.adduction?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'right', 'adduction', value)}
                  placeholder="50"
                />
                <FormInput
                  label="Internal Rotation (0-90°)"
                  type="number"
                  min="0"
                  max="110"
                  value={romData?.shoulders?.right?.internalRotation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'right', 'internalRotation', value)}
                  placeholder="90"
                />
                <FormInput
                  label="External Rotation (0-90°)"
                  type="number"
                  min="0"
                  max="110"
                  value={romData?.shoulders?.right?.externalRotation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('shoulders', 'right', 'externalRotation', value)}
                  placeholder="90"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elbows */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">ELBOWS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Left Elbow */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Left Elbow</h4>
              <div className="grid grid-cols-3 gap-4">
                <FormInput
                  label="Flexion (0-150°)"
                  type="number"
                  min="0"
                  max="160"
                  value={romData?.elbows?.left?.flexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('elbows', 'left', 'flexion', value)}
                  placeholder="150"
                />
                <FormInput
                  label="Pronation (0-80°)"
                  type="number"
                  min="0"
                  max="90"
                  value={romData?.elbows?.left?.pronation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('elbows', 'left', 'pronation', value)}
                  placeholder="80"
                />
                <FormInput
                  label="Supination (0-80°)"
                  type="number"
                  min="0"
                  max="90"
                  value={romData?.elbows?.left?.supination?.toString() || ''}
                  onChange={(value) => handleBilateralChange('elbows', 'left', 'supination', value)}
                  placeholder="80"
                />
              </div>
            </div>

            {/* Right Elbow */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Right Elbow</h4>
              <div className="grid grid-cols-3 gap-4">
                <FormInput
                  label="Flexion (0-150°)"
                  type="number"
                  min="0"
                  max="160"
                  value={romData?.elbows?.right?.flexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('elbows', 'right', 'flexion', value)}
                  placeholder="150"
                />
                <FormInput
                  label="Pronation (0-80°)"
                  type="number"
                  min="0"
                  max="90"
                  value={romData?.elbows?.right?.pronation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('elbows', 'right', 'pronation', value)}
                  placeholder="80"
                />
                <FormInput
                  label="Supination (0-80°)"
                  type="number"
                  min="0"
                  max="90"
                  value={romData?.elbows?.right?.supination?.toString() || ''}
                  onChange={(value) => handleBilateralChange('elbows', 'right', 'supination', value)}
                  placeholder="80"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wrists */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">WRISTS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Left Wrist */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Left Wrist</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormInput
                  label="Flexion (0-80°)"
                  type="number"
                  min="0"
                  max="90"
                  value={romData?.wrists?.left?.flexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('wrists', 'left', 'flexion', value)}
                  placeholder="80"
                />
                <FormInput
                  label="Extension (0-70°)"
                  type="number"
                  min="0"
                  max="80"
                  value={romData?.wrists?.left?.extension?.toString() || ''}
                  onChange={(value) => handleBilateralChange('wrists', 'left', 'extension', value)}
                  placeholder="70"
                />
                <FormInput
                  label="Ulnar Deviation (0-30°)"
                  type="number"
                  min="0"
                  max="40"
                  value={romData?.wrists?.left?.ulnarDeviation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('wrists', 'left', 'ulnarDeviation', value)}
                  placeholder="30"
                />
                <FormInput
                  label="Radial Deviation (0-20°)"
                  type="number"
                  min="0"
                  max="30"
                  value={romData?.wrists?.left?.radialDeviation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('wrists', 'left', 'radialDeviation', value)}
                  placeholder="20"
                />
              </div>
            </div>

            {/* Right Wrist */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Right Wrist</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormInput
                  label="Flexion (0-80°)"
                  type="number"
                  min="0"
                  max="90"
                  value={romData?.wrists?.right?.flexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('wrists', 'right', 'flexion', value)}
                  placeholder="80"
                />
                <FormInput
                  label="Extension (0-70°)"
                  type="number"
                  min="0"
                  max="80"
                  value={romData?.wrists?.right?.extension?.toString() || ''}
                  onChange={(value) => handleBilateralChange('wrists', 'right', 'extension', value)}
                  placeholder="70"
                />
                <FormInput
                  label="Ulnar Deviation (0-30°)"
                  type="number"
                  min="0"
                  max="40"
                  value={romData?.wrists?.right?.ulnarDeviation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('wrists', 'right', 'ulnarDeviation', value)}
                  placeholder="30"
                />
                <FormInput
                  label="Radial Deviation (0-20°)"
                  type="number"
                  min="0"
                  max="30"
                  value={romData?.wrists?.right?.radialDeviation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('wrists', 'right', 'radialDeviation', value)}
                  placeholder="20"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">HANDS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Left Hand */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Left Hand</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Finger Flexion (0-90°)"
                  type="number"
                  min="0"
                  max="100"
                  value={romData?.hands?.left?.fingerFlexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hands', 'left', 'fingerFlexion', value)}
                  placeholder="90"
                />
                <FormInput
                  label="Thumb Opposition (0-100°)"
                  type="number"
                  min="0"
                  max="100"
                  value={romData?.hands?.left?.thumbOpposition?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hands', 'left', 'thumbOpposition', value)}
                  placeholder="100"
                />
              </div>
            </div>

            {/* Right Hand */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Right Hand</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Finger Flexion (0-90°)"
                  type="number"
                  min="0"
                  max="100"
                  value={romData?.hands?.right?.fingerFlexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hands', 'right', 'fingerFlexion', value)}
                  placeholder="90"
                />
                <FormInput
                  label="Thumb Opposition (0-100°)"
                  type="number"
                  min="0"
                  max="100"
                  value={romData?.hands?.right?.thumbOpposition?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hands', 'right', 'thumbOpposition', value)}
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">HIPS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Left Hip */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Left Hip</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormInput
                  label="Flexion (0-120°)"
                  type="number"
                  min="0"
                  max="140"
                  value={romData?.hips?.left?.flexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'left', 'flexion', value)}
                  placeholder="120"
                />
                <FormInput
                  label="Extension (0-30°)"
                  type="number"
                  min="0"
                  max="40"
                  value={romData?.hips?.left?.extension?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'left', 'extension', value)}
                  placeholder="30"
                />
                <FormInput
                  label="Abduction (0-45°)"
                  type="number"
                  min="0"
                  max="60"
                  value={romData?.hips?.left?.abduction?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'left', 'abduction', value)}
                  placeholder="45"
                />
                <FormInput
                  label="Adduction (0-30°)"
                  type="number"
                  min="0"
                  max="40"
                  value={romData?.hips?.left?.adduction?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'left', 'adduction', value)}
                  placeholder="30"
                />
                <FormInput
                  label="Internal Rotation (0-45°)"
                  type="number"
                  min="0"
                  max="60"
                  value={romData?.hips?.left?.internalRotation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'left', 'internalRotation', value)}
                  placeholder="45"
                />
                <FormInput
                  label="External Rotation (0-45°)"
                  type="number"
                  min="0"
                  max="60"
                  value={romData?.hips?.left?.externalRotation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'left', 'externalRotation', value)}
                  placeholder="45"
                />
              </div>
            </div>

            {/* Right Hip */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Right Hip</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormInput
                  label="Flexion (0-120°)"
                  type="number"
                  min="0"
                  max="140"
                  value={romData?.hips?.right?.flexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'right', 'flexion', value)}
                  placeholder="120"
                />
                <FormInput
                  label="Extension (0-30°)"
                  type="number"
                  min="0"
                  max="40"
                  value={romData?.hips?.right?.extension?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'right', 'extension', value)}
                  placeholder="30"
                />
                <FormInput
                  label="Abduction (0-45°)"
                  type="number"
                  min="0"
                  max="60"
                  value={romData?.hips?.right?.abduction?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'right', 'abduction', value)}
                  placeholder="45"
                />
                <FormInput
                  label="Adduction (0-30°)"
                  type="number"
                  min="0"
                  max="40"
                  value={romData?.hips?.right?.adduction?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'right', 'adduction', value)}
                  placeholder="30"
                />
                <FormInput
                  label="Internal Rotation (0-45°)"
                  type="number"
                  min="0"
                  max="60"
                  value={romData?.hips?.right?.internalRotation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'right', 'internalRotation', value)}
                  placeholder="45"
                />
                <FormInput
                  label="External Rotation (0-45°)"
                  type="number"
                  min="0"
                  max="60"
                  value={romData?.hips?.right?.externalRotation?.toString() || ''}
                  onChange={(value) => handleBilateralChange('hips', 'right', 'externalRotation', value)}
                  placeholder="45"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knees */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">KNEES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Left Knee */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Left Knee</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Flexion (0-135°)"
                  type="number"
                  min="0"
                  max="150"
                  value={romData?.knees?.left?.flexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('knees', 'left', 'flexion', value)}
                  placeholder="135"
                />
                <FormInput
                  label="Extension (0°)"
                  type="number"
                  min="0"
                  max="10"
                  value={romData?.knees?.left?.extension?.toString() || ''}
                  onChange={(value) => handleBilateralChange('knees', 'left', 'extension', value)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Right Knee */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Right Knee</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Flexion (0-135°)"
                  type="number"
                  min="0"
                  max="150"
                  value={romData?.knees?.right?.flexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('knees', 'right', 'flexion', value)}
                  placeholder="135"
                />
                <FormInput
                  label="Extension (0°)"
                  type="number"
                  min="0"
                  max="10"
                  value={romData?.knees?.right?.extension?.toString() || ''}
                  onChange={(value) => handleBilateralChange('knees', 'right', 'extension', value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ankles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">ANKLES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Left Ankle */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Left Ankle</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormInput
                  label="Dorsiflexion (0-20°)"
                  type="number"
                  min="0"
                  max="30"
                  value={romData?.ankles?.left?.dorsiflexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('ankles', 'left', 'dorsiflexion', value)}
                  placeholder="20"
                />
                <FormInput
                  label="Plantarflexion (0-50°)"
                  type="number"
                  min="0"
                  max="60"
                  value={romData?.ankles?.left?.plantarflexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('ankles', 'left', 'plantarflexion', value)}
                  placeholder="50"
                />
                <FormInput
                  label="Inversion (0-35°)"
                  type="number"
                  min="0"
                  max="45"
                  value={romData?.ankles?.left?.inversion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('ankles', 'left', 'inversion', value)}
                  placeholder="35"
                />
                <FormInput
                  label="Eversion (0-15°)"
                  type="number"
                  min="0"
                  max="25"
                  value={romData?.ankles?.left?.eversion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('ankles', 'left', 'eversion', value)}
                  placeholder="15"
                />
              </div>
            </div>

            {/* Right Ankle */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Right Ankle</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormInput
                  label="Dorsiflexion (0-20°)"
                  type="number"
                  min="0"
                  max="30"
                  value={romData?.ankles?.right?.dorsiflexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('ankles', 'right', 'dorsiflexion', value)}
                  placeholder="20"
                />
                <FormInput
                  label="Plantarflexion (0-50°)"
                  type="number"
                  min="0"
                  max="60"
                  value={romData?.ankles?.right?.plantarflexion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('ankles', 'right', 'plantarflexion', value)}
                  placeholder="50"
                />
                <FormInput
                  label="Inversion (0-35°)"
                  type="number"
                  min="0"
                  max="45"
                  value={romData?.ankles?.right?.inversion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('ankles', 'right', 'inversion', value)}
                  placeholder="35"
                />
                <FormInput
                  label="Eversion (0-15°)"
                  type="number"
                  min="0"
                  max="25"
                  value={romData?.ankles?.right?.eversion?.toString() || ''}
                  onChange={(value) => handleBilateralChange('ankles', 'right', 'eversion', value)}
                  placeholder="15"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
