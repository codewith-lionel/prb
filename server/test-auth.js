import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testCredentials() {
  console.log('🔐 iBLAZE Credential System Test\n');
  console.log('=' .repeat(50));
  
  // Test 1: Register a new student
  console.log('\n1️⃣  REGISTER NEW STUDENT');
  console.log('-'.repeat(50));
  const studentData = {
    name: 'John Doe',
    email: `student${Date.now()}@test.com`,
    password: 'password123',
    role: 'student'
  };
  
  try {
    const regResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    const regData = await regResponse.json();
    
    if (regResponse.ok) {
      console.log('✅ Registration successful');
      console.log(`   User: ${regData.data.user.name}`);
      console.log(`   Email: ${regData.data.user.email}`);
      console.log(`   Role: ${regData.data.user.role}`);
      console.log(`   Approved: ${regData.data.user.isApproved}`);
      console.log(`   Access Token: ${regData.data.accessToken.substring(0, 30)}...`);
      
      const accessToken = regData.data.accessToken;
      const refreshToken = regData.data.refreshToken;
      
      // Test 2: Get current user
      console.log('\n2️⃣  GET CURRENT USER');
      console.log('-'.repeat(50));
      const meResponse = await fetch(`${BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const meData = await meResponse.json();
      
      if (meResponse.ok) {
        console.log('✅ Get user successful');
        console.log(`   Name: ${meData.data.name}`);
        console.log(`   Email: ${meData.data.email}`);
        console.log(`   Role: ${meData.data.role}`);
      } else {
        console.log('❌ Get user failed:', meData.error);
      }
      
      // Test 3: Refresh token
      console.log('\n3️⃣  REFRESH ACCESS TOKEN');
      console.log('-'.repeat(50));
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      const refreshData = await refreshResponse.json();
      
      if (refreshResponse.ok) {
        console.log('✅ Token refresh successful');
        console.log(`   New Access Token: ${refreshData.data.accessToken.substring(0, 30)}...`);
      } else {
        console.log('❌ Token refresh failed:', refreshData.error);
      }
      
      // Test 4: Login with credentials
      console.log('\n4️⃣  LOGIN WITH CREDENTIALS');
      console.log('-'.repeat(50));
      const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: studentData.email,
          password: studentData.password
        })
      });
      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        console.log('✅ Login successful');
        console.log(`   User: ${loginData.data.user.name}`);
        console.log(`   Access Token: ${loginData.data.accessToken.substring(0, 30)}...`);
      } else {
        console.log('❌ Login failed:', loginData.error);
      }
      
    } else {
      console.log('❌ Registration failed:', regData.error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  // Test 5: Invalid login
  console.log('\n5️⃣  INVALID LOGIN TEST');
  console.log('-'.repeat(50));
  try {
    const invalidLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'wrong@email.com',
        password: 'wrongpassword'
      })
    });
    const invalidData = await invalidLogin.json();
    
    if (!invalidLogin.ok) {
      console.log('✅ Invalid credentials properly rejected');
      console.log(`   Error: ${invalidData.error}`);
    } else {
      console.log('❌ Security issue: invalid login succeeded!');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  // Test 6: Register Investor
  console.log('\n6️⃣  REGISTER INVESTOR');
  console.log('-'.repeat(50));
  try {
    const investorData = {
      name: 'Jane Investor',
      email: `investor${Date.now()}@test.com`,
      password: 'password123',
      role: 'investor'
    };
    
    const invResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(investorData)
    });
    const invData = await invResponse.json();
    
    if (invResponse.ok) {
      console.log('✅ Investor registration successful');
      console.log(`   User: ${invData.data.user.name}`);
      console.log(`   Role: ${invData.data.user.role}`);
      console.log(`   Approved: ${invData.data.user.isApproved} (Investors need approval)`);
    } else {
      console.log('❌ Investor registration failed:', invData.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ Credential Test Complete!\n');
}

testCredentials();
