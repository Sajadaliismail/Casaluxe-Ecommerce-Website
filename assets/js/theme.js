(function ($) {
  "use strict";
  var $body = $("body"),
    $window = $(window),
    $siteWrapper = $("#site-wrapper"),
    $document = $(document);
  var APP = {
    init: function () {
      this.narbarDropdownOnHover();
      this.activeSidebarMenu();
      this.reInitWhenTabShow();
      this.enablePopovers();
      this.initToast();
      this.scrollSpyLanding();
      this.scrollSpyProductImage();
      this.parallaxImag();
      this.slickCustomNav();
      this.imageMarker();
      this.dropdownMenuCanvas();
      this.canvasCart();
      this.showFormReview();
      this.activeSearch();
      this.productDropdownOnHover();
      this.activeMenuListing();
      this.openCouponBox();
    },
    isMobile: function () {
      return window.matchMedia("(max-width: 1199px)").matches;
    },
    narbarDropdownOnHover: function () {
      var $dropdown = $(".main-header .hover-menu .dropdown");
      if ($dropdown.length < 1) {
        return;
      }
      $dropdown.on("mouseenter", function () {
        if (APP.isMobile()) {
          return;
        }
        var $this = $(this);
        $this.addClass("show").find(" > .dropdown-menu").addClass("show");
      });
      $dropdown.on("mouseleave", function () {
        if (APP.isMobile()) {
          return;
        }
        var $this = $(this);
        $this.removeClass("show").find(" > .dropdown-menu").removeClass("show");
      });
    },
    productDropdownOnHover: function () {
      var $dropdown = $(".product-dropdown");
      if ($dropdown.length < 1) {
        return;
      }
      var $dropdown_toggle = $(".product-dropdown .dropdown-toggle");
      $dropdown_toggle.on("click", function (e) {
        e.preventDefault();
        location.href = $dropdown_toggle.attr("href");
      });
      $dropdown.on("mouseenter", function () {
        var $this = $(this);
        $this.addClass("show").find(" > .dropdown-menu").addClass("show");
      });
      $dropdown.on("mouseleave", function () {
        var $this = $(this);
        $this.removeClass("show").find(" > .dropdown-menu").removeClass("show");
      });
    },
    dropdownMenuCanvas: function () {
      $(".sidenav .dropdown-menu [data-toggle='dropdown']").on(
        "click",
        function (event) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          var that = this;
          $(that).next().toggleClass("show");
          $(this)
            .parents("li.nav-item.dropdown.show")
            .on("hidden.bs.dropdown", function (e) {
              $(that).next().removeClass("show");
            });
        }
      );
    },
    activeSidebarMenu: function () {
      var $sidebar = $(".db-sidebar");
      if ($sidebar.length < 1) {
        return;
      }
      var $current_link = window.location.pathname;
      var $sidebarLink = $sidebar.find(".sidebar-link");
      $sidebarLink.each(function () {
        var href = $(this).attr("href");
        if ($current_link.indexOf(href) > -1) {
          var $sidebar_item = $(this).parent(".sidebar-item");
          $sidebar_item.addClass("active");
        }
      });
    },
    reInitWhenTabShow: function () {
      var $tabs = $('a[data-toggle="pill"],a[data-toggle="tab"]');
      $tabs.each(function () {
        var $this = $(this);
        $this.on("shown.bs.tab", function (e) {
          var href = $(this).attr("href");
          if (href !== "#") {
            var $slider = $(href).find(".slick-slider");
            $slider.slick("setPosition");
            $('[data-toggle="tooltip"]').tooltip("update");
            if ($(e.target).attr("href") !== undefined) {
              var $target = $($(e.target).attr("href"));
              APP.util.mfpEvent($target);
            }
          }
          APP.mapbox.init();
        });
      });
    },
    enablePopovers: function () {
      $('[data-toggle="popover"]').popover();
    },
    initToast: function () {
      $(".toast").toast();
    },
    scrollSpyLanding: function () {
      var $langding_menu = $("#landingMenu");
      if ($langding_menu.length < 1) {
        return;
      }
      $("body").scrollspy({ target: "#landingMenu", offset: 200 });
      $langding_menu
        .find(".nav-link")
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
          if (
            location.pathname.replace(/^\//, "") ===
              this.pathname.replace(/^\//, "") &&
            location.hostname === this.hostname
          ) {
            var target = $(this.hash);
            target = target.length
              ? target
              : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
              event.preventDefault();
              $("html, body").animate(
                { scrollTop: target.offset().top },
                500,
                function () {}
              );
            }
          }
        });
    },
    scrollSpyProductImage: function () {
      var $image_dots = $("#list-dots");
      if ($image_dots.length < 1) {
        return;
      }
      $("body").scrollspy({ target: "#list-dots", offset: 200 });
      var $scroll_images = $(".scrollspy-images");
      $window.on("scroll", function (e) {
        e.preventDefault();
        var is_end =
          $(this).scrollTop() + $(this).height() >
          $scroll_images.offset().top + $scroll_images.height() + 250;
        if (is_end) {
          $image_dots.addClass("hide");
        } else {
          $image_dots.removeClass("hide");
        }
      });
    },
    parallaxImag: function () {
      var image_wrapper = $(".parralax-images");
      image_wrapper.mousemove(function (e) {
        e.preventDefault();
        var wx = $(window).width();
        var wy = $(window).height();
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        var newx = x - wx / 2;
        var newy = y - wy / 2;
        $.each(image_wrapper.find(".layer"), function (index) {
          var speed = 0.01 + index / 100;
          TweenMax.to($(this), 1, { x: 1 - newx * speed, y: 1 - newy * speed });
        });
      });
      image_wrapper.on("mouseleave", function (e) {
        e.preventDefault();
        $.each(image_wrapper.find(".layer"), function () {
          TweenMax.to($(this), 1, { x: 0, y: 0 });
        });
      });
    },
    slickCustomNav: function () {
      var $slickslider = $(".custom-nav");
      if ($slickslider.length < 1) {
        return;
      }
      $(".arrow").on("click", function (e) {
        e.preventDefault();
        if ($(this).hasClass("slick-prev")) {
          $slickslider.slick("slickPrev");
        }
        if ($(this).hasClass("slick-next")) {
          $slickslider.slick("slickNext");
        }
        $slickslider.on("afterChange", function (slick, currentSlide) {
          if (0 === currentSlide.currentSlide) {
            $("#previous").addClass("disabled");
          } else {
            $("#previous").removeClass("disabled");
          }
          if (
            currentSlide.slideCount - currentSlide.options.slidesToShow ===
            currentSlide.currentSlide
          ) {
            $("#next").addClass("disabled");
          } else {
            $("#next").removeClass("disabled");
          }
        });
      });
    },
    imageMarker: function () {
      $(".image-marker")
        .find('[data-toggle="tooltip"]')
        .each(function () {
          var configs = {
            container: $(this).parent(),
            html: true,
            placement: "top",
            offset: 20,
            delay: { show: 0, hide: 100 },
          };
          if ($(this).closest(".gtf__tooltip-wrap").length) {
            configs = $.extend(
              {},
              configs,
              $(this).closest(".gtf__tooltip-wrap").data("tooltip-options")
            );
          }
          $(this).tooltip(configs);
        });
    },
    canvasCart: function () {
      $(".down").on("click", function (e) {
        e.preventDefault();
        var $parent = $(this).parent(".input-group");
        var $input = $parent.find("input");
        var $value = parseInt($input.val());
        if ($value > 0) {
          $value -= 1;
          $input.val($value);
        }
      });
      $(".up").on("click", function (e) {
        e.preventDefault();
        var $parent = $(this).parent(".input-group");
        var $input = $parent.find("input");
        var $value = $input.val();
        if ($value !== "") {
          $value = parseInt($value);
          $value += 1;
          $input.val($value);
        } else {
          $input.val(1);
        }
      });
    },
    showFormReview: function () {
      $(".write-review").on("click", function (e) {
        e.preventDefault();
        $(".form-review").toggle("slide", { direction: "up" }, 500);
      });
    },
    activeSearch: function () {
      var $input = $(".input-search-event");
      var $search_section = $(".section-search-active");
      var $form_search = $(".form-search");
      var $nav_search = $(".nav-search-event");
      var $menu = $(".nav-menu");
      $("body").on("click", function (e) {
        var target = $(e.target);
        if (
          target.closest(".nav-search-event").length > 0 &&
          target.closest(".input-search").length < 1 &&
          target.closest(".section-search-active a").length < 1
        ) {
          $form_search.addClass("show");
          $nav_search.addClass("hide");
        } else if (
          target.closest(".nav-search-event").length < 1 &&
          target.closest(".input-search").length < 1 &&
          target.closest(".section-search-active a").length < 1
        ) {
          $form_search.removeClass("show");
          $nav_search.removeClass("hide");
        }
        APP.headerSticky.sticky();
      });
      $input.on("focus", function (e) {
        e.preventDefault();
        $search_section.slideDown(200);
        $menu.slideUp(200);
        APP.headerSticky.sticky();
      });
      $input.on("focusout", function (e) {
        e.preventDefault();
        $search_section.slideUp(200);
        $menu.slideDown(200);
        APP.headerSticky.sticky();
      });
      $window.resize(function () {
        if (APP.isMobile()) {
          $search_section.slideUp(200);
          $menu.slideDown(200);
          APP.headerSticky.sticky();
        }
      });
    },
    activeMenuListing: function () {
      var $menu = $(".dropdown-menu-listing");
      if ($menu.length < 1) {
        return;
      }
      var $current_link = window.location.pathname;
      var $menuLink = $menu.find(".dropdown-link");
      $menuLink.each(function () {
        var href = $(this).attr("href");
        if ($current_link.indexOf(href) > -1) {
          var $menu_item = $(this).parent(".dropdown-item");
          $menu_item.addClass("active");
        }
      });
    },
    openCouponBox: function () {
      var $couponBox = $(".box-coupon");
      var $button = $(".enter-coupon");
      $button.on("click", function (e) {
        e.preventDefault();
        $couponBox.slideToggle("slow", function () {});
      });
    },
  };
  APP.slickSlider = {
    init: function ($wrap) {
      this.slickSetup($wrap);
    },
    slickSetup: function ($wrap) {
      var $slicks;
      if ($wrap !== undefined) {
        $slicks = $wrap;
      } else {
        $slicks = $(".slick-slider");
      }
      var options_default = {
        slidesToScroll: 1,
        slidesToShow: 1,
        adaptiveHeight: true,
        arrows: true,
        dots: true,
        autoplay: false,
        autoplaySpeed: 3000,
        centerMode: false,
        centerPadding: "50px",
        draggable: true,
        fade: false,
        focusOnSelect: false,
        infinite: false,
        pauseOnHover: false,
        responsive: [],
        rtl: false,
        speed: 300,
        vertical: false,
        prevArrow:
          '<div class="slick-prev" aria-label="Previous"><i class="far fa-arrow-left"></i></div>',
        nextArrow:
          '<div class="slick-next" aria-label="Next"><i class="far fa-arrow-right"></i></div>',
        customPaging: function (slider, i) {
          return $("<span></span>");
        },
      };
      $slicks.each(function () {
        var $this = $(this);
        if (!$this.hasClass("slick-initialized")) {
          var options = $this.data("slick-options");
          if ($this.hasClass("custom-slider-02")) {
            options.customPaging = function (slider, i) {
              var width = ((i + 1) / slider.slideCount) * 100;
              var $index = "";
              if (i < 9) {
                $index = "0" + (i + 1);
              } else {
                $index = i + 1;
              }
              var count = "";
              if (slider.slideCount < 9) {
                count = "0" + slider.slideCount;
              } else {
                count = slider.slideCount;
              }
              return (
                '<span class="dot">' +
                $index +
                "</span>" +
                '<span class="dot-divider"><span class="divider-value" style="width: ' +
                width +
                '%"></span></span><span class="dot">' +
                count +
                "</span>"
              );
            };
          }
          options = $.extend({}, options_default, options);
          $this.slick(options);
          $this.on("setPosition", function (event, slick) {
            var max_height = 0;
            slick.$slides.each(function () {
              var $slide = $(this);
              if ($slide.hasClass("slick-active")) {
                if (
                  slick.options.adaptiveHeight &&
                  slick.options.slidesToShow > 1 &&
                  slick.options.vertical === false
                ) {
                  if (max_height < $slide.outerHeight()) {
                    max_height = $slide.outerHeight();
                  }
                }
              }
            });
            if (max_height !== 0) {
              $this.find("> .slick-list").animate({ height: max_height }, 500);
            }
          });
        }
      });
    },
  };
  APP.counter = {
    init: function () {
      if (typeof Waypoint !== "undefined") {
        $(".counterup").waypoint(
          function () {
            var start = $(this.element).data("start");
            var end = $(this.element).data("end");
            var decimals = $(this.element).data("decimals");
            var duration = $(this.element).data("duration");
            var separator = $(this.element).data("separator");
            var usegrouping = false;
            if (separator !== "") {
              usegrouping = true;
            }
            var decimal = $(this.element).data("decimal");
            var prefix = $(this.element).data("prefix");
            var suffix = $(this.element).data("suffix");
            var options = {
              useEasing: true,
              useGrouping: usegrouping,
              separator: separator,
              decimal: decimal,
              prefix: prefix,
              suffix: suffix,
            };
            var counterup = new CountUp(
              this.element,
              start,
              end,
              decimals,
              duration,
              options
            );
            counterup.start();
            this.destroy();
          },
          { triggerOnce: true, offset: "bottom-in-view" }
        );
      }
    },
  };
  APP.util = {
    init: function () {
      this.mfpEvent();
      this.backToTop();
      this.tooltip();
      this.goDown();
    },
    mfpEvent: function ($elWrap) {
      if ($elWrap === undefined) {
        $elWrap = $("body");
      }
      $elWrap.find("[data-gtf-mfp]").each(function () {
        var $this = $(this),
          defaults = {
            type: "image",
            closeOnBgClick: true,
            closeBtnInside: false,
            mainClass: "mfp-zoom-in",
            midClick: true,
            removalDelay: 300,
            callbacks: {
              beforeOpen: function () {
                switch (this.st.type) {
                  case "image":
                    this.st.image.markup = this.st.image.markup.replace(
                      "mfp-figure",
                      "mfp-figure mfp-with-anim"
                    );
                    break;
                  case "iframe":
                    this.st.iframe.markup = this.st.iframe.markup.replace(
                      "mfp-iframe-scaler",
                      "mfp-iframe-scaler mfp-with-anim"
                    );
                    break;
                }
              },
              beforeClose: function () {
                this.container.trigger("gtf_mfp_beforeClose");
              },
              close: function () {
                this.container.trigger("gtf_mfp_close");
              },
              change: function () {
                var _this = this;
                if (this.isOpen) {
                  this.wrap.removeClass("mfp-ready");
                  setTimeout(function () {
                    _this.wrap.addClass("mfp-ready");
                  }, 10);
                }
              },
            },
          },
          mfpConfig = $.extend({}, defaults, $this.data("mfp-options"));
        var galleryId = $this.data("gallery-id");
        if (typeof galleryId !== "undefined") {
          var items = [],
            items_src = [];
          var $imageLinks = $('[data-gallery-id="' + galleryId + '"]');
          $imageLinks.each(function () {
            var src = $(this).attr("href");
            if (items_src.indexOf(src) < 0) {
              items_src.push(src);
              items.push({ src: src });
            }
          });
          mfpConfig.items = items;
          mfpConfig.gallery = { enabled: true };
          mfpConfig.callbacks.beforeOpen = function () {
            var index = $imageLinks.index(this.st.el);
            switch (this.st.type) {
              case "image":
                this.st.image.markup = this.st.image.markup.replace(
                  "mfp-figure",
                  "mfp-figure mfp-with-anim"
                );
                break;
              case "iframe":
                this.st.iframe.markup = this.st.iframe.markup.replace(
                  "mfp-iframe-scaler",
                  "mfp-iframe-scaler mfp-with-anim"
                );
                break;
            }
            if (-1 !== index) {
              this.goTo(index);
            }
          };
        }
        $this.magnificPopup(mfpConfig);
      });
    },
    tooltip: function ($elWrap) {
      if ($elWrap === undefined) {
        $elWrap = $("body");
      }
      $elWrap.find('[data-toggle="tooltip"]').each(function () {
        var configs = { container: $(this).parent() };
        if ($(this).closest(".gtf__tooltip-wrap").length) {
          configs = $.extend(
            {},
            configs,
            $(this).closest(".gtf__tooltip-wrap").data("tooltip-options")
          );
        }
        $(this).tooltip(configs);
      });
    },
    backToTop: function () {
      var $backToTop = $(".gtf-back-to-top");
      if ($backToTop.length > 0) {
        $backToTop.on("click", function (event) {
          event.preventDefault();
          $("html,body").animate({ scrollTop: "0px" }, 800);
        });
        $window.on("scroll", function (event) {
          var scrollPosition = $window.scrollTop(),
            windowHeight = $window.height() / 2;
          if (scrollPosition > windowHeight) {
            $backToTop.addClass("in");
          } else {
            $backToTop.removeClass("in");
          }
        });
      }
    },
    goDown: function () {
      var $goDown = $(".go-down");
      if ($goDown.length > 0) {
        $goDown.on("click", function (event) {
          event.preventDefault();
          $("html, body").animate(
            { scrollTop: $("#section-next").offset().top },
            1000,
            function () {}
          );
        });
      }
    },
  };
  APP.CollapseTabsAccordion = {
    init: function () {
      this.CollapseSetUp();
    },
    CollapseSetUp: function () {
      var $tabs = $(".collapse-tabs");
      $tabs
        .find(".tab-pane.active .collapse-parent")
        .attr("data-toggle", "false");
      $tabs.find(".nav-link").on("show.bs.tab", function (e) {
        if (!$(this).hasClass("nested-nav-link")) {
          var $this_tab = $(this).parents(".collapse-tabs");
          var $tabpane = $($(this).attr("href"));
          $this_tab.find(".collapsible").removeClass("show");
          $this_tab.find("collapse-parent").addClass("collapsed");
          $this_tab.find("collapse-parent").attr("data-toggle", "collapse");
          $tabpane.find(".collapse-parent").removeClass("collapsed");
          $tabpane.find(".collapse-parent").attr("data-toggle", "false");
          $tabpane.find(".collapsible").addClass("show");
        }
      });
      $tabs.find(".collapsible").on("show.bs.collapse", function () {
        var $this_tab = $(this).parents(".collapse-tabs"),
          $parent = $(this).parents(".tab-pane.tab-pane-parent"),
          $id = $parent.attr("id"),
          $navItem = $this_tab.find(".nav-link"),
          $navItemClass = "active";
        $this_tab.find(".collapse-parent").attr("data-toggle", "collapse");
        $parent.find(".collapse-parent").attr("data-toggle", "false");
        var $tab_pane = $this_tab.find(".tab-pane");
        if (!$tab_pane.hasClass("nested-tab-pane")) {
          $this_tab.find(".tab-pane").removeClass("show active");
        }
        $parent.addClass("show active");
        var $nav_link = $parent.parents(".collapse-tabs").find(".nav-link");
        if (!$nav_link.hasClass("nested-nav-link")) {
          $nav_link.removeClass("active");
        }
        $navItem.each(function () {
          if (!$(this).hasClass("nested-nav-link")) {
            $(this).removeClass("active");
            if ($(this).attr("href") === "#" + $id) {
              $(this).addClass($navItemClass);
            }
          }
        });
      });
    },
  };
  APP.animation = {
    delay: 100,
    itemQueue: [],
    queueTimer: null,
    $wrapper: null,
    init: function () {
      var _self = this;
      _self.$wrapper = $body;
      _self.itemQueue = [];
      _self.queueTimer = null;
      if (typeof delay !== "undefined") {
        _self.delay = delay;
      }
      _self.itemQueue["animated_0"] = [];
      $body
        .find("#content")
        .find(">div,>section")
        .each(function (index) {
          $(this).attr("data-animated-id", index + 1);
          _self.itemQueue["animated_" + (index + 1)] = [];
        });
      setTimeout(function () {
        _self.registerAnimation();
      }, 200);
    },
    registerAnimation: function () {
      var _self = this;
      $("[data-animate]:not(.animated)", _self.$wrapper).waypoint(
        function () {
          var _el = this.element ? this.element : this,
            $this = $(_el);
          if ($this.is(":visible")) {
            var $animated_wrap = $this.closest("[data-animated-id]"),
              animated_id = "0";
            if ($animated_wrap.length) {
              animated_id = $animated_wrap.data("animated-id");
            }
            _self.itemQueue["animated_" + animated_id].push(_el);
            _self.processItemQueue();
          } else {
            $this.addClass($this.data("animate")).addClass("animated");
          }
        },
        { offset: "90%", triggerOnce: true }
      );
    },
    processItemQueue: function () {
      var _self = this;
      if (_self.queueTimer) return;
      _self.queueTimer = window.setInterval(function () {
        var has_queue = false;
        for (var animated_id in _self.itemQueue) {
          if (_self.itemQueue[animated_id].length) {
            has_queue = true;
            break;
          }
        }
        if (has_queue) {
          for (var animated_id in _self.itemQueue) {
            var $item = $(_self.itemQueue[animated_id].shift());
            $item.addClass($item.data("animate")).addClass("animated");
          }
          _self.processItemQueue();
        } else {
          window.clearInterval(_self.queueTimer);
          _self.queueTimer = null;
        }
      }, _self.delay);
    },
  };
  APP.headerSticky = {
    scroll_offset_before: 0,
    init: function () {
      this.sticky();
      this.scroll();
      this.resize();
      this.processSticky();
      this.footerBottom();
    },
    sticky: function () {
      $(".header-sticky .sticky-area").each(function () {
        var $this = $(this);
        if (!$this.is(":visible")) {
          return;
        }
        if (!$this.parent().hasClass("sticky-area-wrap")) {
          $this.wrap('<div class="sticky-area-wrap"></div>');
        }
        var $wrap = $this.parent();
        var $nav_dashbard = $(".dashboard-nav");
        $wrap.height($this.outerHeight());
        if (window.matchMedia("(max-width: 1199px)").matches) {
          $nav_dashbard.addClass("header-sticky-smart");
        } else {
          $nav_dashbard.removeClass("header-sticky-smart");
        }
      });
    },
    resize: function () {
      $window.resize(function () {
        APP.headerSticky.sticky();
        APP.headerSticky.processSticky();
        APP.headerSticky.footerBottom();
      });
    },
    scroll: function () {
      $window.on("scroll", function () {
        APP.headerSticky.processSticky();
      });
    },
    processSticky: function () {
      var current_scroll_top = $window.scrollTop();
      var $parent = $(".main-header");
      var is_dark = false;
      if (
        $parent.hasClass("navbar-dark") &&
        !$parent.hasClass("bg-secondary")
      ) {
        is_dark = true;
      }
      $(".header-sticky .sticky-area").each(function () {
        var $this = $(this);
        if (!$this.is(":visible")) {
          return;
        }
        var $wrap = $this.parent(),
          sticky_top = 0,
          sticky_current_top = $wrap.offset().top,
          borderWidth = $body.css("border-width");
        if (borderWidth !== "") {
          sticky_top += parseInt(borderWidth);
        }
        if (sticky_current_top - sticky_top < current_scroll_top) {
          $this.css("position", "fixed");
          $this.css("top", sticky_top + "px");
          $wrap.addClass("sticky");
          if (is_dark) {
            $parent.removeClass("navbar-dark");
            $parent.addClass("navbar-light");
            $parent.addClass("navbar-light-sticky");
          }
        } else {
          if ($parent.hasClass("navbar-light-sticky")) {
            $parent.addClass("navbar-dark");
            $parent.removeClass("navbar-light");
            $parent.removeClass("navbar-light-sticky");
          }
          if ($wrap.hasClass("sticky")) {
            $this.css("position", "").css("top", "");
            $wrap.removeClass("sticky");
          }
        }
      });
      if (APP.headerSticky.scroll_offset_before > current_scroll_top) {
        $(".header-sticky-smart .sticky-area").each(function () {
          if ($(this).hasClass("header-hidden")) {
            $(this).removeClass("header-hidden");
          }
        });
      } else {
        $(".header-sticky-smart .sticky-area").each(function () {
          var $wrapper = $(this).parent();
          if ($wrapper.length) {
            if (
              APP.headerSticky.scroll_offset_before >
                $wrapper.offset().top + $(this).outerHeight() &&
              !$(this).hasClass("header-hidden")
            ) {
              $(this).addClass("header-hidden");
            }
          }
        });
      }
      APP.headerSticky.scroll_offset_before = current_scroll_top;
    },
    footerBottom: function () {
      var $main_footer = $(".footer");
      var $wrapper_content = $("#content");
      $main_footer.css("position", "");
      $wrapper_content.css("padding-bottom", "");
      if ($body.outerHeight() < $window.outerHeight()) {
        $main_footer.css("position", "fixed");
        $main_footer.css("bottom", "0");
        $main_footer.css("left", "0");
        $main_footer.css("right", "0");
        $main_footer.css("z-index", "0");
        $wrapper_content.css(
          "padding-bottom",
          $main_footer.outerHeight() + "px"
        );
      } else {
        $main_footer.css("position", "");
        $wrapper_content.css("padding-bottom", "");
      }
    },
  };
  APP.sidebarSticky = {
    init: function () {
      var header_sticky_height = 0;
      if (window.matchMedia("(max-width: 767px)").matches) {
        return;
      }
      if ($("#site-header.header-sticky").length > 0) {
        header_sticky_height = 60;
      }
      $(".primary-sidebar.sidebar-sticky > .primary-sidebar-inner").hcSticky({
        stickTo: "#sidebar",
        top: header_sticky_height + 30,
      });
      $(".primary-map.map-sticky > .primary-map-inner").hcSticky({
        stickTo: "#map-sticky",
        top: header_sticky_height,
      });
      $(".primary-summary.summary-sticky > .primary-summary-inner").hcSticky({
        stickTo: "#summary-sticky",
        top: header_sticky_height,
      });
    },
  };
  APP.mapbox = {
    init: function () {
      var $map_box = $(".mapbox-gl");
      if ($map_box.length < 1) {
        return;
      }
      var options_default = {
        container: "map",
        style: "mapbox://styles/mapbox/streets-v10",
        center: [-73.9927227, 40.6734035],
        zoom: 16,
      };
      $map_box.each(function () {
        var $this = $(this),
          options = $this.data("mapbox-options"),
          markers = $this.data("mapbox-marker");
        options = $.extend({}, options_default, options);
        mapboxgl.accessToken = $this.data("mapbox-access-token");
        var map = new mapboxgl.Map(options);
        var $marker_el = $($this.data("marker-target"));
        var $marker_els = $marker_el.find(".marker-item");
        if ($marker_els.length > 0) {
          $.each($marker_els, function () {
            var $marker_style = $(this).data("marker-style");
            var el = document.createElement("div");
            el.className = $marker_style.className;
            el.style.backgroundImage =
              "url(" + $(this).data("icon-marker") + ")";
            el.style.width = $marker_style.style.width;
            el.style.height = $marker_style.style.height;
            new mapboxgl.Marker(el)
              .setLngLat($(this).data("position"))
              .setPopup(
                new mapboxgl.Popup({ className: $marker_style.popup.className })
                  .setHTML($(this).html())
                  .setMaxWidth($marker_style.popup.maxWidth)
              )
              .addTo(map);
          });
        } else {
          $.each(markers, function () {
            var el = document.createElement("div");
            el.className = this.className;
            el.style.backgroundImage = "url(" + this.backgroundImage + ")";
            el.style.backgroundRepeat = this.backgroundRepeat;
            el.style.width = this.width;
            el.style.height = this.height;
            var marker = new mapboxgl.Marker(el)
              .setLngLat(this.position)
              .addTo(map);
          });
        }
        map.scrollZoom.disable();
        map.addControl(new mapboxgl.NavigationControl());
        map.on("load", function () {
          map.resize();
        });
      });
    },
  };
  APP.countdown = {
    init: function () {
      var $countDownEl = $("[data-countdown]");
      if ($countDownEl.length < 1) {
        return;
      }
      var $endTime = $countDownEl.data("countdown-end");
      var countDownDate = new Date($endTime).getTime();
      var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        $(".day").html(days);
        $(".hour").html(("0" + hours).slice(-2));
        $(".minute").html(("0" + minutes).slice(-2));
        $(".second").html(("0" + seconds).slice(-2));
        if (distance < 0) {
          clearInterval(x);
        }
      }, 1000);
    },
  };
  APP.canvas = {
    init: function () {
      var options_default = { container: ".canvas-sidebar" };
      var $canvas_buttons = $("[data-canvas]");
      $canvas_buttons.each(function () {
        var $this = $(this);
        var options = $this.data("canvas-options");
        options = $.extend({}, options_default, options);
        var $container = $(options.container);
        $this.on("click", function () {
          $container.addClass("show");
        });
        $container.find(".canvas-close").on("click", function () {
          $container.removeClass("show");
        });
      });
    },
  };
  APP.shopVariations = {
    init: function () {
      var swatch = $(".shop-swatch"),
        swatchesItem = swatch.find(".swatches-item"),
        swatchesSelect = swatch.find(".swatches-select");
      if (swatch.length < 1 && swatchesItem.length < 1) {
        return;
      }
      swatchesItem.unbind("click").on("click", function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass("selected")) {
          return false;
        }
        $this.parent().siblings().removeClass("selected");
        $this.parent().addClass("selected");
        swatchesSelect.val($this.attr("data-var"));
        swatch.find("label .var").html($this.attr("data-var"));
      });
    },
  };
  $(document).ready(function () {
    APP.init();
    APP.slickSlider.init();
    APP.counter.init();
    APP.util.init();
    APP.CollapseTabsAccordion.init();
    APP.animation.init();
    APP.headerSticky.init();
    APP.sidebarSticky.init();
    APP.mapbox.init();
    APP.countdown.init();
    APP.canvas.init();
    APP.shopVariations.init();
  });
})(jQuery);


//forogot password

function checkemail() {
  const check = document.getElementById("check");
  const email = document.getElementById("email").value;
  const data = { email };
  event.preventDefault();

  let countdown = 20;
  function updateCountdown() {
    document.getElementById("countdown").textContent =
      "Resend in : " + countdown;

    if (countdown < 1) {
      clearInterval(count);
      document.getElementById("collapse").disabled = false;
      document.getElementById("countdown").textContent = "";
    } else {
      countdown--;
    }
  }
  const count = setInterval(updateCountdown, 1000);

  $.ajax({
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
    url: "/checkemail",
    success: function (response) {
      if (response.success) {
        document.getElementById("view").style.display = "flex";
        document.getElementById("collapse").disabled = true;
        document.getElementById("checkbutton").style.display = "none";

        check.innerHTML = response.message;
      } else {
        check.innerHTML = response.error;
      }
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
}

function sendforgotOTP() {
  const email = document.getElementById("email").value;
  const data = { email };
  $.ajax({
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
    url: "/checkemail", //
    success: function (response) {
      document.getElementById("view").style.display = "flex";
      document.getElementById("collapse").disabled = true;
    },
    error: function () {},
  });

  let countdown = 60;

  function updateCountdown() {
    document.getElementById("countdown").textContent =
      "Resend in : " + countdown;

    if (countdown < 1) {
      clearInterval(countdownInterval);
      document.getElementById("collapse").disabled = false;
      document.getElementById("countdown").textContent = "";
    } else {
      countdown--;
    }
  }
  const countdownInterval = setInterval(updateCountdown, 1000);
}

function verifyOTP() {
  const otpValue = document.getElementById("otp").value;
  $.ajax({
    type: "POST",
    url: "/verify-otp",
    data: { otp: otpValue },
    success: function (response) {
      document.getElementById("result").innerHTML = response.message;
      if (response.success) {
        document.getElementById("result").style.color = "green";
        document.getElementById("email").readOnly = true;
        document.getElementById("otp").style.display = "none";
        (document.getElementById("collapse").disabled = true),
          document
            .getElementById("dummy")
            .removeChild(document.getElementById("countdown")),
          (document.getElementById("verify").style.display = "none");
        document.getElementById("passwordfield").style.display = "block";
      }
    },
    error: function () {
      document.getElementById("result").innerHTML =
        "Error occurred while verifying OTP.";
    },
  });
  email.ariaReadOnly = true;
}

function checkPasswordMatch() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;
  const messageElement = document.getElementById("passwordMatchMessage");
  const submitButton = document.getElementById("signupbtn");

  if (password === confirmPassword) {
    messageElement.textContent = "Passwords match!";
    messageElement.style.color = "green";
    submitButton.disabled = false;
  } else {
    messageElement.textContent = "Passwords do not match!";
    messageElement.style.color = "red";
    submitButton.disabled = true;
  }
}

function isstrong(password) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password);


  let message = 'Password strength :'
  if(password.length<=minLength){
    message += 'Too short.'
    document.getElementById('strong-password').classList = 'text-danger'
  }
  else if(!hasUppercase || !hasDigit || !hasLowercase || !hasSpecialChar){
    message += 'Password missing  digits,lowercase,uppercase or special characters.'
    document.getElementById('strong-password').classList = 'text-danger'
  }
  else{
    message+= 'Strong'
    document.getElementById('strong-password').classList = 'text-success'
  }

  document.getElementById('strong-password').textContent = message
  
}

function sendOTP() {
  document.getElementById("view").style.display = "flex";
  document.getElementById("collapse").disabled = true;

  const email = document.getElementById("email").value;
  const data = { email };
  $.ajax({
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
    url: "/send-otp", //
    success: function (response) {},
    error: function () {},
  });

  let countdown = 60;

  function updateCountdown() {
    document.getElementById("countdown").textContent =
      "Resend in : " + countdown;

    if (countdown < 1) {
      clearInterval(countdownInterval);
      document.getElementById("collapse").disabled = false;
      document.getElementById("countdown").textContent = "";
    } else {
      countdown--;
    }
  }
  const countdownInterval = setInterval(updateCountdown, 1000);
}


function viewbutton() {
  document.getElementById("collapse").style.display = "block";
}

function addtocart(id) {
  try {
    document.getElementById('errornumber').innerHTML = ""
    const productid = id
  const counts = document.getElementById(`count${productid}`).value;
  
  $.ajax({
    type: "POST",
    url: "/addtocart",
    data: { product: productid,
            count : counts },
    success: function (response) {
      console.log('done',response)
      if(response.message){
        document.getElementById('errornumber').innerHTML = "Atleast one should be added"
      }
      else{
      getcartdata();}
    },
    error: function (error) {
      console.log(error)
      document.getElementById('errornumber').innerHTML = "Value should be atleast one"
    },
  })
  } catch (error) {
    console.log(error)
    document.getElementById('errornumber').innerHTML = "Value should be atleast one"
    
  }
  
  
  // email.ariaReadOnly = true;
}

function getcartdata(){
  document.getElementById('abcd').innerHTML = '';
  document.getElementById('totalprice').innerHTML= '';
  $.ajax({
    type: 'GET',
    url: '/cartdetails',
    success: function (response) {
      console.log('done')
      console.log(response)
      let cart = response.cart;
      let totalPrice = response.totalPrice;
      let product = cart.products
      console.log(cart.products.length);
      document.getElementById('countnumber').textContent = cart.products.length
    for(let i = 0 ; i < product.length ; i++ ){
      const prod = product[i].product
      const maindiv = document.createElement('div');
        maindiv.classList.add('cart-item'); // Add the 'cart-item' class to the main container

        const img = document.createElement('img');
        img.src = "../imgs/uploads/" + prod.image[0];
        maindiv.appendChild(img);

        const div = document.createElement('div');
        div.textContent = prod.name;
        div.classList.add('product-name'); // Add the 'product-name' class to the product name
        maindiv.appendChild(div);

        const price = document.createElement('div');
        price.textContent = prod.price + ' X ' + product[i].count;
        price.classList.add('product-price'); // Add the 'product-price' class to the product price
        maindiv.appendChild(price);

        document.getElementById('abcd').appendChild(maindiv);
      } const totalDiv = document.createElement('div');
      totalDiv.textContent = totalPrice.toFixed(2); // Display total price with 2 decimal places
      document.getElementById('totalprice').appendChild(totalDiv);

    },
    error: function () {console.log(error)
     
    },
  })
}

// document.getElementById('testing').addEventListener('click',function() {
//   $('.img-zoom').zoom();
// });
// jQuery(document).ready(function() {
//   jQuery('.imgZoom').mooZoom({
//     zoom: {
//       width: 250,
//       height: 250,
//       zIndex: 600,
//     },
  
//     overlay: {
//       opacity: 0.65,
//       zIndex: 500,
//       backgroundColor: '#ffffff',
//       fade: false,
//     },
  
//     detail: {
//       opacity: 1,
//       zIndex: 600,
//       margin: {
//         top: 1,
//         left: 100,
//       },                    
//       fade: false,
//     },
  
//     animationDuration: 1000,
  
//   });
// });

// $(".xzoom").xzoom({tint: '#333', Xoffset: 15});

// Execute the code directly when needed, without relying on a modal event
// $(document).ready(function() {
//   $(".product-image-slider").slick("setPosition");
//   $(".slider-nav-thumbnails").slick({
//     dots: true,
//     infinite: true,
//     slidesToShow: 4,
//     slidesToScroll: 4
//   });

//   // Apply elevateZoom to the active image in the product image slider
//   $(".product-image-slider .slick-active img").elevateZoom({
//     zoomType: "inner",
//     cursor: "crosshair",
//     zoomWindowFadeIn: 500,
//     zoomWindowFadeOut: 750,
//   });
// });

$(document).ready(function() {
  $(".product-image-slider").slick({
    prevArrow: false,
    nextArrow: false
  });

  $(".slider-nav-thumbnails").slick({
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.product-image-slider',
    prevArrow: false,
    nextArrow: false
  });

  $(".product-image-slider").on('clic', function(event, slick, currentSlide) {
    $(".product-image-slider .slick-active img").elevateZoom({
      zoomType: "inner",
      cursor: "crosshair",
      zoomWindowFadeIn: 500,
      zoomWindowFadeOut: 750,
    });
  });

  $(".slider-nav-thumbnails .slick-slide").on("click", function() {
    const index = $(this).data("slick-index");
    $(".product-image-slider").slick("slickGoTo", index);
    $(".product-image-slider .slick-active img").elevateZoom({
      zoomType: "inner",
      cursor: "crosshair",
      zoomWindowFadeIn: 500,
      zoomWindowFadeOut: 750,
    });
  });
});



// $(".btn-close").on("click", function (e) {
//   $(".zoomContainer").remove();
// });

// $("#quickViewModal").on("show.bs.modal", function (e) {
//   $(document).click(function (e) {
//     var modalDialog = $(".modal-dialog");
//     if (!modalDialog.is(e.target) && modalDialog.has(e.target).length === 0) {
//       $(".zoomContainer").remove();
//     }
//   });
// });