<?php


/*


  Template Name: Blog


*/


?>


<?php get_header(); ?>





<div id="content">





    <div id="single_cont">


    


        <div id="single_content">


        


            <?php if (have_posts()) : while (have_posts()) : the_post(); ?>          
        


                <h1 class="single_title"><?php the_title(); ?></h1>
                <div class="single_content">
        


                <?php the_content(); ?>
        
                </div><!--//single_content-->


                <br /><br />
        


                <?php //comments_template(); ?>
        


            <?php endwhile; else: ?>
        


                <h3>Sorry, no posts matched your criteria.</h3>
        


            <?php endif; ?>            


        


        </div><!--//single_content-->


        


        <?php get_sidebar(); ?>


        


        <div class="clear"></div>


    


    </div><!--//single_cont-->





</div><!--//content-->





<?php get_footer(); ?>        