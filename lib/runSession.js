'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = runSession;
function runSession(_ref) {
	var driver = _ref.driver,
	    query = _ref.query,
	    params = _ref.params;


	if (!(driver && typeof driver.session === 'function')) {
		throw new TypeError('driver missing session() function');
	}

	if (!(driver && typeof driver.close === 'function')) {
		throw new TypeError('driver missing close() function');
	}

	if (!(query && typeof query === 'string')) {
		throw new TypeError('required query parameter is missing');
	}

	if (params && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== 'object') {
		throw new TypeError('optional params property must be an object');
	}

	var timing = {
		min: Number.MAX_SAFE_INTEGER,
		max: 0,
		total: 0,
		start: Date.now()
	};

	var start = Date.now();
	var session = driver.session();

	return new Promise(function (resolve, reject) {
		session.run(query, params).then(resolve).catch(function (error) {
			console.error(JSON.stringify({ query: query, params: params, error: error }, null, 8));
			reject(error);
		}).then(function () {
			//finally
			session.close();
			driver.close();
			var duration = Date.now() - start;
			timing.min = Math.min(timing.min, duration);
			timing.max = Math.max(timing.max, duration);
			timing.total += duration;
			console.log('took ' + duration + ' (ms) - min: ' + timing.min + ', max: ' + timing.max + ', lapsed: ' + timing.total + '.');
		});
	});
}