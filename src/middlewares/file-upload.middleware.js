const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3();

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.REGION,
});

const upload = multer({
    limits: { fileSize: 1024 * 1024 * 25 },
    storage: multerS3({
        acl: 'public-read',
        s3,
        bucket: process.env.BUCKET_NAME,
        ContentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            let newFileName = Date.now() + "-" + file.originalname;
            let fullPath = newFileName;
            cb(null, fullPath);
        },
    }),
});

module.exports = {
    upload,
};
