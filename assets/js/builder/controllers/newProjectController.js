angular.module('builder')

.controller('NewProjectController', ['$scope', '$http', '$state', 'templates', '$upload','settings','$rootScope', function($scope, $http, $state, templates, $upload, settings, $rootScope) {

	$scope.templates = templates;
	$scope.settings = settings;
	$scope.settings.wizard = settings.wizard;
	$scope.filters = { category: '', color: '' };
	var map;
	var marker;
	//modal cache
	$scope.modal = $('#project-name-modal');
	$scope.error = $scope.modal.find('.error');

	//clear input and errors when modal is closed
	$scope.modal.off('hidde.bs.modal').on('hidde.bs.modal', function (e) {
		$scope.error.html('');
		$scope.$apply(function() { $scope.settings.wizard.name = ''; });
	});

	$scope.templates.getAll();

	$scope.showNameModal = function(template) {
		$scope.selectedTemplate = template;
		if($scope.settings.wizard != undefined){

		}
		$scope.modal.modal('show');
	};
	function initMap()
	{
		var lat = 0.0;
		var lng = 0.0;
		var zoom = 8;
		//var latLng = {lat: lat, lng: lng};
		if($("#map").html() === ""){
			map = new google.maps.Map($("#map")[0], {
				center: new google.maps.LatLng(lat, lng),
				zoom: zoom,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lng),
				map: map
			});
			google.maps.event.addListener(map, 'center_changed', function () {
				marker.setPosition(map.center);
			});
		}
	}

	//$('#map').on('shown', function () {
	//
	//});
	$scope.openMediaManager = function ()
	{
		//$scope.modal.modal('hide');
		if($scope.settings.wizard== undefined)
		{
			$scope.error.html("A name is required for a project.");
		}
		else {
			$scope.modal.modal('hide')
				.on('hidden.bs.modal', function (e){
					$('#images-modal').data('type',"logo");

					$('#images-modal').modal('show')
						.on('show.bs.modal', function(e){

						})
						.on('hidden.bs.modal', function (e){

							$scope.modal.modal('show');


						})
					;
					$(this).off('hidden.bs.modal');
				});

		}



	};

	$scope.cancelNewProject = function ()
	{
		$("#wizard_type").html("Basic Info");
		$('.basicinfo').css('display','inline');
		$('.accountsinfo').css('display','none');
		$('.contactinfo').css('display','none');
		$('.text-danger').html("");
		$('.mapinfo').css('display','none');
		$('#wizard_button').html("Next");
		$("#progressindicator>li.active").removeClass("active");
		$("#basicinfo").addClass("active");
	};
	$scope.createNewProject = function() {
		switch ($("#progressindicator>li.active").attr("id"))
		{
			case "basicinfo":
				$("#basicinfo").addClass("completed");
				$('#accountsinfo').click();
				break;
			case "accountsinfo":
				$("#accountsinfo").addClass("completed");
				$('#contactinfo').click();
				break;
			case "contactinfo":
				$("#contactinfo").addClass("completed");
				$('#mapinfo').click();
				break;
			default:
				if($scope.settings.wizard != undefined)
					var payload = { name: $scope.settings.wizard.name };
				else
				 var payload = { name: undefined};
				$rootScope.map.lat = marker.getPosition().lat();
				$rootScope.map.lng = marker.getPosition().lng();
				$rootScope.map.zoom = map.zoom;
				$scope.loading = true;

				if ($scope.selectedTemplate) {
					payload.template = $scope.selectedTemplate.id;
				}

				$http.post('projects', payload).success(function() {
					if($scope.settings.wizard != undefined)
						var name = { name: $scope.settings.wizard.name };
					else
						var name = { name: undefined};

					$scope.error.html('');
					$scope.settings.wizard.name = '';
					$scope.selectedTemplate = false;

					$scope.modal.modal('hide').off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
						$state.go('builder', {name: name});
					});

				}).error(function(data) {
					$scope.error.html(data);
				}).finally(function() {
					$scope.loading = false;
				});

				break;
		}

	};
	$("#progressindicator li").click(function(){
		$("#project_wizard").find("." + $("#progressindicator>li.active").attr("id")).hide();
		$("#progressindicator>li.active").removeClass("active");
		$(this).addClass("active");
		$("#project_wizard").find("." + $("#progressindicator>li.active").attr("id")).show();
		if($(this).attr("id") == "mapinfo" )
		{
			$('#wizard_button').html("Finish");
			if(map == undefined) {
				$('.mapinfo').css('display', 'inline-block');


				//if(map == undefined)
				initMap();
				google.maps.event.trigger(map, 'resize');
			}
		}
		else $('#wizard_button').html("Next");
	});
	function changeWizard(){

	}
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