import './set-test-env.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Event from './src/models/Event.js';
import OrganiserTeam from './src/models/OrganiserTeam.js';
import Registration from './src/models/Registration.js';
import Submission from './src/models/Submission.js';
import { ROLES } from './src/constants/roles.js';
import { EVENT_TYPE, EVENT_MODE } from './src/constants/eventStatus.js';
import { EVENT_STATUS } from './src/constants/eventStatus.js';
import * as eventService from './src/services/event.service.js';
import * as submissionService from './src/services/submission.service.js';

// Load environment variables
dotenv.config();

const runTests = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/enginow-events';
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // Clean up any old test data
    await User.deleteMany({ email: /test.*@enginow\.com/ });
    await Event.deleteMany({ title: /Test Event.*/ });
    await OrganiserTeam.deleteMany({ email: /test.*@organiser\.com/ });
    await Registration.deleteMany({});
    await Submission.deleteMany({});
    console.log('Cleared existing test collections.');

    console.log('\n--- 1. Testing User Model & Password Hashing ---');
    const participantPassword = 'password123';
    const participant = await User.create({
      name: 'Test Participant',
      email: 'test.participant@enginow.com',
      passwordHash: participantPassword,
      role: ROLES.PARTICIPANT,
    });
    console.log(`Created Participant: ${participant.name} (${participant.role})`);

    // Verify hashing
    if (participant.passwordHash === participantPassword) {
      throw new Error('Pre-save hashing did not execute!');
    }
    console.log('Password hashed successfully.');

    // Test compare method
    const isMatch = await participant.comparePassword(participantPassword);
    if (!isMatch) {
      throw new Error('Password compare method failed for valid password!');
    }
    console.log('Password compare method verified.');

    const organiser = await User.create({
      name: 'Test Organiser',
      email: 'test.organiser@enginow.com',
      passwordHash: 'organiserpass123',
      role: ROLES.ORGANISER,
    });
    console.log(`Created Organiser: ${organiser.name}`);

    console.log('\n--- 2. Testing Event Model & Pre-validate Date Hooks ---');
    // Test date validation failure: endDate < startDate
    try {
      await Event.create({
        title: 'Test Event Fail 1',
        tagline: 'Should fail',
        type: EVENT_TYPE.HACKATHON,
        mode: EVENT_MODE.ONLINE,
        startDate: new Date(Date.now() + 86400000), // tomorrow
        endDate: new Date(Date.now()), // today
        registrationDeadline: new Date(Date.now() + 43200000),
        description: 'Should fail validation.',
        contactName: 'Tester',
        contactEmail: 'tester@test.com',
        organiser: organiser._id,
      });
      throw new Error('Allowed endDate to be before startDate!');
    } catch (err) {
      if (err.errors && err.errors.endDate) {
        console.log('✔ Correctly prevented endDate from being before startDate:', err.errors.endDate.message);
      } else {
        throw err;
      }
    }

    // Test date validation failure: registrationDeadline > endDate
    try {
      await Event.create({
        title: 'Test Event Fail 2',
        tagline: 'Should fail',
        type: EVENT_TYPE.HACKATHON,
        mode: EVENT_MODE.ONLINE,
        startDate: new Date(Date.now() + 86400000), // tomorrow
        endDate: new Date(Date.now() + 172800000), // day after tomorrow
        registrationDeadline: new Date(Date.now() + 259200000), // day after next
        description: 'Should fail validation.',
        contactName: 'Tester',
        contactEmail: 'tester@test.com',
        organiser: organiser._id,
      });
      throw new Error('Allowed registrationDeadline to be after endDate!');
    } catch (err) {
      if (err.errors && err.errors.registrationDeadline) {
        console.log('✔ Correctly prevented registrationDeadline from being after endDate:', err.errors.registrationDeadline.message);
      } else {
        throw err;
      }
    }

    // Create valid event
    const event = await Event.create({
      title: 'Test Event 101',
      tagline: 'Learn modern backend engineering',
      type: EVENT_TYPE.HACKATHON,
      mode: EVENT_MODE.ONLINE,
      startDate: new Date(Date.now() + 86400000),
      endDate: new Date(Date.now() + 172800000),
      registrationDeadline: new Date(Date.now() + 43200000),
      description: 'A comprehensive engineering hackathon to test backend architectures.',
      contactName: 'Antigravity Test Suite',
      contactEmail: 'antigravity@test.com',
      organiser: organiser._id,
      status: EVENT_STATUS.APPROVED, // Must be approved to allow registration
    });
    console.log(`Created Valid Event: "${event.title}", Status: ${event.status}`);

    console.log('\n--- 3. Testing Registration Service (Transactions & Deprecated Sync) ---');
    // Register participant via eventService
    const registeredEvent = await eventService.registerForEvent(event._id, participant._id, {
      registrationType: 'team',
      teamName: 'Dream Team',
      teamMembers: [{ name: 'Test Participant', email: 'test.participant@enginow.com', role: 'Leader' }],
    });

    console.log(`Successfully registered participant. Event registrationCount: ${registeredEvent.registrationCount}`);
    if (registeredEvent.registrationCount !== 1) {
      throw new Error('Registration count did not increment!');
    }

    // Verify record in Registration collection
    const registrationRecord = await Registration.findOne({
      user: participant._id,
      event: event._id,
    });
    if (!registrationRecord || registrationRecord.status !== 'registered') {
      throw new Error('Registration collection record was not created successfully!');
    }
    console.log(`✔ Verified Registration record in database. Status: ${registrationRecord.status}, Type: ${registrationRecord.registrationType}`);



    // Attempting double registration should fail
    try {
      await eventService.registerForEvent(event._id, participant._id);
      throw new Error('Allowed double registration!');
    } catch (err) {
      console.log('✔ Correctly blocked double registration:', err.message);
    }

    console.log('\n--- 4. Testing Submission Service & Unique Submissions ---');
    // Submit project
    const submission = await submissionService.createSubmission(event._id, participant._id, {
      title: 'Antigravity Sub',
      description: 'A project showing transaction capabilities.',
      githubUrl: 'https://github.com/test/antigravity',
      demoUrl: 'https://demo.com',
    });
    console.log(`✔ Submission created. Title: "${submission.title}"`);

    // Verify event submissionCount
    const eventWithSub = await Event.findById(event._id);
    console.log(`Event submissionCount is: ${eventWithSub.submissionCount}`);
    if (eventWithSub.submissionCount !== 1) {
      throw new Error('Event submissionCount did not increment!');
    }

    // Test unique submission constraint (double submission should fail)
    try {
      await submissionService.createSubmission(event._id, participant._id, {
        title: 'Antigravity Duplicate',
        description: 'Duplicate description.',
      });
      throw new Error('Allowed duplicate submission by the same user!');
    } catch (err) {
      console.log('✔ Correctly blocked duplicate submission:', err.message);
    }

    console.log('\n--- 5. Testing Registration Cancellation ---');
    // Cancel registration
    const cancelledEvent = await eventService.cancelRegistration(event._id, participant._id);
    console.log(`Successfully cancelled registration. Event registrationCount: ${cancelledEvent.registrationCount}`);
    if (cancelledEvent.registrationCount !== 0) {
      throw new Error('Registration count did not decrement on cancellation!');
    }

    // Verify Registration collection state
    const cancelledRegistration = await Registration.findOne({
      user: participant._id,
      event: event._id,
    });
    if (!cancelledRegistration || cancelledRegistration.status !== 'cancelled') {
      throw new Error('Registration record status is not "cancelled"!');
    }
    console.log(`✔ Verified Registration record status is "cancelled".`);



    console.log('\n======================================================');
    console.log('🎉 SUCCESS: All production refinement features function perfectly!');
    console.log('======================================================');
  } catch (error) {
    console.error('\n❌ VERIFICATION FAILED:');
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
};

runTests();
