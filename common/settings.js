var REGION = "eu-central-1"
var NEWS_FEED_TABLE_NAME = "lowkey-mobilehub-1217601830-NewsFeed"
var DEFAULT_WEEK_DAY = 0
var PAGE_SIZE = 3
var MAX_TIMESTAMP_QUERY = 2.62974383 * Math.pow(10, 9) // 1 Month
var MAX_TIMESTAMP_USER_QUERY = 2.62974383 * Math.pow(10, 9) * 3 // 3 Months


module.exports = {
    REGION: REGION,
    NEWS_FEED_TABLE_NAME : NEWS_FEED_TABLE_NAME,
    DEFAULT_WEEK_DAY: DEFAULT_WEEK_DAY,
    PAGE_SIZE: PAGE_SIZE,
    MAX_TIMESTAMP_QUERY: MAX_TIMESTAMP_QUERY,
    MAX_TIMESTAMP_USER_QUERY: MAX_TIMESTAMP_USER_QUERY
}