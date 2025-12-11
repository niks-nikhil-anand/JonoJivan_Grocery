import jsPDF from 'jspdf';
import { format } from 'date-fns';

const getDataUri = async (url) => {
    try {
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
};

export const generateRationCardPDF = async (card) => {
    // ID-1 Portrait Size: 53.98 × 85.60 mm
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [53.98, 85.6]
    });

    // --- Helper Styles ---
    const primaryColor = [22, 101, 52]; // Green 800
    const secondaryColor = [40, 40, 40]; // Dark Gray
    const accentColor = [128, 128, 128]; // Gray (was orange)
    const lightBg = [240, 253, 244]; // Very light green
    const white = [255, 255, 255];

    const drawHeader = () => {
        // Main Green Header
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 53.98, 11, 'F');
        
        // Bottom Accent Strip
        doc.setFillColor(...accentColor);
        doc.rect(0, 10.5, 53.98, 0.5, 'F');

        doc.setFontSize(9);
        doc.setTextColor(...white);
        doc.setFont("helvetica", "bold");
        doc.text("Jonojivan Grocery Distribution", 27, 7, { align: 'center' });
    };

    // --- Page 1: Front Side (Portrait) ---
    
    // Background
    doc.setFillColor(...lightBg);
    doc.rect(0, 0, 53.98, 85.6, 'F');
    
    // Header
    drawHeader();
    
    // --- Photo (Circular) ---
    const photoRadius = 11;
    const photoCX = 27; // Center X
    const photoCY = 23; 
    
    // Draw accent circle background/border
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.5);
    doc.setFillColor(...white);
    doc.circle(photoCX, photoCY, photoRadius, 'FD');

    if (card.profilePicture) {
        try {
             const imgData = await getDataUri(card.profilePicture);
             if (imgData) {
                // Create circular clipping path
                doc.saveGraphicsState();
                doc.beginPath();
                doc.arc(photoCX, photoCY, photoRadius - 0.5, 0, 2 * Math.PI, false);
                doc.clip();
                // Draw image slightly larger to fill circle
                doc.addImage(imgData, 'JPEG', photoCX - photoRadius, photoCY - photoRadius, photoRadius * 2, photoRadius * 2, undefined, 'FAST');
                doc.restoreGraphicsState();
             } else {
                 throw new Error("Failed to load image");
             }
        } catch (error) {
             console.error("Image load error", error);
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
    let textY = 38; // Increased from 36 for Top Padding
    
    // Name - Normal weight
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.setFont("helvetica", "normal"); 
    doc.text(card.name, 27, textY, { align: 'center' });
    textY += 6; // Increased from 3.5 for Bottom Padding
    
    // Unique ID (Pill Style)
    doc.setFillColor(230); // Light gray pill
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.1);
    doc.roundedRect(14, textY - 2.8, 26, 3.8, 1.5, 1.5, 'FD'); 
    doc.setFontSize(7.5);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "normal"); 
    doc.text(card.uniqueNumber, 27, textY, { align: 'center' });
    textY += 3.5;

    // Divider
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.5);
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
        doc.setTextColor(...primaryColor); 
        doc.text(label, col1X, textY);

        // Value
        doc.setFontSize(6); // Smaller Value
        doc.setFont("helvetica", "normal"); 
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
    doc.setFillColor(...accentColor); 
    doc.rect(0, 81.6, 53.98, 0.3, 'F');

    doc.setFontSize(4);
    doc.setTextColor(...white);
    doc.text("© JonoJivan Grocery - All Rights Reserved", 27, 84, { align: 'center' });


    // --- Page 2: Back Side (Portrait) ---
    doc.addPage();
    
    // Background
    doc.setFillColor(...lightBg);
    doc.rect(0, 0, 53.98, 85.6, 'F');
    
    // Header
    drawHeader();
    
    // --- Body Content (Back) ---
    let backY = 16;
    const leftMargin = 4;

    const addSectionHeader = (text) => {
        // Decorative small pill for header
        doc.setFillColor(230, 240, 230);
        doc.roundedRect(leftMargin - 1, backY - 3, 40, 4, 1, 1, 'F');

        doc.setFontSize(8);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold"); 
        doc.text(text, leftMargin, backY);
        backY += 4.5; 
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
    doc.setFont("helvetica", "normal"); 
    terms.forEach(term => {
        doc.text(term, leftMargin, backY);
        backY += 3.2; 
    });

    backY += 1.5;

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
    doc.setDrawColor(...accentColor); 
    doc.setLineWidth(0.2);
    doc.line(leftMargin, backY, 50, backY);
    backY += 4;

    // 3. Contact Info
    addSectionHeader("CONTACT INFORMATION");

    doc.setFontSize(7);
    doc.setTextColor(0); // Black for name
    doc.setFont("helvetica", "normal"); 
    doc.text("Jonojivan Grocery Distribution", leftMargin, backY);
    backY += 3.2;

    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    
    // Address Box
    doc.text("Uttar Khatowal Rupahihat", leftMargin, backY);
    backY += 3;
    doc.text("Nagaon, Assam - 782124", leftMargin, backY);
    backY += 3.5;

    // Contact Details
    doc.setFont("helvetica", "normal"); 
    doc.setTextColor(...primaryColor);
    doc.text("Ph: 9435266783", leftMargin, backY);
    backY += 3;
    doc.text("Email: help@jonojivan.com", leftMargin, backY);
    
    backY += 4.5;

    // 4. Working Hours
    addSectionHeader("WORKING HOURS");
    
    doc.setFontSize(6);
    doc.setTextColor(40);
    doc.setFont("helvetica", "normal"); 
    
    doc.text("Mon - Fri: 9:00 AM - 6:00 PM", leftMargin, backY);
    backY += 3;
    doc.text("Sat: 9:00 AM - 1:00 PM", leftMargin, backY);
    backY += 3;
    doc.setTextColor(200, 0, 0); // Red for closed
    doc.text("Sun: Closed (Emergency Only)", leftMargin, backY);

    // Footer - Copyright
    doc.setFillColor(...primaryColor);
    doc.rect(0, 81.6, 53.98, 4, 'F');
    doc.setFillColor(...accentColor); 
    doc.rect(0, 81.6, 53.98, 0.3, 'F');
    
    doc.setFontSize(4);
    doc.setTextColor(...white);
    doc.text("© JonoJivan Grocery - All Rights Reserved", 27, 84, { align: 'center' });

    doc.save(`RationCard_${card.uniqueNumber}.pdf`);
};
