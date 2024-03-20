/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
(function($) {
    $.extend($.fn, {
        mooZoom: function(options) {
            var self = this;
                        
            return this.each(function () {
                $(this).parent().css('position', 'relative');                
                $(this).mouseenter(function () {
                    self.onMouseEnter(this, options);
                });
            });
        },
        onMouseEnter: function(el, options) {            
            this._top = $(el).offset().top;
            this._left = $(el).offset().left;
            this._relTop = $(el).position().top;
            this._relLeft = $(el).position().left;
            
            var defaults = {
                zoom: {
                    width: 100,
                    height: 100,
                    zIndex: 600
                },
                overlay: {
                    opacity: 0.65,
                    zIndex: 500,
                    backgroundColor: '#ffffff',
                    fade: false
                },
                detail: {
                    opacity: 1,
                    zIndex: 600,
                    margin: {
                        top: 0,
                        left: 0
                    },                    
                    fade: false 
                },
                animationDuration: 1000
            }
            
            this.options =  $.extend(true, {}, defaults, options);
            
            var ref = $(el).attr('ref');
            if (typeof ref === 'undefined' && ref === false) {
                return;
            }
            
            // read big image
            this.bigImage = new Image();            
            this.bigImage.src = ref;
            
            // read preview image
            this.image = new Image();
            this.image.src = $(el).attr('src');
            
            var self = this;
            this.bigImage.onload = function() {
            
                self.factor = self.bigImage.width / self.image.width;

                $(window).unbind('mousemove');
                $('.mooZoom-overlay').remove();
                $('.mooZoom-detail').remove();
                $('.mooZoom-big-detail').remove();
                $('<div class="mooZoom-overlay"></div>').appendTo('body');
                $('.mooZoom-overlay').css({
                    position: 'absolute',
                    top: self._top + 'px',
                    left: self._left + 'px',
                    width: jQuery(el).width(),
                    height: jQuery(el).height(),
                    backgroundColor: self.options.overlay.backgroundColor,
                    opacity: 0,
                    zIndex: self.options.overlay.zIndex
                });
                if (self.options.overlay.fade) {
                    $('.mooZoom-overlay').animate({opacity: self.options.overlay.opacity}, self.options.animationDuration);
                } else {
                    $('.mooZoom-overlay').css({
                        opacity: self.options.overlay.opacity
                    });
                }

                $(window).mousemove(function(e) {
                    if ($(e.target).hasClass('mooZoom-overlay') 
                        || $(e.target).hasClass('mooZoom-detail')
                        || $(e.target).hasClass('imgZoom')) {
                        self.onMouseMove(e, el);
                    } else {
                        $('.mooZoom-overlay').remove();
                        $('.mooZoom-detail').remove();
                        $('.mooZoom-big-detail').remove();
                        $(window).unbind('mousemove');
                    }             
                });
            }
        },
        onMouseMove: function(e, el) {
            var overlay = $('.mooZoom-detail');            
            var detail = $('.mooZoom-big-detail');
            if ($(overlay).length === 0) {
                $('<div class="mooZoom-detail"></div>').appendTo('body');
            }

            if ($(detail).length === 0) {
                $('<div class="mooZoom-big-detail"></div>').appendTo($(el).parent());
                $('.mooZoom-big-detail').css({
                    position: 'absolute',
                    top: (parseInt(this._relTop) + parseInt(this.options.detail.margin.top)) + 'px',
                    left: (parseInt($(el).outerWidth(true)) + parseInt(this.options.detail.margin.left)) + 'px',
                    width: (this.options.zoom.width * this.factor) + 'px',
                    height: (this.options.zoom.height * this.factor) + 'px',
                    zIndex: this.options.detail.zIndex,
                    opacity: 0,
                    backgroundImage: 'url(' + $(el).attr('ref') + ')'
                });

                if (this.options.detail.fade) {
                    $('.mooZoom-big-detail').animate({opacity: this.options.detail.opacity}, this.options.animationDuration);
                } else {
                    $('.mooZoom-big-detail').css({
                        opacity: this.options.detail.opacity
                    });
                }
            }
            
            var top = this.topPosition(e, el, this.options.zoom.height);
            var left = this.leftPosition(e, el, this.options.zoom.width);
            var pos = '-' + left.bg + 'px -' + top.bg + 'px';
            
            var posBig = '-' + (left.bg * this.factor) + 'px -' + (top.bg * this.factor) + 'px';
            $(detail).css('background-position', posBig);
            $(overlay).css({
                position: 'absolute',
                top: top.top,
                left: left.left,
                width: this.options.zoom.width + 'px',
                height: this.options.zoom.height + 'px',
                zIndex: this.options.zoom.zIndex,
                backgroundImage: 'url(' + $(el).attr('src') + ')'
            });            
            $(overlay).css('background-position', pos);
        },
        topPosition: function(e, el, height) {
            var pos = {top: (e.pageY - (height / 2)), bg: (e.pageY - this._top - (height / 2))};
            if (pos.top <= this._top) {
                pos.top = this._top;
                pos.bg = 0;
            } else if (pos.top >= this._top + ($(el).height() - height)) {
                pos.top = this._top + ($(el).height() - height);
                pos.bg = ($(el).height() - height);
            }
            return pos;
        },
        leftPosition: function(e, el, width) {
            var pos = {left: (e.pageX - (width / 2)), bg: (e.pageX - this._left - (width / 2))};
            if (pos.left <= this._left) {
                pos.left = this._left;
                pos.bg = 0;
            } else if (pos.left >= this._left + ($(el).width() - width)) {
                pos.left = this._left + ($(el).width() - width);
                pos.bg = ($(el).width() - width);
            }
            return pos;
        }
    });
})(jQuery);