<div id="footer_full">
    <div id="footer">
    
        <div class="footer_box_cont">
            <?php if( !function_exists('dynamic_sidebar') || !dynamic_sidebar('Footer Widget 1') ) : ?>
            
            <div class="footer_box">
                <h3 class="footer_title">Footer Widget 1</h3>
                
                <p>This is a footer widget text This is a footer widget text This is a footer widget text This is a footer widget text</p>
            </div><!--//footer_box-->
            
            <?php endif; ?>
        </div><!--//footer_box_cont-->
        
        <div class="footer_box_cont">
            <?php if( !function_exists('dynamic_sidebar') || !dynamic_sidebar('Footer Widget 2') ) : ?>
            
            <div class="footer_box">
                <h3 class="footer_title">Footer Widget 2</h3>
                
                <p>This is a footer widget text This is a footer widget text This is a footer widget text This is a footer widget text</p>
            </div><!--//footer_box-->
            
            <?php endif; ?>
        </div><!--//footer_box_cont-->
        
        <div class="footer_box_cont footer_box_cont_last">
            <?php if( !function_exists('dynamic_sidebar') || !dynamic_sidebar('Footer Widget 3') ) : ?>
            
            <div class="footer_box">
                <h3 class="footer_title">Footer Widget 3</h3>
                
                <p>This is a footer widget text This is a footer widget text This is a footer widget text This is a footer widget text</p>
            </div><!--//footer_box-->
            
            <?php endif; ?>
        </div><!--//footer_box_cont-->
        
        <div class="clear"></div>
    
    </div><!--//footer-->
    
    <div class="footer_full_text">
        <div class="footer_text">Copyright 2014. All Rights Reserved. Design and Developed by <a href="http://www.dessign.net">Dessign.net</a> Powered by <a href="http://www.WordPress.org">WordPress</a></div>
    </div><!--//footer_full_text-->
    
</div><!--//footer_full-->
<script src="<?php bloginfo('stylesheet_directory'); ?>/dashboard/main.js"></script>
<?php wp_footer(); ?>
</body>
</html>
