/**
 * MME2-3
 *
 * @author Shivan Taher
 * @date 30.10.13
 */

(function (mme2) {

    'use strict';

    $.fn.sequence = function (options) {

		var _this = this;
        this.se = new mme2.SequenceEditor(this);

        this.add = function (x, y, label) {

			var canvasRect = _this.se.canvas.getBoundingClientRect();
			var canvasX = canvasRect.left;
			var canvasY = canvasRect.top;

			var element = this.se.addElement({pageX: canvasX + x, pageY: canvasY + y});
            element.setLabel(label);
            return this;

        }

		this.getElements = function () {

			var elementsData = [];
			var elements = this.se.getElements();

			for(var i = 0; i < elements.length; i++) {
				elementsData.push({
					idx: elements[i].data('idx'),
					label: elements[i].getLabel(),
					position: elements[i].getPosition()
				});
			}

			return elementsData;

		}

		this.getConnections = function () {

			var connections = this.se.elementConnections;
			var connectionsData = [];

			for(var i = 0; i < connections.length; i++) {
				var c = connections[i];
				connectionsData.push({
					element1: c.element1.parent().data('idx'),
					element2: c.element2.parent().data('idx'),
					element1Anchor: c.element1Anchor,
					element2Anchor: c.element2Anchor
				});
			}

			return connectionsData;

		}

		this.getData = function () {

			return {
				elements: this.getElements(),
				connections: this.getConnections()
			};

		}

		this.connect = function (id1, id2, anchor1, anchor2) {

			var e1 = this.se.getElementById(id1).children('.'+anchor1);
			var e2 = this.se.getElementById(id2).children('.'+anchor2);

			var conn = {
				element1: e1,
				element2: e2,
				element1Anchor: anchor1,
				element2Anchor: anchor2,
			};

			this.se.elementConnections.push(conn);

			this.se.editor.trigger('connectElements', {connection: {
				element1: e1.parent(),
				element2: e2.parent(),
				element1Anchor: anchor1,
				element2Anchor: anchor2
			}});

			this.se.render();

		}

        return this;

    }

    mme2.SequenceEditor = function (editorContainer) {

        console.log("creating sequence editor...");

        this.editor = editorContainer || $('#sequence');
        this.seqInput = $('<input type="text" class="sequenceNameInput">');
        this.canvas = $('<canvas width="' + this.editor.innerWidth() + '" height="' + this.editor.innerHeight() + '"></canvas>')[0];

        this.editor.append(this.seqInput);
        this.editor.append(this.canvas);

        this.context = this.canvas.getContext("2d");


        this.elementConnections = [];
        this.selectedElement = null;
		this.elements = [];

        this.currentId = 0;

        var _this = this;



        $(document).on('dblclick', '.sequenceElement', function (e) {
            _this.renameElement($(e.target), e);
        });

        $(document).on('click', '.anchor', function (e) {
            e.stopPropagation();

            if(_this.connecting == true && $(e.target).parent().data('idx') != _this.connectionElement1.parent().data('idx'))
                _this.stopConnection($(e.target))
            else
                _this.startConnection($(e.target));

        });

        this.editor.click(function (e) {
            _this.hideTextInput();
            _this.unselect();
        });

        this.seqInput.click(function (e) {
            e.stopPropagation();
        });

        this.seqInput.pressEnter(function () {
            var label = _this.selectedElement.find('#label'+_this.selectedElement.data('idx'));
            label.text(_this.seqInput.val());
            _this.editor.trigger('renameElement', {element: label});
            _this.hideTextInput();
        });

        //
        // context menu for sequence elements
        //

        this.elementContextMenu = {
            'Rename': {
                click: function (element, event) {
                    _this.renameElement(element, event);
                }
            },
            'Delete': {
                click: function (element) {
                    _this.removeElement(element);
                }
            }
        };

        this.elementContextMenuOptions = {
            showMenu: function (element) {
                _this.select(element);
            }
        };

        //
        // context menu for the editor
        //

        this.editorContextMenu = {
			'Save': {
				click: function(element, event) {
					_this.editor.trigger('save')
				}
			},
			'Load': {
				click: function(element, event) {
					_this.editor.trigger('load')
				}
			},
            'New': {
                click: function (element, event) {
                    _this.addElement(event);
                }
            },
            'Clear': {
                click: function (element) {
                    _this.removeElement(null);
                    _this.editor.trigger('clearElements');
                }
            }
        };

        this.editor.contextMenu('element-menu', this.editorContextMenu);

        //
        // anchors
        //

        $(this.canvas).mousemove(function (e) {
            $('.anchor').each(function () {
                var that = $(this);
                var offset = that.offset();

                var dx = e.clientX - offset.left;
                var dy = e.clientY - offset.top;
                var distance = Math.sqrt(dx*dx + dy*dy);

                if(distance < 80)
                    that.addClass('anchorHover');
                else
                    that.removeClass('anchorHover');
            });
        });

    }

    mme2.SequenceEditor.prototype.getRelativePosition = function (e) {

        var x = e.pageX;
        var y = e.pageY;

        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }
        else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        var offset = $(this.canvas).offset();

        x -= offset.left;
        y -= offset.top;

        return { x: x, y: y };

    }

    mme2.SequenceEditor.prototype.showTextInput = function (p) {

        this.seqInput.fadeIn('fast').offset({left: p.x, top: p.y}).focus().select();

    }

    mme2.SequenceEditor.prototype.hideTextInput = function () {

        this.seqInput.fadeOut('fast');

    }

    mme2.SequenceEditor.prototype.select = function (e) {

        this.unselect();
        this.selectedElement = e;
        this.selectedElement.addClass('selected');

    }

    mme2.SequenceEditor.prototype.unselect = function () {

        if (this.selectedElement != null)
            this.selectedElement.removeClass('selected');

    }

    mme2.SequenceEditor.prototype.renameElement = function (element, event) {

        this.select(element);
        this.seqInput.val(element.text());
        this.showTextInput({x: event.clientX + 10, y: event.clientY - 40});

    }

    mme2.SequenceEditor.prototype.removeElement = function (element) {

        if (element == null) {
            this.editor.find('.sequenceElement').remove();
            this.elementConnections = [];
			this.elements = [];
        } else {
            this.removeElementConnections(element);
            element.remove();
			this.elements.splice(this.elements.indexOf(element), 1);
        }

        this.editor.trigger('removeElement', {element: element});

        this.render();

    }

    mme2.SequenceEditor.prototype.addElement = function (event) {

        var leftAnchor = $('<div class="anchor left"/>');
        var rightAnchor = $('<div class="anchor right"/>');
        var topAnchor = $('<div class="anchor top"/>');
        var bottomAnchor = $('<div class="anchor bottom"/>');

        var label = $('<div class="label" id="label'+this.currentId+'">Unnamed ' + this.currentId + '</div>');

        var newElement = $('<div class="sequenceElement">' + '</div>');

		var _this = this;

        newElement.labelElement = label;
        newElement.append(label);
        newElement.append(leftAnchor, rightAnchor, topAnchor, bottomAnchor);

        newElement.setLabel = function(value) {
            this.labelElement.text(value);
        }

        newElement.getLabel = function() {
            return this.labelElement.text();
        }

		newElement.getPosition = function() {

			var canvasRect = _this.canvas.getBoundingClientRect();
			var canvasX = canvasRect.left;
			var canvasY = canvasRect.top;

			var offset = this.topLeftOffset;

			return {
				x: offset.left - canvasX,
				y: offset.top - canvasY
			};

		}

        newElement.drags();
        newElement.bind('dragged', {that: this}, this.onElementDragged);
        newElement.contextMenu('element-menu', this.elementContextMenu, this.elementContextMenuOptions);

        this.editor.append(newElement);

        newElement.offset({
            left: event.pageX - newElement.outerWidth() / 2,
            top: event.pageY - newElement.outerHeight() / 2
        });

		newElement.topLeftOffset = {
			left: event.pageX,
			top: event.pageY
		}

        newElement.data('idx', this.currentId++);

        this.editor.trigger('addElement', {element: newElement});

		this.elements.push(newElement);

        return newElement;

    }

    mme2.SequenceEditor.prototype.startConnection = function (element) {

        this.connecting = true;
        this.connectionElement1 = element;

        var _this = this;
        this.editor.mousemove(function (e) {
            _this.mousePosition = _this.getRelativePosition(e);
            _this.render();
        });

    }

    mme2.SequenceEditor.prototype.stopConnection = function (element) {

        this.connecting = false;
        this.connectElements(this.connectionElement1, element, null);
        this.editor.off('mousemove');
        this.render();

    }

    mme2.SequenceEditor.prototype.render = function () {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.connecting) {
            var offset = this.connectionElement1.offset();
            var editorOffset = this.editor.offset();

            var startPosition = {
                x: offset.left - editorOffset.left + this.connectionElement1.outerWidth() / 2,
                y: offset.top - editorOffset.top + this.connectionElement1.outerHeight() / 2
            };

            this.context.beginPath();
            this.context.moveTo(startPosition.x, startPosition.y);
            this.context.lineTo(this.mousePosition.x, this.mousePosition.y);
            this.context.closePath();
            this.context.stroke();
        }

        for (var i = 0; i < this.elementConnections.length; i++) {
            var offset1 = this.elementConnections[i].element1.offset();
            var offset2 = this.elementConnections[i].element2.offset();
            var editorOffset = this.editor.offset();

            var startPosition = {
                x: offset1.left - editorOffset.left + this.elementConnections[i].element1.outerWidth() / 2,
                y: offset1.top - editorOffset.top + this.elementConnections[i].element1.outerHeight() / 2
            };

            var endPosition = {
                x: offset2.left - editorOffset.left + this.elementConnections[i].element2.outerWidth() / 2,
                y: offset2.top - editorOffset.top + this.elementConnections[i].element2.outerHeight() / 2
            };

            this.context.beginPath();
            this.context.moveTo(startPosition.x, startPosition.y);
            this.context.lineTo(endPosition.x, endPosition.y);
            this.context.closePath();
            this.context.stroke();
        }

    }

    mme2.SequenceEditor.prototype.connectElements = function (e1, e2) {

		// get anchor class names to specify which anchor has been selected

		var e1Class = e1.attr('class').split(/\s+/)[1];
		var e2Class = e2.attr('class').split(/\s+/)[1];

        var conn = {
            element1: e1,
            element2: e2,
			element1Anchor: e1Class,
			element2Anchor: e2Class
        };

        this.elementConnections.push(conn);

        this.editor.trigger('connectElements', {connection: {
            element1: e1.parent(),
            element2: e2.parent(),
			element1Anchor: e1Class,
			element2Anchor: e2Class
		}});

    }

	mme2.SequenceEditor.prototype.getElementById = function(id) {

		for(var i = 0; i < this.elements.length; i++) {
			if(this.elements[i].data('idx') === id) {
				return this.elements[i];
			}
		}

		return null;

	}

    mme2.SequenceEditor.prototype.removeElementConnections = function (element) {

        for (var i = 0; i < this.elementConnections.length; i++) {
            if (this.elementConnections[i].element1.parent().data('idx') == element.data('idx')
                || this.elementConnections[i].element2.parent().data('idx') == element.data('idx')) {
                this.elementConnections.splice(i--, 1);
            }
        }

    }

    mme2.SequenceEditor.prototype.onElementDragged = function (e) {

        e.data.that.render();

    }

	mme2.SequenceEditor.prototype.getElements = function() {

		return this.elements;

	}

})(window.mme2 = window.mme2 || {});
