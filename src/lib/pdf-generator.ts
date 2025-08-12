import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MedicalIntakeForm } from '@/types/medical-form';
import { format } from 'date-fns';

/**
 * Generates a PDF from form data
 */
export const generateFormPDF = async (formData: MedicalIntakeForm): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Medical Intake Form', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Date
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on: ${format(new Date(), 'PPP')}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 20;

  // Personal Information Section
  yPosition = addSectionToPDF(pdf, 'Personal Information', yPosition, margin, pageWidth);
  
  if (formData.personalInfo) {
    const personalInfo = [
      `Name: ${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
      `Date of Birth: ${formData.personalInfo.dateOfBirth ? format(new Date(formData.personalInfo.dateOfBirth), 'PP') : 'Not provided'}`,
      `Gender: ${formData.personalInfo.gender || 'Not specified'}`,
      `Phone: ${formData.personalInfo.phone || 'Not provided'}`,
      `Email: ${formData.personalInfo.email || 'Not provided'}`,
    ];
    
    if (formData.personalInfo.address) {
      personalInfo.push(`Address: ${formData.personalInfo.address.street}, ${formData.personalInfo.address.city}, ${formData.personalInfo.address.state} ${formData.personalInfo.address.zipCode}`);
    }
    
    yPosition = addTextArrayToPDF(pdf, personalInfo, yPosition, margin, pageWidth, pageHeight);
  }

  // Insurance Information Section
  if (formData.insuranceInfo) {
    yPosition = addSectionToPDF(pdf, 'Insurance Information', yPosition, margin, pageWidth);
    const insuranceInfo = [
      `Provider: ${formData.insuranceInfo.provider || 'Not provided'}`,
      `Policy Number: ${formData.insuranceInfo.policyNumber || 'Not provided'}`,
      `Group Number: ${formData.insuranceInfo.groupNumber || 'Not provided'}`,
      `Subscriber Name: ${formData.insuranceInfo.subscriberName || 'Not provided'}`,
      `Subscriber ID: ${formData.insuranceInfo.subscriberId || 'Not provided'}`,
    ];
    yPosition = addTextArrayToPDF(pdf, insuranceInfo, yPosition, margin, pageWidth, pageHeight);
  }

  // Medical History Section
  if (formData.medicalHistory) {
    yPosition = addSectionToPDF(pdf, 'Medical History', yPosition, margin, pageWidth);
    
    if (formData.medicalHistory.allergies && formData.medicalHistory.allergies.length > 0) {
      yPosition = addSubsectionToPDF(pdf, 'Allergies:', yPosition, margin);
      yPosition = addTextArrayToPDF(pdf, formData.medicalHistory.allergies.map(a => `• ${a}`), yPosition, margin + 5, pageWidth, pageHeight);
    }
    
    if (formData.medicalHistory.currentMedications && formData.medicalHistory.currentMedications.length > 0) {
      yPosition = addSubsectionToPDF(pdf, 'Current Medications:', yPosition, margin);
      const medications = formData.medicalHistory.currentMedications.map(med => 
        `• ${med.name} - ${med.dosage}, ${med.frequency}${med.prescribedBy ? ` (Prescribed by: ${med.prescribedBy})` : ''}`
      );
      yPosition = addTextArrayToPDF(pdf, medications, yPosition, margin + 5, pageWidth, pageHeight);
    }
  }

  // Current Visit Section
  if (formData.visitInfo) {
    yPosition = addSectionToPDF(pdf, 'Current Visit Information', yPosition, margin, pageWidth);
    const visitInfo = [
      `Chief Complaint: ${formData.visitInfo.chiefComplaint || 'Not provided'}`,
      `Symptoms Start Date: ${formData.visitInfo.symptomsStartDate ? format(new Date(formData.visitInfo.symptomsStartDate), 'PP') : 'Not provided'}`,
      `Pain Level (1-10): ${formData.visitInfo.painLevel || 'Not rated'}`,
      `Previous Treatment: ${formData.visitInfo.previousTreatment || 'None reported'}`,
    ];
    yPosition = addTextArrayToPDF(pdf, visitInfo, yPosition, margin, pageWidth, pageHeight);
  }

  // Emergency Contact Section
  if (formData.emergencyContact) {
    yPosition = addSectionToPDF(pdf, 'Emergency Contact', yPosition, margin, pageWidth);
    const emergencyInfo = [
      `Name: ${formData.emergencyContact.name || 'Not provided'}`,
      `Relationship: ${formData.emergencyContact.relationship || 'Not provided'}`,
      `Phone: ${formData.emergencyContact.phone || 'Not provided'}`,
    ];
    yPosition = addTextArrayToPDF(pdf, emergencyInfo, yPosition, margin, pageWidth, pageHeight);
  }

  // Signature and Date
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = margin;
  }
  
  yPosition += 20;
  pdf.line(margin, yPosition, pageWidth / 2 - 10, yPosition);
  pdf.setFontSize(10);
  pdf.text('Patient Signature', margin, yPosition + 5);
  
  pdf.line(pageWidth / 2 + 10, yPosition, pageWidth - margin, yPosition);
  pdf.text(`Date: ${formData.date ? format(new Date(formData.date), 'PP') : format(new Date(), 'PP')}`, pageWidth / 2 + 10, yPosition + 5);

  // Save the PDF
  const fileName = `medical-intake-${formData.personalInfo?.lastName || 'patient'}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  pdf.save(fileName);
};

/**
 * Generates PDF from HTML element (alternative method)
 */
export const generatePDFFromElement = async (elementId: string, filename: string = 'medical-intake-form.pdf'): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF from HTML element');
  }
};

// Helper functions
function addSectionToPDF(pdf: jsPDF, title: string, yPosition: number, margin: number, pageWidth: number): number {
  if (yPosition > pdf.internal.pageSize.getHeight() - 30) {
    pdf.addPage();
    yPosition = margin;
  }
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, margin, yPosition);
  pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
  return yPosition + 10;
}

function addSubsectionToPDF(pdf: jsPDF, title: string, yPosition: number, margin: number): number {
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, margin, yPosition);
  return yPosition + 7;
}

function addTextArrayToPDF(pdf: jsPDF, textArray: string[], yPosition: number, margin: number, pageWidth: number, pageHeight: number): number {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  for (const text of textArray) {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * 5;
  }
  
  return yPosition + 5;
}
