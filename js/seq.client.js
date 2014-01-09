/**
 * MME2-3
 *
 * @author Shivan Taher
 * @date 06.01.14
 */

(function (mme2) {

	'use strict';

	mme2.Client = function (email, options) {

		console.log('user identified as ' + email);
		this.email = email;
		this.options = options || { server: 'http://localhost:8080/v1' };

	}

	mme2.Client.prototype.save = function (data, onComplete) {

		data.email = this.email;

		$.ajax({
			url: this.options.server + '/save',
			type: 'PUT',
			data: data,
			dataType: 'json',
			crossDomain: true,
			success: function (res) {
				if (onComplete)
					onComplete(res._id);
			}
		});

	}

	mme2.Client.prototype.load = function (onComplete) {

		$.ajax({
			url: this.options.server + '/list/'+encodeURIComponent(this.email),
			type: 'GET',
			dataType: 'json',
			crossDomain: true,
			success: function (res) {
				if (onComplete)
					onComplete(res);
			}
		});

	}

	mme2.Client.prototype.list = function (email) {

		console.log('list for ' + email + ': ');

	}

	mme2.Client.prototype.fetchSequences = function () {

		console.log('fetchSequences ... not implemented yet');

	}

})(window.mme2 = window.mme2 || {});