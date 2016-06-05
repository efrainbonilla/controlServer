#frontend:

ng_admin_install:
	git clone https://github.com/marmelab/ng-admin.git web/ng-admin


backend: db_engine_reverse

db_engine_reverse:
	# precaution ovewrite changes in entities
	# transform structure database in class PHP entities
	app/console doctrine:mapping:import AppBundle annotation

	# generate getter setter in entities
	app/console doctrine:generate:entities AppBundle

rest_generate:
	# app/console generate:voryx:rest --entity AppBundle:Entity
	app/console generate:voryx:rest

	# app/console generate:doctrine:form AppBundle:Entity

translation_generate:
	app/console bazinga:js-translation:dump


db_database_create:
	app/console doctrine:database:create

db_database_drop:
	app/console doctrine:database:drop --force

db_schema_drop:
	app/console doctrine:schema:drop --force

db_schema_create:
	app/console doctrine:schema:create

db_schema_update:
	app/console doctrine:schema:update --force


fos_user_create:
	app/console fos:user:create admin admin@gmail.com 123456 --super-admin
	app/console fos:user:activate admin

data_fixtures_load:
	app/console doctrine:fixtures:load

app_install: clear db_database_create db_schema_create data_fixtures_load clear

app_uninstall: db_database_drop clear

ifeq ($(OS),Windows_NT)

clear:
	app/console cache:clear

else

clear:
	app/console cache:clear
	# sudo rm -rf app/cache/*
	# sudo rm -rf app/logs/*

	sudo chmod 777 -R app/cache
	sudo chmod 777 -R app/logs
	sudo chmod 777 -R app/console
endif


