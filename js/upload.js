var Upload = function() {
	
	var self = this;
	
	self.input = document.getElementById('files');
	
	self.handle = function(evt) {

		var data;

		var file = self.input.files[0]; // FileList object

		var reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = function(e) {
			data = JSON.parse(reader.result);
		};

		// Read in JSON as a Text.
		reader.readAsText(file, 'UTF-8');

		reader.onloadend = function() {
			map.updateWithData(data);
		}

	};
	
	self.init = function() {
		self.input.addEventListener('change', self.handle, false);
	};
	
	self.init();
	
}

var upload = new Upload();
