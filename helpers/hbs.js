const moment = require('moment')

module.exports = {
    formatDate: (date, format) => {
        return moment(date).format(format)
    },
    truncate: (str, len) => {
        str = str.substr(3)
        str = str.substr(0, str.length - 3)
        if(str.length > len){
            str = str.substr(0, len) + '...'
            str = '<p>' + str
            str = str + '</p>'
        }
        else{
            str = '<p>' + str
            str = str + '/p>'
        }
        return str
    }
}