'use strict';

const getErrorMessage = function(field) {
	var response = {
		code: 400,
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}

exports.getErrorMessage = getErrorMessage;
