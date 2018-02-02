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