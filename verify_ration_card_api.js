import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function testApi() {
  try {
    const form = new FormData();
    form.append('name', 'Test User');
    form.append('fatherName', 'Test Father');
    form.append('email', 'test@example.com');
    // We can skip files or provide dummy buffers if needed, 
    // but code handles missing files gracefully or we can try to upload a dummy file.
    // Let's try without files first to basic logic.
    
    // Add required fields
    form.append('uniqueNumber', 'ShouldBeIgnored'); 
    
    const response = await axios.post('http://localhost:3000/api/rationCard', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    console.log('API Response Status:', response.status);
    console.log('API Response Data:', response.data);
    
    if (response.data.success && response.data.data.uniqueNumber) {
        console.log('SUCCESS: Ration Card created with Unique Number:', response.data.data.uniqueNumber);
    } else {
        console.error('FAILURE: Unexpected response structure');
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
