import express from 'express';
import { createGroup, listGroups, getGroup, updateGroup, deleteGroup } from '../controllers/eventGroupController.js';

const router = express.Router();

router.post('/', createGroup);
router.get('/', listGroups);
router.get('/:id', getGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

export default router;
