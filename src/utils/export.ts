import jsPDF from 'jspdf';
import { Room, CalculationSummary } from '../types';
import { calculateRoomArea, calculateProjectTotal, formatArea } from './calculations';

export const exportToPDF = (rooms: Room[]) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Wall Surface Area Calculation Report', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
  
  let yPosition = 50;
  
  rooms.forEach((room, index) => {
    const summary = calculateRoomArea(room);
    
    // Room header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${room.name}`, 20, yPosition);
    yPosition += 10;
    
    // Walls section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Walls:', 25, yPosition);
    yPosition += 7;
    
    room.walls.forEach((wall, wallIndex) => {
      const area = wall.height * wall.width;
      pdf.text(`  Wall ${wallIndex + 1}: ${wall.height}' × ${wall.width}' = ${formatArea(area)} sq ft`, 30, yPosition);
      yPosition += 6;
    });
    
    // Openings section
    if (room.openings.length > 0) {
      yPosition += 5;
      pdf.text('Openings:', 25, yPosition);
      yPosition += 7;
      
      room.openings.forEach((opening, openingIndex) => {
        const area = opening.height * opening.width;
        pdf.text(`  ${opening.type.charAt(0).toUpperCase() + opening.type.slice(1)} ${openingIndex + 1}: ${opening.height}' × ${opening.width}' = ${formatArea(area)} sq ft`, 30, yPosition);
        yPosition += 6;
      });
    }
    
    // Summary for room
    yPosition += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Total Wall Area: ${formatArea(summary.totalWallArea)} sq ft`, 25, yPosition);
    yPosition += 6;
    pdf.text(`Total Openings: ${formatArea(summary.totalOpeningsArea)} sq ft`, 25, yPosition);
    yPosition += 6;
    if (summary.ceilingArea > 0) {
      pdf.text(`Ceiling Area: ${formatArea(summary.ceilingArea)} sq ft`, 25, yPosition);
      yPosition += 6;
    }
    pdf.text(`Net Area: ${formatArea(summary.netArea)} sq ft`, 25, yPosition);
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
  pdf.text(`TOTAL PROJECT AREA: ${formatArea(projectTotal)} sq ft`, 20, yPosition + 10);
  
  pdf.save('wall-area-calculation.pdf');
};

export const exportToCSV = (rooms: Room[]) => {
  const headers = ['Room Name', 'Wall Area (sq ft)', 'Openings Area (sq ft)', 'Ceiling Area (sq ft)', 'Net Area (sq ft)'];
  const rows = rooms.map(room => {
    const summary = calculateRoomArea(room);
    return [
      room.name,
      formatArea(summary.totalWallArea),
      formatArea(summary.totalOpeningsArea),
      formatArea(summary.ceilingArea),
      formatArea(summary.netArea)
    ];
  });
  
  const projectTotal = calculateProjectTotal(rooms);
  rows.push(['TOTAL PROJECT', '', '', '', formatArea(projectTotal)]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'wall-area-calculation.csv';
  link.click();
  window.URL.revokeObjectURL(url);
};