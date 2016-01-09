angular.module('builder').controller('AdditionalNavController', ['$scope', '$rootScope', '$translate', 'bootstrapper', 'elements', 'settings', 'grid', 'preview', 'themes', 'fonts', 'panels', function($scope, $rootScope, $translate, bootstrapper, elements, settings, grid, preview, themes, fonts, panels) {
    $scope.themes = themes;
    $scope.settings = settings;
    $scope.fonts = fonts;

    $('#view').removeClass('loading');

    $scope.bootstrapper = bootstrapper;
    bootstrapper.start();

}]);
