'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var Err = require('err');
var humanizeList = require('humanize-list');

var options = {
    oxfordComma: true,
    distinctionChar: '\''
};

module.exports = function(req, params, _options) {
    if (_options) {
        options = _.merge(options, _options);
    }
    return new Promise(function(resolve, reject) {
        if (!params) reject(new Err('params not defined in checkParams(req, params)', 500));
        var messageList = [];
        var statusCode = 400;
        if (params.urlParams) {
            var urlParams = params.urlParams;
            if (urlParams.length > 0) {
                var missingUrlParams = checkUrlParams(req, urlParams, 'url');
                if (missingUrlParams) {
                    messageList.push(missingUrlParams);
                    statusCode = 404;
                }
            }
        }
        if (params.bodyParams) {
            var bodyParams = params.bodyParams;
            if (bodyParams.length > 0) {
                var missingBodyParams = checkBodyParams(req, bodyParams, 'body');
                if (missingBodyParams) {
                    messageList.push(missingBodyParams);
                }
            }
        }
        if (params.queryParams) {
            var queryParams = params.queryParams;
            if (queryParams.length > 0) {
                var missingQueryParams = checkQueryParams(req, queryParams, 'query');
                if (missingQueryParams) {
                    messageList.push(missingQueryParams);
                    statusCode = 404;
                }
            }
        }
        if (messageList.length > 0) {
            reject(new Err('You are missing ' + humanizeList(messageList, {
                oxfordComma: options.oxfordComma
            }) + '.', statusCode));
        } else {
            resolve('You have all of the correct params.');
        }
    });
};

function humanizeMissingParams(missingParams, paramType) {
    var distinctionChar = options.distinctionChar;
    missingParams = _.map(missingParams, function(missingParam) {
        return distinctionChar + missingParam + distinctionChar;
    });
    if (missingParams.length > 0) {
        return 'the ' + paramType + ' param' + (missingParams.length > 1 ? 's ' : ' ') + humanizeList(missingParams, {
            oxfordComma: options.oxfordComma
        });
    }
    return false;
}

function checkUrlParams(req, urlParams, paramType) {
    var missingUrlParams = [];
    _.each(urlParams, function(urlParam) {
        if (!req.params[urlParam]) {
            missingUrlParams.push(urlParam);
        }
    });
    return humanizeMissingParams(missingUrlParams, paramType);
}

function checkBodyParams(req, bodyParams, paramType) {
    var missingBodyParams = [];
    _.each(bodyParams, function(bodyParam) {
        if (!req.param(bodyParam)) {
            missingBodyParams.push(bodyParam);
        }
    });
    return humanizeMissingParams(missingBodyParams, paramType);
}

function checkQueryParams(req, queryParams, paramType) {
    var missingQueryParams = [];
    _.each(queryParams, function(queryParam) {
        if (!req.query(queryParam)) {
            missingQueryParams.push(queryParam);
        }
    });
    return humanizeMissingParams(missingQueryParams, paramType);
}
