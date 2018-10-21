const AWS = require('aws-sdk');
const s = require('./common/settings.js')
const f = require('./common/functions.js')
const docClient = new AWS.DynamoDB.DocumentClient({region: s.REGION});

exports.handler= function(e, ctx, callback){

    let postTStamp = e.postTStamp;
    
    console.log(postTStamp)

    if(f.isAnyNullOrEmpty(postTStamp)) {
        callback(null, 
            f.createResponse('', 
            'postTStamp not provided', '', 400)
            )
    } else {     
        postTStamp = +postTStamp;
        let params = {
            Key: {
                weekDay: s.DEFAULT_WEEK_DAY,
                postTStamp: postTStamp
            },
            TableName: s.NEWS_FEED_TABLE_NAME
        };
	
		docClient.get(params, function(err, data){
			if(err){
				callback(null, f.createResponse('', err, '', 500));
			} else {
				if(!f.isEmptyObject(data)) {
                    callback(null, f.createResponse(data['Item'], '', 'No post to add the comment to', 200))
                } else {
                    callback(null, f.createResponse('', '', 'No post to return.', 200))
                }
			}
		});
    }
}