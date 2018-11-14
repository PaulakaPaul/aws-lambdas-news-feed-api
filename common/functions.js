var createResponse = function(data='', errorMessage='', infoMessage='', statusCode=0) {
    return {
        data: data,
        errorMessage: errorMessage,
        infoMessage: infoMessage,
        statusCode: statusCode
    };
}

var createEntry = function(weekDay, postTStamp, userId, postTitle, postTxt, isAnonymous, snsTopic, comments=undefined) {
    if(!isAnyNullOrEmpty(weekDay, userId, postTStamp, postTxt))
        return {
            weekDay: weekDay,
            postTStamp: postTStamp,
            userId: userId,
            postTitle: postTitle,
            postTxt: postTxt,
            isAnonymous: isAnonymous,
            snsTopic: snsTopic,
            comments: comments
        }
    throw new Error('Post entry has no userId, postTStamp or postTxt which are mandatory.')
}

var createComment = function(commentTxt, commentUserId, commentTStamp, commentUserUsername, commentIsAnonymous) {
    if(!isAnyNullOrEmpty(commentTxt, commentUserId, commentTStamp))
        return {
            commentTxt: commentTxt,
            commentUserId: commentUserId,
            commentUserUsername: commentUserUsername,
            commentTStamp: commentTStamp,
            commentIsAnonymous: commentIsAnonymous
        }
    throw new Error('Comment has no commentTxt, commentUser or commentTStamp which are mandatory')
}

var isNullOrEmpty = function(text) {
    return text === null || text === undefined || text.length === 0;
}

var isAnyNullOrEmpty = function(...lines) {
    return lines.some( (line) => {
        let result = false;
        if(Array.isArray(line)) 
            line.forEach( (elem) => {  
                result = result || isNullOrEmpty(elem);
            });
        
        return result || isNullOrEmpty(line);
    });
}

var isEmptyObject = function(obj) {
    return !Object.keys(obj).length
} 

var subscribeToTopic = function(snsTopic, endpointARN) {
    if(!isNullOrEmpty(snsTopic) && !isNullOrEmpty(endpointARN)) {
        const AWS = require('aws-sdk');

        let params = {
            Protocol: 'application', /* required */
            TopicArn: snsTopic, /* required */
            Endpoint: endpointARN
        };

        var subscribePromise = new AWS.SNS({apiVersion: '2010-03-31'}).subscribe(params).promise();
        subscribePromise.then(
            function(data) { 
            console.log("Subscribed successfuly: " + data)
            }).catch(
        function(err) {
            console.error(err, err.stack);
        });
    }
}

module.exports = {
    createResponse: createResponse,
    createComment: createComment,
    createEntry: createEntry,
    isNullOrEmpty: isNullOrEmpty,
    isAnyNullOrEmpty: isAnyNullOrEmpty,
    createEntry: createEntry,
    isEmptyObject: isEmptyObject,
    subscribeToTopic: subscribeToTopic
}