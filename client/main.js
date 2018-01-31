import '../imports/ui/body.js';
// import '../imports/ui/navbar.js';

console.log("hello from main.js");
	$(function() {
	   $("li").click(function() {
	   	alert("hello")
	      $("li").removeClass("active");
	      $(this).addClass("active");
	   });
	});