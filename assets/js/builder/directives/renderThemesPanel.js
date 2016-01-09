angular.module('builder.directives').directive('blRenderThemes', ['$compile', '$translate', function($compile, $translate) {
    return {
        restrict: 'A',
        link: function($scope, el) {

            var deregister = $scope.$watch('panels.active', function(name) {
                //if (name == 'themes') {

                    var img = "theme.image ? theme.image : 'themes/'+theme.name+'/image.png'";

                    var html = $compile(
                        '<div class="theme inline" ng-repeat="theme in filteredThemes = (themes.all | filter:filter.type | filter:filter.search)" ng-click="activateTheme(theme)">'+
                        '<figure id="{{ theme.name }}-theme" ng-class="{ active: themes.active.name == theme.name }">'+
                        '<img ng-src="{{ '+"theme.image ? theme.image : 'themes/'+theme.name+'/image.png'"+' }}" class="img-responsive" alt="{{ theme.name }}">'+
                        '<i ng-if="canEdit(theme)" ng-click="themes.edit(theme);$event.stopPropagation()" class="icon icon-cog-outline edit-theme" bl-tooltip="editTheme"></i>'+
                        '<i ng-if="canEdit(theme)" ng-click="themes.delete(theme);$event.stopPropagation()" class="icon icon-trash delete-theme" bl-tooltip="deleteTheme"></i>'+
                        '<figcaption class="clearfix">'+
                        '<span class="name pull-left">{{ theme.name.ucFirst() }}</span>'+
                        '<span class="source pull-right">{{ theme.source }}</span>'+
                        '</figcaption>'+
                        '</figure>'+
                        '</div>'+
                        '<h2 ng-if="filteredThemes.length === 0">'+$translate.instant('noThemesFound')+'</h2>'
                    )($scope);


                    //el.find('#themes-list').innerHTML="";
                    //$('#themes-list').empty();
                //angular.element(document.querySelector('#themes-list')).empty();
                //if(!$scope.populated)
                //{
                    el.find('#themes-list').append(html);
                    $scope.populated = true;
                //}

                    deregister();
                //}
            });
        }
    };
}]);
