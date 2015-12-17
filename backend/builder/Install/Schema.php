<?php namespace Builder\Install;

use Illuminate\Database\Capsule\Manager as Capsule;
use Silex\Application;

class Schema {

    public function create()
    {
        Capsule::schema()->create('folders', function($table)
        {
            $table->increments('id');
            $table->string('name');
            $table->integer('user_id');
            $table->timestamps();

            $table->engine = 'InnoDB';
            $table->unique(array('name', 'user_id'));
        });

        Capsule::schema()->create('groups', function($table)
        {
            $table->increments('id');
            $table->string('name');
            $table->text('permissions')->nullable();
            $table->timestamps();

            $table->engine = 'InnoDB';
            $table->unique('name');
        });

        Capsule::schema()->create('images', function($table)
        {
            $table->increments('id');
            $table->integer('user_id')->index();
            $table->string('display_name');
            $table->string('file_name');
            $table->timestamps();

            $table->engine = 'InnoDB';
            $table->unique(array('user_id', 'display_name'));
        });

        Capsule::schema()->create('images_folders', function($table)
        {
            $table->increments('id');
            $table->integer('image_id')->index();
            $table->string('folder_id')->index();
            $table->string('file_name');
            $table->timestamps();

            $table->engine = 'InnoDB';
            $table->unique(array('image_id', 'folder_id'));
        });

        Capsule::schema()->create('libraries', function($table)
        {
            $table->increments('id');
            $table->string('name');
            $table->string('path');
            $table->string('type')->default('public');
            $table->integer('user_id')->nullable()->index();
            $table->timestamps();

            $table->engine = 'InnoDB';
            $table->unique('name');
        });

        Capsule::schema()->create('pages', function($table)
        {
            $table->increments('id');
            $table->string('name', 150);
            $table->text('html')->nullable();
            $table->text('css')->nullable();
            $table->text('js')->nullable();
            $table->string('theme')->default('default');
            $table->integer('pageable_id')->index();
            $table->string('pageable_type', 50)->default('Project');
            $table->string('description')->nullable();
            $table->string('tags')->nullable();
            $table->string('title')->nullable();
            $table->text('libraries')->nullable();
            $table->timestamps();

            $table->engine = 'InnoDB';
            $table->unique(array('name', 'pageable_type', 'pageable_id'),  'name_ptype_pid');
        });

        Capsule::schema()->create('pages_libraries', function($table)
        {
            $table->increments('id');
            $table->integer('page_id')->index();
            $table->integer('library_id')->index();
            $table->timestamps();

            $table->engine = 'InnoDB';
            $table->unique(array('page_id', 'library_id'));
        });

        Capsule::schema()->create('projects', function($table)
        {
            $table->increments('id');
            $table->string('name');
            $table->boolean('published')->default(1);
            $table->boolean('public')->default(0);
            $table->timestamps();

            $table->engine = 'InnoDB';
            $table->unique('name');
        });

        Capsule::schema()->create('templates', function($table)
        {
            $table->increments('id');
            $table->string('name');
            $table->text('html')->nullable();
            $table->text('css')->nullable();
            $table->string('theme')->nullable();
            $table->integer('user_id')->index();
            $table->string('thumbnail');
            $table->string('color')->nullable();
            $table->string('category')->nullable();
            $table->timestamps();

            $table->engine = 'InnoDB';
            $table->unique(array('user_id', 'name'));
        });

        Capsule::schema()->create('themes', function($table)
        {
            $table->increments('id');
            $table->string('name');
            $table->string('path');
            $table->text('custom_less')->nullable();
            $table->string('modified_vars')->nullable();
            $table->string('type')->default('private');
            $table->string('source')->nullable();
            $table->integer('user_id')->index();
            $table->timestamps();

            $table->engine = 'InnoDB';
            $table->unique('name');
        });

        Capsule::schema()->create('throttle', function($table)
        {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->nullable();
            $table->string('ip_address')->nullable();
            $table->integer('attempts')->default(0);
            $table->boolean('suspended')->default(0);
            $table->boolean('banned')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamp('suspended_at')->nullable();
            $table->timestamp('banned_at')->nullable();

            $table->engine = 'InnoDB';
            $table->index('user_id');
        });

        Capsule::schema()->create('users', function($table)
        {
            $table->increments('id');
            $table->string('email');
            $table->string('password');
            $table->text('permissions')->nullable();
            $table->boolean('activated')->default(0);
            $table->string('activation_code')->nullable();
            $table->timestamp('activated_at')->nullable();
            $table->timestamp('last_login')->nullable();
            $table->string('persist_code')->nullable();
            $table->string('reset_password_code')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->timestamps();

            $table->engine = 'InnoDB';
            $table->unique('email');
            $table->index('activation_code');
            $table->index('reset_password_code');
        });

        Capsule::schema()->create('users_groups', function($table)
        {
            $table->integer('user_id')->unsigned();
            $table->integer('group_id')->unsigned();

            $table->engine = 'InnoDB';
            $table->primary(array('user_id', 'group_id'));
        });

        Capsule::schema()->create('users_projects', function($table)
        {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->index();
            $table->integer('project_id')->unsigned()->index();

            $table->engine = 'InnoDB';
            $table->unique(array('user_id', 'project_id'));
        });

        if ( ! Capsule::schema()->hasTable('settings')) {
            Capsule::schema()->create('settings', function($table)
            {
                $table->increments('id');
                $table->string('name');
                $table->text('value');
                $table->timestamps();

                $table->engine = 'InnoDB';
                $table->unique('name');
            });
        }
    }
}