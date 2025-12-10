import jsPDF from 'jspdf';
import { format } from 'date-fns';

export const generateRationCardPDF = (card) => {
    // ID-1 Portrait Size: 53.98 × 85.60 mm
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [53.98, 85.6]
    });

    // --- Helper Styles ---
    const primaryColor = [22, 101, 52]; // Green 800
    const secondaryColor = [40, 40, 40]; // Dark Gray
    const accentColor = [234, 88, 12]; // Orange for emphasis
    const lightBg = [240, 253, 244]; // Very light green
    const white = [255, 255, 255];

    // --- Page 1: Front Side (Portrait) ---
    
    // Background
    doc.setFillColor(...lightBg);
    doc.rect(0, 0, 53.98, 85.6, 'F');
    
    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 53.98, 10, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.text("Jonojivan grocery distribution", 27, 6.5, { align: 'center' });

    // --- Photo (Circular) ---
    const photoRadius = 11;
    const photoCX = 27; // Center X
    const photoCY = 23; // Just below header (approx Y=12 start + 11 radius)
    
    // Draw white circle background/border
    doc.setDrawColor(200);
    doc.setFillColor(...white);
    doc.circle(photoCX, photoCY, photoRadius, 'FD');

    if (card.profilePicture) {
        try {
            // Create circular clipping path
            doc.saveGraphicsState();
            doc.beginPath();
            doc.arc(photoCX, photoCY, photoRadius - 0.5, 0, 2 * Math.PI, false);
            doc.clip();
            // Draw image slightly larger to fill circle
            doc.addImage(card.profilePicture, 'JPEG', photoCX - photoRadius, photoCY - photoRadius, photoRadius * 2, photoRadius * 2, undefined, 'FAST');
            doc.restoreGraphicsState();
        } catch (error) {
             doc.setFontSize(5);
             doc.setTextColor(150);
             doc.text("No Photo", photoCX, photoCY, { align: 'center' });
        }
    } else {
         doc.setFontSize(5);
         doc.setTextColor(150);
         doc.text("No Photo", photoCX, photoCY, { align: 'center' });
    }

    // --- Name & ID Section ---
    let textY = 36;
    
    // Name
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(card.name, 27, textY, { align: 'center' });
    textY += 3.5;
    
    // Unique ID (Pill Style)
    doc.setFillColor(230); // Light gray pill
    doc.roundedRect(14, textY - 2.8, 26, 3.8, 1.5, 1.5, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(card.uniqueNumber, 27, textY, { align: 'center' });
    textY += 3.5;

    // Divider
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.3);
    doc.line(6, textY - 1, 48, textY - 1);
    
    // --- Detailed Grid (Single Column) ---
    doc.setTextColor(50);
    const col1X = 6; 
    const valX = 22; 
    const rowSpacing = 3.8; // Compact spacing
    
    // Add margin top for the first field
    textY += 2;

    const drawRow = (label, value) => {
        // Label
        doc.setFontSize(5); // Smaller Label
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80); 
        doc.text(label, col1X, textY);

        // Value
        doc.setFontSize(6); // Smaller Value
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0); 
        
        let displayVal = value || '-';
        
        const maxWidth = 28; 
        const lines = doc.splitTextToSize(displayVal, maxWidth);
        
        doc.text(lines, valX, textY);
        
        const lineCount = lines.length;
        if(lineCount > 1) {
            textY += (lineCount * 2.5) + 1.5; 
        } else {
            textY += rowSpacing;
        }
    };

    drawRow("Father:", card.fatherName);

    const fullAddress = `${card.address || ''}, ${card.state || ''} - ${card.pincode || ''}`;
    drawRow("Address:", fullAddress);

    drawRow("DOB:", card.dob ? format(new Date(card.dob), 'dd-MM-yyyy') : '-');
    drawRow("Mobile:", card.whatsappNo);
    drawRow("Aadhaar:", card.aadhaarCardNumber);
    drawRow("PAN:", card.panCardNumber);
    
    textY += 0.5; 

    drawRow("Bank:", card.bankName || card.bankDetails?.bankName);
    drawRow("A/C No:", card.accountNumber || card.bankDetails?.accountNumber);
    drawRow("IFSC:", card.ifscCode || card.bankDetails?.ifscCode);
    
    // Footer - Copyright
    doc.setFillColor(...primaryColor);
    doc.rect(0, 81.6, 53.98, 4, 'F');
    doc.setFontSize(4);
    doc.setTextColor(...white);
    doc.text("© JonoJivan Grocery - All Rights Reserved", 27, 84, { align: 'center' });


    // --- Page 2: Back Side (Portrait) ---
    doc.addPage();
    
    // Background
    doc.setFillColor(...lightBg);
    doc.rect(0, 0, 53.98, 85.6, 'F');
    
    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 53.98, 12, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.text("Jonojivan grocery distribution", 27, 5, { align: 'center' });
    
    // --- Body Content (Back) ---
    let backY = 16;
    const leftMargin = 4;

    const addSectionHeader = (text) => {
        doc.setFontSize(8);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text(text, leftMargin, backY);
        backY += 4;
    };
    
    // 1. Terms Section
    addSectionHeader("TERMS & CONDITIONS");

    const terms = [
        "Jonojivan Grocery Mart",
        "Jonojivan Logistics Courier",
        "Fintech All Recharge"
    ];

    doc.setFontSize(6.5);
    doc.setTextColor(50);
    doc.setFont("helvetica");
    terms.forEach(term => {
        doc.text(term, leftMargin, backY);
        backY += 3.5;
    });

    backY += 2;

    // 2. Membership Terms
    addSectionHeader("MEMBERSHIP RULES");

    doc.setFontSize(5.5);
    doc.setTextColor(60);
    doc.setFont("helvetica", "normal");
    const mTerms = [
        "Carry this ID card at all times during working hours.",
        "This card is strictly for official use only."
    ];
    mTerms.forEach(term => {
        const wrapped = doc.splitTextToSize(term, 46);
        doc.text(wrapped, leftMargin, backY);
        backY += (wrapped.length * 2.5) + 1;
    });

    backY += 1;
    // Divider
    doc.setDrawColor(...primaryColor); // Colored divider
    doc.setLineWidth(0.2);
    doc.line(leftMargin, backY, 50, backY);
    backY += 4;

    // 3. Contact Info
    addSectionHeader("CONTACT INFORMATION");

    doc.setFontSize(7);
    doc.setTextColor(0); // Black for name
    doc.setFont("helvetica", "bold");
    doc.text("Jonojivan Gramin Vikash Foundation", leftMargin, backY);
    backY += 3.5;

    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    
    // Address Box
    doc.text("Uttar Khatowal Rupahihat", leftMargin, backY);
    backY += 3;
    doc.text("Nagaon, Assam - 782124", leftMargin, backY);
    backY += 4;

    // Contact Details
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Ph: 9435266783", leftMargin, backY);
    backY += 3;
    doc.text("Email: help@jonojivan.com", leftMargin, backY);
    
    backY += 5;

    // 4. Working Hours
    addSectionHeader("WORKING HOURS");
    
    doc.setFontSize(6);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    
    doc.text("Mon - Fri: 9:00 AM - 6:00 PM", leftMargin, backY);
    backY += 3;
    doc.text("Sat: 9:00 AM - 1:00 PM", leftMargin, backY);
    backY += 3;
    doc.setTextColor(200, 0, 0); // Red for closed
    doc.text("Sun: Closed (Emergency Only)", leftMargin, backY);

    // Footer - Copyright
    doc.setFillColor(...primaryColor);
    doc.rect(0, 81.6, 53.98, 4, 'F');
    doc.setFontSize(4);
    doc.setTextColor(...white);
    doc.text("© JonoJivan Grocery - All Rights Reserved", 27, 84, { align: 'center' });

    doc.save(`RationCard_${card.uniqueNumber}.pdf`);
  };
