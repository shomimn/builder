angular.module('builder.inspector')

.directive('blToggleElementLock', function() {
	return {
		restrict: 'A',
		link: function($scope, el, attrs, controller) {
			el.on('click', function(e) {
		
				$scope.$apply(function() {

					//unlock
					if ($scope.selected.locked) {
						$($scope.selected.node).removeClass('locked');
						$scope.selected.locked = false;

					//lock
					} else {
						$($scope.selected.node).addClass('locked');
						$scope.selected.locked = true;
					}
				});

				return false;
			});
		}
	};
})

.directive('blToggleFollowLink', function($rootScope, project) {
	return {
		restrict: 'A',
		link: function($scope, el, attrs, controller) {
			el.on('click', function(e) {

				$scope.$apply(function() {

					var frame = $rootScope.frame[0];
					var href = $($scope.selected.node).attr('href');

					if (!href && $scope.selected.node.dataset.target && $scope.selected.node.dataset.toggle)
					{
						$($rootScope.frameDoc.querySelector($scope.selected.node.dataset.target)).collapse('toggle');
					}
					else
					{
						var i = href.indexOf('html');
						if (i > -1)
						{
							var page = href.substring(0, i - 1);
							project.changePage(page);
						}
						else
						{
							var innerDoc = frame.contentDocument || frame.contentWindow.document;
							var element = innerDoc.getElementById(href.substring(1));
							if (element)
							{
								$('#navBar').addClass('navbar-fixed-top');
								element.scrollIntoView();
								$('#navBar').removeClass('navbar-fixed-top');
							}
						}
					}
				});

				return false;
			});
		}
	};
});

