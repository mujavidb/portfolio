//For debugging
function p(x) { console.log(x); }

//Object literal
var mysite = {
	
	// Initialise all modules
	init: function () {

		mysite.welcome.init();
		
		mysite.mainFade.init();

		mysite.iphoneFloat.init();

		mysite.imageSlider.init();

		mysite.backgroundFade.init();

	},
	util: {

		//modified from: http://stackoverflow.com/a/7557433/3197684 by adding offset
		isInRange: function(el, offset) {
			var offset = offset || 0;
		    var rect = el.getBoundingClientRect();
		    return (
		        rect.top >= 0 &&
		        rect.left >= 0 &&
		        rect.bottom <= (window.innerHeight * (1 + offset) || document.documentElement.clientHeight * (1 + offset)) &&
		        rect.right <= (window.innerWidth * (1 + offset)  || document.documentElement.clientWidth * (1 + offset))
		    );
		}
	},
	welcome: {
		//FIXME: Write welcome_message as a single string
		init: function(){
			var welcome_message = "\n" +
			"***************************************************************\n" +
				"******************* Peaking under the hood? *******************\n" +
				"****** This site is written in HTML, SASS and JavaScript ******\n" +
				"******** You can see the full source code on my GitHub ********\n" +
				"************* https://github.com/mujavidb/mysite/ *************\n" +
				"***************************************************************\n" +
				"******************** To see future features *******************\n" +
				"********************* $ curl mujavidb.com *********************\n" +
				"***************************************************************\n";
			console.log(welcome_message);
			
		}
	},
	mainFade: {
		init: function(){
			document.querySelector("main").style.opacity = 1;
		}
	},
	iphoneFloat: {
		init: function () {
			var container = document.querySelector('.scoodle .left_block');
			var phone = document.getElementById('scoodle_svg');
			function floatDown(){
				if (mysite.util.isInRange(container, 0.3)) {
					container.classList.add('floatNow');
					phone.classList.add('fadeUp');
					document.removeEventListener('scroll', floatDown);
				}
			}
			document.addEventListener('scroll', floatDown, false);
		}
	},
	backgroundFade: {
		init: function () {
			function adjustColor(){
				if (proportion < 20) {
					document.body.style.backgroundColor = "#002030";
					panel_container.style.boxShadow = "none";
				} else {
					document.body.style.backgroundColor = panel_start;
					panel_container.style.boxShadow = shadow_color;
				}
			}
			var panel = document.getElementById('backgroundDark');
			var panel_start = panel.style.backgroundColor;
			var panel_container = document.getElementsByTagName('main')[0];
			var shadow_color = panel_container.style.boxShadow;
			var rect = panel.getBoundingClientRect();
			var proportion = (rect.top / panel.offsetHeight) * 100;

			adjustColor();

			document.addEventListener('scroll', function(){
				rect = panel.getBoundingClientRect();
				proportion = (rect.top / panel.offsetHeight) * 100;
				adjustColor();
			}, false);
		}
	},
	imageSlider: {
		init: function () {

			//should be declared nextSlide(x, y = false), but not compatible with Safari
			function nextSlide(x, y) {
				y = y || false;
				if (!y) {
					x != 2 ? x+=1 : x = 0;
				} else {
					x == 0 ? x = 2 : (x == 1 ? x = 0 : x = 1);
				}				
		        return x;
		    }

			function prevSlide(x, y) {
				y = y || false;
				if (!y) {
					x != 0 ? x-=1 : x = 2;
				} else {
					x == 0 ? x = 1 : (x == 1 ? x = 2 : x = 0);
				}
		        return x;
		    }

		    function loadNextSlide() {

				//Translate first slide upwards
				slides[current].classList.add('go_next');
				slides[current].classList.remove('from_next');

				setTimeout( function(){

					//Reorder all slides
					var next_item;

					slides[current].classList.remove('go_next');
					slides[current].style.order = 2;

					//Animate in next slide
					next_item = nextSlide(current);
					slides[next_item].classList.add('from_next');
					slides[next_item].style.order = 0;

					next_item = nextSlide(current, true);
					slides[next_item].style.order = 1;

					current != 2 ? current +=1 : current = 0;
					wrapper.style.backgroundColor = bgcolors[current];
					
				}, 250);
			}
			function loadPrevSlide() {

				slides[current].classList.remove('from_next');
				prev_item = prevSlide(current);
				slides[prev_item].classList.add('go_next');

				setTimeout( function(){
					var prev_item;

					slides[current].style.order = 1;

					prev_item = prevSlide(current);
					slides[prev_item].classList.add('from_next');
					slides[prev_item].classList.remove('go_next');
					slides[prev_item].style.order = 0;	

					prev_item = prevSlide(current, true);
					slides[prev_item].style.order = 2;

					current != 0 ? current -= 1 : current = 2;
					wrapper.style.backgroundColor = bgcolors[current];
					
				}, 250);
			}

			var wrapper = document.getElementById('sliderWrap');
			var slides = document.querySelectorAll('#mySlider .slide');
			var next_control = document.querySelectorAll('.slider_controls .next')[0];
			var prev_control = document.querySelectorAll('.slider_controls .prev')[0];
			var bgcolors = ["#5A7282", "#F1F1F1","#F1F1F1"];
			var current = 0;
			
			next_control.addEventListener('click', loadNextSlide, false);

			prev_control.addEventListener('click', loadPrevSlide, false);

			document.addEventListener('keydown', function(e){
				if (mysite.util.isInRange(next_control, 0.5)) {

					//Right key
					if (e.keyCode == 39) {
						loadNextSlide();
					} else if (e.keyCode == 37) {
						loadPrevSlide();
					}
				}
			});
		}
	}
};

document.addEventListener('DOMContentLoaded', mysite.init);