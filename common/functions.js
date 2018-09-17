var createResponse = function(data='', errorMessage='', infoMessage='', statusCode=0) {
    return {
        data: data,
        errorMessage: errorMessage,
        infoMessage: infoMessage,
        statusCode: statusCode
    };
}

var createEntry = function(weekDay, postTStamp, userId, postTitle, postTxt, isAnonymous, comments=undefined) {
    if(!isAnyNullOrEmpty(weekDay, userId, postTStamp, postTxt))
        return {
            weekDay: weekDay,
            postTStamp: postTStamp,
            userId: userId,
            postTitle: postTitle,
            postTxt: postTxt,
            isAnonymous: isAnonymous,
            comments: comments
        }
    throw new Error('Post entry has no userId, postTStamp or postTxt which are mandatory.')
}

var createComment = function(commentTxt, commentUserId, commentTStamp, commentIsAnonymous) {
    if(!isAnyNullOrEmpty(commentTxt, commentUserId, commentTStamp))
        return {
            commentTxt: commentTxt,
            commentUserId: commentUserId,
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

module.exports = {
    createResponse: createResponse,
    createComment: createComment,
    createEntry: createEntry,
    isNullOrEmpty: isNullOrEmpty,
    isAnyNullOrEmpty: isAnyNullOrEmpty,
    createEntry: createEntry,
    isEmptyObject: isEmptyObject
}