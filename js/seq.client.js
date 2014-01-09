/**
 * MME2-3
 *
 * @author Shivan Taher
 * @date 06.01.14
 */

(function (mme2) {

	'use strict';

	mme2.Client = function (email, options) {

		console.log('user identified as '+email);
		this.email = email;
		this.options = options || { server: 'http://localhost:8080/v1' };

	}

	mme2.Client.prototype.save = function (data) {

		data.email = this.email;

		console.log('saving '+data.elements.length+' elements ...');

		$.ajax({
			url: this.options.server+'/add',
			type: 'PUT',
			data: data,
			dataType: 'json',
			crossDomain: true,
			success: function (res) {
				console.log('Response: ');
				console.log(res);
			}
		});

		//console.log(data);

	}

	mme2.Client.prototype.load = function (id) {

		console.log('load ... not implemented yet');

	}

	mme2.Client.prototype.fetchSequences = function () {

		console.log('fetchSequences ... not implemented yet');

	}

})(window.mme2 = window.mme2 || {});