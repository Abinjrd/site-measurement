import { jsPDF } from 'jspdf';

// Make jsPDF globally available for jspdf-autotable
(window as any).jsPDF = jsPDF;

import 'jspdf-autotable';
import { Room, CalculationSummary, ProjectDetails } from '../types';
import { calculateRoomArea, calculateProjectTotal, formatArea } from './calculations';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPDF = (rooms: Room[], projectDetails: ProjectDetails) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Wall Surface Area Calculation Report', pageWidth / 2, 20, { align: 'center' });
  
  let yPosition = 35;
  
  // Project Details
  if (projectDetails.projectName || projectDetails.clientName) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    if (projectDetails.projectName) {
      pdf.text(`Project: "${projectDetails.projectName}"`, 20, yPosition);
      yPosition += 8;
    }
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    if (projectDetails.clientName) {
      pdf.text(`Client: "${projectDetails.clientName}"`, 20, yPosition);
      yPosition += 6;
    }
    if (projectDetails.clientAddress) {
      pdf.text(`Address: "${projectDetails.clientAddress}"`, 20, yPosition);
      yPosition += 6;
    }
    if (projectDetails.contractorName) {
      pdf.text(`Contractor: "${projectDetails.contractorName}"`, 20, yPosition);
      yPosition += 6;
    }
    if (projectDetails.contractorPhone) {
      pdf.text(`Phone: "${projectDetails.contractorPhone}"`, 20, yPosition);
      yPosition += 6;
    }
    yPosition += 5;
  }
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on: "${new Date().toLocaleDateString()}"`, 20, yPosition);
  yPosition += 15;

  // Create table data
  const tableData: any[] = [];
  
  rooms.forEach((room) => {
    const summary = calculateRoomArea(room);
    
    // Add room header row
    tableData.push([
      { content: `"${room.name}"`, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
      { content: '', styles: { fillColor: [240, 240, 240] } },
      { content: '', styles: { fillColor: [240, 240, 240] } },
      { content: '', styles: { fillColor: [240, 240, 240] } },
      { content: '', styles: { fillColor: [240, 240, 240] } },
      { content: '', styles: { fillColor: [240, 240, 240] } }
    ]);
    
    // Add ceilings
    if (room.ceilings.length > 0) {
      room.ceilings.forEach((ceiling, index) => {
        const area = ceiling.height * ceiling.width * ceiling.quantity;
        tableData.push([
          `"Ceiling ${index + 1}"`,
          `"${ceiling.height}'"`,
          `"${ceiling.width}'"`,
          `"${ceiling.quantity}"`,
          `"${formatArea(area)} sq ft"`,
          '"Ceiling"'
        ]);
      });
    }
    
    // Add walls
    if (room.walls.length > 0) {
      room.walls.forEach((wall, index) => {
        const area = wall.height * wall.width * wall.quantity;
        tableData.push([
          `"Wall ${index + 1}"`,
          `"${wall.height}'"`,
          `"${wall.width}'"`,
          `"${wall.quantity}"`,
          `"${formatArea(area)} sq ft"`,
          '"Wall"'
        ]);
      });
    }
    
    // Add openings
    if (room.openings.length > 0) {
      room.openings.forEach((opening, index) => {
        const area = opening.height * opening.width * opening.quantity;
        tableData.push([
          `"${opening.type.charAt(0).toUpperCase() + opening.type.slice(1)} ${index + 1}"`,
          `"${opening.height}'"`,
          `"${opening.width}'"`,
          `"${opening.quantity}"`,
          `"${formatArea(area)} sq ft"`,
          '"Opening (Deducted)"'
        ]);
      });
    }
    
    // Add running feet
    if (room.runningFeet.length > 0) {
      room.runningFeet.forEach((rf, index) => {
        const area = rf.length * rf.quantity;
        tableData.push([
          `"Running Feet ${index + 1}"`,
          `"${rf.length}'"`,
          '"-"',
          `"${rf.quantity}"`,
          `"${formatArea(area)} sq ft"`,
          '"Running Feet"'
        ]);
      });
    }
    
    // Add room summary
    tableData.push([
      { content: '"Room Total"', styles: { fontStyle: 'bold', fillColor: [220, 255, 220] } },
      { content: '', styles: { fillColor: [220, 255, 220] } },
      { content: '', styles: { fillColor: [220, 255, 220] } },
      { content: '', styles: { fillColor: [220, 255, 220] } },
      { content: `"${formatArea(summary.netArea)} sq ft"`, styles: { fontStyle: 'bold', fillColor: [220, 255, 220] } },
      { content: '"Net Area"', styles: { fillColor: [220, 255, 220] } }
    ]);
    
    // Add empty row for spacing
    tableData.push(['', '', '', '', '', '']);
  });
  
  // Add project total
  const projectTotal = calculateProjectTotal(rooms);
  tableData.push([
    { content: '"PROJECT TOTAL"', styles: { fontStyle: 'bold', fillColor: [200, 230, 255], fontSize: 14 } },
    { content: '', styles: { fillColor: [200, 230, 255] } },
    { content: '', styles: { fillColor: [200, 230, 255] } },
    { content: '', styles: { fillColor: [200, 230, 255] } },
    { content: `"${formatArea(projectTotal)} sq ft"`, styles: { fontStyle: 'bold', fillColor: [200, 230, 255], fontSize: 14 } },
    { content: '"Total Area"', styles: { fillColor: [200, 230, 255] } }
  ]);

  // Create the table
  pdf.autoTable({
    startY: yPosition,
    head: [['Item', 'Height/Length', 'Width', 'Quantity', 'Area', 'Type']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [200, 200, 200],
      lineWidth: 0.5
    },
    headStyles: {
      fillColor: [100, 150, 200],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' },
      5: { cellWidth: 35, halign: 'center' }
    }
  });
  
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