<?
/*
	Method: getConfig
*/
function getAllParameters(){
	global $categories, $parameters;
	natcasesort($categories);
	
	$cat = array();
	$i = 0;
	foreach($categories as $item){
		$cat[$i] = $item;
		$i++;
	}
	
	return array('result' => array('playlists' => $cat, 'parameters' => $parameters ));
}

/*
	Method: getByCategory
*/
function getByCategory(){	
	global $categories, $parameters;
	
	$cat_name = validate_form($_POST['category']);
	$offset = validate_form($_POST['offset']);
	$params = ($_POST['parameters']);
	
	$params = json_decode($params, true);
	$offset = ($offset) > 0 ? $offset : 0;
	$langs = $params['languages'];	
	
	$cat = -1;
	if(in_array($cat_name, $categories)){
		$cat = array_search($cat_name, $categories);	
	}
	
	if($cat == -1 || !$langs || $offset < 0) error(2);
	
	$res = pdo_query('SELECT', 'links', '*', array('category' => $cat, 'language' => $langs), null, $offset);
	
	//$res = array(array('link' => 'https://cs4-3v4.vk-cdn.net/p6/bccc25fb70a1.480.mp4?extra=Vt5dPLqJaPh7-aNzze0wNwnMZDah8qYrfj8JleL-A-cpdLc9eL-WaTv7wi237ba4ePsRN4aZwPgj40SAQ-sT8jXk4Lo06p7m6rxUwCnXyHNDDVBE5R26OmsmjM5JjX3WnovbBd64pFl9ukE' , 'title' => '1', 'type' => 'hsl'), array('link' => 'https://pcprogschool.cdnvideo.ru/progschool/records/000/003/378/d22031be3729a5aa99d814c08f7e405c51beaca7.mp4?1476170010' , 'title' => '2', 'type' => 'vod'));
	
	return array('result' => $res);
	
}
?>