const ImageKit = require("imagekit");

async function uploadFile(file, fileName) {
    // Lazy init ImageKit so requiring this module doesn't crash when env vars are missing
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT

    if (!publicKey || !privateKey || !urlEndpoint) {
        throw new Error("ImageKit configuration missing. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in env.")
    }

    const imagekit = new ImageKit({
        publicKey,
        privateKey,
        urlEndpoint
    })

    // file: multer file object (buffer, originalname, mimetype, etc.)
    const result = await imagekit.upload({
        file: file.buffer,
        fileName: fileName || file.originalname
    })

    return result.url
}

module.exports = {
    uploadFile
}