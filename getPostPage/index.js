const AWS = require('aws-sdk');
const s = require('./common/settings.js')
const f = require('./common/functions.js')
const docClient = new AWS.DynamoDB.DocumentClient({region: s.REGION});

exports.handler= function(e, ctx, callback){

    let pageNumber = e.pageNumber;
    
    console.log(pageNumber)

    if(f.isAnyNullOrEmpty(pageNumber)) {
        callback(null, 
            f.createResponse('', 
            'pageNumber not provided', '', 400)
            )
    } else {     
           
        let params = {
            TableName: s.NEWS_FEED_TABLE_NAME,
            IndexName: 'weekDay-postTStamp',
            KeyConditionExpression: 'weekDay = :weekDay and postTStamp > :postTStamp',
            ExpressionAttributeValues: {
                ':weekDay': s.DEFAULT_WEEK_DAY,
                ':postTStamp': Date.now() - s.MAX_TIMESTAMP_QUERY
            }
        }
	
		docClient.query(params, function(err, data){
			if(err){
				callback(null, f.createResponse('', err, '', 500));
			} else {
			    let startingPointInterval = pageNumber * s.PAGE_SIZE;
			    let endPointInterval = startingPointInterval + s.PAGE_SIZE;
			    let items = data['Items'].reverse();
			    items = items.slice(startingPointInterval, endPointInterval);
				callback(null, f.createResponse(items, '', '', 200));
			}
		});
    }
}