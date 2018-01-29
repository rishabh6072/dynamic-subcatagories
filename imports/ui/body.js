import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
// import { ReactiveDict } from 'meteor/reactive-dict';

import './body.html';

import './register.html';
import './register.js';

import './addcat.html';
import './addcat.js';


  FlashMessages.configure({
    autoHide: true,
    hideDelay: 2000,
    autoScroll: true
  }); 