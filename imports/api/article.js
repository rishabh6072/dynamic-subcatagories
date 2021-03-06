import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';
// import { check } from 'meteor/check';
export const Articles = new Mongo.Collection('articles');


if (Meteor.isServer) {
  Meteor.publish('articles', function articlesPublication() {
    return Articles.find();
  });
}

Articles.allow({
    insert: function (userId, doc) {
           //Normally I would check if (this.userId) to see if the method is called by logged in user or guest
           //you can also add some checks here like user role based check etc.,
           return true;
    },
    update: function (userId, doc, fieldNames, modifier) {
           //similar checks like insert
           return true;
    },
    remove: function (userId, doc) {
           //similar checks like insert
           return true;
    },
});