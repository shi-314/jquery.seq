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

		var _this = this;

		$('.sequenceElement').drags();

//		this.dragging = false;
//
//		$('.sequenceEditor').mouseup(function(e) {
//			_this.dragging = false;
//		});
//
//		$('.sequenceEditor').mousedown(function(e) {
//			_this.dragging = true;
//		});
//
//		$('.sequenceEditor').on("mousemove", "", function(e) {
//			if(e.which == 1) {
//				$(this).offset({left: e.pageX - e.offsetX, top: e.pageY - e.offsetY});
//
//				// console.log(e);
//				console.log(e);
//			}
//		});

    }

})(window.mme2 = window.mme2 || {});
