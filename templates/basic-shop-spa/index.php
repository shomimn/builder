<?php

/*
|--------------------------------------------------------------------------
| Inlcude the composer autoloader.
|--------------------------------------------------------------------------
*/
require_once __DIR__.'/backend/vendor/autoload.php';
require_once __DIR__.'/backend/DatabaseProvider.php';
require_once __DIR__.'/backend/ProductModel.php';
require_once __DIR__.'/backend/ProductsController.php';
require_once __DIR__.'/backend/HomeController.php';
require_once __DIR__.'/backend/DBController.php';
require_once __DIR__.'/backend/Schema.php';

/*
|--------------------------------------------------------------------------
| Create new application instance.
|--------------------------------------------------------------------------
*/
$app = new Silex\Application();

$app['base_dir'] = __DIR__;
$app['debug'] = true;
date_default_timezone_set('Europe/Vilnius');

$app->before(function (Symfony\Component\HttpFoundation\Request $request, $app) {
    
    if ( ! isset($app['base_url'])) {
        $app['base_url'] = rtrim($request->getSchemeAndHttpHost().$request->getBaseUrl(), '/');
    }
    
    if (strpos($request->headers->get('Content-Type'), 'application/json') === 0) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

$app->register(new Silex\Provider\TwigServiceProvider(), array('twig.path' => __DIR__));
$app->register(new Silex\Provider\ServiceControllerServiceProvider());
$app->register(new Shop\Database\DatabaseServiceProvider());

$app['illuminate.capsule']->bootEloquent();
$app['illuminate.capsule']->setAsGlobal();

$app['db.controller'] = $app->share(function() use ($app)
{
    return new Shop\Database\DBController($app, new \Shop\Database\Schema);
});
$app['db.controller']->createDB();

$app['home.controller'] = $app->share(function() use ($app)
{
    return new Shop\Home\HomeController($app);
});

$app['products.controller'] = $app->share(function() use ($app)
{
    return new Shop\Products\ProductsController($app, $app['request'], new Shop\Products\ProductModel);
});

$app->get('/', 'home.controller:index');
$app->get('/products', 'products.controller:index');
$app->put('/products/{id}', 'products.controller:update');
$app->post('/products', 'products.controller:insert');
$app->delete('/products/{id}', 'products.controller:delete');

$app->post('/admin', function() use ($app)
{
    $admin = require_once $app['base_dir'].'/backend/config/admin.php';
    $input = $app['request']->request->all();
    
    if ($admin['username'] == $input['username'] &&
        $admin['password'] == $input['password'])
        return new Symfony\Component\HttpFoundation\Response(200);

//    return new Symfony\Component\HttpFoundation\Response(500);
});

$app->run();