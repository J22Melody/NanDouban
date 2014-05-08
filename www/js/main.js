requirejs.config({
    paths: {
        "angular": "/bower_components/angular/angular.min",
        "angular-route": "/bower_components/angular-route/angular-route.min",
        "angular-sanitize": "/bower_components/angular-sanitize/angular-sanitize.min",
        "jquery": "/bower_components/jquery/jquery.min",
        "fetch-nju-lib": "/js/lib/fetch-nju-lib"
    },
    shim: {
        "angular-route": {
            deps: ["angular"]
        },
        "angular-sanitize": {
            deps: ["angular"]
        }
    }
});
