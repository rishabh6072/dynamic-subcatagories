import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Accounts } from 'meteor/accounts-base';
import './addcat.html';
import './navbar.html';
import './navbar.js';
import '../../client/main.js';
import { Catagories } from '../api/catagory.js';
import { Articles } from '../api/article.js';


Template.addNew.events({
	'submit .submit' : function(e){
		e.preventDefault();
		var catItem = e.target.catagory.value;
		var parentItem = e.target.parentItem.value;
		var selectedItem = Session.get('selectedItem');
		if(selectedItem){
		var levelChild = Catagories.findOne({"_id": selectedItem}).level + 1;
		}
		if(selectedItem){
			Catagories.insert({
			catItem: catItem,
			parentItem: selectedItem,
			level: levelChild,
			createdAt: new Date(),
			});
		} else {
			Catagories.insert({
			catItem: catItem,
			parentItem: parentItem,
			level: 0,
			createdAt: new Date(),
			});
		}
		 
		Catagories.update({"_id": parentItem} ,{$push: { "child": catItem }});
		console.log("submit form event working!!!")
        e.target.catagory.value = "";
	},
	'click #sel1' : function(e) {
		console.log("---------");
		var selectedItem = $(e.target).val();
		console.log(selectedItem);
		Session.set('selectedItem', selectedItem);
		if(selectedItem != ""){
			Session.set('disabled', false);
		} else {
			Session.set('disabled', true);
		}
		},

// DELETE CATEGORY 

	'click .delete' : function(e) {
		e.preventDefault();
		selectedItem = Session.get('selectedItem');
		console.log('Item Deleted');
		Catagories.remove({_id: selectedItem});
		Articles.find({parentItem: selectedItem}).forEach(function(doc){
			Articles.remove({_id: doc._id});
		});
		console.log(Catagories.find({_id: selectedItem}).catItem + " level 0")


		var mapChild = function (document){
			Catagories.find({parentItem: document._id}).forEach(function (doc){
				Session.set("foundItems", doc);
				Catagories.remove({_id: doc._id});
				var docs = Session.get("foundItems");
				Articles.find({parentItem: docs._id}).forEach(function (docu) {
					Articles.remove({_id: docu._id});
				});
				console.log(doc.catItem + " level 2");
				mapChild(docs);
			});
		}
		Catagories.find({parentItem: selectedItem}).forEach(function (doc) {
			console.log(doc.catItem  + " level 1");
			Session.set("foundItems", doc);
			Catagories.remove({_id: doc._id});
			var docs = Session.get("foundItems");
			Articles.find({parentItem: docs._id}).forEach(function (docu) {
				Articles.remove({_id: docu._id});
			});			
			mapChild(docs);
		});
		sAlert.closeAll();
	},

	'click .alertdelete': function(e){
		e.preventDefault();
		sAlert.warning(`<b>All It's Child Categories and Articles Will Be Deleted.<br> You Still Want To Delete This?</b><br><br>
			<button class="delete btn btn-danger">Yes</button><button class="no btn btn-success">No</button>`,
		{effect: 'genie', html: true, position: 'top-left', timeout: 'none', onRouteClose: false, stack: false, offset: '80px'});
	},
	'click .no' : function() {
		sAlert.closeAll({effect: 'genie'});
	},

//EDIT CATEGORY

	'click .edit' : function() {
		var categoryId = this._id;
		// console.log(categoryId + " you clicked!!");
		// Session.set('selectedId', categoryId);
		var selectedCategory = Catagories.findOne({_id: categoryId});
		// console.log(selectedCategory.catItem + " Selected Cat");
		Session.set('selectedCategory', selectedCategory);
	},
});


var results = [];

Template.addNew.helpers({

// DROPDOWN LIST 

// 'catList': function() {
//     var results = [];

//     var mapChildren = function(category, level) {
//     	var prefix = "";
//     	var dash = "---";
//     	for(var i =0; i < level; i++){
//     		prefix = prefix + dash;
//     	}
//       results.push({_id: category._id, catItem: prefix + category.catItem});
//       _.each(Catagories.find({parentItem: category._id}).fetch(), function(c) {
//         mapChildren(c, level + 1);
//       });
//     };

//     _.each(Catagories.find({parentItem: ''}).fetch(), function(c) {
//       mapChildren(c, 0);
//     });

//     return results;
//   },
// LIST DISPLAY

  'catDisplay': function() {
   
	results = [];
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


    // console.log(results[3]);

    return results;

  },

 // DELETE CATEGORY
  'deleteDisabled' : function() {
  	var disabled = Session.get('disabled');
  	if(disabled){
  		return 'disabled';
  	}
  },
  'editItem' : function() {
  	var editItem = Session.get('selectedCategory');
  	return editItem;
  }
});


Template.registerHelper('notequals', function (a) {
      return !a;
    });

Template.registerHelper('equals', function (a, b) {
      return a === b;
    });



//DELETE WITHOUT ID
// CollectionName.find({otherField: "hi"}).forEach(function (doc) {
//   CollectionName.remove({_id: doc._id});
// });


Template.addNew.onRendered(function () {
  	Session.set('disabled', true);


	  

});

Meteor.publish('results', function() {
  return results;
});

Template.Lists_show_page.onCreated(function() {
this.results(() => {
	
  	console.log(results);
  	console.log(results[0]);
	for(var i = 0; i < results.length; i++){
		var str = results[i].catItem;
		if(!str.startsWith("-")){
			$(".sub").append('<h1>level 0</h1>');
		} else if (str.startsWith("---------")){
			$(".sub").append('<h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;level 3!!</h1>');
		} else if (str.startsWith("------")){
			$(".sub").append('<h1>&nbsp;&nbsp;&nbsp;&nbsp;level 2!!</h1>');
		} else if (str.startsWith("---")){
			$(".sub").append('<h1>&nbsp;&nbsp;level 1!!</h1>');
		}
	  }
	});
  this.autorun(() => {
    this.subscribe('results', this.getresults());
  });
});