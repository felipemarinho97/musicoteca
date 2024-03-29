angular.module('angularResizable', [])
    .directive('resizable', function() {
        var toCall;
        function throttle(fun) {
            if (toCall === undefined) {
                toCall = fun;
                setTimeout(function() {
                    toCall();
                    toCall = undefined;
                }, 100);
            } else {
                toCall = fun;
            }
        }
        return {
            restrict: 'AE',
            scope: {
                rDirections: "=",
                rCenteredX: "=",
                rCenteredY: "=",
                rWidth: "=",
                rHeight: "=",
                rFlex: "=",
                rGrabber: "@"
            },
            link: function(scope, element, attr) {

                // register watchers on width and height attributes if they are set
                scope.$watch('rWidth', function(value){
                    element[0].style.width = scope.rWidth + 'px';
                });
                scope.$watch('rHeight', function(value){
                    element[0].style.height = scope.rHeight + 'px';
                });

                element.addClass('resizable');

                var style = window.getComputedStyle(element[0], null),
                    w,
                    h,
                    dir = scope.rDirections,
                    vx = scope.rCenteredX ? 2 : 1, // if centered double velocity
                    vy = scope.rCenteredY ? 2 : 1, // if centered double velocity
                    inner = scope.rGrabber ? scope.rGrabber : '<span></span>',
                    start,
                    dragDir,
                    axis,
                    info = {};

                var updateInfo = function() {
                    info.width = false; info.height = false;
                    if(axis == 'x')
                        info.width = scope.rFlex ? parseInt(element[0].style.flexBasis) : parseInt(element[0].style.width);
                    else
                        info.height = scope.rFlex ? parseInt(element[0].style.flexBasis) : parseInt(element[0].style.height);
                    info.id = element[0].id;
                }

                var dragging = function(e) {
                    var offset = axis == 'x' ? start - e.clientX : start - e.clientY;
                    switch(dragDir) {
                        case 'top':
                            if(scope.rFlex) { element[0].style.flexBasis = h + (offset * vy) + 'px'; }
                            else {            element[0].style.height = h + (offset * vy) + 'px'; }
                            break;
                        case 'right':
                            if(scope.rFlex) { element[0].style.flexBasis = w - (offset * vx) + 'px'; }
                            else {            element[0].style.width = w - (offset * vx) + 'px'; }
                            break;
                        case 'bottom':
                            if(scope.rFlex) { element[0].style.flexBasis = h - (offset * vy) + 'px'; }
                            else {            element[0].style.height = h - (offset * vy) + 'px'; }
                            break;
                        case 'left':
                            if(scope.rFlex) { element[0].style.flexBasis = w + (offset * vx) + 'px'; }
                            else {            element[0].style.width = w + (offset * vx) + 'px'; }
                            break;
                    }
                    updateInfo();
                    throttle(function() { scope.$emit("angular-resizable.resizing", info);});
                };
                var draggingTouch = function(event) {
                    var e = event.changedTouches[0];

                    var offset = axis == 'x' ? start - e.clientX : start - e.clientY;
                    switch(dragDir) {
                        case 'top':
                            if(scope.rFlex) { element[0].style.flexBasis = h + (offset * vy) + 'px'; }
                            else {            element[0].style.height = h + (offset * vy) + 'px'; }
                            break;
                        case 'right':
                            if(scope.rFlex) { element[0].style.flexBasis = w - (offset * vx) + 'px'; }
                            else {            element[0].style.width = w - (offset * vx) + 'px'; }
                            break;
                        case 'bottom':
                            if(scope.rFlex) { element[0].style.flexBasis = h - (offset * vy) + 'px'; }
                            else {            element[0].style.height = h - (offset * vy) + 'px'; }
                            break;
                        case 'left':
                            if(scope.rFlex) { element[0].style.flexBasis = w + (offset * vx) + 'px'; }
                            else {            element[0].style.width = w + (offset * vx) + 'px'; }
                            break;
                    }
                    updateInfo();
                    throttle(function() { scope.$emit("angular-resizable.resizing", info);});
                };
                var dragEnd = function(e) {
                    updateInfo();
                    scope.$emit("angular-resizable.resizeEnd", info);
                    scope.$apply();
                    document.removeEventListener('mouseup', dragEnd, false);
                    document.removeEventListener('mousemove', dragging, false);
                    document.removeEventListener('touchend', dragEnd, false);
                    document.removeEventListener('touchmove', draggingTouch, false);
                    element.removeClass('no-transition');
                };
                var dragStart = function(e, direction) {
                    dragDir = direction;
                    axis = dragDir == 'left' || dragDir == 'right' ? 'x' : 'y';
                    start = axis == 'x' ? e.clientX : e.clientY;
                    w = parseInt(style.getPropertyValue("width"));
                    h = parseInt(style.getPropertyValue("height"));

                    //prevent transition while dragging
                    element.addClass('no-transition');

                    document.addEventListener('mouseup', dragEnd, false);
                    document.addEventListener('mousemove', dragging, false);

                    document.addEventListener('touchend', dragEnd, false);
                    document.addEventListener('touchmove', draggingTouch, false);

                    // Disable highlighting while dragging
                    if(e.stopPropagation) e.stopPropagation();
                    if(e.preventDefault) e.preventDefault();
                    e.cancelBubble = true;
                    e.returnValue = false;

                    updateInfo();
                    scope.$emit("angular-resizable.resizeStart", info);
                    scope.$apply();
                };

                for(var i=0;i<dir.length;i++) {
                    (function () {
                        var grabber = document.createElement('div'),
                            direction = dir[i];

                        // add class for styling purposes
                        grabber.setAttribute('class', 'rg-' + dir[i]);
                        grabber.innerHTML = inner;
                        element[0].appendChild(grabber);
                        grabber.ondragstart = function() { return false }
                        grabber.addEventListener('mousedown', function(e) {
                            dragStart(e, direction);
                        }, false);
                        grabber.addEventListener('touchstart', function(e) {
                            var touchobj = e.changedTouches[0];
                            dragStart(touchobj, direction);
                        }, false);
                    }())
                }

            }
        }
    });
