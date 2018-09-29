const AWS = require('aws-sdk');
const s = require('./common/settings.js')
const f = require('./common/functions.js')
const docClient = new AWS.DynamoDB.DocumentClient({region: s.REGION});

exports.handler= function(e, ctx, callback){

    let pageNumber = e.pageNumber;
    let referenceTimestamp = e.referenceTimestamp
    
    console.log(pageNumber)
    console.log(referenceTimestamp)

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

                if(referenceTimestamp === undefined) {
                    let startingPointInterval = pageNumber * s.PAGE_SIZE;
                    let endPointInterval = startingPointInterval + s.PAGE_SIZE;
                    let items = data['Items'].reverse();
                    items = items.slice(startingPointInterval, endPointInterval);
                    callback(null, f.createResponse(items, '', '', 200));
                } else {
                    let items = data['Items'];
                    // endPointInterval because the items are in ascending order and we will want them in
                    // descending order. But it's better to reverse only the slice of items and not the whole array.
                    let endPointInterval = items.map(function(p) {return p.postTStamp }).indexOf(referenceTimestamp);
                    console.log('endPointInterval: ' + endPointInterval)

                    if(endPointInterval === -1) {
                        // If the item does not exist stop the logic.
                        callback(null, f.createResponse([], '', '', 200));
                    } else { 
                        // Send the page of items since the index of the sent item - 1.
                        endPointInterval -= 1;
                        let startingPointInterval = endPointInterval - s.PAGE_SIZE;
                        items = items.slice(startingPointInterval, endPointInterval).reverse();
                        callback(null, f.createResponse(items, '', '', 200));
                    }
                }
			}
		});
    }
}