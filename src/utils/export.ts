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
  const primaryColor = [41, 98, 255]; // Professional blue
  const secondaryColor = [71, 85, 105]; // Slate gray
  const accentColor = [34, 197, 94]; // Professional green
  const lightGray = [248, 250, 252];
  const darkGray = [30, 41, 59];
  
  // Professional header
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo area
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('📐', margin, 25);
  
  // Main title - centered and professional
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  const title = 'WALL SURFACE AREA CALCULATION REPORT';
  const titleWidth = pdf.getTextWidth(title);
  pdf.text(title, (pageWidth - titleWidth) / 2, 25);
  
  let yPosition = 55;
  
  // Project Details Section with professional layout
  if (projectDetails.projectName || projectDetails.clientName) {
    // Section header with background
    pdf.setFillColor(...lightGray);
    pdf.rect(margin, yPosition - 8, contentWidth, 12, 'F');
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...darkGray);
    pdf.text('PROJECT INFORMATION', margin + 5, yPosition - 2);
    yPosition += 15;
    
    // Two-column layout for project details
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    
    const leftColumn = margin + 5;
    const rightColumn = pageWidth / 2 + 10;
    let leftY = yPosition;
    let rightY = yPosition;
    
    if (projectDetails.projectName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Project Name:', leftColumn, leftY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.projectName, leftColumn + 25, leftY);
      leftY += 8;
    }
    
    if (projectDetails.clientName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Client Name:', leftColumn, leftY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.clientName, leftColumn + 25, leftY);
      leftY += 8;
    }
    
    if (projectDetails.contractorName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Contractor:', rightColumn, rightY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.contractorName, rightColumn + 25, rightY);
      rightY += 8;
    }
    
    if (projectDetails.contractorPhone) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Phone:', rightColumn, rightY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(projectDetails.contractorPhone, rightColumn + 25, rightY);
      rightY += 8;
    }
    
    if (projectDetails.clientAddress) {
      const maxY = Math.max(leftY, rightY);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Address:', leftColumn, maxY);
      pdf.setFont('helvetica', 'normal');
      const addressLines = pdf.splitTextToSize(projectDetails.clientAddress, contentWidth - 30);
      pdf.text(addressLines, leftColumn + 25, maxY);
      yPosition = maxY + (addressLines.length * 6) + 5;
    } else {
      yPosition = Math.max(leftY, rightY) + 5;
    }
  }
  
  // Report metadata
  pdf.setFillColor(...lightGray);
  pdf.rect(margin, yPosition - 8, contentWidth, 12, 'F');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...darkGray);
  pdf.text('REPORT DETAILS', margin + 5, yPosition - 2);
  
  yPosition += 10;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  pdf.text(`Report Generated: ${reportDate}`, margin + 5, yPosition);
  pdf.text(`Total Rooms: ${rooms.length}`, pageWidth - margin - 40, yPosition);
  
  yPosition += 20;

  // Room details with professional formatting
  rooms.forEach((room, roomIndex) => {
    const summary = calculateRoomArea(room);
    
    // Check for page break
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 30;
    }
    
    // Room header with professional styling
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, yPosition - 8, contentWidth, 16, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`ROOM ${roomIndex + 1}: ${room.name.toUpperCase()}`, margin + 5, yPosition);
    
    // Room total in header
    const roomTotalText = `${formatArea(summary.netArea)} SQ FT`;
    const roomTotalWidth = pdf.getTextWidth(roomTotalText);
    pdf.text(roomTotalText, pageWidth - margin - roomTotalWidth - 5, yPosition);
    
    yPosition += 20;
    
    // Measurement sections with aligned columns
    const sections = [
      { title: 'CEILINGS', items: room.ceilings, color: [147, 51, 234] },
      { title: 'WALLS', items: room.walls, color: [59, 130, 246] },
      { title: 'OPENINGS (DEDUCTED)', items: room.openings, color: [245, 158, 11] },
      { title: 'RUNNING FEET', items: room.runningFeet, color: [16, 185, 129] }
    ];
    
    sections.forEach(section => {
      if (section.items.length > 0) {
        // Section header
        pdf.setFillColor(...section.color);
        pdf.rect(margin + 10, yPosition - 6, contentWidth - 20, 10, 'F');
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(section.title, margin + 15, yPosition - 1);
        yPosition += 12;
        
        // Column headers
        pdf.setFontSize(8);
        pdf.setTextColor(...darkGray);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Description', margin + 15, yPosition);
        pdf.text('Dimensions', margin + 80, yPosition);
        pdf.text('Qty', margin + 130, yPosition);
        pdf.text('Area (sq ft)', pageWidth - margin - 35, yPosition);
        yPosition += 8;
        
        // Items with proper alignment
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        section.items.forEach((item, index) => {
          let area, description, dimensions, qty;
          
          if (section.title === 'RUNNING FEET') {
            area = item.length * item.quantity;
            description = 'Linear measurement';
            dimensions = `${item.length}'`;
            qty = item.quantity.toString();
          } else if (section.title === 'OPENINGS (DEDUCTED)') {
            area = item.height * item.width * item.quantity;
            description = item.type.charAt(0).toUpperCase() + item.type.slice(1);
            dimensions = `${item.height}' × ${item.width}'`;
            qty = item.quantity.toString();
          } else {
            area = item.height * item.width * item.quantity;
            description = section.title === 'CEILINGS' ? 'Ceiling surface' : 'Wall surface';
            dimensions = `${item.height}' × ${item.width}'`;
            qty = item.quantity.toString();
          }
          
          // Alternating row background
          if (index % 2 === 0) {
            pdf.setFillColor(250, 250, 250);
            pdf.rect(margin + 15, yPosition - 4, contentWidth - 30, 8, 'F');
          }
          
          // Left-aligned text
          pdf.text(description, margin + 17, yPosition);
          pdf.text(dimensions, margin + 82, yPosition);
          pdf.text(qty, margin + 132, yPosition);
          
          // Right-aligned area
          const areaText = formatArea(area);
          const areaWidth = pdf.getTextWidth(areaText);
          pdf.text(areaText, pageWidth - margin - 5 - areaWidth, yPosition);
          
          yPosition += 8;
        });
        
        yPosition += 5;
      }
    });
    
    // Room calculation summary
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin + 10, yPosition - 5, contentWidth - 20, 20, 'F');
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...secondaryColor);
    pdf.text('CALCULATION:', margin + 15, yPosition + 2);
    
    const calcText = `Walls: ${formatArea(summary.totalWallArea)} - Openings: ${formatArea(summary.totalOpeningsArea)} + Ceiling: ${formatArea(summary.ceilingArea)} + Running Feet: ${formatArea(summary.runningFeetArea)}`;
    pdf.text(calcText, margin + 15, yPosition + 8);
    
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...accentColor);
    const netText = `NET TOTAL: ${formatArea(summary.netArea)} SQ FT`;
    const netWidth = pdf.getTextWidth(netText);
    pdf.text(netText, pageWidth - margin - 15 - netWidth, yPosition + 8);
    
    yPosition += 30;
  });
  
  // Project total section
  const projectTotal = calculateProjectTotal(rooms);
  
  if (yPosition > pageHeight - 50) {
    pdf.addPage();
    yPosition = 30;
  }
  
  // Professional project total
  pdf.setFillColor(...accentColor);
  pdf.rect(margin, yPosition - 8, contentWidth, 20, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('PROJECT TOTAL:', margin + 10, yPosition + 2);
  
  const totalText = `${formatArea(projectTotal)} SQ FT`;
  const totalWidth = pdf.getTextWidth(totalText);
  pdf.text(totalText, pageWidth - margin - 10 - totalWidth, yPosition + 2);
  
  // Footer
  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...secondaryColor);
  const footerText = 'Professional Wall Surface Area Calculator - Generated for Construction Professionals';
  const footerWidth = pdf.getTextWidth(footerText);
  pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 12);
  
  // Save with professional filename
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