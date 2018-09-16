var createResponse = function(data='', errorMessage='', infoMessage='', statusCode=0) {
    return {
        data: data,
        errorMessage: errorMessage,
        infoMessage: infoMessage,
        statusCode: statusCode
    };
}

var createEntry = function(userId, postTStamp, postTxt, comments=undefined) {
    if(!isAnyNullOrEmpty(userId, postTStamp, postTxt))
        return {
            userId: userId,
            postTStamp: postTStamp,
            postTxt: postTxt,
            comments: comments
        }
    throw new Error('Post entry has no userId, postDT or postTxt which are mandatory.')
}

var createComment = function(commentTxt, commentUserId, commentTStamp) {
    if(!isAnyNullOrEmpty(commentTxt, commentUserId, commentTStamp))
        return {
            commentTxt: commentTxt,
            commentUserId: commentUserId,
            commentTStamp: commentTStamp
        }
    throw new Error('Comment has no commentTxt, commentUser or commentDT which are mandatory')
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