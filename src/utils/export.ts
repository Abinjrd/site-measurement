import jsPDF from 'jspdf';
import { Room, ProjectDetails } from '../types';
import { calculateRoomArea, calculateProjectTotal, formatArea } from './calculations';

export const exportToPDF = (rooms: Room[], projectDetails: ProjectDetails) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Colors
  const headerColor = [41, 98, 255];
  const lightGray = [248, 250, 252];
  const darkGray = [30, 41, 59];
  const borderColor = [200, 200, 200];
  
  // Header
  pdf.setFillColor(...headerColor);
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  const title = 'WALL SURFACE AREA CALCULATION REPORT';
  const titleWidth = pdf.getTextWidth(title);
  pdf.text(title, (pageWidth - titleWidth) / 2, 22);
  
  let yPosition = 50;
  
  // Project Details
  if (projectDetails.projectName || projectDetails.clientName) {
    pdf.setFillColor(...lightGray);
    pdf.rect(margin, yPosition - 5, contentWidth, 12, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...darkGray);
    pdf.text('PROJECT INFORMATION', margin + 5, yPosition + 2);
    yPosition += 20;
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const leftColumn = margin + 5;
    const rightColumn = pageWidth / 2 + 10;
    let leftY = yPosition;
    let rightY = yPosition;
    
    if (projectDetails.projectName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Project Name:', leftColumn, leftY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.projectName, leftColumn + 30, leftY);
      leftY += 10;
    }
    
    if (projectDetails.clientName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Client Name:', leftColumn, leftY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.clientName, leftColumn + 30, leftY);
      leftY += 10;
    }
    
    if (projectDetails.contractorName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Contractor:', rightColumn, rightY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.contractorName, rightColumn + 25, rightY);
      rightY += 10;
    }
    
    if (projectDetails.contractorPhone) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Phone:', rightColumn, rightY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.contractorPhone, rightColumn + 25, rightY);
      rightY += 10;
    }
    
    if (projectDetails.clientAddress) {
      const maxY = Math.max(leftY, rightY);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Address:', leftColumn, maxY);
      pdf.setFont('helvetica', 'normal');
      const addressLines = pdf.splitTextToSize(projectDetails.clientAddress, contentWidth - 35);
      pdf.text(addressLines, leftColumn + 25, maxY);
      yPosition = maxY + (addressLines.length * 6) + 10;
    } else {
      yPosition = Math.max(leftY, rightY) + 10;
    }
  }
  
  // Report Date
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  pdf.text(`Report Generated: ${reportDate}`, margin, yPosition);
  yPosition += 25;

  // Room tables
  rooms.forEach((room, roomIndex) => {
    const summary = calculateRoomArea(room);
    
    // Check for page break
    if (yPosition > pageHeight - 120) {
      pdf.addPage();
      yPosition = 30;
    }
    
    // Room header
    pdf.setFillColor(...headerColor);
    pdf.rect(margin, yPosition - 5, contentWidth, 15, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`ROOM ${roomIndex + 1}: ${room.name.toUpperCase()}`, margin + 5, yPosition + 5);
    
    const roomTotalText = `Total: ${formatArea(summary.netArea)} sq ft`;
    const roomTotalWidth = pdf.getTextWidth(roomTotalText);
    pdf.text(roomTotalText, pageWidth - margin - roomTotalWidth - 5, yPosition + 5);
    
    yPosition += 25;
    
    // Table setup
    const tableStartY = yPosition;
    const rowHeight = 12;
    const colWidths = [40, 30, 30, 20, 35];
    const colPositions = [
      margin,
      margin + colWidths[0],
      margin + colWidths[0] + colWidths[1],
      margin + colWidths[0] + colWidths[1] + colWidths[2],
      margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]
    ];
    
    // Table header
    pdf.setFillColor(...lightGray);
    pdf.rect(margin, yPosition - 3, contentWidth, rowHeight, 'F');
    
    // Table borders
    pdf.setDrawColor(...borderColor);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, yPosition - 3, contentWidth, rowHeight);
    
    // Vertical lines
    colPositions.slice(1).forEach(pos => {
      pdf.line(pos, yPosition - 3, pos, yPosition + rowHeight - 3);
    });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...darkGray);
    pdf.text('Type', colPositions[0] + 2, yPosition + 5);
    pdf.text('Height', colPositions[1] + 2, yPosition + 5);
    pdf.text('Width', colPositions[2] + 2, yPosition + 5);
    pdf.text('Qty', colPositions[3] + 2, yPosition + 5);
    pdf.text('Area (sq ft)', colPositions[4] + 2, yPosition + 5);
    
    yPosition += rowHeight;
    
    // Collect all measurements
    const measurements = [];
    
    // Ceilings
    room.ceilings.forEach((ceiling, index) => {
      measurements.push({
        type: `Ceiling ${index + 1}`,
        height: ceiling.height,
        width: ceiling.width,
        quantity: ceiling.quantity,
        area: ceiling.height * ceiling.width * ceiling.quantity
      });
    });
    
    // Walls
    room.walls.forEach((wall, index) => {
      measurements.push({
        type: `Wall ${index + 1}`,
        height: wall.height,
        width: wall.width,
        quantity: wall.quantity,
        area: wall.height * wall.width * wall.quantity
      });
    });
    
    // Openings
    room.openings.forEach((opening, index) => {
      measurements.push({
        type: `${opening.type.charAt(0).toUpperCase() + opening.type.slice(1)} ${index + 1}`,
        height: opening.height,
        width: opening.width,
        quantity: opening.quantity,
        area: -(opening.height * opening.width * opening.quantity)
      });
    });
    
    // Running Feet
    room.runningFeet.forEach((rf, index) => {
      measurements.push({
        type: `Running Feet ${index + 1}`,
        height: rf.length,
        width: 1,
        quantity: rf.quantity,
        area: rf.length * rf.quantity
      });
    });
    
    // Table rows
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    measurements.forEach((measurement, index) => {
      // Alternating row background
      if (index % 2 === 0) {
        pdf.setFillColor(252, 252, 252);
        pdf.rect(margin, yPosition - 3, contentWidth, rowHeight, 'F');
      }
      
      // Row border
      pdf.setDrawColor(...borderColor);
      pdf.rect(margin, yPosition - 3, contentWidth, rowHeight);
      
      // Vertical lines
      colPositions.slice(1).forEach(pos => {
        pdf.line(pos, yPosition - 3, pos, yPosition + rowHeight - 3);
      });
      
      // Data
      pdf.text(measurement.type, colPositions[0] + 2, yPosition + 5);
      pdf.text(measurement.height.toString(), colPositions[1] + 2, yPosition + 5);
      pdf.text(measurement.width.toString(), colPositions[2] + 2, yPosition + 5);
      pdf.text(measurement.quantity.toString(), colPositions[3] + 2, yPosition + 5);
      
      const areaText = formatArea(Math.abs(measurement.area));
      const areaColor = measurement.area < 0 ? [220, 38, 38] : [0, 0, 0];
      pdf.setTextColor(...areaColor);
      pdf.text(measurement.area < 0 ? `(${areaText})` : areaText, colPositions[4] + 2, yPosition + 5);
      pdf.setTextColor(0, 0, 0);
      
      yPosition += rowHeight;
    });
    
    // Room total row
    pdf.setFillColor(240, 253, 244);
    pdf.rect(margin, yPosition - 3, contentWidth, rowHeight, 'F');
    pdf.setDrawColor(...borderColor);
    pdf.rect(margin, yPosition - 3, contentWidth, rowHeight);
    
    // Vertical lines
    colPositions.slice(1).forEach(pos => {
      pdf.line(pos, yPosition - 3, pos, yPosition + rowHeight - 3);
    });
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('ROOM TOTAL', colPositions[0] + 2, yPosition + 5);
    pdf.setTextColor(34, 197, 94);
    pdf.text(formatArea(summary.netArea), colPositions[4] + 2, yPosition + 5);
    pdf.setTextColor(0, 0, 0);
    
    yPosition += rowHeight + 20;
  });
  
  // Project total
  const projectTotal = calculateProjectTotal(rooms);
  
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = 30;
  }
  
  pdf.setFillColor(34, 197, 94);
  pdf.rect(margin, yPosition - 5, contentWidth, 20, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('PROJECT TOTAL:', margin + 10, yPosition + 7);
  
  const totalText = `${formatArea(projectTotal)} sq ft`;
  const totalWidth = pdf.getTextWidth(totalText);
  pdf.text(totalText, pageWidth - margin - 10 - totalWidth, yPosition + 7);
  
  // Footer
  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  const footerText = 'Professional Wall Surface Area Calculator';
  const footerWidth = pdf.getTextWidth(footerText);
  pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 10);
  
  // Save file
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