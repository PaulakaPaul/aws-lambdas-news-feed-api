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
    
        //Modified by @Sebi
        
        // Create promise and SNS service object -- Create the TOPIC 
        var name = '' + postTStamp;
        var createTopicPromise = new AWS.SNS({apiVersion: '2010-03-31'}).createTopic({Name: name}).promise();

        // handle promise's fulfilled/rejected states
        createTopicPromise.then(
        function(data) {
            console.log("Topic ARN is " + data.TopicArn);
            let snsTopic = data.TopicArn;

            //Subsribe to the topic 
            var params = {
                Protocol: 'application', /* required */
                TopicArn: 'arn:aws:sns:eu-central-1:607620462817:1537110461706', /* required */
                Endpoint: 'arn:aws:sns:eu-central-1:607620462817:endpoint/GCM/LowkeyHelp/a95fcd99-c362-3c92-b71a-8e9aae7ea37c'
            };

            // Create promise and SNS service object
            var subscribePromise = new AWS.SNS({apiVersion: '2010-03-31'}).subscribe(params).promise();

            // handle promise's fulfilled/rejected states
            subscribePromise.then(
                function(data) {

                    if(f.isNullOrEmpty(isAnonymous))
                    isAnonymous = false;
                
                    var post = {
                        Item: f.createEntry(s.DEFAULT_WEEK_DAY, postTStamp, userId, postTitle, postTxt, isAnonymous, snsTopic, []),
                        TableName: s.NEWS_FEED_TABLE_NAME
                    };
            
                    docClient.put(post, function(err, data){
                        if(err){
                            callback(null, f.createResponse('', err, '', 500));
                        } else { 
                            callback(null, f.createResponse('Post saved', '', '', 200))
                        }
                    });

                }).catch(

                function(err) {
                    callback(null, f.createResponse('', err, '', 500));
            });
        }).catch(
            
        function(err) {
            callback(null, f.createResponse('', err, '', 500));
        });
       
    }
}
