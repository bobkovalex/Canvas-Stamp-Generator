/**
 * Stamp Generator
 * Copyright (c) 2018 Alex Bobkov <lilalex85@gmail.com>
 * Licensed under MIT
 * @author Alexandr Bobkov
 * @version 0.0.3
 */

$(document).ready(function(){

	// Add Shape
	$('#canvas-params-container').on('click', 'button#canvas-shape-add', function(){
		$.fn.stampGenerator.addShape($(this));
	});

	// Remove Shape
	$('#canvas-params-container').on('click', 'button.canvas-shape-remove', function(){
		$.fn.stampGenerator.removeShape($(this));
	});

	// Toggle Shape
	$('#canvas-params-container').on('click', 'button.canvas-params-toggle', function(){
		$.fn.stampGenerator.toggleShape($(this));
	});

	// Preview/Draw Shapes
	$('#canvas-params-container').bind('input', function(){
		$.fn.stampGenerator.drawStamp();
	});
});



(function( $ ) {

	/**
	* Create private variables.
	**/
	var canvasCount = 0;
	var xCoord = 200;
	var yCoord = 100;
	var textPadding = 15;

	$.fn.stampGenerator = function () {
		$(this).append($.fn.stampGenerator.baseHtml());
	}

	$.extend(true, $.fn.stampGenerator, {

		addShape : function(elem){
			canvasCount++;
			elem.parent().parent().append($.fn.stampGenerator.shapeHtml(canvasCount));
			$.fn.stampGenerator.drawStamp();
		},

		removeShape : function(elem){
			elem.parent().fadeOut(300, function(){
				// get canvas id
				var canvasId = $(this).attr('id').replace('canvas-params-', '');
				// remove canvas
				$('#canvas-stamp-' + canvasId).remove();
				// remove canvas params container
				$(this).remove();
			});
		},

		toggleShape : function(elem){
			elem.next().next().toggle('fast');
			var text = elem.text();
			elem.text(text == 'Edit' ? 'Close' : 'Edit');
		},

		drawStamp : function(){
			// clear all canvas containers
			$('.canvas-preview').each(function(){
				$(this).remove();
			});
			// draw canvas
			var i = 1;
			$('.canvas-params').each(function(){
				// get shape params
				var radius = $(this).find('#canvas-radius').val();
				var text = $(this).find('#canvas-text').val();
				var bgColor = $(this).find('#canvas-bg-color').val();
				var strokeColor = $(this).find('#canvas-stroke-color').val();
				var fgColor = $(this).find('#canvas-fg-color').val();
				// append canvas container
				$('#canvas-preview-container').prepend($.fn.stampGenerator.canvasHtml(i));
				// get canvas container
				var c = document.getElementById('canvas-stamp-' + i);
				var ctx = c.getContext('2d');
				// draw canvas
				ctx.drawCircle(radius, xCoord, yCoord, bgColor, strokeColor);
				if(i == 1){
					ctx.fillStyle = fgColor;
					ctx.textAlign = 'center';
					ctx.fillText(text, xCoord, yCoord);
				}else{
					ctx.drawTextCircle(text, parseInt(radius) - parseInt(textPadding), xCoord, yCoord, 0, fgColor);
				}
				i++;
			});
		},

		baseHtml : function(){
			var html = '<div id="canvas-container">' +
				'<div id="canvas-params-container">' +
					'<div id="canvas-params-header">' +
						'<button id="canvas-shape-add">Add shape</button>' +
					'</div>' +
				'</div>' +
				'<div id="canvas-preview-container"></div>' +
			'</div>';
			return html;
		},

		canvasHtml : function(num){
			var html = '<canvas id="canvas-stamp-' + num + '" class="canvas-preview" width="400" height="200"></canvas>';
			return html;
		},

		shapeHtml : function(num){
			var html = '<div class="canvas-params" id="canvas-params-' + num + '">'+
				'<h2>Shape #' + num + '</h2>' +
				'<button class="canvas-params-toggle">Edit</button>' +
				'<button class="canvas-shape-remove">X</button>' +
				'<div>' +
					'<h3>Circle Properties</h3>' +
					'<table>' +
						'<thead>' +
							'<tr>' +
								'<td>radius</td>' +
								'<td>bg color</td>' +
								'<td>stroke color</td>' +
							'</tr>' +
						'</thead>' +
						'<tbody>' +
							'<tr>' +
								'<td><input type="number" id="canvas-radius" value="50"/></td>' +
								'<td><input class="jscolor" id="canvas-bg-color" value="#FFFFFF"/></td>' +
								'<td><input class="jscolor" id="canvas-stroke-color" value="#000000"/></td>' +
							'</tr>' +
						'</tbody>' +
					'</table>' +
					'<h3>Text Properties</h3>' +
					'<table>' +
						'<thead>' +
							'<tr>' +
								'<td>stamp text</td>' +
								'<td>fg color</td>' +
							'</tr>' +
						'</thead>' +
						'<tbody>' +
							'<tr>' +
								'<td><input type="text" id="canvas-text" value="this is my text"/></td>' +
								'<td><input class="jscolor" id="canvas-fg-color" value="#000000"/></td>' +
							'</tr>' +
						'</tbody>' +
					'</table>' +
				'</div>' +
			'</div>';
			return html;
		}

	});

})(jQuery);

/**
* Extend canvas functions
**/
CanvasRenderingContext2D.prototype.drawCircle = function(radius, x, y, bgColor, strokeColor){
	this.beginPath();
	this.arc(x, y, radius, 0, 2 * Math.PI);
	this.strokeStyle = strokeColor;
	this.stroke();
	this.fillStyle = bgColor;
	this.fill();
	this.closePath();
}

CanvasRenderingContext2D.prototype.drawTextCircle = function(text, radius, x, y, sAngle, fgColor){
	 var numRadsPerLetter = 2 * Math.PI / text.length;
	 this.save();
	 this.translate(x, y);
	 this.rotate(Math.PI / 2);
	 this.fillStyle = fgColor;

	 for(var i = 0; i < text.length; i++){
			this.save();
			this.rotate(i * numRadsPerLetter);
			this.fillText(text[i], 0, -radius);
			this.restore();
	 }
	 this.restore();
}

CanvasRenderingContext2D.prototype.drawImageCircle = function(imageSrc, radius, x, y){
	baseImage = new Image();
	baseImage.src = imageSrc;
	baseImage.onload = function(){
		this.drawImage(baseImage, parseInt(x) - parseInt(radius), parseInt(y) - parseInt(radius), parseInt(radius) * 2, parseInt(radius) * 2);
	}
}
