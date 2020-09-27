'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	let time = new Date()
	event.data.created = time.getTime()     //new Date()  utc 0   gettime 获取了 utc+8
	event.data.delete = false
	const collection = db.collection(event.tableName)
	const res = await collection.add(event.data)
	return res
};
