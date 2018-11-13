const AWS = require('aws-sdk');
const s = require('./common/settings.js')
const f = require('./common/functions.js')
const docClient = new AWS.DynamoDB.DocumentClient({region: s.REGION});

/* 
Should consist of the following (in this order):
 -commentUserId
 -postTStamp
 -commentTxt
 -postTitle
*/
var createSNSMessage = function(...items) {
    if(items.length === 0)
        return "";

    let separator = 'muiepsdasdfghjkl';
    let message = items.shift();

    items.forEach( item => {
        message += separator + item;
    });

    return message;
}

var publishToSNSTopic = function(snsTopic, message) {
    if(!f.isNullOrEmpty(snsTopic)) {
        var snsParams = {
            Message: message, /* required */
            TopicArn: snsTopic,
        };
        
        var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(snsParams).promise();
        
        publishTextPromise.then(
            function(data) {
                console.log("Message ${params.Message} send sent to the topic ${params.TopicArn}");
                console.log("MessageID is " + data.MessageId);
            }).catch(
                function(err) {
        console.error(err, err.stack);
        });
    }
}

exports.handler= function(e, ctx, callback){

    let postTStamp = e.postTStamp;
    let commentTxt = e.commentTxt;
    let commentUserId = e.commentUserId;
    let commentTStamp = e.commentTStamp;
    let commentIsAnonymous = e.commentIsAnonymous;
    let snsTopic = e.snsTopic;
    let endpointARN = e.endpoint;
    
    console.log(postTStamp)
    console.log(commentTxt)
    console.log(commentUserId)
    console.log(commentTStamp)
    console.log(commentIsAnonymous)
    console.log(snsTopic)
    console.log(endpointARN)

    if(f.isAnyNullOrEmpty(postTStamp, commentTxt, commentUserId, commentTStamp)) {
        callback(null, 
            f.createResponse('', 
            'userId, postDT, commentTxt, commentUserId or commentTStamp not provided', '', 400)
            )
    } else {
        if(f.isNullOrEmpty(commentIsAnonymous))
            commentIsAnonymous = false;

        let comment = f.createComment(commentTxt, commentUserId, commentTStamp, commentIsAnonymous)
        let params = {
            Key: {
                weekDay: s.DEFAULT_WEEK_DAY,
                postTStamp: postTStamp
            },
            TableName: s.NEWS_FEED_TABLE_NAME
        }
	
		docClient.get(params, function(err, data){
			if(err){
				callback(null, f.createResponse('', err, '', 500));
			} else {
				if(!f.isEmptyObject(data)) {

                    // Prepare comments.
				    let actionFlag = undefined
				    data = data['Item']
                    if(data['comments'] === undefined) {
                        data['comments'] = [comment];
                        actionFlag = docClient.ADD;
                    } else {
                        data['comments'].push(comment)
                        actionFlag = docClient.PUT;
                    }
                    
                    // Prepare params.
                    params.AttributeUpdates = {
                        comments: { 
                            Value: data['comments'],
                            Action: actionFlag
                        }
                    }

                    if(!f.isNullOrEmpty(snsTopic))
                        params.AttributeUpdates.snsTopic = { 
                            Value: snsTopic,
                            Action: docClient.ADD
                        }
                    
                    let snsMessage = createSNSMessage(commentUserId, postTStamp, commentTxt, data['postTitle'])
                   
                    docClient.update(params, function(err, data) {
                        if(err) {
                            callback(null, f.createResponse('', err, '', 500));
                        } else {
                            f.subscribeToTopic(snsTopic, endpointARN);
                            publishToSNSTopic(snsTopic, snsMessage);

                            callback(null, f.createResponse('Comment added', '', '', 200))
                        }
                    });
                }
                else {
                    callback(null, f.createResponse('', '', 'No post to add the comment to', 200))
                }
			}
		});
    }
}