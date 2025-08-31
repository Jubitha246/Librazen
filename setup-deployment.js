#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Librazen for deployment...\n');

// Check if all required files exist
const requiredFiles = [
  'backend/package.json',
  'backend/index.js',
  'backend/Frontend/package.json',
  'backend/Frontend/src/config/api.js',
  'backend/Frontend/vercel.json'
];

console.log('📋 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log('\n🔧 Next steps:');
console.log('1. Push your code to GitHub');
console.log('2. Deploy backend to Render:');
console.log('   - Go to render.com');
console.log('   - Create new Web Service');
console.log('   - Connect your GitHub repo');
console.log('   - Set root directory to "backend"');
console.log('   - Add environment variables:');
console.log('     * NODE_ENV=production');
console.log('     * PORT=10000');
console.log('     * MongoDBURI=your_mongodb_connection_string');
console.log('');
console.log('3. Deploy frontend to Vercel:');
console.log('   - Go to vercel.com');
console.log('   - Import your GitHub repo');
console.log('   - Set root directory to "backend/Frontend"');
console.log('   - Add environment variable:');
console.log('     * VITE_API_URL=https://your-backend-app.onrender.com');
console.log('');
console.log('4. Update CORS in backend/index.js with your Vercel URL');
console.log('5. Redeploy both services');

console.log('\n📖 See DEPLOYMENT_GUIDE.md for detailed instructions');
