# aws-lambdas-news-feed

# API
```
* /post -> POST (query params: userId(String), postTStamp(numeric), isAnonymoues(boolean)
                 body: postTitle(String), postTxt(String))
        -> GET (query params: pageNumber(numeric))
        -> DELETE (query params: postTStamp(numeric))
* /post/comment -> POST (query params: postTStamp(numeric)
                    body: commentTxt(String), commentUserId(String), 
                          commentTStamp(numeric), commentIsAnonymous(boolean))
```
## !!! Post has the following format !!!
```
    {
        weekDay: numeric,
        userId: string,
        postTxt: string,
        postTStamp: string,
        postTitle: string,
        isAnonymous: boolean,
        comments: [{
               commentIsAnonymous: boolean,
               commentTStamp: numeric,
               commentTxt: string,
               commentUserId: string 
        }, ... ,
        {
         ...   
        }]
    }
```
## !!! Response has the following format !!!: 
```
    {
        data: data,
        errorMessage: errorMessage,
        infoMessage: infoMessage,
        statusCode: statusCode
    }
```

## Upload lambda to aws
    * copy the common folder to the lambda folder
    * zip the common folder and the desired lambda function 
    * upload the *.zip to aws lambda functions

## clean.sh
    * script written in bash that deletes all the `zip` and common `files` from the subfolders (not the one from the main directory)
    * it is tested only on Linux (maybe it works on MAC OC, but on Windows surely it does not)

