import express from "express";
import {
  createClient,
  getClients,
  updateClient,
  deleteClient,
  toggleClientStatus,
} from "../controllers/client.controller.firestore.js";

const router = express.Router();

router.post("/", createClient);
router.get("/", getClients);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);
router.patch("/:id/status", toggleClientStatus);

export default router;
