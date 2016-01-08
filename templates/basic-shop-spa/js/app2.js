'use strict';

var app = angular.module("shop", ["ui.router"]);

app.config(["$stateProvider", "$urlRouterProvider",
         function($stateProvider, $urlRouterProvider)
{
    $urlRouterProvider.otherwise("/");
   $interpolateProvider.startSymbol('[[');
   $interpolateProvider.endSymbol(']]');
    
    $stateProvider
        .state("grid", 
        {
            url: "/",
            templateUrl: "grid.html",
            controller: "GridController"
        })
        .state("item",
        {
            url: "/item",
            templateUrl: "item.html",
            controller: "ItemController"
        })
        .state("cart",
        {
            url: "/cart",
            templateUrl: "cart.html",
            controller: "CartController"
        })
        .state("checkout",
        {
            url: "/checkout",
            templateUrl: "checkout.html",
            controller: "CheckoutController"
        })
        .state("admin",
        {
            url: "/admin",
            templateUrl: "admin.html",
            controller: "AdminController"
        });
}]);

app.run(["$rootScope", function($rootScope)
{
    $rootScope.edit = false;
    $rootScope.selectedProduct = {};
    $rootScope.isAdmin = false;
}]);