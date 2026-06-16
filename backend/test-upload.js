import './set-test-env.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import app from './src/app.js';
import User from './src/models/User.js';
import Upload from './src/models/Upload.js';
import { ROLES } from './src/constants/roles.js';

import { generateAccessToken } from './src/utils/token.js';

dotenv.config();

const runUploadTests = async () => {
  let server;
  let testUser;
  let testUserToken;
  const createdFiles = [];

  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/enginow-events';
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // 1. Setup test user
    await User.deleteMany({ email: 'test.uploader@enginow.com' });
    testUser = await User.create({
      name: 'Test Uploader',
      email: 'test.uploader@enginow.com',
      passwordHash: 'somepassword123',
      role: ROLES.PARTICIPANT,
    });
    
    // Generate JWT token using updated access token generator
    testUserToken = generateAccessToken(testUser);
    console.log(`Created test user: ${testUser.email} with token.`);

    // 2. Start Express server on dynamic port
    server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api/uploads/image`;
    console.log(`Express server started on port ${port}. Base URL: ${baseUrl}`);

    console.log('\n--- Test Case 1: Unauthenticated request ---');
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
      });
      const data = await response.json();
      console.log(`Status: ${response.status}`);
      console.log('Response:', JSON.stringify(data));
      if (response.status !== 401) {
        throw new Error(`Expected 401, got ${response.status}`);
      }
      if (data.success !== false) {
        throw new Error(`Expected success to be false, got ${data.success}`);
      }
      console.log('✔ Case 1 Passed: Correctly blocked unauthenticated request.');
    } catch (err) {
      console.error('❌ Case 1 Failed:', err.message);
      throw err;
    }

    console.log('\n--- Test Case 2: PDF file upload (Forbidden file type) ---');
    try {
      const form = new FormData();
      const pdfBlob = new Blob([new Uint8Array(100)], { type: 'application/pdf' });
      form.append('image', pdfBlob, 'test-doc.pdf');

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${testUserToken}`,
        },
        body: form,
      });
      const data = await response.json();
      console.log(`Status: ${response.status}`);
      console.log('Response:', JSON.stringify(data));
      if (response.status !== 400) {
        throw new Error(`Expected 400, got ${response.status}`);
      }
      if (data.success !== false || !data.message.includes('only images are allowed')) {
        throw new Error(`Expected bad request image rejection error message, got: ${data.message}`);
      }
      console.log('✔ Case 2 Passed: Correctly rejected PDF uploads.');
    } catch (err) {
      console.error('❌ Case 2 Failed:', err.message);
      throw err;
    }

    console.log('\n--- Test Case 3: File size too large (>5MB limit) ---');
    try {
      const form = new FormData();
      // Generate a 5.1 MB buffer to exceed the 5MB file limit
      const largeBlob = new Blob([new Uint8Array(5.1 * 1024 * 1024)], { type: 'image/png' });
      form.append('image', largeBlob, 'large-image.png');

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${testUserToken}`,
        },
        body: form,
      });
      const data = await response.json();
      console.log(`Status: ${response.status}`);
      console.log('Response:', JSON.stringify(data));
      if (response.status !== 400) {
        throw new Error(`Expected 400, got ${response.status}`);
      }
      if (data.success !== false || !data.message.toLowerCase().includes('file too large')) {
        throw new Error(`Expected file size limit error message, got: ${data.message}`);
      }
      console.log('✔ Case 3 Passed: Correctly rejected files larger than 5MB.');
    } catch (err) {
      console.error('❌ Case 3 Failed:', err.message);
      throw err;
    }

    console.log('\n--- Test Case 4: Valid image file upload ---');
    try {
      const form = new FormData();
      const validImageBlob = new Blob([new Uint8Array(1000)], { type: 'image/png' });
      form.append('image', validImageBlob, 'valid-image.png');

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${testUserToken}`,
        },
        body: form,
      });
      const data = await response.json();
      console.log(`Status: ${response.status}`);
      console.log('Response:', JSON.stringify(data));
      if (response.status !== 201) {
        throw new Error(`Expected 201, got ${response.status}`);
      }
      if (data.success !== true || !data.data.url) {
        throw new Error(`Expected successful upload response, got success: ${data.success}`);
      }

      // Track uploaded file name for cleanup
      const urlPath = data.data.url;
      console.log(`File uploaded to: ${urlPath}`);
      if (urlPath.startsWith('uploads')) {
        createdFiles.push(urlPath);
      }

      // Verify db upload log exists
      const uploadLog = await Upload.findOne({ url: urlPath });
      if (!uploadLog) {
        throw new Error(`Upload log was not created in database for url ${urlPath}`);
      }
      console.log(`✔ Verified Upload record in database. Size: ${uploadLog.size} bytes`);
      console.log('✔ Case 4 Passed: Successfully uploaded valid image and saved log.');
    } catch (err) {
      console.error('❌ Case 4 Failed:', err.message);
      throw err;
    }

    console.log('\n======================================================');
    console.log('🎉 SUCCESS: All upload endpoint tests function perfectly!');
    console.log('======================================================');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:');
    console.error(error);
  } finally {
    // 3. Clean up database records
    if (testUser) {
      await User.deleteOne({ _id: testUser._id });
      console.log('Cleaned up test user.');
    }
    await Upload.deleteMany({ email: 'test.uploader@enginow.com' });

    // Clean up created local files
    for (const file of createdFiles) {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
          console.log(`Cleaned up test file: ${file}`);
        }
      } catch (e) {
        console.error(`Failed to clean up test file ${file}:`, e.message);
      }
    }

    // Close server and database connection
    if (server) {
      server.close();
      console.log('Stopped test server.');
    }
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
};

runUploadTests();
