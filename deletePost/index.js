const AWS = require('aws-sdk');
const s = require('./common/settings.js')
const f = require('./common/functions.js')
const docClient = new AWS.DynamoDB.DocumentClient({region: s.REGION});

exports.handler= function(e, ctx, callback){

    let postTStamp = e.postTStamp;
    
    console.log(postTStamp)

    if(f.isAnyNullOrEmpty(postTStamp)) {
        callback(null, f.createResponse('', 'postTStamp not provided', '', 400))
    } else {   
        let params = {
            TableName : s.NEWS_FEED_TABLE_NAME,
            Key: {
              weekDay: s.DEFAULT_WEEK_DAY,
              postTStamp: postTStamp
            }
          };
	
		docClient.delete(params, function(err, data){
			if(err){
				callback(null, f.createResponse('', err, '', 500));
			}else{
				callback(null, f.createResponse('Post deleted', '', '', 200))
			}
		});
    }
}
