<?php


/*


  Template Name: Blog


*/


?>


<?php get_header(); ?>





<div id="content">





    <div id="single_cont">


    


        <div id="single_content">


        


            <?php


            $args = array(


                         'category_name' => 'blog',


                         'post_type' => 'post',


                         'posts_per_page' => 4,


                         'paged' => ( get_query_var('paged') ? get_query_var('paged') : 1)


                         );


            query_posts($args);


            while (have_posts()) : the_post(); ?>                                            


            


                <div class="blog_box">


                


                    <div class="blog_box_img">


                        <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail('blog-image'); ?></a>


                    </div><!--//blog_box_img-->


                


                    <div class="blog_box_right">


                        <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>


                        


                        <?php if(strstr($_SERVER['HTTP_USER_AGENT'],'iPod')) { ?>


                            <p><?php echo ds_get_excerpt('150'); ?></p>


                        <?php } else { ?>


                            <p><?php echo ds_get_excerpt('250'); ?></p>


                        <?php } ?>


                        


                        <div class="blog_box_meta">


                            <?php the_category(', '); ?> / <?php the_time('m-d-Y'); ?> / <?php comments_popup_link('No Comments &gt;&gt;', '1 Comment &gt;&gt;', '% Comments &gt;&gt;'); ?>


                        </div><!--//blog_box_meta-->


                    </div><!--//blog_box_right-->


                    


                    <div class="clear"></div>


                


                </div><!--//blog_box-->            


            


            


            <?php endwhile; ?>                                                            


            


                <div class="blog_nav">


                


                    <div class="left"><?php previous_posts_link(' ') ?></div>


                    <div class="right"><?php next_posts_link(' ') ?></div>


                    <div class="clear"></div>


                


                </div><!--//blog_nav-->            


            


            <?php wp_reset_query(); ?>                        


        





        


        </div><!--//single_content-->


        


        <?php get_sidebar(); ?>


        


        <div class="clear"></div>


    


    </div><!--//single_cont-->





</div><!--//content-->





<?php get_footer(); ?>        