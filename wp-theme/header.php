<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml">
<head> 
<link href='http://fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> 
  <title><?php wp_title('&laquo;', true, 'right'); ?> <?php bloginfo('name'); ?></title>          
  <?php wp_head(); ?>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <!--[if lt IE 9]>
  <script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>
  <![endif]-->                  
  <link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen" title="no title" charset="utf-8"/>
  <link href="https://fonts.googleapis.com/css?family=Oxygen+Mono" rel="stylesheet">
  <script src="<?php bloginfo('stylesheet_directory'); ?>/js/jquery-latest.js" type="text/javascript"></script>  
  <script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.js" type="text/javascript"></script>  
  <script src="<?php bloginfo('stylesheet_directory'); ?>/js/modernizr-2.6.1.min.js"></script>
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.css" />
</head>
<body>
<?php $shortname = "ultra_simple"; ?>
    <?php if(get_option($shortname.'_custom_background_color','') != "") { ?>
    <style type="text/css">
      body { background-color: <?php echo get_option($shortname.'_custom_background_color',''); ?>; }
    </style>
    <?php } ?>
<div id="header">
    <div class="social_cont">
        <ul>
          <?php if(get_option($shortname.'_pinterest_link','') != "") { ?>
              <li><a href="<?php echo get_option($shortname.'_pinterest_link',''); ?>"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/pinterest-icon.jpg" /></a></li>
          <?php } ?>
          <?php if(get_option($shortname.'_dribbble_link','') != "") { ?>
              <li><a href="<?php echo get_option($shortname.'_dribbble_link',''); ?>"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/dribbble-icon.jpg" /></a></li>
          <?php } ?>
          <?php if(get_option($shortname.'_google_plus_link','') != "") { ?>
              <li><a href="<?php echo get_option($shortname.'_google_plus_link',''); ?>"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/google-plus-icon.jpg" /></a></li>
          <?php } ?>
          <?php if(get_option($shortname.'_facebook_link','') != "") { ?>
              <li><a href="<?php echo get_option($shortname.'_facebook_link',''); ?>"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/facebook-icon.jpg" /></a></li>
          <?php } ?>
		  <?php if(get_option($shortname.'_instagram_link','') != "") { ?>
              <li><a href="<?php echo get_option($shortname.'_instagram_link',''); ?>"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/instagram-icon.jpg" /></a></li>
          <?php } ?>
          <?php if(get_option($shortname.'_twitter_link','') != "") { ?>
              <li><a href="<?php echo get_option($shortname.'_twitter_link',''); ?>"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/twitter-icon.jpg" /></a></li>
          <?php } ?>
        </ul>
        <div class="clear"></div>
    </div><!--//social_cont-->
    <div class="clear"></div>
    <div align="center">
    
        <?php if(get_option($shortname.'_custom_logo_url','') != "") { ?>
          <a href="<?php bloginfo('url'); ?>"><img src="<?php echo stripslashes(stripslashes(get_option($shortname.'_custom_logo_url',''))); ?>" class="logo" alt="logo" /></a>
        <?php } else { ?>
          <a href="<?php bloginfo('url'); ?>"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/logo.png" class="logo" alt="logo" /></a>
        <?php } ?>        
        
    </div>
    
    <div class="header_menu">
        <?php wp_nav_menu('menu=header_menu&container=false&menu_id=menu'); ?>
        <div class="clear"></div>
    </div><!--//header_menu-->
    
    <div class="clear"></div>
</div><!--//header-->
