<?php 
include('config.php');

$URL_Path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$URL_Parts = explode('/', trim($URL_Path, ' /'));
$page = array_shift($URL_Parts);	// always 'api'
$method = array_shift($URL_Parts);

if($page != 'api') error(1);

api_exec($method);
/* 
	Error list:

0 -> Incorrect method name
1 -> Internall error
2 -> Incorrect request

*/
function exception_handler($exception) {
  echo "Exception: " , $exception->getMessage(), "\n";
  error(1);
}
function error_handler($error){
	//echo "Exception: " , $error->getMessage(), "\n";
  	error(1);
}
set_exception_handler('exception_handler');
//set_error_handler('error_handler');

function error($num){
	global $error_list;
	$text = $error_list[$num];
	$response = array('error' => array('code' => $num, 'text' => $text));
	exit(json_encode($response, 128 | JSON_UNESCAPED_UNICODE));
}
function send_response($resp){
	$result = array('response' => $resp);
	echo json_encode($result, 128 | JSON_UNESCAPED_UNICODE);
}
	/* 
		Make query to data base
		 $type    		- type of query (SELECT, DELETE, UPDATE, INSERT)
		 $db_name 		- name of DB
		 $filds   		- what we take
		 $params  		- what we send [assoc array]('name' => 'John')
		 $custom_where 	- your WHERE part
		 $offset  		- from this element (default = 0)
		 $limit   		- to this element (default = 10)
		 $custom_query 	- your query
	*/
function pdo_query($type, $table_name, $fields, $params, $custom_where = null, $offset = 0, $limit = SEARCH_LIMIT, $custom_query = null){

		//echo "pdo_query";

		global $whitelist;	

		if(!isset($whitelist[$table_name])) error(1);
		if($custom_query) $query = $custom_query;
		else switch ($type) {
			case 'SELECT':
					if($fields != '*'){
						foreach ($fields as $key) if(!in_array($key, $whitelist[$table_name])) error(1);
						foreach ($params as $key => $value) if(!in_array($key, $whitelist[$table_name]) && $params !== '1') error(1);
					}
					$query = 'SELECT ';
					
					if($fields === '*') $query .= "*";
					else{
						foreach ($fields as $key) $query .= "`$key`,";
						$query = substr($query, 0, -1);
					}

					$query .= " FROM `$table_name` WHERE ";
					if($custom_where) $query .= $custom_where;
					elseif ($params === '1') $query .= '1';
					else{  
						foreach ($params as $key => $value){	
							if($key == 'category') 	{$query .= "`$key` LIKE :$key"; $params[$key] = '%'.$value.'%';}
							elseif($key == 'language'){
								$query .= '(';								
								for($i =0; $i < count($params[$key]); $i++ ){
									$new_index = $key . '_' . $i;
									$params[$new_index] = $params[$key][$i];
									$query .= "`$key` = :$new_index";
									$query .= ' OR ';
								}
								$query = substr($query, 0, -4);
								$query .= ')';
								unset($params[$key]);
							}
							else $query .= "`$key` = :$key";
							$query .= ' AND ';
						}
						$query = substr($query, 0, -5);
					}
					
					$query .= " LIMIT $offset, $limit;";
					
					break;
		
			case 'UPDATE':
					foreach ($fields as $key => $value) if(!in_array($key, $whitelist[$table_name])) error(1);
					foreach ($params as $key => $value) if(!in_array($key, $whitelist[$table_name]) && $params !== '1') error(1);

					$query = "UPDATE `$table_name` SET ";

					foreach ($fields as $key => $value) {
						if($key == 'new_password') $query .= "`password` = :new_password,";
						else $query .= "`$key` = :$key,";
					}
					$query = substr($query, 0, -1);

					$query .= " WHERE ";

					if($custom_where) $query .= $custom_where;
					elseif($params === '1') $query .= "1";
					else{
						foreach ($params as $key => $value)	$query .= "`$key` = :$key AND ";
						$query = substr($query, 0, -5);
					}

					if($params !== '1') $params = array_merge($params, $fields);
					else $params = $fields;

					break;

			case 'INSERT':
					foreach ($fields as $key => $value) if(!in_array($key, $whitelist[$table_name])) error(1); 

					$query = "INSERT INTO `$table_name` (";

					foreach ($fields as $key => $value) $query .= "`$key`,";
					$query = substr($query, 0, -1);
					$query .= ") VALUES (";
					foreach ($fields as $key => $value) $query .= ":$key,"; 
					$query = substr($query, 0, -1);
					$query .= ");";

					$params = $fields;
					break;

			case 'DELETE':
					$query = "DELETE FROM `$table_name` WHERE ";
					if($custom_where) $query .= $custom_where;
					else{
						foreach ($params as $key => $value) $query .= "`$key` = :$key AND ";
						$query = substr($query, 0, -5);
					}
					break;

			default: error(1);
		}

		//echo $query."<br>";
		//print_r($params);

		$dsn = "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=".DB_CHARSET;
		$opt = array(
		    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
		    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
		);
		$pdo = new PDO($dsn, DB_USER, DB_PASS, $opt);

		$stmt = $pdo->prepare($query);
		if($params !== '1') $stmt->execute($params);
		else $stmt->execute();

		//print_r($stmt->fetchAll());
		$er = $stmt->errorInfo();
		if($er[1] != null) return false;
		elseif($type == 'SELECT') return $stmt->fetchAll();
		else return true;
}

//TODO: DDOS protection (https://www.simplemachines.ru/index.php?topic=10629.0)
function api_exec($p, $mode = 'site'){
	global $modules_whitelist; 
	if(!$p) return;
	
	$p = validate_form($p);
	$exp = explode('.', $p);

	$module = $exp[0];
	$func = $exp[1];

	if(!isset($modules_whitelist[$module]) || !in_array($func, $modules_whitelist[$module])) error(0);

	include_once('modules/'.$module.'.php');


	if(function_exists($func)) $response = call_user_func($func);
	else error(0);

	send_response($response);
}

function validate_form($str){
	return nl2br(htmlspecialchars(trim($str)));
}
?>