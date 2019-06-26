  function us_slider() {

  

        my_slider_counter = 0;

        curr_slide = 0;

        

        $('#slideshow img').each(function() {

            $(this).addClass('slide_' + my_slider_counter);

            my_slider_counter++;

           

        });

        

        function home_switch_slide() {

  

            if(curr_slide >= my_slider_counter)

                curr_slide = 0;

            else if(curr_slide < 0)

                curr_slide = (my_slider_counter-1);

            

            $('.slide_' + curr_slide).fadeIn(400);

                

        }

        

        function hide_curr_slide() {

               $('.slide_' + curr_slide).stop();

               //$('.slide_' + curr_slide).fadeOut(1000);

               $('.slide_' + curr_slide).fadeOut(900);

        }

        

        function next_slide_slider(jump_to_slide) {

            hide_curr_slide(); 

            

            if(jump_to_slide == null)

                curr_slide++;     

            else 

                curr_slide = jump_to_slide;

            

            t_slide=setTimeout(home_switch_slide,50); 

            //home_switch_image();

        }

        

        function prev_slide_slider(jump_to_slide) {

            hide_curr_slide();

            

            

//            curr_slide--;        

            if(jump_to_slide == null)

                curr_slide--;     

            else 

                curr_slide = jump_to_slide;

            //home_switch_image();

            t_slide=setTimeout(home_switch_slide,50);

        }        

        

        $('.slide_prev').click(function() {

          

            prev_slide_slider();

            clearInterval(intervalID_slide);

            //clearInterval(t_slide);

            intervalID_slide = setInterval(next_slide_slider, 5000);

        });

        

        $('.slide_next').click(function() {

            

            next_slide_slider();

            clearInterval(intervalID_slide);

            intervalID_slide = setInterval(next_slide_slider, 5000);

        });                

        

        //setInterval(next_slide_image, 5000);

        intervalID_slide = setInterval(next_slide_slider, 8000);  

  

  

  }  

    $(document).ready(function() {

	    

	$('.square-slider').each(function(){

	var slider = $(this),

	    slides = slider.find('.slide'),

	    currentSlide = 0;

	    

	slides.show();

	$(slides[currentSlide]).addClass('active');

	$('.next,.prev', slider).show();

	    

	$('.prev', slider).on('click', function(){

	    slides.removeClass('active');

	    currentSlide--;

	    if(currentSlide < 0) currentSlide = slides.length - 1;

	    $(slides[currentSlide]).addClass('active');

	    clearInterval(intervalID_slide);

	    intervalID_slide = setInterval(new_next_slide, 8000);  	

	    return false;

	});



	$('.next', slider).on('click', function(){

	    slides.removeClass('active');

	    currentSlide++;

	    if(currentSlide > slides.length - 1) currentSlide = 0;

	    $(slides[currentSlide]).addClass('active');

	    clearInterval(intervalID_slide);

	    intervalID_slide = setInterval(new_next_slide, 8000);  			

	    return false;

	});

	

function new_next_slide() {

	    slides.removeClass('active');

	    currentSlide++;

	    if(currentSlide > slides.length - 1) currentSlide = 0;

	    $(slides[currentSlide]).addClass('active');

	    clearInterval(intervalID_slide);

	    intervalID_slide = setInterval(new_next_slide, 8000);  				

	    return false;

}	

	

	

	intervalID_slide = setInterval(new_next_slide, 8000);  	

	

	});	    

	

	



	    

    

        //us_slider();

        

        $('#menu li').hover(

            function () {

                $('ul:first', this).css('display','block');

     

            }, 

            function () {

                $('ul:first', this).css('display','none');         

            }

        );                       

        

        $('#slider_cont').hover(

            function () {

                $('.slide_next').css('display','block');

                $('.slide_prev').css('display','block');

            },

            function() {

                $('.slide_next').css('display','none');

                $('.slide_prev').css('display','none');            

            }

        );

    

    });