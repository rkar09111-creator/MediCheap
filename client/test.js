import axios from 'axios';

async function test() { 
  try { 
    const u = { name: 'E2ETest', email: 'e2e259@test.com', password: 'password123', phone: '1234567890' }; 
    console.log('1. Registering...'); 
    let res = await axios.post('http://127.0.0.1:5000/api/auth/register', u); 
    console.log('Auth Token:', res.data.token.substring(0,20)+'...'); 
    const t = res.data.token; 
    
    console.log('2. Fetching meds...'); 
    let meds = await axios.get('http://127.0.0.1:5000/api/medicines'); 
    console.log('Meds count:', meds.data.data.medicines.length); 
    const mId = meds.data.data.medicines[0]._id; 
    
    console.log('3. Placing order...'); 
    let order = await axios.post('http://127.0.0.1:5000/api/orders', { 
        orderItems: [{ medicine: mId, quantity: 1, price: 100 }], 
        shippingAddress: { fullName: 'Test', address: '123 Test St', city: 'City', zipCode: '12345', phone: '1234567890' }, 
        paymentMethod: 'COD',
        shippingPrice: 20,
        totalPrice: 120,
        totalAmount: 120 
    }, { headers: { Authorization: `Bearer ${t}` } }); 
    
    console.log('Order created:', order.data.data ? order.data.data.order._id : order.data._id); 
    console.log('ALL TESTS PASSED ✨'); 
  } catch(e) { 
    console.error('TEST FAILED:', e.response ? e.response.data : e.message); 
  } 
} 
test();
