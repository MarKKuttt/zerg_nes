// --------------settings-----------------------

// var slidesShow = 4;       // set number of displayed slides
var buttons = false;       // show/hide buttons (true or false)
var autoScroll = true;   // turn on/off slides auto-scroll (true or false) 
var scrollSpeed = 4000;   // set slide scrolling speed
var slidesShow;
// ---------------------------------------------

var blockLen = document.querySelectorAll('.carousel-block').length;
var show;

$(document).ready(function() {
  // Determine the number of slides to show based on window width
  if (window.innerWidth < 830) {
    slidesShow = 1;
  } else if (window.innerWidth < 1200) {
    slidesShow = 2;
  } else if (window.innerWidth < 1500) {
    slidesShow = 3;
  } else {
    slidesShow = 4;
  }
});

$(document).ready(function() {

  // conditions for variable 'show' 
  if (slidesShow > blockLen) {
    show = blockLen;
  }
  else if (slidesShow <= 0) {
    show = 1;
  }
  else if (1 <= slidesShow <= blockLen) {
    show = slidesShow;
  }
 

  let w = $('.infinite-carousel').width() / show;
  let oneBlockWidthCreate = $('.carousel-block').width(w);
 

  // set one block's width
  $(document).ready(function() {
    $('.carousel-block').each(function(index) {
      $(this).css('width', oneBlockWidthCreate);
    });
  });


  // clone block's array to the right sides
  $('.carousel-items .carousel-block').clone().appendTo($('.carousel-items'));


  // --------drag slides & mousemove--------  
  let threshold = 100;
  let carouselOneBlockWidth = $('#carousel').find('.carousel-block').eq(1).outerWidth();       
  
  let carousel = document.querySelector('#carousel');
  let carouselInner = carousel.querySelector('.carousel-items');
  let items = carousel.querySelectorAll('.carousel-block');
  

  // offset position of the block
  carouselInner.style = ('left:' + '-' + carouselOneBlockWidth + 'px');  


  // move the last element before the first
  items[items.length-1].style = 'order: -1;';   
  
  $('.carousel-block').width(w);


  // drag functionality 
  let slideActive = false;
  let startX;
  let currentX;
  let offsetX = 0;
  let order = 1;
  

  carouselInner.addEventListener('touchstart', dragStart, false);
  document.addEventListener('touchend', dragEnd, false);
  document.addEventListener('touchmove', drag, false);

  carouselInner.addEventListener('mousedown', dragStart, false);
  document.addEventListener('mouseup', dragEnd, false);
  document.addEventListener('mousemove', drag, false);

  function dragStart(e) {
    carouselInner.style.cursor = 'grabbing';
    if (e.type === 'touchstart') {
      startX = e.touches[0].clientX;
    } 
    else {
      startX = e.clientX;
    }
    slideActive = true;
  }

  function dragEnd(e) {
    if (slideActive) {
      if (currentX) {
        offsetX = offsetX + currentX - startX;
      }
      carouselInner.style.cursor = 'grab';
      slideActive = false;
      snapCarousel();
    }
  }

  function drag(e) {
    if (slideActive) {
      e.preventDefault();
      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX;
      }
      else {
        currentX = e.clientX;
      }
      translateCarousel(currentX - startX);
      offsetX += currentX - startX;
      startX = currentX;
      checkOffset();
    }
  }

  function translateCarousel(deltaX) {
    carouselInner.style.transform = 'translateX(' + (offsetX + deltaX) + 'px)';
  }

  function snapCarousel() {  
    let rounded = Math.round((offsetX % carouselOneBlockWidth) / carouselOneBlockWidth);
    let snapped;


    if (rounded === 0) {
      snapped = offsetX - (offsetX % carouselOneBlockWidth);
    } 
    else {
      snapped = offsetX + ((carouselOneBlockWidth - Math.abs(offsetX % carouselOneBlockWidth)) * rounded);
    }
    
    carouselInner.style.transform = 'translateX(' + snapped + 'px)';
    offsetX = snapped;
    checkOffset();
  }

  function checkOffset() {
    let tempOffset = offsetX;
    let direction = 0;


    if (slideActive) {
      tempOffset += currentX - startX;
    }

    if (tempOffset >= threshold) {
      direction = -1;
    } else if (tempOffset <= -threshold) {
      direction = 1;
    }

    if (direction !== 0) {
      translateCarousel(carouselOneBlockWidth * direction);
      updateOrder(direction * -1);
      offsetX += carouselOneBlockWidth * direction;
    }
  }

  function updateOrder(direction) {
    order = (order + direction + items.length) % items.length;
    if (order === 0) {
      items.forEach(function(item) {
        item.style.order = 0;
      });
    } 
    else if (order === items.length - 1) {
      for (let i = 1; i < items.length; i++) {
        items[i].style.order = -1;
      }
    } 
    else if (direction === 1) {
      items[items.length - order].style.order = -1;
    } 
    else {
      items[items.length - order - 1].style.order = 0;
    }
  }

  function wrapAround(v, delta, minval, maxval) {
    const mod = maxval + 1 - minval;

    v += delta - minval;
    v += (1 - v / mod) * mod;
    return v % mod + minval;
  }


  // --------auto-scroll slides--------
  $(function() {
    if (!autoScroll) return;
      auto_scroll('#carousel:first');
  });

  function auto_scroll(carousel) {
    setInterval(function () {
      if (!$('#carousel').is(".hover")) {
        $(carousel).find(".carousel-items").animate({ left: "-" + (carouselOneBlockWidth*2) + "px"}, 300, function() {
          offsetX -= carouselOneBlockWidth;
          checkOffset();
          $(carousel).find(".carousel-items").css({ left: "-" + carouselOneBlockWidth + "px" });
        });
      }
    }, scrollSpeed);
 

  // cursor hover to the carousel
  $(document).on("mouseenter", "#carousel", function() {
    $(this).addClass("hover");
  });


  // cursor leaves carousel
  $(document).on("mouseleave", "#carousel", function() {
    $(this).removeClass("hover");
  });
  }
  

});
