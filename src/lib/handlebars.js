const { format } = require('timeago.js');


const helpers = {}

helpers.timeago = timestamp => format(timestamp, 'es_ES')

module.exports = helpers