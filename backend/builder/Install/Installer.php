<?php namespace Builder\Install;

use Silex\Application;
use Symfony\Component\Filesystem\Filesystem;
use Builder\Database\DatabaseServiceProvider;

class Installer {

	/**
	 * PHP Extensions and their expected state
	 * (enabled, disabled) in order for this 
	 * app to work properly.
	 * 
	 * @var array
	 */
	private $extensions = array(
		array('name' => 'fileinfo', 'expected' => true),
		array('name' => 'mbstring', 'expected' => true),
		array('name' => 'pdo', 'expected' => true),
		array('name' => 'pdo_mysql', 'expected' => true),
		array('name' => 'gd', 'expected' => true),
		array('name' => 'Mcrypt', 'expected' => true),
		array('name' => 'mysql_real_escape_string', 'expected' => false),
		array('name' => 'curl', 'expected' => true),
	);

	/**
	 * Directories that need to be writable.
	 * 
	 * @var array
	 */
	private $dirs = array('/assets/images/projects', '/assets/images/uploads', '/storage', 
		'/storage/exports', '/backend/storage/cache', '/backend/storage/logs', '/backend/config',
		'/backend/config/database.php', '/backend/config/installed.php', '/themes'
	);

	/**
	 * Fully qualified path to assets directory.
	 * 
	 * @var string
	 */
	private $assetPath;

	/**
	 * Symfony filesystem instance.
	 * 
	 * @var Symfony\Component\Filesystem\Filesystem
	 */
	private $fs;

	/**
	 * Silex application instance.
	 * 
	 * @var Silex\Application
	 */
	private $app;

	/**
     * Database seeder instance.
     * 
     * @var Builder\Install\Seeder
     */
    private $seeder;

    /**
     * Database schema creator instance.
     * 
     * @var Builder\Install\Schema
     */
    private $schema;

	/**
	 * Holds the compatability check results.
	 * 
	 * @var array
	 */
	private $compatResults = array('problem' => false);

	/**
	 * Create new Installer instance.
	 * 
	 * @param Application    $app     
	 * @param Filesystem     $fs      
	 * @param Seeder         $seeder  
	 * @param Schema         $schema  
	 * @param ProjectCreator $creator 
	 */
	public function __construct(Application $app, Filesystem $fs, Seeder $seeder, Schema $schema)
	{
		$this->fs = $fs;
		$this->app = $app;
		$this->schema = $schema;
        $this->seeder = $seeder;
	}

	/**
	 * Check for any issues with the server.
	 * 
	 * @return JSON
	 */
	public function checkForIssues()
	{
		$this->compatResults['extensions'] = $this->checkExtensions();
		$this->compatResults['folders']    = $this->checkFolders();
		$this->compatResults['phpVersion'] = $this->checkPhpVersion();

		return json_encode($this->compatResults);
	}

	/**
	 * Check if we've got required php version.
	 * 
	 * @return integer
	 */
	public function checkPhpVersion()
	{
		return version_compare(PHP_VERSION, '5.3.7');
	}

	/**
	 * Check if required folders are writable.
	 * 
	 * @return array
	 */
	public function checkFolders()
	{
		$checked = array();

		foreach ($this->dirs as $dir)
		{
		 	$path = $this->app['base_dir'].$dir;
		 	
		 	//if direcotry is not writable attempt to chmod it now
		 	if ( ! is_writable($path))
		 	{
		 		try {
		 			$this->fs->chmod($path, 0775, 0000, true);
		 		} catch (\Exception $e){}
		 	}

		 	$writable = is_writable($path);

		 	$checked[] = array('path' => $path, 'writable' => $writable);

		 	if ( ! $this->compatResults['problem']) {
		 		$this->compatResults['problem'] = $writable ? false : true;
		 	}		 	
		}
		
		return $checked;
	}

	/**
	 * Check for any issues with php extensions.
	 * 
	 * @return array
	 */
	private function checkExtensions()
	{
		$problem = false;

		foreach ($this->extensions as &$ext)
		{
			$loaded = extension_loaded($ext['name']);

			//make notice if any extensions status
			//doesn't match what we need
			if ($loaded !== $ext['expected'])
			{
				$problem = true;
			}

			$ext['actual'] = $loaded;
		}

		$this->compatResults['problem'] = $problem;

		return $this->extensions;
	}

	/**
	 * Store admin account and basic details in db.
	 * 
	 * @param  array  $input
	 * @return void
	 */
	public function createAdmin(array $input)
	{
		//create admin account
		$input['activated'] = 1;
		$input['permissions'] = array('superuser' => 1);

		$this->app['sentry']->createUser(array_except($input, 'confirmPassword'));

		$this->finalize();
	}

	/**
	 * Finalize the installation.
	 * 
	 * @return void
	 */
	private function finalize()
	{
		file_put_contents(
			$this->app['base_dir'].'/backend/config/installed.php', 
			'<?php return true;'
		);
	}

	/**
	 * Insert db credentials if needed, create schema and seed the database.
	 * 
	 * @param  array  $input
	 * @return void
	 */
	public function createDb(array $input)
	{
		//we'll skip inserting db credentials if user has done it manually already
		if ( ! isset($input['alreadyFilled']) || ! $input['alreadyFilled']) {
			$this->insertCredentials($input);
		}

		$this->openConnection($input);

		try {
			$this->schema->create();
			$this->seeder->seed();
		} catch (\Exception $e) {}
	}

	/**
	 * Open a database connection with given credentials.
	 * 
	 * @param  array  $input
	 * @return void
	 */
	private function openConnection(array $input)
	{
		if ( ! isset($input['driver'])) {
			$input['driver'] = 'mysql';
		}

		if ( ! isset($input['collation'])) {
			$input['collation'] = 'utf8_unicode_ci';
		}

		if ( ! isset($input['charset'])) {
			$input['charset'] = 'utf8';
		}
		
		$capsule = $this->app['illuminate.capsule'];
		$capsule->addConnection($input);
	}

	/**
	 * Insert user supplied db credentials into config file.
	 * 
	 * @param  array  $input
	 * @return void
	 */
	private function insertCredentials(array $input)
	{
		$config = file_get_contents($this->app['base_dir'].'/backend/config/database.php');

		//replace database credentials with user supplied ones
		foreach ($input as $key => $value)
		{	
			$config = preg_replace("/(.+?$key.+?=>.').*?(\',)/ms", '${1}'.$value.'${2}', $config);
		}
		
		//put new credentials in a config file
		file_put_contents($this->app['base_dir'].'/backend/config/database.php', $config);
	}
}