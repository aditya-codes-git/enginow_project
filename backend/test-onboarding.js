import './set-test-env.js';
import mongoose from 'mongoose';
import app from './src/app.js';
import User from './src/models/User.js';
import OrganizerApplication from './src/models/OrganizerApplication.js';
import { ROLES } from './src/constants/roles.js';
import env from './src/config/env.js';

const runOnboardingTests = async () => {
  let server;
  const participantEmail = 'existing.participant@enginow.com';
  const organizerEmail = 'existing.organiser@enginow.com';
  const applicantEmail = 'applicant.test@enginow.com';

  try {
    const mongoUri = env.MONGO_URI || 'mongodb://localhost:27017/enginow-events';
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Database connected.');

    // Cleanup
    await User.deleteMany({ email: { $in: [participantEmail, organizerEmail] } });
    await OrganizerApplication.deleteMany({ email: { $in: [applicantEmail, participantEmail, organizerEmail] } });
    console.log('Cleanup completed.');

    // Seed test users
    await User.create({
      name: 'Existing Participant',
      email: participantEmail,
      passwordHash: 'password123',
      role: ROLES.PARTICIPANT,
    });
    await User.create({
      name: 'Existing Organiser',
      email: organizerEmail,
      passwordHash: 'password123',
      role: ROLES.ORGANISER,
    });
    console.log('Test users seeded.');

    // Start server
    server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api/organizer-applications`;
    console.log(`Server booted on port ${port}. Base URL: ${baseUrl}`);

    console.log('\n--- 1. Testing Organizer Application Validation (Zod Validation Error) ---');
    const badRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationName: 'Short',
        // missing fields
      }),
    });
    console.log(`Validation status code: ${badRes.status}`);
    const badBody = await badRes.json();
    console.log('Validation failure response:', JSON.stringify(badBody));
    if (badRes.status !== 400) {
      throw new Error('Expected validation failure (400)');
    }
    console.log('✔ Zod validation successfully rejected bad input.');

    console.log('\n--- 2. Testing Organizer Application Success (Participant Role Email allowed) ---');
    const goodApp = {
      organizationName: 'SVNIT Developers Chapter',
      organizationType: 'Student Chapter',
      applicantName: 'Kriti Patel',
      email: participantEmail, // participant email
      phone: '9876543210',
      website: 'https://svnit.ac.in',
      linkedin: 'https://linkedin.com/in/kriti',
      city: 'Surat',
      country: 'India',
      description: 'A student technical group organizing local hackathons.',
      purpose: 'We want to host our annual coding contest.',
      expectedEvents: 3,
      expectedParticipants: 200,
      additionalInformation: 'Looking forward to hosting soon.',
    };

    const goodRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goodApp),
    });
    console.log(`Successful submission status code: ${goodRes.status}`);
    const goodBody = await goodRes.json();
    console.log('Success response body:', JSON.stringify(goodBody));
    if (goodRes.status !== 201 || !goodBody.success) {
      throw new Error(`Expected successful creation (201), got ${goodRes.status}`);
    }
    console.log('✔ Organizer Application successfully submitted by participant.');

    // Check DB representation
    const dbApp = await OrganizerApplication.findOne({ email: participantEmail });
    if (!dbApp || dbApp.status !== 'Pending') {
      throw new Error('Application not found in database or status is not Pending');
    }
    console.log('✔ DB checks passed: Application exists with status Pending.');

    // Check existing participant role remained unchanged
    const dbUser = await User.findOne({ email: participantEmail });
    if (dbUser.role !== ROLES.PARTICIPANT) {
      throw new Error(`Participant role was modified to: ${dbUser.role}`);
    }
    console.log('✔ Security check: Applicant user role remains Participant.');

    console.log('\n--- 3. Testing Duplicate Application Prevention ---');
    const dupRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goodApp),
    });
    console.log(`Duplicate submission status code: ${dupRes.status}`);
    const dupBody = await dupRes.json();
    console.log('Duplicate failure response:', JSON.stringify(dupBody));
    if (dupRes.status !== 400 || !dupBody.message.includes('already in progress')) {
      throw new Error('Expected duplicate check failure (400)');
    }
    console.log('✔ Duplicate submission successfully prevented.');

    console.log('\n--- 4. Testing Reapplication when previous is Rejected/Withdrawn ---');
    // Reject the previous application manually
    dbApp.status = 'Rejected';
    await dbApp.save();
    console.log('Previous application status updated to Rejected in database.');

    const reRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goodApp),
    });
    console.log(`Re-submission status code: ${reRes.status}`);
    if (reRes.status !== 201) {
      throw new Error(`Expected successful creation on reapplication (201), got ${reRes.status}`);
    }
    console.log('✔ Reapplication allowed after previous rejection.');

    console.log('\n--- 5. Testing Existing Organizer Role Rejection ---');
    const organiserApp = { ...goodApp, email: organizerEmail };
    const orgRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(organiserApp),
    });
    console.log(`Organiser submission status code: ${orgRes.status}`);
    const orgBody = await orgRes.json();
    console.log('Organiser failure response:', JSON.stringify(orgBody));
    if (orgRes.status !== 400 || !orgBody.message.includes('already registered as an organizer')) {
      throw new Error('Expected organiser check failure (400)');
    }
    console.log('✔ Submission from existing organizer blocked successfully.');

    console.log('\n======================================================');
    console.log('🎉 SUCCESS: All Organizer Onboarding tests passed!');
    console.log('======================================================');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:');
    console.error(error);
  } finally {
    // Cleanup
    await User.deleteMany({ email: { $in: [participantEmail, organizerEmail] } });
    await OrganizerApplication.deleteMany({ email: { $in: [applicantEmail, participantEmail, organizerEmail] } });
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

runOnboardingTests();
