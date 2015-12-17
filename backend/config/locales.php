<?php return array(


	//Name of the default locale to fallback if no other is selected by user
	'default' => 'en',

	//list of available locales, must have a matching translations file (name.yml) in
	//backend/translations folder.

	//To add new ones duplicate this line:
	//array('name' => 'en', 'flag' => 'United States of America (USA)'),
	//and change 'en' to your locales name and 'United States of America (USA)'
	//to flag icons name in assets/images/flags folder (no .png extension needed).
	'available' => array(
		array('name' => 'en', 'flag' => 'United States of America (USA)'),
		array('name' => 'fr', 'flag' => 'France'),
	),

);