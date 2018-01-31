// import { ContactList } from '../imports/api/contacts.js'; 
import { Meteor } from 'meteor/meteor';

//ROOT ROUTE
FlowRouter.route('/',{
	action: function() {
		console.log(`You're on home page`);
		BlazeLayout.render('homeLayout', {
			nav: 'nav',
		});
	},
	name: 'root'
});

//REGISTER ADMIN ROUTE
FlowRouter.route('/admin',{
	action: function() {
		console.log(`You're on admin page`);
		BlazeLayout.render('registerLayout', {
			signin : 'signin',
			signup : 'signup',
		});
	},
	name: 'admin'
});


//ADD CATEGORGIES ROUTE
FlowRouter.route('/admin/categories',{
		action: function() {
		var currentUSer = Meteor.userId();
		if(currentUSer){
			console.log(`add categories`);
			BlazeLayout.render('addcatLayout', {
				addNew: 'addNew',
			});
		} else {
			FlowRouter.go('/admin');
			FlashMessages.sendError("You must be Logged-in to do that!!");
		}	 
	},
	name: 'categories'
});

//ADD ARTICLES ROUTE
FlowRouter.route('/admin/addarticles',{
	action: function() {
		var currentUSer = Meteor.userId();
		if(currentUSer){
		BlazeLayout.render('addartLayout', {
			addNewArt: 'addNewArt',
			displayArt: 'displayArt',
		});
		} else {
			FlowRouter.go('/admin');
			FlashMessages.sendError("You must be Logged-in to do that!!");
		}
	},
	name: 'addarticles'
});

