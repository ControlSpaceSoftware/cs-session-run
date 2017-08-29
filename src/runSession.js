export default function runSession({driver, query, params}) {

	if (!(driver && typeof driver.session === 'function')) {
		throw new TypeError('driver missing session() function');
	}

	if (!(driver && typeof driver.close === 'function')) {
		throw new TypeError('driver missing close() function');
	}

	if (!(query && typeof query === 'string')) {
		throw new TypeError('required query parameter is missing');
	}

	if (params && typeof params !== 'object') {
		throw new TypeError('optional params property must be an object');
	}

	const timing = {
		min: Number.MAX_SAFE_INTEGER,
		max: 0,
		total: 0,
		start: Date.now()
	};

	const start = Date.now();
	const session = driver.session();

	return new Promise((resolve, reject) => {
		session.run(query, params)
			.then(resolve)
			.catch((error) => {
				console.error(JSON.stringify({query, params, error}, null, 8));
				reject(error);
			})
			.then(() => {//finally
				session.close();
				driver.close();
				const duration = Date.now() - start;
				timing.min = Math.min(timing.min, duration);
				timing.max = Math.max(timing.max, duration);
				timing.total += duration;
				console.log(`took ${duration} (ms) - min: ${timing.min}, max: ${timing.max}, lapsed: ${timing.total}.`);
			});
	});

}
