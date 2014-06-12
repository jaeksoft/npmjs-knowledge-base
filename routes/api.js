var oss = require('node-oss-client');
var http_request = require("request");
var nconf = require('nconf');
nconf.file('./config.json');
var client = oss.createClient({
    hostname: nconf.get('hostname'),
    port: nconf.get('port'),
    protocol: nconf.get('protocol'),
    login: nconf.get('login'),
    key: nconf.get('key')
});
var indexname = nconf.get('indexname');
exports.autocomplete = function (autocompleteRequest, response) {
    var autoCompleteURL = nconf.get('protocol')+'://'+nconf.get('hostname')+':'+nconf.get('port')+'/autocompletion?use='+nconf.get('indexname')+'&login='+nconf.get('login')+'&key='+nconf.get('key')+'&query=';
    http_request(autoCompleteURL + autocompleteRequest.params.query, function (error, res, body) {
        response.json({
            results: body.split('\n')

        });
    });
};

exports.searchFacet = function (request, response) {
    client.search(indexname, {
        "query": request.params.query,
        "start": 0,
        "rows": 10,
        "lang": "ENGLISH",
        "operator": "AND",
        "facets": [
            {
                "field": "Category",
                "minCount": 1,
                "multivalued": false,
                "postCollapsing": false
            }

        ], "searchFields": [
            {
                "field": "title",
                "mode": "PATTERN",
                "boost": 10
            },
            {
                "field": "content",
                "mode": "PATTERN",
                "boost": 1
            },
            {
                "field": "titleExact",
                "mode": "PATTERN",
                "boost": 10
            },
            {
                "field": "contentExact",
                "mode": "PATTERN",
                "boost": 1
            }
        ]

    }, function (err, res) {

        response.json({
            results: res

        });
    });
};
exports.search = function (request, response) {

    var page = request.params.paging;
    var start = page * 10;
    var filter = 'Category:' + request.params.filter;
    var catFilter = [];
    if (typeof filter != "undefined" && request.params.filter != '' && request.params.filter != 'default') {
        catFilter = [
            {
                "type": "QueryFilter",
                "negative": false,
                "query": filter
            }
        ];
    }
    client.search(indexname, {
        "query": request.params.query,
        "start": start,
        "rows": 10,
        "lang": "ENGLISH",
        "operator": "AND",
        "returnedFields": [
            "url"
        ],
        "filters": catFilter,
        "snippets": [
            {
                "field": "title",
                "tag": "",
                "separator": "...",
                "maxSize": 200,
                "maxNumber": 1,
                "fragmenter": "NO"
            },
            {
                "field": "content",
                "tag": "",
                "separator": "...",
                "maxSize": 200,
                "maxNumber": 1,
                "fragmenter": "NO"
            }
        ], "searchFields": [
            {
                "field": "title",
                "mode": "PATTERN",
                "boost": 10
            },
            {
                "field": "content",
                "mode": "PATTERN",
                "boost": 1
            },
            {
                "field": "titleExact",
                "mode": "PATTERN",
                "boost": 10
            },
            {
                "field": "contentExact",
                "mode": "PATTERN",
                "boost": 1
            }
        ]

    }, function (err, res) {
        response.json({
            results: res

        });
    });

};

