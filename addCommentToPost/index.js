const AWS = require('aws-sdk');
const s = require('./common/settings.js')
const f = require('./common/functions.js')
const docClient = new AWS.DynamoDB.DocumentClient({region: s.REGION});

exports.handler= function(e, ctx, callback){

    let userId = e.userId;
    let postTStamp = e.postTStamp;
    
    let commentTxt = e.commentTxt;
    let commentUserId = e.commentUserId;
    let commentTStamp = e.commentTStamp;
    
    console.log(userId)
    console.log(postTStamp)
    console.log(commentTxt)
    console.log(commentUserId)
    console.log(commentTStamp)

    if(f.isAnyNullOrEmpty(userId, postTStamp, commentTxt, commentUserId, commentTStamp)) {
        callback(null, 
            f.createResponse('', 
            'userId, postDT, commentTxt, commentUserId or commentTStamp not provided', '', 400)
            )
    } else {     
           
        let comment = f.createComment(commentTxt, commentUserId, commentTStamp)
        let params = {
            Key: {
                userId: userId,
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
                   
                    docClient.update(params, function(err, data) {
                        if(err) {
                            callback(null, f.createResponse('', err, '', 500));
                        } else {
                            callback(null, f.createResponse('Comment added', '', '', 200))
                        }
                    });
                }
			}
		});
    }
}