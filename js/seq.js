/**
 * MME2-2
 *
 * @author Shivan Taher
 * @date 30.10.13
 */

(function (mme2) {

	"use strict";

	mme2.SequenceEditor = function (options) {

		console.log("creating sequence editor...");

		this.editor = $('.sequenceEditor');
		this.editor.append('<input type="text" id="seqInput">');
		this.seqInput = $('#seqInput');

		this.selectedElement = null;

		var _this = this;

		$('.sequenceElement').drags();

		$('.sequenceElement').dblclick(function (e) {
			_this.seqInput.val(e.target.innerText);
			_this.showTextInput({x: e.clientX + 10, y: e.clientY - 40});
			_this.select(e.target);
		});

		this.editor.click(function (e) {
			_this.hideTextInput();
			_this.unselect();
		});

		this.seqInput.click(function (e) {
			e.stopPropagation();
		});

		this.seqInput.pressEnter(function () {
			_this.selectedElement.text(_this.seqInput.val());
			_this.hideTextInput();
		});

		//
		// context menu for sequence elements
		//

		$('.sequenceElement').contextMenu('element-menu', {
				'Connect': {
					click: function (element) {
						element.css({backgroundColor: 'pink'});
					}
				},
				'Delete': {
					click: function(element) {
						element.detach();
					}
				}
			}
		);

		//
		// context menu for the editor
		//

		this.editor.contextMenu('element-menu', {
				'New': {
					click: function (element) {

					}
				},
				'Clear': {
					click: function (element) {

					}
				}
			}
		);
	}

	mme2.SequenceEditor.prototype.showTextInput = function (p) {
		this.seqInput.fadeIn('fast').offset({left: p.x, top: p.y}).focus().select();
	}

	mme2.SequenceEditor.prototype.hideTextInput = function () {
		this.seqInput.fadeOut('fast');
	}

	mme2.SequenceEditor.prototype.select = function (e) {
		this.unselect();
		this.selectedElement = $(e);
		this.selectedElement.addClass('selected');
	}

	mme2.SequenceEditor.prototype.unselect = function () {
		if (this.selectedElement)
			this.selectedElement.removeClass('selected');
	}

})(window.mme2 = window.mme2 || {});
