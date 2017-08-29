/*global describe, it, beforeEach*/

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import {runSession} from '../src'

chai.should();
chai.use(sinonChai);

const expect = chai.expect;

describe('runSession', () => {
	let driver, query, params, run;
	beforeEach(() => {
		run = sinon.stub().returns(Promise.resolve({test: 'test resolve results'}));
		driver = {
			session() {
				return {
					run,
					close() {}
				};
			},
			close: sinon.stub()
		};
		query = 'test query';
		params = {
			test: 'test params'
		};
	});
	it('exits', () => {
		expect(runSession).to.be.a('function');
	});
	it('throws missing driver.session()', () => {
		expect(runSession.bind(null, {})).to.throw('driver missing session() function');
	});
	it('throws missing driver.close()', () => {
		driver.close = null;
		expect(runSession.bind(null, {driver})).to.throw('driver missing close() function');
	});
	it('throws missing "query" parameter', () => {
		expect(runSession.bind(null, {driver})).to.throw('required query parameter is missing');
	});
	it('throws optional "params" parameter must be an object', () => {
		expect(runSession.bind(null, {driver, query, params: 'foo'})).to.throw('optional params property must be an object');
	});
	it('calls session.run(query, params) with correct parameters', () => {
		return runSession({driver, query, params}).then(() => {
			expect(run).to.have.been.calledWith(query, params);
		});
	});
	it('session.run(query, params) returns results on success', () => {
		return runSession({driver, query, params}).then((results) => {
			expect(results).to.eql({test: 'test resolve results'});
		});
	});
	it('session.run(query, params) returns error on failure', () => {
		run = sinon.stub().returns(Promise.reject({test: 'test reject results'}));
		driver = {
			session() {
				return {
					run,
					close() {}
				};
			},
			close() {}
		};
		return runSession({driver, query, params}).catch((results) => {
			expect(results).to.eql({test: 'test reject results'});
		});
	});
});
