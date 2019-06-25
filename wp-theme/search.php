<?php get_header(); ?>





<div id="content">





    <?php


    $args = array_merge( $wp_query->query, array( 'posts_per_page' => 9 ));


    query_posts( $args );        


    $x = 0;


    while (have_posts()) : the_post(); ?>                        


    


        <?php if($x == 2 || $x == 5 || $x == 8) { ?>


        <div class="home_post_box home_post_box_last">


        <?php } else { ?>


        <div class="home_post_box">


        <?php } ?>


        


            <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail('home-image'); ?></a>


            


            <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>


            


            <p><?php echo ds_get_excerpt('150'); ?></p>


        </div><!--//home_post_box-->


        


        <?php if($x == 2 || $x == 5 || $x == 8) { ?>


            <div class="desktop_clear"></div>


        <?php } ?>


    


    <?php $x++; ?>


    <?php endwhile; ?>        


    


    <div class="clear"></div>


    


    <div class="archive_nav">


        <div class="left"><?php previous_posts_link('&lt;&lt; Previous Page') ?></div>


        <div class="right"><?php next_posts_link('Next Page &gt;&gt;') ?></div>


        


        <div class="clear"></div>


    </div><!--//archive_nav-->


    


    <?php wp_reset_query(); ?>                        





    <div class="clear"></div>





</div><!--//content-->





<?php get_footer(); ?>        