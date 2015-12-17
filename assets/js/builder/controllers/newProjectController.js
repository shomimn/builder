angular.module('builder')

.controller('NewProjectController', ['$scope', '$http', '$state', 'templates', '$upload', function($scope, $http, $state, templates, $upload) {

	$scope.templates = templates;

	$scope.filters = { category: '', color: '' };

	//modal cache
	$scope.modal = $('#project-name-modal');
	$scope.error = $scope.modal.find('.error');

	//clear input and errors when modal is closed
	$scope.modal.off('hidde.bs.modal').on('hidde.bs.modal', function (e) {
		$scope.error.html('');	
		$scope.$apply(function() { $scope.name = ''; });
	});	

	$scope.templates.getAll();

	$scope.showNameModal = function(template) {
		$scope.selectedTemplate = template;
		$scope.modal.modal('show');
	};

	$scope.createNewProject = function() {
		var payload = { name: $scope.name };

        $scope.loading = true;
		
		if ($scope.selectedTemplate) {
			payload.template = $scope.selectedTemplate.id;
		}

		$http.post('projects', payload).success(function() {
			var name = $scope.name;

			$scope.error.html('');
			$scope.name = '';
			$scope.selectedTemplate = false;
			
			$scope.modal.modal('hide').off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
				$state.go('builder', {name: name});
			});	

		}).error(function(data) {
			$scope.error.html(data);
		}).finally(function() {
		    $scope.loading = false;
		})
	};

	$scope.back = function()
	{
		$state.go("home");
	};

}])

.directive('blNewProjectColorSelector', function() {
    return {
   		restrict: 'A',
      	link: function($scope, el) {
      		el.on('click', 'li', function(e) {
      			var li = $(e.currentTarget);

      			el.find('li').not(li).removeClass('active');

      			if (li.hasClass('active')) {
      				li.removeClass('active');
      				$scope.$apply(function() { $scope.filters.color = ''; });
      			} else {
      				li.addClass('active');
      				$scope.$apply(function() { $scope.filters.color = li.data('color'); });
      			}
      		});
      	}
    }
})