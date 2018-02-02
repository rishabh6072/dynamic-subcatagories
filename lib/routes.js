// import { ContactList } from '../imports/api/contacts.js'; 
import { Meteor } from 'meteor/meteor';

//ROOT ROUTE
FlowRouter.route('/',{
	action: function() {
		console.log(`You're on home page`);
		active = FlowRouter.getRouteName();
		BlazeLayout.render('homeLayout', {
			nav: 'nav',
			activehome: active,
		});
	},
	name: 'root'
});
var active = "";

//REGISTER ADMIN ROUTE
FlowRouter.route('/admin',{
	action: function() {
		console.log(`You're on admin page`);
		active =FlowRouter.getRouteName();
		BlazeLayout.render('registerLayout', {
			signin : 'signin',
			signup : 'signup',
			activesign: active,
		});
	},
	name: 'admin'
});


//ADD CATEGORGIES ROUTE
FlowRouter.route('/admin/categories',{
		action: function() {
		active =FlowRouter.getRouteName();
		console.log(active);
		var currentUSer = Meteor.userId();
		if(currentUSer){
			console.log(`add categories`);
			BlazeLayout.render('addcatLayout', {
				addNew: 'addNew',
				activecat: active,
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
		active =FlowRouter.getRouteName();
		console.log(active);
		var currentUSer = Meteor.userId();
		if(currentUSer){
		BlazeLayout.render('addartLayout', {
			addNewArt: 'addNewArt',
			displayArt: 'displayArt',
			activeart: active,
		});
		} else {
			FlowRouter.go('/admin');
			FlashMessages.sendError("You must be Logged-in to do that!!");
		}
	},
	name: 'addarticles'
});

