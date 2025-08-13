import jsPDF from 'jspdf';
import type { FloridaCEExamForm } from '../types/comprehensive-medical-form';

export class PDFGeneratorService {
  private doc: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private currentY: number;
  private margin: number;
  private pageNumber: number;
  private totalPages: number;
  private lineHeight: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.currentY = 20;
    this.margin = 20;
    this.pageNumber = 1;
    this.totalPages = 1;
    this.lineHeight = 5; // Tighter spacing to match preview
  }

  /**
   * Generate PDF from complete form data
   */
  /**
   * Generate a safe PDF filename from form data.
   */
  public getPDFFilename(formData: Partial<FloridaCEExamForm>): string {
    const patientName = formData.header?.claimantName || 'Unknown';
    const examDate = formData.header?.examDate || new Date().toISOString().split('T')[0];
    const safePatientName = patientName.replace(/[^a-zA-Z0-9_]/g, '_');
    const safeExamDate = examDate.replace(/-/g, '');
    return `CE_Exam_${safePatientName}_${safeExamDate}.pdf`;
  }

  /**
   * Generate PDF from complete form data
   */
  public generatePDF(formData: Partial<FloridaCEExamForm>): Blob {
    // First pass: generate content and count pages
    this.generateContent(formData);
    this.totalPages = this.pageNumber;
    
    // Second pass: regenerate with correct page numbers
    this.doc = new jsPDF();
    this.currentY = 20;
    this.pageNumber = 1;
    this.generateContent(formData);
    
    // Add final page number to last page
    this.addPageNumber();

    // Return PDF as blob
    return new Blob([this.doc.output('blob')], { type: 'application/pdf' });
  }

  /**
   * Generate PDF content
   */
  private generateContent(formData: Partial<FloridaCEExamForm>): void {
    this.addCEHeader(formData.header);
    this.addDisclaimer();
    this.addClaimantInfoBox(formData.header);
    
    // Add sections in CE Exam order
    if (formData.history) {
      this.addHistorySection(formData.history);
    }
    
    if (formData.functionalStatus) {
      this.addFunctionalStatusSection(formData.functionalStatus);
    }
    
    if (formData.medicalInfo) {
      this.addMedicalInfoSection(formData.medicalInfo);
    }
    
    if (formData.physicalExam) {
      this.addPhysicalExamSection(formData.physicalExam);
    }
    
    if (formData.rangeOfMotion) {
      this.addRangeOfMotionSection(formData.rangeOfMotion);
    }
    
    if (formData.gaitStation) {
      this.addGaitStationSection(formData.gaitStation);
    }
    
    if (formData.assessment) {
      this.addAssessmentSection(formData.assessment);
    }
  }

  /**
   * Add CE Exam header with exact format matching requirements
   */
  private addCEHeader(_headerData: any): void {
    // Add doctor/clinic information in top-right corner
    this.doc.setFontSize(8); // Smaller to match 11pt Calibri
    this.doc.setFont('helvetica', 'normal');
    
    const rightMargin = this.pageWidth - this.margin;
    
    // Line 1: Doctor information
    const doctorLine1 = 'Dr. FNAME LNAME, MD, FACP. 1234, W SR 001, Suite 1004,';
    const doctorLine1Width = this.doc.getTextWidth(doctorLine1);
    this.doc.text(doctorLine1, rightMargin - doctorLine1Width, this.currentY);
    this.currentY += 5;
    
    // Line 2: Board certification and address
    const doctorLine2 = 'Diplomate of American Board of Internal Medicine. Atlanta, GA, 32750.';
    const doctorLine2Width = this.doc.getTextWidth(doctorLine2);
    this.doc.text(doctorLine2, rightMargin - doctorLine2Width, this.currentY);
    this.currentY += 5;
    
    // Line 3: Clinic and phone
    const doctorLine3 = 'EZMEDTECH HEALTH & WELLNESS CENTER. Phone: 888-999-0000';
    const doctorLine3Width = this.doc.getTextWidth(doctorLine3);
    this.doc.text(doctorLine3, rightMargin - doctorLine3Width, this.currentY);
    this.currentY += 12;
    
    // Reset position for centered title
    this.currentY = Math.max(this.currentY, 35); // Ensure enough space below header info
    
    // Centered title - larger and bold
    this.doc.setFontSize(11); // Match 14pt Calibri in preview
    this.doc.setFont('helvetica', 'bold');
    
    const title = 'TO: FLORIDA DIVISION OF DISABILITY DETERMINATION';
    const titleWidth = this.doc.getTextWidth(title);
    this.doc.text(title, (this.pageWidth - titleWidth) / 2, this.currentY);
    this.currentY += 12;
    
    // Add horizontal line separator
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 10;
  }

  /**
   * Add claimant info box with exact CE Exam format
   */
  private addClaimantInfoBox(data: any): void {
    if (!data) return;
    
    // Create box for claimant info with proper spacing
    const boxHeight = 35;
    const boxY = this.currentY;
    
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, boxY, this.pageWidth - (this.margin * 2), boxHeight);
    
    // Set font for labels and content
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    // Position for first line of fields
    let fieldY = boxY + 8;
    const leftColumn = this.margin + 5;
    const rightColumn = this.pageWidth / 2 + 10;
    
    // First line: CLAIMANT'S NAME and DOB
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CLAIMANT\'S NAME:', leftColumn, fieldY);
    this.doc.setFont('helvetica', 'normal');
    const claimantName = data.claimantName || '___________________________';
    this.doc.text(claimantName, leftColumn + 45, fieldY);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DOB:', rightColumn, fieldY);
    this.doc.setFont('helvetica', 'normal');
    const dob = data.dateOfBirth || '______________';
    this.doc.text(dob, rightColumn + 15, fieldY);
    
    // Second line: DATE/TIME and CASE NUMBER
    fieldY += 12;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DATE/TIME:', leftColumn, fieldY);
    this.doc.setFont('helvetica', 'normal');
    const examDate = data.examDate || '____________________';
    this.doc.text(examDate, leftColumn + 30, fieldY);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CASE NUMBER:', rightColumn, fieldY);
    this.doc.setFont('helvetica', 'normal');
    const caseNumber = data.caseNumber || '____________________';
    this.doc.text(caseNumber, rightColumn + 35, fieldY);
    
    this.currentY += boxHeight + 15;
  }

  /**
   * Add CE Exam disclaimer text with exact format
   */
  private addDisclaimer(): void {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    const disclaimer = 'This examination was performed for the sole purpose of providing information to the State of Florida Department of Health ' +
      'regarding the claimant\'s application for Social Security Disability benefits. The examination findings contained herein are ' +
      'based solely on the examination performed on the date indicated above and do not constitute a comprehensive ' +
      'medical evaluation. This report is not intended to be used for treatment purposes or to establish ' +
      'a physician-patient relationship. The examiner has no prior knowledge of the claimant\'s medical history ' +
      'other than information provided in the referral documentation.';
    
    const splitDisclaimer = this.doc.splitTextToSize(disclaimer, this.pageWidth - (this.margin * 2));
    this.doc.text(splitDisclaimer, this.margin, this.currentY);
    this.currentY += splitDisclaimer.length * this.lineHeight + 20;
  }

  /**
   * Add CE Exam section with proper formatting
   */
  private addCESection(title: string, content?: string | string[]): void {
    this.checkPageBreak(20);
    
    // Section header in ALL CAPS with underline
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    const upperTitle = title.toUpperCase();
    this.doc.text(upperTitle, this.margin, this.currentY);
    
    // Underline section header
    const titleWidth = this.doc.getTextWidth(upperTitle);
    this.doc.line(this.margin, this.currentY + 1, this.margin + titleWidth, this.currentY + 1);
    this.currentY += 12;
    
    // Section content
    if (content) {
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');
      
      if (Array.isArray(content)) {
        content.forEach(item => {
          if (item.trim()) {
            const splitText = this.doc.splitTextToSize(`• ${item}`, this.pageWidth - (this.margin * 2));
            this.checkPageBreak(splitText.length * this.lineHeight);
            this.doc.text(splitText, this.margin, this.currentY);
            this.currentY += splitText.length * this.lineHeight + 2;
          }
        });
      } else if (content) {
        const splitText = this.doc.splitTextToSize(content, this.pageWidth - (this.margin * 2));
        this.checkPageBreak(splitText.length * this.lineHeight);
        this.doc.text(splitText, this.margin, this.currentY);
        this.currentY += splitText.length * this.lineHeight + 5;
      }
      
      this.currentY += 5;
    }
  }

  /**
   * Add subsection with bold title
   */
  private addSubsection(title: string, content: string): void {
    if (!content) return;
    
    this.checkPageBreak(15);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`${title}:`, this.margin, this.currentY);
    this.currentY += 8;
    
    this.doc.setFont('helvetica', 'normal');
    const splitText = this.doc.splitTextToSize(content, this.pageWidth - (this.margin * 2));
    this.checkPageBreak(splitText.length * this.lineHeight);
    this.doc.text(splitText, this.margin, this.currentY);
    this.currentY += splitText.length * this.lineHeight + 8;
  }

  /**
   * Add page break and update page number
   */
  private addPageBreak(): void {
    this.addPageNumber();
    this.doc.addPage();
    this.currentY = 20;
    this.pageNumber++;
  }

  /**
   * Check if page break is needed
   */
  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.addPageBreak();
    }
  }

  /**
   * Add page number at bottom right with "Page X of Y" format
   */
  private addPageNumber(): void {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const pageText = `Page ${this.pageNumber} of ${this.totalPages}`;
    const textWidth = this.doc.getTextWidth(pageText);
    this.doc.text(pageText, this.pageWidth - this.margin - textWidth, this.pageHeight - 10);
  }

  /**
   * Format vital signs data
   */
  private formatVitalSigns(data: any): string {
    if (!data) return 'Not documented';
    
    const vitals: string[] = [];
    
    if (data.bloodPressure) {
      vitals.push(`Blood Pressure: ${data.bloodPressure.systolic || ''}/${data.bloodPressure.diastolic || ''} mmHg`);
    }
    
    if (data.heartRate) {
      vitals.push(`Heart Rate: ${data.heartRate.rate || ''} bpm`);
    }
    
    if (data.respiratoryRate) {
      vitals.push(`Respiratory Rate: ${data.respiratoryRate} breaths/min`);
    }
    
    if (data.temperature) {
      vitals.push(`Temperature: ${data.temperature.value || ''}°${data.temperature.unit || 'F'}`);
    }
    
    if (data.oxygenSaturation) {
      vitals.push(`Oxygen Saturation: ${data.oxygenSaturation}%`);
    }
    
    if (data.height) {
      vitals.push(`Height: ${data.height.feet || ''}'${data.height.inches || ''}" (${data.height.cm || ''} cm)`);
    }
    
    if (data.weight) {
      vitals.push(`Weight: ${data.weight.pounds || ''} lbs (${data.weight.kg || ''} kg)`);
    }
    
    return vitals.join('\n');
  }

  /**
   * Add history section in CE format
   */
  private addHistorySection(data: any): void {
    this.addCESection('History');
    
    if (data.age || data.gender) {
      this.addSubsection('Demographics', `Age: ${data.age || 'Not specified'}, Gender: ${data.gender || 'Not specified'}`);
    }
    
    if (data.historyOfPresentIllness) {
      this.addSubsection('History of Present Illness', data.historyOfPresentIllness);
    }
  }

  /**
   * Add functional status section in CE format
   */
  private addFunctionalStatusSection(data: any): void {
    this.addCESection('Functional Status');
    
    const functionalData = [
      { label: 'Dominant Hand', value: data.dominantHand },
      { label: 'Sitting - Worst Day', value: data.sittingWorstDay },
      { label: 'Sitting - Best Day', value: data.sittingBestDay },
      { label: 'Standing - Worst Day', value: data.standingWorstDay },
      { label: 'Standing - Best Day', value: data.standingBestDay },
      { label: 'Walking - Worst Day', value: data.walkingWorstDay },
      { label: 'Walking - Best Day', value: data.walkingBestDay },
      { label: 'Cooking/Meal Prep', value: data.cookingMealPrep },
      { label: 'Bathing/Showering', value: data.bathingShowering },
      { label: 'Dressing', value: data.dressing }
    ];
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    functionalData.forEach(item => {
      if (item.value) {
        this.checkPageBreak(this.lineHeight);
        this.doc.text(`${item.label}: ${item.value}`, this.margin, this.currentY);
        this.currentY += this.lineHeight + 2;
      }
    });
    
    this.currentY += 10;
  }

  /**
   * Add medical info section in CE format
   */
  private addMedicalInfoSection(data: any): void {
    this.addCESection('Medical Information');
    
    if (data.currentMedications) {
      this.addSubsection('Current Medications', 
        Array.isArray(data.currentMedications) && data.currentMedications.length > 0 
          ? data.currentMedications.join(', ') 
          : 'None reported'
      );
    }
    
    if (data.allergies) {
      this.addSubsection('Allergies', 
        Array.isArray(data.allergies) && data.allergies.length > 0 
          ? data.allergies.join(', ') 
          : 'NKDA (No Known Drug Allergies)'
      );
    }
    
    if (data.surgicalHistory) {
      this.addSubsection('Surgical History', data.surgicalHistory);
    }
    
    if (data.familyHistory) {
      this.addSubsection('Family History', data.familyHistory);
    }
    
    if (data.socialHistory) {
      this.addSubsection('Social History', data.socialHistory);
    }
  }

  /**
   * Add physical exam section in CE format
   */
  private addPhysicalExamSection(data: any): void {
    this.addCESection('Physical Examination');
    
    if (data.generalAppearance) {
      this.addSubsection('General Appearance', data.generalAppearance);
    }
    
    if (data.vitalSigns) {
      this.addSubsection('Vital Signs', this.formatVitalSigns(data.vitalSigns));
    }
    
    if (data.cardiovascular) {
      this.addSubsection('Cardiovascular', data.cardiovascular);
    }
    
    if (data.respiratory) {
      this.addSubsection('Respiratory', data.respiratory);
    }
    
    if (data.musculoskeletal) {
      this.addSubsection('Musculoskeletal', data.musculoskeletal);
    }
    
    if (data.neurological) {
      this.addSubsection('Neurological', data.neurological);
    }
    
    if (data.neuromuscularStrength) {
      this.addNeuroMuscularStrengthSection(data.neuromuscularStrength);
    }
    
    if (data.fineGrossManipulativeSkills) {
      this.addManipulativeSkillsSection(data.fineGrossManipulativeSkills);
    }
    
    if (data.reflexes) {
      this.addReflexesSection(data.reflexes);
    }
  }

  /**
   * Add CE formatted table with headers and rows
   */
  /**
   * Add range of motion section with exact CE Exam table format
   */
  private addRangeOfMotionSection(data: any): void {
    this.addCESection('Range of Motion');
    
    // CERVICAL SPINE table
    if (data?.cervicalSpine) {
      this.addCervicalSpineTable(data.cervicalSpine);
    }
    
    // LUMBAR SPINE table
    if (data?.lumbarSpine) {
      this.addLumbarSpineTable(data.lumbarSpine);
    }
    
    // SHOULDER table (bilateral)
    if (data?.shoulders) {
      this.addBilateralJointTable('SHOULDER', data.shoulders, [
        'Flexion',
        'Extension', 
        'Abduction',
        'Adduction',
        'Internal Rotation',
        'External Rotation'
      ]);
    }
    
    // ELBOW table (bilateral)
    if (data?.elbows) {
      this.addBilateralJointTable('ELBOW', data.elbows, [
        'Flexion',
        'Pronation',
        'Supination'
      ]);
    }
    
    // WRIST table (bilateral)
    if (data?.wrists) {
      this.addBilateralJointTable('WRIST', data.wrists, [
        'Flexion',
        'Extension',
        'Ulnar Deviation',
        'Radial Deviation'
      ]);
    }
    
    // HIP table (bilateral)
    if (data?.hips) {
      this.addBilateralJointTable('HIP', data.hips, [
        'Flexion',
        'Extension',
        'Abduction',
        'Adduction',
        'Internal Rotation',
        'External Rotation'
      ]);
    }
    
    // KNEE table (bilateral)
    if (data?.knees) {
      this.addBilateralJointTable('KNEE', data.knees, [
        'Flexion',
        'Extension'
      ]);
    }
    
    // ANKLE table (bilateral)
    if (data?.ankles) {
      this.addBilateralJointTable('ANKLE', data.ankles, [
        'Dorsiflexion',
        'Plantarflexion',
        'Inversion',
        'Eversion'
      ]);
    }
    
    // Add EFFORT ON EXAM at the end
    this.currentY += 10;
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('EFFORT ON EXAM: GOOD _X_ FAIR ___ POOR ___', this.margin, this.currentY);
    this.currentY += 15;
  }

  /**
   * Add CERVICAL SPINE table with exact CE format
   */
  private addCervicalSpineTable(data: any): void {
    this.checkPageBreak(60);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CERVICAL SPINE', this.margin, this.currentY);
    this.currentY += 10;
    
    // Table dimensions
    const tableY = this.currentY;
    const tableWidth = this.pageWidth - (this.margin * 2);
    const colWidth = tableWidth / 2;
    const rowHeight = 12;
    
    // Table border
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, tableY, tableWidth, rowHeight * 4);
    
    // Vertical line to separate columns
    this.doc.line(this.margin + colWidth, tableY, this.margin + colWidth, tableY + (rowHeight * 4));
    
    // Horizontal lines for rows
    for (let i = 1; i < 4; i++) {
      this.doc.line(this.margin, tableY + (rowHeight * i), this.margin + tableWidth, tableY + (rowHeight * i));
    }
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    // Row 1: Forward Flexion
    const flexion = data?.flexion?.active || data?.forwardFlexion || '';
    this.doc.text('Forward Flexion (0-60):', this.margin + 2, tableY + 8);
    this.doc.text(`${flexion}`, this.margin + colWidth + 2, tableY + 8);
    
    // Row 2: Extension
    const extension = data?.extension?.active || '';
    this.doc.text('Extension (0-60):', this.margin + 2, tableY + rowHeight + 8);
    this.doc.text(`${extension}`, this.margin + colWidth + 2, tableY + rowHeight + 8);
    
    // Row 3: Lateral Flexion
    const latFlexR = data?.lateralFlexionRight?.active || data?.rightLateralFlexion || '';
    const latFlexL = data?.lateralFlexionLeft?.active || data?.leftLateralFlexion || '';
    this.doc.text('Lateral Flexion (0-45):', this.margin + 2, tableY + (rowHeight * 2) + 8);
    this.doc.text(`R=${latFlexR} L=${latFlexL}`, this.margin + colWidth + 2, tableY + (rowHeight * 2) + 8);
    
    // Row 4: Rotation
    const rotR = data?.rotationRight?.active || data?.rightRotation || '';
    const rotL = data?.rotationLeft?.active || data?.leftRotation || '';
    this.doc.text('Rotation (0-80):', this.margin + 2, tableY + (rowHeight * 3) + 8);
    this.doc.text(`R=${rotR} L=${rotL}`, this.margin + colWidth + 2, tableY + (rowHeight * 3) + 8);
    
    this.currentY = tableY + (rowHeight * 4) + 15;
  }

  /**
   * Add LUMBAR SPINE table with exact CE format
   */
  private addLumbarSpineTable(data: any): void {
    this.checkPageBreak(50);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('LUMBAR SPINE', this.margin, this.currentY);
    this.currentY += 10;
    
    // Table dimensions
    const tableY = this.currentY;
    const tableWidth = this.pageWidth - (this.margin * 2);
    const colWidth = tableWidth / 2;
    const rowHeight = 12;
    
    // Table border
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, tableY, tableWidth, rowHeight * 3);
    
    // Vertical line to separate columns
    this.doc.line(this.margin + colWidth, tableY, this.margin + colWidth, tableY + (rowHeight * 3));
    
    // Horizontal lines for rows
    for (let i = 1; i < 3; i++) {
      this.doc.line(this.margin, tableY + (rowHeight * i), this.margin + tableWidth, tableY + (rowHeight * i));
    }
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    // Row 1: Forward Flexion
    const flexion = data?.flexion?.active || data?.forwardFlexion || '';
    this.doc.text('Forward Flexion (0-90):', this.margin + 2, tableY + 8);
    this.doc.text(`${flexion}`, this.margin + colWidth + 2, tableY + 8);
    
    // Row 2: Extension
    const extension = data?.extension?.active || '';
    this.doc.text('Extension (0-25):', this.margin + 2, tableY + rowHeight + 8);
    this.doc.text(`${extension}`, this.margin + colWidth + 2, tableY + rowHeight + 8);
    
    // Row 3: Lateral Flexion
    const latFlexR = data?.lateralFlexionRight?.active || data?.rightLateralFlexion || '';
    const latFlexL = data?.lateralFlexionLeft?.active || data?.leftLateralFlexion || '';
    this.doc.text('Lateral Flexion (0-25):', this.margin + 2, tableY + (rowHeight * 2) + 8);
    this.doc.text(`R=${latFlexR} L=${latFlexL}`, this.margin + colWidth + 2, tableY + (rowHeight * 2) + 8);
    
    this.currentY = tableY + (rowHeight * 3) + 15;
  }

  /**
   * Add bilateral joint table with exact CE format (Movement | R=[value] | L=[value])
   */
  private addBilateralJointTable(jointName: string, data: any, movements: string[]): void {
    this.checkPageBreak(20 + (movements.length * 12));
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(jointName, this.margin, this.currentY);
    this.currentY += 10;
    
    // Table dimensions
    const tableY = this.currentY;
    const tableWidth = this.pageWidth - (this.margin * 2);
    const col1Width = tableWidth * 0.5; // Movement column
    const col2Width = tableWidth * 0.25; // Right column
    const rowHeight = 12;
    
    // Table border
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, tableY, tableWidth, rowHeight * movements.length);
    
    // Vertical lines for columns
    this.doc.line(this.margin + col1Width, tableY, this.margin + col1Width, tableY + (rowHeight * movements.length));
    this.doc.line(this.margin + col1Width + col2Width, tableY, this.margin + col1Width + col2Width, tableY + (rowHeight * movements.length));
    
    // Horizontal lines for rows
    for (let i = 1; i < movements.length; i++) {
      this.doc.line(this.margin, tableY + (rowHeight * i), this.margin + tableWidth, tableY + (rowHeight * i));
    }
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    // Add movement data
    movements.forEach((movement, index) => {
      const rowY = tableY + (rowHeight * index) + 8;
      const movementKey = movement.toLowerCase().replace(/\s+/g, '');
      
      // Movement name
      this.doc.text(movement, this.margin + 2, rowY);
      
      // Right value
      const rightValue = data?.right?.[movementKey]?.active || data?.right?.[movementKey] || '';
      this.doc.text(`R=${rightValue}`, this.margin + col1Width + 2, rowY);
      
      // Left value
      const leftValue = data?.left?.[movementKey]?.active || data?.left?.[movementKey] || '';
      this.doc.text(`L=${leftValue}`, this.margin + col1Width + col2Width + 2, rowY);
    });
    
    this.currentY = tableY + (rowHeight * movements.length) + 15;
  }

  /**
   * Add gait and station section in CE format
   */
  private addGaitStationSection(data: any): void {
    this.addCESection('Gait and Station');
    
    // Degrees of Difficulty in Performance section
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Degrees of Difficulty in Performance:', this.margin, this.currentY);
    this.currentY += 12;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const performanceItems = [
      {
        text: 'Getting on and off examination table:',
        value: data?.performance?.examinationTable || 'able to perform with no difficulty'
      },
      {
        text: 'Walking on Heels:',
        value: data?.performance?.walkingOnHeels || 'able to perform'
      },
      {
        text: 'Walking on Toes:',
        value: data?.performance?.walkingOnToes || 'able to perform'
      },
      {
        text: 'Squatting and rising:',
        value: data?.performance?.squattingRising || 'able to perform'
      },
      {
        text: 'Finger to Nose:',
        value: data?.performance?.fingerToNose || 'intact'
      },
      {
        text: 'Straight leg raise test:',
        value: data?.performance?.straightLegRaise || 'Negative'
      }
    ];
    
    performanceItems.forEach(item => {
      this.checkPageBreak(this.lineHeight);
      this.doc.text(`${item.text} ${item.value}.`, this.margin, this.currentY);
      this.currentY += this.lineHeight + 2;
    });
    
    this.currentY += 10;
    
    // ASSISTIVE DEVICE section
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ASSISTIVE DEVICE:', this.margin, this.currentY);
    this.currentY += 12;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    // Gait and Station description
    const gaitDescription = data?.gait?.description || 'Normal gait and normal station';
    this.doc.text(`Gait and Station: ${gaitDescription}.`, this.margin, this.currentY);
    this.currentY += this.lineHeight + 4;
    
    // Assistive device type
    const deviceType = data?.assistiveDevice?.type || 'does not use any';
    this.doc.text(`What type of assistive device is used: ${deviceType}.`, this.margin, this.currentY);
    this.currentY += this.lineHeight + 4;
    
    // Medical conditions
    const medicalConditions = data?.assistiveDevice?.medicalConditions || 'N/A';
    this.doc.text(`Medical conditions used for: ${medicalConditions}.`, this.margin, this.currentY);
    this.currentY += this.lineHeight + 4;
    
    // Necessity questions
    if (data?.assistiveDevice?.necessity) {
      this.doc.text('Questions about necessity and circumstances:', this.margin, this.currentY);
      this.currentY += this.lineHeight + 2;
      this.doc.text(`${data.assistiveDevice.necessity}`, this.margin + 10, this.currentY);
      this.currentY += this.lineHeight + 4;
    }
    
    // Patient cooperation
    const cooperation = data?.patientCooperation !== undefined ? 
      (data.patientCooperation ? 'Yes' : 'No') : 'Yes';
    this.doc.text(`Was patient fully cooperative: ${cooperation}.`, this.margin, this.currentY);
    this.currentY += 15;
  }

  /**
   * Add assessment section in CE format with bullet points and underlined headers
   */
  private addAssessmentSection(data: any): void {
    this.addCESection('Assessment');
    
    // 1. DIAGNOSIS/ASSESSMENT with bullet points
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DIAGNOSIS/ASSESSMENT:', this.margin, this.currentY);
    this.currentY += 12;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    if (data?.diagnosisAssessment) {
      // Convert to bullet points if not already formatted
      const diagnoses = Array.isArray(data.diagnosisAssessment) 
        ? data.diagnosisAssessment 
        : data.diagnosisAssessment.split('\n').filter((line: string) => line.trim());
      
      diagnoses.forEach((diagnosis: string) => {
        this.checkPageBreak(this.lineHeight);
        const bulletText = diagnosis.trim().startsWith('•') ? diagnosis.trim() : `• ${diagnosis.trim()}`;
        this.doc.text(bulletText, this.margin, this.currentY);
        this.currentY += this.lineHeight + 2;
      });
    } else {
      this.doc.text('• To be determined based on examination findings', this.margin, this.currentY);
      this.currentY += this.lineHeight + 2;
    }
    
    this.currentY += 10;
    
    // 2. MEDICAL SOURCE STATEMENT (underlined)
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    const medicalSourceText = 'MEDICAL SOURCE STATEMENT';
    this.doc.text(medicalSourceText, this.margin, this.currentY);
    const medicalSourceWidth = this.doc.getTextWidth(medicalSourceText);
    this.doc.line(this.margin, this.currentY + 1, this.margin + medicalSourceWidth, this.currentY + 1);
    this.currentY += 8;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('(functional abilities and specific restrictions):', this.margin, this.currentY);
    this.currentY += 15;
    
    // Abilities section
    this.doc.setFont('helvetica', 'bold');
    const abilitiesText = 'Abilities:';
    this.doc.text(abilitiesText, this.margin, this.currentY);
    const abilitiesWidth = this.doc.getTextWidth(abilitiesText);
    this.doc.line(this.margin, this.currentY + 1, this.margin + abilitiesWidth, this.currentY + 1);
    this.currentY += 12;
    
    this.doc.setFont('helvetica', 'normal');
    const abilitiesIntro = 'Based on the physical examination conducted today, the clinical findings are as follows:';
    this.doc.text(abilitiesIntro, this.margin, this.currentY);
    this.currentY += this.lineHeight + 4;
    
    const claimantAbilities = data?.medicalSourceStatement?.abilities || 
      'Claimant is able to stand, walk, sit, lift, carry, push, pull, reach, handle, finger, and feel within normal limits.';
    const splitAbilities = this.doc.splitTextToSize(`Claimant is able to ${claimantAbilities}`, this.pageWidth - (this.margin * 2));
    this.checkPageBreak(splitAbilities.length * this.lineHeight);
    this.doc.text(splitAbilities, this.margin, this.currentY);
    this.currentY += splitAbilities.length * this.lineHeight + 8;
    
    // Understanding, memory, sustained concentration (italic)
    this.doc.setFont('helvetica', 'italic');
    const mentalStatus = data?.medicalSourceStatement?.understandingMemoryConcentration || 'Normal';
    this.doc.text(`Understanding, memory, sustained concentration: ${mentalStatus}.`, this.margin, this.currentY);
    this.currentY += this.lineHeight + 8;
    
    // Limitations section
    this.doc.setFont('helvetica', 'bold');
    const limitationsText = 'Limitations:';
    this.doc.text(limitationsText, this.margin, this.currentY);
    const limitationsWidth = this.doc.getTextWidth(limitationsText);
    this.doc.line(this.margin, this.currentY + 1, this.margin + limitationsWidth, this.currentY + 1);
    this.currentY += 12;
    
    this.doc.setFont('helvetica', 'normal');
    const limitations = data?.medicalSourceStatement?.limitations || 'No significant limitations noted based on today\'s examination.';
    const splitLimitations = this.doc.splitTextToSize(limitations, this.pageWidth - (this.margin * 2));
    this.checkPageBreak(splitLimitations.length * this.lineHeight);
    this.doc.text(splitLimitations, this.margin, this.currentY);
    this.currentY += splitLimitations.length * this.lineHeight + 15;
    
    // 3. RECOMMENDATIONS
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RECOMMENDATIONS:', this.margin, this.currentY);
    this.currentY += 12;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const recommendations = data?.recommendations || 
      'Continue current treatment plan. Follow up with primary care physician as needed. Return to work/activities as tolerated.';
    const splitRecommendations = this.doc.splitTextToSize(recommendations, this.pageWidth - (this.margin * 2));
    this.checkPageBreak(splitRecommendations.length * this.lineHeight);
    this.doc.text(splitRecommendations, this.margin, this.currentY);
    this.currentY += splitRecommendations.length * this.lineHeight + 20;
    
    // 4. Examiner info and date at bottom
    this.addExaminerSignature(data);
  }

  /**
   * Add examiner signature block at bottom of assessment
   */
  private addExaminerSignature(data: any): void {
    this.checkPageBreak(60);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    // Add signature image if present
    if (data?.examinerSignature) {
      try {
        // Add signature image with exact preview dimensions
        this.doc.addImage(
          data.examinerSignature,
          'PNG',
          this.margin,
          this.currentY,
          60, // width - match preview scaling
          20  // height - match preview scaling
        );
        this.currentY += 25;
      } catch (error) {
        console.warn('Could not add signature image to PDF:', error);
        // Fallback to text placeholder
        this.doc.setFont('helvetica', 'italic');
        this.doc.setFontSize(10);
        this.doc.text('[Digital Signature]', this.margin, this.currentY);
        this.currentY += this.lineHeight + 8;
      }
    } else {
      // No signature provided
      this.doc.setFont('helvetica', 'italic');
      this.doc.setFontSize(10);
      this.doc.text('[Digital signature required]', this.margin, this.currentY);
      this.currentY += this.lineHeight + 8;
    }
    
    // Examiner name with exact preview formatting
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    const examinerName = data?.examinerInfo?.name || 'Dr. FNAME LNAME';
    this.doc.text(`Examiner: ${examinerName}.`, this.margin, this.currentY);
    this.currentY += this.lineHeight + 4;
    
    // Clinic name
    const clinicName = data?.examinerInfo?.facility || 'EZMEDTECH Health & Wellness Center';
    this.doc.text(`${clinicName}.`, this.margin, this.currentY);
    this.currentY += this.lineHeight + 4;
    
    // Date
    const examDate = data?.examinerInfo?.date || new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
    this.doc.text(`Date: ${examDate}.`, this.margin, this.currentY);
    this.currentY += 20;
  }

  /**
   * Add neuromuscular strength section in CE format
   */
  private addNeuroMuscularStrengthSection(data: any): void {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('NEUROMUSCULAR STRENGTH:', this.margin, this.currentY);
    this.currentY += 12;
    
    // Add scale explanation
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'italic');
    this.doc.text('Scale: 0 = No visible or palpable contraction, 1 = Visible or palpable contraction,', this.margin, this.currentY);
    this.currentY += 8;
    this.doc.text('2 = Active ROM, gravity eliminated, 3 = Active ROM against gravity,', this.margin, this.currentY);
    this.currentY += 8;
    this.doc.text('4 = Active ROM against gravity, some resistance, 5 = Active ROM against gravity, maximum resistance', this.margin, this.currentY);
    this.currentY += 12;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const strengthData = [
      `Right upper extremity: ${data.rightUpperExtremity !== undefined ? data.rightUpperExtremity + '/5' : '5/5'}`,
      `Left upper extremity: ${data.leftUpperExtremity !== undefined ? data.leftUpperExtremity + '/5' : '5/5'}`,
      `Right lower extremity: ${data.rightLowerExtremity !== undefined ? data.rightLowerExtremity + '/5' : '5/5'}`,
      `Left lower extremity: ${data.leftLowerExtremity !== undefined ? data.leftLowerExtremity + '/5' : '5/5'}`,
      `Right grip strength: ${data.rightGrip !== undefined ? data.rightGrip + '/5' : '5/5'}`,
      `Left grip strength: ${data.leftGrip !== undefined ? data.leftGrip + '/5' : '5/5'}`
    ];
    
    strengthData.forEach(item => {
      this.checkPageBreak(this.lineHeight);
      this.doc.text(item, this.margin, this.currentY);
      this.currentY += this.lineHeight + 2;
    });
    
    if (data.dexterityAssessment) {
      this.currentY += 5;
      this.addSubsection('Dexterity Assessment', data.dexterityAssessment);
    }
    
    this.currentY += 10;
  }

  /**
   * Add manipulative skills section in CE format
   */
  private addManipulativeSkillsSection(data: any): void {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('FINE & GROSS MANIPULATIVE SKILLS:', this.margin, this.currentY);
    this.currentY += 12;
    
    // Add descriptive text
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Claimant is able to pinch, grasp and manipulate small and large objects with both hands.', this.margin, this.currentY);
    this.currentY += 15;
    
    // Create table for ratings
    this.checkPageBreak(60);
    
    const tableY = this.currentY;
    const tableWidth = this.pageWidth - (this.margin * 2);
    const col1Width = tableWidth * 0.5; // Task column
    const col2Width = tableWidth * 0.25; // Left column
    const rowHeight = 12;
    
    const tasks = ['Buttoning', 'Zipping', 'Picking up coin', 'Tying shoelaces'];
    
    // Table border
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, tableY, tableWidth, rowHeight * (tasks.length + 1));
    
    // Header row
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Task', this.margin + 2, tableY + 8);
    this.doc.text('LEFT', this.margin + col1Width + 2, tableY + 8);
    this.doc.text('RIGHT', this.margin + col1Width + col2Width + 2, tableY + 8);
    
    // Vertical lines for columns
    this.doc.line(this.margin + col1Width, tableY, this.margin + col1Width, tableY + (rowHeight * (tasks.length + 1)));
    this.doc.line(this.margin + col1Width + col2Width, tableY, this.margin + col1Width + col2Width, tableY + (rowHeight * (tasks.length + 1)));
    
    // Horizontal lines for rows
    for (let i = 1; i <= tasks.length; i++) {
      this.doc.line(this.margin, tableY + (rowHeight * i), this.margin + tableWidth, tableY + (rowHeight * i));
    }
    
    this.doc.setFont('helvetica', 'normal');
    
    // Add task data
    tasks.forEach((task, index) => {
      const rowY = tableY + (rowHeight * (index + 1)) + 8;
      const taskKey = task.toLowerCase().replace(/\s+/g, '');
      
      // Task name
      this.doc.text(task, this.margin + 2, rowY);
      
      // Left rating
      const leftRating = data?.[taskKey]?.left !== undefined ? `${data[taskKey].left}/5` : 'N/A';
      this.doc.text(leftRating, this.margin + col1Width + 2, rowY);
      
      // Right rating
      const rightRating = data?.[taskKey]?.right !== undefined ? `${data[taskKey].right}/5` : 'N/A';
      this.doc.text(rightRating, this.margin + col1Width + col2Width + 2, rowY);
    });
    
    this.currentY = tableY + (rowHeight * (tasks.length + 1)) + 15;
  }

  /**
   * Add reflexes section in CE format
   */
  private addReflexesSection(data: any): void {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('REFLEXES:', this.margin, this.currentY);
    this.currentY += 12;
    
    // Create table for reflexes
    this.checkPageBreak(60);
    
    const tableY = this.currentY;
    const tableWidth = this.pageWidth - (this.margin * 2);
    const col1Width = tableWidth * 0.5; // Reflex name column
    const col2Width = tableWidth * 0.25; // Right column
    const rowHeight = 12;
    
    const reflexes = ['Biceps', 'Triceps', 'Knee', 'Achilles'];
    
    // Table border
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, tableY, tableWidth, rowHeight * (reflexes.length + 1));
    
    // Header row
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('', this.margin + 2, tableY + 8); // Blank header for reflex names
    this.doc.text('Right', this.margin + col1Width + 2, tableY + 8);
    this.doc.text('Left', this.margin + col1Width + col2Width + 2, tableY + 8);
    
    // Vertical lines for columns
    this.doc.line(this.margin + col1Width, tableY, this.margin + col1Width, tableY + (rowHeight * (reflexes.length + 1)));
    this.doc.line(this.margin + col1Width + col2Width, tableY, this.margin + col1Width + col2Width, tableY + (rowHeight * (reflexes.length + 1)));
    
    // Horizontal lines for rows
    for (let i = 1; i <= reflexes.length; i++) {
      this.doc.line(this.margin, tableY + (rowHeight * i), this.margin + tableWidth, tableY + (rowHeight * i));
    }
    
    this.doc.setFont('helvetica', 'normal');
    
    // Add reflex data
    reflexes.forEach((reflex, index) => {
      const rowY = tableY + (rowHeight * (index + 1)) + 8;
      const reflexKey = reflex.toLowerCase();
      
      // Reflex name
      this.doc.text(reflex, this.margin + 2, rowY);
      
      // Right reflex
      const rightReflex = data?.[reflexKey]?.right || '2+';
      this.doc.text(rightReflex, this.margin + col1Width + 2, rowY);
      
      // Left reflex
      const leftReflex = data?.[reflexKey]?.left || '2+';
      this.doc.text(leftReflex, this.margin + col1Width + col2Width + 2, rowY);
    });
    
    this.currentY = tableY + (rowHeight * (reflexes.length + 1)) + 15;
  }
}
