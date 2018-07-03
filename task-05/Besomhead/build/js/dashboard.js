/* eslint-disable */

var REQUEST_INTERVAL = 15e3,
  config = {
    operatorName: "Operator",
    chatURL: "https://besomhead-chat.firebaseio.com/",
    requests: "fetch"
  },
  messageFactory = (function() {
    function a(e, t, n) {
      var a, r, s;
      (this.day = e.getDate()),
        (this.month = e.getMonth()),
        (this.time = ((r = (a = e).getHours()),
        (s = a.getMinutes()),
        (r < 10 ? "0" : "")
          .concat(r.toString())
          .concat(":")
          .concat(s < 10 ? "0" : "")
          .concat(s.toString()))),
        (this.sender = t),
        (this.body = n);
    }
    return (
      (this.getMessage = function(e, t, n) {
        return new a(e, t, n);
      }),
      this
    );
  })(),
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
  HTTP_GET = "GET",
  HTTP_POST = "POST",
  HTTP_PUT = "PUT",
  REQUEST_FETCH = "fetch",
  REQUEST_XHR = "xhr",
  storageManager = (function(o) {
    function d(e) {
      return o.chatURL + e + ".json";
    }
    function l(e, t, n) {
      return fetch(
        d(e),
        ((a = t),
        (r = n),
        (s = {
          method: a,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }),
        a !== HTTP_GET && (s.body = JSON.stringify(r)),
        s)
      )
        .then(function(e) {
          return e.json();
        })
        .then(function(e) {
          return e;
        });
      var a, r, s;
    }
    return (
      (this.sendRequestToStorage = function(e, t, n) {
        var a, r, s, i;
        return (
          o.requests === REQUEST_FETCH
            ? (a = l(e, t, n))
            : o.requests === REQUEST_XHR &&
              ((r = e),
              (s = t),
              (i = n),
              (a = new Promise(function(e, t) {
                var n = new XMLHttpRequest();
                n.open(s, d(r), !0),
                  n.setRequestHeader("Accept", "application/json"),
                  n.setRequestHeader("Content-Type", "application/json"),
                  n.addEventListener("load", function() {
                    e(JSON.parse(n.response));
                  }),
                  n.addEventListener("error", function() {
                    t(n.statusText);
                  }),
                  n.send(JSON.stringify(i));
              }))),
          a
        );
      }),
      this
    );
  })(config),
  dashboardFactory = (function(i) {
    var s = 12e4,
      o = "operators-dashboard-users-list-container",
      d = "operators-dashboard-selected-user-container",
      l = "operators-dashboard-selected-user-inner",
      c = "operators-dashboard-user-chat-messages",
      M = "operators-dashboard-user-chat-input",
      D = "dashboard-single-user-container",
      u = "dashboard-single-user-container-unread",
      h = "dashboard-user-status-online",
      m = "dashboard-user-status-offline",
      n = -1,
      a = 1,
      r = this;
    function g() {
      DM.removeDOMElement(d, l);
    }
    function f(e) {
      return DM.getDOMChildrenByTag(e, "label").find(function(e) {
        return e.hidden;
      }).innerHTML;
    }
    function E(e) {
      var t = DM.getDOMElement(c),
        n = DM.createDOMElement("div"),
        a = DM.createDOMElement("div");
      (n.innerHTML = e.sender),
        (a.innerHTML = e.body),
        DM.appendDOMElement(t, n),
        DM.appendDOMElement(t, a);
    }
    function p(e) {
      var t = DM.createDOMElement("fieldset"),
        n = DM.createDOMElement("legend"),
        a = DM.createDOMElement("div"),
        r = DM.createDOMElement("textarea"),
        s = DM.createDOMElement("button");
      return (
        DM.addCSSClass(t, "dashboard-selected-user-chat-container"),
        (n.innerHTML = "Чат"),
        (a.id = c),
        DM.addCSSClass(a, "dashboard-selected-user-chat-messages"),
        (r.id = M),
        DM.addCSSClass(r, "dashboard-selected-user-chat-input"),
        (r.placeholder = "Новое сообщение пользователю"),
        DM.addCSSClass(s, "dashboard-selected-user-chat-button"),
        (s.innerHTML = "Send"),
        DM.addListener(
          s,
          "click",
          function(e) {
            var t,
              n = DM.getDOMElement(M).value;
            "" !== n &&
              (E(
                (t = messageFactory.getMessage(
                  new Date(),
                  i.operatorName + ":",
                  n
                ))
              ),
              (DM.getDOMElement(M).value = ""),
              storageManager.sendRequestToStorage(
                f(e) + "/messages",
                HTTP_POST,
                t
              ));
          }.bind(null, e)
        ),
        DM.appendDOMElement(t, n),
        DM.appendDOMElement(t, a),
        DM.appendDOMElement(t, r),
        DM.appendDOMElement(t, s),
        t
      );
    }
    function O(e) {
      var t,
        n,
        a = DM.createDOMElement("fieldset"),
        r = DM.createDOMElement("legend"),
        s = DM.createDOMElement("button"),
        i = DM.createDOMElement("label"),
        o = DM.createDOMElement("div");
      (a.id = l),
        DM.addCSSClass(a, "dashboard-selected-user-container-inner"),
        (r.innerHTML =
          "Active: " + DM.getDOMChildrenByTag(e, "label").shift().innerHTML),
        (s.innerHTML = "x"),
        DM.addCSSClass(s, "dashboard-selected-user-container-button"),
        DM.addListener(s, "click", g),
        DM.addCSSClass(o, "dashboard-selected-user-controls-container"),
        (i.innerHTML = f(e)),
        (i.hidden = !0),
        DM.appendDOMElement(o, p(e)),
        DM.appendDOMElement(
          o,
          ((t = DM.createDOMElement("fieldset")),
          (n = DM.createDOMElement("legend")),
          DM.addCSSClass(t, "dashboard-selected-user-controller"),
          (n.innerHTML = "Control"),
          DM.appendDOMElement(t, n),
          t)
        ),
        DM.appendDOMElement(a, r),
        DM.appendDOMElement(a, s),
        DM.appendDOMElement(a, o),
        DM.appendDOMElement(a, i),
        DM.appendDOMElement(d, a);
    }
    function T(e) {
      storageManager.sendRequestToStorage(f(e) + "/read", HTTP_PUT, !0);
    }
    function C(e) {
      var t;
      e.target.classList.contains(D) &&
        (DM.getDOMElement(l) && g(),
        DM.removeCSSClass(e.target, u),
        O(e.target),
        (t = e.target),
        storageManager
          .sendRequestToStorage(f(t) + "/messages", HTTP_GET, "")
          .then(function(t) {
            t &&
              Object.keys(t).forEach(function(e) {
                E(t[e]);
              });
          }),
        T(e.target));
    }
    function b(e) {
      var t, n, a, r;
      if (!e.messages) return !1;
      for (
        r = Object.keys(e.messages), t = e.messages[r.pop()];
        t && t.sender === i.operatorName.concat(":");

      )
        t = e.messages[r.pop()];
      return (
        !!t &&
        ((n = t.time.split(":")),
        (a = new Date(
          new Date().getFullYear(),
          Number(t.month),
          Number(t.day),
          Number(n.shift()),
          Number(n.shift())
        )),
        new Date() - a <= s)
      );
    }
    function S(e, t, n) {
      DM.removeCSSClass(e, t), DM.addCSSClass(e, n);
    }
    function v(e, t) {
      var n = DM.createDOMElement("div"),
        a = DM.createDOMElement("label"),
        r = DM.createDOMElement("label"),
        s = DM.createDOMElement("label"),
        i = DM.createDOMElement("div");
      DM.addCSSClass(n, D),
        e.read || DM.addCSSClass(n, u),
        (a.innerHTML =
          void 0 === e.userName || "Вы" === e.userName ? t : e.userName),
        (r.innerHTML = t),
        (r.hidden = !0),
        DM.addCSSClass(i, "dashboard-user-status"),
        b(e) ? S(i, h, h) : S(i, m, m),
        (s.innerHTML = e.chatState),
        DM.appendDOMElement(n, a),
        DM.appendDOMElement(n, r),
        DM.appendDOMElement(n, i),
        DM.appendDOMElement(n, s),
        DM.addListener(o, "click", C),
        DM.appendDOMElement(o, n);
    }
    function L(e) {
      var t = e || DM.getDOMChildrenByClass(o, D);
      return (
        t.forEach(function(e) {
          DM.removeDOMElement(o, e);
        }),
        t
      );
    }
    function e(e) {
      var t = e.target.value.toLowerCase(),
        n = DM.getDOMChildrenByClass(o, D);
      if ("" === t) return L(n), void r.loadUsersList();
      n.forEach(function(e) {
        -1 ===
          DM.getDOMChildrenByTag(e, "label")
            .shift()
            .innerHTML.toLowerCase()
            .indexOf(t) && DM.removeDOMElement(o, e);
      });
    }
    function y(e, t) {
      return DM.getDOMChildrenByTag(e, "label")
        .shift()
        .innerHTML.toLowerCase() <
        DM.getDOMChildrenByTag(t, "label")
          .shift()
          .innerHTML.toLowerCase()
        ? n
        : a;
    }
    function H(e) {
      return DM.getDOMChildrenByTag(e, "div")
        .shift()
        .classList.contains(h)
        ? n
        : a;
    }
    function R(e) {
      return "chat-expanded" ===
        DM.getDOMChildrenByTag(e, "label").pop().innerHTML
        ? n
        : a;
    }
    function B(e) {
      return e.classList.contains(u) ? n : a;
    }
    function t(e) {
      var t = DM.getDOMChildrenByTag(e.target, "option").find(function(e) {
          return e.selected;
        }),
        n = L();
      function a(e) {
        n.sort(e),
          n.forEach(function(e) {
            DM.appendDOMElement(o, e);
          });
      }
      switch (t.innerHTML) {
        case "User Name":
          a(y);
          break;
        case "Online":
          a(H);
          break;
        case "Chat state":
          a(R);
          break;
        case "Unread":
          a(B);
          break;
        default:
          r.loadUsersList();
      }
    }
    return (
      (this.loadUsersList = function() {
        storageManager.sendRequestToStorage("", HTTP_GET, "").then(function(t) {
          Object.keys(t).forEach(function(e) {
            v(t[e], e);
          });
        });
      }),
      (this.initListeners = function() {
        DM.addListener("operators-dashboard-users-filter-bar", "change", e),
          DM.addListener("operators-dashboard-users-sort-bar", "change", t);
      }),
      (this.checkUpdates = function() {
        storageManager.sendRequestToStorage("", HTTP_GET, "").then(function(s) {
          s &&
            Object.keys(s).forEach(function(t) {
              var e, n, a, r;
              if (
                ((e = s[t]),
                (n = DM.getDOMChildrenByClass(o, D).find(function(e) {
                  return f(e) === t;
                })))
              ) {
                if (
                  ((a = DM.getDOMChildrenByTag(n, "div").shift()),
                  b(e) ? S(a, m, h) : S(a, h, m),
                  (DM.getDOMChildrenByTag(n, "label").pop().innerHTML =
                    e.chatState),
                  !e.read)
                ) {
                  if (DM.getDOMElement(l))
                    return f(l) === t
                      ? (T(n),
                        void (
                          (r = DM.getDOMChildrenByTag(c, "div").length / 2) <
                            e.messages.length &&
                          Array.from(e.messages)
                            .slice(r - 1)
                            .forEach(function(e) {
                              E(e);
                            })
                        ))
                      : void DM.addCSSClass(n, u);
                  DM.addCSSClass(n, u);
                }
              } else v(e, t);
            });
        });
      }),
      r
    );
  })(config);
window.addEventListener("load", function() {
  dashboardFactory.loadUsersList(),
    dashboardFactory.initListeners(),
    setInterval(dashboardFactory.checkUpdates, REQUEST_INTERVAL);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhc2hib2FyZC5qcyJdLCJuYW1lcyI6WyJSRVFVRVNUX0lOVEVSVkFMIiwiY29uZmlnIiwib3BlcmF0b3JOYW1lIiwiY2hhdFVSTCIsInJlcXVlc3RzIiwibWVzc2FnZUZhY3RvcnkiLCJNZXNzYWdlIiwiZGF0ZSIsInNlbmRlciIsImJvZHkiLCJob3VycyIsIm1pbnV0ZXMiLCJ0aGlzIiwiZGF5IiwiZ2V0RGF0ZSIsIm1vbnRoIiwiZ2V0TW9udGgiLCJ0aW1lIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiY29uY2F0IiwidG9TdHJpbmciLCJnZXRNZXNzYWdlIiwiRE0iLCJnZXRET01FbGVtZW50IiwiaWR0ZiIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRET01DaGlsZHJlbkJ5VGFnIiwicm9vdCIsInRhZyIsIkFycmF5IiwiZnJvbSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZ2V0RE9NQ2hpbGRyZW5CeUNsYXNzIiwiY2xhc3NOYW1lIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImNyZWF0ZURPTUVsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYmluZCIsImFwcGVuZERPTUVsZW1lbnQiLCJlbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJyZW1vdmVET01FbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJhZGRMaXN0ZW5lciIsImV2ZW50IiwiY2FsbGJhY2siLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYWRkQ1NTQ2xhc3MiLCJzZWxmIiwiYXJndW1lbnRzIiwic2xpY2UiLCJmb3JFYWNoIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlQ1NTQ2xhc3MiLCJyZW1vdmUiLCJIVFRQX0dFVCIsIkhUVFBfUE9TVCIsIkhUVFBfUFVUIiwiUkVRVUVTVF9GRVRDSCIsIlJFUVVFU1RfWEhSIiwic3RvcmFnZU1hbmFnZXIiLCJnZXRTdG9yYWdlUGF0aCIsImV4dHJhUGF0aCIsInNlbmRSZXF1ZXN0VG9TdG9yYWdlQnlGZXRjaCIsInJlcXVlc3RNZXRob2QiLCJkYXRhIiwiZmV0Y2giLCJjb25maWdPYmoiLCJtZXRob2QiLCJoZWFkZXJzIiwiQWNjZXB0IiwiQ29udGVudC1UeXBlIiwiSlNPTiIsInN0cmluZ2lmeSIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJyZXNwb25zZURhdGEiLCJzZW5kUmVxdWVzdFRvU3RvcmFnZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwic2V0UmVxdWVzdEhlYWRlciIsInBhcnNlIiwic3RhdHVzVGV4dCIsInNlbmQiLCJkYXNoYm9hcmRGYWN0b3J5IiwiVVNFUl9PTkxJTkVfVElNRU9VVCIsIlVTRVJTX0xJU1RfQ09OVEFJTkVSX0lEIiwiU0VMRUNURURfVVNFUl9DT05UQUlORVJfSUQiLCJTRUxFQ1RFRF9VU0VSX0lOTkVSX0lEIiwiVVNFUl9DSEFUX01FU1NBR0VTX0lEIiwiVVNFUl9DSEFUX0lOUFVUX0lEIiwiU0lOR0xFX1VTRVJfQ0xBU1NfTkFNRSIsIlVOUkVBRF9DTEFTU19OQU1FIiwiT05MSU5FX0NMQVNTX05BTUUiLCJPRkZMSU5FX0NMQVNTX05BTUUiLCJMRVNTIiwiTU9SRSIsImNsb3NlU2VsZWN0ZWRVc2VyQ29udGFpbmVyIiwiZ2V0VXNlcklEIiwidXNlckNvbnRhaW5lciIsImZpbmQiLCJmaWVsZCIsImhpZGRlbiIsImlubmVySFRNTCIsImFwcGVuZFNpbmdsZU1lc3NhZ2UiLCJtZXNzYWdlIiwibWVzc2FnZXMiLCJjcmVhdGVVc2VyQ2hhdENvbnRhaW5lciIsInVzZXJDaGF0Q29udGFpbmVyIiwidXNlckNoYXRMZWdlbmQiLCJ1c2VyQ2hhdE1lc3NhZ2VzTGlzdCIsInVzZXJDaGF0TWVzc2FnZUlucHV0IiwidXNlckNoYXRTZW5kQnV0dG9uIiwiaWQiLCJwbGFjZWhvbGRlciIsIm9wZXJhdG9yTWVzc2FnZSIsImlucHV0VmFsdWUiLCJ2YWx1ZSIsIkRhdGUiLCJhcHBlbmRTZWxlY3RlZFVzZXJDb250YWluZXIiLCJ1c2VyQ29udHJvbGxlckNvbnRhaW5lciIsInVzZXJDb250cm9sbGVyTGVnZW5kIiwic2VsZWN0ZWRVc2VyQ29udGFpbmVyIiwidXNlckNvbnRhaW5lckxlZ2VuZCIsInVzZXJDb250YWluZXJDbG9zZUJ1dHRvbiIsInVzZXJJREZpZWxkIiwidXNlckNvbnRhaW5lcnNJbm5lciIsInNoaWZ0Iiwic2VuZFJlYWRNYXJrVG9TdG9yYWdlIiwic2VsZWN0VXNlciIsInRhcmdldCIsImNvbnRhaW5zIiwiT2JqZWN0Iiwia2V5cyIsImtleSIsImlzVXNlck9ubGluZSIsInVzZXIiLCJsYXN0TWVzc2FnZSIsImxhc3RNZXNzYWdlVGltZSIsImxhc3RNZXNzYWdlRGF0ZSIsIm1lc3NhZ2VzS2V5cyIsInBvcCIsInNwbGl0IiwiZ2V0RnVsbFllYXIiLCJOdW1iZXIiLCJzZXRVc2VyU3RhdHVzIiwic3RhdHVzQ29udGFpbmVyIiwiY2xhc3NUb1JlbW92ZSIsImNsYXNzVG9BZGQiLCJhcHBlbmRTaW5nbGVVc2VyIiwiZ2VuZXJhdGVkIiwidXNlckVsZW1lbnQiLCJ1c2VyTmFtZUVsZW1lbnQiLCJnZW5lcmF0ZWRGaWVsZCIsImNoYXRTdGF0ZUVsZW1lbnQiLCJ1c2VyU3RhdHVzRWxlbWVudCIsInJlYWQiLCJ1bmRlZmluZWQiLCJ1c2VyTmFtZSIsImNoYXRTdGF0ZSIsImNsZWFyVXNlcnMiLCJ1c2Vyc0NvbnRhaW5lcnMiLCJjb250YWluZXJzIiwiZmlsdGVyVXNlcnMiLCJmaWx0ZXJWYWx1ZSIsInRvTG93ZXJDYXNlIiwibG9hZFVzZXJzTGlzdCIsImluZGV4T2YiLCJzb3J0VXNlcnNCeVVzZXJOYW1lIiwiY29udGFpbmVyMSIsImNvbnRhaW5lcjIiLCJzb3J0VXNlcnNCeU9ubGluZVN0YXR1cyIsImNvbnRhaW5lciIsInNvcnRVc2Vyc0J5Q2hhdFN0YXRlIiwic29ydFVzZXJzQnlVbnJlYWQiLCJzb3J0VXNlcnMiLCJzZWxlY3RlZCIsIm9wdGlvbiIsInNvcnRCeUFuZEFwcGVuZCIsInNvcnRGdW5jIiwic29ydCIsImluaXRMaXN0ZW5lcnMiLCJjaGVja1VwZGF0ZXMiLCJhcHBlbmRlZE1lc3NhZ2VzQW1vdW50IiwibGVuZ3RoIiwid2luZG93Iiwic2V0SW50ZXJ2YWwiXSwibWFwcGluZ3MiOiJBQUdBLElBQUlBLGlCQUFtQixLQUVuQkMsT0FBUyxDQUNYQyxhQUFjLFdBQ2RDLFFBQVMseUNBQ1RDLFNBQVUsU0FLUkMsZUFBaUIsV0FZbkIsU0FBU0MsRUFBUUMsRUFBTUMsRUFBUUMsR0FYL0IsSUFBd0JGLEVBQ2xCRyxFQUNBQyxFQVVKQyxLQUFLQyxJQUFNTixFQUFLTyxVQUNoQkYsS0FBS0csTUFBUVIsRUFBS1MsV0FDbEJKLEtBQUtLLE1BYkRQLEdBRGtCSCxFQWNLQSxHQWJWVyxXQUNiUCxFQUFVSixFQUFLWSxjQUVYVCxFQUFRLEdBQUssSUFBTSxJQUN4QlUsT0FBT1YsRUFBTVcsWUFDYkQsT0FBTyxLQUNQQSxPQUFPVCxFQUFVLEdBQUssSUFBTSxJQUM1QlMsT0FBT1QsRUFBUVUsYUFPbEJULEtBQUtKLE9BQVNBLEVBQ2RJLEtBQUtILEtBQU9BLEVBT2QsT0FKQUcsS0FBS1UsV0FBYSxTQUFvQmYsRUFBTUMsRUFBUUMsR0FDbEQsT0FBTyxJQUFJSCxFQUFRQyxFQUFNQyxFQUFRQyxJQUc1QkcsS0F4QlksR0E0QmpCVyxHQUFLLFdBd0NQLE9BdkNBWCxLQUFLWSxjQUFnQixTQUFvQkMsR0FDdkMsTUFBdUIsaUJBQVRBLEVBQW9CQyxTQUFTQyxlQUFlRixHQUFRQSxHQUVwRWIsS0FBS2dCLG9CQUFzQixTQUE4QkMsRUFBTUMsR0FDN0QsT0FBT0MsTUFBTUMsS0FBS3BCLEtBQUtZLGNBQWNLLEdBQU1JLHFCQUFxQkgsS0FFbEVsQixLQUFLc0Isc0JBQXdCLFNBQzNCTCxFQUNBTSxHQUVBLE9BQU9KLE1BQU1DLEtBQ1hwQixLQUFLWSxjQUFjSyxHQUFNTyx1QkFBdUJELEtBR3BEdkIsS0FBS3lCLGlCQUFtQlgsU0FBU1ksY0FBY0MsS0FBS2IsVUFDcERkLEtBQUs0Qixp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SyxNQUFNQyxLQUFLa0gsRUFBSzlCLFVBQ2I5RCxNQUFNMkksRUFBeUIsR0FDL0IxSSxRQUFRLFNBQXNCNEQsR0FDN0JELEVBQW9CQyxZQUs1QjVGLEdBQUc0QixZQUFZMEQsRUFBZVAsR0FoQjVCL0UsR0FBRzRCLFlBQVkwRCxFQUFlUCxTQTFCOUJ5RCxFQUFpQmIsRUFBTUYsUUErQzFCNUYsRUEvYmMsQ0FnY3BCbkQsUUFFSGtNLE9BQU9uSixpQkFBaUIsT0FBUSxXQUM5QjhDLGlCQUFpQmtGLGdCQUNqQmxGLGlCQUFpQmlHLGdCQUNqQkssWUFBWXRHLGlCQUFpQmtHLGFBQWNoTSIsImZpbGUiOiJkYXNoYm9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgZGFzaGJvYXJkRmFjdG9yeSAqL1xyXG4vKiBleHBvcnRlZCBjb25maWcgKi9cclxuXHJcbnZhciBSRVFVRVNUX0lOVEVSVkFMID0gMTUwMDA7XHJcblxyXG52YXIgY29uZmlnID0ge1xyXG4gIG9wZXJhdG9yTmFtZTogXCJPcGVyYXRvclwiLFxyXG4gIGNoYXRVUkw6IFwiaHR0cHM6Ly9iZXNvbWhlYWQtY2hhdC5maXJlYmFzZWlvLmNvbS9cIixcclxuICByZXF1ZXN0czogXCJmZXRjaFwiXHJcbn07XHJcblxyXG4vKiBleHBvcnRlZCBtZXNzYWdlRmFjdG9yeSAqL1xyXG5cclxudmFyIG1lc3NhZ2VGYWN0b3J5ID0gKGZ1bmN0aW9uIE1lc3NhZ2VGYWN0b3J5KCkge1xyXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKGRhdGUpIHtcclxuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgIHZhciBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XHJcblxyXG4gICAgcmV0dXJuIChob3VycyA8IDEwID8gXCIwXCIgOiBcIlwiKVxyXG4gICAgICAuY29uY2F0KGhvdXJzLnRvU3RyaW5nKCkpXHJcbiAgICAgIC5jb25jYXQoXCI6XCIpXHJcbiAgICAgIC5jb25jYXQobWludXRlcyA8IDEwID8gXCIwXCIgOiBcIlwiKVxyXG4gICAgICAuY29uY2F0KG1pbnV0ZXMudG9TdHJpbmcoKSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBNZXNzYWdlKGRhdGUsIHNlbmRlciwgYm9keSkge1xyXG4gICAgdGhpcy5kYXkgPSBkYXRlLmdldERhdGUoKTtcclxuICAgIHRoaXMubW9udGggPSBkYXRlLmdldE1vbnRoKCk7XHJcbiAgICB0aGlzLnRpbWUgPSBnZXRDdXJyZW50VGltZShkYXRlKTtcclxuICAgIHRoaXMuc2VuZGVyID0gc2VuZGVyO1xyXG4gICAgdGhpcy5ib2R5ID0gYm9keTtcclxuICB9XHJcblxyXG4gIHRoaXMuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uIGdldE1lc3NhZ2UoZGF0ZSwgc2VuZGVyLCBib2R5KSB7XHJcbiAgICByZXR1cm4gbmV3IE1lc3NhZ2UoZGF0ZSwgc2VuZGVyLCBib2R5KTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufSkoKTtcclxuLyogZXhwb3J0ZWQgRE0gKi9cclxuXHJcbnZhciBETSA9IChmdW5jdGlvbiBET01NYW5hZ2VyKCkge1xyXG4gIHRoaXMuZ2V0RE9NRWxlbWVudCA9IGZ1bmN0aW9uIGdldEVsZW1lbnQoaWR0Zikge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBpZHRmID09PSBcInN0cmluZ1wiID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWR0ZikgOiBpZHRmO1xyXG4gIH07XHJcbiAgdGhpcy5nZXRET01DaGlsZHJlbkJ5VGFnID0gZnVuY3Rpb24gZ2V0Q2hpbGRyZW5CeVRhZ05hbWUocm9vdCwgdGFnKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmdldERPTUVsZW1lbnQocm9vdCkuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnKSk7XHJcbiAgfTtcclxuICB0aGlzLmdldERPTUNoaWxkcmVuQnlDbGFzcyA9IGZ1bmN0aW9uIGdldENoaWxkcmVuQnlDbGFzc05hbWUoXHJcbiAgICByb290LFxyXG4gICAgY2xhc3NOYW1lXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbShcclxuICAgICAgdGhpcy5nZXRET01FbGVtZW50KHJvb3QpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKVxyXG4gICAgKTtcclxuICB9O1xyXG4gIHRoaXMuY3JlYXRlRE9NRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQuYmluZChkb2N1bWVudCk7XHJcbiAgdGhpcy5hcHBlbmRET01FbGVtZW50ID0gZnVuY3Rpb24gYXBwZW5kKHJvb3QsIGVsZW1lbnQpIHtcclxuICAgIHRoaXMuZ2V0RE9NRWxlbWVudChyb290KS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICB9O1xyXG4gIHRoaXMucmVtb3ZlRE9NRWxlbWVudCA9IGZ1bmN0aW9uIHJlbW92ZShyb290LCBlbGVtZW50KSB7XHJcbiAgICB0aGlzLmdldERPTUVsZW1lbnQocm9vdCkucmVtb3ZlQ2hpbGQodGhpcy5nZXRET01FbGVtZW50KGVsZW1lbnQpKTtcclxuICB9O1xyXG4gIHRoaXMuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKHJvb3QsIGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgdGhpcy5nZXRET01FbGVtZW50KHJvb3QpLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKTtcclxuICB9O1xyXG4gIHRoaXMucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVyKHJvb3QsIGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgdGhpcy5nZXRET01FbGVtZW50KHJvb3QpLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKTtcclxuICB9O1xyXG4gIHRoaXMuYWRkQ1NTQ2xhc3MgPSBmdW5jdGlvbiBhZGRDU1NDbGFzcyhyb290KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBBcnJheS5mcm9tKGFyZ3VtZW50cylcclxuICAgICAgLnNsaWNlKDEpXHJcbiAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIGFkZENsYXNzZXMoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgc2VsZi5nZXRET01FbGVtZW50KHJvb3QpLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgICAgfSk7XHJcbiAgfTtcclxuICB0aGlzLnJlbW92ZUNTU0NsYXNzID0gZnVuY3Rpb24gcmVtb3ZlQ1NTQ2xhc3Mocm9vdCwgY2xhc3NOYW1lKSB7XHJcbiAgICB0aGlzLmdldERPTUVsZW1lbnQocm9vdCkuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG4vKiBleHBvcnRlZCBzdG9yYWdlTWFuYWdlciAqL1xyXG4vKiBleHBvcnRlZCBIVFRQX0dFVCBIVFRQX1BPU1QgSFRUUF9QVVQgKi9cclxuLyogZ2xvYmFsIGNvbmZpZyAqL1xyXG5cclxudmFyIEhUVFBfR0VUID0gXCJHRVRcIjtcclxudmFyIEhUVFBfUE9TVCA9IFwiUE9TVFwiO1xyXG52YXIgSFRUUF9QVVQgPSBcIlBVVFwiO1xyXG52YXIgUkVRVUVTVF9GRVRDSCA9IFwiZmV0Y2hcIjtcclxudmFyIFJFUVVFU1RfWEhSID0gXCJ4aHJcIjtcclxuXHJcbnZhciBzdG9yYWdlTWFuYWdlciA9IChmdW5jdGlvbiBTdG9yYWdlTWFuYWdlcihjb25maWcpIHtcclxuICBmdW5jdGlvbiBnZXRTdG9yYWdlUGF0aChleHRyYVBhdGgpIHtcclxuICAgIHJldHVybiBjb25maWcuY2hhdFVSTCArIGV4dHJhUGF0aCArIFwiLmpzb25cIjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFJlcXVlc3RDb25maWdPYmoocmVxdWVzdE1ldGhvZCwgZGF0YSkge1xyXG4gICAgdmFyIGNvbmZpZ09iaiA9IHtcclxuICAgICAgbWV0aG9kOiByZXF1ZXN0TWV0aG9kLFxyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChyZXF1ZXN0TWV0aG9kICE9PSBIVFRQX0dFVCkge1xyXG4gICAgICBjb25maWdPYmouYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb25maWdPYmo7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZW5kUmVxdWVzdFRvU3RvcmFnZUJ5RmV0Y2goZXh0cmFQYXRoLCByZXF1ZXN0TWV0aG9kLCBkYXRhKSB7XHJcbiAgICByZXR1cm4gZmV0Y2goXHJcbiAgICAgIGdldFN0b3JhZ2VQYXRoKGV4dHJhUGF0aCksXHJcbiAgICAgIGdldFJlcXVlc3RDb25maWdPYmoocmVxdWVzdE1ldGhvZCwgZGF0YSlcclxuICAgIClcclxuICAgICAgLnRoZW4oZnVuY3Rpb24gZ2V0UmVzcG9uc2UocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbiBnZXRSZXNwb25zZURhdGEocmVzcG9uc2VEYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlRGF0YTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZW5kUmVxdWVzdFRvU3RvcmFnZUJ5WEhSKGV4dHJhUGF0aCwgbWV0aG9kLCBkYXRhKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gc2VuZFhIUlJlcXVlc3QocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgZ2V0U3RvcmFnZVBhdGgoZXh0cmFQYXRoKSwgdHJ1ZSk7XHJcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gb25Mb2FkKCkge1xyXG4gICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZnVuY3Rpb24gb25FcnJvcigpIHtcclxuICAgICAgICByZWplY3QoeGhyLnN0YXR1c1RleHQpO1xyXG4gICAgICB9KTtcclxuICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0aGlzLnNlbmRSZXF1ZXN0VG9TdG9yYWdlID0gZnVuY3Rpb24gc2VuZFJlcXVlc3RUb1N0b3JhZ2UoXHJcbiAgICBleHRyYVBhdGgsXHJcbiAgICBtZXRob2QsXHJcbiAgICBkYXRhXHJcbiAgKSB7XHJcbiAgICB2YXIgcmVzcG9uc2U7XHJcblxyXG4gICAgaWYgKGNvbmZpZy5yZXF1ZXN0cyA9PT0gUkVRVUVTVF9GRVRDSCkge1xyXG4gICAgICByZXNwb25zZSA9IHNlbmRSZXF1ZXN0VG9TdG9yYWdlQnlGZXRjaChleHRyYVBhdGgsIG1ldGhvZCwgZGF0YSk7XHJcbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5yZXF1ZXN0cyA9PT0gUkVRVUVTVF9YSFIpIHtcclxuICAgICAgcmVzcG9uc2UgPSBzZW5kUmVxdWVzdFRvU3RvcmFnZUJ5WEhSKGV4dHJhUGF0aCwgbWV0aG9kLCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn0pKGNvbmZpZyk7XHJcbi8qIGV4cG9ydGVkIGRhc2hib2FyZEZhY3RvcnkgKi9cclxuLyogZ2xvYmFsIG1lc3NhZ2VGYWN0b3J5ICovXHJcbi8qIGdsb2JhbCBETSAqL1xyXG4vKiBnbG9iYWwgc3RvcmFnZU1hbmFnZXIgSFRUUF9HRVQgSFRUUF9QT1NUIEhUVFBfUFVUICovXHJcbi8qIGdsb2JhbCBjb25maWcgKi9cclxuXHJcbnZhciBkYXNoYm9hcmRGYWN0b3J5ID0gKGZ1bmN0aW9uIERhc2hib2FyZEZhY3RvcnkoY29uZmlnKSB7XHJcbiAgdmFyIERFRkFVTFRfVVNFUk5BTUUgPSBcItCS0YtcIjtcclxuICB2YXIgVVNFUl9PTkxJTkVfVElNRU9VVCA9IDEyMDAwMDtcclxuICB2YXIgVVNFUlNfTElTVF9DT05UQUlORVJfSUQgPSBcIm9wZXJhdG9ycy1kYXNoYm9hcmQtdXNlcnMtbGlzdC1jb250YWluZXJcIjtcclxuICB2YXIgU0VMRUNURURfVVNFUl9DT05UQUlORVJfSUQgPVxyXG4gICAgXCJvcGVyYXRvcnMtZGFzaGJvYXJkLXNlbGVjdGVkLXVzZXItY29udGFpbmVyXCI7XHJcbiAgdmFyIFNFTEVDVEVEX1VTRVJfSU5ORVJfSUQgPSBcIm9wZXJhdG9ycy1kYXNoYm9hcmQtc2VsZWN0ZWQtdXNlci1pbm5lclwiO1xyXG4gIHZhciBVU0VSX0NIQVRfTUVTU0FHRVNfSUQgPSBcIm9wZXJhdG9ycy1kYXNoYm9hcmQtdXNlci1jaGF0LW1lc3NhZ2VzXCI7XHJcbiAgdmFyIFVTRVJfQ0hBVF9JTlBVVF9JRCA9IFwib3BlcmF0b3JzLWRhc2hib2FyZC11c2VyLWNoYXQtaW5wdXRcIjtcclxuICB2YXIgU0lOR0xFX1VTRVJfQ0xBU1NfTkFNRSA9IFwiZGFzaGJvYXJkLXNpbmdsZS11c2VyLWNvbnRhaW5lclwiO1xyXG4gIHZhciBVTlJFQURfQ0xBU1NfTkFNRSA9IFwiZGFzaGJvYXJkLXNpbmdsZS11c2VyLWNvbnRhaW5lci11bnJlYWRcIjtcclxuICB2YXIgT05MSU5FX0NMQVNTX05BTUUgPSBcImRhc2hib2FyZC11c2VyLXN0YXR1cy1vbmxpbmVcIjtcclxuICB2YXIgT0ZGTElORV9DTEFTU19OQU1FID0gXCJkYXNoYm9hcmQtdXNlci1zdGF0dXMtb2ZmbGluZVwiO1xyXG4gIHZhciBMRVNTID0gLTE7XHJcbiAgdmFyIE1PUkUgPSAxO1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgZnVuY3Rpb24gY2xvc2VTZWxlY3RlZFVzZXJDb250YWluZXIoKSB7XHJcbiAgICBETS5yZW1vdmVET01FbGVtZW50KFNFTEVDVEVEX1VTRVJfQ09OVEFJTkVSX0lELCBTRUxFQ1RFRF9VU0VSX0lOTkVSX0lEKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFVzZXJJRCh1c2VyQ29udGFpbmVyKSB7XHJcbiAgICByZXR1cm4gRE0uZ2V0RE9NQ2hpbGRyZW5CeVRhZyh1c2VyQ29udGFpbmVyLCBcImxhYmVsXCIpLmZpbmQoZnVuY3Rpb24gZmluZElEKFxyXG4gICAgICBmaWVsZFxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBmaWVsZC5oaWRkZW47XHJcbiAgICB9KS5pbm5lckhUTUw7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcHBlbmRTaW5nbGVNZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgIHZhciBtZXNzYWdlcyA9IERNLmdldERPTUVsZW1lbnQoVVNFUl9DSEFUX01FU1NBR0VTX0lEKTtcclxuICAgIHZhciBzZW5kZXIgPSBETS5jcmVhdGVET01FbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdmFyIGJvZHkgPSBETS5jcmVhdGVET01FbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgIHNlbmRlci5pbm5lckhUTUwgPSBtZXNzYWdlLnNlbmRlcjtcclxuICAgIGJvZHkuaW5uZXJIVE1MID0gbWVzc2FnZS5ib2R5O1xyXG5cclxuICAgIERNLmFwcGVuZERPTUVsZW1lbnQobWVzc2FnZXMsIHNlbmRlcik7XHJcbiAgICBETS5hcHBlbmRET01FbGVtZW50KG1lc3NhZ2VzLCBib2R5KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNlbmRNZXNzYWdlKHVzZXJDb250YWluZXIpIHtcclxuICAgIHZhciBpbnB1dFZhbHVlID0gRE0uZ2V0RE9NRWxlbWVudChVU0VSX0NIQVRfSU5QVVRfSUQpLnZhbHVlO1xyXG4gICAgdmFyIG9wZXJhdG9yTWVzc2FnZTtcclxuXHJcbiAgICBpZiAoaW5wdXRWYWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBvcGVyYXRvck1lc3NhZ2UgPSBtZXNzYWdlRmFjdG9yeS5nZXRNZXNzYWdlKFxyXG4gICAgICBuZXcgRGF0ZSgpLFxyXG4gICAgICBjb25maWcub3BlcmF0b3JOYW1lICsgXCI6XCIsXHJcbiAgICAgIGlucHV0VmFsdWVcclxuICAgICk7XHJcbiAgICBhcHBlbmRTaW5nbGVNZXNzYWdlKG9wZXJhdG9yTWVzc2FnZSk7XHJcbiAgICBETS5nZXRET01FbGVtZW50KFVTRVJfQ0hBVF9JTlBVVF9JRCkudmFsdWUgPSBcIlwiO1xyXG4gICAgc3RvcmFnZU1hbmFnZXIuc2VuZFJlcXVlc3RUb1N0b3JhZ2UoXHJcbiAgICAgIGdldFVzZXJJRCh1c2VyQ29udGFpbmVyKSArIFwiL21lc3NhZ2VzXCIsXHJcbiAgICAgIEhUVFBfUE9TVCxcclxuICAgICAgb3BlcmF0b3JNZXNzYWdlXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlVXNlckNoYXRDb250YWluZXIodXNlckNvbnRhaW5lcikge1xyXG4gICAgdmFyIHVzZXJDaGF0Q29udGFpbmVyID0gRE0uY3JlYXRlRE9NRWxlbWVudChcImZpZWxkc2V0XCIpO1xyXG4gICAgdmFyIHVzZXJDaGF0TGVnZW5kID0gRE0uY3JlYXRlRE9NRWxlbWVudChcImxlZ2VuZFwiKTtcclxuICAgIHZhciB1c2VyQ2hhdE1lc3NhZ2VzTGlzdCA9IERNLmNyZWF0ZURPTUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB2YXIgdXNlckNoYXRNZXNzYWdlSW5wdXQgPSBETS5jcmVhdGVET01FbGVtZW50KFwidGV4dGFyZWFcIik7XHJcbiAgICB2YXIgdXNlckNoYXRTZW5kQnV0dG9uID0gRE0uY3JlYXRlRE9NRWxlbWVudChcImJ1dHRvblwiKTtcclxuXHJcbiAgICBETS5hZGRDU1NDbGFzcyh1c2VyQ2hhdENvbnRhaW5lciwgXCJkYXNoYm9hcmQtc2VsZWN0ZWQtdXNlci1jaGF0LWNvbnRhaW5lclwiKTtcclxuICAgIHVzZXJDaGF0TGVnZW5kLmlubmVySFRNTCA9IFwi0KfQsNGCXCI7XHJcbiAgICB1c2VyQ2hhdE1lc3NhZ2VzTGlzdC5pZCA9IFVTRVJfQ0hBVF9NRVNTQUdFU19JRDtcclxuICAgIERNLmFkZENTU0NsYXNzKFxyXG4gICAgICB1c2VyQ2hhdE1lc3NhZ2VzTGlzdCxcclxuICAgICAgXCJkYXNoYm9hcmQtc2VsZWN0ZWQtdXNlci1jaGF0LW1lc3NhZ2VzXCJcclxuICAgICk7XHJcbiAgICB1c2VyQ2hhdE1lc3NhZ2VJbnB1dC5pZCA9IFVTRVJfQ0hBVF9JTlBVVF9JRDtcclxuICAgIERNLmFkZENTU0NsYXNzKHVzZXJDaGF0TWVzc2FnZUlucHV0LCBcImRhc2hib2FyZC1zZWxlY3RlZC11c2VyLWNoYXQtaW5wdXRcIik7XHJcbiAgICB1c2VyQ2hhdE1lc3NhZ2VJbnB1dC5wbGFjZWhvbGRlciA9IFwi0J3QvtCy0L7QtSDRgdC+0L7QsdGJ0LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GOXCI7XHJcbiAgICBETS5hZGRDU1NDbGFzcyh1c2VyQ2hhdFNlbmRCdXR0b24sIFwiZGFzaGJvYXJkLXNlbGVjdGVkLXVzZXItY2hhdC1idXR0b25cIik7XHJcbiAgICB1c2VyQ2hhdFNlbmRCdXR0b24uaW5uZXJIVE1MID0gXCJTZW5kXCI7XHJcbiAgICBETS5hZGRMaXN0ZW5lcihcclxuICAgICAgdXNlckNoYXRTZW5kQnV0dG9uLFxyXG4gICAgICBcImNsaWNrXCIsXHJcbiAgICAgIHNlbmRNZXNzYWdlLmJpbmQobnVsbCwgdXNlckNvbnRhaW5lcilcclxuICAgICk7XHJcblxyXG4gICAgRE0uYXBwZW5kRE9NRWxlbWVudCh1c2VyQ2hhdENvbnRhaW5lciwgdXNlckNoYXRMZWdlbmQpO1xyXG4gICAgRE0uYXBwZW5kRE9NRWxlbWVudCh1c2VyQ2hhdENvbnRhaW5lciwgdXNlckNoYXRNZXNzYWdlc0xpc3QpO1xyXG4gICAgRE0uYXBwZW5kRE9NRWxlbWVudCh1c2VyQ2hhdENvbnRhaW5lciwgdXNlckNoYXRNZXNzYWdlSW5wdXQpO1xyXG4gICAgRE0uYXBwZW5kRE9NRWxlbWVudCh1c2VyQ2hhdENvbnRhaW5lciwgdXNlckNoYXRTZW5kQnV0dG9uKTtcclxuXHJcbiAgICByZXR1cm4gdXNlckNoYXRDb250YWluZXI7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVVc2VyQ29udHJvbGxlckNvbnRhaW5lcigpIHtcclxuICAgIHZhciB1c2VyQ29udHJvbGxlckNvbnRhaW5lciA9IERNLmNyZWF0ZURPTUVsZW1lbnQoXCJmaWVsZHNldFwiKTtcclxuICAgIHZhciB1c2VyQ29udHJvbGxlckxlZ2VuZCA9IERNLmNyZWF0ZURPTUVsZW1lbnQoXCJsZWdlbmRcIik7XHJcblxyXG4gICAgRE0uYWRkQ1NTQ2xhc3MoXHJcbiAgICAgIHVzZXJDb250cm9sbGVyQ29udGFpbmVyLFxyXG4gICAgICBcImRhc2hib2FyZC1zZWxlY3RlZC11c2VyLWNvbnRyb2xsZXJcIlxyXG4gICAgKTtcclxuICAgIHVzZXJDb250cm9sbGVyTGVnZW5kLmlubmVySFRNTCA9IFwiQ29udHJvbFwiO1xyXG4gICAgRE0uYXBwZW5kRE9NRWxlbWVudCh1c2VyQ29udHJvbGxlckNvbnRhaW5lciwgdXNlckNvbnRyb2xsZXJMZWdlbmQpO1xyXG5cclxuICAgIHJldHVybiB1c2VyQ29udHJvbGxlckNvbnRhaW5lcjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFwcGVuZFNlbGVjdGVkVXNlckNvbnRhaW5lcih1c2VyQ29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2VsZWN0ZWRVc2VyQ29udGFpbmVyID0gRE0uY3JlYXRlRE9NRWxlbWVudChcImZpZWxkc2V0XCIpO1xyXG4gICAgdmFyIHVzZXJDb250YWluZXJMZWdlbmQgPSBETS5jcmVhdGVET01FbGVtZW50KFwibGVnZW5kXCIpO1xyXG4gICAgdmFyIHVzZXJDb250YWluZXJDbG9zZUJ1dHRvbiA9IERNLmNyZWF0ZURPTUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICB2YXIgdXNlcklERmllbGQgPSBETS5jcmVhdGVET01FbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICB2YXIgdXNlckNvbnRhaW5lcnNJbm5lciA9IERNLmNyZWF0ZURPTUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgc2VsZWN0ZWRVc2VyQ29udGFpbmVyLmlkID0gU0VMRUNURURfVVNFUl9JTk5FUl9JRDtcclxuICAgIERNLmFkZENTU0NsYXNzKFxyXG4gICAgICBzZWxlY3RlZFVzZXJDb250YWluZXIsXHJcbiAgICAgIFwiZGFzaGJvYXJkLXNlbGVjdGVkLXVzZXItY29udGFpbmVyLWlubmVyXCJcclxuICAgICk7XHJcbiAgICB1c2VyQ29udGFpbmVyTGVnZW5kLmlubmVySFRNTCA9XHJcbiAgICAgIFwiQWN0aXZlOiBcIiArXHJcbiAgICAgIERNLmdldERPTUNoaWxkcmVuQnlUYWcodXNlckNvbnRhaW5lciwgXCJsYWJlbFwiKS5zaGlmdCgpLmlubmVySFRNTDtcclxuICAgIHVzZXJDb250YWluZXJDbG9zZUJ1dHRvbi5pbm5lckhUTUwgPSBcInhcIjtcclxuICAgIERNLmFkZENTU0NsYXNzKFxyXG4gICAgICB1c2VyQ29udGFpbmVyQ2xvc2VCdXR0b24sXHJcbiAgICAgIFwiZGFzaGJvYXJkLXNlbGVjdGVkLXVzZXItY29udGFpbmVyLWJ1dHRvblwiXHJcbiAgICApO1xyXG4gICAgRE0uYWRkTGlzdGVuZXIoXHJcbiAgICAgIHVzZXJDb250YWluZXJDbG9zZUJ1dHRvbixcclxuICAgICAgXCJjbGlja1wiLFxyXG4gICAgICBjbG9zZVNlbGVjdGVkVXNlckNvbnRhaW5lclxyXG4gICAgKTtcclxuICAgIERNLmFkZENTU0NsYXNzKFxyXG4gICAgICB1c2VyQ29udGFpbmVyc0lubmVyLFxyXG4gICAgICBcImRhc2hib2FyZC1zZWxlY3RlZC11c2VyLWNvbnRyb2xzLWNvbnRhaW5lclwiXHJcbiAgICApO1xyXG4gICAgdXNlcklERmllbGQuaW5uZXJIVE1MID0gZ2V0VXNlcklEKHVzZXJDb250YWluZXIpO1xyXG4gICAgdXNlcklERmllbGQuaGlkZGVuID0gdHJ1ZTtcclxuXHJcbiAgICBETS5hcHBlbmRET01FbGVtZW50KFxyXG4gICAgICB1c2VyQ29udGFpbmVyc0lubmVyLFxyXG4gICAgICBjcmVhdGVVc2VyQ2hhdENvbnRhaW5lcih1c2VyQ29udGFpbmVyKVxyXG4gICAgKTtcclxuICAgIERNLmFwcGVuZERPTUVsZW1lbnQodXNlckNvbnRhaW5lcnNJbm5lciwgY3JlYXRlVXNlckNvbnRyb2xsZXJDb250YWluZXIoKSk7XHJcbiAgICBETS5hcHBlbmRET01FbGVtZW50KHNlbGVjdGVkVXNlckNvbnRhaW5lciwgdXNlckNvbnRhaW5lckxlZ2VuZCk7XHJcbiAgICBETS5hcHBlbmRET01FbGVtZW50KHNlbGVjdGVkVXNlckNvbnRhaW5lciwgdXNlckNvbnRhaW5lckNsb3NlQnV0dG9uKTtcclxuICAgIERNLmFwcGVuZERPTUVsZW1lbnQoc2VsZWN0ZWRVc2VyQ29udGFpbmVyLCB1c2VyQ29udGFpbmVyc0lubmVyKTtcclxuICAgIERNLmFwcGVuZERPTUVsZW1lbnQoc2VsZWN0ZWRVc2VyQ29udGFpbmVyLCB1c2VySURGaWVsZCk7XHJcbiAgICBETS5hcHBlbmRET01FbGVtZW50KFNFTEVDVEVEX1VTRVJfQ09OVEFJTkVSX0lELCBzZWxlY3RlZFVzZXJDb250YWluZXIpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXBwZW5kU2VsZWN0ZWRVc2VyTWVzc2FnZXModXNlckNvbnRhaW5lcikge1xyXG4gICAgc3RvcmFnZU1hbmFnZXJcclxuICAgICAgLnNlbmRSZXF1ZXN0VG9TdG9yYWdlKFxyXG4gICAgICAgIGdldFVzZXJJRCh1c2VyQ29udGFpbmVyKSArIFwiL21lc3NhZ2VzXCIsXHJcbiAgICAgICAgSFRUUF9HRVQsXHJcbiAgICAgICAgXCJcIlxyXG4gICAgICApXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uIGFwcGVuZE1lc3NhZ2VzKGRhdGEpIHtcclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChmdW5jdGlvbiBhcHBlbmRNZXNzYWdlKGtleSkge1xyXG4gICAgICAgICAgYXBwZW5kU2luZ2xlTWVzc2FnZShkYXRhW2tleV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNlbmRSZWFkTWFya1RvU3RvcmFnZSh1c2VyQ29udGFpbmVyKSB7XHJcbiAgICBzdG9yYWdlTWFuYWdlci5zZW5kUmVxdWVzdFRvU3RvcmFnZShcclxuICAgICAgZ2V0VXNlcklEKHVzZXJDb250YWluZXIpICsgXCIvcmVhZFwiLFxyXG4gICAgICBIVFRQX1BVVCxcclxuICAgICAgdHJ1ZVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNlbGVjdFVzZXIoZXZlbnQpIHtcclxuICAgIGlmICghZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhTSU5HTEVfVVNFUl9DTEFTU19OQU1FKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoRE0uZ2V0RE9NRWxlbWVudChTRUxFQ1RFRF9VU0VSX0lOTkVSX0lEKSkge1xyXG4gICAgICBjbG9zZVNlbGVjdGVkVXNlckNvbnRhaW5lcigpO1xyXG4gICAgfVxyXG4gICAgRE0ucmVtb3ZlQ1NTQ2xhc3MoZXZlbnQudGFyZ2V0LCBVTlJFQURfQ0xBU1NfTkFNRSk7XHJcblxyXG4gICAgYXBwZW5kU2VsZWN0ZWRVc2VyQ29udGFpbmVyKGV2ZW50LnRhcmdldCk7XHJcbiAgICBhcHBlbmRTZWxlY3RlZFVzZXJNZXNzYWdlcyhldmVudC50YXJnZXQpO1xyXG4gICAgc2VuZFJlYWRNYXJrVG9TdG9yYWdlKGV2ZW50LnRhcmdldCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc1VzZXJPbmxpbmUodXNlcikge1xyXG4gICAgdmFyIGxhc3RNZXNzYWdlO1xyXG4gICAgdmFyIGxhc3RNZXNzYWdlVGltZTtcclxuICAgIHZhciBsYXN0TWVzc2FnZURhdGU7XHJcbiAgICB2YXIgbWVzc2FnZXNLZXlzO1xyXG5cclxuICAgIGlmICghdXNlci5tZXNzYWdlcykge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBtZXNzYWdlc0tleXMgPSBPYmplY3Qua2V5cyh1c2VyLm1lc3NhZ2VzKTtcclxuICAgIGxhc3RNZXNzYWdlID0gdXNlci5tZXNzYWdlc1ttZXNzYWdlc0tleXMucG9wKCldO1xyXG4gICAgd2hpbGUgKFxyXG4gICAgICBsYXN0TWVzc2FnZSAmJlxyXG4gICAgICBsYXN0TWVzc2FnZS5zZW5kZXIgPT09IGNvbmZpZy5vcGVyYXRvck5hbWUuY29uY2F0KFwiOlwiKVxyXG4gICAgKSB7XHJcbiAgICAgIGxhc3RNZXNzYWdlID0gdXNlci5tZXNzYWdlc1ttZXNzYWdlc0tleXMucG9wKCldO1xyXG4gICAgfVxyXG4gICAgaWYgKCFsYXN0TWVzc2FnZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBsYXN0TWVzc2FnZVRpbWUgPSBsYXN0TWVzc2FnZS50aW1lLnNwbGl0KFwiOlwiKTtcclxuICAgIGxhc3RNZXNzYWdlRGF0ZSA9IG5ldyBEYXRlKFxyXG4gICAgICBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksXHJcbiAgICAgIE51bWJlcihsYXN0TWVzc2FnZS5tb250aCksXHJcbiAgICAgIE51bWJlcihsYXN0TWVzc2FnZS5kYXkpLFxyXG4gICAgICBOdW1iZXIobGFzdE1lc3NhZ2VUaW1lLnNoaWZ0KCkpLFxyXG4gICAgICBOdW1iZXIobGFzdE1lc3NhZ2VUaW1lLnNoaWZ0KCkpXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBuZXcgRGF0ZSgpIC0gbGFzdE1lc3NhZ2VEYXRlIDw9IFVTRVJfT05MSU5FX1RJTUVPVVQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRVc2VyU3RhdHVzKHN0YXR1c0NvbnRhaW5lciwgY2xhc3NUb1JlbW92ZSwgY2xhc3NUb0FkZCkge1xyXG4gICAgRE0ucmVtb3ZlQ1NTQ2xhc3Moc3RhdHVzQ29udGFpbmVyLCBjbGFzc1RvUmVtb3ZlKTtcclxuICAgIERNLmFkZENTU0NsYXNzKHN0YXR1c0NvbnRhaW5lciwgY2xhc3NUb0FkZCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcHBlbmRTaW5nbGVVc2VyKHVzZXIsIGdlbmVyYXRlZCkge1xyXG4gICAgdmFyIHVzZXJFbGVtZW50ID0gRE0uY3JlYXRlRE9NRWxlbWVudChcImRpdlwiKTtcclxuICAgIHZhciB1c2VyTmFtZUVsZW1lbnQgPSBETS5jcmVhdGVET01FbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICB2YXIgZ2VuZXJhdGVkRmllbGQgPSBETS5jcmVhdGVET01FbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICB2YXIgY2hhdFN0YXRlRWxlbWVudCA9IERNLmNyZWF0ZURPTUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIHZhciB1c2VyU3RhdHVzRWxlbWVudCA9IERNLmNyZWF0ZURPTUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgRE0uYWRkQ1NTQ2xhc3ModXNlckVsZW1lbnQsIFNJTkdMRV9VU0VSX0NMQVNTX05BTUUpO1xyXG4gICAgaWYgKCF1c2VyLnJlYWQpIHtcclxuICAgICAgRE0uYWRkQ1NTQ2xhc3ModXNlckVsZW1lbnQsIFVOUkVBRF9DTEFTU19OQU1FKTtcclxuICAgIH1cclxuICAgIHVzZXJOYW1lRWxlbWVudC5pbm5lckhUTUwgPVxyXG4gICAgICB1c2VyLnVzZXJOYW1lID09PSB1bmRlZmluZWQgfHwgdXNlci51c2VyTmFtZSA9PT0gREVGQVVMVF9VU0VSTkFNRVxyXG4gICAgICAgID8gZ2VuZXJhdGVkXHJcbiAgICAgICAgOiB1c2VyLnVzZXJOYW1lO1xyXG4gICAgZ2VuZXJhdGVkRmllbGQuaW5uZXJIVE1MID0gZ2VuZXJhdGVkO1xyXG4gICAgZ2VuZXJhdGVkRmllbGQuaGlkZGVuID0gdHJ1ZTtcclxuICAgIERNLmFkZENTU0NsYXNzKHVzZXJTdGF0dXNFbGVtZW50LCBcImRhc2hib2FyZC11c2VyLXN0YXR1c1wiKTtcclxuICAgIGlmIChpc1VzZXJPbmxpbmUodXNlcikpIHtcclxuICAgICAgc2V0VXNlclN0YXR1cyh1c2VyU3RhdHVzRWxlbWVudCwgT05MSU5FX0NMQVNTX05BTUUsIE9OTElORV9DTEFTU19OQU1FKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNldFVzZXJTdGF0dXModXNlclN0YXR1c0VsZW1lbnQsIE9GRkxJTkVfQ0xBU1NfTkFNRSwgT0ZGTElORV9DTEFTU19OQU1FKTtcclxuICAgIH1cclxuICAgIGNoYXRTdGF0ZUVsZW1lbnQuaW5uZXJIVE1MID0gdXNlci5jaGF0U3RhdGU7XHJcblxyXG4gICAgRE0uYXBwZW5kRE9NRWxlbWVudCh1c2VyRWxlbWVudCwgdXNlck5hbWVFbGVtZW50KTtcclxuICAgIERNLmFwcGVuZERPTUVsZW1lbnQodXNlckVsZW1lbnQsIGdlbmVyYXRlZEZpZWxkKTtcclxuICAgIERNLmFwcGVuZERPTUVsZW1lbnQodXNlckVsZW1lbnQsIHVzZXJTdGF0dXNFbGVtZW50KTtcclxuICAgIERNLmFwcGVuZERPTUVsZW1lbnQodXNlckVsZW1lbnQsIGNoYXRTdGF0ZUVsZW1lbnQpO1xyXG4gICAgRE0uYWRkTGlzdGVuZXIoVVNFUlNfTElTVF9DT05UQUlORVJfSUQsIFwiY2xpY2tcIiwgc2VsZWN0VXNlcik7XHJcbiAgICBETS5hcHBlbmRET01FbGVtZW50KFVTRVJTX0xJU1RfQ09OVEFJTkVSX0lELCB1c2VyRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICB0aGlzLmxvYWRVc2Vyc0xpc3QgPSBmdW5jdGlvbiBsb2FkVXNlcnNMaXN0KCkge1xyXG4gICAgc3RvcmFnZU1hbmFnZXJcclxuICAgICAgLnNlbmRSZXF1ZXN0VG9TdG9yYWdlKFwiXCIsIEhUVFBfR0VULCBcIlwiKVxyXG4gICAgICAudGhlbihmdW5jdGlvbiBhcHBlbmRVc2Vyc1RvUGFnZShkYXRhKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChmdW5jdGlvbiBhcHBlbmRVU2VyKGtleSkge1xyXG4gICAgICAgICAgYXBwZW5kU2luZ2xlVXNlcihkYXRhW2tleV0sIGtleSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIGNsZWFyVXNlcnModXNlcnNDb250YWluZXJzKSB7XHJcbiAgICB2YXIgY29udGFpbmVycyA9XHJcbiAgICAgIHVzZXJzQ29udGFpbmVycyB8fFxyXG4gICAgICBETS5nZXRET01DaGlsZHJlbkJ5Q2xhc3MoVVNFUlNfTElTVF9DT05UQUlORVJfSUQsIFNJTkdMRV9VU0VSX0NMQVNTX05BTUUpO1xyXG5cclxuICAgIGNvbnRhaW5lcnMuZm9yRWFjaChmdW5jdGlvbiBjbGVhclVzZXJzTGlzdCh1c2VyQ29udGFpbmVyKSB7XHJcbiAgICAgIERNLnJlbW92ZURPTUVsZW1lbnQoVVNFUlNfTElTVF9DT05UQUlORVJfSUQsIHVzZXJDb250YWluZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGNvbnRhaW5lcnM7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBmaWx0ZXJVc2VycyhldmVudCkge1xyXG4gICAgdmFyIGZpbHRlclZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB2YXIgdXNlcnNDb250YWluZXJzID0gRE0uZ2V0RE9NQ2hpbGRyZW5CeUNsYXNzKFxyXG4gICAgICBVU0VSU19MSVNUX0NPTlRBSU5FUl9JRCxcclxuICAgICAgU0lOR0xFX1VTRVJfQ0xBU1NfTkFNRVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoZmlsdGVyVmFsdWUgPT09IFwiXCIpIHtcclxuICAgICAgY2xlYXJVc2Vycyh1c2Vyc0NvbnRhaW5lcnMpO1xyXG4gICAgICBzZWxmLmxvYWRVc2Vyc0xpc3QoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdXNlcnNDb250YWluZXJzLmZvckVhY2goZnVuY3Rpb24gZmlsdGVyKHVzZXJDb250YWluZXIpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIERNLmdldERPTUNoaWxkcmVuQnlUYWcodXNlckNvbnRhaW5lciwgXCJsYWJlbFwiKVxyXG4gICAgICAgICAgLnNoaWZ0KClcclxuICAgICAgICAgIC5pbm5lckhUTUwudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgICAgLmluZGV4T2YoZmlsdGVyVmFsdWUpID09PSAtMVxyXG4gICAgICApIHtcclxuICAgICAgICBETS5yZW1vdmVET01FbGVtZW50KFVTRVJTX0xJU1RfQ09OVEFJTkVSX0lELCB1c2VyQ29udGFpbmVyKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzb3J0VXNlcnNCeVVzZXJOYW1lKGNvbnRhaW5lcjEsIGNvbnRhaW5lcjIpIHtcclxuICAgIHJldHVybiBETS5nZXRET01DaGlsZHJlbkJ5VGFnKGNvbnRhaW5lcjEsIFwibGFiZWxcIilcclxuICAgICAgLnNoaWZ0KClcclxuICAgICAgLmlubmVySFRNTC50b0xvd2VyQ2FzZSgpIDxcclxuICAgICAgRE0uZ2V0RE9NQ2hpbGRyZW5CeVRhZyhjb250YWluZXIyLCBcImxhYmVsXCIpXHJcbiAgICAgICAgLnNoaWZ0KClcclxuICAgICAgICAuaW5uZXJIVE1MLnRvTG93ZXJDYXNlKClcclxuICAgICAgPyBMRVNTXHJcbiAgICAgIDogTU9SRTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNvcnRVc2Vyc0J5T25saW5lU3RhdHVzKGNvbnRhaW5lcikge1xyXG4gICAgcmV0dXJuIERNLmdldERPTUNoaWxkcmVuQnlUYWcoY29udGFpbmVyLCBcImRpdlwiKVxyXG4gICAgICAuc2hpZnQoKVxyXG4gICAgICAuY2xhc3NMaXN0LmNvbnRhaW5zKE9OTElORV9DTEFTU19OQU1FKVxyXG4gICAgICA/IExFU1NcclxuICAgICAgOiBNT1JFO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc29ydFVzZXJzQnlDaGF0U3RhdGUoY29udGFpbmVyKSB7XHJcbiAgICByZXR1cm4gRE0uZ2V0RE9NQ2hpbGRyZW5CeVRhZyhjb250YWluZXIsIFwibGFiZWxcIikucG9wKCkuaW5uZXJIVE1MID09PVxyXG4gICAgICBcImNoYXQtZXhwYW5kZWRcIlxyXG4gICAgICA/IExFU1NcclxuICAgICAgOiBNT1JFO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc29ydFVzZXJzQnlVbnJlYWQoY29udGFpbmVyKSB7XHJcbiAgICByZXR1cm4gY29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucyhVTlJFQURfQ0xBU1NfTkFNRSkgPyBMRVNTIDogTU9SRTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNvcnRVc2VycyhldmVudCkge1xyXG4gICAgdmFyIHNlbGVjdGVkID0gRE0uZ2V0RE9NQ2hpbGRyZW5CeVRhZyhldmVudC50YXJnZXQsIFwib3B0aW9uXCIpLmZpbmQoXHJcbiAgICAgIGZ1bmN0aW9uIGdldFNlbGVjdGVkKG9wdGlvbikge1xyXG4gICAgICAgIHJldHVybiBvcHRpb24uc2VsZWN0ZWQ7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICB2YXIgY29udGFpbmVycyA9IGNsZWFyVXNlcnMoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBzb3J0QnlBbmRBcHBlbmQoc29ydEZ1bmMpIHtcclxuICAgICAgY29udGFpbmVycy5zb3J0KHNvcnRGdW5jKTtcclxuICAgICAgY29udGFpbmVycy5mb3JFYWNoKGZ1bmN0aW9uIGFwcGVuZENvbnRhaW5lcnMoY29udGFpbmVyKSB7XHJcbiAgICAgICAgRE0uYXBwZW5kRE9NRWxlbWVudChVU0VSU19MSVNUX0NPTlRBSU5FUl9JRCwgY29udGFpbmVyKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKHNlbGVjdGVkLmlubmVySFRNTCkge1xyXG4gICAgICBjYXNlIFwiVXNlciBOYW1lXCI6XHJcbiAgICAgICAgc29ydEJ5QW5kQXBwZW5kKHNvcnRVc2Vyc0J5VXNlck5hbWUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiT25saW5lXCI6XHJcbiAgICAgICAgc29ydEJ5QW5kQXBwZW5kKHNvcnRVc2Vyc0J5T25saW5lU3RhdHVzKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcIkNoYXQgc3RhdGVcIjpcclxuICAgICAgICBzb3J0QnlBbmRBcHBlbmQoc29ydFVzZXJzQnlDaGF0U3RhdGUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwiVW5yZWFkXCI6XHJcbiAgICAgICAgc29ydEJ5QW5kQXBwZW5kKHNvcnRVc2Vyc0J5VW5yZWFkKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBzZWxmLmxvYWRVc2Vyc0xpc3QoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRoaXMuaW5pdExpc3RlbmVycyA9IGZ1bmN0aW9uIGluaXRMaXN0ZW5lcnMoKSB7XHJcbiAgICBETS5hZGRMaXN0ZW5lcihcclxuICAgICAgXCJvcGVyYXRvcnMtZGFzaGJvYXJkLXVzZXJzLWZpbHRlci1iYXJcIixcclxuICAgICAgXCJjaGFuZ2VcIixcclxuICAgICAgZmlsdGVyVXNlcnNcclxuICAgICk7XHJcbiAgICBETS5hZGRMaXN0ZW5lcihcIm9wZXJhdG9ycy1kYXNoYm9hcmQtdXNlcnMtc29ydC1iYXJcIiwgXCJjaGFuZ2VcIiwgc29ydFVzZXJzKTtcclxuICB9O1xyXG5cclxuICB0aGlzLmNoZWNrVXBkYXRlcyA9IGZ1bmN0aW9uIGNoZWNrVXBkYXRlcygpIHtcclxuICAgIHN0b3JhZ2VNYW5hZ2VyXHJcbiAgICAgIC5zZW5kUmVxdWVzdFRvU3RvcmFnZShcIlwiLCBIVFRQX0dFVCwgXCJcIilcclxuICAgICAgLnRoZW4oZnVuY3Rpb24gY2hlY2tVc2VycyhkYXRhKSB7XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goZnVuY3Rpb24gY2hlY2tVc2VyKGtleSkge1xyXG4gICAgICAgICAgdmFyIHVzZXI7XHJcbiAgICAgICAgICB2YXIgdXNlckNvbnRhaW5lcjtcclxuICAgICAgICAgIHZhciB1c2VyU3RhdHVzRWxlbWVudDtcclxuICAgICAgICAgIHZhciBhcHBlbmRlZE1lc3NhZ2VzQW1vdW50O1xyXG5cclxuICAgICAgICAgIHVzZXIgPSBkYXRhW2tleV07XHJcbiAgICAgICAgICB1c2VyQ29udGFpbmVyID0gRE0uZ2V0RE9NQ2hpbGRyZW5CeUNsYXNzKFxyXG4gICAgICAgICAgICBVU0VSU19MSVNUX0NPTlRBSU5FUl9JRCxcclxuICAgICAgICAgICAgU0lOR0xFX1VTRVJfQ0xBU1NfTkFNRVxyXG4gICAgICAgICAgKS5maW5kKGZ1bmN0aW9uIGZpbmRDb250YWluZXIoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRVc2VySUQoY29udGFpbmVyKSA9PT0ga2V5O1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBpZiAoIXVzZXJDb250YWluZXIpIHtcclxuICAgICAgICAgICAgYXBwZW5kU2luZ2xlVXNlcih1c2VyLCBrZXkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB1c2VyU3RhdHVzRWxlbWVudCA9IERNLmdldERPTUNoaWxkcmVuQnlUYWcoXHJcbiAgICAgICAgICAgIHVzZXJDb250YWluZXIsXHJcbiAgICAgICAgICAgIFwiZGl2XCJcclxuICAgICAgICAgICkuc2hpZnQoKTtcclxuICAgICAgICAgIGlmIChpc1VzZXJPbmxpbmUodXNlcikpIHtcclxuICAgICAgICAgICAgc2V0VXNlclN0YXR1cyhcclxuICAgICAgICAgICAgICB1c2VyU3RhdHVzRWxlbWVudCxcclxuICAgICAgICAgICAgICBPRkZMSU5FX0NMQVNTX05BTUUsXHJcbiAgICAgICAgICAgICAgT05MSU5FX0NMQVNTX05BTUVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFVzZXJTdGF0dXMoXHJcbiAgICAgICAgICAgICAgdXNlclN0YXR1c0VsZW1lbnQsXHJcbiAgICAgICAgICAgICAgT05MSU5FX0NMQVNTX05BTUUsXHJcbiAgICAgICAgICAgICAgT0ZGTElORV9DTEFTU19OQU1FXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBETS5nZXRET01DaGlsZHJlbkJ5VGFnKHVzZXJDb250YWluZXIsIFwibGFiZWxcIikucG9wKCkuaW5uZXJIVE1MID1cclxuICAgICAgICAgICAgdXNlci5jaGF0U3RhdGU7XHJcbiAgICAgICAgICBpZiAodXNlci5yZWFkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICghRE0uZ2V0RE9NRWxlbWVudChTRUxFQ1RFRF9VU0VSX0lOTkVSX0lEKSkge1xyXG4gICAgICAgICAgICBETS5hZGRDU1NDbGFzcyh1c2VyQ29udGFpbmVyLCBVTlJFQURfQ0xBU1NfTkFNRSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChnZXRVc2VySUQoU0VMRUNURURfVVNFUl9JTk5FUl9JRCkgPT09IGtleSkge1xyXG4gICAgICAgICAgICBzZW5kUmVhZE1hcmtUb1N0b3JhZ2UodXNlckNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIGFwcGVuZGVkTWVzc2FnZXNBbW91bnQgPVxyXG4gICAgICAgICAgICAgIERNLmdldERPTUNoaWxkcmVuQnlUYWcoVVNFUl9DSEFUX01FU1NBR0VTX0lELCBcImRpdlwiKS5sZW5ndGggLyAyO1xyXG4gICAgICAgICAgICBpZiAoYXBwZW5kZWRNZXNzYWdlc0Ftb3VudCA8IHVzZXIubWVzc2FnZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgQXJyYXkuZnJvbSh1c2VyLm1lc3NhZ2VzKVxyXG4gICAgICAgICAgICAgICAgLnNsaWNlKGFwcGVuZGVkTWVzc2FnZXNBbW91bnQgLSAxKVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gYXBwZW5kVW5yZWFkKG1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgYXBwZW5kU2luZ2xlTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIERNLmFkZENTU0NsYXNzKHVzZXJDb250YWluZXIsIFVOUkVBRF9DTEFTU19OQU1FKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHNlbGY7XHJcbn0pKGNvbmZpZyk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gaW5pdERhc2hib2FyZCgpIHtcclxuICBkYXNoYm9hcmRGYWN0b3J5LmxvYWRVc2Vyc0xpc3QoKTtcclxuICBkYXNoYm9hcmRGYWN0b3J5LmluaXRMaXN0ZW5lcnMoKTtcclxuICBzZXRJbnRlcnZhbChkYXNoYm9hcmRGYWN0b3J5LmNoZWNrVXBkYXRlcywgUkVRVUVTVF9JTlRFUlZBTCk7XHJcbn0pOyJdfQ==