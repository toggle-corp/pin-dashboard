<?php get_header(); ?>

<div id="pin-dashboard" style="min-height: 540px; position: relative; z-index: 0">
    <div style="height: 540px; display: flex; align-items: center; justify-content: center;">
        Loading...
    </div>
</div>

<div id="content">
<?php
$category_ID = get_category_id('blog');

$args = array(
    'post_type' => 'post',
    'posts_per_page' => 3,
    'post__not_in' => $slider_arr,
    'cat' => '-' . $category_ID,
    'paged' => ( get_query_var('paged') ? get_query_var('paged') : 1)
);
query_posts($args);
$x = 0;
while (have_posts()) : the_post(); ?>                        

        <?php $post_box_last = ''; ?>

        <?php if($x == 2 || $x == 5 || $x == 8) { $post_box_last .= ' home_post_box_last'; } ?>
        <?php if($x == 2 || $x == 5 || $x == 8) { $post_box_last .= ' home_post_box_tablet_last'; } ?>

        <div class="home_post_box <?php echo $post_box_last; ?>">

            <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail('home-image'); ?></a>

            <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>

            <p><?php echo ds_get_excerpt('90'); ?></p>
        </div><!--//home_post_box-->

        <?php if($x == 2 || $x == 5) { ?>
            <div class="desktop_clear"></div>
        <?php } ?>

        <?php if($x == 2 || $x == 5 || $x == 8) { ?>
            <div class="tablet_clear"></div>
        <?php } ?>

    <?php $x++; ?>
    <?php endwhile; ?>        
    <?php wp_reset_query(); ?>                        
    <div class="clear"></div>
</div><!--//content-->
<?php get_footer(); ?>        
