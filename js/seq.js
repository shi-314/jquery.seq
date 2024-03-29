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

        this.editor = $('#sequence');
        this.seqInput = $('<input type="text" class="sequenceNameInput">');
        this.canvas = $('<canvas width="' + this.editor.innerWidth() + '" height="' + this.editor.innerHeight() + '"></canvas>')[0];

        this.editor.append(this.seqInput);
        this.editor.append(this.canvas);

        this.context = this.canvas.getContext("2d");


        this.elementConnections = [];
        this.selectedElement = null;

        this.currentId = 0;

        var _this = this;

        $(document).on('dblclick', '.sequenceElement', function (e) {
            _this.renameElement($(e.target), e);
        });

        $(document).on('click', '.sequenceElement', function (e) {
            if (_this.connecting)
                _this.stopConnection($(e.target));
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
                    _this.startConnection(element);
                }
            },
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
            'New': {
                click: function (element, event) {
                    _this.addElement(event);
                }
            },
            'Clear': {
                click: function (element) {
                    _this.removeElement(null);
                }
            }
        };

        this.editor.contextMenu('element-menu', this.editorContextMenu);

    }


    /**
     * This function calculates the relative position of an event and returns an object with the x and y attributes
     * @param e
     * @returns {{x: *, y: *}}
     */
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

        this.seqInput.val(element.text());
        this.showTextInput({x: event.clientX + 10, y: event.clientY - 40});
        this.select(element);

    }

    mme2.SequenceEditor.prototype.removeElement = function (element) {

        if (element == null) {
            $('.sequenceElement').remove();
            this.elementConnections = []
        } else {
            this.removeElementConnections(element);
            element.remove();
        }

        this.render();

    }

    mme2.SequenceEditor.prototype.addElement = function (event) {

        var newElement = $('<div class="sequenceElement">Unnamend ' + this.currentId + '</div>');

        newElement.drags();
        newElement.bind('dragged', {that: this}, this.onElementDragged);
        newElement.contextMenu('element-menu', this.elementContextMenu, this.elementContextMenuOptions);

        this.editor.append(newElement);

        newElement.offset({
            left: event.pageX - newElement.outerWidth() / 2,
            top: event.pageY - newElement.outerHeight() / 2
        });

        newElement.data('idx', this.currentId++);

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

    mme2.SequenceEditor.prototype.connectElements = function (e1, e2, connectionType) {

        this.elementConnections.push({
            element1: e1,
            element2: e2,
            type: connectionType
        });

    }

    mme2.SequenceEditor.prototype.removeElementConnections = function (element) {

        for (var i = 0; i < this.elementConnections.length; i++) {
            if (this.elementConnections[i].element1.data('idx') == element.data('idx')
                || this.elementConnections[i].element2.data('idx') == element.data('idx')) {
                this.elementConnections.splice(i--, 1);
            }
        }

    }

    mme2.SequenceEditor.prototype.onElementDragged = function (e) {

        e.data.that.render();

    }

})(window.mme2 = window.mme2 || {});
