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
    if (!diagnoses || diagnoses.length === 0) return <li className="c0 c4 li-bullet-0">No diagnosis provided.</li>;
  return Array.isArray(diagnoses)
    ? diagnoses.map((d, i) => (
      <li key={i} className="c0 c4 li-bullet-0">
        <span>{d}</span>
      </li>
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

    // Debug: Log all form data to verify field usage
    console.log('PDF Preview - All Form Data:', {
        header: header ? Object.keys(header) : 'none',
        history: history ? Object.keys(history) : 'none',
        functionalStatus: functionalStatus ? Object.keys(functionalStatus) : 'none',
        physicalExam: physicalExam ? Object.keys(physicalExam) : 'none',
        rangeOfMotion: rangeOfMotion ? Object.keys(rangeOfMotion) : 'none',
        assessment: assessment ? Object.keys(assessment) : 'none',
        gaitStation: gaitStation ? Object.keys(gaitStation) : 'none'
    });

    return (
        <div 
            id="pdf-preview-content"
            data-pdf-preview
            className="c10 doc-content pdf-preview-content" 
            style={{ 
                transform: 'scale(0.95)', 
                transformOrigin: 'top left',
                width: '105%', // Minimal compensation for scale
                marginBottom: '-5%' // Reduce bottom spacing
            }}
        >
            <div>
                <p className="c0 c11"><span className="c8 c16 c3 c21">Dr. [FIRST NAME] [LNAME].&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; MD, FACP. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span className="c2">1234, W SR 001, Suite 1004,</span></p>
                <p className="c0 c11"><span className="c2">Diplomate of American Board of Internal Medicine. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Atlanta, GA, 32750.</span></p>
                <p className="c0 c11"><span className="c2">EZMEDTECH HEALTH &amp; WELLNESS CENTER. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Phone: 888-999-0000 </span></p>
                <p className="c0 c1"><span className="c2"></span></p>
            </div>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c17"><span className="c5 c3 c15">TO: FLORIDA DIVISION OF DISABILITY DETERMINATION.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c9"><span className="c7 c3">_____________________________________________________________________________________</span></p>
            <p className="c9"><span className="c3 c16">CLAIMANT'S NAME: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="c3">{header?.claimantName || '[Enter patient name]'}</span></p>
            <p className="c9"><span className="c7 c3">DOB: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatDate(header?.dateOfBirth) || '[Enter DOB]'}</span></p>
            <p className="c9"><span className="c16 c3">DATE/TIME: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="c3">{formatDate(header?.examDate) || '[Enter exam date]'}</span><span className="c16 c3">&nbsp;</span></p>
            <p className="c9"><span className="c16 c3">CASE NUMBER</span><span className="c14">: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="c3">{header?.caseNumber || '[Enter case number]'}</span><span className="c7 c3">&nbsp;</span></p>
            <p className="c9"><span className="c3 c7">_____________________________________________________________________________________</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">This examination was performed for the sole purpose of providing information to the State of Florida Department of Health, Division of Disability Determinations, for their exclusive use in making a determination of disability, and was not done for any diagnostic, treatment or follow up purposes. </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">No doctor/patient relationship established. No treatment was rendered.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">This Clamant was identified by photo I. D. (Driver’s License).</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Documentation furnished by Fl Department of Health, Division of Disability Determinations at time of consultation was reviewed in its entirety and used for evaluating and confirming claimant's allegations.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">CHIEF COMPLAINT: </span></h1>
            {Array.isArray(header?.chiefComplaintTags) && header.chiefComplaintTags.length > 0 ? (
              <div className="c0">
                {header.chiefComplaintTags.map((complaint: string, index: number) => (
                  <p key={index} className="c0" style={{ marginLeft: '18pt', textIndent: '-18pt', marginBottom: '4pt' }}>
                    <span className="c14" style={{ fontWeight: 'bold', fontSize: '12pt' }}>● {complaint}</span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="c0"><span className="c14">Claimants current complains include {header?.chiefComplaint || '[Enter chief complaint]'}</span></p>
            )}
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">HISTORY OF PRESENT ILLNESS: &nbsp;</span></h1>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c9"><span className="c14">The Claimant is a </span><span>{history?.age || '[Age]'} </span><span className="c14">&nbsp;year old </span><span>{history?.gender || '[Gender]'}</span><span className="c2">&nbsp;with PMH of reports </span></p>
            
            {/* Add History of Present Illness if available */}
            {history?.historyOfPresentIllness && (
              <>
                <p className="c0 c1"><span className="c2"></span></p>
                <p className="c0"><span className="c2">{history.historyOfPresentIllness}</span></p>
              </>
            )}
            
            {/* Add Past Medical History if available */}
      {Array.isArray(history?.pastMedicalHistory) && history.pastMedicalHistory.length > 0 && (
              <>
                <p className="c0 c1"><span className="c2"></span></p>
                <h1 className="c12"><span className="c13">PAST MEDICAL HISTORY: </span></h1>
                <ul className="c18 lst-kix_list_1-0">
                  {history.pastMedicalHistory.map((item, index) => (
                    <li key={index} className="c4 li-bullet-0">
                      <span className="c2 font-semibold">● {item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Add Medications if available */}
      {Array.isArray(history?.medications) && history.medications.length > 0 && (
              <>
                <p className="c0 c1"><span className="c2"></span></p>
                <h1 className="c12"><span className="c13">MEDICATIONS: </span></h1>
                <ul className="c18 lst-kix_list_1-0">
                  {history.medications.map((item, index) => (
                    <li key={index} className="c4 li-bullet-0">
                      <span className="c2 font-semibold">● {item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Add Allergies if available */}
      {Array.isArray(history?.allergies) && history.allergies.length > 0 && (
              <>
                <p className="c0 c1"><span className="c2"></span></p>
                <h1 className="c12"><span className="c13">ALLERGIES: </span></h1>
                <ul className="c18 lst-kix_list_1-0">
                  {history.allergies.map((item, index) => (
                    <li key={index} className="c4 li-bullet-0">
                      <span className="c2 font-semibold">● {item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Add Social History if available */}
      {Array.isArray(history?.socialHistory) && history.socialHistory.length > 0 && (
              <>
                <p className="c0 c1"><span className="c2"></span></p>
                <h1 className="c12"><span className="c13">SOCIAL HISTORY: </span></h1>
                <ul className="c18 lst-kix_list_1-0">
                  {history.socialHistory.map((item, index) => (
                    <li key={index} className="c4 li-bullet-0">
                      <span className="c2 font-semibold">● {item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Add Family History if available */}
      {Array.isArray(history?.familyHistory) && history.familyHistory.length > 0 && (
              <>
                <p className="c0 c1"><span className="c2"></span></p>
                <h1 className="c12"><span className="c13">FAMILY HISTORY: </span></h1>
                <ul className="c18 lst-kix_list_1-0">
                  {history.familyHistory.map((item, index) => (
                    <li key={index} className="c4 li-bullet-0">
                      <span className="c2 font-semibold">● {item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Add Past Surgical History if available */}
      {Array.isArray(history?.pastSurgicalHistory) && history.pastSurgicalHistory.length > 0 && (
              <>
                <p className="c0 c1"><span className="c2"></span></p>
                <h1 className="c12"><span className="c13">PAST SURGICAL HISTORY: </span></h1>
                <ul className="c18 lst-kix_list_1-0">
                  {history.pastSurgicalHistory.map((item, index) => (
                    <li key={index} className="c4 li-bullet-0">
                      <span className="c2 font-semibold">● {item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            
            {/* Add Review of Systems if available */}
            {history?.reviewOfSystems && (
              <>
                <p className="c0 c1"><span className="c2"></span></p>
                <h1 className="c12"><span className="c13">REVIEW OF SYSTEMS: </span></h1>
                <p className="c0"><span className="c2">{history.reviewOfSystems}</span></p>
              </>
            )}
            
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">FUNCTIONAL STATUS: </span></h1>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c14">Dominant hand: </span><span>{functionalStatus?.dominantHand || '[Hand]'}</span><span className="c2">.</span></p>
            <p className="c0"><span className="c14">Sitting: reports able to for </span><span>{functionalStatus?.sittingWorstDay || '[Duration]'} </span><span className="c14">on their worst day, </span><span>{functionalStatus?.sittingBestDay || '[Duration]'}</span><span className="c2">&nbsp;on their best day.</span></p>
            <p className="c0"><span className="c14">Standing: reports able to for </span><span>{functionalStatus?.standingWorstDay || '[Duration]'}</span><span className="c14">&nbsp;on their worst day, over </span><span>{functionalStatus?.standingBestDay || '[Duration]'}</span><span className="c2">&nbsp;on their best day.</span></p>
            <p className="c0"><span className="c14">Walking: reports able to for </span><span>{functionalStatus?.walkingWorstDay || '[Duration]'}</span><span className="c14">&nbsp;on their worst day, over </span><span>{functionalStatus?.walkingBestDay || '[Duration]'}</span><span className="c2">&nbsp;on their best day.</span></p>
            <p className="c0"><span className="c2">Cooking/Meal Prep: reports able to {functionalStatus?.cookingMealPrep || '[Not specified]'}.</span></p>
            <p className="c0"><span className="c14">Grocery shopping: reports able to for </span><span>{functionalStatus?.groceryShoppingWorstDay || '[Duration]'}</span><span className="c14">&nbsp;on their worst day, </span><span>{functionalStatus?.groceryShoppingBestDay || '[Duration]'}</span><span className="c2">&nbsp;on their best day.</span></p>
            <p className="c0"><span className="c14">Driving: reports able to for </span><span>{functionalStatus?.drivingWorstDay || '[Duration]'}</span><span className="c14">&nbsp;on their worst day, </span><span>{functionalStatus?.drivingBestDay || '[Duration]'}</span><span className="c2">&nbsp;on their best day.</span></p>
            <p className="c0"><span className="c2">Bathing/Showering: reports able to {functionalStatus?.bathingShowering || '[Not specified]'}.</span></p>
            <p className="c0"><span className="c2">Dressing: reports able to {functionalStatus?.dressing || '[Not specified]'}.</span></p>
            <p className="c0"><span className="c2">Personal finances: reports able to {functionalStatus?.personalFinances || '[Not specified]'}.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">CURRENT MEDICATIONS: &nbsp;</span></h1>
            <ul className="c18 lst-kix_list_1-0 start">
                {Array.isArray(history?.medications) && history.medications.length > 0 ? (
                  history.medications.map((medication, index) => (
                    <li key={index} className="c4 li-bullet-0">
                      <span className="c2 font-semibold">● {medication}</span>
                    </li>
                  ))
                ) : (
                  <li className="c4 li-bullet-0">
                    <span className="c2">None reported</span>
                  </li>
                )}
            </ul>
            <p className="c0 c1"><span className="c5 c15 c3"></span></p>
            <h1 className="c12"><span className="c13">ALLERGIES: &nbsp;</span></h1>
            <ul className="c18 lst-kix_list_1-0">
                {Array.isArray(history?.allergies) && history.allergies.length > 0 ? (
                  history.allergies.map((allergy, index) => (
                    <li key={index} className="c4 li-bullet-0">
                      <span className="c2 font-semibold">● {allergy}</span>
                    </li>
                  ))
                ) : (
                  <li className="c4 li-bullet-0">
                    <span className="c2">NKDA (No Known Drug Allergies)</span>
                  </li>
                )}
            </ul>
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">SURGICAL HISTORY: </span></h1>
            {Array.isArray(history?.pastSurgicalHistory) && history.pastSurgicalHistory.length > 0 ? (
              <ul className="c18 lst-kix_list_1-0">
                {history.pastSurgicalHistory.map((surgery, index) => (
                  <li key={index} className="c4 li-bullet-0">
                    <span className="c2 font-semibold">● {surgery}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="c0"><span>None.</span></p>
            )}
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">FAMILY HISTORY: </span></h1>
            {Array.isArray(history?.familyHistory) && history.familyHistory.length > 0 ? (
              <ul className="c18 lst-kix_list_1-0">
                {history.familyHistory.map((item, index) => (
                  <li key={index} className="c4 li-bullet-0">
                    <span className="c2 font-semibold">● {item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="c0"><span>Noncontributory.</span></p>
            )}
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">SOCIAL HISTORY: &nbsp;</span></h1>
            {Array.isArray(history?.socialHistory) && history.socialHistory.length > 0 ? (
              <ul className="c18 lst-kix_list_1-0">
                {history.socialHistory.map((item, index) => (
                  <li key={index} className="c4 li-bullet-0">
                    <span className="c2 font-semibold">● {item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="c9"><span>[Enter social history]</span></p>
            )}
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Denies current use of tobacco/EtOH abuse/illicit substance abuse/prescription drug abuse/marijuana use.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">PHYSICAL EXAMINATION: </span></h1>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c7 c3">VITAL SIGNS:</span></p>
            <p className="c0 c1"><span className="c7 c3"></span></p>
            <p className="c9"><span className="c2">BP: &nbsp;{physicalExam?.vitalSigns?.bloodPressure ? `${physicalExam.vitalSigns.bloodPressure.systolic}/${physicalExam.vitalSigns.bloodPressure.diastolic}` : '117/72'} &nbsp;mmHg.</span></p>
            <p className="c9"><span className="c2">Weight (lbs) {physicalExam?.vitalSigns?.weight || '142.8'}</span></p>
            <p className="c9"><span className="c2">HR: {physicalExam?.vitalSigns?.heartRate || '82'}</span></p>
            <p className="c9"><span className="c2">O2: &nbsp;{physicalExam?.vitalSigns?.oxygenSaturation || '98'} % in room air.</span></p>
            <p className="c9"><span className="c2">Height (without shoes): &nbsp;{physicalExam?.vitalSigns?.height || '65'} In.</span></p>
            <p className="c9"><span className="c2">Temp: {physicalExam?.vitalSigns?.temperature || '98.2'} F</span></p>
            <p className="c9"><span className="c2">Visual Acuity: &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Uncorrected &nbsp; &nbsp;R: {physicalExam?.vitalSigns?.visualAcuity?.right?.uncorrected || '20/25'} &nbsp; L: {physicalExam?.vitalSigns?.visualAcuity?.left?.uncorrected || '20/20'}</span></p>
            <p className="c9"><span className="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Corrected &nbsp; &nbsp; &nbsp; &nbsp; R: {physicalExam?.vitalSigns?.visualAcuity?.right?.corrected || ''} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; L: {physicalExam?.vitalSigns?.visualAcuity?.left?.corrected || ''}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
            <p className="c9"><span className="c2">Dynamometer hand grip strength: (Lb) &nbsp;Right: {physicalExam?.vitalSigns?.handGripStrength?.right || ''} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Left: {physicalExam?.vitalSigns?.handGripStrength?.left || ''}</span></p>
            <p className="c9 c1"><span className="c2"></span></p>
            <p className="c1 c23"><span className="c2"></span></p>
            <p className="c0"><span className="c2">General: &nbsp;</span></p>
            <p className="c0"><span className="c2">{physicalExam?.general || 'Claimant appears well groomed, is alert, oriented x 3. Cooperative, well-developed, well-nourished. Responds adequately to questions and commands.'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Eyes: </span></p>
            <p className="c0"><span className="c2">{physicalExam?.eyes || 'Pupils equally, round and reactive; to light and accommodation. Extraocular movements intact, No jaundice, conjunctival injection. Visual field is intact.'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Ears/Nose/Throat: &nbsp;</span></p>
            <p className="c0"><span className="c2">{physicalExam?.earsNoseThroat || 'Nares normal and without hyperemia or secretions. Able to hear and understand normal speech Moist oral mucosa. Tongue protrudes in the midline. No uvula deviation, pharynx without erythema or exudates.'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Head/Neck: &nbsp;</span></p>
            <p className="c0"><span className="c2">{physicalExam?.headNeck || 'Normocephalic and atraumatic. Trachea is midline. Supple. No thyromegaly, JVD or adenopathy No carotid bruit.'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Respiratory: </span></p>
            <p className="c0"><span className="c2">{physicalExam?.respiratory || 'Normal vesicular breathing sounds heard. No wheezing or rhonchi.'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Cardiovascular: </span></p>
            <p className="c0"><span className="c2">{physicalExam?.cardiovascular || 'Normal S1, normal S2, No murmur. No peripheral edema present. Pulses intact in lower extremity.'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Abdomen: &nbsp;</span></p>
            <p className="c0"><span className="c2">{physicalExam?.abdomen || 'Soft, non-distended, Bowel sounds present.'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Back: </span></p>
            <p className="c0"><span className="c2">{physicalExam?.back || 'No paraspinal tenderness, No Scoliosis or kyphosis, No deformity.'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Skin:</span></p>
            <p className="c0"><span className="c2">{physicalExam?.skin || 'No petechiae, hematoma or ecchymosis. No eruption or rash present.'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Musculoskeletal:</span></p>
            <p className="c0"><span className="c2">{physicalExam?.musculoskeletal || 'No deformity, swelling or effusions in hands, wrist, elbow, knee, ankle.'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Neurological:</span></p>
            <p className="c0"><span className="c2">{physicalExam?.neurological || 'CNs Il-XII: intact.'} </span></p>
            <p className="c0"><span className="c14">Sensory pin prick/light touch/vibration: </span><span className="c14 c19">Intact over all extremities.</span></p>
            <p className="c0"><span className="c2">Rhomberg: Negative. </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Psychiatry:</span></p>
            <p className="c0"><span className="c2">Stable mood and affect.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c15 c3">Neuromuscular Strength. </span></p>
            <p className="c0"><span className="c2">0 = No visible or palpable contraction </span></p>
            <p className="c0"><span className="c2">1 = Visible or palpable contraction with no motion </span></p>
            <p className="c0"><span className="c2">2 = Active ROM with gravity eliminated </span></p>
            <p className="c0"><span className="c2">3 = Active ROM against gravity only, without resistance </span></p>
            <p className="c0"><span className="c2">4 = Active ROM against gravity, moderate resistance </span></p>
            <p className="c0"><span className="c2">5=Active ROM against gravity, maximum resistance</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Right upper extremity: {physicalExam?.neuromuscularStrength?.rightUpperExtremity ?? '[Not assessed]'}/5</span></p>
            <p className="c0"><span className="c2">Left upper extremity: {physicalExam?.neuromuscularStrength?.leftUpperExtremity ?? '[Not assessed]'}/5</span></p>
            <p className="c0"><span className="c2">Right lower extremity: {physicalExam?.neuromuscularStrength?.rightLowerExtremity ?? '[Not assessed]'}/5.</span></p>
            <p className="c0"><span className="c2">Left Lower extremity: {physicalExam?.neuromuscularStrength?.leftLowerExtremity ?? '[Not assessed]'}/5.</span></p>
            <p className="c0"><span className="c2">Right grip: {physicalExam?.neuromuscularStrength?.rightGrip ?? '[Not assessed]'}/5 </span></p>
            <p className="c0"><span className="c2">Left grip: {physicalExam?.neuromuscularStrength?.leftGrip ?? '[Not assessed]'}/5 </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Dexterity: Right-Handed, normal.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c3">FINE &amp; GROSS MANIPULATIVE SKILLS</span><span className="c2">: </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Claimant is able to pinch, grasp and manipulate small and large objects. Showed no signs of any deformity or contractures in the hands. Able to make a full fist and is able to oppose fingers and a grip strength of 5/5 bilaterally with the very good effort.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">(0=worse/unable to, 5=best/normal) </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Buttoning: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LEFT 5/5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RIGHT 5/5 </span></p>
            <p className="c0"><span className="c2">Zipping: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LEFT 5/5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RIGHT 5/5 </span></p>
            <p className="c0"><span className="c2">Picking up a coin: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LEFT 5/5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RIGHT 5/5 </span></p>
            <p className="c0"><span className="c2">Tying shoelaces: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LEFT 5/5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RIGHT 5/5</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c3">Reflexes</span><span className="c2">:</span></p>
            <p className="c0"><span className="c2">0 = Absent, 1+ = Decreased, 2+ = Normal, 3+ = Hyperreflexia, 4+ = Repeating Reflex </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Right&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Left</span></p>
            <p className="c0"><span className="c2">Biceps &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{physicalExam?.reflexes?.biceps?.right ?? '[Not assessed]'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{physicalExam?.reflexes?.biceps?.left ?? '[Not assessed]'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
            <p className="c0"><span className="c2">Trie eps &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{physicalExam?.reflexes?.triceps?.right ?? '[Not assessed]'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{physicalExam?.reflexes?.triceps?.left ?? '[Not assessed]'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
            <p className="c0"><span className="c2">Knee &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{physicalExam?.reflexes?.knee?.right ?? '[Not assessed]'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{physicalExam?.reflexes?.knee?.left ?? '[Not assessed]'}</span></p>
            <p className="c0"><span className="c2">Achilles &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{physicalExam?.reflexes?.achilles?.right ?? '[Not assessed]'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{physicalExam?.reflexes?.achilles?.left ?? '[Not assessed]'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c8 c5 c3">RANGE OF MOTION: </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">CERVICAL SPINE </span></p>
            <p className="c0"><span className="c2">Forward Flexion (0-60): &nbsp;{rangeOfMotion?.cervicalSpine?.forwardFlexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Extension (0-60): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{rangeOfMotion?.cervicalSpine?.extension ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Lateral Flexion (0-45): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.cervicalSpine?.lateralFlexionRight ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.cervicalSpine?.lateralFlexionLeft ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Rotation (0-80): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.cervicalSpine?.rotationRight ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.cervicalSpine?.rotationLeft ?? '[Not measured]'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">LUMBAR SPINE </span></p>
            <p className="c0"><span className="c2">Forward Flexion (0-90): &nbsp;{rangeOfMotion?.lumbarSpine?.forwardFlexion ?? '[Not measured]'}</span></p>
            <p className="c0"><span className="c2">Extension (0-25): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{rangeOfMotion?.lumbarSpine?.extension ?? '[Not measured]'}</span></p>
            <p className="c0"><span className="c14 c19">Lateral Flexion (0-25): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="c14">R={rangeOfMotion?.lumbarSpine?.lateralFlexionRight ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.lumbarSpine?.lateralFlexionLeft ?? '[Not measured]'}</span><span className="c6">&nbsp;</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">SHOULDER </span></p>
            <p className="c0"><span className="c2">Flexion (0-150): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.shoulders?.right?.flexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.shoulders?.left?.flexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Extension (0-50): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.shoulders?.right?.extension ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.shoulders?.left?.extension ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Abduction (0-150): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.shoulders?.right?.abduction ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.shoulders?.left?.abduction ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Adduction (0-30): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.shoulders?.right?.adduction ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.shoulders?.left?.adduction ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">External Rotation (0-90):R={rangeOfMotion?.shoulders?.right?.externalRotation ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.shoulders?.left?.externalRotation ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Internal Rotation (0-90): R={rangeOfMotion?.shoulders?.right?.internalRotation ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.shoulders?.left?.internalRotation ?? '[Not measured]'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">ELBOW </span></p>
            <p className="c0"><span className="c2">Flexion (0-150): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.elbows?.right?.flexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.elbows?.left?.flexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Pronation (0-80): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.elbows?.right?.pronation ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.elbows?.left?.pronation ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Supination (0-80): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.elbows?.right?.supination ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.elbows?.left?.supination ?? '[Not measured]'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">WRIST </span></p>
            <p className="c0"><span className="c2">Dorsiflexion (0-60): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.wrists?.right?.extension ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.wrists?.left?.extension ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Palmar flexion (0-70): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.wrists?.right?.flexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.wrists?.left?.flexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Ulnar deviation (0-30): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.wrists?.right?.ulnarDeviation ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.wrists?.left?.ulnarDeviation ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Radial deviation (0-20): &nbsp;R={rangeOfMotion?.wrists?.right?.radialDeviation ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.wrists?.left?.radialDeviation ?? '[Not measured]'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">HAND </span></p>
            <p className="c0"><span className="c2">Thumb </span></p>
            <p className="c0"><span className="c2">Adduction CMC joint (less than or equal to 2 cm): R={rangeOfMotion?.hands?.right?.thumbOpposition ? `${rangeOfMotion.hands.right.thumbOpposition}%` : '[Not measured]'} L={rangeOfMotion?.hands?.left?.thumbOpposition ? `${rangeOfMotion.hands.left.thumbOpposition}%` : '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Abduction CMC joint (0-50): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.thumbOpposition ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.thumbOpposition ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Flexion MCP joint (0-60): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Flexion IP joint (0-80): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Index </span></p>
            <p className="c0"><span className="c2">flexion MCP joint (0-90): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">flexion PIP joint (0-100): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">flexion DIP joint (0-70): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Middle </span></p>
            <p className="c0"><span className="c2">flexion MCP joint (0-90): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">flexion PIP joint (0-100): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">flexion DIP joint (0-70): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Ring </span></p>
            <p className="c0"><span className="c2">flexion MCP joint (0-90): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">flexion PIP joint (0-100): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">flexion DIP joint (0-70): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Little </span></p>
            <p className="c0"><span className="c2">flexion MCP joint (0-90): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">flexion PIP joint (0-100): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">flexion DIP joint (0-70): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hands?.right?.fingerFlexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hands?.left?.fingerFlexion ?? '[Not measured]'} </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">HIP </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Flexion (0-100): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hips?.right?.flexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hips?.left?.flexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Extension (0-30): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hips?.right?.extension ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hips?.left?.extension ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Abduction (0-40): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hips?.right?.abduction ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hips?.left?.abduction ?? '[Not measured]'}</span></p>
            <p className="c0"><span className="c2">Adduction (0-20): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hips?.right?.adduction ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hips?.left?.adduction ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Internal Rotation (0-40): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hips?.right?.internalRotation ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hips?.left?.internalRotation ?? '[Not measured]'}</span></p>
            <p className="c0"><span className="c2">External Rotation (0-50): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.hips?.right?.externalRotation ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.hips?.left?.externalRotation ?? '[Not measured]'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">KNEE </span></p>
            <p className="c0"><span className="c2">Flexion (0-150): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.knees?.right?.flexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.knees?.left?.flexion ?? '[Not measured]'} </span></p>
            <p className="c0"><span className="c2">Extension (0-10): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.knees?.right?.extension ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.knees?.left?.extension ?? '[Not measured]'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">ANKLE </span></p>
            <p className="c0"><span className="c2">Dorsiflexion (0-20): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.ankles?.right?.dorsiflexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.ankles?.left?.dorsiflexion ?? '[Not measured]'}</span></p>
            <p className="c0"><span className="c2">Plantarflexion (0-40): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.ankles?.right?.plantarflexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.ankles?.left?.plantarflexion ?? '[Not measured]'}</span></p>
            <p className="c0"><span className="c2">Inversion (0-30): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.ankles?.right?.inversion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.ankles?.left?.inversion ?? '[Not measured]'}</span></p>
            <p className="c0"><span className="c2">Eversion (0-20): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.ankles?.right?.eversion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.ankles?.left?.eversion ?? '[Not measured]'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">HALLUX </span></p>
            <p className="c0"><span className="c2">Dorsiflexion MTP Joint (0-30): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R={rangeOfMotion?.ankles?.right?.dorsiflexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.ankles?.left?.dorsiflexion ?? '[Not measured]'}</span></p>
            <p className="c0"><span className="c2">Plantar Flexion MTP Joint (0-30):R={rangeOfMotion?.ankles?.right?.plantarflexion ?? '[Not measured]'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L={rangeOfMotion?.ankles?.left?.plantarflexion ?? '[Not measured]'}</span></p>
            <p className="c0"><span className="c2">Flexion IP Joint (0-20): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L: 20</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">EFFORT ON EXAM: &nbsp; &nbsp; &nbsp; GOOD {rangeOfMotion?.effortOnExam === 'Good' ? '__X ______' : '______'} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;FAIR {rangeOfMotion?.effortOnExam === 'Fair' ? '__X ______' : '_______'} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; POOR {rangeOfMotion?.effortOnExam === 'Poor' ? '__X ______' : '________'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c3 c8">Degrees or Difficulty in Performance are as Follows: </span></p>
            <p className="c0 c1"><span className="c8 c14 c21"></span></p>
            <p className="c0"><span className="c2">Getting on and off the examination table- {gaitStation?.performanceTests?.gettingOnOffTable === 'able' ? 'able to perform with no difficulty' : gaitStation?.performanceTests?.gettingOnOffTable === 'unable' ? 'unable to perform' : '[Not assessed]'}</span></p>
            <p className="c0"><span className="c2">Walking on Heels: {gaitStation?.performanceTests?.walkingOnHeels === 'able' ? 'able to perform' : gaitStation?.performanceTests?.walkingOnHeels === 'unable' ? 'unable to perform' : '[Not assessed]'}</span></p>
            <p className="c0"><span className="c2">Walking on Toes: {gaitStation?.performanceTests?.walkingOnToes === 'able' ? 'able to perform' : gaitStation?.performanceTests?.walkingOnToes === 'unable' ? 'unable to perform' : '[Not assessed]'}</span></p>
            <p className="c0"><span className="c2">Squatting and rising: {gaitStation?.performanceTests?.squattingAndRising === 'able' ? 'able to perform' : gaitStation?.performanceTests?.squattingAndRising === 'unable' ? 'unable to perform' : '[Not assessed]'}</span></p>
            <p className="c0"><span className="c2">Finger to Nose: {gaitStation?.performanceTests?.fingerToNose === 'able' ? 'intact' : gaitStation?.performanceTests?.fingerToNose === 'unable' ? 'impaired' : '[Not assessed]'}</span></p>
            <p className="c0"><span className="c2">Straight leg raise test: {gaitStation?.performanceTests?.straightLegRaise === 'positive' ? 'Positive' : gaitStation?.performanceTests?.straightLegRaise === 'negative' ? 'Negative' : '[Not assessed]'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c3">ASSISTIVE DEVICE</span><span className="c2">: </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Gait and Station: {gaitStation?.assistiveDevice?.gaitAssessment || '[Normal gait and normal station]'}</span></p>
            <p className="c0"><span className="c2">What type of assistive device is used for ambulation? {gaitStation?.assistiveDevice?.deviceType || '[No assistive device used]'}</span></p>
            <p className="c0"><span className="c2">Medical conditions that it was used for? {gaitStation?.assistiveDevice?.medicalConditions || '[Not applicable]'}</span></p>
            <p className="c0"><span className="c2">Patient uses active assistive device for walking standing or Both? {gaitStation?.assistiveDevice?.usageContext?.join(', ') || '[Not applicable]'}</span></p>
            <p className="c0"><span className="c2">Is the assistive device medically necessary? {gaitStation?.assistiveDevice?.medicalNecessity === 'yes' ? 'Yes' : gaitStation?.assistiveDevice?.medicalNecessity === 'no' ? 'No' : '[Not applicable]'}</span></p>
            <p className="c0"><span className="c2">Under what circumstance assistive device used? {gaitStation?.assistiveDevice?.circumstancesOfUse || '[Not applicable]'}</span></p>
            <p className="c0"><span className="c2">Was the patient fully cooperative during gait testing? {gaitStation?.assistiveDevice?.patientCooperation === 'yes' ? 'Yes' : gaitStation?.assistiveDevice?.patientCooperation === 'no' ? 'No' : '[Not assessed]'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">{gaitStation?.additionalNotes || ''}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c15 c3">DIAGNOSIS/ASSESSMENT: </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <ul className="c18 lst-kix_list_1-0">
                {formatDiagnosisList(assessment?.diagnosisAssessment)}
            </ul>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c3 c5">MEDICAL SOURCE STATEMENT</span><span className="c2">&nbsp;(functional abilities and specific restrictions): </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Based on the physical examination conducted today, the clinical findings are as follows: </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c3">Abilities</span><span className="c2">: {assessment?.medicalSourceStatement?.abilities || 'Claimant is able to walk into the examination room, able to sit for the duration of the visit & walk unassisted with no difficulty. Claimant has adequate balance and strength.'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c6">{getConcentrationText(formData)}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c3">Limitations</span><span className="c2">: {assessment?.medicalSourceStatement?.limitations || 'None noted during examination.'}</span></p>
            <p className="c0 c1"><span className="c6"></span></p>
            {/* <p className="c0"><span className="c2">Claimant’s activities of daily living is mildly affected by .</span></p> */}
            <p className="c0 c1"><span className="c6"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c15 c3">RECOMMENDATIONS: </span></p>
            <p className="c0 c1"><span className="c5 c15 c3"></span></p>
            <p className="c0"><span className="c2">{assessment?.recommendations || 'For the claimant\'s condition, would benefit from multimodal pain management, physical therapy if not improved then spinal surgeon referral.'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c7 c3">Imaging reviewed: </span></p>
            <p className="c0"><span className="c3">{assessment?.imagingReviewed || '[No imaging reviewed]'}</span></p>
            <p className="c0 c1"><span className="c6"></span></p>
            <p className="c0 c1"><span className="c6"></span></p>
            <p className="c0"><span className="c2">STATEMENT RE REVIEW OF MEDICAL RECORDS: </span></p>
            <p className="c0"><span className="c2">I have reviewed the patient's medical history and radiological studies, if any, given to me to the best of my ability. I have performed a thorough history and physical examination of the patient to the best of my ability. The information in this document is based on the information given to me by the patient. </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            {/* Digital Signature */}
            {assessment?.examinerSignature ? (
                <p className="c0">
                    <img 
                        src={assessment.examinerSignature} 
                        alt="Examiner Digital Signature" 
                        style={{ 
                            maxWidth: '300px', 
                            maxHeight: '100px', 
                            border: '1px solid #ccc',
                            display: 'block',
                            margin: '10px 0'
                        }} 
                    />
                </p>
            ) : (
                <p className="c0">
                    <span className="c6" style={{ color: '#888', fontStyle: 'italic' }}>
                        {showSignaturePlaceholder ? '[Digital signature required]' : ''}
                    </span>
                </p>
            )}
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Examiner: {assessment?.examinerInfo?.name || 'Dr. FNAME LNAME'}. </span></p>
            <p className="c0"><span className="c2">{assessment?.examinerInfo?.facility || 'EZMEDTECH Health & Wellness Center'}.</span></p>
            <p className="c9"><span className="c2">Date: {formatDate(assessment?.examinerInfo?.date) || '[Date]'}</span></p>
            <p className="c9 c1"><span className="c2"></span></p>
            <p className="c9 c1"><span className="c2"></span></p>
            <p className="c9 c1"><span className="c2"></span></p>
            <p className="c9 c1"><span className="c2"></span></p>
            <div><p className="c1 c20"><span className="c2"></span></p><p className="c0 c1"><span className="c2"></span></p></div>
        </div>
    );
};

export default PDFTemplatePreview;