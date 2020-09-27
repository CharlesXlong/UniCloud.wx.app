'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	console.log(event);
	return db.collection(event.tableName)
		.where({
			_openid: event._openid,
			delete: false
		})
		.orderBy('created','desc')
		.skip((event.data.limit || 10) * (event.data.page - 1))
		.limit(event.data.limit || 10)
		.get()
};
