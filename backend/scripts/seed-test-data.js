import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

// Load env vars
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.qa') });

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

if (!serviceAccount.project_id || !serviceAccount.private_key) {
  console.error('❌ Firebase environment variables not set properly');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();
const now = new Date().toISOString();

async function seedTestData() {
  console.log('🌱 Seeding test data...\n');

  try {
    // 1. Create a test client user
    const clientUid = 'test-client-001';
    const clientData = {
      uid: clientUid,
      email: 'client@example.com',
      fullName: 'Test Client',
      businessName: 'Test Business Inc.',
      role: 'client',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('users').doc(clientUid).set(clientData, { merge: true });
    console.log('✅ Created client user:', clientUid);

    // 2. Create test tasks with Company Incorporation workflow
    const tasks = [
      {
        id: 'task-001',
        workflowType: 'companyIncorporation',
        clientUid: clientUid,
        clientName: 'Test Client',
        assignedTo: 'admin', // Assign to admin for testing
        status: 'active',
        paymentStatus: 'fully_paid',
        amountPaid: 10000,
        amountDue: 0,
        isUrgent: false,
        currentStep: 1,
        currentStepName: 'Payment Gate',
        stepsCompleted: [],
        totalSteps: 41,
        createdAt: now,
        updatedAt: now,
        steps: [
          {
            stepNumber: 1,
            title: 'Payment Gate',
            status: 'completed',
            assignedTo: 'system',
            isUrgent: false,
            completedAt: now,
          },
          {
            stepNumber: 3,
            title: 'Work Assignment',
            status: 'active',
            assignedTo: 'admin',
            isUrgent: false,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            stepNumber: 4,
            title: 'Collect Name Details',
            status: 'pending',
            assignedTo: 'pending',
            isUrgent: false,
          },
        ],
      },
      {
        id: 'task-002',
        workflowType: 'companyIncorporation',
        clientUid: clientUid,
        clientName: 'Test Client',
        assignedTo: 'admin',
        status: 'pending',
        paymentStatus: 'part_paid',
        amountPaid: 5000,
        amountDue: 5000,
        isUrgent: true,
        currentStep: 1,
        currentStepName: 'Payment Gate',
        stepsCompleted: [],
        totalSteps: 41,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now,
        steps: [
          {
            stepNumber: 1,
            title: 'Payment Gate',
            status: 'pending',
            assignedTo: 'system',
            isUrgent: true,
            deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
      {
        id: 'task-003',
        workflowType: 'companyIncorporation',
        clientUid: clientUid,
        clientName: 'Test Client',
        assignedTo: 'admin',
        status: 'completed',
        paymentStatus: 'fully_paid',
        amountPaid: 25000,
        amountDue: 0,
        isUrgent: false,
        currentStep: 41,
        currentStepName: 'Company Registration Complete',
        stepsCompleted: Array.from({ length: 40 }, (_, i) => i + 1),
        totalSteps: 41,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        steps: Array.from({ length: 41 }, (_, i) => ({
          stepNumber: i + 1,
          title: `Step ${i + 1}`,
          status: 'completed',
          assignedTo: 'admin',
          isUrgent: false,
          completedAt: new Date(Date.now() - (41 - i) * 24 * 60 * 60 * 1000).toISOString(),
        })),
      },
    ];

    for (const task of tasks) {
      await db.collection('tasks').doc(task.id).set(task);
      console.log(`✅ Created task: ${task.id} (${task.status})`);
    }

    console.log('\n✅ Test data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Client: test-client-001 (client@example.com)`);
    console.log(`   - Tasks: 3`);
    console.log(`     • task-001: Active (fully paid)`);
    console.log(`     • task-002: Pending (URGENT, part paid)`);
    console.log(`     • task-003: Completed`);
    console.log('\n🔗 View tasks at: http://localhost:5179/admin/tasks\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedTestData();
