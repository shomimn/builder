angular.module('builder').factory('panels', function() {
    return {
        active: 'elements',
        open: function(name) {
            if (this.active === name) return;
            //var top = $('.main-nav [data-name="'+name+'"]').offset().top;
			var top = 0;
            $('.selected-tab').css('transform', 'translateY('+(top-121)+'px)');
            this.active = name;
        }
    };
});

angular.module('builder').controller('NavbarController', ['$scope', '$rootScope', '$timeout', '$state', '$translate', '$cookieStore', 'undoManager', 'settings', 'project', 'users', 'preview', 'codeEditors', 'panels', function($scope, $rootScope, $timeout, $state, $translate, $cookieStore, undoManager, settings, project, users, preview, codeEditors, panels) {

	$scope.settings = settings;
	$scope.undoManager = undoManager;
	$scope.project = project;
	$scope.state = $state;
	$scope.locales = JSON.parse(locales);
    $scope.activeCanvasSize = 'lg';
    $scope.devicesPanelOpen = false;
    $scope.codeEditors = codeEditors;
    $scope.panels = panels;

    $scope.toggleDevicesPanel = function() {
        $scope.devicesPanelOpen = !$scope.devicesPanelOpen;
    };

    $scope.toggleCodeEditor = function() {
        $('#code-editor-wrapper').toggle();
        codeEditors.currentlyOpen = !codeEditors.currentlyOpen;
    };

	$scope.logout = function() {
		users.logout();
	};

	$scope.openPanel = function(name) {
		$rootScope.activePanel = name;
		$rootScope.flyoutOpen = true;
	};

	$scope.preview = function() {
		preview.show();
	};

	$scope.isBoolean = function(value) {
		return typeof value !== 'boolean';
	};

	$scope.changeLocale = function(name) {
		$translate.use(name);
		$cookieStore.put('architect_locale', name.trim());
		$rootScope.selectedLocale = name;
	};

	$scope.resizeCanvas = function(size) {
        $scope.activeCanvasSize = size;

		switch (size) {
		    case 'xs':
		        $scope.frame.removeClass().addClass('xs-width');
		        break;
		    case 'sm':
		        $scope.frame.removeClass().addClass('sm-width');
		        break;
		    case 'md':
		       $scope.frame.removeClass().addClass('md-width');
		        break;
		    default:
		        $scope.frame.removeClass().addClass('full-width');
		}
		
		//wait 400 ms till css transition ends so we can
		//get an accurate offset
		$timeout(function(){
			$rootScope.frameOffset = $scope.frame.offset();
		}, 450);

		$scope.selectBox.hide();
		$scope.hoverBox.hide();
		$scope.textToolbar.addClass('hidden');
        $scope.contextMenu.hide();
        $scope.linker.addClass('hidden');
        if ($scope.colorPickerCont) { $scope.colorPickerCont.addClass('hidden') }
	};
	
	$scope.undo = function() {
		undoManager.undo();
	};
	$scope.redo = function() {
		undoManager.redo();
	};

    //hide panels that have fixed position on inspector panel close
    $scope.$watch('panels.active', function(newPanel, oldPanel) {
        if (oldPanel === 'inspector' && newPanel !== oldPanel) {
            $('#inspector .sp-container, #inspector #background-flyout-panel, #inspector .arrow-right').addClass('hidden');
        }
    })
}]);