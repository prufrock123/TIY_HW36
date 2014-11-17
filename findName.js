(function(window, undefined) {
    "use strict";

    var FindName = Backbone.Model.extend({

        defaults: {
            url: "https://burning-inferno-529.firebaseio.com",
            id: "/ID.json"
        },

        url: function() {
            return [
                this.get('url'),
                this.get('id')
            ].join("");

        },

        initialize: function() {
            var self = this;
            return this.fetch().then(function(model) {
                var resArray = [];

                for (var x in model) {
                    resArray.push(model[x]);
                }
                console.log(model);
                console.log(resArray);

                resArray.forEach(function(element) {
                    new ApartmentView(element)
                })
            });
        };
    });



    var ApartmentView = Backbone.View.extend({
        tagname: "div",

        classname: "package",

        initialize: function(opts) {
            this.options = _.extend({}, {
                    $container: $('#list')
                },
                opts
            );
            this.options.$container.append(this.el);
            this.render();
        },

        template: "<div class='row'><div class='large-12 columns'><a href=#><h4 class=text-center><%= firstName %> at address: <%= address %></h4></a></div></div><hr/>",
        render: function() {
            console.dir(this.options);
            console.dir(this.template);
            this.el.innerHTML = _.template(this.template, this.options);
        }
    })



    var test = new FindName();



    window.FindName = FindName;
})(window, undefined);
