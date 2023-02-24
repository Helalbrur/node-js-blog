const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const { auth, authorize } = require('../middlewares/auth');

router.get('/', auth, authorize('admin'), rolesController.index);
router.get('/create', auth, authorize('admin'), rolesController.create);
router.post('/', auth, authorize('admin'), rolesController.store);
router.get('/:id/edit', auth, authorize('admin'), rolesController.edit);
router.post('/:id', auth, authorize('admin'), rolesController.update);
router.delete('/:id', auth, authorize('admin'), rolesController.destroy);

module.exports = router;
