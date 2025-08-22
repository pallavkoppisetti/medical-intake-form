import React from 'react';
import type { FloridaCEExamForm } from '../types/comprehensive-medical-form';
import './PDFTemplatePreview.css'; // Import the CSS file

// Helper functions as specified
const formatDate = (dateString?: string): string => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
        return dateString || '';
    }

    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        timeZone: 'UTC', // This is the crucial fix
    });
};

// Assessment helper function for concentration text
const getConcentrationText = (formData: Partial<FloridaCEExamForm>): string => {
    const concentration = formData.assessment?.medicalSourceStatement?.understandingMemoryConcentration;
    if (concentration && concentration.trim()) {
        return `Understanding, memory, sustained concentration: ${concentration}`;
    }
    return 'Understanding, memory, sustained concentration: Normal.';
};

const formatDiagnosisList = (diagnoses?: string[]) => {
    if (!diagnoses || diagnoses.length === 0) return <li>No diagnosis provided.</li>;
  return Array.isArray(diagnoses)
    ? diagnoses.map((d, i) => (
      <li key={i}><span>{d}</span></li>
    ))
    : null;
};


// Props interface
export interface PDFTemplatePreviewProps {
    formData: Partial<FloridaCEExamForm>;
    className?: string;
    showSignaturePlaceholder?: boolean;
}

const PDFTemplatePreview: React.FC<PDFTemplatePreviewProps> = ({
    formData,
    showSignaturePlaceholder = true,
}) => {
    const { header, history, functionalStatus, physicalExam, rangeOfMotion, assessment, gaitStation } = formData;

    return (
        <div 
            id="pdf-preview-content"
            data-pdf-preview
            className="pdf-preview-content" 
        >
            <div className="report-header">
                <div className="header-left">
                    <h1>Dr. Arabinda Behura, MD, FACP</h1>
                    <p>Diplomate of American Board of Internal Medicine</p>
                    <p>WE CARE HEALTH & WELLNESS CENTER</p>
                </div>
                <div className="header-right">
                    <p>1250, W SR 434, Suite 1004</p>
                    <p>Longwood, Florida, 32750</p>
                    <p>Phone: 888-575-6465</p>
                </div>
            </div>

            <h2>TO: FLORIDA DIVISION OF DISABILITY DETERMINATION.</h2>

            <table className="report-table patient-info-table">
                <tbody>
                    <tr>
                        <td className="label-column">CLAIMANT'S NAME:</td>
                        <td className="value-column">{header?.claimantName || '[Enter patient name]'}</td>
                    </tr>
                    <tr>
                        <td className="label-column">DOB:</td>
                        <td className="value-column">{formatDate(header?.dateOfBirth) || '[Enter DOB]'}</td>
                    </tr>
                    <tr>
                        <td className="label-column">DATE/TIME:</td>
                        <td className="value-column">{formatDate(header?.examDate) || '[Enter exam date]'}</td>
                    </tr>
                    <tr>
                        <td className="label-column">CASE NUMBER:</td>
                        <td className="value-column">{header?.caseNumber || '[Enter case number]'}</td>
                    </tr>
                </tbody>
            </table>

            <p>This examination was performed for the sole purpose of providing information to the State of Florida Department of Health, Division of Disability Determinations, for their exclusive use in making a determination of disability, and was not done for any diagnostic, treatment or follow up purposes.</p>
            <p>No doctor/patient relationship established. No treatment was rendered.</p>
            <p>This Clamant was identified by photo I. D. (Driver’s License).</p>
            <p>Documentation furnished by Fl Department of Health, Division of Disability Determinations at time of consultation was reviewed in its entirety and used for evaluating and confirming claimant's allegations.</p>

            <h1 className="section-title">CHIEF COMPLAINT</h1>
            {Array.isArray(header?.chiefComplaintTags) && header.chiefComplaintTags.length > 0 ? (
              <ul className="list">
                {header.chiefComplaintTags.map((complaint: string, index: number) => (
                  <li key={index}>{complaint}</li>
                ))}
              </ul>
            ) : (
              <p>{header?.chiefComplaint || '[Enter chief complaint]'}</p>
            )}

            <h1 className="section-title">HISTORY OF PRESENT ILLNESS</h1>
            <p>The Claimant is a {history?.age || '[Age]'} year old {history?.gender || '[Gender]'} with PMH of reports.</p>
            {history?.historyOfPresentIllness && <p>{history.historyOfPresentIllness}</p>}

            {Array.isArray(history?.pastMedicalHistory) && history.pastMedicalHistory.length > 0 && (
              <>
                <h1 className="section-title">PAST MEDICAL HISTORY</h1>
                <ul className="list">
                  {history.pastMedicalHistory.map((item, index) => (<li key={index}>{item}</li>))}
                </ul>
              </>
            )}

            {Array.isArray(history?.medications) && history.medications.length > 0 && (
              <>
                <h1 className="section-title">MEDICATIONS</h1>
                <ul className="list">
                  {history.medications.map((item, index) => (<li key={index}>{item}</li>))}
                </ul>
              </>
            )}

            {Array.isArray(history?.allergies) && history.allergies.length > 0 && (
              <>
                <h1 className="section-title">ALLERGIES</h1>
                <ul className="list">
                  {history.allergies.map((item, index) => (<li key={index}>{item}</li>))}
                </ul>
              </>
            )}

            {Array.isArray(history?.socialHistory) && history.socialHistory.length > 0 && (
              <>
                <h1 className="section-title">SOCIAL HISTORY</h1>
                <ul className="list">
                  {history.socialHistory.map((item, index) => (<li key={index}>{item}</li>))}
                </ul>
              </>
            )}

            {Array.isArray(history?.familyHistory) && history.familyHistory.length > 0 && (
              <>
                <h1 className="section-title">FAMILY HISTORY</h1>
                <ul className="list">
                  {history.familyHistory.map((item, index) => (<li key={index}>{item}</li>))}
                </ul>
              </>
            )}

            {Array.isArray(history?.pastSurgicalHistory) && history.pastSurgicalHistory.length > 0 && (
              <>
                <h1 className="section-title">PAST SURGICAL HISTORY</h1>
                <ul className="list">
                  {history.pastSurgicalHistory.map((item, index) => (<li key={index}>{item}</li>))}
                </ul>
              </>
            )}

            {history?.reviewOfSystems && (
              <>
                <h1 className="section-title">REVIEW OF SYSTEMS</h1>
                <p>{history.reviewOfSystems}</p>
              </>
            )}

            <h1 className="section-title">FUNCTIONAL STATUS</h1>
            <table className="report-table">
                <tbody>
                    <tr><td className="label-column">Dominant hand:</td><td className="value-column">{functionalStatus?.dominantHand || '[Hand]'}</td></tr>
                    <tr><td className="label-column">Sitting:</td><td className="value-column">reports able to for {functionalStatus?.sittingWorstDay || '[Duration]'} on their worst day, {functionalStatus?.sittingBestDay || '[Duration]'} on their best day.</td></tr>
                    <tr><td className="label-column">Standing:</td><td className="value-column">reports able to for {functionalStatus?.standingWorstDay || '[Duration]'} on their worst day, over {functionalStatus?.standingBestDay || '[Duration]'} on their best day.</td></tr>
                    <tr><td className="label-column">Walking:</td><td className="value-column">reports able to for {functionalStatus?.walkingWorstDay || '[Duration]'} on their worst day, over {functionalStatus?.walkingBestDay || '[Duration]'} on their best day.</td></tr>
                    <tr><td className="label-column">Cooking/Meal Prep:</td><td className="value-column">reports able to {functionalStatus?.cookingMealPrep || '[Not specified]'}.</td></tr>
                    <tr><td className="label-column">Grocery shopping:</td><td className="value-column">reports able to for {functionalStatus?.groceryShoppingWorstDay || '[Duration]'} on their worst day, {functionalStatus?.groceryShoppingBestDay || '[Duration]'} on their best day.</td></tr>
                    <tr><td className="label-column">Driving:</td><td className="value-column">reports able to for {functionalStatus?.drivingWorstDay || '[Duration]'} on their worst day, {functionalStatus?.drivingBestDay || '[Duration]'} on their best day.</td></tr>
                    <tr><td className="label-column">Bathing/Showering:</td><td className="value-column">reports able to {functionalStatus?.bathingShowering || '[Not specified]'}.</td></tr>
                    <tr><td className="label-column">Dressing:</td><td className="value-column">reports able to {functionalStatus?.dressing || '[Not specified]'}.</td></tr>
                    <tr><td className="label-column">Personal finances:</td><td className="value-column">reports able to {functionalStatus?.personalFinances || '[Not specified]'}.</td></tr>
                </tbody>
            </table>

            <h1 className="section-title">PHYSICAL EXAMINATION</h1>
            
            <h2>VITAL SIGNS</h2>
            <table className="report-table">
                <tbody>
                    <tr><td className="label-column">BP:</td><td className="value-column">{physicalExam?.vitalSigns?.bloodPressure ? `${physicalExam.vitalSigns.bloodPressure.systolic}/${physicalExam.vitalSigns.bloodPressure.diastolic}` : '117/72'} mmHg</td></tr>
                    <tr><td className="label-column">Weight:</td><td className="value-column">{physicalExam?.vitalSigns?.weight || '142.8'} lbs</td></tr>
                    <tr><td className="label-column">HR:</td><td className="value-column">{physicalExam?.vitalSigns?.heartRate || '82'}</td></tr>
                    <tr><td className="label-column">O2:</td><td className="value-column">{physicalExam?.vitalSigns?.oxygenSaturation || '98'} % in room air</td></tr>
                    <tr><td className="label-column">Height (without shoes):</td><td className="value-column">{physicalExam?.vitalSigns?.height || '65'} in</td></tr>
                    <tr><td className="label-column">Temp:</td><td className="value-column">{physicalExam?.vitalSigns?.temperature || '98.2'} F</td></tr>
                    <tr><td className="label-column">Visual Acuity (Uncorrected):</td><td className="value-column">R: {physicalExam?.vitalSigns?.visualAcuity?.right?.uncorrected || '20/25'} | L: {physicalExam?.vitalSigns?.visualAcuity?.left?.uncorrected || '20/20'}</td></tr>
                    <tr><td className="label-column">Visual Acuity (Corrected):</td><td className="value-column">R: {physicalExam?.vitalSigns?.visualAcuity?.right?.corrected || 'N/A'} | L: {physicalExam?.vitalSigns?.visualAcuity?.left?.corrected || 'N/A'}</td></tr>
                    <tr><td className="label-column">Dynamometer hand grip strength (Lb):</td><td className="value-column">Right: {physicalExam?.vitalSigns?.handGripStrength?.right || 'N/A'} | Left: {physicalExam?.vitalSigns?.handGripStrength?.left || 'N/A'}</td></tr>
                </tbody>
            </table>

            <h2>SYSTEMS REVIEW</h2>
            <p><strong>General:</strong> {physicalExam?.general || 'Claimant appears well groomed, is alert, oriented x 3. Cooperative, well-developed, well-nourished. Responds adequately to questions and commands.'}</p>
            <p><strong>Eyes:</strong> {physicalExam?.eyes || 'Pupils equally, round and reactive; to light and accommodation. Extraocular movements intact, No jaundice, conjunctival injection. Visual field is intact.'}</p>
            <p><strong>Ears/Nose/Throat:</strong> {physicalExam?.earsNoseThroat || 'Nares normal and without hyperemia or secretions. Able to hear and understand normal speech Moist oral mucosa. Tongue protrudes in the midline. No uvula deviation, pharynx without erythema or exudates.'}</p>
            <p><strong>Head/Neck:</strong> {physicalExam?.headNeck || 'Normocephalic and atraumatic. Trachea is midline. Supple. No thyromegaly, JVD or adenopathy No carotid bruit.'}</p>
            <p><strong>Respiratory:</strong> {physicalExam?.respiratory || 'Normal vesicular breathing sounds heard. No wheezing or rhonchi.'}</p>
            <p><strong>Cardiovascular:</strong> {physicalExam?.cardiovascular || 'Normal S1, normal S2, No murmur. No peripheral edema present. Pulses intact in lower extremity.'}</p>
            <p><strong>Abdomen:</strong> {physicalExam?.abdomen || 'Soft, non-distended, Bowel sounds present.'}</p>
            <p><strong>Back:</strong> {physicalExam?.back || 'No paraspinal tenderness, No Scoliosis or kyphosis, No deformity.'}</p>
            <p><strong>Skin:</strong> {physicalExam?.skin || 'No petechiae, hematoma or ecchymosis. No eruption or rash present.'}</p>
            <p><strong>Musculoskeletal:</strong> {physicalExam?.musculoskeletal || 'No deformity, swelling or effusions in hands, wrist, elbow, knee, ankle.'}</p>
            <p><strong>Neurological:</strong> {physicalExam?.neurological || 'CNs Il-XII: intact.'}</p>
            <p><strong>Sensory pin prick/light touch/vibration:</strong> <em>{physicalExam?.sensory || 'Intact over all extremities.'}</em></p>
            <p><strong>Rhomberg:</strong> {physicalExam?.rhomberg || 'Negative.'}</p>
            <p><strong>Psychiatry:</strong> {physicalExam?.psychiatry || 'Stable mood and affect.'}</p>

            <h1 className="section-title">NEUROMUSCULAR</h1>
            <h2>Neuromuscular Strength (0-5 scale)</h2>
            <table className="report-table">
                <thead><tr><th>Area</th><th>Right</th><th>Left</th></tr></thead>
                <tbody>
                    <tr><td>Upper Extremity</td><td>{physicalExam?.neuromuscularStrength?.rightUpperExtremity ?? '[NA]'}/5</td><td>{physicalExam?.neuromuscularStrength?.leftUpperExtremity ?? '[NA]'}/5</td></tr>
                    <tr><td>Lower Extremity</td><td>{physicalExam?.neuromuscularStrength?.rightLowerExtremity ?? '[NA]'}/5</td><td>{physicalExam?.neuromuscularStrength?.leftLowerExtremity ?? '[NA]'}/5</td></tr>
                    <tr><td>Grip</td><td>{physicalExam?.neuromuscularStrength?.rightGrip ?? '[NA]'}/5</td><td>{physicalExam?.neuromuscularStrength?.leftGrip ?? '[NA]'}/5</td></tr>
                </tbody>
            </table>
            <p><strong>Dexterity:</strong> {physicalExam?.neuromuscularStrength?.dexterityAssessment || 'Right-Handed, normal.'}</p>

            <h2>Fine & Gross Manipulative Skills (0-5 scale)</h2>
            <table className="report-table">
                <thead><tr><th>Skill</th><th>Left</th><th>Right</th></tr></thead>
                <tbody>
                    <tr><td>Buttoning</td><td>{physicalExam?.fineGrossManipulativeSkills?.buttoning?.left ?? '[NA]'}/5</td><td>{physicalExam?.fineGrossManipulativeSkills?.buttoning?.right ?? '[NA]'}/5</td></tr>
                    <tr><td>Zipping</td><td>{physicalExam?.fineGrossManipulativeSkills?.zipping?.left ?? '[NA]'}/5</td><td>{physicalExam?.fineGrossManipulativeSkills?.zipping?.right ?? '[NA]'}/5</td></tr>
                    <tr><td>Picking up a coin</td><td>{physicalExam?.fineGrossManipulativeSkills?.pickingUpCoin?.left ?? '[NA]'}/5</td><td>{physicalExam?.fineGrossManipulativeSkills?.pickingUpCoin?.right ?? '[NA]'}/5</td></tr>
                    <tr><td>Tying shoelaces</td><td>{physicalExam?.fineGrossManipulativeSkills?.tyingShoelaces?.left ?? '[NA]'}/5</td><td>{physicalExam?.fineGrossManipulativeSkills?.tyingShoelaces?.right ?? '[NA]'}/5</td></tr>
                </tbody>
            </table>

            <h2>Reflexes (0-4+ scale)</h2>
            <table className="report-table">
                <thead><tr><th>Reflex</th><th>Right</th><th>Left</th></tr></thead>
                <tbody>
                    <tr><td>Biceps</td><td>{physicalExam?.reflexes?.biceps?.right ?? '[NA]'}</td><td>{physicalExam?.reflexes?.biceps?.left ?? '[NA]'}</td></tr>
                    <tr><td>Triceps</td><td>{physicalExam?.reflexes?.triceps?.right ?? '[NA]'}</td><td>{physicalExam?.reflexes?.triceps?.left ?? '[NA]'}</td></tr>
                    <tr><td>Knee</td><td>{physicalExam?.reflexes?.knee?.right ?? '[NA]'}</td><td>{physicalExam?.reflexes?.knee?.left ?? '[NA]'}</td></tr>
                    <tr><td>Achilles</td><td>{physicalExam?.reflexes?.achilles?.right ?? '[NA]'}</td><td>{physicalExam?.reflexes?.achilles?.left ?? '[NA]'}</td></tr>
                </tbody>
            </table>

            <h1 className="section-title">RANGE OF MOTION</h1>
            <table className="report-table">
                <thead><tr><th>Joint/Action</th><th>Normal Range</th><th>Right</th><th>Left</th></tr></thead>
                <tbody>
                    <tr><td colSpan={4}><strong>CERVICAL SPINE</strong></td></tr>
                    <tr><td>Forward Flexion</td><td>0-60</td><td colSpan={2}>{rangeOfMotion?.cervicalSpine?.forwardFlexion ?? '[NA]'}</td></tr>
                    <tr><td>Extension</td><td>0-60</td><td colSpan={2}>{rangeOfMotion?.cervicalSpine?.extension ?? '[NA]'}</td></tr>
                    <tr><td>Lateral Flexion</td><td>0-45</td><td>{rangeOfMotion?.cervicalSpine?.lateralFlexionRight ?? '[NA]'}</td><td>{rangeOfMotion?.cervicalSpine?.lateralFlexionLeft ?? '[NA]'}</td></tr>
                    <tr><td>Rotation</td><td>0-80</td><td>{rangeOfMotion?.cervicalSpine?.rotationRight ?? '[NA]'}</td><td>{rangeOfMotion?.cervicalSpine?.rotationLeft ?? '[NA]'}</td></tr>
                    
                    <tr><td colSpan={4}><strong>LUMBAR SPINE</strong></td></tr>
                    <tr><td>Forward Flexion</td><td>0-90</td><td colSpan={2}>{rangeOfMotion?.lumbarSpine?.forwardFlexion ?? '[NA]'}</td></tr>
                    <tr><td>Extension</td><td>0-25</td><td colSpan={2}>{rangeOfMotion?.lumbarSpine?.extension ?? '[NA]'}</td></tr>
                    <tr><td>Lateral Flexion</td><td>0-25</td><td>{rangeOfMotion?.lumbarSpine?.lateralFlexionRight ?? '[NA]'}</td><td>{rangeOfMotion?.lumbarSpine?.lateralFlexionLeft ?? '[NA]'}</td></tr>

                    <tr><td colSpan={4}><strong>SHOULDER</strong></td></tr>
                    <tr><td>Flexion</td><td>0-150</td><td>{rangeOfMotion?.shoulders?.right?.flexion ?? '[NA]'}</td><td>{rangeOfMotion?.shoulders?.left?.flexion ?? '[NA]'}</td></tr>
                    <tr><td>Extension</td><td>0-50</td><td>{rangeOfMotion?.shoulders?.right?.extension ?? '[NA]'}</td><td>{rangeOfMotion?.shoulders?.left?.extension ?? '[NA]'}</td></tr>
                    <tr><td>Abduction</td><td>0-150</td><td>{rangeOfMotion?.shoulders?.right?.abduction ?? '[NA]'}</td><td>{rangeOfMotion?.shoulders?.left?.abduction ?? '[NA]'}</td></tr>
                    <tr><td>Adduction</td><td>0-30</td><td>{rangeOfMotion?.shoulders?.right?.adduction ?? '[NA]'}</td><td>{rangeOfMotion?.shoulders?.left?.adduction ?? '[NA]'}</td></tr>
                    <tr><td>External Rotation</td><td>0-90</td><td>{rangeOfMotion?.shoulders?.right?.externalRotation ?? '[NA]'}</td><td>{rangeOfMotion?.shoulders?.left?.externalRotation ?? '[NA]'}</td></tr>
                    <tr><td>Internal Rotation</td><td>0-90</td><td>{rangeOfMotion?.shoulders?.right?.internalRotation ?? '[NA]'}</td><td>{rangeOfMotion?.shoulders?.left?.internalRotation ?? '[NA]'}</td></tr>

                    <tr><td colSpan={4}><strong>ELBOW</strong></td></tr>
                    <tr><td>Flexion</td><td>0-150</td><td>{rangeOfMotion?.elbows?.right?.flexion ?? '[NA]'}</td><td>{rangeOfMotion?.elbows?.left?.flexion ?? '[NA]'}</td></tr>
                    <tr><td>Pronation</td><td>0-80</td><td>{rangeOfMotion?.elbows?.right?.pronation ?? '[NA]'}</td><td>{rangeOfMotion?.elbows?.left?.pronation ?? '[NA]'}</td></tr>
                    <tr><td>Supination</td><td>0-80</td><td>{rangeOfMotion?.elbows?.right?.supination ?? '[NA]'}</td><td>{rangeOfMotion?.elbows?.left?.supination ?? '[NA]'}</td></tr>

                    <tr><td colSpan={4}><strong>WRIST</strong></td></tr>
                    <tr><td>Dorsiflexion</td><td>0-60</td><td>{rangeOfMotion?.wrists?.right?.extension ?? '[NA]'}</td><td>{rangeOfMotion?.wrists?.left?.extension ?? '[NA]'}</td></tr>
                    <tr><td>Palmar flexion</td><td>0-70</td><td>{rangeOfMotion?.wrists?.right?.flexion ?? '[NA]'}</td><td>{rangeOfMotion?.wrists?.left?.flexion ?? '[NA]'}</td></tr>
                    <tr><td>Ulnar deviation</td><td>0-30</td><td>{rangeOfMotion?.wrists?.right?.ulnarDeviation ?? '[NA]'}</td><td>{rangeOfMotion?.wrists?.left?.ulnarDeviation ?? '[NA]'}</td></tr>
                    <tr><td>Radial deviation</td><td>0-20</td><td>{rangeOfMotion?.wrists?.right?.radialDeviation ?? '[NA]'}</td><td>{rangeOfMotion?.wrists?.left?.radialDeviation ?? '[NA]'}</td></tr>

                    <tr><td colSpan={4}><strong>HIP</strong></td></tr>
                    <tr><td>Flexion</td><td>0-100</td><td>{rangeOfMotion?.hips?.right?.flexion ?? '[NA]'}</td><td>{rangeOfMotion?.hips?.left?.flexion ?? '[NA]'}</td></tr>
                    <tr><td>Extension</td><td>0-30</td><td>{rangeOfMotion?.hips?.right?.extension ?? '[NA]'}</td><td>{rangeOfMotion?.hips?.left?.extension ?? '[NA]'}</td></tr>
                    <tr><td>Abduction</td><td>0-40</td><td>{rangeOfMotion?.hips?.right?.abduction ?? '[NA]'}</td><td>{rangeOfMotion?.hips?.left?.abduction ?? '[NA]'}</td></tr>
                    <tr><td>Adduction</td><td>0-20</td><td>{rangeOfMotion?.hips?.right?.adduction ?? '[NA]'}</td><td>{rangeOfMotion?.hips?.left?.adduction ?? '[NA]'}</td></tr>
                    <tr><td>Internal Rotation</td><td>0-40</td><td>{rangeOfMotion?.hips?.right?.internalRotation ?? '[NA]'}</td><td>{rangeOfMotion?.hips?.left?.internalRotation ?? '[NA]'}</td></tr>
                    <tr><td>External Rotation</td><td>0-50</td><td>{rangeOfMotion?.hips?.right?.externalRotation ?? '[NA]'}</td><td>{rangeOfMotion?.hips?.left?.externalRotation ?? '[NA]'}</td></tr>

                    <tr><td colSpan={4}><strong>KNEE</strong></td></tr>
                    <tr><td>Flexion</td><td>0-150</td><td>{rangeOfMotion?.knees?.right?.flexion ?? '[NA]'}</td><td>{rangeOfMotion?.knees?.left?.flexion ?? '[NA]'}</td></tr>
                    <tr><td>Extension</td><td>0-10</td><td>{rangeOfMotion?.knees?.right?.extension ?? '[NA]'}</td><td>{rangeOfMotion?.knees?.left?.extension ?? '[NA]'}</td></tr>

                    <tr><td colSpan={4}><strong>ANKLE</strong></td></tr>
                    <tr><td>Dorsiflexion</td><td>0-20</td><td>{rangeOfMotion?.ankles?.right?.dorsiflexion ?? '[NA]'}</td><td>{rangeOfMotion?.ankles?.left?.dorsiflexion ?? '[NA]'}</td></tr>
                    <tr><td>Plantarflexion</td><td>0-40</td><td>{rangeOfMotion?.ankles?.right?.plantarflexion ?? '[NA]'}</td><td>{rangeOfMotion?.ankles?.left?.plantarflexion ?? '[NA]'}</td></tr>
                    <tr><td>Inversion</td><td>0-30</td><td>{rangeOfMotion?.ankles?.right?.inversion ?? '[NA]'}</td><td>{rangeOfMotion?.ankles?.left?.inversion ?? '[NA]'}</td></tr>
                    <tr><td>Eversion</td><td>0-20</td><td>{rangeOfMotion?.ankles?.right?.eversion ?? '[NA]'}</td><td>{rangeOfMotion?.ankles?.left?.eversion ?? '[NA]'}</td></tr>
                </tbody>
            </table>
            <p><strong>EFFORT ON EXAM:</strong> {rangeOfMotion?.effortOnExam || '[N/A]'}</p>

            <h1 className="section-title">GAIT & STATION</h1>
            <h2>Performance Tests</h2>
            <table className="report-table">
                <tbody>
                    <tr><td className="label-column">Getting on and off the examination table:</td><td className="value-column">{gaitStation?.performanceTests?.gettingOnOffTable === 'able' ? 'Able to perform with no difficulty' : gaitStation?.performanceTests?.gettingOnOffTable === 'unable' ? 'Unable to perform' : '[Not assessed]'}</td></tr>
                    <tr><td className="label-column">Walking on Heels:</td><td className="value-column">{gaitStation?.performanceTests?.walkingOnHeels === 'able' ? 'Able to perform' : gaitStation?.performanceTests?.walkingOnHeels === 'unable' ? 'Unable to perform' : '[Not assessed]'}</td></tr>
                    <tr><td className="label-column">Walking on Toes:</td><td className="value-column">{gaitStation?.performanceTests?.walkingOnToes === 'able' ? 'Able to perform' : gaitStation?.performanceTests?.walkingOnToes === 'unable' ? 'Unable to perform' : '[Not assessed]'}</td></tr>
                    <tr><td className="label-column">Squatting and rising:</td><td className="value-column">{gaitStation?.performanceTests?.squattingAndRising === 'able' ? 'Able to perform' : gaitStation?.performanceTests?.squattingAndRising === 'unable' ? 'Unable to perform' : '[Not assessed]'}</td></tr>
                    <tr><td className="label-column">Finger to Nose:</td><td className="value-column">{gaitStation?.performanceTests?.fingerToNose === 'able' ? 'Intact' : gaitStation?.performanceTests?.fingerToNose === 'unable' ? 'Impaired' : '[Not assessed]'}</td></tr>
                    <tr><td className="label-column">Straight leg raise test:</td><td className="value-column">{gaitStation?.performanceTests?.straightLegRaise === 'positive' ? 'Positive' : gaitStation?.performanceTests?.straightLegRaise === 'negative' ? 'Negative' : '[Not assessed]'}</td></tr>
                </tbody>
            </table>

            <h2>Assistive Device</h2>
            <table className="report-table">
                <tbody>
                    <tr><td className="label-column">Gait and Station:</td><td className="value-column">{gaitStation?.assistiveDevice?.gaitAssessment || '[Normal gait and normal station]'}</td></tr>
                    <tr><td className="label-column">Assistive device for ambulation:</td><td className="value-column">{gaitStation?.assistiveDevice?.deviceType || '[No assistive device used]'}</td></tr>
                    <tr><td className="label-column">Medical conditions for use:</td><td className="value-column">{gaitStation?.assistiveDevice?.medicalConditions || '[Not applicable]'}</td></tr>
                    <tr><td className="label-column">Usage context:</td><td className="value-column">{gaitStation?.assistiveDevice?.usageContext?.join(', ') || '[Not applicable]'}</td></tr>
                    <tr><td className="label-column">Medically necessary:</td><td className="value-column">{gaitStation?.assistiveDevice?.medicalNecessity === 'yes' ? 'Yes' : gaitStation?.assistiveDevice?.medicalNecessity === 'no' ? 'No' : '[Not applicable]'}</td></tr>
                    <tr><td className="label-column">Circumstances of use:</td><td className="value-column">{gaitStation?.assistiveDevice?.circumstancesOfUse || '[Not applicable]'}</td></tr>
                    <tr><td className="label-column">Patient cooperation during gait testing:</td><td className="value-column">{gaitStation?.assistiveDevice?.patientCooperation === 'yes' ? 'Yes' : gaitStation?.assistiveDevice?.patientCooperation === 'no' ? 'No' : '[Not assessed]'}</td></tr>
                </tbody>
            </table>
            {gaitStation?.additionalNotes && <p><strong>Additional Notes:</strong> {gaitStation.additionalNotes}</p>}

            <h1 className="section-title">DIAGNOSIS/ASSESSMENT</h1>
            <ul className="list">
                {formatDiagnosisList(assessment?.diagnosisAssessment)}
            </ul>

            <h1 className="section-title">MEDICAL SOURCE STATEMENT</h1>
            <p>Based on the physical examination conducted today, the clinical findings are as follows:</p>
            <p><strong>Abilities:</strong> {assessment?.medicalSourceStatement?.abilities || 'Claimant is able to walk into the examination room, able to sit for the duration of the visit & walk unassisted with no difficulty. Claimant has adequate balance and strength.'}</p>
            <p><em>{getConcentrationText(formData)}</em></p>
            <p><strong>Limitations:</strong> {assessment?.medicalSourceStatement?.limitations || 'None noted during examination.'}</p>

            <h1 className="section-title">RECOMMENDATIONS</h1>
            <p>{assessment?.recommendations || 'For the claimant\'s condition, would benefit from multimodal pain management, physical therapy if not improved then spinal surgeon referral.'}</p>

            <h1 className="section-title">IMAGING REVIEWED</h1>
            <p>{assessment?.imagingReviewed || '[No imaging reviewed]'}</p>

            <h1 className="section-title">STATEMENT RE REVIEW OF MEDICAL RECORDS</h1>
            <p>I have reviewed the patient's medical history and radiological studies, if any, given to me to the best of my ability. I have performed a thorough history and physical examination of the patient to the best of my ability. The information in this document is based on the information given to me by the patient.</p>

            <div className="signature-section">
                {assessment?.examinerSignature ? (
                    <img 
                        src={assessment.examinerSignature} 
                        alt="Examiner Digital Signature" 
                    />
                ) : (
                    <p>
                        <em>
                            {showSignaturePlaceholder ? '[Digital signature required]' : ''}
                        </em>
                    </p>
                )}
                <div className="examiner-info">
                    <p><strong>Examiner:</strong> {assessment?.examinerInfo?.name || 'Dr. FNAME LNAME'}</p>
                    <p>{assessment?.examinerInfo?.facility || 'EZMEDTECH Health & Wellness Center'}</p>
                    <p><strong>Date:</strong> {formatDate(assessment?.examinerInfo?.date) || '[Date]'}</p>
                </div>
            </div>
        </div>
    );
};

export default PDFTemplatePreview;
