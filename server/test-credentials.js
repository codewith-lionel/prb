import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

// Test credentials
const testUser = {
  name: 'Test Student',
  email: 'test@student.com',
  password: 'test123456',
  role: 'student'
};

const testInvestor = {
  name: 'Test Investor',
  email: 'test@investor.com',
  password: 'test123456',
  role: 'investor'
};

const testAdmin = {
  name: 'Admin User',
  email: 'admin@iblaze.com',
  password: 'admin123456',
  role: 'admin'
};

async function testRegister(user) {
  console.log(`\n📝 Testing Registration for ${user.role}...`);
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('User ID:', data.data.user.id);
      console.log('Email:', data.data.user.email);
      console.log('Role:', data.data.user.role);
      console.log('Access Token:', data.data.accessToken.substring(0, 20) + '...');
      return data.data;
    } else {
      console.log('❌ Registration failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

async function testLogin(email, password) {
  console.log(`\n🔑 Testing Login for ${email}...`);
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User:', data.data.user.name);
      console.log('Role:', data.data.user.role);
      console.log('Access Token:', data.data.accessToken.substring(0, 20) + '...');
      return data.data;
    } else {
      console.log('❌ Login failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

async function testGetMe(accessToken) {
  console.log('\n👤 Testing Get Current User...');
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Get user successful!');
      console.log('User:', data.data.name);
      console.log('Email:', data.data.email);
      console.log('Role:', data.data.role);
      return data.data;
    } else {
      console.log('❌ Get user failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

async function testRefreshToken(refreshToken) {
  console.log('\n🔄 Testing Refresh Token...');
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Token refresh successful!');
      console.log('New Access Token:', data.data.accessToken.substring(0, 20) + '...');
      return data.data;
    } else {
      console.log('❌ Token refresh failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Credential Tests...\n');
  console.log('Testing against:', BASE_URL);
  
  // Test Student Registration
  const studentData = await testRegister(testUser);
  
  if (studentData) {
    // Test Student Login
    await testLogin(testUser.email, testUser.password);
    
    // Test Get Current User
    await testGetMe(studentData.accessToken);
    
    // Test Refresh Token
    await testRefreshToken(studentData.refreshToken);
  }
  
  // Test Investor Registration
  await testRegister(testInvestor);
  
  // Test Admin Registration
  const adminData = await testRegister(testAdmin);
  
  if (adminData) {
    // Test Admin Login
    await testLogin(testAdmin.email, testAdmin.password);
  }
  
  // Test Invalid Login
  console.log('\n🔒 Testing Invalid Login...');
  await testLogin('wrong@email.com', 'wrongpassword');
  
  console.log('\n✨ Tests Complete!\n');
}

runTests();
