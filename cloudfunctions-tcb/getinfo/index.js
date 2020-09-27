'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection(event.tableName)
	const res = await collection
		.where({
			_openid: event._openid
		})
		.get()
	return res
};
