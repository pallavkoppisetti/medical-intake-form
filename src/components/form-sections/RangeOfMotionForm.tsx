import { useState } from 'react';
import { useMultiStepForm } from '../../contexts/MultiStepFormContext';
import { FormInput } from '../ui/FormInput';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChevronDown, ChevronRight, RotateCcw, Ruler } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      >
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

export function RangeOfMotionForm() {
  const { getCurrentStepData, updateSection } = useMultiStepForm();
  const romData = getCurrentStepData();

  const handleROMChange = (section: string, field: string, value: number) => {
    const currentSection = romData?.[section] || {};
    const updatedSection = { ...currentSection, [field]: value };
    updateSection('rangeOfMotion', { ...romData, [section]: updatedSection });
  };

  const handleBilateralChange = (section: string, side: 'left' | 'right', field: string, value: number) => {
    const currentSection = romData?.[section] || {};
    const currentSide = currentSection[side] || {};
    const updatedSide = { ...currentSide, [field]: value };
    const updatedSection = { ...currentSection, [side]: updatedSide };
    updateSection('rangeOfMotion', { ...romData, [section]: updatedSection });
  };

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

      <div className="space-y-4">
        {/* Cervical Spine */}
        <CollapsibleSection title="Cervical Spine" defaultOpen={true}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormInput
              label="Forward Flexion (0-60°)"
              type="number"
              min="0"
              max="90"
              value={romData?.cervicalSpine?.flexion || ''}
              onChange={(value) => handleROMChange('cervicalSpine', 'flexion', parseInt(value) || 0)}
              placeholder="45"
            />
            <FormInput
              label="Extension (0-60°)"
              type="number"
              min="0"
              max="90"
              value={romData?.cervicalSpine?.extension || ''}
              onChange={(value) => handleROMChange('cervicalSpine', 'extension', parseInt(value) || 0)}
              placeholder="50"
            />
            <FormInput
              label="Left Lateral Flexion (0-45°)"
              type="number"
              min="0"
              max="60"
              value={romData?.cervicalSpine?.leftLateralFlexion || ''}
              onChange={(value) => handleROMChange('cervicalSpine', 'leftLateralFlexion', parseInt(value) || 0)}
              placeholder="40"
            />
            <FormInput
              label="Right Lateral Flexion (0-45°)"
              type="number"
              min="0"
              max="60"
              value={romData?.cervicalSpine?.rightLateralFlexion || ''}
              onChange={(value) => handleROMChange('cervicalSpine', 'rightLateralFlexion', parseInt(value) || 0)}
              placeholder="40"
            />
            <FormInput
              label="Left Rotation (0-80°)"
              type="number"
              min="0"
              max="90"
              value={romData?.cervicalSpine?.leftRotation || ''}
              onChange={(value) => handleROMChange('cervicalSpine', 'leftRotation', parseInt(value) || 0)}
              placeholder="70"
            />
            <FormInput
              label="Right Rotation (0-80°)"
              type="number"
              min="0"
              max="90"
              value={romData?.cervicalSpine?.rightRotation || ''}
              onChange={(value) => handleROMChange('cervicalSpine', 'rightRotation', parseInt(value) || 0)}
              placeholder="70"
            />
          </div>
        </CollapsibleSection>

        {/* Lumbar Spine */}
        <CollapsibleSection title="Lumbar Spine">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormInput
              label="Forward Flexion (0-90°)"
              type="number"
              min="0"
              max="120"
              value={romData?.lumbarSpine?.flexion || ''}
              onChange={(value) => handleROMChange('lumbarSpine', 'flexion', parseInt(value) || 0)}
              placeholder="80"
            />
            <FormInput
              label="Extension (0-25°)"
              type="number"
              min="0"
              max="40"
              value={romData?.lumbarSpine?.extension || ''}
              onChange={(value) => handleROMChange('lumbarSpine', 'extension', parseInt(value) || 0)}
              placeholder="20"
            />
            <FormInput
              label="Left Lateral Flexion (0-25°)"
              type="number"
              min="0"
              max="40"
              value={romData?.lumbarSpine?.leftLateralFlexion || ''}
              onChange={(value) => handleROMChange('lumbarSpine', 'leftLateralFlexion', parseInt(value) || 0)}
              placeholder="20"
            />
            <FormInput
              label="Right Lateral Flexion (0-25°)"
              type="number"
              min="0"
              max="40"
              value={romData?.lumbarSpine?.rightLateralFlexion || ''}
              onChange={(value) => handleROMChange('lumbarSpine', 'rightLateralFlexion', parseInt(value) || 0)}
              placeholder="20"
            />
          </div>
        </CollapsibleSection>

        {/* Shoulders */}
        <CollapsibleSection title="Shoulders (Right/Left)">
          <div className="space-y-6">
            {['right', 'left'].map((side) => (
              <div key={side} className="space-y-4">
                <h5 className="text-md font-semibold text-gray-800 capitalize">{side} Shoulder</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Flexion (0-150°)"
                    type="number"
                    min="0"
                    max="180"
                    value={romData?.shoulders?.[side]?.flexion || ''}
                    onChange={(value) => handleBilateralChange('shoulders', side as 'left' | 'right', 'flexion', parseInt(value) || 0)}
                    placeholder="140"
                  />
                  <FormInput
                    label="Extension (0-50°)"
                    type="number"
                    min="0"
                    max="70"
                    value={romData?.shoulders?.[side]?.extension || ''}
                    onChange={(value) => handleBilateralChange('shoulders', side as 'left' | 'right', 'extension', parseInt(value) || 0)}
                    placeholder="45"
                  />
                  <FormInput
                    label="Abduction (0-150°)"
                    type="number"
                    min="0"
                    max="180"
                    value={romData?.shoulders?.[side]?.abduction || ''}
                    onChange={(value) => handleBilateralChange('shoulders', side as 'left' | 'right', 'abduction', parseInt(value) || 0)}
                    placeholder="140"
                  />
                  <FormInput
                    label="Adduction (0-30°)"
                    type="number"
                    min="0"
                    max="50"
                    value={romData?.shoulders?.[side]?.adduction || ''}
                    onChange={(value) => handleBilateralChange('shoulders', side as 'left' | 'right', 'adduction', parseInt(value) || 0)}
                    placeholder="25"
                  />
                  <FormInput
                    label="External Rotation (0-90°)"
                    type="number"
                    min="0"
                    max="110"
                    value={romData?.shoulders?.[side]?.externalRotation || ''}
                    onChange={(value) => handleBilateralChange('shoulders', side as 'left' | 'right', 'externalRotation', parseInt(value) || 0)}
                    placeholder="80"
                  />
                  <FormInput
                    label="Internal Rotation (0-90°)"
                    type="number"
                    min="0"
                    max="110"
                    value={romData?.shoulders?.[side]?.internalRotation || ''}
                    onChange={(value) => handleBilateralChange('shoulders', side as 'left' | 'right', 'internalRotation', parseInt(value) || 0)}
                    placeholder="80"
                  />
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Elbows */}
        <CollapsibleSection title="Elbows (Right/Left)">
          <div className="space-y-6">
            {['right', 'left'].map((side) => (
              <div key={side} className="space-y-4">
                <h5 className="text-md font-semibold text-gray-800 capitalize">{side} Elbow</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Flexion (0-150°)"
                    type="number"
                    min="0"
                    max="160"
                    value={romData?.elbows?.[side]?.flexion || ''}
                    onChange={(value) => handleBilateralChange('elbows', side as 'left' | 'right', 'flexion', parseInt(value) || 0)}
                    placeholder="140"
                  />
                  <FormInput
                    label="Pronation (0-80°)"
                    type="number"
                    min="0"
                    max="90"
                    value={romData?.elbows?.[side]?.pronation || ''}
                    onChange={(value) => handleBilateralChange('elbows', side as 'left' | 'right', 'pronation', parseInt(value) || 0)}
                    placeholder="75"
                  />
                  <FormInput
                    label="Supination (0-80°)"
                    type="number"
                    min="0"
                    max="90"
                    value={romData?.elbows?.[side]?.supination || ''}
                    onChange={(value) => handleBilateralChange('elbows', side as 'left' | 'right', 'supination', parseInt(value) || 0)}
                    placeholder="75"
                  />
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Wrists */}
        <CollapsibleSection title="Wrists (Right/Left)">
          <div className="space-y-6">
            {['right', 'left'].map((side) => (
              <div key={side} className="space-y-4">
                <h5 className="text-md font-semibold text-gray-800 capitalize">{side} Wrist</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormInput
                    label="Dorsiflexion (0-60°)"
                    type="number"
                    min="0"
                    max="80"
                    value={romData?.wrists?.[side]?.dorsiflexion || ''}
                    onChange={(value) => handleBilateralChange('wrists', side as 'left' | 'right', 'dorsiflexion', parseInt(value) || 0)}
                    placeholder="55"
                  />
                  <FormInput
                    label="Palmar Flexion (0-70°)"
                    type="number"
                    min="0"
                    max="90"
                    value={romData?.wrists?.[side]?.palmarFlexion || ''}
                    onChange={(value) => handleBilateralChange('wrists', side as 'left' | 'right', 'palmarFlexion', parseInt(value) || 0)}
                    placeholder="65"
                  />
                  <FormInput
                    label="Ulnar Deviation (0-30°)"
                    type="number"
                    min="0"
                    max="45"
                    value={romData?.wrists?.[side]?.ulnarDeviation || ''}
                    onChange={(value) => handleBilateralChange('wrists', side as 'left' | 'right', 'ulnarDeviation', parseInt(value) || 0)}
                    placeholder="25"
                  />
                  <FormInput
                    label="Radial Deviation (0-20°)"
                    type="number"
                    min="0"
                    max="35"
                    value={romData?.wrists?.[side]?.radialDeviation || ''}
                    onChange={(value) => handleBilateralChange('wrists', side as 'left' | 'right', 'radialDeviation', parseInt(value) || 0)}
                    placeholder="15"
                  />
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Hands and Fingers */}
        <CollapsibleSection title="Hands and Fingers (Right/Left)">
          <div className="space-y-6">
            {['right', 'left'].map((side) => (
              <div key={side} className="space-y-4">
                <h5 className="text-md font-semibold text-gray-800 capitalize">{side} Hand</h5>
                
                {/* Thumb */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h6 className="text-sm font-semibold text-gray-700 mb-3">Thumb</h6>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <FormInput
                      label="MCP Flexion (0-50°)"
                      type="number"
                      min="0"
                      max="70"
                      value={romData?.hands?.[side]?.thumb?.mcpFlexion || ''}
                      onChange={(value) => {
                        const hands = romData?.hands || {};
                        const hand = hands[side] || {};
                        const thumb = hand.thumb || {};
                        const updatedThumb = { ...thumb, mcpFlexion: parseInt(value) || 0 };
                        const updatedHand = { ...hand, thumb: updatedThumb };
                        const updatedHands = { ...hands, [side]: updatedHand };
                        updateSection('rangeOfMotion', { ...romData, hands: updatedHands });
                      }}
                      placeholder="45"
                    />
                    <FormInput
                      label="IP Flexion (0-80°)"
                      type="number"
                      min="0"
                      max="90"
                      value={romData?.hands?.[side]?.thumb?.ipFlexion || ''}
                      onChange={(value) => {
                        const hands = romData?.hands || {};
                        const hand = hands[side] || {};
                        const thumb = hand.thumb || {};
                        const updatedThumb = { ...thumb, ipFlexion: parseInt(value) || 0 };
                        const updatedHand = { ...hand, thumb: updatedThumb };
                        const updatedHands = { ...hands, [side]: updatedHand };
                        updateSection('rangeOfMotion', { ...romData, hands: updatedHands });
                      }}
                      placeholder="75"
                    />
                    <FormInput
                      label="Opposition (0-8cm)"
                      type="number"
                      min="0"
                      max="10"
                      value={romData?.hands?.[side]?.thumb?.opposition || ''}
                      onChange={(value) => {
                        const hands = romData?.hands || {};
                        const hand = hands[side] || {};
                        const thumb = hand.thumb || {};
                        const updatedThumb = { ...thumb, opposition: parseInt(value) || 0 };
                        const updatedHand = { ...hand, thumb: updatedThumb };
                        const updatedHands = { ...hands, [side]: updatedHand };
                        updateSection('rangeOfMotion', { ...romData, hands: updatedHands });
                      }}
                      placeholder="7"
                    />
                  </div>
                </div>

                {/* Fingers */}
                {['index', 'middle', 'ring', 'little'].map((finger) => (
                  <div key={finger} className="bg-gray-50 p-4 rounded-lg">
                    <h6 className="text-sm font-semibold text-gray-700 mb-3 capitalize">{finger} Finger</h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <FormInput
                        label="MCP Flexion (0-90°)"
                        type="number"
                        min="0"
                        max="100"
                        value={romData?.hands?.[side]?.[finger]?.mcpFlexion || ''}
                        onChange={(value) => {
                          const hands = romData?.hands || {};
                          const hand = hands[side] || {};
                          const fingerData = hand[finger] || {};
                          const updatedFinger = { ...fingerData, mcpFlexion: parseInt(value) || 0 };
                          const updatedHand = { ...hand, [finger]: updatedFinger };
                          const updatedHands = { ...hands, [side]: updatedHand };
                          updateSection('rangeOfMotion', { ...romData, hands: updatedHands });
                        }}
                        placeholder="85"
                      />
                      <FormInput
                        label="PIP Flexion (0-100°)"
                        type="number"
                        min="0"
                        max="110"
                        value={romData?.hands?.[side]?.[finger]?.pipFlexion || ''}
                        onChange={(value) => {
                          const hands = romData?.hands || {};
                          const hand = hands[side] || {};
                          const fingerData = hand[finger] || {};
                          const updatedFinger = { ...fingerData, pipFlexion: parseInt(value) || 0 };
                          const updatedHand = { ...hand, [finger]: updatedFinger };
                          const updatedHands = { ...hands, [side]: updatedHand };
                          updateSection('rangeOfMotion', { ...romData, hands: updatedHands });
                        }}
                        placeholder="95"
                      />
                      <FormInput
                        label="DIP Flexion (0-80°)"
                        type="number"
                        min="0"
                        max="90"
                        value={romData?.hands?.[side]?.[finger]?.dipFlexion || ''}
                        onChange={(value) => {
                          const hands = romData?.hands || {};
                          const hand = hands[side] || {};
                          const fingerData = hand[finger] || {};
                          const updatedFinger = { ...fingerData, dipFlexion: parseInt(value) || 0 };
                          const updatedHand = { ...hand, [finger]: updatedFinger };
                          const updatedHands = { ...hands, [side]: updatedHand };
                          updateSection('rangeOfMotion', { ...romData, hands: updatedHands });
                        }}
                        placeholder="75"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Hips */}
        <CollapsibleSection title="Hips (Right/Left)">
          <div className="space-y-6">
            {['right', 'left'].map((side) => (
              <div key={side} className="space-y-4">
                <h5 className="text-md font-semibold text-gray-800 capitalize">{side} Hip</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Flexion (0-100°)"
                    type="number"
                    min="0"
                    max="120"
                    value={romData?.hips?.[side]?.flexion || ''}
                    onChange={(value) => handleBilateralChange('hips', side as 'left' | 'right', 'flexion', parseInt(value) || 0)}
                    placeholder="95"
                  />
                  <FormInput
                    label="Extension (0-30°)"
                    type="number"
                    min="0"
                    max="50"
                    value={romData?.hips?.[side]?.extension || ''}
                    onChange={(value) => handleBilateralChange('hips', side as 'left' | 'right', 'extension', parseInt(value) || 0)}
                    placeholder="25"
                  />
                  <FormInput
                    label="Abduction (0-40°)"
                    type="number"
                    min="0"
                    max="60"
                    value={romData?.hips?.[side]?.abduction || ''}
                    onChange={(value) => handleBilateralChange('hips', side as 'left' | 'right', 'abduction', parseInt(value) || 0)}
                    placeholder="35"
                  />
                  <FormInput
                    label="Adduction (0-20°)"
                    type="number"
                    min="0"
                    max="40"
                    value={romData?.hips?.[side]?.adduction || ''}
                    onChange={(value) => handleBilateralChange('hips', side as 'left' | 'right', 'adduction', parseInt(value) || 0)}
                    placeholder="15"
                  />
                  <FormInput
                    label="Internal Rotation (0-40°)"
                    type="number"
                    min="0"
                    max="60"
                    value={romData?.hips?.[side]?.internalRotation || ''}
                    onChange={(value) => handleBilateralChange('hips', side as 'left' | 'right', 'internalRotation', parseInt(value) || 0)}
                    placeholder="35"
                  />
                  <FormInput
                    label="External Rotation (0-50°)"
                    type="number"
                    min="0"
                    max="70"
                    value={romData?.hips?.[side]?.externalRotation || ''}
                    onChange={(value) => handleBilateralChange('hips', side as 'left' | 'right', 'externalRotation', parseInt(value) || 0)}
                    placeholder="45"
                  />
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Knees */}
        <CollapsibleSection title="Knees (Right/Left)">
          <div className="space-y-6">
            {['right', 'left'].map((side) => (
              <div key={side} className="space-y-4">
                <h5 className="text-md font-semibold text-gray-800 capitalize">{side} Knee</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Flexion (0-150°)"
                    type="number"
                    min="0"
                    max="160"
                    value={romData?.knees?.[side]?.flexion || ''}
                    onChange={(value) => handleBilateralChange('knees', side as 'left' | 'right', 'flexion', parseInt(value) || 0)}
                    placeholder="140"
                  />
                  <FormInput
                    label="Extension (0-10°)"
                    type="number"
                    min="0"
                    max="20"
                    value={romData?.knees?.[side]?.extension || ''}
                    onChange={(value) => handleBilateralChange('knees', side as 'left' | 'right', 'extension', parseInt(value) || 0)}
                    placeholder="5"
                  />
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Ankles */}
        <CollapsibleSection title="Ankles (Right/Left)">
          <div className="space-y-6">
            {['right', 'left'].map((side) => (
              <div key={side} className="space-y-4">
                <h5 className="text-md font-semibold text-gray-800 capitalize">{side} Ankle</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormInput
                    label="Dorsiflexion (0-20°)"
                    type="number"
                    min="0"
                    max="30"
                    value={romData?.ankles?.[side]?.dorsiflexion || ''}
                    onChange={(value) => handleBilateralChange('ankles', side as 'left' | 'right', 'dorsiflexion', parseInt(value) || 0)}
                    placeholder="15"
                  />
                  <FormInput
                    label="Plantarflexion (0-40°)"
                    type="number"
                    min="0"
                    max="60"
                    value={romData?.ankles?.[side]?.plantarflexion || ''}
                    onChange={(value) => handleBilateralChange('ankles', side as 'left' | 'right', 'plantarflexion', parseInt(value) || 0)}
                    placeholder="35"
                  />
                  <FormInput
                    label="Inversion (0-30°)"
                    type="number"
                    min="0"
                    max="45"
                    value={romData?.ankles?.[side]?.inversion || ''}
                    onChange={(value) => handleBilateralChange('ankles', side as 'left' | 'right', 'inversion', parseInt(value) || 0)}
                    placeholder="25"
                  />
                  <FormInput
                    label="Eversion (0-20°)"
                    type="number"
                    min="0"
                    max="30"
                    value={romData?.ankles?.[side]?.eversion || ''}
                    onChange={(value) => handleBilateralChange('ankles', side as 'left' | 'right', 'eversion', parseInt(value) || 0)}
                    placeholder="15"
                  />
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
