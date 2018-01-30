import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Accounts } from 'meteor/accounts-base';
import './addcat.html';
import './navbar.html';
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

	// 	'catList' : function() {
	// 	var countParent = Catagories.find({"parentItem": ""}).count();
	// 	var traversedList = [];
	// 	for(var i = 0 ; i < countParent; i++){
	// 	 	var MainId = Catagories.find({"parentItem": ""})[i]._id;
	// 	 	console.log(MainId)
	// 	 	traversedList[i] = findQuery(MainId);
	// 	 	console.log(traversedList);
	// 	 	// for(var j = 0 ; j < )
	// 	}
	// 	console.log(traversedList);
	// },




// 'get_categories': function(){
// return Catagories.find({parentItem:''});

// },

// 'get_sub_categories': function(){
// return Catagories.find({parentItem:this._id});
// },

catList: function() {
    var results = [];

    var mapChildren = function(category, level) {
      // add the appropriate number of dashes before each name
      var prefix = Array(2 * level).join('---');
      results.push({_id: category._id, catItem: prefix + category.catItem});
      // repeat for each child category
      var children = Catagories.find({parentItem: category._id}).fetch();
      _.each(children, function(c) {
        // make sure to increment the level for the correct prefix
        mapChildren(c, level + 1);
      });
    };

    // map each of the root categories - I'm unsure if the parent
    // selector is correct or if it should be {parentId: {$exists: false}}
    _.each(Catagories.find({parentItem: ''}).fetch(), function(c) {
      mapChildren(c, 0);
    });

    // results should be an array of objects like {_id: String, name: String}
    return results;
  },

});


// function findQuery(id) {
//       return Catagories.findOne({"parentItem": "id" })._id;
//       // return "rishabh";
// }


Template.registerHelper('notequals', function (a) {
      return !a;
    });

Template.registerHelper('equals', function (a, b) {
      return a === b;
    });
