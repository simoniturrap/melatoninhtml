gsap.registerPlugin(ScrollTrigger);

//Animate Panel
if (document.querySelector(".panel")) {
  gsap.to(".panel", {
    scaleY: 0,
    duration: 1.65,
    ease: "power4.inOut",
  });
}

//Make a Custom Cursor
var cursor = {
  delay: 8,
  _x: 0,
  _y: 0,
  endX: window.innerWidth / 2,
  endY: window.innerHeight / 2,
  cursorVisible: true,
  cursorEnlarged: false,
  $dot: document.querySelector(".cursor-dot"),
  $outline: document.querySelector(".cursor-dot-outline"),

  init: function () {
    this.dotSize = this.$dot.offsetWidth;
    this.outlineSize = this.$outline.offsetWidth;
    this.setupEventListeners();
    this.animateDotOutline();
  },

  setupEventListeners: function () {
    var self = this;

    document.querySelectorAll("a").forEach(function (el) {
      el.addEventListener("mouseover", function () {
        self.cursorEnlarged = true;
        self.toggleCursorSize();
      });
      el.addEventListener("mouseout", function () {
        self.cursorEnlarged = false;
        self.toggleCursorSize();
      });
    });

    document.addEventListener("mousedown", function () {
      self.cursorEnlarged = true;
      self.toggleCursorSize();
    });
    document.addEventListener("mouseup", function () {
      self.cursorEnlarged = false;
      self.toggleCursorSize();
    });

    document.addEventListener("mousemove", function (e) {
      self.cursorVisible = true;
      self.toggleCursorVisibility();
      self.endX = e.pageX;
      self.endY = e.pageY;
      self.$dot.style.top = self.endY + "px";
      self.$dot.style.left = self.endX + "px";
    });

    document.addEventListener("mouseenter", function (e) {
      self.cursorVisible = true;
      self.toggleCursorVisibility();
      self.$dot.style.opacity = 1;
      self.$outline.style.opacity = 1;
    });

    document.addEventListener("mouseleave", function (e) {
      self.cursorVisible = true;
      self.toggleCursorVisibility();
      self.$dot.style.opacity = 0;
      self.$outline.style.opacity = 0;
    });
  },

  animateDotOutline: function () {
    var self = this;
    self._x += (self.endX - self._x) / self.delay;
    self._y += (self.endY - self._y) / self.delay;
    self.$outline.style.top = self._y + "px";
    self.$outline.style.left = self._x + "px";

    requestAnimationFrame(this.animateDotOutline.bind(self));
  },

  toggleCursorSize: function () {
    var self = this;

    if (self.cursorEnlarged) {
      self.$dot.style.transform = "translate(-50%, -50%) scale(0.75)";
      self.$outline.style.transform = "translate(-50%, -50%) scale(1.5)";
    } else {
      self.$dot.style.transform = "translate(-50%, -50%) scale(1)";
      self.$outline.style.transform = "translate(-50%, -50%) scale(1)";
    }
  },

  toggleCursorVisibility: function () {
    var self = this;

    if (self.cursorVisible) {
      self.$dot.style.opacity = 1;
      self.$outline.style.opacity = 1;
    } else {
      self.$dot.style.opacity = 0;
      self.$outline.style.opacity = 0;
    }
  },
};
cursor.init();

//Locomotive + Scrolltrigger

window.addEventListener("load", () => gsap.set("body", { autoAlpha: 1 }));

const locoScroll = new LocomotiveScroll({
  el: document.querySelector(".scrollContainer"),
  smooth: true,
});

locoScroll.on("scroll", ScrollTrigger.update);
ScrollTrigger.scrollerProxy(".scrollContainer", {
  scrollTop(value) {
    return arguments.length
      ? locoScroll.scrollTo(value, 0, 0)
      : locoScroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  pinType: document.querySelector(".scrollContainer").style.transform
    ? "transform"
    : "fixed",
});
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();

//Rotate Words Home
(function ($) {
  $.fn.extend({
    rotatetext: function (options) {
      var defaults = {
        fadeSpeed: 600,
        pauseSpeed: 0,
        child: null,
      };
      var options = $.extend(defaults, options);
      return this.each(function () {
        var o = options;
        var obj = $(this);
        var items = $(obj.children(), obj);
        items.each(function () {
          $(this).hide();
        });
        if (!o.child) {
          var next = $(obj).children(":first");
        } else {
          var next = o.child;
        }
        $(next).fadeIn(o.fadeSpeed, function () {
          $(next)
            .delay(o.pauseSpeed)
            .fadeOut(o.fadeSpeed, function () {
              var next = $(this).next();
              if (next.length == 0) {
                next = $(obj).children(":first");
              }
              $(obj).rotatetext({
                child: next,
                fadeSpeed: o.fadeSpeed,
                pauseSpeed: o.pauseSpeed,
              });
            });
        });
      });
    },
  });
})(jQuery);

$(document).ready(function () {
  $("#text-rotator").rotatetext({ fadeSpeed: 300, pauseSpeed: 4000 });
});

//MENU
const iconMenu = document.querySelector("#icon-menu");
const nav = document.querySelectorAll(".list-menu");

var menu = TweenLite.from("#menu", {
  yPercent: -100,
  duration: 0.2,
  ease: "power4",
  paused: true,
  reversed: true,
});

iconMenu.addEventListener("click", function () {
  iconMenu.classList.toggle("cross");

  for (var i = 0; i < nav.length; i++) {
    (function (index) {
      setTimeout(function () {
        nav[index].classList.toggle("animate");
      }, (index + 1) * 270);
    })(i);
  }
  menu.reversed() ? menu.play() : menu.reverse();
});

//Reveal h1 Home

if (document.querySelector(".text-reveal")) {
  gsap.set(".text-reveal span", { y: -20, opacity: 0 });
  gsap.to(".text-reveal span", { y: 0, duration: 1, opacity: 1, delay: 1 });

  gsap.set(".text-reveal h1", { y: 20, opacity: 0 });
  gsap.to(".text-reveal h1", { y: 0, duration: 1, opacity: 1, delay: 1 });

  gsap.to(".text-reveal", {
    scrollTrigger: {
      scroller: ".scrollContainer",
      trigger: ".text-reveal",
      scrub: true,
      duration: 2,
      start: "top 30%",
      end: "bottom 15%",
    },
    opacity: 0,
  });
}

//Reveal Image Home

if (document.querySelector(".home-image")) {
  gsap.set(".home-image", { y: -60 });
  gsap.to(".home-image", { y: -7, duration: 1, delay: 0.4 });
}

/// reveal fade in
if (document.querySelector(".scroll-reveal")) {
  const reveals = gsap.utils.toArray(".scroll-reveal");
  reveals.forEach((reveal) => {
    gsap.from(reveal, {
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        scroller: ".scrollContainer",
        trigger: reveal,
        start: "top 78%",
        ease: "power2.outIn",
        //markers: true,
      },
    });
  });
}

/// Revel More-Work
if (document.querySelector(".reveal-more")) {
  const reveals = gsap.utils.toArray(".reveal-more");
  reveals.forEach((reveal) => {
    gsap.from(reveal, {
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      scrollTrigger: {
        scroller: ".scrollContainer",
        trigger: reveal,
        start: "top 70%",
        ease: "power2.outIn",
      },
    });
  });
}

//Home-Portafolio h1
if (document.querySelector(".portafolio-h1")) {
  gsap.to(".portafolio-h1", {
    xPercent: -150,
    ease: "none",
    scrollTrigger: {
      scroller: ".scrollContainer",
      trigger: ".portafolio-h1",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      duration: 4,
    },
  });
}

//REveal fist Text

if (document.querySelector(".mask")) {
  let tls = gsap.timeline({
    defaults: {
      ease: "power2.inOut",
      duration: 2,
    },
  });
  tls.fromTo(
    ".mask",
    {
      xPercent: 0,
    },
    {
      xPercent: 1000,
      stagger: 0.07,
    }
  );

  ScrollTrigger.create({
    scroller: ".scrollContainer",
    animation: tls,
    trigger: "#main",
    start: "65% 35%",
    end: "+=150%",
    scrub: 2,
    duration: 3,
  });
}

//Link Image Background
if (document.querySelector("#more-work")) {
  $(document).ready(function () {
    var parallaxItem = document.querySelector("#portafolio");
    $("#more-work .menu a").mousemove(function (e) {
      parallax(e, parallaxItem);
    });
    var parallaxItem2 = document.querySelector("#album");
    $("#more-work .menu a").mousemove(function (e) {
      parallax(e, parallaxItem2);
    });
    function parallax(e, target) {
      var x =
        ($(".more-work").width() - target.offsetWidth) / 2 -
        (e.pageX - $(".more-work").width() / 2) / 3;
      var y =
        ($(".more-work").height() - target.offsetHeight) / 2 +
        (e.pageY - $(".more-work").height() / 2) * 1;
      $(target).offset({
        top: y,
        left: x,
      });
    }
  });
}

//Gallery
if (document.querySelector(".grid")) {
  FlexMasonry.init(".grid", {
    responsive: true,
    breakpointCols: {
      "min-width: 1500px": 7,
      "min-width: 1200px": 5,
      "min-width: 992px": 4,
      "min-width: 768px": 3,
      "min-width: 576px": 2,
    },
    numCols: 4,
  });

  //LightBox Portafoio & Albúm
  var lightbox = new SimpleLightbox(".gallery a", {
    overlayOpacity: 0.7,
    animationSlide: false,
    doubleTapZoom: false,
    close: false,
  });
}

//Back to Top
if (document.querySelector("#back")) {
  const back = document.querySelector("#back");
  back.addEventListener("click", function (e) {
    e.preventDefault();
    locoScroll.scrollTo("top");
  });
}

//Si Existe Default CAmbia el Fondo

if (document.querySelector(".default")) {
  ScrollTrigger.create({
    trigger: "#more-work",
    start: "top 40%",
    end: "bottom 0%",
    scroller: ".scrollContainer",

    onEnter: () => {
      gsap.to("body", {
        duration: 0.5,
        backgroundColor: "#000000",
      });
    },
    onLeaveBack: () => {
      gsap.to("body", {
        duration: 0.5,
        backgroundColor: "#0e0e0e",
      });
    },
  });
}

if (document.querySelector(".default")) {
  gsap.to(".bar", {
    height: 100,
    scrollTrigger: {
      scroller: ".scrollContainer",
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });
}


//Portafolio Page

if (document.querySelector("#portafolio-page")) {
  const contentHorizontal = document.querySelector(".content-horizontal");
  const item = document.querySelectorAll(".item");
  const countImage =
    contentHorizontal.getElementsByClassName("item").length + 1.5;
  const imageWidth = document.querySelector(".item").offsetWidth;

  gsap.to(".content-horizontal", {
    scrollTrigger: {
      scroller: ".scrollContainer",
      scrub: true,
      trigger: "#portafolio-page",
      pin: true,
      start: "top top",
      end: countImage * imageWidth,
    },
    x: -(countImage * imageWidth - window.innerWidth),
    ease: "none",
  });

  gsap.to(".bar", {
    height: 100,
    scrollTrigger: {
      scroller: ".scrollContainer",
      trigger: "body",
      start: "top top",
      end: countImage * imageWidth + window.innerHeight + window.innerHeight,
      scrub: true,
    },
  });
}

//Animations Contact

if( document.querySelector('#contacto') ){
  const highlight = document.querySelector('.contact-me');
  const email = document.querySelector('.email-me');

  gsap.set( highlight, {
    x: 50,
  });

  gsap.to( highlight,{
    x: 0,
    duration: 0.5,
    delay: 0.7,
    autoAlpha: 1,
  });

  gsap.set( email, {
    x: 50,
  });

  gsap.to( email,{
    x: 0,
    duration: 0.5,
    delay: 1,
    autoAlpha: 1,
  });
}