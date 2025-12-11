import jsPDF from 'jspdf';
import { format } from 'date-fns';

const loadImageToDataUrl = (url, circular = false) => {
    return new Promise((resolve, reject) => {
        // Use our local proxy to fetch the image, ensuring CORS headers are set correctly
        // The PDF generator asks our server, our server asks Cloudinary (server-to-server = no CORS),
        // and our server returns it to valid origin.
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
        
        const img = new Image();
        img.crossOrigin = 'Anonymous'; 
        
        const joinChar = proxyUrl.includes('?') ? '&' : '?';
        img.src = `${proxyUrl}${joinChar}t=${Date.now()}`;

        img.onload = () => {
             try {
                const canvas = document.createElement('canvas');
                const size = Math.min(img.width, img.height);
                
                // If circular, we square the canvas to the smallest dimension
                canvas.width = circular ? size : img.width;
                canvas.height = circular ? size : img.height;
                
                const ctx = canvas.getContext('2d');
                
                if (circular) {
                    // Create circular clipping path
                    ctx.beginPath();
                    ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.clip();
                    
                    // Draw image centered and cropped
                    const x = (img.width - size) / 2;
                    const y = (img.height - size) / 2;
                    ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
                } else {
                    ctx.drawImage(img, 0, 0);
                }
                
                // Use PNG to preserve transparency for the circular crop
                const type = circular ? 'image/png' : 'image/jpeg';
                const dataUrl = canvas.toDataURL(type);
                resolve(dataUrl);
             } catch (e) {
                 console.error("Canvas export failed:", e);
                 reject(e);
             }
        };
        img.onerror = (error) => {
             // ... keep existing error handling ...
            console.error("Image load error (proxy):", error);
            reject(new Error("Failed to load image via proxy"));
        };
    });
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
             // Load and pre-crop image to circle using canvas
             const imgData = await loadImageToDataUrl(card.profilePicture, true);
             if (imgData) {
                // Draw pre-cropped image
                doc.addImage(imgData, 'PNG', photoCX - photoRadius, photoCY - photoRadius, photoRadius * 2, photoRadius * 2, undefined, 'FAST');
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
    
    // Masked Unique ID
    const uniqueId = card.uniqueNumber ? String(card.uniqueNumber) : '';
    const maskedId = uniqueId.length > 4 
        ? `${uniqueId.slice(0, 2)} **** ${uniqueId.slice(-2)}`
        : uniqueId;
        
    doc.text(maskedId, 27, textY, { align: 'center' });
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
        doc.roundedRect(leftMargin - 1, backY - 2.5, 40, 3.5, 1, 1, 'F'); // Reduced height and Y-offset

        doc.setFontSize(7); // Reduced from 8
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold"); 
        doc.text(text, leftMargin, backY);
        backY += 4; // Reduced from 4.5
    };
    
    // 1. Terms Section
    addSectionHeader("Jonojivan grocery objects");

    const terms = [
        "Jonojivan Grocery Mart",
        "Jonojivan Logistics Courier",
        "Fintech All Recharge"
    ];

    doc.setFontSize(5.5); // Reduced from 6.5
    doc.setTextColor(50);
    doc.setFont("helvetica", "normal"); 
    terms.forEach(term => {
        doc.text(term, leftMargin, backY);
        backY += 2.8; // Reduced from 3.2
    });

    backY += 1; // Reduced from 1.5

    // 2. Membership Terms
    addSectionHeader("Terms & Conditions");

    doc.setFontSize(5); // Reduced from 5.5
    doc.setTextColor(60);
    doc.setFont("helvetica", "normal");
    const mTerms = [
        "Carry This ID Card At All Times During Working Hours.",
        "This ID Card Is Strictly For Official Use Only.",
        "The ID Card Must Not Be Shared Or Used For Any Unauthorized Purpose.",
        "Loss Or Damage Of The ID Card Must Be Reported Immediately To The Office.",
        "Any Misuse Of The ID Card May Lead To Disciplinary Action.",
        "The ID Card Remains The Property Of The Organization And Must Be Returned Upon Request."
    ];

    mTerms.forEach(term => {
        const wrapped = doc.splitTextToSize(term, 48); // Increased width slightly from 46
        doc.text(wrapped, leftMargin, backY);
        backY += (wrapped.length * 2.2) + 0.8; // Reduced line spacing
    });

    backY += 0.5; // Reduced from 1
    // Divider
    doc.setDrawColor(...accentColor); 
    doc.setLineWidth(0.2);
    doc.line(leftMargin, backY, 50, backY);
    backY += 3.5; // Reduced from 4

    // --- Side-by-Side Section (Columns) ---
    const rowStartY = backY;
    const col2X = 29; // Start of right column
    
    // --- Left Column: Contact Info ---
    
    // Header (Compact Pill)
    doc.setFillColor(230, 240, 230);
    doc.roundedRect(leftMargin - 1, rowStartY - 2.5, 23, 3.5, 1, 1, 'F');
    
    doc.setFontSize(7);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold"); 
    doc.text("Contact Info", leftMargin, rowStartY);
    
    let leftY = rowStartY + 4;

    doc.setFontSize(6);
    doc.setTextColor(0); 
    doc.setFont("helvetica", "normal"); 
    const cName = doc.splitTextToSize("Jonojivan Grocery Distribution", 23);
    doc.text(cName, leftMargin, leftY);
    leftY += (cName.length * 2.8) + 0.5;

    doc.setFontSize(5); // Smaller address
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    
    doc.text("Uttar Khatowal Rupahihat", leftMargin, leftY);
    leftY += 2.5;
    doc.text("Nagaon, Assam - 782124", leftMargin, leftY);
    leftY += 3;

    // Contact Details
    doc.setFont("helvetica", "normal"); 
    doc.setTextColor(...primaryColor);
    doc.text("Ph: 9435266783", leftMargin, leftY);
    leftY += 2.5;
    
    const emailParts = doc.splitTextToSize("help@jonojivan.com", 23);
    doc.text(emailParts, leftMargin, leftY);
    leftY += 3;

    // --- Right Column: Working Hours ---
    
    // Header (Compact Pill)
    doc.setFillColor(230, 240, 230);
    doc.roundedRect(col2X - 1, rowStartY - 2.5, 23, 3.5, 1, 1, 'F');
    
    doc.setFontSize(7);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold"); 
    doc.text("Working Hours", col2X, rowStartY);
    
    let rightY = rowStartY + 4;
    
    doc.setFontSize(5.5);
    doc.setTextColor(40);
    doc.setFont("helvetica", "normal"); 
    
    const days = [
        "Mon - Fri: 9AM - 6PM",
        "Sat: 9AM - 1PM"
    ];
    
    days.forEach(d => {
        doc.text(d, col2X, rightY);
        rightY += 3;
    });

    doc.setTextColor(200, 0, 0); // Red for closed
    const closedText = doc.splitTextToSize("Sun: Closed (Emergency)", 23);
    doc.text(closedText, col2X, rightY);

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
