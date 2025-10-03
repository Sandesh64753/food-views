const express = require('express')
const router = express.Router()
const savedController = require('../controllers/savedpage.controller')
const { authUserMiddleware } = require('../middlewares/auth.middleware')

// POST /api/save - save a page
router.post('/', authUserMiddleware, savedController.savePage)

// GET /api/save - list saved pages
router.get('/', authUserMiddleware, savedController.getSavedPages)

// DELETE /api/save/:id - delete saved page
router.delete('/:id', authUserMiddleware, savedController.deleteSavedPage)

module.exports = router
