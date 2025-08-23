import jsPDF from 'jspdf';
import { Room, CalculationSummary, ProjectDetails } from '../types';
import { calculateRoomArea, calculateProjectTotal, formatArea } from './calculations';

export const exportToPDF = (rooms: Room[], projectDetails: ProjectDetails) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('"Wall Surface Area Calculation Report"', pageWidth / 2, 20, { align: 'center' });
  
  let yPosition = 35;
  
  // Project Details
  if (projectDetails.projectName || projectDetails.clientName) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    if (projectDetails.projectName) {
      pdf.text(`"Project: ${projectDetails.projectName}"`, 20, yPosition);
      yPosition += 8;
    }
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    if (projectDetails.clientName) {
      pdf.text(`"Client: ${projectDetails.clientName}"`, 20, yPosition);
      yPosition += 6;
    }
    if (projectDetails.clientAddress) {
      pdf.text(`"Address: ${projectDetails.clientAddress}"`, 20, yPosition);
      yPosition += 6;
    }
    if (projectDetails.contractorName) {
      pdf.text(`"Contractor: ${projectDetails.contractorName}"`, 20, yPosition);
      yPosition += 6;
    }
    if (projectDetails.contractorPhone) {
      pdf.text(`"Phone: ${projectDetails.contractorPhone}"`, 20, yPosition);
      yPosition += 6;
    }
    yPosition += 5;
  }
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`"Generated on: ${new Date().toLocaleDateString()}"`, 20, yPosition);
  yPosition += 15;
  
  rooms.forEach((room, index) => {
    const summary = calculateRoomArea(room);
    
    // Room header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`"${room.name}"`, 20, yPosition);
    yPosition += 10;
    
    // Ceilings section
    if (room.ceilings.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('"Ceilings:"', 25, yPosition);
      yPosition += 7;
      
      room.ceilings.forEach((ceiling, ceilingIndex) => {
        const area = ceiling.height * ceiling.width * ceiling.quantity;
        pdf.text(`  "Ceiling ${ceilingIndex + 1}: ${ceiling.height}' × ${ceiling.width}' × ${ceiling.quantity} = ${formatArea(area)} sq ft"`, 30, yPosition);
        yPosition += 6;
      });
      yPosition += 3;
    }
    
    // Walls section
    if (room.walls.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('"Walls:"', 25, yPosition);
      yPosition += 7;
      
      room.walls.forEach((wall, wallIndex) => {
        const area = wall.height * wall.width * wall.quantity;
        pdf.text(`  "Wall ${wallIndex + 1}: ${wall.height}' × ${wall.width}' × ${wall.quantity} = ${formatArea(area)} sq ft"`, 30, yPosition);
        yPosition += 6;
      });
      yPosition += 3;
    }
    
    // Openings section
    if (room.openings.length > 0) {
      pdf.text('"Openings:"', 25, yPosition);
      yPosition += 7;
      
      room.openings.forEach((opening, openingIndex) => {
        const area = opening.height * opening.width * opening.quantity;
        pdf.text(`  "${opening.type.charAt(0).toUpperCase() + opening.type.slice(1)} ${openingIndex + 1}: ${opening.height}' × ${opening.width}' × ${opening.quantity} = ${formatArea(area)} sq ft"`, 30, yPosition);
        yPosition += 6;
      });
      yPosition += 3;
    }
    
    // Running feet section
    if (room.runningFeet.length > 0) {
      pdf.text('"Running Feet:"', 25, yPosition);
      yPosition += 7;
      
      room.runningFeet.forEach((rf, rfIndex) => {
        const area = rf.length * rf.quantity;
        pdf.text(`  "Running Feet ${rfIndex + 1}: ${rf.length}' × ${rf.quantity} = ${formatArea(area)} sq ft"`, 30, yPosition);
        yPosition += 6;
      });
      yPosition += 3;
    }
    
    // Summary for room
    pdf.setFont('helvetica', 'bold');
    pdf.text(`"Total Wall Area: ${formatArea(summary.totalWallArea)} sq ft"`, 25, yPosition);
    yPosition += 6;
    pdf.text(`"Total Openings: ${formatArea(summary.totalOpeningsArea)} sq ft"`, 25, yPosition);
    yPosition += 6;
    pdf.text(`"Ceiling Area: ${formatArea(summary.ceilingArea)} sq ft"`, 25, yPosition);
    yPosition += 6;
    pdf.text(`"Running Feet Area: ${formatArea(summary.runningFeetArea)} sq ft"`, 25, yPosition);
    yPosition += 6;
    pdf.text(`"Net Area: ${formatArea(summary.netArea)} sq ft"`, 25, yPosition);
    yPosition += 15;
    
    // Add page break if needed
    if (yPosition > 250 && index < rooms.length - 1) {
      pdf.addPage();
      yPosition = 20;
    }
  });
  
  // Project total
  const projectTotal = calculateProjectTotal(rooms);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`"TOTAL PROJECT AREA: ${formatArea(projectTotal)} sq ft"`, 20, yPosition + 10);
  
  const fileName = projectDetails.projectName 
    ? `${projectDetails.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_calculation.pdf`
    : 'wall-area-calculation.pdf';
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