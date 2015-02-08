
// MeMeGen  

(function () {

	// pixabay creds
	var username 	= 'ajspeller0';
	var api_key 	= 'f9428e8355524de44d88';
	var url 			= "";
	var queryStr  = "";

	var canvas      = document.querySelector("#canvas");
	var ctx         = canvas.getContext('2d');
	var getFile     = document.querySelector("#getFile");
	var saveFile    = document.querySelector("#saveFile");
	var topLine     = document.querySelector("#topLine");
	var bottomLine  = document.querySelector("#bottomLine");
	var getFontSize	= document.querySelector("#fontSize");
	var topAlign    = document.querySelector("#topAlign");
	var bottomAlign = document.querySelector("#bottomAlign");
	var searchBtn   = document.querySelector("#imgSearch");
	var submitBtn   = document.querySelector("#submit");
	var imgUrl      = document.querySelector("#imgUrl");
	var imgSearchsubmit = document.querySelector("#imgSearchsubmit");

	var config = {
		imageSource: null,
		topText: "",
		bottomText: "",
		topAlign: 50,
		bottomAlign: 400
	};

	imgSearchsubmit.addEventListener("click", function (e) {
		e.preventDefault();
		var image = new Image();

		image.addEventListener('load', function() {
			config.imageSource = this;
			reDraw(config);
		}, false);

		image.src = imgUrl.value;

	},false);

  var success = function(data) {
		var previewList = "";
  	if (parseInt(data.totalHits) > 0) {
    	$.each(data.hits, function(i, hit) { 
    		previewList += "<div class='col-xs-4 col-md-2'><a href='#canvas' class='thumbnail'><img id='" + hit.webformatURL + "' src='"+hit.previewURL+"'/></a></div>";
    	});

			//console.log("Preview: " + previewList);
			document.querySelector('#pix').innerHTML = previewList;

			$('#pix').on('click', 'img', function(e) {

		    e.preventDefault();

		    //console.log($(this).attr('id'));
		    var imgFromUrl = new Image();

		    imgFromUrl.addEventListener('load', function() {
					config.imageSource = this;
					reDraw(config);    	
		    });

		    imgFromUrl.src = $(this).attr('id');

		    document.location.hash = '#canvas';
		    document.location.hash = null;

			});

  	} else {
			document.querySelector('#pix').innerHTML = "<h1>No results.  Please try another search query</h1>";
		}
	}


	submitBtn.addEventListener("click",function(e) {
		e.preventDefault();
		queryStr = searchBtn.value;

		$.ajax({
		  dataType: "json",
		  url: "http://pixabay.com/api/?username="+username+
										"&key="+api_key+
										"&q="+encodeURIComponent(queryStr)+
										"&image_type=photo",
		  data: "",
		  success: success
		});


	});


	var wrapText = function (text, x, y, maxWidth, lineHeight) {
	  var words = text.split(' ');
	  var line = '';

	  for(var n = 0; n < words.length; n++) {
	    var testLine = line + words[n] + ' ';
	    var metrics = ctx.measureText(testLine);
	    var testWidth = metrics.width;
	    if (testWidth > maxWidth && n > 0) {
	      ctx.strokeText(line,x, y);
	      ctx.fillText(line, x, y);
	      line = words[n] + ' ';
	      y += lineHeight;
	    }
	    else {
	      line = testLine;
	    }
	  }
	  ctx.strokeText(line,x, y);
	  ctx.fillText(line, x, y);
  }

	var changeAlignTop = function (evt) {
		var yVal = evt.target.value;
		config.topAlign = parseInt(yVal);
		reDraw(config);
	}

	var changeAlignBottom = function (evt) {
		var yVal = evt.target.value;
		config.bottomAlign = parseInt(yVal);
		reDraw(config);		
	}

	topAlign.addEventListener("change", changeAlignTop, false);
	bottomAlign.addEventListener("change", changeAlignBottom, false);

	var changeFontSize = function (evt) {
		var newSize = evt.target.value;
		reDraw(config);
	};

	getFontSize.addEventListener("change", changeFontSize , false);

	var reDraw = function (config) {
		if (config.imageSource != null) {
			var lineHeight = 50;

			ctx.drawImage(config.imageSource,0,0,canvas.width,canvas.height);

			ctx.font      = getFontSize.value + "pt Impact";
			ctx.textAlign = "center";

			ctx.strokeStyle = "black";
			ctx.fillStyle   = "white";
			ctx.lineWidth   = 10;
			
			wrapText(config.topText,canvas.width/2,config.topAlign,canvas.width-180,lineHeight);
			wrapText(config.bottomText,canvas.width/2,config.bottomAlign,canvas.width-180,lineHeight);
		}
	};

	var textHandler = function (evt) {
		var id = evt.target.id;
		var text = evt.target.value;

		if (id == "topLine") {
			config.topText = text;
		} else {
			config.bottomText = text;
		}
		reDraw(config);
	};

	topLine.addEventListener("input",textHandler,false);
	bottomLine.addEventListener("input",textHandler,false);

	saveFile.addEventListener("click", 
		function () {
			var savedImage = canvas.toDataURL();
			window.open(savedImage);
		}, 
		false
	);

	getFile.addEventListener('change',function () {

																			var file = getFile.files[0];
																		  var reader = new FileReader();

																		  reader.addEventListener("load", function() {
																																				var data = reader.result;
																		    																var image = new Image();

																																				image.addEventListener('load', function() {
																																																					config.imageSource = this;
																																																					reDraw(config);
																																																			 }, false);  // image onload 
																																	    	// Set image data to background image.
																																	    	image.src = data;

																		  																}, false);  // reader onload

																		  reader.readAsDataURL(file);
																	}, false);  // getFile onchange
})();


