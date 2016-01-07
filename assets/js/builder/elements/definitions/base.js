'use strict';

baseBuilderElements.push({
 	name: 'transparent background',
 	nodes: ['*'],
 	class: 'transparent-background',
 	frameworks: ['base', 'bootstrap'],
 	types: ['flow'],
 	validChildren: ['flow'],
 	draggable: false,
 	hiddenClasses: ['transparent-background'],
 	attributes: {
 		opacity: {
 			list: [
 				{name: '0.1', value: '.1'},
 				{name: '0.2', value: '.2'},
 				{name: '0.3', value: '.3'},
 				{name: '0.4', value: '.4'},
 				{name: '0.5', value: '.5'},
 				{name: '0.6', value: '.6'},
 				{name: '0.7', value: '.7'},
 				{name: '0.8', value: '.8'},
 				{name: '0.9', value: '.9'},
 				{name: '1', value: '1'}
 			],
 			value: '',
 			onAssign: function($scope) {
 				for (var i = this.list.length - 1; i >= 0; i--) {
 					if ($($scope.selected.node).css('background-color').indexOf(this.list[i].value) > -1) {
 						return this.value = this.list[i];
 					}
 				}

 				//if we didn't assign anything just default to not transparent
 				if (this.value === '') {
 					this.value = this.list[9];
 				}
 			},
 			onChange: function($scope, opa) {
 				$($scope.selected.node).css('background-color', 'rgba(0,0,0,'+opa.value+')');
 			}
 		}
 	}
});

baseBuilderElements.push({
	name: 'paragraph',
 	frameworks: ['base'],
 	nodes: ['p'],
 	html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '+
 	'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation'+
 	'ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in'+
 	'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non'+
 	'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
 	types: ['flow'],
 	validChildren: ['phrasing'],
 	category: 'typography',
    icon: 'paragraph'
});

baseBuilderElements.push({
	name: 'divider',
 	frameworks: ['base'],
 	nodes: ['hr'],
 	html: '<hr>',
 	types: ['flow'],
 	validChildren: false,
 	category: 'layout',
 	dragHelper: true,
    icon: 'divide-outline'
});

baseBuilderElements.push({
	name: 'marked text',
 	frameworks: ['base'],
 	nodes: ['mark'],
 	html: '<mark>Marked Text</mark>',
 	types: ['flow', 'phrasing'],
 	validChildren: ['phrasing'],
 	category: 'typography',
    icon: 'info-circled'
});

baseBuilderElements.push({
	name: 'definition list',
 	frameworks: ['base'],
 	nodes: ['dl'],
 	html: '<dl class="dl-horizontal">'+
		    '<dt>Description lists</dt>'+
		      '<dd>A description list is perfect for defining terms.</dd>'+
		      '<dt>Euismod</dt>'+
		      '<dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>'+
		      '<dd>Donec id elit non mi porta gravida at eget metus.</dd>'+
		      '<dt>Malesuada porta</dt>'+
		      '<dd>Etiam porta sem malesuada magna mollis euismod.</dd>'+
		      '<dt>Felis euismod semper eget lacinia</dt>'+
		      '<dd>Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</dd>'+
	      '</dl>',
 	types: ['flow', 'sectioning root'],
 	validChildren: ['dt', 'dd'],
 	category: 'typography',
 	previewScale: '0.4',
	scaleDragPreview: false,
    icon: 'menu-outline'
});

baseBuilderElements.push({
	name: 'google map',
	frameworks: ['base'],
	nodes: ['iframe'],
	html: '<div style="width:400px; height:400px"><iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="elements/map.html?lat={{$root.map.lat}}&lng={{$root.map.lng}}&zoom={{$root.map.zoom}}"></iframe></div>',
	//html: '<div google-map lat="0" lng="0"></div>',
	types: ['flow'],
	validChildren: ['flow'],
	category: 'components',
	previewScale: '0.5',
	scaleDragPreview: false,
	icon: 'google',
	onEdit: function ($scope) {
		$($scope.selected.node).attr('src', "elements/map.html?lat=43.3&lng=21.9");
	}
});

baseBuilderElements.push({
	name: 'blockqoute',
 	frameworks: ['base'],
 	nodes: ['blockqoute'],
 	html: '<blockquote>'+
  		    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>'+
  			'<footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>'+
		  '</blockquote>',
 	types: ['flow', 'sectioning root'],
 	validChildren: ['flow'],
 	category: 'typography',
 	previewScale: '0.5',
	scaleDragPreview: false,
    icon: 'quote'
});

baseBuilderElements.push({
	name: 'list item',
 	frameworks: ['base'],
 	nodes: ['li'],
 	html: '<li>A basic list item</li>',
 	types: ['li'],
 	validChildren: ['flow']
});

baseBuilderElements.push({
	name: 'unordered list',
 	frameworks: ['base'],
 	nodes: ['ul'],
 	html: '<ul><li>List item #1</li><li>List item #2</li><li>List item #3</li><ul>',
 	types: ['flow'],
 	validChildren: ['li'],
 	category: 'typography',
    icon: 'th-list'
});

baseBuilderElements.push({
	name: 'body',
 	frameworks: ['base'],
 	nodes: ['body'],
 	html: false,
 	draggable: false,
 	types: ['flow'],
 	validChildren: ['flow']
});

baseBuilderElements.push({
 	name: 'button',
 	frameworks: ['base'],
 	nodes: ['button'],
 	html: '<button class="btn btn-success">Click Me</button>',
 	types: ['flow', 'phrasing', 'interactive', 'listed', 'labelable', 'submittable', 'reassociateable', 'form-associated'],
 	validChildren: ['phrasing'],
 	category: 'buttons',
    icon: 'doc-landscape'
});

baseBuilderElements.push({
 	name: 'div container',
 	frameworks: ['base'],
 	nodes: ['div'],
 	html: '<div></div>',
 	types: ['flow'],
 	validChildren: ['flow'],
 	category: 'layout',
 	dragHelper: true,
 	previewScale: '0.7',
    icon: 'blank',
	onEdit: function($scope) {
		var iframe = $scope.selected.node.querySelector("iframe");
		if (iframe && $scope.selected.node.children[0] == iframe)
		{
			//$(iframe).attr("src", "elements/map.html?lat=" + $scope.map.lat + "&lng=" + $scope.map.lng);

			$scope.latLngEditor.removeClass('hidden');

			var left = 0, top = 0,
					pos = $scope.selected.node.getBoundingClientRect(),
					rightEdge = $('#viewport').width(),
					bottomEdge = $('#viewport').height(),
					leftEdge = $('#elements-container')[0].getBoundingClientRect(),
					linkerRight = pos.left + $scope.frameOffset.left + $scope.linker.width(),
					linkerTop  = pos.top + $scope.frameOffset.top + $scope.linker.height();

			//make sure linker doesn't go over right sidebar
			if (rightEdge.left < linkerRight) {
				left = pos.left - (linkerRight - rightEdge.left) - 40;
			} else {
				left = pos.left - ($scope.linker.width() - $scope.selected.node.offsetWidth)/2;
			}

			//position linker either above or below link dom element depending on space available
			if (bottomEdge < linkerTop) {
				top = pos.top - $scope.selected.node.offsetHeight - $scope.linker.height() - 10;
			} else {
				top = pos.top + $scope.selected.node.offsetHeight;
			}

			//make sure editor doesn't go under the left sidebar
			if (left < leftEdge.left) {
				left = leftEdge.left + 30;
			}

			$scope.latLngEditor.apply = function() { $(iframe).attr("src", "elements/map.html?lat=" + $scope.map.lat + "&lng=" + $scope.map.lng + "&zoom=" + $scope.map.zoom); };

			$scope.latLngEditor.css({ top: top, left: left});
		}
	}
});

baseBuilderElements.push({
 	name: 'heading',
 	nodes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
 	frameworks: ['base'],
 	html: '<h2>Heading</h2>',
 	types: ['heading', 'flow'],
 	validChildren: ['phrasing'],
 	category: 'typography',
    icon: 'header',
 	attributes: {
 		types: {
 			list: [
 				{name: 'h1', value: 'h1'},
 				{name: 'h2', value: 'h2'},
 				{name: 'h3', value: 'h3'},
 				{name: 'h4', value: 'h4'},
 				{name: 'h5', value: 'h5'},
 				{name: 'h6', value: 'h6'}
 			],
 			value: 'h1',
 			onAssign: function($scope) {
 				var name = $scope.selected.node.nodeName.toLowerCase();

 				for (var i = this.list.length - 1; i >= 0; i--) {
 					if (name == this.list[i].value) {
 						return this.value = this.list[i];
 					}
 				}
 			},
 			onChange: function($scope, tag) {
 				var name = tag.value;
 				$scope.selected.node = $('<'+name+'>'+$($scope.selected.node).html()+'</'+name+'>').replaceAll($scope.selected.node).get(0);
 				$scope.repositionBox('select');
 			}
 		}
 	}
});

baseBuilderElements.push({
 	name: 'icon',
 	nodes: ['i'],
 	frameworks: ['base', 'bootstrap'],
 	html: false,
 	types: ['flow', 'phrasing'],
 	validChildren: false,
 	category: false,
 	canDrag: true,
 	canModify: ['text', 'attributes'],
 	attributes: {
 		size: {
 			list: [
 				{name: 'Default', value: ''},
 				{name: 'Large', value: 'fa-lg'},
 				{name: '2x', value: 'fa-2x' },
 				{name: '3x', value: 'fa-3x' },
 				{name: '4x', value: 'fa-4x' },
 				{name: '5x', value: 'fa-5x' }
 			],
 			value: '',
 			onAssign: function($scope) {
 				for (var i = this.list.length - 1; i >= 0; i--) {
 					if ($scope.selected.node.className.indexOf(this.list[i].value) > -1) {
 						return this.value = this.list[i];
 					}
 				}
 			},
 			onChange: function($scope, size) {

 				//strip any previously assigned size classes from the icon
 				for (var i = this.list.length - 1; i >= 0; i--) {
 					$($scope.selected.node).removeClass(this.list[i].value);
 				};

 				$($scope.selected.node).addClass(size.value);
 			}
 		}
 	},
 	dragHelper: true
});

baseBuilderElements.push({
 	name: 'generic',
 	nodes: ['em', 'strong', 'u', 's', 'small'],
 	frameworks: ['base'],
 	html: false,
 	types: ['flow', 'phrasing'],
 	validChildren: false,
 	category: false,
 	canDrag: false,
 	canModify: ['text', 'attributes']
});

baseBuilderElements.push({
 	name: 'label',
 	nodes: ['label'],
 	frameworks: ['base'],
 	html: false,
 	types: ['flow', 'phrasing'],
 	validChildren: false,
 	category: false,
 	canDrag: false,
 	canModify: ['text', 'attributes']
});