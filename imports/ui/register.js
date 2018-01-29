import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Accounts } from 'meteor/accounts-base';
import './register.html';

Template.register.events({
	'click .set' : function(){
		Session.set('orsignup', true);
	},
	'click .reset' : function(){
		Session.set('orsignup', false);
	},
	//SIGNIN EVENT
	'submit .signin' : function(e) {
		e.preventDefault();
		var Username = e.target.username.value;
		var Password = e.target.password.value;
		Meteor.loginWithPassword(Username, Password, function(err) {
			if(err){
				FlashMessages.sendError(err);
				console.log(err);
			} else {
				FlashMessages.sendError("Logged In Successfully");
				console.log("Logged In Successfully");
				FlowRouter.go('/admin/categories');
			}
		});
	},
	//SIGNUP EVENT
	'submit .signup' : function(e) {
		e.preventDefault();
		console.log('Creating an account');
		var Username = e.target.username.value;
		var Password = e.target.password.value;
			Accounts.createUser({
				username: Username,
				password: Password,
			}, function(err){
				if(err){
					FlashMessages.sendError(err);	
				} else {
					console.log("hey there")
					Meteor.loginWithPassword(Username, Password, function(err) {
						if(err){
							FlashMessages.sendError(err);
							console.log(err);
						} else {
							FlashMessages.sendSuccess("Signed Up Successfully");
							console.log("Logged In Successfully");
							FlowRouter.go('/admin/categories');
						}
					});
				}
			});
		
	},
	
});

Template.register.helpers({
 	'orsignup' : function(){
 		var selectedClass = Session.get('orsignup');
 		if(selectedClass){
 			return true;
 		}
 	},
});
