import { Meteor } from 'meteor/meteor';
import '../imports/api/catagory.js';
import '../imports/api/article.js';
Meteor.startup(() => {
  // code to run on server at startup
});


Cloudinary.config({
	cloud_name: 'dimhllma1',
	api_key: '924583781517797',
	api_secret: 'BU27rL_1fWJg3FtuQM3Qauy48Uk'
});
