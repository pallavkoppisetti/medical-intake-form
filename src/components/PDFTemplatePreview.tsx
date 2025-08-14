import React from 'react';
import type { FloridaCEExamForm } from '../types/comprehensive-medical-form';
import './PDFTemplatePreview.css'; // Import the CSS file

// Helper functions as specified
const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    if (isNaN(new Date(dateString).getTime())) {
        return dateString;
    }
    const date = new Date(dateString);
    const offsetDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return offsetDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });
};

const formatList = (items?: string[], defaultString: string = 'None') => {
    if (!items || items.length === 0) return <li className="c0 c4 li-bullet-0">{defaultString}</li>;
    return items.map((item, index) => (
        <li key={index} className="c0 c4 li-bullet-0">
            <span className="c3 c22">{item}</span>
        </li>
    ));
};

const formatDiagnosisList = (diagnoses?: string[]) => {
    if (!diagnoses || diagnoses.length === 0) return <li className="c0 c4 li-bullet-0">No diagnosis provided.</li>;
    return diagnoses.map((d, i) => (
        <li key={i} className="c0 c4 li-bullet-0">
            <span>{d}</span>
        </li>
    ));
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
    const { header, history, functionalStatus, medicalInfo, assessment, gaitStation } = formData;

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
            {header?.chiefComplaintTags && header.chiefComplaintTags.length > 0 ? (
              <ul className="c18 lst-kix_list_1-0">
                {header.chiefComplaintTags.map((complaint: string, index: number) => (
                  <li key={index} className="c0 c4 li-bullet-0">
                    <span className="c14">{complaint}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="c0"><span className="c14">Claimants current complains include {header?.chiefComplaint || '[Enter chief complaint]'}</span></p>
            )}
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">HISTORY OF PRESENT ILLNESS: &nbsp;</span></h1>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c9"><span className="c14">The Claimant is a </span><span>{history?.age || '[Age]'} </span><span className="c14">&nbsp;year old </span><span>{history?.gender || '[Gender]'}</span><span className="c2">&nbsp;with PMH of reports </span></p>
            
            {/* Add Past Medical History if available */}
            {history?.pastMedicalHistory && (
              <>
                <p className="c0 c1"><span className="c2"></span></p>
                <h1 className="c12"><span className="c13">PAST MEDICAL HISTORY: </span></h1>
                <p className="c0"><span className="c2">{history.pastMedicalHistory}</span></p>
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
                {formatList(history?.medications ? [history.medications] : medicalInfo?.currentMedications, 'None reported')}
            </ul>
            <p className="c0 c1"><span className="c5 c15 c3"></span></p>
            <h1 className="c12"><span className="c13">ALLERGIES: &nbsp;</span></h1>
            <ul className="c18 lst-kix_list_1-0">
                {formatList(history?.allergies ? [history.allergies] : medicalInfo?.allergies, 'NKDA (No Known Drug Allergies)')}
            </ul>
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">SURGICAL HISTORY: </span></h1>
            <p className="c0"><span>{history?.pastSurgicalHistory || medicalInfo?.surgicalHistory || 'None.'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">FAMILY HISTORY: </span></h1>
            <p className="c0"><span>{history?.familyHistory || medicalInfo?.familyHistory || 'Noncontributory.'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">SOCIAL HISTORY: &nbsp;</span></h1>
            <p className="c9"><span>{history?.socialHistory || medicalInfo?.socialHistory || '[Enter social history]'}</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Denies current use of tobacco/EtOH abuse/illicit substance abuse/prescription drug abuse/marijuana use.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <h1 className="c12"><span className="c13">PHYSICAL EXAMINATION: </span></h1>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c7 c3">VITAL SIGNS:</span></p>
            <p className="c0 c1"><span className="c7 c3"></span></p>
            <p className="c9"><span className="c2">BP: &nbsp;117/72 &nbsp;mmHg.</span></p>
            <p className="c9"><span className="c2">Weight (lbs) 142.8</span></p>
            <p className="c9"><span className="c2">HR: 82</span></p>
            <p className="c9"><span className="c2">O2: &nbsp;98 % in room air.</span></p>
            <p className="c9"><span className="c2">Height (without shoes): &nbsp;65 In.</span></p>
            <p className="c9"><span className="c2">Temp: 98.2 F</span></p>
            <p className="c9"><span className="c2">Visual Acuity: &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Uncorrected &nbsp; &nbsp;R: 20/25 &nbsp; L: 20/20</span></p>
            <p className="c9"><span className="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Corrected &nbsp; &nbsp; &nbsp; &nbsp; R: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; L:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
            <p className="c9"><span className="c2">Dynamometer hand grip strength: (Lb) &nbsp;Right: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Left: </span></p>
            <p className="c9 c1"><span className="c2"></span></p>
            <p className="c1 c23"><span className="c2"></span></p>
            <p className="c0"><span className="c2">General: &nbsp;</span></p>
            <p className="c0"><span className="c2">Claimant appears well groomed, is alert, oriented x 3. Cooperative, well-developed, well-nourished. Responds adequately to questions and commands. </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Eyes: </span></p>
            <p className="c0"><span className="c2">Pupils equally, round and reactive; to light and accommodation. Extraocular movements intact, No jaundice, conjunctival injection. Visual field is intact.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Ears/Nose/Throat: &nbsp;</span></p>
            <p className="c0"><span className="c2">Nares normal and without hyperemia or secretions. Able to hear and understand normal speech Moist oral mucosa. Tongue protrudes in the midline. No uvula deviation, pharynx without erythema or exudates. </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Head/Neck: &nbsp;</span></p>
            <p className="c0"><span className="c2">Normocephalic and atraumatic. Trachea is midline. Supple. No thyromegaly, JVD or adenopathy No carotid bruit. </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Respiratory: </span></p>
            <p className="c0"><span className="c2">Normal vesicular breathing sounds heard. No wheezing or rhonchi.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Cardiovascular: </span></p>
            <p className="c0"><span className="c2">Normal S1, normal S2, No murmur. No peripheral edema present. &nbsp;Pulses intact in lower extremity.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Abdomen: &nbsp;</span></p>
            <p className="c0"><span className="c2">Soft, non-distended, Bowel sounds present. </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Back: </span></p>
            <p className="c0"><span className="c2">No paraspinal tenderness, No Scoliosis or kyphosis, No deformity.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Skin:</span></p>
            <p className="c0"><span className="c2">No petechiae, hematoma or ecchymosis. No eruption or rash present. </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Musculoskeletal:</span></p>
            <p className="c0"><span className="c2">No deformity, swelling or effusions in hands, wrist, elbow, knee, ankle.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Neurological:</span></p>
            <p className="c0"><span className="c2">CNs Il-XII: intact. </span></p>
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
            <p className="c0"><span className="c2">Right upper extremity: 5/5</span></p>
            <p className="c0"><span className="c2">Left upper extremity: 5/5</span></p>
            <p className="c0"><span className="c2">Right lower extremity: 5/5.</span></p>
            <p className="c0"><span className="c2">Left Lower extremity: 5/5.</span></p>
            <p className="c0"><span className="c2">Right grip: 5/5 </span></p>
            <p className="c0"><span className="c2">Left grip: 5/5 </span></p>
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
            <p className="c0"><span className="c2">Biceps &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
            <p className="c0"><span className="c2">Trie eps &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
            <p className="c0"><span className="c2">Knee &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2+</span></p>
            <p className="c0"><span className="c2">Achilles &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2+</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c8 c5 c3">RANGE OF MOTION: </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">CERVICAL SPINE </span></p>
            <p className="c0"><span className="c2">Forward Flexion (0-60): &nbsp;60 </span></p>
            <p className="c0"><span className="c2">Extension (0-60): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;60 </span></p>
            <p className="c0"><span className="c2">Lateral Flexion (0-45): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=45 </span></p>
            <p className="c0"><span className="c2">Rotation (0-80): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=80 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=80 </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">LUMBAR SPINE </span></p>
            <p className="c0"><span className="c2">Forward Flexion (0-90): &nbsp;90</span></p>
            <p className="c0"><span className="c2">Extension (0-25): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20</span></p>
            <p className="c0"><span className="c14 c19">Lateral Flexion (0-25): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="c14">R=20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=20</span><span className="c6">&nbsp;</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">SHOULDER </span></p>
            <p className="c0"><span className="c2">Flexion (0-150): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=150 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=150 </span></p>
            <p className="c0"><span className="c2">Extension (0-50): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=50 </span></p>
            <p className="c0"><span className="c2">Abduction (0-150): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=150 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=150 </span></p>
            <p className="c0"><span className="c2">Adduction (0-30): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L= 30 </span></p>
            <p className="c0"><span className="c2">External Rotation (0-90):R=90 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=90 </span></p>
            <p className="c0"><span className="c2">Internal Rotation (0-90): R=90 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=90 </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">ELBOW </span></p>
            <p className="c0"><span className="c2">Flexion (0-150): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=150 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=150 </span></p>
            <p className="c0"><span className="c2">Pronation (0-80): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=80 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=80 </span></p>
            <p className="c0"><span className="c2">Supination (0-80): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=80 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=80 </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">WRIST </span></p>
            <p className="c0"><span className="c2">Dorsiflexion (0-60): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=60 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=60 </span></p>
            <p className="c0"><span className="c2">Palmar flexion (0-70): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=70 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=70 </span></p>
            <p className="c0"><span className="c2">Ulnar deviation (0-30): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=30 </span></p>
            <p className="c0"><span className="c2">Radial deviation (0-20): &nbsp;R=20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=20 </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">HAND </span></p>
            <p className="c0"><span className="c2">Thumb </span></p>
            <p className="c0"><span className="c2">Adduction CMC joint (less than or equal to 2 cm): R=2 cm L=2cm </span></p>
            <p className="c0"><span className="c2">Abduction CMC joint (0-50): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=50 </span></p>
            <p className="c0"><span className="c2">Flexion MCP joint (0-60): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=60 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=60 </span></p>
            <p className="c0"><span className="c2">Flexion IP joint (0-80): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=80 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=80 </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Index </span></p>
            <p className="c0"><span className="c2">flexion MCP joint (0-90): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=90 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=90 </span></p>
            <p className="c0"><span className="c2">flexion PIP joint (0-100): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=100 </span></p>
            <p className="c0"><span className="c2">flexion DIP joint (0-70): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=70 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=70 </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Middle </span></p>
            <p className="c0"><span className="c2">flexion MCP joint (0-90): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=90 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=90 </span></p>
            <p className="c0"><span className="c2">flexion PIP joint (0-100): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=100 </span></p>
            <p className="c0"><span className="c2">flexion DIP joint (0-70): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=70 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=70 </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Ring </span></p>
            <p className="c0"><span className="c2">flexion MCP joint (0-90): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=90 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=90 </span></p>
            <p className="c0"><span className="c2">flexion PIP joint (0-100): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=100 </span></p>
            <p className="c0"><span className="c2">flexion DIP joint (0-70): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=70 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=70 </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Little </span></p>
            <p className="c0"><span className="c2">flexion MCP joint (0-90): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=90 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=90 </span></p>
            <p className="c0"><span className="c2">flexion PIP joint (0-100): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=100 </span></p>
            <p className="c0"><span className="c2">flexion DIP joint (0-70): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=70 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=70 </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">HIP </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Flexion (0-100): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=100 </span></p>
            <p className="c0"><span className="c2">Extension (0-30): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=30 </span></p>
            <p className="c0"><span className="c2">Abduction (0-40): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=40 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=40</span></p>
            <p className="c0"><span className="c2">Adduction (0-20): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=20 </span></p>
            <p className="c0"><span className="c2">Internal Rotation (0-40): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=20</span></p>
            <p className="c0"><span className="c2">External Rotation (0-50): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=20</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">KNEE </span></p>
            <p className="c0"><span className="c2">Flexion (0-150): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=120 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=120 </span></p>
            <p className="c0"><span className="c2">Extension (0-10): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=10</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">ANKLE </span></p>
            <p className="c0"><span className="c2">Dorsiflexion (0-20): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L=20</span></p>
            <p className="c0"><span className="c2">Plantarflexion (0-40): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=40 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L= 40</span></p>
            <p className="c0"><span className="c2">Inversion (0-30): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L= 20</span></p>
            <p className="c0"><span className="c2">Eversion (0-20): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L= 20</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">HALLUX </span></p>
            <p className="c0"><span className="c2">Dorsiflexion MTP Joint (0-30): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L: 30</span></p>
            <p className="c0"><span className="c2">Plantar Flexion MTP Joint (0-30):R=30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L: 30</span></p>
            <p className="c0"><span className="c2">Flexion IP Joint (0-20): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R=20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L: 20</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">EFFORT ON EXAM: &nbsp; &nbsp; &nbsp; GOOD __X ______ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;FAIR _______ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; POOR ________</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c3 c8">Degrees or Difficulty in Performance are as Follows: </span></p>
            <p className="c0 c1"><span className="c8 c14 c21"></span></p>
            <p className="c0"><span className="c2">Getting on and off the examination table- able to perform with no difficulty.</span></p>
            <p className="c0"><span className="c2">Walking on Heels: able to perform.</span></p>
            <p className="c0"><span className="c2">Walking on Toes: able to perform.</span></p>
            <p className="c0"><span className="c2">Squatting and rising; able to perform.</span></p>
            <p className="c0"><span className="c2">Finger to Nose: intact.</span></p>
            <p className="c0"><span className="c2">Straight leg raise test: Negative.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c3">ASSISTIVE DEVICE</span><span className="c2">: </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Gait and Station: Normal gait and normal station.</span></p>
            <p className="c0"><span className="c2">What type of assistive device is used for ambulation? She does not use any assistive device. </span></p>
            <p className="c0"><span className="c2">Medical conditions that it was used for?</span></p>
            <p className="c0"><span className="c2">Patient uses active assistive device for walking standing or Both?</span></p>
            <p className="c0"><span className="c2">Is the assistive device medically necessary?</span></p>
            <p className="c0"><span className="c2">Under what circumstance assistive device used? &nbsp; </span></p>
            <p className="c0"><span className="c2">Was the patient fully cooperative during gait testing? Yes.</span></p>
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
            <p className="c0"><span className="c5 c3">Abilities</span><span className="c2">: Claimant is able to walk into the examination room, able to sit for the duration of the visit &amp; walk unassisted with no difficulty. Claimant has adequate balance and strength.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c6">Understanding, memory, sustained concentration: Normal.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c3">Limitations</span><span className="c2">: &nbsp;</span></p>
            <p className="c0 c1"><span className="c6"></span></p>
            <p className="c0"><span className="c2">Claimant’s activities of daily living is mildly affected by .</span></p>
            <p className="c0 c1"><span className="c6"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c5 c15 c3">RECOMMENDATIONS: </span></p>
            <p className="c0 c1"><span className="c5 c15 c3"></span></p>
            <p className="c0"><span className="c2">For --- claimant would benefit from multimodal pain management, physical therapy if not improved then spinal surgeon referral.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">Claimant would benefit from establishing a PCP for </span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c2">For anxiety and depression, claimant would benefit from psychiatric evaluation and counselling along with medication management.</span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0 c1"><span className="c2"></span></p>
            <p className="c0"><span className="c7 c3">Imaging reviewed: </span></p>
            <p className="c0"><span className="c3">{assessment?.imagingReviewed || '[No imaging reviewed]'}</span></p>
            <p className="c0 c1"><span className="c6"></span></p>
            <p className="c0 c1"><span className="c6"></span></p>
            <p className="c0"><span className="c2">STATEMENT RE REVIEW OF MEDICAL RECORDS: </span></p>
            <p className="c0"><span className="c2">I have reviewed the patient’s medical history and radiological studies, if any, given to me to the best of my ability. I have performed a thorough history and physical examination of the patient to the best of my ability. The information in this document is based on the information given to me by the patient. </span></p>
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
