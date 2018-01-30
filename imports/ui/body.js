import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
// import { ReactiveDict } from 'meteor/reactive-dict';

import './body.html';

import './register.html';
import './register.js';

import './addcat.html';
import './addcat.js';
import './navbar.html';
import './navbar.js';
import './article.html';
import './article.js';



  FlashMessages.configure({
    autoHide: true,
    hideDelay: 2000,
    autoScroll: true
  }); 