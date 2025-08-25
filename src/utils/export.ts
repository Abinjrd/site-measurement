import jsPDF from 'jspdf';
import { Room, ProjectDetails } from '../types';
import { calculateRoomArea, calculateProjectTotal, formatArea } from './calculations';

export const exportToPDF = (rooms: Room[], projectDetails: ProjectDetails) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = [59, 130, 246]; // Blue
  const secondaryColor = [107, 114, 128]; // Gray
  const accentColor = [16, 185, 129]; // Green
  const lightGray = [249, 250, 251];
  
  // Header with background
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  // Company logo placeholder (using text)
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('📐', 15, 22);
  
  // Main title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('WALL SURFACE AREA CALCULATION REPORT', 35, 22);
  
  let yPosition = 50;
  
  // Project Details Section
  if (projectDetails.projectName || projectDetails.clientName) {
    // Section header
    pdf.setFillColor(...lightGray);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 8, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...secondaryColor);
    pdf.text('PROJECT INFORMATION', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    if (projectDetails.projectName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Project:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.projectName, 50, yPosition);
      yPosition += 6;
    }
    
    if (projectDetails.clientName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Client:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.clientName, 50, yPosition);
      yPosition += 6;
    }
    
    if (projectDetails.clientAddress) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Address:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      const addressLines = pdf.splitTextToSize(projectDetails.clientAddress, 120);
      pdf.text(addressLines, 50, yPosition);
      yPosition += addressLines.length * 6;
    }
    
    if (projectDetails.contractorName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Contractor:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.contractorName, 50, yPosition);
      yPosition += 6;
    }
    
    if (projectDetails.contractorPhone) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Phone:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.contractorPhone, 50, yPosition);
      yPosition += 6;
    }
    
    yPosition += 5;
  }
  
  // Date and report info
  pdf.setFillColor(...lightGray);
  pdf.rect(15, yPosition - 5, pageWidth - 30, 8, 'F');
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...secondaryColor);
  pdf.text('REPORT DETAILS', 20, yPosition);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, 20, yPosition + 8);
  pdf.text(`Total Rooms: ${rooms.length}`, 20, yPosition + 14);
  
  yPosition += 25;

  // Room details
  rooms.forEach((room, roomIndex) => {
    const summary = calculateRoomArea(room);
    
    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }
    
    // Room header with background
    pdf.setFillColor(...primaryColor);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 12, 'F');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`🏠 ROOM ${roomIndex + 1}: ${room.name.toUpperCase()}`, 20, yPosition + 3);
    yPosition += 18;
    
    pdf.setTextColor(0, 0, 0);
    
    // Measurements sections
    const sections = [
      { title: 'CEILINGS', items: room.ceilings, icon: '⬜', color: [147, 51, 234] },
      { title: 'WALLS', items: room.walls, icon: '🧱', color: [59, 130, 246] },
      { title: 'OPENINGS (DEDUCTED)', items: room.openings, icon: '🚪', color: [245, 158, 11] },
      { title: 'RUNNING FEET', items: room.runningFeet, icon: '📏', color: [16, 185, 129] }
    ];
    
    sections.forEach(section => {
      if (section.items.length > 0) {
        // Section header
        pdf.setFillColor(...section.color);
        pdf.rect(20, yPosition - 3, pageWidth - 40, 8, 'F');
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(`${section.icon} ${section.title}`, 25, yPosition + 2);
        yPosition += 12;
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        
        section.items.forEach((item, index) => {
          let area, description;
          
          if (section.title === 'RUNNING FEET') {
            area = item.length * item.quantity;
            description = `${item.length}' × ${item.quantity} qty`;
          } else if (section.title === 'OPENINGS (DEDUCTED)') {
            area = item.height * item.width * item.quantity;
            description = `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} - ${item.height}' × ${item.width}' × ${item.quantity} qty`;
          } else {
            area = item.height * item.width * item.quantity;
            description = `${item.height}' × ${item.width}' × ${item.quantity} qty`;
          }
          
          // Item row with alternating background
          if (index % 2 === 0) {
            pdf.setFillColor(248, 250, 252);
            pdf.rect(25, yPosition - 3, pageWidth - 50, 6, 'F');
          }
          
          pdf.text(`• ${description}`, 30, yPosition);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${formatArea(area)} sq ft`, pageWidth - 50, yPosition);
          pdf.setFont('helvetica', 'normal');
          yPosition += 6;
        });
        
        yPosition += 3;
      }
    });
    
    // Room summary box
    pdf.setFillColor(...accentColor);
    pdf.rect(20, yPosition - 3, pageWidth - 40, 15, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('ROOM TOTAL:', 25, yPosition + 5);
    pdf.setFontSize(14);
    pdf.text(`${formatArea(summary.netArea)} SQ FT`, pageWidth - 70, yPosition + 5);
    
    // Calculation breakdown
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Walls: ${formatArea(summary.totalWallArea)} - Openings: ${formatArea(summary.totalOpeningsArea)} + Ceiling: ${formatArea(summary.ceilingArea)} + Running Feet: ${formatArea(summary.runningFeetArea)}`, 25, yPosition + 10);
    
    yPosition += 25;
  });
  
  // Project total section
  const projectTotal = calculateProjectTotal(rooms);
  
  // Check if we need space for final total
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = 20;
  }
  
  // Final total with gradient effect (simulated with multiple rectangles)
  const gradientColors = [
    [59, 130, 246],
    [37, 99, 235],
    [29, 78, 216]
  ];
  
  gradientColors.forEach((color, index) => {
    pdf.setFillColor(...color);
    pdf.rect(15, yPosition + index * 2, pageWidth - 30, 6, 'F');
  });
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('🎯 PROJECT TOTAL:', 25, yPosition + 8);
  pdf.setFontSize(24);
  pdf.text(`${formatArea(projectTotal)} SQ FT`, pageWidth - 100, yPosition + 8);
  
  // Footer
  yPosition += 25;
  pdf.setFillColor(243, 244, 246);
  pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...secondaryColor);
  pdf.text('Professional Wall Surface Area Calculator - Generated for Construction Professionals', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save with better filename
  const fileName = projectDetails.projectName 
    ? `${projectDetails.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Wall_Area_Report.pdf`
    : `Wall_Area_Calculation_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

export const exportToCSV = (rooms: Room[], projectDetails: ProjectDetails) => {
  const headers = ['"Room Name"', '"Wall Area (sq ft)"', '"Openings Area (sq ft)"', '"Ceiling Area (sq ft)"', '"Running Feet Area (sq ft)"', '"Net Area (sq ft)"'];
  const rows = rooms.map(room => {
    const summary = calculateRoomArea(room);
    return [
      `"${room.name}"`,
      formatArea(summary.totalWallArea),
      formatArea(summary.totalOpeningsArea),
      formatArea(summary.ceilingArea),
      formatArea(summary.runningFeetArea),
      formatArea(summary.netArea)
    ];
  });
  
  const projectTotal = calculateProjectTotal(rooms);
  rows.push(['"TOTAL PROJECT"', '', '', '', '', formatArea(projectTotal)]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = projectDetails.projectName 
    ? `${projectDetails.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_calculation.csv`
    : 'wall-area-calculation.csv';
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};