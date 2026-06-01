import express from 'express';
import {
  createTeamMember,
  getTeamMembers,
  getTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/team-members.controller.js';

const router = express.Router();

// Routes
router.post('/', createTeamMember);           // Create team member
router.get('/', getTeamMembers);              // Get all team members
router.get('/:uid', getTeamMember);           // Get single team member
router.patch('/:uid', updateTeamMember);      // Update team member
router.delete('/:uid', deleteTeamMember);     // Delete team member

export default router;
