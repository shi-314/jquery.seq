/**
 * MME2-3
 *
 * @author Shivan Taher
 * @date 06.01.14
 */

(function (mme2) {

	'use strict';

	mme2.Client = function (email) {

		console.log('user identified as '+email);
		this.email = email;

	}

	mme2.Client.prototype.save = function (data) {

		data.email = this.email;

		console.log('saving '+data.elements.length+" elements ...");
		//console.log(data);

	}

	mme2.Client.prototype.load = function (id) {

		console.log('load ... not implemented yet');

	}

	mme2.Client.prototype.fetchSequences = function () {

		console.log('fetchSequences ... not implemented yet');

	}

})(window.mme2 = window.mme2 || {});