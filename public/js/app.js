'use strict';
angular.module('KnowledgeBase', [
    'KnowledgeBase.controllers',
    'KnowledgeBase.directives'
]).
    config(function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/search', {
                templateUrl: 'partials/search',
                reloadOnSearch: false
            }).
            otherwise({
                redirectTo: '/search'
            });

        $locationProvider.html5Mode(true);
    });
