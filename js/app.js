window.onload = app;
    // runs when the DOM is loaded
    function app(){

        // load some scripts (uses promises :D)
        loader.load(
            {url: "./bower_components/jquery/dist/jquery.min.js"},
            {url: "./bower_components/lodash/dist/lodash.min.js"},
            {url: "./bower_components/backbone/backbone.js"},
            {url: "./bower_components/pathjs/path.min.js"},
            {url: "./bower_components/foundation/js/foundation.js"},
            {url: "//cdn.firebase.com/js/client/2.0.3/firebase.js"},
            {url: "//cdn.firebase.com/libs/backfire/0.4.0/backfire.min.js"},
            {url: "./js/packageTask.js"},
            // {url: "./findName.js"},
            // {url: "./js/ocrad.js"},
            {url: "./js/testOCR.js"}
            // {url: "./js/firebase.js"}
        ).then(function(){
            _.templateSettings.interpolate = /{([\s\S]+?)}/g;

            // start app?
        })

    }
    
