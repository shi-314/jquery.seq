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

		$(document).on('dblclick', '.sequenceElement', function (e) {
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

		this.elementContextMenu = {
			'Connect': {
				click: function (element) {
					element.css({backgroundColor: 'pink'});
				}
			},
			'Delete': {
				click: function (element) {
					element.detach();
				}
			}
		};

		this.elementContextMenuOptions = {
			showMenu: function(element) {
				_this.select(element);
			}
		};

		//
		// context menu for the editor
		//

		this.editorContextMenu = {
			'New': {
				click: function (element, evt) {
					var newElement = $('<div class="sequenceElement">Unnamend</div>');
					newElement.drags();
					newElement.contextMenu('element-menu', _this.elementContextMenu, _this.elementContextMenuOptions);

					_this.editor.append(newElement);

					newElement.offset({
						left: evt.pageX - newElement.outerWidth() / 2,
						top: evt.pageY - newElement.outerHeight() / 2
					});
				}
			},
			'Clear': {
				click: function (element) {
					$('.sequenceElement').detach();
				}
			}
		};

		this.editor.contextMenu('element-menu', this.editorContextMenu);
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
