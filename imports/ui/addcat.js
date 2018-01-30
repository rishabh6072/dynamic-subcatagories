import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Accounts } from 'meteor/accounts-base';
import './addcat.html';
import { Catagories } from '../api/catagory.js';


Template.addNew.events({
//LOGOUT EVENT
	'click .logout' : function(e) {
		Meteor.logout(function(err){
			if(err) {
				FlashMessages.sendError(err);
			} else {
				FlashMessages.sendSuccess("Logged Out Successfully");
				FlowRouter.go('/admin');
			}
		});
	},
	'submit form' : function(e){
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
		
		// var i = 10;
		// Session.set('selectedItem' + i, selectedItem);
		// var s = Session.get('selectedItem'+ i);
		// alert(s);
	},
});


Template.addNew.helpers({
	'catagory': function() {
		var selectedItem = Session.get('selectedItem');
		// if(selectedItem){
		// 	return Catagories.find({"parentItem": selectedItem});
		// }
		// 	return Catagories.find({"parentItem": ""});
			return Catagories.find({}, { sort: {level: 1}});
	},

	'selectedItem' : function() {
		var selectedItem = Session.get('selectedItem');
		if(selectedItem) {
			return Catagories.findOne({"_id": selectedItem}).catItem;
		}
	},

	'catList' : function() {
		// var maxLevel = Catagories.find({level :{$gt : 3}});

		// return Catagories.aggregate( [ { $group : { _id : "$parentItem" } } ] )
	},
	  treeArgs: {
	    collection: Catagories,
	    // subscription: subscription,
	    events: {
	      changed: function(e, item) {
	        console.log("Item " + item + "selected.");
	      }
	    }
	  },
});

Template.registerHelper('notequals', function (a) {
      return !a;
    });

Template.registerHelper('equals', function (a, b) {
      return a === b;
    });
