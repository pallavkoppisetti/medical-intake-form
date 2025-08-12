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
    this.lineHeight = 6;
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
   * Add CE Exam header with proper formatting
   */
  private addCEHeader(_headerData: any): void {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    
    // Centered title
    const title = 'TO: FLORIDA DIVISION OF DISABILITY DETERMINATION';
    const titleWidth = this.doc.getTextWidth(title);
    this.doc.text(title, (this.pageWidth - titleWidth) / 2, this.currentY);
    this.currentY += 12;
    
    // Add horizontal line separator
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 15;
  }

  /**
   * Add claimant info box
   */
  private addClaimantInfoBox(data: any): void {
    if (!data) return;
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    
    // Create box for claimant info
    const boxHeight = 25;
    const boxY = this.currentY;
    
    this.doc.rect(this.margin, boxY, this.pageWidth - (this.margin * 2), boxHeight);
    
    // Add claimant info in format: NAME | DOB | DATE/TIME | CASE NUMBER
    const claimantName = data.claimantName || '';
    const dob = data.dateOfBirth || '';
    const examDate = data.examDate || '';
    const caseNumber = data.caseNumber || '';
    
    const infoLine = `NAME: ${claimantName} | DOB: ${dob} | DATE/TIME: ${examDate} | CASE NUMBER: ${caseNumber}`;
    
    // Calculate text position to center vertically in box
    const textY = boxY + (boxHeight / 2) + 2;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    // Split text if too long to fit in box
    const splitText = this.doc.splitTextToSize(infoLine, this.pageWidth - (this.margin * 2) - 4);
    this.doc.text(splitText, this.margin + 2, textY);
    
    this.currentY += boxHeight + 15;
  }

  /**
   * Add CE Exam disclaimer text
   */
  private addDisclaimer(): void {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    const disclaimer = 'This examination is being performed at the request of the Florida Division of Disability ' +
      'Determination for disability evaluation purposes only. The examination findings contained herein are ' +
      'based solely on the examination performed on the date indicated and do not constitute a comprehensive ' +
      'medical evaluation. This report is not intended to be used for treatment purposes or to establish ' +
      'a physician-patient relationship.';
    
    const splitDisclaimer = this.doc.splitTextToSize(disclaimer, this.pageWidth - (this.margin * 2));
    this.doc.text(splitDisclaimer, this.margin, this.currentY);
    this.currentY += splitDisclaimer.length * this.lineHeight + 15;
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
  private addCETable(headers: string[], rows: string[][]): void {
    const columnWidth = (this.pageWidth - (this.margin * 2)) / headers.length;
    const rowHeight = 8;
    
    this.checkPageBreak((rows.length + 2) * rowHeight);
    
    // Table headers with bold formatting
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    
    headers.forEach((header, index) => {
      const x = this.margin + (index * columnWidth);
      this.doc.text(header, x + 2, this.currentY + 5);
      this.doc.rect(x, this.currentY, columnWidth, rowHeight);
    });
    
    this.currentY += rowHeight;
    
    // Table rows with normal formatting
    this.doc.setFont('helvetica', 'normal');
    rows.forEach(row => {
      row.forEach((cell, index) => {
        const x = this.margin + (index * columnWidth);
        const cellText = this.doc.splitTextToSize(cell || '', columnWidth - 4);
        this.doc.text(cellText, x + 2, this.currentY + 5);
        this.doc.rect(x, this.currentY, columnWidth, rowHeight);
      });
      this.currentY += rowHeight;
    });
    
    this.currentY += 10;
  }

  /**
   * Add range of motion section with CE table format
   */
  private addRangeOfMotionSection(data: any): void {
    this.addCESection('Range of Motion');
    
    if (data.effortOnExam) {
      this.addSubsection('Effort on Examination', data.effortOnExam);
    }
    
    if (data.cervicalSpine) {
      this.addROMTable('CERVICAL SPINE', data.cervicalSpine, [
        { key: 'forwardFlexion', label: 'Forward Flexion', normal: '0-60°' },
        { key: 'extension', label: 'Extension', normal: '0-60°' },
        { key: 'lateralFlexionRight', label: 'Lateral Flexion R', normal: '0-45°' },
        { key: 'lateralFlexionLeft', label: 'Lateral Flexion L', normal: '0-45°' },
        { key: 'rotationRight', label: 'Rotation R', normal: '0-80°' },
        { key: 'rotationLeft', label: 'Rotation L', normal: '0-80°' }
      ]);
    }
    
    if (data.lumbarSpine) {
      this.addROMTable('LUMBAR SPINE', data.lumbarSpine, [
        { key: 'forwardFlexion', label: 'Forward Flexion', normal: '0-90°' },
        { key: 'extension', label: 'Extension', normal: '0-25°' },
        { key: 'lateralFlexionRight', label: 'Lateral Flexion R', normal: '0-25°' },
        { key: 'lateralFlexionLeft', label: 'Lateral Flexion L', normal: '0-25°' }
      ]);
    }
    
    if (data.shoulders) {
      this.addBilateralROMTable('SHOULDERS', data.shoulders, [
        { key: 'flexion', label: 'Flexion', normal: '0-180°' },
        { key: 'extension', label: 'Extension', normal: '0-60°' },
        { key: 'abduction', label: 'Abduction', normal: '0-180°' },
        { key: 'adduction', label: 'Adduction', normal: '0-50°' },
        { key: 'internalRotation', label: 'Internal Rotation', normal: '0-90°' },
        { key: 'externalRotation', label: 'External Rotation', normal: '0-90°' }
      ]);
    }
    
    if (data.elbows) {
      this.addBilateralROMTable('ELBOWS', data.elbows, [
        { key: 'flexion', label: 'Flexion', normal: '0-150°' },
        { key: 'pronation', label: 'Pronation', normal: '0-80°' },
        { key: 'supination', label: 'Supination', normal: '0-80°' }
      ]);
    }
    
    if (data.wrists) {
      this.addBilateralROMTable('WRISTS', data.wrists, [
        { key: 'flexion', label: 'Flexion', normal: '0-80°' },
        { key: 'extension', label: 'Extension', normal: '0-70°' },
        { key: 'ulnarDeviation', label: 'Ulnar Deviation', normal: '0-30°' },
        { key: 'radialDeviation', label: 'Radial Deviation', normal: '0-20°' }
      ]);
    }
    
    if (data.hands) {
      this.addBilateralROMTable('HANDS', data.hands, [
        { key: 'fingerFlexion', label: 'Finger Flexion', normal: '0-90°' },
        { key: 'thumbOpposition', label: 'Thumb Opposition', normal: '0-100°' }
      ]);
    }
    
    if (data.hips) {
      this.addBilateralROMTable('HIPS', data.hips, [
        { key: 'flexion', label: 'Flexion', normal: '0-120°' },
        { key: 'extension', label: 'Extension', normal: '0-30°' },
        { key: 'abduction', label: 'Abduction', normal: '0-45°' },
        { key: 'adduction', label: 'Adduction', normal: '0-30°' },
        { key: 'internalRotation', label: 'Internal Rotation', normal: '0-45°' },
        { key: 'externalRotation', label: 'External Rotation', normal: '0-45°' }
      ]);
    }
    
    if (data.knees) {
      this.addBilateralROMTable('KNEES', data.knees, [
        { key: 'flexion', label: 'Flexion', normal: '0-135°' },
        { key: 'extension', label: 'Extension', normal: '0°' }
      ]);
    }
    
    if (data.ankles) {
      this.addBilateralROMTable('ANKLES', data.ankles, [
        { key: 'dorsiflexion', label: 'Dorsiflexion', normal: '0-20°' },
        { key: 'plantarflexion', label: 'Plantarflexion', normal: '0-50°' },
        { key: 'inversion', label: 'Inversion', normal: '0-35°' },
        { key: 'eversion', label: 'Eversion', normal: '0-15°' }
      ]);
    }
  }

  /**
   * Add ROM table for single joints (like spine)
   */
  private addROMTable(title: string, data: any, movements: Array<{key: string, label: string, normal: string}>): void {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`${title}:`, this.margin, this.currentY);
    this.currentY += 10;
    
    const headers = ['Movement', 'Measured ROM', 'Normal Range'];
    const rows: string[][] = [];
    
    movements.forEach(movement => {
      if (data[movement.key] !== undefined) {
        rows.push([
          movement.label,
          `${data[movement.key]}°`,
          movement.normal
        ]);
      }
    });
    
    if (rows.length > 0) {
      this.addCETable(headers, rows);
    }
  }

  /**
   * Add ROM table for bilateral joints
   */
  private addBilateralROMTable(title: string, data: any, movements: Array<{key: string, label: string, normal: string}>): void {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`${title}:`, this.margin, this.currentY);
    this.currentY += 10;
    
    const headers = ['Movement', 'Right', 'Left', 'Normal Range'];
    const rows: string[][] = [];
    
    movements.forEach(movement => {
      const leftValue = data.left?.[movement.key];
      const rightValue = data.right?.[movement.key];
      
      if (leftValue !== undefined || rightValue !== undefined) {
        rows.push([
          movement.label,
          rightValue !== undefined ? `${rightValue}°` : 'N/A',
          leftValue !== undefined ? `${leftValue}°` : 'N/A',
          movement.normal
        ]);
      }
    });
    
    if (rows.length > 0) {
      this.addCETable(headers, rows);
    }
  }

  /**
   * Add gait and station section in CE format
   */
  private addGaitStationSection(data: any): void {
    this.addCESection('Gait and Station');
    
    if (data.gait) {
      this.addSubsection('Gait', 
        `Pattern: ${data.gait.pattern || 'Not documented'}\n` +
        `Speed: ${data.gait.speed || 'Not documented'}\n` +
        `Assistive Device: ${data.gait.assistiveDevice || 'None'}`
      );
    }
    
    if (data.station) {
      this.addSubsection('Station', 
        `Description: ${data.station.description || 'Not documented'}\n` +
        `Balance: ${data.station.balance || 'Not documented'}`
      );
    }
  }

  /**
   * Add assessment section in CE format with bullet points and underlined headers
   */
  private addAssessmentSection(data: any): void {
    this.addCESection('Assessment');
    
    if (data.diagnosisAssessment) {
      this.addSubsection('Diagnosis/Assessment', data.diagnosisAssessment);
    }
    
    if (data.medicalSourceStatement) {
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('MEDICAL SOURCE STATEMENT', this.margin, this.currentY);
      this.currentY += 12;
      
      if (data.medicalSourceStatement.abilities) {
        // Add underlined ABILITIES header
        this.doc.setFont('helvetica', 'bold');
        const abilitiesText = 'ABILITIES:';
        this.doc.text(abilitiesText, this.margin, this.currentY);
        const abilitiesWidth = this.doc.getTextWidth(abilitiesText);
        this.doc.line(this.margin, this.currentY + 1, this.margin + abilitiesWidth, this.currentY + 1);
        this.currentY += 10;
        
        this.doc.setFont('helvetica', 'normal');
        const splitAbilities = this.doc.splitTextToSize(data.medicalSourceStatement.abilities, this.pageWidth - (this.margin * 2));
        this.checkPageBreak(splitAbilities.length * this.lineHeight);
        this.doc.text(splitAbilities, this.margin, this.currentY);
        this.currentY += splitAbilities.length * this.lineHeight + 8;
      }
      
      if (data.medicalSourceStatement.understandingMemoryConcentration) {
        this.addSubsection('Understanding, Memory, and Concentration', data.medicalSourceStatement.understandingMemoryConcentration);
      }
      
      if (data.medicalSourceStatement.limitations) {
        // Add underlined LIMITATIONS header
        this.doc.setFont('helvetica', 'bold');
        const limitationsText = 'LIMITATIONS:';
        this.doc.text(limitationsText, this.margin, this.currentY);
        const limitationsWidth = this.doc.getTextWidth(limitationsText);
        this.doc.line(this.margin, this.currentY + 1, this.margin + limitationsWidth, this.currentY + 1);
        this.currentY += 10;
        
        this.doc.setFont('helvetica', 'normal');
        const splitLimitations = this.doc.splitTextToSize(data.medicalSourceStatement.limitations, this.pageWidth - (this.margin * 2));
        this.checkPageBreak(splitLimitations.length * this.lineHeight);
        this.doc.text(splitLimitations, this.margin, this.currentY);
        this.currentY += splitLimitations.length * this.lineHeight + 8;
      }
    }
    
    if (data.recommendations) {
      this.addSubsection('Recommendations', data.recommendations);
    }
    
    if (data.imagingReviewed) {
      this.addSubsection('Imaging Reviewed', data.imagingReviewed);
    }
    
    if (data.medicalRecordsReviewStatement) {
      this.addSubsection('Statement Re Review of Medical Records', data.medicalRecordsReviewStatement);
    }
    
    if (data.examinerInfo) {
      this.addExaminerInfo(data.examinerInfo);
    }
  }

  /**
   * Add examiner information with signature line
   */
  private addExaminerInfo(examinerInfo: any): void {
    this.checkPageBreak(50);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('EXAMINER INFORMATION:', this.margin, this.currentY);
    this.currentY += 12;
    
    this.doc.setFont('helvetica', 'normal');
    
    if (examinerInfo.name) {
      this.doc.text(`Examiner: ${examinerInfo.name}`, this.margin, this.currentY);
      this.currentY += this.lineHeight + 2;
    }
    
    if (examinerInfo.facility) {
      this.doc.text(`Facility: ${examinerInfo.facility}`, this.margin, this.currentY);
      this.currentY += this.lineHeight + 2;
    }
    
    if (examinerInfo.date) {
      this.doc.text(`Date: ${examinerInfo.date}`, this.margin, this.currentY);
      this.currentY += this.lineHeight + 8;
    }
    
    // Add signature line
    this.currentY += 15;
    this.doc.line(this.margin, this.currentY, this.margin + 150, this.currentY);
    this.currentY += 8;
    this.doc.setFontSize(10);
    this.doc.text('Examiner Signature', this.margin, this.currentY);
    this.currentY += 15;
  }

  /**
   * Add neuromuscular strength section in CE format
   */
  private addNeuroMuscularStrengthSection(data: any): void {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('NEUROMUSCULAR STRENGTH:', this.margin, this.currentY);
    this.currentY += 12;
    
    this.doc.setFont('helvetica', 'normal');
    
    const strengthData = [
      `Right Upper Extremity: ${data.rightUpperExtremity !== undefined ? data.rightUpperExtremity + '/5' : 'Not tested'}`,
      `Left Upper Extremity: ${data.leftUpperExtremity !== undefined ? data.leftUpperExtremity + '/5' : 'Not tested'}`,
      `Right Lower Extremity: ${data.rightLowerExtremity !== undefined ? data.rightLowerExtremity + '/5' : 'Not tested'}`,
      `Left Lower Extremity: ${data.leftLowerExtremity !== undefined ? data.leftLowerExtremity + '/5' : 'Not tested'}`,
      `Right Grip: ${data.rightGrip !== undefined ? data.rightGrip + '/5' : 'Not tested'}`,
      `Left Grip: ${data.leftGrip !== undefined ? data.leftGrip + '/5' : 'Not tested'}`
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
    
    const skills = [
      { name: 'Buttoning', data: data.buttoning },
      { name: 'Zipping', data: data.zipping },
      { name: 'Picking up a Coin', data: data.pickingUpCoin },
      { name: 'Tying Shoelaces', data: data.tyingShoelaces }
    ];
    
    this.doc.setFont('helvetica', 'normal');
    
    skills.forEach(skill => {
      if (skill.data) {
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(`${skill.name}:`, this.margin, this.currentY);
        this.currentY += this.lineHeight + 2;
        
        this.doc.setFont('helvetica', 'normal');
        const leftScore = skill.data.left !== undefined ? skill.data.left + '/5' : 'Not tested';
        const rightScore = skill.data.right !== undefined ? skill.data.right + '/5' : 'Not tested';
        
        this.doc.text(`  Left: ${leftScore}`, this.margin + 10, this.currentY);
        this.currentY += this.lineHeight + 1;
        this.doc.text(`  Right: ${rightScore}`, this.margin + 10, this.currentY);
        this.currentY += this.lineHeight + 3;
      }
    });
    
    this.currentY += 5;
  }

  /**
   * Add reflexes section in CE format
   */
  private addReflexesSection(data: any): void {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DEEP TENDON REFLEXES:', this.margin, this.currentY);
    this.currentY += 12;
    
    const reflexes = [
      { name: 'Biceps', data: data.biceps },
      { name: 'Triceps', data: data.triceps },
      { name: 'Knee (Patellar)', data: data.knee },
      { name: 'Achilles', data: data.achilles }
    ];
    
    this.doc.setFont('helvetica', 'normal');
    
    reflexes.forEach(reflex => {
      if (reflex.data) {
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(`${reflex.name}:`, this.margin, this.currentY);
        this.currentY += this.lineHeight + 2;
        
        this.doc.setFont('helvetica', 'normal');
        const leftReflex = reflex.data.left || 'Not tested';
        const rightReflex = reflex.data.right || 'Not tested';
        
        this.doc.text(`  Left: ${leftReflex}`, this.margin + 10, this.currentY);
        this.currentY += this.lineHeight + 1;
        this.doc.text(`  Right: ${rightReflex}`, this.margin + 10, this.currentY);
        this.currentY += this.lineHeight + 3;
      }
    });
    
    this.currentY += 5;
  }
}
