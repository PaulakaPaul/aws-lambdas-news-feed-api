const AWS = require('aws-sdk');
const s = require('./common/settings.js')
const f = require('./common/functions.js')
const docClient = new AWS.DynamoDB.DocumentClient({region: s.REGION});

exports.handler= function(e, ctx, callback){

    let referenceTimestamp = e.referenceTimestamp
    let isStart = e.isStart === 'true'
    
    console.log(referenceTimestamp)
    console.log(isStart)

    if(f.isAnyNullOrEmpty(referenceTimestamp, isStart)) {
        callback(null, 
            f.createResponse('', 
            'referenceTimestamp or isStart not provided', '', 400)
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

                if(referenceTimestamp === s.STARTING_REFERENCE_TIMESTAMP_VALUE) {
                       // Just grab the first s.PAGE_SIZE items (in descending order).
                       let items = data['Items']
                       let endPointInterval = items.length
                       let startingPointInterval = items.length - s.PAGE_SIZE;
                       items = items.slice(startingPointInterval, endPointInterval).reverse();
                       callback(null, f.createResponse(items, '', '', 200));
                } else {
                    let items = data['Items'];
                    // endPointInterval because the items are in ascending order and we will want them in
                    // descending order. But it's better to reverse only the slice of items and not the whole array.
                    let endPointInterval = items.map(function(p) {return p.postTStamp }).indexOf(referenceTimestamp);
                    console.log('endPointInterval: ' + endPointInterval)

                    if(endPointInterval === -1) {
                        // If the item does not exist stop the logic.
                        callback(null, f.createResponse([], '', 'The items from that reference point that does not exist', 200));
                    } else { 
                        
                        // If it's not the start we need the slice of items since the next item.
                        if(isStart === false)
                            endPointInterval -= 1;

                        let startingPointInterval = endPointInterval - s.PAGE_SIZE;
                        
                        // Correction for the reverse() function.
                        startingPointInterval += 1;
                        endPointInterval += 1;

                        if(startingPointInterval < 0)
                            startingPointInterval = 0;
                        if(endPointInterval < 0)
                            endPointInterval = 0;
                            
                        console.log(startingPointInterval + ' -> ' + endPointInterval)
                        items = items.slice(startingPointInterval, endPointInterval).reverse();
                        callback(null, f.createResponse(items, '', '', 200));
                    }
                }
			}
		});
    }
}