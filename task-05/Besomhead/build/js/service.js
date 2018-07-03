/* eslint-disable */

var CONFIGURATOR_PATH =
    "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task05/task-05/Besomhead/build/html/chat_configurator.html",
  DASHBOARD_PATH =
    "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task05/task-05/Besomhead/build/html/dashboard.html",
  ABOUT_PATH =
    "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task05/task-05/Besomhead/build/html/about.html",
  DM = (function() {
    return (
      (this.getDOMElement = function(e) {
        return "string" == typeof e ? document.getElementById(e) : e;
      }),
      (this.getDOMChildrenByTag = function(e, t) {
        return Array.from(this.getDOMElement(e).getElementsByTagName(t));
      }),
      (this.getDOMChildrenByClass = function(e, t) {
        return Array.from(this.getDOMElement(e).getElementsByClassName(t));
      }),
      (this.createDOMElement = document.createElement.bind(document)),
      (this.appendDOMElement = function(e, t) {
        this.getDOMElement(e).appendChild(t);
      }),
      (this.removeDOMElement = function(e, t) {
        this.getDOMElement(e).removeChild(this.getDOMElement(t));
      }),
      (this.addListener = function(e, t, n) {
        this.getDOMElement(e).addEventListener(t, n);
      }),
      (this.removeListener = function(e, t, n) {
        this.getDOMElement(e).removeEventListener(t, n);
      }),
      (this.addCSSClass = function(t) {
        var n = this;
        Array.from(arguments)
          .slice(1)
          .forEach(function(e) {
            n.getDOMElement(t).classList.add(e);
          });
      }),
      (this.removeCSSClass = function(e, t) {
        this.getDOMElement(e).classList.remove(t);
      }),
      this
    );
  })(),
  serviceFactory = (function() {
    var t = this;
    function n(e) {
      DM.getDOMElement("service-selected-content-container").src = e;
    }
    return (
      (this.appendSelectedContent = function(e) {
        switch (e) {
          case "#configurator":
            n(CONFIGURATOR_PATH);
            break;
          case "#dashboard":
            n(DASHBOARD_PATH);
            break;
          case "#about":
            n(ABOUT_PATH);
        }
      }),
      (this.appendContent = function(e) {
        "BUTTON" === e.target.tagName &&
          e.target.value !== window.location.hash &&
          (t.appendSelectedContent(e.target.value),
          (window.location.hash = e.target.value));
      }),
      t
    );
  })();
window.addEventListener("load", function() {
  DM.addListener(
    "service-buttons-container",
    "click",
    serviceFactory.appendContent
  ),
    serviceFactory.appendSelectedContent(window.location.hash);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2UuanMiXSwibmFtZXMiOlsiQ09ORklHVVJBVE9SX1BBVEgiLCJEQVNIQk9BUkRfUEFUSCIsIkFCT1VUX1BBVEgiLCJETSIsInRoaXMiLCJnZXRET01FbGVtZW50IiwiaWR0ZiIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRET01DaGlsZHJlbkJ5VGFnIiwicm9vdCIsInRhZyIsIkFycmF5IiwiZnJvbSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZ2V0RE9NQ2hpbGRyZW5CeUNsYXNzIiwiY2xhc3NOYW1lIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImNyZWF0ZURPTUVsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYmluZCIsImFwcGVuZERPTUVsZW1lbnQiLCJlbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVET01FbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJhZGRMaXN0ZW5lciIsImV2ZW50IiwiY2FsbGJhY2siLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYWRkQ1NTQ2xhc3MiLCJzZWxmIiwiYXJndW1lbnRzIiwic2xpY2UiLCJmb3JFYWNoIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlQ1NTQ2xhc3MiLCJyZW1vdmUiLCJzZXJ2aWNlRmFjdG9yeSIsImFkZFNvdXJjZVRvSUZyYW1lIiwic291cmNlIiwic3JjIiwiYXBwZW5kU2VsZWN0ZWRDb250ZW50IiwiaGFzaCIsImFwcGVuZENvbnRlbnQiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidmFsdWUiLCJ3aW5kb3ciLCJsb2NhdGlvbiJdLCJtYXBwaW5ncyI6IkFBSUEsSUFBSUEsa0JBQ0Ysa0hBQ0VDLGVBQ0YsMEdBQ0VDLFdBQ0Ysc0dBSUVDLEdBQUssV0F3Q1AsT0F2Q0FDLEtBQUtDLGNBQWdCLFNBQW9CQyxHQUN2QyxNQUF1QixpQkFBVEEsRUFBb0JDLFNBQVNDLGVBQWVGLEdBQVFBLEdBRXBFRixLQUFLSyxvQkFBc0IsU0FBOEJDLEVBQU1DLEdBQzdELE9BQU9DLE1BQU1DLEtBQUtULEtBQUtDLGNBQWNLLEdBQU1JLHFCQUFxQkgsS0FFbEVQLEtBQUtXLHNCQUF3QixTQUMzQkwsRUFDQU0sR0FFQSxPQUFPSixNQUFNQyxLQUNYVCxLQUFLQyxjQUFjSyxHQUFNTyx1QkFBdUJELEtBR3BEWixLQUFLYyxpQkFBbUJYLFNBQVNZLGNBQWNDLEtBQUtiLFVBQ3BESCxLQUFLaUIsaUJBQW1CLFNBQWdCWCxFQUFNWSxHQUM1Q2xCLEtBQUtDLGNBQWNLLEdBQU1hLFlBQVlELElBRXZDbEIsS0FBS29CLGlCQUFtQixTQUFnQmQsRUFBTVksR0FDNUNsQixLQUFLQyxjQUFjSyxHQUFNZSxZQUFZckIsS0FBS0MsY0FBY2lCLEtBRTFEbEIsS0FBS3NCLFlBQWMsU0FBMEJoQixFQUFNaUIsRUFBT0MsR0FDeER4QixLQUFLQyxjQUFjSyxHQUFNbUIsaUJBQWlCRixFQUFPQyxJQUVuRHhCLEtBQUswQixlQUFpQixTQUE2QnBCLEVBQU1pQixFQUFPQyxHQUM5RHhCLEtBQUtDLGNBQWNLLEdBQU1xQixvQkFBb0JKLEVBQU9DLElBRXREeEIsS0FBSzRCLFlBQWMsU0FBcUJ0QixHQUN0QyxJQUFJdUIsRUFBTzdCLEtBQ1hRLE1BQU1DLEtBQUtxQixXQUNSQyxNQUFNLEdBQ05DLFFBQVEsU0FBb0JwQixHQUMzQmlCLEVBQUs1QixjQUFjSyxHQUFNMkIsVUFBVUMsSUFBSXRCLE1BRzdDWixLQUFLbUMsZUFBaUIsU0FBd0I3QixFQUFNTSxHQUNsRFosS0FBS0MsY0FBY0ssR0FBTTJCLFVBQVVHLE9BQU94QixJQUdyQ1osS0F4Q0EsR0E4Q0xxQyxlQUFpQixXQUNuQixJQUFJUixFQUFPN0IsS0FFWCxTQUFTc0MsRUFBa0JDLEdBQ3pCeEMsR0FBR0UsY0FBYyxzQ0FBc0N1QyxJQUFNRCxFQThCL0QsT0EzQkF2QyxLQUFLeUMsc0JBQXdCLFNBQStCQyxHQUMxRCxPQUFRQSxHQUNOLElBQUssZ0JBQ0hKLEVBQWtCMUMsbUJBQ2xCLE1BQ0YsSUFBSyxhQUNIMEMsRUFBa0J6QyxnQkFDbEIsTUFDRixJQUFLLFNBQ0h5QyxFQUFrQnhDLGNBTXhCRSxLQUFLMkMsY0FBZ0IsU0FBdUJwQixHQUNiLFdBQXpCQSxFQUFNcUIsT0FBT0MsU0FHYnRCLEVBQU1xQixPQUFPRSxRQUFVQyxPQUFPQyxTQUFTTixPQUkzQ2IsRUFBS1ksc0JBQXNCbEIsRUFBTXFCLE9BQU9FLE9BQ3hDQyxPQUFPQyxTQUFTTixLQUFPbkIsRUFBTXFCLE9BQU9FLFFBRy9CakIsRUFsQ1ksR0FxQ3JCa0IsT0FBT3RCLGlCQUFpQixPQUFRLFdBQzlCMUIsR0FBR3VCLFlBQ0QsNEJBQ0EsUUFDQWUsZUFBZU0sZUFFakJOLGVBQWVJLHNCQUFzQk0sT0FBT0MsU0FBU04iLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGV4cG9ydGVkIENPTkZJR1VSQVRPUl9QQVRIIERBU0hCT0FSRF9QQVRIIEFCT1VUX1BBVEggKi9cclxuLyogZ2xvYmFsIHNlcnZpY2VGYWN0b3J5ICovXHJcbi8qIGdsb2JhbCBETSAqL1xyXG5cclxudmFyIENPTkZJR1VSQVRPUl9QQVRIID1cclxuICBcImh0dHBzOi8vcmF3Z2l0LmNvbS9CZXNvbWhlYWQvanMtLXRvdWNoc29mdC9iZXNvbWhlYWQtdGFzazA1L3Rhc2stMDUvQmVzb21oZWFkL2J1aWxkL2h0bWwvY2hhdF9jb25maWd1cmF0b3IuaHRtbFwiO1xyXG52YXIgREFTSEJPQVJEX1BBVEggPVxyXG4gIFwiaHR0cHM6Ly9yYXdnaXQuY29tL0Jlc29taGVhZC9qcy0tdG91Y2hzb2Z0L2Jlc29taGVhZC10YXNrMDUvdGFzay0wNS9CZXNvbWhlYWQvYnVpbGQvaHRtbC9kYXNoYm9hcmQuaHRtbFwiO1xyXG52YXIgQUJPVVRfUEFUSCA9XHJcbiAgXCJodHRwczovL3Jhd2dpdC5jb20vQmVzb21oZWFkL2pzLS10b3VjaHNvZnQvYmVzb21oZWFkLXRhc2swNS90YXNrLTA1L0Jlc29taGVhZC9idWlsZC9odG1sL2Fib3V0Lmh0bWxcIjtcclxuXHJcbi8qIGV4cG9ydGVkIERNICovXHJcblxyXG52YXIgRE0gPSAoZnVuY3Rpb24gRE9NTWFuYWdlcigpIHtcclxuICB0aGlzLmdldERPTUVsZW1lbnQgPSBmdW5jdGlvbiBnZXRFbGVtZW50KGlkdGYpIHtcclxuICAgIHJldHVybiB0eXBlb2YgaWR0ZiA9PT0gXCJzdHJpbmdcIiA/IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkdGYpIDogaWR0ZjtcclxuICB9O1xyXG4gIHRoaXMuZ2V0RE9NQ2hpbGRyZW5CeVRhZyA9IGZ1bmN0aW9uIGdldENoaWxkcmVuQnlUYWdOYW1lKHJvb3QsIHRhZykge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5nZXRET01FbGVtZW50KHJvb3QpLmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZykpO1xyXG4gIH07XHJcbiAgdGhpcy5nZXRET01DaGlsZHJlbkJ5Q2xhc3MgPSBmdW5jdGlvbiBnZXRDaGlsZHJlbkJ5Q2xhc3NOYW1lKFxyXG4gICAgcm9vdCxcclxuICAgIGNsYXNzTmFtZVxyXG4gICkge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20oXHJcbiAgICAgIHRoaXMuZ2V0RE9NRWxlbWVudChyb290KS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZSlcclxuICAgICk7XHJcbiAgfTtcclxuICB0aGlzLmNyZWF0ZURPTUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50LmJpbmQoZG9jdW1lbnQpO1xyXG4gIHRoaXMuYXBwZW5kRE9NRWxlbWVudCA9IGZ1bmN0aW9uIGFwcGVuZChyb290LCBlbGVtZW50KSB7XHJcbiAgICB0aGlzLmdldERPTUVsZW1lbnQocm9vdCkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgfTtcclxuICB0aGlzLnJlbW92ZURPTUVsZW1lbnQgPSBmdW5jdGlvbiByZW1vdmUocm9vdCwgZWxlbWVudCkge1xyXG4gICAgdGhpcy5nZXRET01FbGVtZW50KHJvb3QpLnJlbW92ZUNoaWxkKHRoaXMuZ2V0RE9NRWxlbWVudChlbGVtZW50KSk7XHJcbiAgfTtcclxuICB0aGlzLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcihyb290LCBldmVudCwgY2FsbGJhY2spIHtcclxuICAgIHRoaXMuZ2V0RE9NRWxlbWVudChyb290KS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjayk7XHJcbiAgfTtcclxuICB0aGlzLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcihyb290LCBldmVudCwgY2FsbGJhY2spIHtcclxuICAgIHRoaXMuZ2V0RE9NRWxlbWVudChyb290KS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjayk7XHJcbiAgfTtcclxuICB0aGlzLmFkZENTU0NsYXNzID0gZnVuY3Rpb24gYWRkQ1NTQ2xhc3Mocm9vdCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgQXJyYXkuZnJvbShhcmd1bWVudHMpXHJcbiAgICAgIC5zbGljZSgxKVxyXG4gICAgICAuZm9yRWFjaChmdW5jdGlvbiBhZGRDbGFzc2VzKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHNlbGYuZ2V0RE9NRWxlbWVudChyb290KS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgICAgIH0pO1xyXG4gIH07XHJcbiAgdGhpcy5yZW1vdmVDU1NDbGFzcyA9IGZ1bmN0aW9uIHJlbW92ZUNTU0NsYXNzKHJvb3QsIGNsYXNzTmFtZSkge1xyXG4gICAgdGhpcy5nZXRET01FbGVtZW50KHJvb3QpLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufSkoKTtcclxuLyogZXhwb3J0ZWQgc2VydmljZUZhY3RvcnkgKi9cclxuLyogZ2xvYmFsIERNICovXHJcbi8qIGdsb2JhbCBDT05GSUdVUkFUT1JfUEFUSCBEQVNIQk9BUkRfUEFUSCBBQk9VVF9QQVRIICovXHJcblxyXG52YXIgc2VydmljZUZhY3RvcnkgPSAoZnVuY3Rpb24gU2VydmljZUZhY3RvcnkoKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBmdW5jdGlvbiBhZGRTb3VyY2VUb0lGcmFtZShzb3VyY2UpIHtcclxuICAgIERNLmdldERPTUVsZW1lbnQoXCJzZXJ2aWNlLXNlbGVjdGVkLWNvbnRlbnQtY29udGFpbmVyXCIpLnNyYyA9IHNvdXJjZTtcclxuICB9XHJcblxyXG4gIHRoaXMuYXBwZW5kU2VsZWN0ZWRDb250ZW50ID0gZnVuY3Rpb24gYXBwZW5kU2VsZWN0ZWRDb250ZW50KGhhc2gpIHtcclxuICAgIHN3aXRjaCAoaGFzaCkge1xyXG4gICAgICBjYXNlIFwiI2NvbmZpZ3VyYXRvclwiOlxyXG4gICAgICAgIGFkZFNvdXJjZVRvSUZyYW1lKENPTkZJR1VSQVRPUl9QQVRIKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIiNkYXNoYm9hcmRcIjpcclxuICAgICAgICBhZGRTb3VyY2VUb0lGcmFtZShEQVNIQk9BUkRfUEFUSCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCIjYWJvdXRcIjpcclxuICAgICAgICBhZGRTb3VyY2VUb0lGcmFtZShBQk9VVF9QQVRIKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB0aGlzLmFwcGVuZENvbnRlbnQgPSBmdW5jdGlvbiBhcHBlbmRDb250ZW50KGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgIT09IFwiQlVUVE9OXCIpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50LnRhcmdldC52YWx1ZSA9PT0gd2luZG93LmxvY2F0aW9uLmhhc2gpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuYXBwZW5kU2VsZWN0ZWRDb250ZW50KGV2ZW50LnRhcmdldC52YWx1ZSk7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gc2VsZjtcclxufSkoKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiBpbml0KCkge1xyXG4gIERNLmFkZExpc3RlbmVyKFxyXG4gICAgXCJzZXJ2aWNlLWJ1dHRvbnMtY29udGFpbmVyXCIsXHJcbiAgICBcImNsaWNrXCIsXHJcbiAgICBzZXJ2aWNlRmFjdG9yeS5hcHBlbmRDb250ZW50XHJcbiAgKTtcclxuICBzZXJ2aWNlRmFjdG9yeS5hcHBlbmRTZWxlY3RlZENvbnRlbnQod2luZG93LmxvY2F0aW9uLmhhc2gpO1xyXG59KTsiXX0=