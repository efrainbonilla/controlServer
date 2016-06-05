/*global define*/

define(function() {
	'use strict';

	var HandlePrintController = function($scope, $document) {

		var title = 'SALA SITUACIONAL';

		$scope.open = function($event, id, subtitle) {
			$event.preventDefault();
			$event.stopPropagation();

			if (!subtitle) {
	            subtitle = angular.element($document[0].querySelector('.page-header h1 span'));
	            subtitle = (subtitle.length>0) ? subtitle[0].innerHTML : '';
			}

			var texto = '<table width="100%" align="center" cellspacing="0" cellpadding="0" class="tablaBorder">';
			texto += document.getElementById(id).innerHTML + "</table>";

			this.printPopup(title, subtitle, texto);
		};

		$scope.openr = function($event, id, subtitle) {
			$event.preventDefault();
			$event.stopPropagation();

			if (!subtitle) {
	            subtitle = angular.element($document[0].querySelector('.page-header h1 span'));
	            subtitle = (subtitle.length>0) ? subtitle[0].innerHTML : '';
			}

			var texto = '<table width="100%" align="center" cellspacing="0" cellpadding="0" class="tablaBorder">';
			texto += document.getElementById('desc-com').innerHTML + document.getElementById(id).innerHTML + "</table>";

			this.printPopup(title, subtitle, texto);
		};

		$scope.printPopup = function(title, subtitle, text, withoutRifAndLogus, withoutStyles) {

			/* abro el popup */
			var myWindow=window.open('','_blank','width=730, height=500, top=50, left=50, scrollbars=1');

			var head = '<html><head>';
			head += '<title>'+title+'</title>';
			if (!withoutStyles) {
				head += '<link rel="STYLESHEET" type="text/css" href="/ng-admin-custom/build/ng-admin-custom.min.css">';
				/*head += '<link rel="STYLESHEET" type="text/css" href="../bbve_ve_web_pub/estilos/estilos_VE_PRINT.css">';*/
			}

			/*head += '<link rel="STYLESHEET" type="text/css" href="../bbve_ve_web_pub/estilos/printPopup.css">';
		  	head += '<script type="text/javascript" src="../bbve_ve_web_pub/javascripts/bloqBotonDer.js"><\/script>';
			head += '<script type="text/javascript" src="../bbve_ve_web_pub/javascripts/printPopup.js"><\/script>';*/
			head += '</head>';

			var body = '<body>';

			if (!withoutRifAndLogus) {
				body +="<table class='tablaBorder' cellSpacing='0' cellPadding='0' align='center' border='0' width='100%' id='tabla'>";
			  	body += "<tr>";

				body += "<td class='celTitIzquierdo' id='SinHeader' cellPadding='10' style='padding:5px;'>";
				body += "<table width='100%' cellSpacing='0' cellPadding='0' align='center' border='0' class='tablaBorder'>";
				body += "<tr><td align='left' style='padding-top: 8px;'>";

				body += "<table width='100%' cellSpacing='0' cellPadding='0' align='center' border='0'><tbody><tr>";
				body += "<td><img border='0' src='/img/logo-left.png' width='100' height='100'></td>";
				body += "<td style='text-align:center'>"+title+"</td>";
				body += "<td><img border='0' src='/img/logo-right.png' width='100' height='100' style='float:right'></td>";
				body += "</tr></tbody></table>";

				body += "</td></tr>";
				body += "<tr><td class='separator'>&nbsp;</td></tr>";
				body += "<tr><td class='barraNavegacion' colspan='2'>&nbsp;"+subtitle+"</td></tr>";
				body += "<tr><td class='separator'>&nbsp;</td></tr>";
				body += "<tr><td>";
				body += "<div id='content'>";
			}
			body += text;
			if (!withoutRifAndLogus) {
				body += "</div></td></tr>";
				body += "</table>";
				body += "</td></tr>";
				body += "</table>";
			}
			body += '</div>';
			body += '</body></html>';

			myWindow.document.write(head+body);
			myWindow.document.close();

			return myWindow;
		};

	};

	HandlePrintController.$inject = ['$scope', '$document'];

	return HandlePrintController;
});