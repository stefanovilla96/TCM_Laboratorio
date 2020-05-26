const connect_to_db = require('./db');

// GET BY TALK HANDLER

const talk = require('./Talk');

function parse(arr) {
    var out =  new Array(arr.length)
    for(var i = 0; i <  arr.length; i++) {
        arr[i] = arr[i].substring(arr[i].indexOf(','))
        out[i] = arr[i].substring(1, arr[i].indexOf(']'))
    }
    return out
}

module.exports.get_next = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log('Received event:', JSON.stringify(event, null, 2));
    let body = {}
    if (event.body) {
        body = JSON.parse(event.body)
    }
    // set default
    if(!body.idx) {
        callback(null, {
            statusCode: 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not fetch the talks. idx is null.'
        })
    }
    
    if (!body.doc_per_page) {
        body.doc_per_page = 10
    }
    if (!body.page) {
        body.page = 1
    }
    

    
    connect_to_db().then(() => {
        console.log('=> get_all talks');
        talk.findById(body.idx)
            .skip((body.doc_per_page * body.page) - body.doc_per_page)
            .limit(body.doc_per_page)
            .then(talks => {
                    callback(null, {
                        statusCode: 200,
                        body: JSON.stringify(parse(talks.next))
                    })
                }
            )
            .catch(err =>
                callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not fetch the talks.'
                })
            );
    });
};