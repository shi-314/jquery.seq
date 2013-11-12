/**
 * MME2-2
 *
 * @author Shivan Taher
 * @date 30.10.13
 */

(function(mme2) {

    "use strict";

    mme2.SequenceEditor = function(options) {

		console.log("creating sequence editor...");

		$('.sequenceEditor').append('<input type="text" id="seqInput">');
		this.seqInput = $('#seqInput');

		var _this = this;

		$('.sequenceElement').drags();

		$('.sequenceElement').dblclick(function(e) {
			_this.seqInput.val(e.target.innerText);
			_this.showTextInput({x: e.clientX + 10, y: e.clientY - 40});
		});

		$('.sequenceEditor').click(function(e) {
			_this.hideTextInput();
		});

		this.seqInput.click(function(e) {
			e.stopPropagation();
		});

		this.seqInput.pressEnter(function() {
			console.log("test");
		});

    }

	mme2.SequenceEditor.prototype.showTextInput = function(p) {
		this.seqInput.fadeIn('fast').offset({left: p.x, top: p.y}).focus().select();
	}

	mme2.SequenceEditor.prototype.hideTextInput = function() {
		this.seqInput.fadeOut('fast');
	}

})(window.mme2 = window.mme2 || {});
