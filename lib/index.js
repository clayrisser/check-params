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
    var missingUrlParams = [];
    var missingBodyParams = [];
    var missingQueryParams = [];
    var statusCode = 400;
    if (params.urlParams) {
      var urlParams = params.urlParams;
      if (urlParams.length > 0) {
        missingUrlParams = checkUrlParams(req, urlParams);
        var humanizedMissingUrlParams = humanizeMissingParams(missingUrlParams, 'url');
        if (humanizedMissingUrlParams) {
          messageList.push(humanizedMissingUrlParams);
          statusCode = 404;
        }
      }
    }
    if (params.bodyParams) {
      var bodyParams = params.bodyParams;
      if (bodyParams.length > 0) {
        missingBodyParams = checkBodyParams(req, bodyParams);
        var humanizedMissingBodyParams = humanizeMissingParams(missingBodyParams, 'body');
        if (humanizedMissingBodyParams) {
          messageList.push(humanizedMissingBodyParams);
        }
      }
    }
    if (params.queryParams) {
      var queryParams = params.queryParams;
      if (queryParams.length > 0) {
        missingQueryParams = checkQueryParams(req, queryParams);
        var humanizedMissingQueryParams = humanizeMissingParams(missingQueryParams, 'query');
        if (humanizedMissingQueryParams) {
          messageList.push(humanizedMissingQueryParams);
          statusCode = 404;
        }
      }
    }
    if (messageList.length > 0) {
      reject(new Err('You are missing ' + humanizeList(messageList, {
        oxfordComma: options.oxfordComma
      }) + '.', {
        code: statusCode,
        missingParams: {
          urlParams: missingUrlParams,
          bodyParams: missingBodyParams,
          queryParams: missingQueryParams
        }
      }));
    } else {
      resolve();
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

function checkUrlParams(req, urlParams) {
  var missingUrlParams = [];
  _.each(urlParams, function(urlParam) {
    if (!req.params[urlParam]) {
      missingUrlParams.push(urlParam);
    }
  });
  return missingUrlParams;
}

function checkBodyParams(req, bodyParams) {
  var missingBodyParams = [];
  _.each(bodyParams, function(bodyParam) {
    if (!req.body[bodyParam]) {
      missingBodyParams.push(bodyParam);
    }
  });
  return missingBodyParams;
}

function checkQueryParams(req, queryParams) {
  var missingQueryParams = [];
  _.each(queryParams, function(queryParam) {
    if (req.param) {
      if (!req.param(queryParam)) missingQueryParams.push(queryParam);
    } else {
      if (!req.query[queryParam]) missingQueryParams.push(queryParam);
    }
  });
  return missingQueryParams;
}
