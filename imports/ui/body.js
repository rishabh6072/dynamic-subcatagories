import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
// import { ReactiveDict } from 'meteor/reactive-dict';
import { Articles } from '../api/article.js';
import { Catagories } from '../api/catagory.js';
import { ReactiveDict } from 'meteor/reactive-dict';

import './body.html';

import './register.js';
import './addcat.js';
import './navbar.js';
import './article.js';
// import './article.html';
// import './navbar.html';
// import './addcat.html';
// import './register.html';

  FlashMessages.configure({
    autoHide: true,
    hideDelay: 2000,
    autoScroll: true
  }); 

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('catagories');
  Meteor.subscribe('articles');
});


Template.nav.events({
	'click .btn-sidebar' : function(e){
		e.preventDefault();
		selectedItemId = this._id;
		console.log(selectedItemId + " -selectedItemId");
		Session.set('selectedItemId', selectedItemId);
	},
	'click .btn-all-articles' : function(e) {
		e.preventDefault();
		selectedItemId = "all";
		Session.set('selectedItemId', selectedItemId);
	},
});


Template.nav.helpers({

  'catNav': function() {
   
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

  'showProducts' : function() {
  	var results = [];
  	var selectedItemId = Session.get('selectedItemId');
  	if(selectedItemId == "all"){
  		_.each(Articles.find({}).fetch(), function(p){
			results.push({_id: p._id, title: p.title, status: p.status, imgUrl: p.imgUrl, description: p.description, parentItem: p.parentItem });
		});
  	} else {
  		_.each(Articles.find({parentItem: selectedItemId}).fetch(), function(p){
			results.push({_id: p._id, title: p.title, status: p.status, imgUrl: p.imgUrl, description: p.description, parentItem: p.parentItem });
		});
  		_.each(Catagories.find({parentItem: selectedItemId}).fetch(), function(doc){
  			_.each(Articles.find({parentItem: doc._id}).fetch(), function(p){
  				results.push({_id: p._id, title: p.title, status: p.status, imgUrl: p.imgUrl, description: p.description, parentItem: p.parentItem });
  			});
  		});

  // 		var mapArticle = function(articles) {
		// 	results.push({_id: articles._id, title: articles.title, status: articles.status, imgUrl: articles.imgUrl, description: articles.description, parentItem: articles.parentItem });
		// 	// console.log(results);
		// 	_.each(Catagories.find({parentItem: articles.parentItem}).fetch(), function(doc){
  // 				_.each(Articles.find({parentItem: doc._id}).fetch(), function(p){
  // 				mapArticle(p);
  // 				});
  // 			});
  // 		}
  // 		_.each(Articles.find({parentItem: selectedItemId}).fetch(), function(p){
  // 			mapArticle(p);
		// });
  	}
  	
  	return results;
  },
  'catHeading' : function() {
  	var selectedItemId = Session.get('selectedItemId');
  	var catItem = Catagories.findOne({_id: selectedItemId }).catItem;
  	return	catItem;
  }
});


Template.nav.onRendered(function () {
  	Session.set('selectedItemId', "all");
});