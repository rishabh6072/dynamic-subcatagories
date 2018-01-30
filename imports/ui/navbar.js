import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Accounts } from 'meteor/accounts-base';
import './navbar.html';
import { Catagories } from '../api/catagory.js';

Template.navbar.helpers({
"currentUser": function(){
	var currentUser = Meteor.userId();
	if(currentUser){
		return "currentUser";
	}
}
	
});