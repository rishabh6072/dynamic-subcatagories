import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Accounts } from 'meteor/accounts-base';
import './addcat.html';
import './navbar.html';
import './navbar.js';
import '../../client/main.js';
import { Catagories } from '../api/catagory.js';
import { Articles } from '../api/article.js';
import { ReactiveDict } from 'meteor/reactive-dict';

var checkedArr = new ReactiveArray([]);

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
			var selectedItemStatus = Catagories.findOne({"_id": selectedItem}).status;
			console.log(selectedItemStatus);
		} else {
			var status = e.target.status.value;
		}

			if(selectedItemStatus == "Unpublished"){
				var status = "Unpublished"
			} else if (selectedItemStatus == "Published") {
				var status = e.target.status.value;
			}
		
		if(selectedItem){
			Catagories.insert({
			catItem: catItem,
			status: status,
			parentItem: selectedItem,
			level: levelChild,
			createdAt: new Date(),
			});
		} else {
			Catagories.insert({
			catItem: catItem,
			status: status,
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
// ----------------
// DELETE CATEGORY 
// ----------------

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
// ----------------
// EDIT CATEGORY
// ----------------

	'click .edit' : function(e) {
		var selectedEdit = this._id;
		Session.set('selectedEdit', selectedEdit);
		console.log(selectedEdit);
		var editItem = Catagories.findOne({_id: selectedEdit});
		console.log(editItem);
		Session.set('editItem', editItem);
	    // e.target.status.value="";
	},

// UPDATE Event

	'submit .update' : function(e) {
		e.preventDefault();
		// alert('you clicked');
		console.log(e.target);

		var catItem = e.target.catagory.value;
		var parentItem = e.target.parentItem.value;
		var selectedItem = Session.get('selectedItem');
		var selectedEdit = Session.get('selectedEdit');
		if(selectedItem){
		var levelChild = Catagories.findOne({"_id": parentItem}).level + 1;
		}

		if(selectedItem){
			console.log('selected item worked in update event');
			var selectedItemStatus = Catagories.findOne({"_id": selectedItem}).status;
			console.log(selectedItemStatus);
		} else {
			var status = e.target.status.value;
		}

			if(selectedItemStatus == "Unpublished"){
				var status = "Unpublished"
			} else if (selectedItemStatus == "Published") {
				var status = e.target.status.value;
			}
		Catagories.update({ _id: selectedEdit}, {$set: {"catItem": catItem, "parentItem": parentItem, "status": status, "level": levelChild}});
		console.log("edited")
		e.target.catagory.value = "";
		e.target.parentItem.value = "";
		e.target.status.value = "";
	},

	'click .cancel': function(e) {
		Session.set('editItem', "");
	}
});



Template.addNew.helpers({

//-----------------
// DROPDOWN LIST 
//-----------------

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

//-----------------
// LIST DISPLAY
//-----------------

  'catDisplay': function() {
   
	var results = [];
    var mapChildren = function(category) {
      results.push({_id: category._id, level: category.level, catItem: category.catItem, parentItem: category.parentItem, status: category.status});
      _.each(Catagories.find({parentItem: category._id}).fetch(), function(c) {
        mapChildren(c);
      });
    };

    _.each(Catagories.find({parentItem: ''}).fetch(), function(c) {
      mapChildren(c);
    });
    return results;
  },

//-----------------
// DELETE CATEGORY
//-----------------

  'deleteDisabled' : function() {
  	var disabled = Session.get('disabled');
  	if(disabled){
  		return 'disabled';
  	}
  },

// ------------------
// EDIT ITEMS
// ------------------
	'editItem' : function() {
		var editItem = Session.get('editItem');
		return editItem;
	},

});


Template.registerHelper('notequals', function (a) {
      return !a;
    });

Template.registerHelper('equals', function (a, b) {
      return a === b;
    });
Template.registerHelper('multiply', function (a, b) {
      return a*b;
    });
Template.registerHelper('add', function (a, b) {
      return a+b;
    });

Template.addNew.onRendered(function () {
  	Session.set('disabled', true);
});












// // ------------------------
// // EDIT Categories 
// // ------------------------

// 	'click .check input' : function(e, template, instance){
//             //e.preventDefault();
//             var selected = template.findAll("input[type=checkbox]:checked");
//             checkedArr = _.map(selected, function(item){
//                 return item.defaultValue;
//             });
//             // instance.state.set('checkedArr', checkedArr);
//             // // console.log(checkedArr);
//             // var test = instance.state.get('checkedArr');
//             // console.log(test);
//             // console.log('from reactive-dict');
// 	},

// // 'change .hide-completed input'(event, instance) {
// //     instance.state.set('hideCompleted', event.target.checked);
// //   },

// 	'click .edit' : function() {
//         console.log(checkedArr);
//         console.log(' from edit button');
        
// 	},

// HELPER

  // 'displaychecked' : function() {
  // 	return checkedArr.list();
  // 	// const instance = Template.instance();
  // 	// var demo = instance.state.get('checkedArr');
  // 	// console.log(demo);
  // 	// console.log('from displaychecked helper')
  // 	// return demo;
  // }