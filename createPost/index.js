const AWS = require('aws-sdk');
const s = require('./common/settings.js')
const f = require('./common/functions.js')
const docClient = new AWS.DynamoDB.DocumentClient({region: s.REGION});

exports.handler= function(e, ctx, callback){

    let userId = e.userId;
    let postTStamp = e.postTStamp;
    let postTitle = e.postTitle;
    let postTxt = e.postTxt;
    let isAnonymous = e.isAnonymous;
    
    console.log(userId)
    console.log(postTStamp)
    console.log(postTitle)
    console.log(postTxt)
    console.log(isAnonymous)

    if(f.isAnyNullOrEmpty(userId, postTStamp, postTitle, postTxt)) {
        callback(null, f.createResponse('', 'weekDay, userId, postDT, postTitle or postTxt not provided', '', 400))
    } else {   
        if(f.isNullOrEmpty(isAnonymous))
            isAnonymous = false;
        
		var post = {
			Item: f.createEntry(s.DEFAULT_WEEK_DAY, postTStamp, userId, postTitle, postTxt, isAnonymous, []),
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
