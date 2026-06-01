import { db, admin } from '../config/firebase.js';
import {
  upsertUser,
  validateProfileData,
  getUserByUid,
  updateUserRole,
  deleteUser,
} from '../services/userService.js';

/**
 * Create or update a team member
 * Admin/Manager can create and manage team members
 * 
 * Supports all 3 scenarios:
 * 1. Create new team member
 * 2. Merge with existing user (Google or Email auth)
 * 3. Change admin-assigned role
 */
export const createTeamMember = async (req, res) => {
  try {
    const { name, email, phone, designation, role, joiningDate, fathersName, dateOfBirth, address } = req.body;
    const adminUid = req.user?.uid || 'admin';

    // Validation
    const required = ['name', 'email', 'phone', 'designation', 'role', 'joiningDate'];
    const validation = validateProfileData(req.body, required);
    if (!validation.valid) {
      return res.status(400).json({
        message: 'Missing required fields',
        missing: validation.missing,
      });
    }

    // Call unified upsertUser service
    const result = await upsertUser(
      email,
      role,
      {
        name,
        email,
        phone,
        designation,
        joiningDate,
        fathersName,
        dateOfBirth,
        address,
      },
      {
        sendEmail: true,
        authProvider: 'email',
        createdBy: adminUid,
      }
    );

    res.status(result.isUpdate ? 200 : 201).json({
      uid: result.uid,
      email: result.email,
      name: result.name,
      role: result.role,
      isUpdate: result.isUpdate,
      scenario: result.scenario,
      message: result.message,
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL TEAM MEMBERS ================= */
export const getTeamMembers = async (req, res) => {
  try {
    const snapshot = await db
      .collection('users')
      .where('type', '==', 'team_member')
      .orderBy('createdAt', 'desc')
      .get();

    const teamMembers = [];
    snapshot.forEach(doc => {
      teamMembers.push({
        uid: doc.id,
        ...doc.data()
      });
    });

    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE TEAM MEMBER ================= */
export const getTeamMember = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await getUserByUid(uid);

    if (!user) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE TEAM MEMBER ================= */
export const updateTeamMember = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, phone, designation, role, fathersName, dateOfBirth, address } = req.body;
    const adminUid = req.user?.uid || 'admin';

    // Get current user
    const currentUser = await getUserByUid(uid);
    if (!currentUser) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const now = new Date().toISOString();

    // Update Firestore
    await db.collection('users').doc(uid).update({
      name,
      phone,
      designation,
      role,
      fathersName,
      dateOfBirth,
      address,
      updatedAt: now,
      updatedBy: adminUid,
    });

    // Update Firebase custom claims if role changed
    if (role && role !== currentUser.role) {
      await admin.auth().setCustomUserClaims(uid, { role });
    }

    res.json({
      uid,
      message: 'Team member updated successfully',
      roleChanged: role !== currentUser.role,
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE TEAM MEMBER ================= */
export const deleteTeamMember = async (req, res) => {
  try {
    const { uid } = req.params;

    // Check if user exists
    const user = await getUserByUid(uid);
    if (!user) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Delete using unified service
    await deleteUser(uid);

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: error.message });
  }
};

