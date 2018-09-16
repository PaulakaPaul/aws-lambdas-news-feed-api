const AWS = require('aws-sdk');
const s = require('./common/settings.js')
const f = require('./common/functions.js')
const docClient = new AWS.DynamoDB.DocumentClient({region: s.REGION});

exports.handler= function(e, ctx, callback){

    let userId = e.userId;
    let postTStamp = e.postTStamp;
    let postTxt = e.postTxt;
    
    console.log(userId)
    console.log(postTStamp)
    console.log(postTxt)

    if(f.isAnyNullOrEmpty(userId, postTStamp, postTxt)) {
        callback(null, f.createResponse('', 'userId, postDT or postTxt not provided', '', 400))
    } else {        
		var post = {
			Item: f.createEntry(userId, postTStamp, postTxt),
			TableName: s.NEWS_FEED_TABLE_NAME
		};
	
		docClient.put(post, function(err, data){
			if(err){
				callback(null, f.createResponse('', err, '', 500));
			}else{
				callback(null, f.createResponse('Post saved', '', '', 200))
			}
		});
    }
}
