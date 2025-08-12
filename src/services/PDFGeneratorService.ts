import jsPDF from 'jspdf';
import type { FloridaCEExamForm } from '../types/comprehensive-medical-form';

export class PDFGeneratorService {
  private doc: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private currentY: number;
  private margin: number;
  private pageNumber: number;
  private lineHeight: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.currentY = 20;
    this.margin = 20;
    this.pageNumber = 1;
    this.lineHeight = 6;
  }

  /**
   * Generate PDF from complete form data
   */
  public generatePDF(formData: Partial<FloridaCEExamForm>): Blob {
    this.addHeader();
    this.addDisclaimer();
    
    // Add sections in CE Exam order
    if (formData.header) {
      this.addHeaderSection(formData.header);
    }
    
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

    // Return PDF as blob
    return new Blob([this.doc.output('blob')], { type: 'application/pdf' });
  }

  /**
   * Add header with title and official formatting
   */
  private addHeader(): void {
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    
    // Centered title
    const title = 'FLORIDA DIVISION OF DISABILITY DETERMINATION';
    const subtitle = 'CONSULTATIVE EXAMINATION REPORT';
    
    const titleWidth = this.doc.getTextWidth(title);
    const subtitleWidth = this.doc.getTextWidth(subtitle);
    
    this.doc.text(title, (this.pageWidth - titleWidth) / 2, this.currentY);
    this.currentY += 8;
    
    this.doc.text(subtitle, (this.pageWidth - subtitleWidth) / 2, this.currentY);
    this.currentY += 15;
    
    // Add underline
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 10;
  }

  /**
   * Add disclaimer text
   */
  private addDisclaimer(): void {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const disclaimer = 'This examination is being performed at the request of the Florida Division of Disability Determination for disability evaluation purposes only.';
    
    const splitDisclaimer = this.doc.splitTextToSize(disclaimer, this.pageWidth - (this.margin * 2));
    this.doc.text(splitDisclaimer, this.margin, this.currentY);
    this.currentY += splitDisclaimer.length * this.lineHeight + 10;
  }

  /**
   * Add section with title and content
   */
  private addSection(title: string, content: string | string[]): void {
    this.checkPageBreak(20);
    
    // Section header
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title.toUpperCase(), this.margin, this.currentY);
    
    // Underline section header
    const titleWidth = this.doc.getTextWidth(title.toUpperCase());
    this.doc.line(this.margin, this.currentY + 2, this.margin + titleWidth, this.currentY + 2);
    this.currentY += 12;
    
    // Section content
    this.doc.setFontSize(12);
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

  /**
   * Add table data with headers and rows
   */
  private addTableData(headers: string[], rows: string[][]): void {
    const columnWidth = (this.pageWidth - (this.margin * 2)) / headers.length;
    const rowHeight = 8;
    
    this.checkPageBreak((rows.length + 2) * rowHeight);
    
    // Table headers
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    
    headers.forEach((header, index) => {
      const x = this.margin + (index * columnWidth);
      this.doc.text(header, x + 2, this.currentY + 5);
      this.doc.rect(x, this.currentY, columnWidth, rowHeight);
    });
    
    this.currentY += rowHeight;
    
    // Table rows
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
    
    this.currentY += 5;
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
   * Add page number at bottom
   */
  private addPageNumber(): void {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const pageText = `Page ${this.pageNumber}`;
    const textWidth = this.doc.getTextWidth(pageText);
    this.doc.text(pageText, (this.pageWidth - textWidth) / 2, this.pageHeight - 10);
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
   * Add header section
   */
  private addHeaderSection(data: any): void {
    this.addSection('Claimant Information', '');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    
    const headerInfo = [
      `Claimant Name: ${data.claimantName || ''}`,
      `Date of Birth: ${data.dateOfBirth || ''}`,
      `Examination Date: ${data.examDate || ''}`,
      `Case Number: ${data.caseNumber || ''}`,
      `Chief Complaint: ${data.chiefComplaint || ''}`
    ];
    
    headerInfo.forEach(info => {
      this.checkPageBreak(this.lineHeight);
      this.doc.text(info, this.margin, this.currentY);
      this.currentY += this.lineHeight + 2;
    });
    
    this.currentY += 10;
  }

  /**
   * Add history section
   */
  private addHistorySection(data: any): void {
    this.addSection('History', data.historyOfPresentIllness || 'No history documented');
    
    if (data.age || data.gender) {
      this.doc.text(`Age: ${data.age || 'Not specified'}, Gender: ${data.gender || 'Not specified'}`, this.margin, this.currentY);
      this.currentY += this.lineHeight + 10;
    }
  }

  /**
   * Add functional status section
   */
  private addFunctionalStatusSection(data: any): void {
    this.addSection('Functional Status', '');
    
    const functionalData = [
      `Dominant Hand: ${data.dominantHand || 'Not specified'}`,
      `Sitting - Worst Day: ${data.sittingWorstDay || 'Not documented'}`,
      `Sitting - Best Day: ${data.sittingBestDay || 'Not documented'}`,
      `Standing - Worst Day: ${data.standingWorstDay || 'Not documented'}`,
      `Standing - Best Day: ${data.standingBestDay || 'Not documented'}`,
      `Walking - Worst Day: ${data.walkingWorstDay || 'Not documented'}`,
      `Walking - Best Day: ${data.walkingBestDay || 'Not documented'}`,
      `Cooking/Meal Prep: ${data.cookingMealPrep || 'Not documented'}`,
      `Bathing/Showering: ${data.bathingShowering || 'Not documented'}`,
      `Dressing: ${data.dressing || 'Not documented'}`
    ];
    
    functionalData.forEach(item => {
      this.checkPageBreak(this.lineHeight);
      this.doc.text(item, this.margin, this.currentY);
      this.currentY += this.lineHeight + 2;
    });
    
    this.currentY += 10;
  }

  /**
   * Add medical info section
   */
  private addMedicalInfoSection(data: any): void {
    this.addSection('Medical Information', '');
    
    if (data.currentMedications) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Current Medications:', this.margin, this.currentY);
      this.currentY += this.lineHeight + 2;
      
      this.doc.setFont('helvetica', 'normal');
      if (Array.isArray(data.currentMedications) && data.currentMedications.length > 0) {
        data.currentMedications.forEach((med: string) => {
          this.checkPageBreak(this.lineHeight);
          this.doc.text(`• ${med}`, this.margin + 10, this.currentY);
          this.currentY += this.lineHeight + 1;
        });
      } else {
        this.doc.text('None reported', this.margin + 10, this.currentY);
        this.currentY += this.lineHeight + 1;
      }
      this.currentY += 5;
    }
    
    if (data.allergies) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Allergies:', this.margin, this.currentY);
      this.currentY += this.lineHeight + 2;
      
      this.doc.setFont('helvetica', 'normal');
      if (Array.isArray(data.allergies) && data.allergies.length > 0) {
        data.allergies.forEach((allergy: string) => {
          this.checkPageBreak(this.lineHeight);
          this.doc.text(`• ${allergy}`, this.margin + 10, this.currentY);
          this.currentY += this.lineHeight + 1;
        });
      } else {
        this.doc.text('NKDA (No Known Drug Allergies)', this.margin + 10, this.currentY);
        this.currentY += this.lineHeight + 1;
      }
      this.currentY += 5;
    }
    
    if (data.surgicalHistory) {
      this.addSection('Surgical History', data.surgicalHistory);
    }
    
    if (data.familyHistory) {
      this.addSection('Family History', data.familyHistory);
    }
    
    if (data.socialHistory) {
      this.addSection('Social History', data.socialHistory);
    }
  }

  /**
   * Add physical exam section
   */
  private addPhysicalExamSection(data: any): void {
    this.addSection('Physical Examination', '');
    
    if (data.generalAppearance) {
      this.addSection('General Appearance', data.generalAppearance);
    }
    
    if (data.vitalSigns) {
      this.addSection('Vital Signs', this.formatVitalSigns(data.vitalSigns));
    }
    
    if (data.cardiovascular) {
      this.addSection('Cardiovascular', data.cardiovascular);
    }
    
    if (data.respiratory) {
      this.addSection('Respiratory', data.respiratory);
    }
    
    if (data.musculoskeletal) {
      this.addSection('Musculoskeletal', data.musculoskeletal);
    }
    
    if (data.neurological) {
      this.addSection('Neurological', data.neurological);
    }
  }

  /**
   * Add range of motion section with table format
   */
  private addRangeOfMotionSection(data: any): void {
    this.addSection('Range of Motion', '');
    
    if (data.cervicalSpine) {
      this.addSubsectionTable('Cervical Spine', data.cervicalSpine);
    }
    
    if (data.thoracicSpine) {
      this.addSubsectionTable('Thoracic Spine', data.thoracicSpine);
    }
    
    if (data.lumbarSpine) {
      this.addSubsectionTable('Lumbar Spine', data.lumbarSpine);
    }
    
    if (data.shoulders) {
      this.addSubsectionTable('Shoulders', data.shoulders);
    }
    
    if (data.elbows) {
      this.addSubsectionTable('Elbows', data.elbows);
    }
    
    if (data.wrists) {
      this.addSubsectionTable('Wrists', data.wrists);
    }
    
    if (data.hips) {
      this.addSubsectionTable('Hips', data.hips);
    }
    
    if (data.knees) {
      this.addSubsectionTable('Knees', data.knees);
    }
    
    if (data.ankles) {
      this.addSubsectionTable('Ankles', data.ankles);
    }
  }

  /**
   * Add range of motion subsection with table
   */
  private addSubsectionTable(title: string, data: any): void {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`${title}:`, this.margin, this.currentY);
    this.currentY += 8;
    
    const headers = ['Movement', 'Active ROM', 'Passive ROM', 'Normal Range'];
    const rows: string[][] = [];
    
    if (data.flexion) {
      rows.push(['Flexion', data.flexion.active || '', data.flexion.passive || '', data.flexion.normal || '']);
    }
    if (data.extension) {
      rows.push(['Extension', data.extension.active || '', data.extension.passive || '', data.extension.normal || '']);
    }
    if (data.leftRotation) {
      rows.push(['Left Rotation', data.leftRotation.active || '', data.leftRotation.passive || '', data.leftRotation.normal || '']);
    }
    if (data.rightRotation) {
      rows.push(['Right Rotation', data.rightRotation.active || '', data.rightRotation.passive || '', data.rightRotation.normal || '']);
    }
    if (data.leftLateralFlexion) {
      rows.push(['Left Lateral Flexion', data.leftLateralFlexion.active || '', data.leftLateralFlexion.passive || '', data.leftLateralFlexion.normal || '']);
    }
    if (data.rightLateralFlexion) {
      rows.push(['Right Lateral Flexion', data.rightLateralFlexion.active || '', data.rightLateralFlexion.passive || '', data.rightLateralFlexion.normal || '']);
    }
    
    if (rows.length > 0) {
      this.addTableData(headers, rows);
    }
  }

  /**
   * Add gait and station section
   */
  private addGaitStationSection(data: any): void {
    this.addSection('Gait and Station', '');
    
    const gaitData = [
      `Gait Pattern: ${data.gait?.pattern || 'Not documented'}`,
      `Gait Speed: ${data.gait?.speed || 'Not documented'}`,
      `Use of Assistive Device: ${data.gait?.assistiveDevice || 'None'}`,
      `Station: ${data.station?.description || 'Not documented'}`,
      `Balance: ${data.station?.balance || 'Not documented'}`
    ];
    
    gaitData.forEach(item => {
      this.checkPageBreak(this.lineHeight);
      this.doc.text(item, this.margin, this.currentY);
      this.currentY += this.lineHeight + 2;
    });
    
    this.currentY += 10;
  }

  /**
   * Add assessment section
   */
  private addAssessmentSection(data: any): void {
    if (data.diagnosisAssessment) {
      this.addSection('Diagnosis/Assessment', data.diagnosisAssessment);
    }
    
    if (data.medicalSourceStatement) {
      this.addSection('Medical Source Statement', '');
      
      if (data.medicalSourceStatement.abilities) {
        this.addSection('Abilities', data.medicalSourceStatement.abilities);
      }
      
      if (data.medicalSourceStatement.understandingMemoryConcentration) {
        this.addSection('Understanding, Memory, and Concentration', data.medicalSourceStatement.understandingMemoryConcentration);
      }
      
      if (data.medicalSourceStatement.limitations) {
        this.addSection('Limitations', data.medicalSourceStatement.limitations);
      }
    }
    
    if (data.recommendations) {
      this.addSection('Recommendations', data.recommendations);
    }
    
    if (data.imagingReviewed) {
      this.addSection('Imaging Reviewed', data.imagingReviewed);
    }
    
    if (data.medicalRecordsReviewStatement) {
      this.addSection('Statement Re Review of Medical Records', data.medicalRecordsReviewStatement);
    }
    
    if (data.examinerInfo) {
      this.addSection('Examiner Information', '');
      
      const examinerData = [
        `Examiner: ${data.examinerInfo.name || ''}`,
        `Facility: ${data.examinerInfo.facility || ''}`,
        `Date: ${data.examinerInfo.date || ''}`
      ];
      
      examinerData.forEach(item => {
        this.checkPageBreak(this.lineHeight);
        this.doc.text(item, this.margin, this.currentY);
        this.currentY += this.lineHeight + 2;
      });
    }
    
    // Add final page number
    this.addPageNumber();
  }
}
