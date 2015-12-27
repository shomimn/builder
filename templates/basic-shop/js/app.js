"use strict"; 

var app = angular.module("shop");

app.factory("products", function($http)
{
    var productsService =
    {
        getAll: function()
        {
            return $http.get("products");
        },
        save: function(product)
        {
            return $http.put("products/" + product.id, product);
        },
        insert: function(product)
        {
            return $http.post("products", product);
        }, 
        delete: function(product)
        {
            return $http.delete("products/" + product.id);
        }
    };
    
    return productsService;
});

app.service("cartService", function()
{
    var cart =
    {
        products: [],
        add: function(product, quantity)
        {
            quantity = parseInt(quantity);
//            var clone = jQuery.extend(true, {}, product);
            var index = -1;
            for (var i = 0; i < cart.products.length; ++i)
                if (cart.products[i].product.id === product.id)
                {
                    index = i;
                    break;
                }
            
            if (index == -1)
                cart.products.push({product: product, quantity: quantity});
            else
                cart.products[index].quantity += quantity;
        },
        total: function()
        {
            var total = 0;
            cart.products.forEach(function(item)
            {
                total += item.product.price * item.quantity;
            });
            
            return total;
        },
        size: function()
        {
            var size = 0;
            cart.products.forEach(function(item)
            {
                size += parseInt(item.quantity);
            });
            
            return size;
        }
    };
    
    return cart;
});

app.controller("GridController", ["$scope", "$state", "$rootScope", "$window", "products", "cartService", function($scope, $state, $rootScope, $window, products, cartService)
{
    $scope.products = [];
    
    products.getAll().success(function(data)
    {
        $scope.products = data;
    });
    
    $scope.itemClicked = function(product)
    {
        $rootScope.selectedProduct = product;
//        $state.go("item");
        $window.location.href = "item.html";
    };
    
    $scope.cart = cartService;
    
    $scope.openCart = function()
    {
        $state.go("cart");
    };
    
    $scope.checkout = function()
    {
        $state.go("checkout");
    };
    
    $scope.edit = function(product)
    {
        $rootScope.selectedProduct = product;
        $state.go("admin");
    };
    
    $scope.delete = function(product)
    {
        products.delete(product).success(function (data, status)
        {
            $scope.products.splice($scope.products.indexOf(product), 1);
            console.log(data);
        });
    };
}]);

app.controller("ItemController", ["$scope", "$rootScope", "$state", "cartService", function($scope, $rootScope, $state, cartService)
{
    $scope.cart = cartService;
    $scope.quantity = 1;
    
    $scope.openCart = function()
    {
        $state.go("cart");
    };
    
    $scope.checkout = function()
    {
        $state.go("checkout");
    };
}]);

app.controller("CartController", ["$scope", "$rootScope", "$state", "cartService", function($scope, $rootScope, $state, cartService)
{
    $scope.cart = cartService;
    
    $scope.continue = function()
    {
        $state.go("grid");
    };
    
    $scope.checkout = function()
    {
        $state.go("checkout");
    };
    
    $scope.remove = function(item)
    {
        $scope.cart.products.splice($scope.cart.products.indexOf(item), 1);
    };
}]);

app.controller("CheckoutController", ["$scope", "$rootScope", "$state", "cartService", function($scope, $rootScope, $state, cartService)
{
    $scope.cart = cartService;
    
    $scope.details =
    {
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        address1: "",
        address2: "",
        city: "",
        postCode: "",
        country: "",
        shipping: 0,
        payment: "paypal"
    };
    
    $scope.test = function() { console.log($scope.details); };
    
    $scope.total = function()
    {
        return $scope.cart.total() + parseInt($scope.details.shipping);
    };
}]);

app.controller("AdminController", ["$scope", "$rootScope", "$state", "products", function($scope, $rootScope, $state, products)
{
    $scope.isEdit = Object.getOwnPropertyNames($rootScope.selectedProduct).length > 0;
    $scope.save = function()
    {
        var callback = function(data, status)
        {
            console.log(data);
            $state.go("grid");  
        };
        
        if ($scope.isEdit)
            products.save($rootScope.selectedProduct).success(callback);
        else
            products.insert($rootScope.selectedProduct).success(callback);
    };
    
    $scope.cancel = function()
    {
        $state.go("grid");
    };
}]);

app.controller("LoginController", ["$scope", "$rootScope", "$state", "$http", function($scope, $rootScope, $state, $http)
{
    $scope.username = "";
    $scope.password = "";
    
    $scope.login = function()
    {
        $http.post("admin", {username: $scope.username, password: $scope.password})
            .success(function(data, status)
            {
                $("#adminModal").modal("hide");
                $rootScope.isAdmin = true;
            })
            .error(function(data, status)
            {
                alert("failed");
            });
    };    
}]);
