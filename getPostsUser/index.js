const AWS = require('aws-sdk');
const s = require('./common/settings.js')
const f = require('./common/functions.js')
const docClient = new AWS.DynamoDB.DocumentClient({region: s.REGION});

exports.handler= function(e, ctx, callback){

    let userId = e.userId;
    
    console.log(userId)

    if(f.isAnyNullOrEmpty(userId)) {
        callback(null, 
            f.createResponse('', 
            'userId not provided', '', 400)
            )
    } else {     
           
        let params = {
            TableName: s.NEWS_FEED_TABLE_NAME,
            IndexName: 'userId-postTStamp',
            KeyConditionExpression: 'userId = :userId and postTStamp > :postTStamp',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':postTStamp': Date.now() - s.MAX_TIMESTAMP_USER_QUERY
            }
        }
	
		docClient.query(params, function(err, data){
			if(err){
				callback(null, f.createResponse('', err, '', 500));
			} else {
			    let items = data['Items'].reverse();
				callback(null, f.createResponse(items, '', '', 200));
			}
		});
    }
}