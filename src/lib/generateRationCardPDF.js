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
    doc.text("RATION CARD", 27, 6.5, { align: 'center' });
    
    // Header Subtext
    doc.setFontSize(4);
    doc.setFont("helvetica", "normal");
    doc.text("GOVT. RECOGNIZED", 27, 8.5, { align: 'center' });

    // Photo (Centered)
    const photoW = 20;
    const photoH = 24;
    const photoX = (53.98 - photoW) / 2;
    const photoY = 12; // Just below header
    
    doc.setDrawColor(200);
    doc.setFillColor(...white);
    doc.rect(photoX, photoY, photoW, photoH, 'FD');

    if (card.profilePicture) {
        try {
            doc.addImage(card.profilePicture, 'JPEG', photoX + 0.5, photoY + 0.5, photoW - 1, photoH - 1);
        } catch (error) {
             doc.setFontSize(5);
             doc.setTextColor(150);
             doc.text("Photo", 27, photoY + 12, { align: 'center' });
        }
    } else {
         doc.setFontSize(5);
         doc.setTextColor(150);
         doc.text("No Photo", 27, photoY + 12, { align: 'center' });
    }

    // Name & ID Section
    let textY = 39;
    doc.setTextColor(0);
    
    // Name
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(card.name, 27, textY, { align: 'center' });
    textY += 3.5;
    
    // Unique ID Box
    doc.setFillColor(230);
    doc.roundedRect(12, textY - 2.5, 30, 3.5, 1, 1, 'F');
    doc.setFontSize(7);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(`ID: ${card.uniqueNumber}`, 27, textY, { align: 'center' }); 
    textY += 4.5;

    // Divider
    doc.setDrawColor(200);
    doc.line(6, textY - 1, 48, textY - 1);
    
    // Details Grid (Dense)
    const startX = 5;
    const valX = 22;
    const lineHeight = 3.2; // Compact spacing
    doc.setFontSize(5.5);
    doc.setTextColor(80);

    const addDetail = (label, value, isAccented = false) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);
        doc.text(label, startX, textY);
        
        doc.setFont("helvetica", "bold");
        if(isAccented) doc.setTextColor(...primaryColor);
        else doc.setTextColor(0);
        
        doc.text(value || '-', valX, textY);
        textY += lineHeight;
    };

    addDetail("Father/Husband:", card.fatherName);
    addDetail("Date of Birth:", card.dob ? format(new Date(card.dob), 'dd-MM-yyyy') : '-');
    addDetail("Mobile No:", card.whatsappNo);
    
    textY += 1; // spacer
    
    // Bank Details Section
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Bank Details:", startX, textY);
    textY += 3;
    
    addDetail("Bank Name:", card.bankName || card.bankDetails?.bankName);
    addDetail("Account No:", card.accountNumber || card.bankDetails?.accountNumber, true);
    addDetail("IFSC Code:", card.ifscCode || card.bankDetails?.ifscCode);

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
    doc.text("JONOJIVAN GROCERY", 27, 5, { align: 'center' });
    doc.text("OBJECTS", 27, 9, { align: 'center' });

    let backY = 20;

    // Objects List
    const objects = [
        "1. JONOJIVAN GROCERY MART",
        "2. JONOJIVAN LOGISTICS COURIER",
        "3. FINTECH ALL RECHARGE"
    ];

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    
    objects.forEach(obj => {
        doc.text(obj, 27, backY, { align: 'center' });
        backY += 5;
    });

    backY += 5;
    
    // Separator line
    doc.setDrawColor(200);
    doc.line(10, backY, 44, backY);
    backY += 5;

    // Contact Information
    doc.setFontSize(8);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("CONTACT INFORMATION", 27, backY, { align: 'center' });
    backY += 5;

    doc.setFontSize(7);
    doc.setTextColor(60);
    doc.setFont("helvetica", "bold");
    
    const addressLines = [
        "UTTAR KHATOWAL RUPAHIHAT",
        "NAGAON, ASSAM",
        "PIN: 782124"
    ];

    addressLines.forEach(line => {
        doc.text(line, 27, backY, { align: 'center' });
        backY += 4;
    });
    
    backY += 2;
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text("Ph: 9435266783", 27, backY, { align: 'center' });
    

    // QR Code for authenticity (Bottom)
    const qrY = 62;
    // doc.addImage(qrCodeBase64, 'PNG', 19.5, qrY, 15, 15);
    doc.setDrawColor(0);
    doc.rect(19.5, qrY, 15, 15);
    doc.setFontSize(4);
    doc.text("Scan QR", 27, qrY + 7.5, { align: 'center', angle: 45 }); // diagonal text placeholder

    // Footer - Copyright
    doc.setFillColor(...primaryColor);
    doc.rect(0, 81.6, 53.98, 4, 'F');
    doc.setFontSize(4);
    doc.setTextColor(...white);
    doc.text("© JonoJivan Grocery - All Rights Reserved", 27, 84, { align: 'center' });

    doc.save(`RationCard_${card.uniqueNumber}.pdf`);
  };
