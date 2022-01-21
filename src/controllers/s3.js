var AWS = require('aws-sdk');
var s3 = new AWS.S3({
	bucketName: 'salloneimage',
	dirName: 'frontimages/',
	region: 'us-east-1',
	accessKeyId: 'AKIATNTO5CEZYTRDSU4Q',
	secretAccessKey: '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',
});
// AWS
//     .config
//     .loadFromPath('config/aws_config.json');
var s3bucket = new AWS.S3({
	params: {
		Bucket: process.env.AWS_BUCKET,
	},
});
function s3Upload(files, path) {
	console.log('uploading file with path ', path);
	return new Promise((resolve, reject) => {
		try {
			var data = {
				Bucket: process.env.AWS_BUCKET,
				Key: `${process.env.AWS_FOLDER}${path}`,
				Body: files,
				ContentType: 'image/jpeg',
			};
			// console.log("data", data)
			s3bucket.upload(data, function (err, rese) {
				console.log('err', err);
				if (err) {
					throw err;
				}
				// console.log("rese.location",rese.Location);
				resolve(rese.Location);
			});
		} catch (e) {
			reject({ message: 'Could not upload image', err: e });
		}
	});
}

module.exports = s3Upload;
