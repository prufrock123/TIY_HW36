//creates our pacakageTask model to use in our collection.
var PackageTask = Backbone.Model.extend({
	defaults: {deliveryChoice: "Pending"}
});

//creates our packageTaskCollection using BackFire. WATCH OUT! don't get burnt!
var PackageTaskCollection = Backbone.Firebase.Collection.extend({
    model: PackageTask,
    firebase: "https://burning-inferno-529.firebaseio.com"
});

// A view for an individual packageTask
var PackageTaskView = Backbone.View.extend({
	el: '<tr>',
	// template: _.template("<div class='row'><div class='large-12 columns'><h4><%= title %></h4></div></div>"),
	template: _.template([	
	      '<td><%= tenantName%></td>',
	      '<td><%= unitNumber%></td>',
	      '<td><%=itemNumber%></td>',
	     '<td><%=deliveryChoice%></td>',
	     '<td><%=confirmationNumber%></td>',
	     '<td><%=phoneNumber%></td>'
	].join('')),
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

//View for whole application
var AppView = Backbone.View.extend({
	el: $('#packageApp'),
	events: {
		"click #add-package" : "createPackage"
	},
	initialize: function() {
		this.list = this.$("#list");
		this.input = {};
		// this.input = this.$("#new-package")

		// by listening to when the collection changes we
    	// can add new items in realtime
		this.listenTo(this.collection, 'add', this.addOne);
	},
	addOne: function(package) {
		var view = new PackageTaskView({model: package});
		this.list.append(view.render().el);
	},
	createPackage: function(e) {
		// if (!this.input.tenantName) { return; }

	// create a new location in firebase and save the model data
	// this will trigger the listenTo method above and a new todo view
	// will be created as well		
	console.dir(this.input)

	this.input = (function() {
					    // "use strict";
					    var input = {};
					    
					    $(':input').each(function() {
					        input[this.name] = this.value;
					    });

					    return input
					    // var p = $.Deferred();
					    // p.resolve(input);
					    // return p;
					})();
	this.collection.create({tenantName: this.input.tenantName,
							unitNumber: this.input.unitNumber,
							itemNumber: this.input.itemNumber,
							// deliveryChoice: this.input.deliveryChoice,
							confirmationNumber: this.input.confirmationNumber,
							phoneNumber: this.input.phoneNumber
						});

	// this.input.val('');
	}
});


// Create a function to kick off our BackFire app

function init() {
	// The data we are syncing from Firebase
	var collection = new PackageTaskCollection();
	var app = new AppView({ collection: collection });
}

$(function() {
	init();
});


