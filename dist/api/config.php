<?php

$whitelist = array(
	'links' => array('id','title','link','type','category','language','views','date')	    	
);

$error_list = array(
	0 => "Incorrect method name",
	1 => "Internal error",
	2 => "Incorrect request"
);

$modules_whitelist = array(
	'application' => array('getConfig', 'getAllParameters', 'getByCategory')
);

$categories = array(
	'Android', 'Java', 'Python', 'iOS', 'HTML5 / CSS3', 'Game Developer', 'Web Design', 'Ruby', 'C#', 'C++', 'PHP', 'SMM', 'SEO'
);

$parameters = array(
	'languages' => array('en', 'ru', 'it')
);


define("DB_HOST", "127.0.0.1:3306");
define("DB_USER", "root");
define("DB_PASS", "");
define("DB_NAME", "smart-it-db");
define("DB_CHARSET", "utf8");

define('SITE_NAME', "Smart-IT");
define("MAIN_URL", "http://smart-it.com");
define("EMAIL_ADRESS", "smart-it.com");

define("SEARCH_LIMIT", 12);

?>