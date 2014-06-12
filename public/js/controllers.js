'use strict';

/* Controllers */

angular.module('KnowledgeBase.controllers', ['ui.bootstrap']).
    controller('AppCtrl', function ($scope, $http) {

        $http({
            method: 'GET',
            url: '/api/name'
        }).
            success(function (data, status, headers, config) {
                $scope.name = data.name;
            }).
            error(function (data, status, headers, config) {
                $scope.name = 'Error!';
            });

    }).


    controller('searchController', ['$scope', '$routeParams', '$http', '$window', function ($scope, $routeParams, $http, $window) {
        var init = function () {
            $scope.isDisabled = '';
            $scope.loading = false;
            $scope.documents = [];
            $scope.categories = [];
            $scope.versions = [];
            $scope.itemsPerPage = 3;
            $scope.currentPage = 0;
            $scope.numFound = 0;
            $scope.paging = 'hide';
            $scope.filterQuery = 'default';
            $scope.currentFilter = '';
            $scope.active = '';
            $scope.isSideBarHidden = true;
            $scope.loading = false;
        };
        init();
        $scope.getAutocompletion = function (val) {
            return $http.get('/api/autocomplete/' + val, {
            }).then(function (res) {
                var suggestions = [];
                angular.forEach(res.data.results, function (item) {
                    if (item != '') {
                        suggestions.push(item);
                    }
                });
                return suggestions;
            });
        };
        $scope.onSelect = function (val) {
            $scope.q = val;
            $scope.submit();
        };
        var flag = 0;
        var search = function () {
            flag = 1;
            $scope.loading = true;
            var url = '/api/search/' + $scope.q + '/' + $scope.currentPage;
            var urlFacet = '/api/searchFacet/' + $scope.q;
            if ($scope.filterQuery) {
                url += '/' + $scope.filterQuery;
                $scope.currentFilter = $scope.filterQuery;
            }
            $http({
                method: 'GET',
                url: url
            }).
                success(function (data, status, headers, config) {
                    $scope.numFound = data.results.numFound;
                    $scope.documents = data.results.documents;
                    $scope.loading = false;
                    $scope.paging = '';

                    //Gives issue check it out, No workaround till now https://github.com/angular/angular.js/issues/3924
                    var targetUrl = "/search?q=" + $scope.q;
                    window.history.pushState({url: "" + targetUrl + ""}, "Documentation", targetUrl);


                }).
                error(function (data, status, headers, config) {
                    $scope.name = 'Error!';
                });
            $http({
                method: 'GET',
                url: urlFacet
            }).
                success(function (data, status, headers, config) {
                    $scope.categories = data.results.facets[0].terms;
                }).
                error(function (data, status, headers, config) {
                    $scope.name = 'Error!';
                });
        };

        $scope.submit = function () {
            flag = 1;
            $scope.loading = true;
            var url = '/api/search/' + $scope.q + '/' + 0;
            var urlFacet = '/api/searchFacet/' + $scope.q;
            init();
            if ($scope.filterQuery) {
                url += '/default';

            }
            $http({
                method: 'GET',
                url: url
            }).
                success(function (data, status, headers, config) {
                    $scope.numFound = data.results.numFound;
                    $scope.documents = data.results.documents;
                    $scope.loading = false;
                    $scope.paging = '';

                    //Gives issue check it out, No workaround till now https://github.com/angular/angular.js/issues/3924
                    var targetUrl = "/search?q=" + $scope.q;
                    window.history.pushState({url: "" + targetUrl + ""}, "Documentation", targetUrl);


                }).
                error(function (data, status, headers, config) {
                    $scope.name = 'Error!';
                });
            $http({
                method: 'GET',
                url: urlFacet
            }).
                success(function (data, status, headers, config) {
                    $scope.categories = data.results.facets[0].terms;
                }).
                error(function (data, status, headers, config) {
                    $scope.name = 'Error!';
                });

        };

        if (typeof $routeParams.q != 'undefined' && flag != 1) {
            $scope.q = $routeParams.q;
            search();

        }
        if ($window.innerWidth <= 768) {
            $scope.isSideBarHidden = false;
        }
        $scope.selection = [];

        $scope.selectFilter = function (filter) {
            $scope.currentPage = 0;
            var idx = $scope.selection.indexOf(filter);
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            else {
                $scope.selection.push(filter);
            }
            if ($scope.isChecked(filter)) {
                $scope.filterQuery = 'default';
                search();
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            } else {
                $scope.filterQuery = filter.term;
                search();
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            }
        };
        $scope.nextPage = function () {
            $scope.loading = true;
            $scope.currentPage++;

            search();
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }

        };
        $scope.showSide = function () {

            if ($scope.active == 'active') {
                $scope.active = '';
            } else {
                $scope.active = 'active';
            }
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        };
        $scope.DisablePrevPage = function () {
            if ($scope.currentPage <= 0) {
                return "disabled";
            } else return '';
        };
        $scope.DisableNextPage = function () {
            if ((($scope.currentPage + 1) * 10) >= $scope.numFound && $scope.numFound > 10 || $scope.numFound < 10) {
                $scope.isDisabled = 'hide';
                return "disabled";

            } else return '';
        };
        $scope.isChecked = function (category) {
            if (category.term == $scope.currentFilter) {
                return true;
            } else {
                return false;
            }
        };
        $scope.prevPage = function () {
            $scope.loading = true;
            $scope.currentPage--;
            search();
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        };
//        $scope.$on('$routeChangeStart', function (e, next, last) {
//            if (next.$$route.controller === last.$$route.controller) {
//                e.preventDefault();
//                $route.current = last.$$route;
//                //do whatever you want in here!
//            }
//        });

    }]);

