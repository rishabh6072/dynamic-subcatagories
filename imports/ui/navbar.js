import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Accounts } from 'meteor/accounts-base';
import './navbar.html';
import '../../client/main.js';
import { Catagories } from '../api/catagory.js';

Template.navbar.events({
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

});

Template.navbar.helpers({
	"currentUser": function(){
		var currentUser = Meteor.userId();
		if(currentUser){
			return "currentUser";
		}
	},
	
});

Template.registerHelper('notequals', function (a) {
      return !a;
    });

Template.registerHelper('equals', function (a, b) {
      return a === b;
    });
