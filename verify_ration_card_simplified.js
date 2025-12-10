import axios from 'axios';
import FormData from 'form-data';

async function testApi() {
  try {
    const form = new FormData();
    form.append('name', 'Test User Simplified');
    form.append('fatherName', 'Test Father Simplified');
    form.append('email', 'testsimplified@example.com');
    // New fields
    const testAadhaar = "999988887777";
    const testPan = "QWERT1234Y";
    form.append('aadhaarCardNumber', testAadhaar);
    form.append('panCardNumber', testPan);
    
    // Attempting to send file fields (should be ignored or just irrelevant now)
    // form.append('aadhaarCard', 'dummy'); 
    
    const response = await axios.post('http://localhost:3000/api/rationCard', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    console.log('API Response Status:', response.status);
    
    if (response.data.success) {
        const { aadhaarCardNumber, panCardNumber, uniqueNumber, aadhaarCard, panCard } = response.data.data;
        console.log('Unique Number:', uniqueNumber);
        
        if (aadhaarCardNumber === testAadhaar && panCardNumber === testPan) {
             console.log('SUCCESS: Verified Aadhaar and PAN numbers.');
        } else {
             console.error('FAILURE: Numbers mismatch.');
        }

        if (aadhaarCard === undefined && panCard === undefined) {
            console.log('SUCCESS: File fields are correctly absent.');
        } else {
             console.error('FAILURE: File fields still present?', aadhaarCard, panCard);
        }

    } else {
        console.error('FAILURE: Unexpected response', response.data);
    }

  } catch (error) {
    if (error.response) {
       console.error('API Error Status:', error.response.status);
       console.error('API Error Data:', error.response.data);
    } else {
       console.error('Network/Script Error:', error.message);
    }
  }
}

testApi();
