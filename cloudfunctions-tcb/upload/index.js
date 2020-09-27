'use strict';
const fs = require("fs");
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let result = await uniCloud.uploadFile({
		cloudPath: "test-admin.jpeg",
		fileContent: fs.createReadStream(`${__dirname}/cos.jpeg`)
	});

	//返回数据给客户端
	return result
};
