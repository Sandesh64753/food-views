const SavedPage = require('../models/savedpage.model')

async function savePage(req, res) {
    try {
        const { title, url } = req.body
        if (!url) return res.status(400).json({ message: 'URL is required' })

        const saved = await SavedPage.create({
            user: req.user._id,
            title,
            url
        })

        res.status(201).json({ message: 'Page saved', saved })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to save page', error: err.message })
    }
}

async function getSavedPages(req, res) {
    try {
        const saved = await SavedPage.find({ user: req.user._id }).sort({ createdAt: -1 })
        res.status(200).json({ saved })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to fetch saved pages', error: err.message })
    }
}

async function deleteSavedPage(req, res) {
    try {
        const id = req.params.id
        const doc = await SavedPage.findOneAndDelete({ _id: id, user: req.user._id })
        if (!doc) return res.status(404).json({ message: 'Not found or not authorized' })
        res.status(200).json({ message: 'Deleted' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to delete', error: err.message })
    }
}

module.exports = {
    savePage,
    getSavedPages,
    deleteSavedPage
}
