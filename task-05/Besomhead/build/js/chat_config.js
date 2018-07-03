/* eslint-disable */

var config = {
    chatFilePath:
      "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task05/task-05/Besomhead/build/js/chat.js"
  },
  configFactory = (function(e) {
    var t = "change",
      n = "chat-configurator-chat-title",
      a = "chat-configurator-chat-url",
      i = "chat-configurator-chat-css-class",
      r = "chat-configurator-ui-minimize",
      c = "chat-configurator-ui-drag",
      o = "chat-configurator-ui-require-name",
      s = "chat-configurator-ui-show-date",
      h = "chat-configurator-network-xhr",
      d = "chat-configurator-network-fetch",
      l = '<script src="' + e.chatFilePath + "?",
      m = '"></script>',
      u = this;
    function g(e) {
      return "'".concat(e).concat("'");
    }
    function f(e) {
      return g(DM.getDOMElement(e).value);
    }
    function D(e) {
      return DM.getDOMElement(e).checked ? g("true") : g("false");
    }
    return (
      (this.createCodeExample = function() {
        var e, t;
        DM.getDOMElement("chat-configurator-code-source").value = [
          l,
          "chatTitle=",
          f(n),
          "&",
          "chatURL=",
          f(a),
          "&",
          "cssClass=",
          f(i),
          "&",
          ((t = "position="),
          DM.getDOMElement("chat-configurator-chat-position-right").selected
            ? (t = t.concat(g("right")))
            : DM.getDOMElement("chat-configurator-chat-position-left")
                .selected && (t = t.concat(g("left"))),
          t),
          "&",
          "allowMinimize=",
          D(r),
          "&",
          "allowDrag=",
          D(c),
          "&",
          "requireName=",
          D(o),
          "&",
          "showDateTime=",
          D(s),
          "&",
          ((e = "requests="),
          DM.getDOMElement(h).checked
            ? (e = e.concat(g("xhr")))
            : DM.getDOMElement(d).checked && (e = e.concat(g("fetch"))),
          e),
          m
        ].join("");
      }),
      (this.initListeners = function() {
        DM.addListener(n, t, u.createCodeExample),
          DM.addListener(a, t, u.createCodeExample),
          DM.addListener(i, t, u.createCodeExample),
          DM.addListener(
            "chat-configurator-chat-position",
            t,
            u.createCodeExample
          ),
          DM.addListener(r, t, u.createCodeExample),
          DM.addListener(c, t, u.createCodeExample),
          DM.addListener(s, t, u.createCodeExample),
          DM.addListener(o, t, u.createCodeExample),
          DM.addListener(h, t, u.createCodeExample),
          DM.addListener(d, t, u.createCodeExample);
      }),
      u
    );
  })(config),
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
  })();
window.addEventListener("load", function() {
  configFactory.initListeners(), configFactory.createCodeExample();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoYXRfY29uZmlnLmpzIl0sIm5hbWVzIjpbImNvbmZpZyIsImNoYXRGaWxlUGF0aCIsImNvbmZpZ0ZhY3RvcnkiLCJFVkVOVF9OQU1FIiwiQ0hBVF9USVRMRV9JRCIsIkNIQVRfVVJMX0lEIiwiQ0hBVF9DU1NfQ0xBU1NfSUQiLCJBTExPV19NSU5JTUlaRV9JRCIsIkFMTE9XX0RSQUdfSUQiLCJSRVFVSVJFX05BTUVfSUQiLCJTSE9XX0RBVEVfVElNRV9JRCIsIk5FVFdPUktfWEhSX0lEIiwiTkVUV09SS19GRVRDSF9JRCIsIkNPREVfRVhBTVBMRV9TVEFSVCIsIkNPREVfRVhBTVBMRV9FTkQiLCJzZWxmIiwidGhpcyIsIndyYXBXaXRoUXVvdGVzIiwic3RyIiwiY29uY2F0IiwiZ2V0SW5wdXRWYWx1ZSIsImNvbXBvbmVudElEIiwiRE0iLCJnZXRET01FbGVtZW50IiwidmFsdWUiLCJnZXRDaGVja0JveFZhbHVlIiwiY2hlY2tlZCIsImNyZWF0ZUNvZGVFeGFtcGxlIiwicmVxdWVzdFR5cGUiLCJwb3NpdGlvbiIsInNlbGVjdGVkIiwiam9pbiIsImluaXRMaXN0ZW5lcnMiLCJhZGRMaXN0ZW5lciIsImlkdGYiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZ2V0RE9NQ2hpbGRyZW5CeVRhZyIsInJvb3QiLCJ0YWciLCJBcnJheSIsImZyb20iLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImdldERPTUNoaWxkcmVuQnlDbGFzcyIsImNsYXNzTmFtZSIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJjcmVhdGVET01FbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsImJpbmQiLCJhcHBlbmRET01FbGVtZW50IiwiZWxlbWVudCIsImFwcGVuZENoaWxkIiwicmVtb3ZlRE9NRWxlbWVudCIsInJlbW92ZUNoaWxkIiwiZXZlbnQiLCJjYWxsYmFjayIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhZGRDU1NDbGFzcyIsImFyZ3VtZW50cyIsInNsaWNlIiwiZm9yRWFjaCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZUNTU0NsYXNzIiwicmVtb3ZlIiwid2luZG93Il0sIm1hcHBpbmdzIjoiQUFHQSxJQUFJQSxPQUFTLENBQ1hDLGFBQ0Usa0dBT0FDLGNBQWdCLFNBQXdCRixHQUMxQyxJQUFJRyxFQUFhLFNBQ2JDLEVBQWdCLCtCQUNoQkMsRUFBYyw2QkFDZEMsRUFBb0IsbUNBSXBCQyxFQUFvQixnQ0FDcEJDLEVBQWdCLDRCQUNoQkMsRUFBa0Isb0NBQ2xCQyxFQUFvQixpQ0FDcEJDLEVBQWlCLGdDQUNqQkMsRUFBbUIsa0NBRW5CQyxFQUFxQixnQkFBa0JiLEVBQU9DLGFBQWUsSUFDN0RhLEVBQW1CLGVBRW5CQyxFQUFPQyxLQUVYLFNBQVNDLEVBQWVDLEdBQ3RCLE1BQU8sSUFBSUMsT0FBT0QsR0FBS0MsT0FBTyxLQUdoQyxTQUFTQyxFQUFjQyxHQUNyQixPQUFPSixFQUFlSyxHQUFHQyxjQUFjRixHQUFhRyxPQWV0RCxTQUFTQyxFQUFpQkosR0FDeEIsT0FBT0MsR0FBR0MsY0FBY0YsR0FBYUssUUFDakNULEVBQWUsUUFDZkEsRUFBZSxTQTJEckIsT0E1Q0FELEtBQUtXLGtCQUFvQixXQVp6QixJQUNNQyxFQWxCQUMsRUE4QkpQLEdBQUdDLGNBN0NpQixpQ0E2Q2NDLE1BQVEsQ0FDeENYLEVBQ0EsYUFDQU8sRUFBY2hCLEdBQ2QsSUFDQSxXQUNBZ0IsRUFBY2YsR0FDZCxJQUNBLFlBQ0FlLEVBQWNkLEdBQ2QsS0F4Q0V1QixFQUFXLFlBRVhQLEdBQUdDLGNBMUJvQix5Q0EwQmtCTyxTQUMzQ0QsRUFBV0EsRUFBU1YsT0FBT0YsRUFBZSxVQUNqQ0ssR0FBR0MsY0EzQlksd0NBMkJ5Qk8sV0FDakRELEVBQVdBLEVBQVNWLE9BQU9GLEVBQWUsVUFHckNZLEdBa0NMLElBQ0EsaUJBQ0FKLEVBQWlCbEIsR0FDakIsSUFDQSxhQUNBa0IsRUFBaUJqQixHQUNqQixJQUNBLGVBQ0FpQixFQUFpQmhCLEdBQ2pCLElBQ0EsZ0JBQ0FnQixFQUFpQmYsR0FDakIsS0FwQ0VrQixFQUFjLFlBRWROLEdBQUdDLGNBQWNaLEdBQWdCZSxRQUNuQ0UsRUFBY0EsRUFBWVQsT0FBT0YsRUFBZSxRQUN2Q0ssR0FBR0MsY0FBY1gsR0FBa0JjLFVBQzVDRSxFQUFjQSxFQUFZVCxPQUFPRixFQUFlLFdBRzNDVyxHQThCTGQsR0FDQWlCLEtBQUssS0FHVGYsS0FBS2dCLGNBQWdCLFdBQ25CVixHQUFHVyxZQUFZN0IsRUFBZUQsRUFBWVksRUFBS1ksbUJBQy9DTCxHQUFHVyxZQUFZNUIsRUFBYUYsRUFBWVksRUFBS1ksbUJBQzdDTCxHQUFHVyxZQUFZM0IsRUFBbUJILEVBQVlZLEVBQUtZLG1CQUNuREwsR0FBR1csWUF0RmtCLGtDQXNGWTlCLEVBQVlZLEVBQUtZLG1CQUNsREwsR0FBR1csWUFBWTFCLEVBQW1CSixFQUFZWSxFQUFLWSxtQkFDbkRMLEdBQUdXLFlBQVl6QixFQUFlTCxFQUFZWSxFQUFLWSxtQkFDL0NMLEdBQUdXLFlBQVl2QixFQUFtQlAsRUFBWVksRUFBS1ksbUJBQ25ETCxHQUFHVyxZQUFZeEIsRUFBaUJOLEVBQVlZLEVBQUtZLG1CQUNqREwsR0FBR1csWUFBWXRCLEVBQWdCUixFQUFZWSxFQUFLWSxtQkFDaERMLEdBQUdXLFlBQVlyQixFQUFrQlQsRUFBWVksRUFBS1ksb0JBRzdDWixFQXRHVyxDQXVHakJmLFFBR0NzQixHQUFLLFdBd0NQLE9BdkNBTixLQUFLTyxjQUFnQixTQUFvQlcsR0FDdkMsTUFBdUIsaUJBQVRBLEVBQW9CQyxTQUFTQyxlQUFlRixHQUFRQSxHQUVwRWxCLEtBQUtxQixvQkFBc0IsU0FBOEJDLEVBQU1DLEdBQzdELE9BQU9DLE1BQU1DLEtBQUt6QixLQUFLTyxjQUFjZSxHQUFNSSxxQkFBcUJILEtBRWxFdkIsS0FBSzJCLHNCQUF3QixTQUMzQkwsRUFDQU0sR0FFQSxPQUFPSixNQUFNQyxLQUNYekIsS0FBS08sY0FBY2UsR0FBTU8sdUJBQXVCRCxLQUdwRDVCLEtBQUs4QixpQkFBbUJYLFNBQVNZLGNBQWNDLEtBQUtiLFVBQ3BEbkIsS0FBS2lDLGlCQUFtQixTQUFnQlgsRUFBTVksR0FDNUNsQyxLQUFLTyxjQUFjZSxHQUFNYSxZQUFZRCxJQUV2Q2xDLEtBQUtvQyxpQkFBbUIsU0FBZ0JkLEVBQU1ZLEdBQzVDbEMsS0FBS08sY0FBY2UsR0FBTWUsWUFBWXJDLEtBQUtPLGNBQWMyQixLQUUxRGxDLEtBQUtpQixZQUFjLFNBQTBCSyxFQUFNZ0IsRUFBT0MsR0FDeER2QyxLQUFLTyxjQUFjZSxHQUFNa0IsaUJBQWlCRixFQUFPQyxJQUVuRHZDLEtBQUt5QyxlQUFpQixTQUE2Qm5CLEVBQU1nQixFQUFPQyxHQUM5RHZDLEtBQUtPLGNBQWNlLEdBQU1vQixvQkFBb0JKLEVBQU9DLElBRXREdkMsS0FBSzJDLFlBQWMsU0FBcUJyQixHQUN0QyxJQUFJdkIsRUFBT0MsS0FDWHdCLE1BQU1DLEtBQUttQixXQUNSQyxNQUFNLEdBQ05DLFFBQVEsU0FBb0JsQixHQUMzQjdCLEVBQUtRLGNBQWNlLEdBQU15QixVQUFVQyxJQUFJcEIsTUFHN0M1QixLQUFLaUQsZUFBaUIsU0FBd0IzQixFQUFNTSxHQUNsRDVCLEtBQUtPLGNBQWNlLEdBQU15QixVQUFVRyxPQUFPdEIsSUFHckM1QixLQXhDQSxHQTJDVG1ELE9BQU9YLGlCQUFpQixPQUFRLFdBQzlCdEQsY0FBYzhCLGdCQUNkOUIsY0FBY3lCIiwiZmlsZSI6ImNoYXRfY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXhwb3J0ZWQgY29uZmlnICovXHJcbi8qIGdsb2JhbCBjb25maWdGYWN0b3J5ICovXHJcblxyXG52YXIgY29uZmlnID0ge1xyXG4gIGNoYXRGaWxlUGF0aDpcclxuICAgIFwiaHR0cHM6Ly9yYXdnaXQuY29tL0Jlc29taGVhZC9qcy0tdG91Y2hzb2Z0L2Jlc29taGVhZC10YXNrMDUvdGFzay0wNS9CZXNvbWhlYWQvYnVpbGQvanMvY2hhdC5qc1wiXHJcbn07XHJcblxyXG4vKiBleHBvcnRlZCBjb25maWdGYWN0b3J5ICovXHJcbi8qIGdsb2JhbCBETSAqL1xyXG4vKiBnbG9iYWwgY29uZmlnICovXHJcblxyXG52YXIgY29uZmlnRmFjdG9yeSA9IChmdW5jdGlvbiBDb25maWdGYWN0b3J5KGNvbmZpZykge1xyXG4gIHZhciBFVkVOVF9OQU1FID0gXCJjaGFuZ2VcIjtcclxuICB2YXIgQ0hBVF9USVRMRV9JRCA9IFwiY2hhdC1jb25maWd1cmF0b3ItY2hhdC10aXRsZVwiO1xyXG4gIHZhciBDSEFUX1VSTF9JRCA9IFwiY2hhdC1jb25maWd1cmF0b3ItY2hhdC11cmxcIjtcclxuICB2YXIgQ0hBVF9DU1NfQ0xBU1NfSUQgPSBcImNoYXQtY29uZmlndXJhdG9yLWNoYXQtY3NzLWNsYXNzXCI7XHJcbiAgdmFyIENIQVRfUE9TSVRJT05fUklHSFRfSUQgPSBcImNoYXQtY29uZmlndXJhdG9yLWNoYXQtcG9zaXRpb24tcmlnaHRcIjtcclxuICB2YXIgQ0hBVF9QT1NJVElPTl9MRUZUX0lEID0gXCJjaGF0LWNvbmZpZ3VyYXRvci1jaGF0LXBvc2l0aW9uLWxlZnRcIjtcclxuICB2YXIgQ0hBVF9QT1NJVElPTl9JRCA9IFwiY2hhdC1jb25maWd1cmF0b3ItY2hhdC1wb3NpdGlvblwiO1xyXG4gIHZhciBBTExPV19NSU5JTUlaRV9JRCA9IFwiY2hhdC1jb25maWd1cmF0b3ItdWktbWluaW1pemVcIjtcclxuICB2YXIgQUxMT1dfRFJBR19JRCA9IFwiY2hhdC1jb25maWd1cmF0b3ItdWktZHJhZ1wiO1xyXG4gIHZhciBSRVFVSVJFX05BTUVfSUQgPSBcImNoYXQtY29uZmlndXJhdG9yLXVpLXJlcXVpcmUtbmFtZVwiO1xyXG4gIHZhciBTSE9XX0RBVEVfVElNRV9JRCA9IFwiY2hhdC1jb25maWd1cmF0b3ItdWktc2hvdy1kYXRlXCI7XHJcbiAgdmFyIE5FVFdPUktfWEhSX0lEID0gXCJjaGF0LWNvbmZpZ3VyYXRvci1uZXR3b3JrLXhoclwiO1xyXG4gIHZhciBORVRXT1JLX0ZFVENIX0lEID0gXCJjaGF0LWNvbmZpZ3VyYXRvci1uZXR3b3JrLWZldGNoXCI7XHJcbiAgdmFyIENPREVfRVhBTVBMRV9JRCA9IFwiY2hhdC1jb25maWd1cmF0b3ItY29kZS1zb3VyY2VcIjtcclxuICB2YXIgQ09ERV9FWEFNUExFX1NUQVJUID0gJzxzY3JpcHQgc3JjPVwiJyArIGNvbmZpZy5jaGF0RmlsZVBhdGggKyBcIj9cIjtcclxuICB2YXIgQ09ERV9FWEFNUExFX0VORCA9ICdcIj48L3NjcmlwdD4nO1xyXG5cclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gIGZ1bmN0aW9uIHdyYXBXaXRoUXVvdGVzKHN0cikge1xyXG4gICAgcmV0dXJuIFwiJ1wiLmNvbmNhdChzdHIpLmNvbmNhdChcIidcIik7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXRJbnB1dFZhbHVlKGNvbXBvbmVudElEKSB7XHJcbiAgICByZXR1cm4gd3JhcFdpdGhRdW90ZXMoRE0uZ2V0RE9NRWxlbWVudChjb21wb25lbnRJRCkudmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0Q2hhdFBvc2l0aW9uKCkge1xyXG4gICAgdmFyIHBvc2l0aW9uID0gXCJwb3NpdGlvbj1cIjtcclxuXHJcbiAgICBpZiAoRE0uZ2V0RE9NRWxlbWVudChDSEFUX1BPU0lUSU9OX1JJR0hUX0lEKS5zZWxlY3RlZCkge1xyXG4gICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uLmNvbmNhdCh3cmFwV2l0aFF1b3RlcyhcInJpZ2h0XCIpKTtcclxuICAgIH0gZWxzZSBpZiAoRE0uZ2V0RE9NRWxlbWVudChDSEFUX1BPU0lUSU9OX0xFRlRfSUQpLnNlbGVjdGVkKSB7XHJcbiAgICAgIHBvc2l0aW9uID0gcG9zaXRpb24uY29uY2F0KHdyYXBXaXRoUXVvdGVzKFwibGVmdFwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0Q2hlY2tCb3hWYWx1ZShjb21wb25lbnRJRCkge1xyXG4gICAgcmV0dXJuIERNLmdldERPTUVsZW1lbnQoY29tcG9uZW50SUQpLmNoZWNrZWRcclxuICAgICAgPyB3cmFwV2l0aFF1b3RlcyhcInRydWVcIilcclxuICAgICAgOiB3cmFwV2l0aFF1b3RlcyhcImZhbHNlXCIpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TmV0d29ya1JlcXVlc3RUeXBlKCkge1xyXG4gICAgdmFyIHJlcXVlc3RUeXBlID0gXCJyZXF1ZXN0cz1cIjtcclxuXHJcbiAgICBpZiAoRE0uZ2V0RE9NRWxlbWVudChORVRXT1JLX1hIUl9JRCkuY2hlY2tlZCkge1xyXG4gICAgICByZXF1ZXN0VHlwZSA9IHJlcXVlc3RUeXBlLmNvbmNhdCh3cmFwV2l0aFF1b3RlcyhcInhoclwiKSk7XHJcbiAgICB9IGVsc2UgaWYgKERNLmdldERPTUVsZW1lbnQoTkVUV09SS19GRVRDSF9JRCkuY2hlY2tlZCkge1xyXG4gICAgICByZXF1ZXN0VHlwZSA9IHJlcXVlc3RUeXBlLmNvbmNhdCh3cmFwV2l0aFF1b3RlcyhcImZldGNoXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVxdWVzdFR5cGU7XHJcbiAgfVxyXG5cclxuICB0aGlzLmNyZWF0ZUNvZGVFeGFtcGxlID0gZnVuY3Rpb24gY3JlYXRlQ29kZUV4YW1wbGUoKSB7XHJcbiAgICBETS5nZXRET01FbGVtZW50KENPREVfRVhBTVBMRV9JRCkudmFsdWUgPSBbXHJcbiAgICAgIENPREVfRVhBTVBMRV9TVEFSVCxcclxuICAgICAgXCJjaGF0VGl0bGU9XCIsXHJcbiAgICAgIGdldElucHV0VmFsdWUoQ0hBVF9USVRMRV9JRCksXHJcbiAgICAgIFwiJlwiLFxyXG4gICAgICBcImNoYXRVUkw9XCIsXHJcbiAgICAgIGdldElucHV0VmFsdWUoQ0hBVF9VUkxfSUQpLFxyXG4gICAgICBcIiZcIixcclxuICAgICAgXCJjc3NDbGFzcz1cIixcclxuICAgICAgZ2V0SW5wdXRWYWx1ZShDSEFUX0NTU19DTEFTU19JRCksXHJcbiAgICAgIFwiJlwiLFxyXG4gICAgICBnZXRDaGF0UG9zaXRpb24oKSxcclxuICAgICAgXCImXCIsXHJcbiAgICAgIFwiYWxsb3dNaW5pbWl6ZT1cIixcclxuICAgICAgZ2V0Q2hlY2tCb3hWYWx1ZShBTExPV19NSU5JTUlaRV9JRCksXHJcbiAgICAgIFwiJlwiLFxyXG4gICAgICBcImFsbG93RHJhZz1cIixcclxuICAgICAgZ2V0Q2hlY2tCb3hWYWx1ZShBTExPV19EUkFHX0lEKSxcclxuICAgICAgXCImXCIsXHJcbiAgICAgIFwicmVxdWlyZU5hbWU9XCIsXHJcbiAgICAgIGdldENoZWNrQm94VmFsdWUoUkVRVUlSRV9OQU1FX0lEKSxcclxuICAgICAgXCImXCIsXHJcbiAgICAgIFwic2hvd0RhdGVUaW1lPVwiLFxyXG4gICAgICBnZXRDaGVja0JveFZhbHVlKFNIT1dfREFURV9USU1FX0lEKSxcclxuICAgICAgXCImXCIsXHJcbiAgICAgIGdldE5ldHdvcmtSZXF1ZXN0VHlwZSgpLFxyXG4gICAgICBDT0RFX0VYQU1QTEVfRU5EXHJcbiAgICBdLmpvaW4oXCJcIik7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5pbml0TGlzdGVuZXJzID0gZnVuY3Rpb24gaW5pdExpc3RlbmVycygpIHtcclxuICAgIERNLmFkZExpc3RlbmVyKENIQVRfVElUTEVfSUQsIEVWRU5UX05BTUUsIHNlbGYuY3JlYXRlQ29kZUV4YW1wbGUpO1xyXG4gICAgRE0uYWRkTGlzdGVuZXIoQ0hBVF9VUkxfSUQsIEVWRU5UX05BTUUsIHNlbGYuY3JlYXRlQ29kZUV4YW1wbGUpO1xyXG4gICAgRE0uYWRkTGlzdGVuZXIoQ0hBVF9DU1NfQ0xBU1NfSUQsIEVWRU5UX05BTUUsIHNlbGYuY3JlYXRlQ29kZUV4YW1wbGUpO1xyXG4gICAgRE0uYWRkTGlzdGVuZXIoQ0hBVF9QT1NJVElPTl9JRCwgRVZFTlRfTkFNRSwgc2VsZi5jcmVhdGVDb2RlRXhhbXBsZSk7XHJcbiAgICBETS5hZGRMaXN0ZW5lcihBTExPV19NSU5JTUlaRV9JRCwgRVZFTlRfTkFNRSwgc2VsZi5jcmVhdGVDb2RlRXhhbXBsZSk7XHJcbiAgICBETS5hZGRMaXN0ZW5lcihBTExPV19EUkFHX0lELCBFVkVOVF9OQU1FLCBzZWxmLmNyZWF0ZUNvZGVFeGFtcGxlKTtcclxuICAgIERNLmFkZExpc3RlbmVyKFNIT1dfREFURV9USU1FX0lELCBFVkVOVF9OQU1FLCBzZWxmLmNyZWF0ZUNvZGVFeGFtcGxlKTtcclxuICAgIERNLmFkZExpc3RlbmVyKFJFUVVJUkVfTkFNRV9JRCwgRVZFTlRfTkFNRSwgc2VsZi5jcmVhdGVDb2RlRXhhbXBsZSk7XHJcbiAgICBETS5hZGRMaXN0ZW5lcihORVRXT1JLX1hIUl9JRCwgRVZFTlRfTkFNRSwgc2VsZi5jcmVhdGVDb2RlRXhhbXBsZSk7XHJcbiAgICBETS5hZGRMaXN0ZW5lcihORVRXT1JLX0ZFVENIX0lELCBFVkVOVF9OQU1FLCBzZWxmLmNyZWF0ZUNvZGVFeGFtcGxlKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gc2VsZjtcclxufSkoY29uZmlnKTtcclxuLyogZXhwb3J0ZWQgRE0gKi9cclxuXHJcbnZhciBETSA9IChmdW5jdGlvbiBET01NYW5hZ2VyKCkge1xyXG4gIHRoaXMuZ2V0RE9NRWxlbWVudCA9IGZ1bmN0aW9uIGdldEVsZW1lbnQoaWR0Zikge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBpZHRmID09PSBcInN0cmluZ1wiID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWR0ZikgOiBpZHRmO1xyXG4gIH07XHJcbiAgdGhpcy5nZXRET01DaGlsZHJlbkJ5VGFnID0gZnVuY3Rpb24gZ2V0Q2hpbGRyZW5CeVRhZ05hbWUocm9vdCwgdGFnKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmdldERPTUVsZW1lbnQocm9vdCkuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnKSk7XHJcbiAgfTtcclxuICB0aGlzLmdldERPTUNoaWxkcmVuQnlDbGFzcyA9IGZ1bmN0aW9uIGdldENoaWxkcmVuQnlDbGFzc05hbWUoXHJcbiAgICByb290LFxyXG4gICAgY2xhc3NOYW1lXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbShcclxuICAgICAgdGhpcy5nZXRET01FbGVtZW50KHJvb3QpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKVxyXG4gICAgKTtcclxuICB9O1xyXG4gIHRoaXMuY3JlYXRlRE9NRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQuYmluZChkb2N1bWVudCk7XHJcbiAgdGhpcy5hcHBlbmRET01FbGVtZW50ID0gZnVuY3Rpb24gYXBwZW5kKHJvb3QsIGVsZW1lbnQpIHtcclxuICAgIHRoaXMuZ2V0RE9NRWxlbWVudChyb290KS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICB9O1xyXG4gIHRoaXMucmVtb3ZlRE9NRWxlbWVudCA9IGZ1bmN0aW9uIHJlbW92ZShyb290LCBlbGVtZW50KSB7XHJcbiAgICB0aGlzLmdldERPTUVsZW1lbnQocm9vdCkucmVtb3ZlQ2hpbGQodGhpcy5nZXRET01FbGVtZW50KGVsZW1lbnQpKTtcclxuICB9O1xyXG4gIHRoaXMuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKHJvb3QsIGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgdGhpcy5nZXRET01FbGVtZW50KHJvb3QpLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKTtcclxuICB9O1xyXG4gIHRoaXMucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVyKHJvb3QsIGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgdGhpcy5nZXRET01FbGVtZW50KHJvb3QpLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKTtcclxuICB9O1xyXG4gIHRoaXMuYWRkQ1NTQ2xhc3MgPSBmdW5jdGlvbiBhZGRDU1NDbGFzcyhyb290KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBBcnJheS5mcm9tKGFyZ3VtZW50cylcclxuICAgICAgLnNsaWNlKDEpXHJcbiAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIGFkZENsYXNzZXMoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgc2VsZi5nZXRET01FbGVtZW50KHJvb3QpLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgICAgfSk7XHJcbiAgfTtcclxuICB0aGlzLnJlbW92ZUNTU0NsYXNzID0gZnVuY3Rpb24gcmVtb3ZlQ1NTQ2xhc3Mocm9vdCwgY2xhc3NOYW1lKSB7XHJcbiAgICB0aGlzLmdldERPTUVsZW1lbnQocm9vdCkuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uIGluaXRQYWdlKCkge1xyXG4gIGNvbmZpZ0ZhY3RvcnkuaW5pdExpc3RlbmVycygpO1xyXG4gIGNvbmZpZ0ZhY3RvcnkuY3JlYXRlQ29kZUV4YW1wbGUoKTtcclxufSk7Il19