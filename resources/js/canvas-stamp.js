/**
 * Canvas Stamp Draw
 * Copyright (c) 2018 Alexandr Bobkov <lilalex85@gmail.com>
 * Licensed under MIT
 * @author Alexandr Bobkov
 * @version 0.0.1
 */

// GLOBAL VARIABLES
var canvasCount = 0;
var xCoord = 200;
var yCoord = 100;
var textPadding = 15;

$(document).ready(function(){
	// Add Shape
	$('#canvas-shape-add').on('click', function(){
		canvasCount++;
		$('#canvas-params-container').append(getShapeHtml(canvasCount));
		drawStamp();
	});

	// Remove Shape
	$('#canvas-params-container').on('click', 'button.canvas-shape-remove', function(){
		$(this).parent().fadeOut(300, function(){
			// remove canvas
			$('#canvas-stamp-' + canvasCount).remove();
			// remove canvas params container
			$(this).remove();
			canvasCount--;
		});
	});

	// Toggle Shape
	$('#canvas-params-container').on('click', 'button.canvas-params-toggle', function(){
		$(this).next().next().toggle('fast');
		var text = $(this).text();
		$(this).text(text == 'Edit' ? 'Close' : 'Edit');
	});

	// Preview Shapes
	$('#canvas-params-container').bind('input', function(){
		drawStamp();
	});
});

// FUNCTIONS
CanvasRenderingContext2D.prototype.drawCircle = function(radius, bgColor, strokeColor){
	this.beginPath();
	this.arc(xCoord, yCoord, radius, 0, 2 * Math.PI);
	this.strokeStyle = strokeColor;
	this.stroke();
	this.fillStyle = bgColor;
	this.fill();
	this.closePath();
}

CanvasRenderingContext2D.prototype.drawTextCircle = function(text, radius, sAngle, fgColor){
   var numRadsPerLetter = 2 * Math.PI / text.length;
   this.save();
   this.translate(xCoord, yCoord);
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

CanvasRenderingContext2D.prototype.drawImageCircle = function(imageSrc, radius){
	baseImage = new Image();
	baseImage.src = imageSrc;
	baseImage.onload = function(){
		this.drawImage(baseImage, parseInt(xCoord) - parseInt(radius), parseInt(yCoord) - parseInt(radius), parseInt(radius) * 2, parseInt(radius) * 2);
	}
}

function drawStamp(){
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
		$('#canvas-preview-container').prepend(getCanvasHtml(i));
		// get canvas container
		var c = document.getElementById('canvas-stamp-' + i);
		var ctx = c.getContext('2d');
		// draw canvas
		ctx.drawCircle(radius, bgColor, strokeColor);
		if(i == 1){
			ctx.fillStyle = fgColor;
			ctx.textAlign = 'center';
			ctx.fillText(text, xCoord, yCoord);
		}else{
			ctx.drawTextCircle(text, parseInt(radius) - parseInt(textPadding), 0, fgColor);
		}
		i++;
	});
}

function getShapeHtml(num){
	var html = '<div class="canvas-params" id="canvas-params-' + num + '">'+
		'<h2>Shape #' + num + '</h2>' +
		'<button class="canvas-params-toggle">Edit</button>' +
		'<button class="canvas-shape-remove">X</button>' +
		'<div>' +
			'<h3 class="title-margin">Circle Properties</h3>' +
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
						'<td><input class="canvas-params-value" type="number" id="canvas-radius" value="50"/></td>' +
						'<td><input class="canvas-params-value jscolor" id="canvas-bg-color" value="#FFFFFF"/></td>' +
						'<td><input class="canvas-params-value jscolor" id="canvas-stroke-color" value="#000000"/></td>' +
					'</tr>' +
				'</tbody>' +
			'</table>' +
			'<h3 class="title-margin">Text Properties</h3>' +
			'<table>' +
				'<thead>' +
					'<tr>' +
						'<td>stamp text</td>' +
						'<td>fg color</td>' +
					'</tr>' +
				'</thead>' +
				'<tbody>' +
					'<tr>' +
						'<td><input class="canvas-params-value" type="text" id="canvas-text" value="this is my text"/></td>' +
						'<td><input class="canvas-params-value jscolor" id="canvas-fg-color" value="#000000"/></td>' +
					'</tr>' +
				'</tbody>' +
			'</table>' +
		'</div>' +
	'</div>';
	return html;
}

function getCanvasHtml(num){
	var html = '<canvas id="canvas-stamp-' + num + '" class="canvas-preview" width="400" height="200"></canvas>';
	return html;
}
