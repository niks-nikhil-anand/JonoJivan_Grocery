import axios from 'axios';
import FormData from 'form-data';

async function testApi() {
  try {
    const form = new FormData();
    form.append('name', 'Test User Updated');
    form.append('fatherName', 'Test Father Updated');
    form.append('email', 'testupdated@example.com');
    
    // New fields
    const testAadhaar = "123412341234";
    const testPan = "ABCDE1234F";
    form.append('aadhaarCardNumber', testAadhaar);
    form.append('panCardNumber', testPan);
    
    const response = await axios.post('http://localhost:3000/api/rationCard', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    console.log('API Response Status:', response.status);
    
    if (response.data.success) {
        const { aadhaarCardNumber, panCardNumber, uniqueNumber } = response.data.data;
        console.log('Unique Number:', uniqueNumber);
        
        if (aadhaarCardNumber === testAadhaar && panCardNumber === testPan) {
             console.log('SUCCESS: Verified Aadhaar and PAN numbers were saved correctly.');
        } else {
             console.error('FAILURE: Saved numbers do not match input.');
             console.log('Expected Aadhaar:', testAadhaar, 'Got:', aadhaarCardNumber);
             console.log('Expected PAN:', testPan, 'Got:', panCardNumber);
        }

    } else {
        console.error('FAILURE: Unexpected response structure', response.data);
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
