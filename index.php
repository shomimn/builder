<?php

/*
|--------------------------------------------------------------------------
| Inlcude the composer autoloader.
|--------------------------------------------------------------------------
*/
require_once __DIR__.'/backend/vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Create new application instance.
|--------------------------------------------------------------------------
*/
$app = new Silex\Application();

$app['base_dir'] = __DIR__;
$app['debug'] = true;
$app['version'] = '1.6';
$app['reset_interval'] = 60;
$app['is_demo'] = gethostname() === 'vebto-main' ? 1 : 0; //needs to be integer for easier conversion to js
date_default_timezone_set('Europe/Vilnius');

/*
|--------------------------------------------------------------------------
| Register service providers.
|--------------------------------------------------------------------------
*/

$app->register(new Silex\Provider\TwigServiceProvider(), array('twig.path' => __DIR__.'/views'));
$app->register(new Silex\Provider\ServiceControllerServiceProvider());
$app->register(new Builder\Database\DatabaseServiceProvider());
$app->register(new Builder\Users\SentryServiceProvider());
$app->register(new Builder\Projects\Services\ProjectCreatorServiceProvider());

$app->register(new Silex\Provider\MonologServiceProvider(), array(
    'monolog.logfile' => __DIR__.'/backend/storage/logs/silex.log', 'monolog.level' => 'WARNING',
));

/*
|--------------------------------------------------------------------------
| Handle locales.
|--------------------------------------------------------------------------
*/

$app['locales'] = require_once(__DIR__.'/backend/config/locales.php');
$app['jsLocales'] = json_encode($app['locales']);
$app['selectedLocale'] = isset($_COOKIE['architect_locale']) ? preg_replace("/[^A-Za-z0-9 ]/", '', $_COOKIE['architect_locale']) : $app['locales']['default'];

$app->register(new Silex\Provider\TranslationServiceProvider(), array(
    'locale_fallbacks' => array($app['locales']['default']),
    'locale' => $app['selectedLocale'],
));

$app['translator'] = $app->share($app->extend('translator', function($translator, $app) {
    $translator->addLoader('yaml', new Symfony\Component\Translation\Loader\YamlFileLoader());

    foreach ($app['locales']['available'] as $locale) {
        $path = __DIR__.'/backend/translations/'.$locale['name'].'.yml';

        if (file_exists($path)) {
            $translator->addResource('yaml', $path, $locale['name']);
        }
    }

    return $translator;
}));

$trans = $app['translator']->getMessages($app['selectedLocale']);
$app['translations'] = json_encode($trans['messages']);

try {
    $app['keys'] = json_encode(require_once($app['base_dir'].'/backend/config/keys.php'));
} catch (Exception $e) {
    $app['keys'] = json_encode(array());
}

/*
|--------------------------------------------------------------------------
| Check whether the architect is already installed or not.
|--------------------------------------------------------------------------
*/
$app['installed'] = require_once $app['base_dir'].'/backend/config/installed.php';

/*
|--------------------------------------------------------------------------
| Do any needed work before the response is sent back.
|--------------------------------------------------------------------------
*/
$app->before(function (Symfony\Component\HttpFoundation\Request $request, $app) {
    
    if ( ! isset($app['base_url'])) {
        $app['base_url'] = rtrim($request->getSchemeAndHttpHost().$request->getBaseUrl(), '/');
    }
    
    if (strpos($request->headers->get('Content-Type'), 'application/json') === 0) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

/*
|--------------------------------------------------------------------------
| Architect is not yet installed, register install controller and routes.
|--------------------------------------------------------------------------
*/
if ( ! $app['installed']) {

    $app['install.controller'] = $app->share(function() use ($app) { 
        $installer = new Builder\Install\Installer($app, new Symfony\Component\Filesystem\Filesystem, new Builder\Install\Seeder($app, $app['projects.creator']), new Builder\Install\Schema);
        return new Builder\Install\InstallController($app, $installer); 
    });

    $app->get('/', 'install.controller:index');
    $app->post('/check-compat', 'install.controller:compat');
    $app->post('/create-db', 'install.controller:createDb');
    $app->post('/create-admin', 'install.controller:createAdmin');
} 

/*
|--------------------------------------------------------------------------
| Architect is already installed, finish bootstraping and run the app.
|--------------------------------------------------------------------------
*/
else {
    $demoFilter = function ($request, $app) {
        if ($app['is_demo']) {
            return new Symfony\Component\HttpFoundation\Response('Sorry, Exports are disabled on demo site.', 403);
        }
    };

    $loggedInFilter = function ($request, $app) {
        if ( ! $app['sentry']->check()) {
            return new Symfony\Component\HttpFoundation\Response($app['translator']->trans('notLoggedIn'), 403);
        }
    };
 
    $app->register(new Silex\Provider\ValidatorServiceProvider());
    $app->register(new Builder\Projects\Services\ProjectRepositoryServiceProvider());
    $app->register(new Builder\Filesystem\FilesystemServiceProvider());
    $app->register(new Builder\Filesystem\Images\ImagesSaverServiceProvider());

   try {
        $app['settings'] = $app['illuminate.db']->table('settings')->lists('value', 'name');
        $app['settingsJSON'] = json_encode($app['settings']);
   } catch (Exception $e) {
        $app['settings'] = array();
        $app['settingsJSON'] = json_encode($app['settings']);
   }

   require_once __DIR__.'/backend/builder/routes.php';
}

/*
|--------------------------------------------------------------------------
| Register error handlers
|--------------------------------------------------------------------------
*/
$app->error(function (\Exception $e, $code) use($app) {

    if ( ! isset($app['base_url'])) {
        $app['base_url'] = rtrim($app['request']->getSchemeAndHttpHost().$app['request']->getBaseUrl(), '/');
    }

    if ($code === 404) {
        return new Symfony\Component\HttpFoundation\Response($app['twig']->render('404.twig.html'));
    }

    if ($app['is_demo'] && $app['installed']) {

	    $user = $app['sentry']->getUser();

	    $client = new Raven_Client('');
	    
	    if ($user) {
	    	$client->user_context($user->toArray());
	    }

	    $client->captureException($e);
	}
});

$app->run();