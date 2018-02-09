import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Accounts } from 'meteor/accounts-base';
import './register.html';
import './navbar.html'; 
import './article.html'; 
import { Catagories } from '../api/catagory.js';
import { Articles } from '../api/article.js';

// $.cloudinary.config({
// 	cloud_name: "dimhllma1"
// });

Template.addNewArt.events({
	'submit form' : function(e){
		e.preventDefault();
		var title = e.target.title.value;
		var description = e.target.description.value;
		var status = e.target.status.value;
		var publicId = Session.get('imgPublicId');
		var imgUrl = Session.get('imgUrl');
		var selectedItem = Session.get('selectedItem');
		if(selectedItem){
		var levelChild = Catagories.findOne({"_id": selectedItem}).level + 1;
		}
		if(selectedItem){
			Articles.insert({
			title: title,
			description: description,
			status: status,
			imgUrl: imgUrl,
			publicId: publicId,
			parentItem: selectedItem,
			createdAt: new Date(),
			});
		} 
		
        e.target.title.value = "";
        e.target.description.value = "";
	},
		'click #sel1' : function(e) {
		console.log("---------");
		var selectedItem = $(e.target).val();
		console.log(selectedItem);
		Session.set('selectedItem', selectedItem);
		},
		'change #image-upload' (event) {
		    let files;
		    files = event.currentTarget.files;
		    return Cloudinary.upload(files, {
		        api_key: '924583781517797'
		    }, function(err, res) {
		    	if(err){
			       console.log("Upload Error: " + err);
			       alert("Upload Error: " + err);
		    	} else {
			       console.log("Upload Result: " + res.public_id + res.url);
			       Session.set('imgPublicId', res.public_id);
			       Session.set('imgUrl', res.url);

		    	}
		    });
		},
		
});


Template.addNewArt.helpers({
'catList': function() {
    var results = [];

    var mapChildren = function(category, level) {
      var prefix = "";
    	var dash = "---";
    	for(var i =0; i < level; i++){
    		prefix = prefix + dash;
    	}
      results.push({_id: category._id, catItem: prefix + category.catItem});
      _.each(Catagories.find({parentItem: category._id}).fetch(), function(c) {
        mapChildren(c, level + 1);
      });
    };

    _.each(Catagories.find({parentItem: ''}).fetch(), function(c) {
      mapChildren(c, 0);
    });

    return results;
  },

});

Template.displayArt.events({
	'click .published' : function(e, template){
    		template.$(".pubList").fadeIn();
    		template.$(".unpubList").fadeOut();
    		template.$(".unpublished").show();
    		template.$(".published").hide();

  	},
  	'click .unpublished' : function(e, template){
			console.log("you clicked")
    		template.$(".pubList").fadeOut();
    		template.$(".unpubList").fadeIn();
    		template.$(".published").show();
    		template.$(".unpublished").hide();

  	},
  	'click .delete-article' : function(e){

  		Articles.remove({_id: selectedArticle});
  	},
  	'click .alertArtdelete': function(e){
		e.preventDefault();
  		var selectedArticle = this._id;
		var artTitle = Articles.findOne({_id: selectedArticle}).title;
		console.log(artTitle);1 
		sAlert.warning(`<b>Are you sure, you want to delete <br>l,,` + artTitle +`? </b><br><br>
			<button class="delete btn btn-danger">Yes</button><button class="no btn btn-success">No</button>`,
		{effect: 'genie', html: true, position: 'top-left', timeout: 'none', onRouteClose: false, stack: false, offset: '80px'});
	},
});

Template.displayArt.helpers({
	'displayArticle' : function() {
		return Articles.find({});
	},
});

Template.displayArt.onRendered(function () {
  	$(".unpubList").hide();
   	$(".published").hide();

});
Template.registerHelper('equals', function (a, b) {
      return a === b;
    });
