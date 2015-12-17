<?php namespace Builder\Install;

use PDO;
use Silex\Application;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Capsule\Manager as Capsule;

class InstallController {

    /**
     * Application instance.
     * 
     * @var Silex\Application
     */
    private $app;

    /**
     * Installer instance.
     * 
     * @var Builder\Install\Installer
     */
    private $installer;

    private $input;

    /**
     * Create new InstallController instance.
     * 
     * @param Application $app    
     * @param Seeder      $seeder
     */
	public function __construct(Application $app, Installer $installer)
	{
		$this->app = $app;
        $this->installer = $installer;
        $this->input = $app['request']->request;
	}

    public function index()
    {
        return $this->app['twig']->render('install/main.html');
    }

    /**
     * Check for any compatability issues.
     * 
     * @return array
     */
    public function compat()
    {
        return $this->installer->checkForIssues();
    }

    public function seed()
    {
        $this->installer->seed();
    }

    /**
     * Create database schema.
     * 
     * @return Response
     */
    public function createDb()
    {
        $input = $this->input->all();
        
        if ( ! $this->input->get('alreadyFilled'))
        {
            $db =  'mysql:host='.$input['host'].';dbname='.$input['database'];
        
            //test db connection with user supplied credentials
            try {
                $conn = new PDO($db, $input['username'], $input['password']);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch(\PDOException $e) {
                return new Response($e->getMessage(), 403);
            }
        }

        //create database schema
        try {
            $this->installer->createDb($input);
        } catch (Exception $e) {
            return new Response($e->getMessage(), 500);
        }

        return new Response('Database created and seeded successfully.', 200);   
    }

    /**
     * Store basic site information and admin account
     * details to database.
     * 
     * @return array
     */
    public function createAdmin()
    {
        if ( ! $this->input->get('email')) {
            return new Response('Email field is required', 403);
        }

        if ( ! $this->input->get('password')) {
            return new Response('Password field is required.', 403);
        }

        if ($this->input->get('password') !== $this->input->get('confirmPassword')) {
            return new Response('Password do not match.', 403);
        }

        try {
            $this->installer->createAdmin($this->input->all());
        } catch (Exception $e) {
            return new Response($e->getMessage(), 500);
        }

        $user = $this->app['sentry']->authenticate(array_except($this->input->all(), 'confirmPassword'), true);
        
        $response = new Response($user, 200);
        $response->headers->setCookie(new Cookie('blUser', $user, 0, '/', null, false, false));

        return $response;
    }
}