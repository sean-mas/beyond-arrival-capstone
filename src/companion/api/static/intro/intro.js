var tf = { exports: {} }, Jl = {};
var I0;
function Mb() {
  if (I0) return Jl;
  I0 = 1;
  var a = /* @__PURE__ */ Symbol.for("react.transitional.element"), l = /* @__PURE__ */ Symbol.for("react.fragment");
  function o(r, c, d) {
    var h = null;
    if (d !== void 0 && (h = "" + d), c.key !== void 0 && (h = "" + c.key), "key" in c) {
      d = {};
      for (var y in c)
        y !== "key" && (d[y] = c[y]);
    } else d = c;
    return c = d.ref, {
      $$typeof: a,
      type: r,
      key: h,
      ref: c !== void 0 ? c : null,
      props: d
    };
  }
  return Jl.Fragment = l, Jl.jsx = o, Jl.jsxs = o, Jl;
}
var tg;
function Db() {
  return tg || (tg = 1, tf.exports = Mb()), tf.exports;
}
var Jt = Db(), ef = { exports: {} }, Fl = {}, nf = { exports: {} }, af = {};
var eg;
function xb() {
  return eg || (eg = 1, (function(a) {
    function l(j, k) {
      var Z = j.length;
      j.push(k);
      t: for (; 0 < Z; ) {
        var ft = Z - 1 >>> 1, ot = j[ft];
        if (0 < c(ot, k))
          j[ft] = k, j[Z] = ot, Z = ft;
        else break t;
      }
    }
    function o(j) {
      return j.length === 0 ? null : j[0];
    }
    function r(j) {
      if (j.length === 0) return null;
      var k = j[0], Z = j.pop();
      if (Z !== k) {
        j[0] = Z;
        t: for (var ft = 0, ot = j.length, wt = ot >>> 1; ft < wt; ) {
          var ue = 2 * (ft + 1) - 1, Ge = j[ue], A = ue + 1, H = j[A];
          if (0 > c(Ge, Z))
            A < ot && 0 > c(H, Ge) ? (j[ft] = H, j[A] = Z, ft = A) : (j[ft] = Ge, j[ue] = Z, ft = ue);
          else if (A < ot && 0 > c(H, Z))
            j[ft] = H, j[A] = Z, ft = A;
          else break t;
        }
      }
      return k;
    }
    function c(j, k) {
      var Z = j.sortIndex - k.sortIndex;
      return Z !== 0 ? Z : j.id - k.id;
    }
    if (a.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var d = performance;
      a.unstable_now = function() {
        return d.now();
      };
    } else {
      var h = Date, y = h.now();
      a.unstable_now = function() {
        return h.now() - y;
      };
    }
    var v = [], S = [], p = 1, g = null, b = 3, N = !1, R = !1, B = !1, U = !1, w = typeof setTimeout == "function" ? setTimeout : null, L = typeof clearTimeout == "function" ? clearTimeout : null, Y = typeof setImmediate < "u" ? setImmediate : null;
    function q(j) {
      for (var k = o(S); k !== null; ) {
        if (k.callback === null) r(S);
        else if (k.startTime <= j)
          r(S), k.sortIndex = k.expirationTime, l(v, k);
        else break;
        k = o(S);
      }
    }
    function et(j) {
      if (B = !1, q(j), !R)
        if (o(v) !== null)
          R = !0, st || (st = !0, nt());
        else {
          var k = o(S);
          k !== null && mt(et, k.startTime - j);
        }
    }
    var st = !1, G = -1, X = 5, lt = -1;
    function J() {
      return U ? !0 : !(a.unstable_now() - lt < X);
    }
    function rt() {
      if (U = !1, st) {
        var j = a.unstable_now();
        lt = j;
        var k = !0;
        try {
          t: {
            R = !1, B && (B = !1, L(G), G = -1), N = !0;
            var Z = b;
            try {
              e: {
                for (q(j), g = o(v); g !== null && !(g.expirationTime > j && J()); ) {
                  var ft = g.callback;
                  if (typeof ft == "function") {
                    g.callback = null, b = g.priorityLevel;
                    var ot = ft(
                      g.expirationTime <= j
                    );
                    if (j = a.unstable_now(), typeof ot == "function") {
                      g.callback = ot, q(j), k = !0;
                      break e;
                    }
                    g === o(v) && r(v), q(j);
                  } else r(v);
                  g = o(v);
                }
                if (g !== null) k = !0;
                else {
                  var wt = o(S);
                  wt !== null && mt(
                    et,
                    wt.startTime - j
                  ), k = !1;
                }
              }
              break t;
            } finally {
              g = null, b = Z, N = !1;
            }
            k = void 0;
          }
        } finally {
          k ? nt() : st = !1;
        }
      }
    }
    var nt;
    if (typeof Y == "function")
      nt = function() {
        Y(rt);
      };
    else if (typeof MessageChannel < "u") {
      var Dt = new MessageChannel(), Ot = Dt.port2;
      Dt.port1.onmessage = rt, nt = function() {
        Ot.postMessage(null);
      };
    } else
      nt = function() {
        w(rt, 0);
      };
    function mt(j, k) {
      G = w(function() {
        j(a.unstable_now());
      }, k);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(j) {
      j.callback = null;
    }, a.unstable_forceFrameRate = function(j) {
      0 > j || 125 < j ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : X = 0 < j ? Math.floor(1e3 / j) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return b;
    }, a.unstable_next = function(j) {
      switch (b) {
        case 1:
        case 2:
        case 3:
          var k = 3;
          break;
        default:
          k = b;
      }
      var Z = b;
      b = k;
      try {
        return j();
      } finally {
        b = Z;
      }
    }, a.unstable_requestPaint = function() {
      U = !0;
    }, a.unstable_runWithPriority = function(j, k) {
      switch (j) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          j = 3;
      }
      var Z = b;
      b = j;
      try {
        return k();
      } finally {
        b = Z;
      }
    }, a.unstable_scheduleCallback = function(j, k, Z) {
      var ft = a.unstable_now();
      switch (typeof Z == "object" && Z !== null ? (Z = Z.delay, Z = typeof Z == "number" && 0 < Z ? ft + Z : ft) : Z = ft, j) {
        case 1:
          var ot = -1;
          break;
        case 2:
          ot = 250;
          break;
        case 5:
          ot = 1073741823;
          break;
        case 4:
          ot = 1e4;
          break;
        default:
          ot = 5e3;
      }
      return ot = Z + ot, j = {
        id: p++,
        callback: k,
        priorityLevel: j,
        startTime: Z,
        expirationTime: ot,
        sortIndex: -1
      }, Z > ft ? (j.sortIndex = Z, l(S, j), o(v) === null && j === o(S) && (B ? (L(G), G = -1) : B = !0, mt(et, Z - ft))) : (j.sortIndex = ot, l(v, j), R || N || (R = !0, st || (st = !0, nt()))), j;
    }, a.unstable_shouldYield = J, a.unstable_wrapCallback = function(j) {
      var k = b;
      return function() {
        var Z = b;
        b = k;
        try {
          return j.apply(this, arguments);
        } finally {
          b = Z;
        }
      };
    };
  })(af)), af;
}
var ng;
function Cb() {
  return ng || (ng = 1, nf.exports = xb()), nf.exports;
}
var lf = { exports: {} }, ct = {};
var ig;
function Ob() {
  if (ig) return ct;
  ig = 1;
  var a = /* @__PURE__ */ Symbol.for("react.transitional.element"), l = /* @__PURE__ */ Symbol.for("react.portal"), o = /* @__PURE__ */ Symbol.for("react.fragment"), r = /* @__PURE__ */ Symbol.for("react.strict_mode"), c = /* @__PURE__ */ Symbol.for("react.profiler"), d = /* @__PURE__ */ Symbol.for("react.consumer"), h = /* @__PURE__ */ Symbol.for("react.context"), y = /* @__PURE__ */ Symbol.for("react.forward_ref"), v = /* @__PURE__ */ Symbol.for("react.suspense"), S = /* @__PURE__ */ Symbol.for("react.memo"), p = /* @__PURE__ */ Symbol.for("react.lazy"), g = /* @__PURE__ */ Symbol.for("react.activity"), b = /* @__PURE__ */ Symbol.for("react.view_transition"), N = Symbol.iterator;
  function R(A) {
    return A === null || typeof A != "object" ? null : (A = N && A[N] || A["@@iterator"], typeof A == "function" ? A : null);
  }
  var B = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, U = Object.assign, w = {};
  function L(A, H, W) {
    this.props = A, this.context = H, this.refs = w, this.updater = W || B;
  }
  L.prototype.isReactComponent = {}, L.prototype.setState = function(A, H) {
    if (typeof A != "object" && typeof A != "function" && A != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, A, H, "setState");
  }, L.prototype.forceUpdate = function(A) {
    this.updater.enqueueForceUpdate(this, A, "forceUpdate");
  };
  function Y() {
  }
  Y.prototype = L.prototype;
  function q(A, H, W) {
    this.props = A, this.context = H, this.refs = w, this.updater = W || B;
  }
  var et = q.prototype = new Y();
  et.constructor = q, U(et, L.prototype), et.isPureReactComponent = !0;
  var st = Array.isArray;
  function G() {
  }
  var X = { H: null, A: null, T: null, S: null }, lt = Object.prototype.hasOwnProperty;
  function J(A, H, W) {
    var I = W.ref;
    return {
      $$typeof: a,
      type: A,
      key: H,
      ref: I !== void 0 ? I : null,
      props: W
    };
  }
  function rt(A, H) {
    return J(A.type, H, A.props);
  }
  function nt(A) {
    return typeof A == "object" && A !== null && A.$$typeof === a;
  }
  function Dt(A) {
    var H = { "=": "=0", ":": "=2" };
    return "$" + A.replace(/[=:]/g, function(W) {
      return H[W];
    });
  }
  var Ot = /\/+/g;
  function mt(A, H) {
    return typeof A == "object" && A !== null && A.key != null ? Dt("" + A.key) : H.toString(36);
  }
  function j(A) {
    switch (A.status) {
      case "fulfilled":
        return A.value;
      case "rejected":
        throw A.reason;
      default:
        switch (typeof A.status == "string" ? A.then(G, G) : (A.status = "pending", A.then(
          function(H) {
            A.status === "pending" && (A.status = "fulfilled", A.value = H);
          },
          function(H) {
            A.status === "pending" && (A.status = "rejected", A.reason = H);
          }
        )), A.status) {
          case "fulfilled":
            return A.value;
          case "rejected":
            throw A.reason;
        }
    }
    throw A;
  }
  function k(A, H, W, I, yt) {
    var bt = typeof A;
    (bt === "undefined" || bt === "boolean") && (A = null);
    var Et = !1;
    if (A === null) Et = !0;
    else
      switch (bt) {
        case "bigint":
        case "string":
        case "number":
          Et = !0;
          break;
        case "object":
          switch (A.$$typeof) {
            case a:
            case l:
              Et = !0;
              break;
            case p:
              return Et = A._init, k(
                Et(A._payload),
                H,
                W,
                I,
                yt
              );
          }
      }
    if (Et)
      return yt = yt(A), Et = I === "" ? "." + mt(A, 0) : I, st(yt) ? (W = "", Et != null && (W = Et.replace(Ot, "$&/") + "/"), k(yt, H, W, "", function(qe) {
        return qe;
      })) : yt != null && (nt(yt) && (yt = rt(
        yt,
        W + (yt.key == null || A && A.key === yt.key ? "" : ("" + yt.key).replace(
          Ot,
          "$&/"
        ) + "/") + Et
      )), H.push(yt)), 1;
    Et = 0;
    var $ = I === "" ? "." : I + ":";
    if (st(A))
      for (var at = 0; at < A.length; at++)
        I = A[at], bt = $ + mt(I, at), Et += k(
          I,
          H,
          W,
          bt,
          yt
        );
    else if (at = R(A), typeof at == "function")
      for (A = at.call(A), at = 0; !(I = A.next()).done; )
        I = I.value, bt = $ + mt(I, at++), Et += k(
          I,
          H,
          W,
          bt,
          yt
        );
    else if (bt === "object") {
      if (typeof A.then == "function")
        return k(
          j(A),
          H,
          W,
          I,
          yt
        );
      throw H = String(A), Error(
        "Objects are not valid as a React child (found: " + (H === "[object Object]" ? "object with keys {" + Object.keys(A).join(", ") + "}" : H) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return Et;
  }
  function Z(A, H, W) {
    if (A == null) return A;
    var I = [], yt = 0;
    return k(A, I, "", "", function(bt) {
      return H.call(W, bt, yt++);
    }), I;
  }
  function ft(A) {
    if (A._status === -1) {
      var H = A._result, W = H();
      W.then(
        function(I) {
          (A._status === 0 || A._status === -1) && (A._status = 1, A._result = I, W.status === void 0 && (W.status = "fulfilled", W.value = I));
        },
        function(I) {
          (A._status === 0 || A._status === -1) && (A._status = 2, A._result = I, W.status === void 0 && (W.status = "rejected", W.reason = I));
        }
      ), A._status === -1 && (A._status = 0, A._result = W);
    }
    if (A._status === 1) return A._result.default;
    throw A._result;
  }
  var ot = typeof reportError == "function" ? reportError : function(A) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var H = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof A == "object" && A !== null && typeof A.message == "string" ? String(A.message) : String(A),
        error: A
      });
      if (!window.dispatchEvent(H)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", A);
      return;
    }
    console.error(A);
  };
  function wt(A) {
    var H = X.T, W = {};
    W.types = H !== null ? H.types : null, X.T = W;
    try {
      var I = A(), yt = X.S;
      yt !== null && yt(W, I), typeof I == "object" && I !== null && typeof I.then == "function" && I.then(G, ot);
    } catch (bt) {
      ot(bt);
    } finally {
      H !== null && W.types !== null && (H.types = W.types), X.T = H;
    }
  }
  function ue(A) {
    var H = X.T;
    if (H !== null) {
      var W = H.types;
      W === null ? H.types = [A] : W.indexOf(A) === -1 && W.push(A);
    } else wt(ue.bind(null, A));
  }
  var Ge = {
    map: Z,
    forEach: function(A, H, W) {
      Z(
        A,
        function() {
          H.apply(this, arguments);
        },
        W
      );
    },
    count: function(A) {
      var H = 0;
      return Z(A, function() {
        H++;
      }), H;
    },
    toArray: function(A) {
      return Z(A, function(H) {
        return H;
      }) || [];
    },
    only: function(A) {
      if (!nt(A))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return A;
    }
  };
  return ct.Activity = g, ct.Children = Ge, ct.Component = L, ct.Fragment = o, ct.Profiler = c, ct.PureComponent = q, ct.StrictMode = r, ct.Suspense = v, ct.ViewTransition = b, ct.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = X, ct.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(A) {
      return X.H.useMemoCache(A);
    }
  }, ct.addTransitionType = ue, ct.cache = function(A) {
    return function() {
      return A.apply(null, arguments);
    };
  }, ct.cacheSignal = function() {
    return null;
  }, ct.cloneElement = function(A, H, W) {
    if (A == null)
      throw Error(
        "The argument must be a React element, but you passed " + A + "."
      );
    var I = U({}, A.props), yt = A.key;
    if (H != null)
      for (bt in H.key !== void 0 && (yt = "" + H.key), H)
        !lt.call(H, bt) || bt === "key" || bt === "__self" || bt === "__source" || bt === "ref" && H.ref === void 0 || (I[bt] = H[bt]);
    var bt = arguments.length - 2;
    if (bt === 1) I.children = W;
    else if (1 < bt) {
      for (var Et = Array(bt), $ = 0; $ < bt; $++)
        Et[$] = arguments[$ + 2];
      I.children = Et;
    }
    return J(A.type, yt, I);
  }, ct.createContext = function(A) {
    return A = {
      $$typeof: h,
      _currentValue: A,
      _currentValue2: A,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, A.Provider = A, A.Consumer = {
      $$typeof: d,
      _context: A
    }, A;
  }, ct.createElement = function(A, H, W) {
    var I, yt = {}, bt = null;
    if (H != null)
      for (I in H.key !== void 0 && (bt = "" + H.key), H)
        lt.call(H, I) && I !== "key" && I !== "__self" && I !== "__source" && (yt[I] = H[I]);
    var Et = arguments.length - 2;
    if (Et === 1) yt.children = W;
    else if (1 < Et) {
      for (var $ = Array(Et), at = 0; at < Et; at++)
        $[at] = arguments[at + 2];
      yt.children = $;
    }
    if (A && A.defaultProps)
      for (I in Et = A.defaultProps, Et)
        yt[I] === void 0 && (yt[I] = Et[I]);
    return J(A, bt, yt);
  }, ct.createRef = function() {
    return { current: null };
  }, ct.forwardRef = function(A) {
    return { $$typeof: y, render: A };
  }, ct.isValidElement = nt, ct.lazy = function(A) {
    return {
      $$typeof: p,
      _payload: { _status: -1, _result: A },
      _init: ft
    };
  }, ct.memo = function(A, H) {
    return {
      $$typeof: S,
      type: A,
      compare: H === void 0 ? null : H
    };
  }, ct.startTransition = wt, ct.unstable_useCacheRefresh = function() {
    return X.H.useCacheRefresh();
  }, ct.use = function(A) {
    return X.H.use(A);
  }, ct.useActionState = function(A, H, W) {
    return X.H.useActionState(A, H, W);
  }, ct.useCallback = function(A, H) {
    return X.H.useCallback(A, H);
  }, ct.useContext = function(A) {
    return X.H.useContext(A);
  }, ct.useDebugValue = function() {
  }, ct.useDeferredValue = function(A, H) {
    return X.H.useDeferredValue(A, H);
  }, ct.useEffect = function(A, H) {
    return X.H.useEffect(A, H);
  }, ct.useEffectEvent = function(A) {
    return X.H.useEffectEvent(A);
  }, ct.useId = function() {
    return X.H.useId();
  }, ct.useImperativeHandle = function(A, H, W) {
    return X.H.useImperativeHandle(A, H, W);
  }, ct.useInsertionEffect = function(A, H) {
    return X.H.useInsertionEffect(A, H);
  }, ct.useLayoutEffect = function(A, H) {
    return X.H.useLayoutEffect(A, H);
  }, ct.useMemo = function(A, H) {
    return X.H.useMemo(A, H);
  }, ct.useOptimistic = function(A, H) {
    return X.H.useOptimistic(A, H);
  }, ct.useReducer = function(A, H, W) {
    return X.H.useReducer(A, H, W);
  }, ct.useRef = function(A) {
    return X.H.useRef(A);
  }, ct.useState = function(A) {
    return X.H.useState(A);
  }, ct.useSyncExternalStore = function(A, H, W) {
    return X.H.useSyncExternalStore(
      A,
      H,
      W
    );
  }, ct.useTransition = function() {
    return X.H.useTransition();
  }, ct.version = "19.3.0", ct;
}
var ag;
function Pf() {
  return ag || (ag = 1, lf.exports = Ob()), lf.exports;
}
var uf = { exports: {} }, de = {};
var lg;
function zb() {
  if (lg) return de;
  lg = 1;
  var a = Pf();
  function l(p) {
    var g = "https://react.dev/errors/" + p;
    if (1 < arguments.length) {
      g += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var b = 2; b < arguments.length; b++)
        g += "&args[]=" + encodeURIComponent(arguments[b]);
    }
    return "Minified React error #" + p + "; visit " + g + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o() {
  }
  var r = {
    d: {
      f: o,
      r: function() {
        throw Error(l(522));
      },
      D: o,
      C: o,
      L: o,
      m: o,
      X: o,
      S: o,
      M: o
    },
    p: 0,
    findDOMNode: null
  }, c = /* @__PURE__ */ Symbol.for("react.portal"), d = /* @__PURE__ */ Symbol.for("react.recoverable"), h = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function y(p, g, b) {
    var N = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: c,
      key: N == null ? null : N === h ? h : "" + N,
      children: p,
      containerInfo: g,
      implementation: b
    };
  }
  var v = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function S(p, g) {
    if (p === "font") return "";
    if (typeof g == "string")
      return g === "use-credentials" ? g : "";
  }
  return de.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, de.browser = function(p) {
    return { $$typeof: d, _reason: p };
  }, de.createPortal = function(p, g) {
    var b = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!g || g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11)
      throw Error(l(299));
    return y(p, g, null, b);
  }, de.flushSync = function(p) {
    var g = v.T, b = r.p;
    try {
      if (v.T = null, r.p = 2, p) return p();
    } finally {
      v.T = g, r.p = b, r.d.f();
    }
  }, de.preconnect = function(p, g) {
    typeof p == "string" && (g ? (g = g.crossOrigin, g = typeof g == "string" ? g === "use-credentials" ? g : "" : void 0) : g = null, r.d.C(p, g));
  }, de.prefetchDNS = function(p) {
    typeof p == "string" && r.d.D(p);
  }, de.preinit = function(p, g) {
    if (typeof p == "string" && g && typeof g.as == "string") {
      var b = g.as, N = S(b, g.crossOrigin), R = typeof g.integrity == "string" ? g.integrity : void 0, B = typeof g.fetchPriority == "string" ? g.fetchPriority : void 0;
      b === "style" ? r.d.S(
        p,
        typeof g.precedence == "string" ? g.precedence : void 0,
        {
          crossOrigin: N,
          integrity: R,
          fetchPriority: B
        }
      ) : b === "script" && r.d.X(p, {
        crossOrigin: N,
        integrity: R,
        fetchPriority: B,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0
      });
    }
  }, de.preinitModule = function(p, g) {
    if (typeof p == "string")
      if (typeof g == "object" && g !== null) {
        if (g.as == null || g.as === "script") {
          var b = S(
            g.as,
            g.crossOrigin
          );
          r.d.M(p, {
            crossOrigin: b,
            integrity: typeof g.integrity == "string" ? g.integrity : void 0,
            nonce: typeof g.nonce == "string" ? g.nonce : void 0,
            fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0
          });
        }
      } else g == null && r.d.M(p);
  }, de.preload = function(p, g) {
    if (typeof p == "string" && typeof g == "object" && g !== null && typeof g.as == "string") {
      var b = g.as, N = S(b, g.crossOrigin);
      r.d.L(p, b, {
        crossOrigin: N,
        integrity: typeof g.integrity == "string" ? g.integrity : void 0,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0,
        type: typeof g.type == "string" ? g.type : void 0,
        fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0,
        referrerPolicy: typeof g.referrerPolicy == "string" ? g.referrerPolicy : void 0,
        imageSrcSet: typeof g.imageSrcSet == "string" ? g.imageSrcSet : void 0,
        imageSizes: typeof g.imageSizes == "string" ? g.imageSizes : void 0,
        media: typeof g.media == "string" ? g.media : void 0
      });
    }
  }, de.preloadModule = function(p, g) {
    if (typeof p == "string")
      if (g) {
        var b = S(g.as, g.crossOrigin);
        r.d.m(p, {
          as: typeof g.as == "string" && g.as !== "script" ? g.as : void 0,
          crossOrigin: b,
          integrity: typeof g.integrity == "string" ? g.integrity : void 0,
          nonce: typeof g.nonce == "string" ? g.nonce : void 0,
          fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0
        });
      } else r.d.m(p);
  }, de.requestFormReset = function(p) {
    r.d.r(p);
  }, de.unstable_batchedUpdates = function(p, g) {
    return p(g);
  }, de.useFormState = function(p, g, b) {
    return v.H.useFormState(p, g, b);
  }, de.useFormStatus = function() {
    return v.H.useHostTransitionStatus();
  }, de.version = "19.3.0", de;
}
var ug;
function Rb() {
  if (ug) return uf.exports;
  ug = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (l) {
        console.error(l);
      }
  }
  return a(), uf.exports = zb(), uf.exports;
}
var sg;
function Nb() {
  if (sg) return Fl;
  sg = 1;
  var a = Cb(), l = Pf(), o = Rb();
  function r(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function c(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function d(t) {
    for (var e = t, n = e; n && !n.alternate; )
      e = n, (e.flags & 4098) !== 0 && (t = e.return), n = e.return;
    for (; e.return; ) e = e.return;
    return e.tag === 3 ? t : null;
  }
  function h(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function y(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function v(t) {
    if (d(t) !== t)
      throw Error(r(188));
  }
  function S(t) {
    var e = t.alternate;
    if (!e) {
      if (e = d(t), e === null) throw Error(r(188));
      return e !== t ? null : t;
    }
    for (var n = t, i = e; ; ) {
      var u = n.return;
      if (u === null) break;
      var s = u.alternate;
      if (s === null) {
        if (i = u.return, i !== null) {
          n = i;
          continue;
        }
        break;
      }
      if (u.child === s.child) {
        for (s = u.child; s; ) {
          if (s === n) return v(u), t;
          if (s === i) return v(u), e;
          s = s.sibling;
        }
        throw Error(r(188));
      }
      if (n.return !== i.return) n = u, i = s;
      else {
        for (var f = !1, m = u.child; m; ) {
          if (m === n) {
            f = !0, n = u, i = s;
            break;
          }
          if (m === i) {
            f = !0, i = u, n = s;
            break;
          }
          m = m.sibling;
        }
        if (!f) {
          for (m = s.child; m; ) {
            if (m === n) {
              f = !0, n = s, i = u;
              break;
            }
            if (m === i) {
              f = !0, i = s, n = u;
              break;
            }
            m = m.sibling;
          }
          if (!f) throw Error(r(189));
        }
      }
      if (n.alternate !== i) throw Error(r(190));
    }
    if (n.tag !== 3) throw Error(r(188));
    return n.stateNode.current === n ? t : e;
  }
  function p(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = p(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  function g(t, e, n, i, u, s) {
    for (; t !== null; ) {
      if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && n(t, i, u, s) || (t.tag !== 22 || t.memoizedState === null) && (e || t.tag !== 5 && t.tag !== 27) && g(
        t.child,
        e,
        n,
        i,
        u,
        s
      ))
        return !0;
      t = t.sibling;
    }
    return !1;
  }
  function b(t) {
    for (t = t.return; t !== null; ) {
      if (t.tag === 3 || t.tag === 5 || t.tag === 27) return t;
      t = t.return;
    }
    return null;
  }
  function N(t) {
    var e = !1;
    for (t = t.return; t !== null && (t.tag === 4 && (e = !0), !(t.tag === 3 || t.tag === 5 || t.tag === 27)); )
      t = t.return;
    return e;
  }
  function R(t) {
    var e = [null, null], n = b(t);
    return n === null || B(
      e,
      t,
      n.child,
      { foundSelf: !1 }
    ), e;
  }
  function B(t, e, n, i) {
    for (; n !== null; ) {
      if (n === e) i.foundSelf = !0;
      else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
        if (i.foundSelf) return t[1] = n, !0;
        t[0] = n;
      } else if ((n.tag !== 22 || n.memoizedState === null) && B(
        t,
        e,
        n.child,
        i
      ))
        return !0;
      n = n.sibling;
    }
    return !1;
  }
  function U(t) {
    switch (t.tag) {
      case 5:
      case 27:
      case 6:
        return t.stateNode;
      case 3:
        return t.stateNode.containerInfo;
      default:
        throw Error(r(559));
    }
  }
  var w = null, L = null;
  function Y(t, e, n) {
    return t === n ? !0 : t === e ? (w = t, !0) : !1;
  }
  function q(t, e, n) {
    return t === n ? (L = t, !1) : t === e ? (L !== null && (w = t), !0) : !1;
  }
  function et(t) {
    if (t === null) return null;
    do
      t = t === null ? null : t.return;
    while (t && t.tag !== 5 && t.tag !== 27 && t.tag !== 3);
    return t || null;
  }
  function st(t, e, n) {
    for (var i = 0, u = t; u; u = n(u)) i++;
    u = 0;
    for (var s = e; s; s = n(s)) u++;
    for (; 0 < i - u; ) t = n(t), i--;
    for (; 0 < u - i; ) e = n(e), u--;
    for (; i--; ) {
      if (t === e || e !== null && t === e.alternate)
        return t;
      t = n(t), e = n(e);
    }
    return null;
  }
  var G = Object.assign, X = /* @__PURE__ */ Symbol.for("react.element"), lt = /* @__PURE__ */ Symbol.for("react.transitional.element"), J = /* @__PURE__ */ Symbol.for("react.portal"), rt = /* @__PURE__ */ Symbol.for("react.fragment"), nt = /* @__PURE__ */ Symbol.for("react.strict_mode"), Dt = /* @__PURE__ */ Symbol.for("react.profiler"), Ot = /* @__PURE__ */ Symbol.for("react.consumer"), mt = /* @__PURE__ */ Symbol.for("react.context"), j = /* @__PURE__ */ Symbol.for("react.forward_ref"), k = /* @__PURE__ */ Symbol.for("react.suspense"), Z = /* @__PURE__ */ Symbol.for("react.suspense_list"), ft = /* @__PURE__ */ Symbol.for("react.memo"), ot = /* @__PURE__ */ Symbol.for("react.lazy"), wt = /* @__PURE__ */ Symbol.for("react.activity"), ue = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), Ge = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), A = /* @__PURE__ */ Symbol.for("react.view_transition"), H = /* @__PURE__ */ Symbol.for("react.recoverable"), W = Symbol.iterator;
  function I(t) {
    return t === null || typeof t != "object" ? null : (t = W && t[W] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var yt = /* @__PURE__ */ Symbol.for("react.client.reference");
  function bt(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === yt ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case rt:
        return "Fragment";
      case Dt:
        return "Profiler";
      case nt:
        return "StrictMode";
      case k:
        return "Suspense";
      case Z:
        return "SuspenseList";
      case wt:
        return "Activity";
      case A:
        return "ViewTransition";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case J:
          return "Portal";
        case mt:
          return t.displayName || "Context";
        case Ot:
          return (t._context.displayName || "Context") + ".Consumer";
        case j:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case ft:
          return e = t.displayName || null, e !== null ? e : bt(t.type) || "Memo";
        case ot:
          e = t._payload, t = t._init;
          try {
            return bt(t(e));
          } catch {
          }
      }
    return null;
  }
  var Et = Array.isArray, $ = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, at = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, qe = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, $i = [], Xn = -1;
  function ze(t) {
    return { current: t };
  }
  function Gt(t) {
    0 > Xn || (t.current = $i[Xn], $i[Xn] = null, Xn--);
  }
  function Ht(t, e) {
    Xn++, $i[Xn] = t.current, t.current = e;
  }
  var cn = ze(null), Ia = ze(null), Qn = ze(null), hu = ze(null);
  function du(t, e) {
    switch (Ht(Qn, e), Ht(Ia, t), Ht(cn, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? o0(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI)
          e = o0(e), t = r0(e, t);
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    Gt(cn), Ht(cn, t);
  }
  function Ii() {
    Gt(cn), Gt(Ia), Gt(Qn);
  }
  function To(t) {
    var e = t.memoizedState;
    e !== null && (Ya._currentValue = e.memoizedState, Ht(hu, t)), e = cn.current;
    var n = r0(e, t.type);
    e !== n && (Ht(Ia, t), Ht(cn, n));
  }
  function mu(t) {
    Ia.current === t && (Gt(cn), Gt(Ia)), hu.current === t && (Gt(hu), Ya._currentValue = qe);
  }
  var bo, zh;
  function Zn(t) {
    if (bo === void 0)
      try {
        throw Error();
      } catch (n) {
        var e = n.stack.trim().match(/\n( *(at )?)/);
        bo = e && e[1] || "", zh = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + bo + t + zh;
  }
  var Eo = !1;
  function Ao(t, e) {
    if (!t || Eo) return "";
    Eo = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var i = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var _ = function() {
                throw Error();
              };
              if (Object.defineProperty(_.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(_, []);
                } catch (Q) {
                  var M = Q;
                }
                Reflect.construct(t, [], _);
              } else {
                try {
                  _.call();
                } catch (Q) {
                  M = Q;
                }
                _ = !1;
                try {
                  var O = Object.getOwnPropertyDescriptor(
                    t.prototype,
                    "props"
                  );
                  Object.defineProperty(t.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), _ = !0, new t();
                } finally {
                  _ && (O !== void 0 ? Object.defineProperty(t.prototype, "props", O) : delete t.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (Q) {
                M = Q;
              }
              (_ = t()) && typeof _.catch == "function" && _.catch(function() {
              });
            }
          } catch (Q) {
            if (Q && M && typeof Q.stack == "string")
              return [Q.stack, M.stack];
          }
          return [null, null];
        }
      };
      i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var u = Object.getOwnPropertyDescriptor(
        i.DetermineComponentFrameRoot,
        "name"
      );
      u && u.configurable && Object.defineProperty(
        i.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var s = i.DetermineComponentFrameRoot(), f = s[0], m = s[1];
      if (f && m) {
        var T = f.split(`
`), x = m.split(`
`);
        for (u = i = 0; i < T.length && !T[i].includes("DetermineComponentFrameRoot"); )
          i++;
        for (; u < x.length && !x[u].includes(
          "DetermineComponentFrameRoot"
        ); )
          u++;
        if (i === T.length || u === x.length)
          for (i = T.length - 1, u = x.length - 1; 1 <= i && 0 <= u && T[i] !== x[u]; )
            u--;
        for (; 1 <= i && 0 <= u; i--, u--)
          if (T[i] !== x[u]) {
            if (i !== 1 || u !== 1)
              do
                if (i--, u--, 0 > u || T[i] !== x[u]) {
                  var z = `
` + T[i].replace(" at new ", " at ");
                  return t.displayName && z.includes("<anonymous>") && (z = z.replace("<anonymous>", t.displayName)), z;
                }
              while (1 <= i && 0 <= u);
            break;
          }
      }
    } finally {
      Eo = !1, Error.prepareStackTrace = n;
    }
    return (n = t ? t.displayName || t.name : "") ? Zn(n) : "";
  }
  function O1(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Zn(t.type);
      case 16:
        return Zn("Lazy");
      case 13:
        return t.child !== e && e !== null ? Zn("Suspense Fallback") : Zn("Suspense");
      case 19:
        return Zn("SuspenseList");
      case 0:
      case 15:
        return Ao(t.type, !1);
      case 11:
        return Ao(t.type.render, !1);
      case 1:
        return Ao(t.type, !0);
      case 31:
        return Zn("Activity");
      case 30:
        return Zn("ViewTransition");
      default:
        return "";
    }
  }
  function Rh(t) {
    try {
      var e = "", n = null;
      do
        e += O1(t, n), n = t, t = t.return;
      while (t);
      return e;
    } catch (i) {
      return `
Error generating stack: ` + i.message + `
` + i.stack;
    }
  }
  var Mo = Object.prototype.hasOwnProperty, Do = a.unstable_scheduleCallback, xo = a.unstable_cancelCallback, z1 = a.unstable_shouldYield, R1 = a.unstable_requestPaint, Re = a.unstable_now, N1 = a.unstable_getCurrentPriorityLevel, Nh = a.unstable_ImmediatePriority, Vh = a.unstable_UserBlockingPriority, yu = a.unstable_NormalPriority, V1 = a.unstable_LowPriority, _h = a.unstable_IdlePriority, _1 = a.log, U1 = a.unstable_setDisableYieldValue, tl = null, Ne = null;
  function Kn(t) {
    if (typeof _1 == "function" && U1(t), Ne && typeof Ne.setStrictMode == "function")
      try {
        Ne.setStrictMode(tl, t);
      } catch {
      }
  }
  var Ve = Math.clz32 ? Math.clz32 : H1, B1 = Math.log, w1 = Math.LN2;
  function H1(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (B1(t) / w1 | 0) | 0;
  }
  var gu = 256, pu = 262144, vu = 4194304;
  function Ai(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return t & -t;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Su(t, e, n) {
    var i = t.pendingLanes;
    if (i === 0) return 0;
    var u = 0, s = t.suspendedLanes, f = t.pingedLanes;
    t = t.warmLanes;
    var m = i & 134217727;
    return m !== 0 ? (i = m & ~s, i !== 0 ? u = Ai(i) : (f &= m, f !== 0 ? u = Ai(f) : n || (n = m & ~t, n !== 0 && (u = Ai(n))))) : (m = i & ~s, m !== 0 ? u = Ai(m) : f !== 0 ? u = Ai(f) : n || (n = i & ~t, n !== 0 && (u = Ai(n)))), u === 0 ? 0 : e !== 0 && e !== u && (e & s) === 0 && (s = u & -u, n = e & -e, s >= n || s === 32 && (n & 4194048) !== 0) ? e : u;
  }
  function el(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function Uh(t, e) {
    (e & 8) !== 0 && (e |= e & 32);
    var n = t.entangledLanes;
    if (n !== 0)
      for (t = t.entanglements, n &= e; 0 < n; ) {
        var i = 31 - Ve(n), u = 1 << i;
        e |= t[i], n &= ~u;
      }
    return e;
  }
  function L1(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Bh() {
    var t = vu;
    return vu <<= 1, (vu & 62914560) === 0 && (vu = 4194304), t;
  }
  function Co(t) {
    for (var e = [], n = 0; 31 > n; n++) e.push(t);
    return e;
  }
  function nl(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function j1(t, e, n, i, u, s) {
    var f = t.pendingLanes;
    t.pendingLanes = n, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= n, t.entangledLanes &= n, t.errorRecoveryDisabledLanes &= n, t.shellSuspendCounter = 0;
    var m = t.entanglements, T = t.expirationTimes, x = t.hiddenUpdates;
    for (n = f & ~n; 0 < n; ) {
      var z = 31 - Ve(n), _ = 1 << z;
      m[z] = 0, T[z] = -1;
      var M = x[z];
      if (M !== null)
        for (x[z] = null, z = 0; z < M.length; z++) {
          var O = M[z];
          O !== null && (O.lane &= -536870913);
        }
      n &= ~_;
    }
    i !== 0 && wh(t, i, 0), s !== 0 && u === 0 && t.tag !== 0 && (t.suspendedLanes |= s & ~(f & ~e));
  }
  function wh(t, e, n) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var i = 31 - Ve(e);
    t.entangledLanes |= e, t.entanglements[i] = t.entanglements[i] | 1073741824 | n & 261930;
  }
  function Hh(t, e) {
    var n = t.entangledLanes |= e;
    for (t = t.entanglements; n; ) {
      var i = 31 - Ve(n), u = 1 << i;
      u & e | t[i] & e && (t[i] |= e), n &= ~u;
    }
  }
  function Lh(t, e) {
    var n = e & -e;
    return n = (n & 42) !== 0 ? 1 : Oo(n), (n & (t.suspendedLanes | e)) !== 0 ? 0 : n;
  }
  function Oo(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function zo(t) {
    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function jh() {
    var t = at.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : K0(t.type));
  }
  function Yh(t, e) {
    var n = at.p;
    try {
      return at.p = t, e();
    } finally {
      at.p = n;
    }
  }
  var xn = Math.random().toString(36).slice(2), se = "__reactFiber$" + xn, Ee = "__reactProps$" + xn, ta = "__reactContainer$" + xn, Gh = "__reactEvents$" + xn, Y1 = "__reactListeners$" + xn, G1 = "__reactHandles$" + xn, qh = "__reactResources$" + xn, il = "__reactMarker$" + xn, Tu = "__reactLoad$" + xn;
  function bu(t) {
    delete t[se], delete t[Ee], delete t[Y1], delete t[G1];
  }
  function Mi(t) {
    var e;
    if (e = t[se]) return e;
    for (var n = t.parentNode; n; ) {
      if (e = n[ta] || n[se]) {
        if (n = e.alternate, e.child !== null || n !== null && n.child !== null)
          for (t = x0(t); t !== null; ) {
            if (n = t[se]) return n;
            t = x0(t);
          }
        return e;
      }
      t = n, n = t.parentNode;
    }
    return null;
  }
  function ea(t) {
    if (t = t[se] || t[ta]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function al(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(r(33));
  }
  function na(t) {
    var e = t[qh];
    return e || (e = t[qh] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function ne(t) {
    t[il] = !0;
  }
  function Xh(t) {
    t[Tu] = void 0;
  }
  var Qh = /* @__PURE__ */ new Set(), Zh = {};
  function Di(t, e) {
    ia(t, e), ia(t + "Capture", e);
  }
  function ia(t, e) {
    for (Zh[t] = e, t = 0; t < e.length; t++)
      Qh.add(e[t]);
  }
  var q1 = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Kh = {}, Jh = {};
  function X1(t) {
    return Mo.call(Jh, t) ? !0 : Mo.call(Kh, t) ? !1 : q1.test(t) ? Jh[t] = !0 : (Kh[t] = !0, !1);
  }
  var Mt = !1;
  function Fh() {
    var t = Mt;
    return Mt = !1, t;
  }
  function Eu(t, e, n) {
    if (X1(e))
      if (n === null) t.removeAttribute(e);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var i = e.toLowerCase().slice(0, 5);
            if (i !== "data-" && i !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, n);
      }
  }
  function Au(t, e, n) {
    if (n === null) t.removeAttribute(e);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, n);
    }
  }
  function Cn(t, e, n, i) {
    if (i === null) t.removeAttribute(n);
    else {
      switch (typeof i) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(n);
          return;
      }
      t.setAttributeNS(e, n, i);
    }
  }
  function _e(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function Ph(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function Q1(t, e, n) {
    var i = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    );
    if (!t.hasOwnProperty(e) && typeof i < "u" && typeof i.get == "function" && typeof i.set == "function") {
      var u = i.get, s = i.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return u.call(this);
        },
        set: function(f) {
          n = "" + f, s.call(this, f);
        }
      }), Object.defineProperty(t, e, {
        enumerable: i.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(f) {
          n = "" + f;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function Ro(t) {
    if (!t._valueTracker) {
      var e = Ph(t) ? "checked" : "value";
      t._valueTracker = Q1(
        t,
        e,
        "" + t[e]
      );
    }
  }
  function kh(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var n = e.getValue(), i = "";
    return t && (i = Ph(t) ? t.checked ? "true" : "false" : t.value), t = i, t !== n ? (e.setValue(t), !0) : !1;
  }
  var Z1 = /[\n"\\]/g;
  function Xe(t) {
    return t.replace(
      Z1,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function No(t, e, n, i, u, s, f, m) {
    t.name = "", f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? t.type = f : t.removeAttribute("type"), e != null ? f === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + _e(e)) : t.value !== "" + _e(e) && (t.value = "" + _e(e)) : f !== "submit" && f !== "reset" || t.removeAttribute("value"), e != null ? f === "number" && t.value == e ? Vo(t, _e(t.value)) : Vo(t, _e(e)) : n != null ? Vo(t, _e(n)) : i != null && t.removeAttribute("value"), u == null && s != null && (t.defaultChecked = !!s), u != null && (t.checked = u && typeof u != "function" && typeof u != "symbol"), m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean" ? t.name = "" + _e(m) : t.removeAttribute("name");
  }
  function Wh(t, e, n, i, u, s, f, m) {
    if (s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (t.type = s), e != null || n != null) {
      if (!(s !== "submit" && s !== "reset" || e != null)) {
        Ro(t);
        return;
      }
      n = n != null ? "" + _e(n) : "", e = e != null ? "" + _e(e) : n, m || e === t.value || (t.value = e), t.defaultValue = e;
    }
    i = i ?? u, i = typeof i != "function" && typeof i != "symbol" && !!i, t.checked = m ? t.checked : !!i, t.defaultChecked = !!i, f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" && (t.name = f), Ro(t);
  }
  function Vo(t, e) {
    t.defaultValue !== "" + e && (t.defaultValue = "" + e);
  }
  function aa(t, e, n, i) {
    if (t = t.options, e) {
      e = {};
      for (var u = 0; u < n.length; u++)
        e["$" + n[u]] = !0;
      for (n = 0; n < t.length; n++)
        u = e.hasOwnProperty("$" + t[n].value), t[n].selected !== u && (t[n].selected = u), u && i && (t[n].defaultSelected = !0);
    } else {
      for (n = "" + _e(n), e = null, u = 0; u < t.length; u++) {
        if (t[u].value === n) {
          t[u].selected = !0, i && (t[u].defaultSelected = !0);
          return;
        }
        e !== null || t[u].disabled || (e = t[u]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function $h(t, e, n) {
    if (e != null && (e = "" + _e(e), e !== t.value && (t.value = e), n == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = n != null ? "" + _e(n) : "";
  }
  function Ih(t, e, n, i) {
    if (e == null) {
      if (i != null) {
        if (n != null) throw Error(r(92));
        if (Et(i)) {
          if (1 < i.length) throw Error(r(93));
          i = i[0];
        }
        n = i;
      }
      n == null && (n = ""), e = n;
    }
    n = _e(e), t.defaultValue = n, i = t.textContent, i === n && i !== "" && i !== null && (t.value = i), Ro(t);
  }
  function la(t, e) {
    if (e) {
      var n = t.firstChild;
      if (n && n === t.lastChild && n.nodeType === 3) {
        n.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var K1 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function td(t, e, n) {
    var i = e.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? i ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : i ? t.setProperty(e, n) : typeof n != "number" || n === 0 || K1.has(e) ? e === "float" ? t.cssFloat = n : t[e] = ("" + n).trim() : t[e] = n + "px";
  }
  function ed(t, e, n) {
    if (e != null && typeof e != "object")
      throw Error(r(62));
    if (t = t.style, n != null) {
      for (var i in n)
        !n.hasOwnProperty(i) || e != null && e.hasOwnProperty(i) || (i.indexOf("--") === 0 ? t.setProperty(i, "") : i === "float" ? t.cssFloat = "" : t[i] = "", Mt = !0);
      for (var u in e)
        i = e[u], e.hasOwnProperty(u) && n[u] !== i && (td(t, u, i), Mt = !0);
    } else
      for (var s in e)
        e.hasOwnProperty(s) && td(t, s, e[s]);
  }
  function _o(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var J1 = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), F1 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Mu(t) {
    return F1.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  function fn() {
  }
  var Uo = null;
  function Bo(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var ua = null, sa = null;
  function nd(t) {
    var e = ea(t);
    if (e && (t = e.stateNode)) {
      var n = t[Ee] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (No(
            t,
            n.value,
            n.defaultValue,
            n.defaultValue,
            n.checked,
            n.defaultChecked,
            n.type,
            n.name
          ), e = n.name, n.type === "radio" && e != null) {
            for (n = t; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll(
              'input[name="' + Xe(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < n.length; e++) {
              var i = n[e];
              if (i !== t && i.form === t.form) {
                var u = i[Ee] || null;
                if (!u) throw Error(r(90));
                No(
                  i,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name
                );
              }
            }
            for (e = 0; e < n.length; e++)
              i = n[e], i.form === t.form && kh(i);
          }
          break t;
        case "textarea":
          $h(t, n.value, n.defaultValue);
          break t;
        case "select":
          e = n.value, e != null && aa(t, !!n.multiple, e, !1);
      }
    }
  }
  var wo = !1;
  function id(t, e, n) {
    if (wo) return t(e, n);
    wo = !0;
    try {
      var i = t(e);
      return i;
    } finally {
      if (wo = !1, (ua !== null || sa !== null) && (Ms(), ua && (e = ua, t = sa, sa = ua = null, nd(e), t)))
        for (e = 0; e < t.length; e++) nd(t[e]);
    }
  }
  function ll(t, e) {
    var n = t.stateNode;
    if (n === null) return null;
    var i = n[Ee] || null;
    if (i === null) return null;
    n = i[e];
    t: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (i = !i.disabled) || (t = t.type, i = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !i;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (n && typeof n != "function")
      throw Error(
        r(231, e, typeof n)
      );
    return n;
  }
  var On = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Ho = !1;
  if (On)
    try {
      var ul = {};
      Object.defineProperty(ul, "passive", {
        get: function() {
          Ho = !0;
        }
      }), window.addEventListener("test", ul, ul), window.removeEventListener("test", ul, ul);
    } catch {
      Ho = !1;
    }
  var Jn = null, Lo = null, Du = null;
  function ad() {
    if (Du) return Du;
    var t, e = Lo, n = e.length, i, u = "value" in Jn ? Jn.value : Jn.textContent, s = u.length;
    for (t = 0; t < n && e[t] === u[t]; t++) ;
    var f = n - t;
    for (i = 1; i <= f && e[n - i] === u[s - i]; i++) ;
    return Du = u.slice(t, 1 < i ? 1 - i : void 0);
  }
  function xu(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function Cu() {
    return !0;
  }
  function ld() {
    return !1;
  }
  function ge(t) {
    function e(n, i, u, s, f) {
      this._reactName = n, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
      for (var m in t)
        t.hasOwnProperty(m) && (n = t[m], this[m] = n ? n(s) : s[m]);
      return this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1) ? Cu : ld, this.isPropagationStopped = ld, this;
    }
    return G(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Cu);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Cu);
      },
      persist: function() {
      },
      isPersistent: Cu
    }), e;
  }
  var Fn = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Ou = ge(Fn), sl = G({}, Fn, { view: 0, detail: 0 }), P1 = ge(sl), jo, Yo, ol, zu = G({}, sl, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: qo,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== ol && (ol && t.type === "mousemove" ? (jo = t.screenX - ol.screenX, Yo = t.screenY - ol.screenY) : Yo = jo = 0, ol = t), jo);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Yo;
    }
  }), ud = ge(zu), k1 = G({}, zu, { dataTransfer: 0 }), W1 = ge(k1), $1 = G({}, sl, { relatedTarget: 0 }), Go = ge($1), I1 = G({}, Fn, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), tS = ge(I1), eS = G({}, Fn, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), nS = ge(eS), iS = G({}, Fn, { data: 0 }), sd = ge(iS), aS = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, lS = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, uS = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function sS(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = uS[t]) ? !!e[t] : !1;
  }
  function qo() {
    return sS;
  }
  var oS = G({}, sl, {
    key: function(t) {
      if (t.key) {
        var e = aS[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = xu(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? lS[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: qo,
    charCode: function(t) {
      return t.type === "keypress" ? xu(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? xu(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), rS = ge(oS), cS = G({}, zu, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), od = ge(cS), fS = G({}, Fn, { submitter: 0 }), hS = ge(fS), dS = G({}, sl, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: qo
  }), mS = ge(dS), yS = G({}, Fn, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), gS = ge(yS), pS = G({}, zu, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), vS = ge(pS), SS = G({}, Fn, {
    newState: 0,
    oldState: 0,
    source: 0
  }), TS = ge(SS), bS = [9, 13, 27, 32], Xo = On && "CompositionEvent" in window, rl = null;
  On && "documentMode" in document && (rl = document.documentMode);
  var ES = On && "TextEvent" in window && !rl, rd = On && (!Xo || rl && 8 < rl && 11 >= rl), cd = " ", fd = !1;
  function hd(t, e) {
    switch (t) {
      case "keyup":
        return bS.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function dd(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var oa = !1;
  function AS(t, e) {
    switch (t) {
      case "compositionend":
        return dd(e);
      case "keypress":
        return e.which !== 32 ? null : (fd = !0, cd);
      case "textInput":
        return t = e.data, t === cd && fd ? null : t;
      default:
        return null;
    }
  }
  function MS(t, e) {
    if (oa)
      return t === "compositionend" || !Xo && hd(t, e) ? (t = ad(), Du = Lo = Jn = null, oa = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
          if (e.char && 1 < e.char.length)
            return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return rd && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var DS = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function md(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!DS[t.type] : e === "textarea";
  }
  function yd(t, e, n, i) {
    ua ? sa ? sa.push(i) : sa = [i] : ua = i, e = Rs(e, "onChange"), 0 < e.length && (n = new Ou(
      "onChange",
      "change",
      null,
      n,
      i
    ), t.push({ event: n, listeners: e }));
  }
  var cl = null, fl = null;
  function xS(t) {
    n0(t, 0);
  }
  function Ru(t) {
    var e = al(t);
    if (kh(e)) return t;
  }
  function gd(t, e) {
    if (t === "change") return e;
  }
  var pd = !1;
  if (On) {
    var Qo;
    if (On) {
      var Zo = "oninput" in document;
      if (!Zo) {
        var vd = document.createElement("div");
        vd.setAttribute("oninput", "return;"), Zo = typeof vd.oninput == "function";
      }
      Qo = Zo;
    } else Qo = !1;
    pd = Qo && (!document.documentMode || 9 < document.documentMode);
  }
  function Sd() {
    cl && (cl.detachEvent("onpropertychange", Td), fl = cl = null);
  }
  function Td(t) {
    if (t.propertyName === "value" && Ru(fl)) {
      var e = [];
      yd(
        e,
        fl,
        t,
        Bo(t)
      ), id(xS, e);
    }
  }
  function CS(t, e, n) {
    t === "focusin" ? (Sd(), cl = e, fl = n, cl.attachEvent("onpropertychange", Td)) : t === "focusout" && Sd();
  }
  function OS(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return Ru(fl);
  }
  function zS(t, e) {
    if (t === "click") return Ru(e);
  }
  function RS(t, e) {
    if (t === "input" || t === "change")
      return Ru(e);
  }
  function NS(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var Ue = typeof Object.is == "function" ? Object.is : NS;
  function hl(t, e) {
    if (Ue(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var n = Object.keys(t), i = Object.keys(e);
    if (n.length !== i.length) return !1;
    for (i = 0; i < n.length; i++) {
      var u = n[i];
      if (!Mo.call(e, u) || !Ue(t[u], e[u]))
        return !1;
    }
    return !0;
  }
  function Ko(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  function bd(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function Ed(t, e) {
    var n = bd(t);
    t = 0;
    for (var i; n; ) {
      if (n.nodeType === 3) {
        if (i = t + n.textContent.length, t <= e && i >= e)
          return { node: n, offset: e - t };
        t = i;
      }
      t: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break t;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = bd(n);
    }
  }
  function Ad(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? Ad(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function Md(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = Ko(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var n = typeof e.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) t = e.contentWindow;
      else break;
      e = Ko(t.document);
    }
    return e;
  }
  function Jo(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  var VS = On && "documentMode" in document && 11 >= document.documentMode, ra = null, Fo = null, dl = null, Po = !1;
  function Dd(t, e, n) {
    var i = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Po || ra == null || ra !== Ko(i) || (i = ra, "selectionStart" in i && Jo(i) ? i = { start: i.selectionStart, end: i.selectionEnd } : (i = (i.ownerDocument && i.ownerDocument.defaultView || window).getSelection(), i = {
      anchorNode: i.anchorNode,
      anchorOffset: i.anchorOffset,
      focusNode: i.focusNode,
      focusOffset: i.focusOffset
    }), dl && hl(dl, i) || (dl = i, i = Rs(Fo, "onSelect"), 0 < i.length && (e = new Ou(
      "onSelect",
      "select",
      null,
      e,
      n
    ), t.push({ event: e, listeners: i }), e.target = ra)));
  }
  function xi(t, e) {
    var n = {};
    return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
  }
  var ca = {
    animationend: xi("Animation", "AnimationEnd"),
    animationiteration: xi("Animation", "AnimationIteration"),
    animationstart: xi("Animation", "AnimationStart"),
    transitionrun: xi("Transition", "TransitionRun"),
    transitionstart: xi("Transition", "TransitionStart"),
    transitioncancel: xi("Transition", "TransitionCancel"),
    transitionend: xi("Transition", "TransitionEnd")
  }, ko = {}, xd = {};
  On && (xd = document.createElement("div").style, "AnimationEvent" in window || (delete ca.animationend.animation, delete ca.animationiteration.animation, delete ca.animationstart.animation), "TransitionEvent" in window || delete ca.transitionend.transition);
  function Ci(t) {
    if (ko[t]) return ko[t];
    if (!ca[t]) return t;
    var e = ca[t], n;
    for (n in e)
      if (e.hasOwnProperty(n) && n in xd)
        return ko[t] = e[n];
    return t;
  }
  var Cd = Ci("animationend"), Od = Ci("animationiteration"), zd = Ci("animationstart"), _S = Ci("transitionrun"), US = Ci("transitionstart"), BS = Ci("transitioncancel"), Rd = Ci("transitionend"), Nd = /* @__PURE__ */ new Map(), Wo = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Wo.push("scrollEnd");
  function tn(t, e) {
    Nd.set(t, e), Di(e, [t]);
  }
  var wS = 0;
  function zn(t, e) {
    if (t.name != null && t.name !== "auto") return t.name;
    if (e.autoName !== null) return e.autoName;
    t = ln.identifierPrefix;
    var n = wS++;
    return t = "_" + t + "t_" + n.toString(32) + "_", e.autoName = t;
  }
  function Vd(t) {
    if (t == null || typeof t == "string")
      return t;
    var e = null, n = Ra;
    if (n !== null)
      for (var i = 0; i < n.length; i++) {
        var u = t[n[i]];
        if (u != null) {
          if (u === "none") return "none";
          e = e == null ? u : e + (" " + u);
        }
      }
    return e ?? t.default;
  }
  function Rn(t, e) {
    return t = Vd(t), e = Vd(e), e == null ? t === "auto" ? null : t : e === "auto" ? null : e;
  }
  var Nu = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var e = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(e)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  }, Qe = [], fa = 0, $o = 0;
  function Vu() {
    for (var t = fa, e = $o = fa = 0; e < t; ) {
      var n = Qe[e];
      Qe[e++] = null;
      var i = Qe[e];
      Qe[e++] = null;
      var u = Qe[e];
      Qe[e++] = null;
      var s = Qe[e];
      if (Qe[e++] = null, i !== null && u !== null) {
        var f = i.pending;
        f === null ? u.next = u : (u.next = f.next, f.next = u), i.pending = u;
      }
      s !== 0 && _d(n, u, s);
    }
  }
  function _u(t, e, n, i) {
    Qe[fa++] = t, Qe[fa++] = e, Qe[fa++] = n, Qe[fa++] = i, $o |= i, t.lanes |= i, t = t.alternate, t !== null && (t.lanes |= i);
  }
  function Io(t, e, n, i) {
    return _u(t, e, n, i), Uu(t);
  }
  function Oi(t, e) {
    return _u(t, null, null, e), Uu(t);
  }
  function _d(t, e, n) {
    t.lanes |= n;
    var i = t.alternate;
    i !== null && (i.lanes |= n);
    for (var u = !1, s = t.return; s !== null; )
      s.childLanes |= n, i = s.alternate, i !== null && (i.childLanes |= n), s.tag === 22 && (t = s.stateNode, t === null || t._visibility & 1 || (u = !0)), t = s, s = s.return;
    return t.tag === 3 ? (s = t.stateNode, u && e !== null && (u = 31 - Ve(n), t = s.hiddenUpdates, i = t[u], i === null ? t[u] = [e] : i.push(e), e.lane = n | 536870912), s) : null;
  }
  function Uu(t) {
    if (50 < Bl)
      throw Bl = 0, As = null, Error(r(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var ha = {};
  function HS(t, e, n, i) {
    this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = i, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ae(t, e, n, i) {
    return new HS(t, e, n, i);
  }
  function tr(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function Nn(t, e) {
    var n = t.alternate;
    return n === null ? (n = Ae(
      t.tag,
      e,
      t.key,
      t.mode
    ), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 1206910976, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n.refCleanup = t.refCleanup, n;
  }
  function Ud(t, e) {
    t.flags &= 1206910978;
    var n = t.alternate;
    return n === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = n.childLanes, t.lanes = n.lanes, t.child = n.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = n.memoizedProps, t.memoizedState = n.memoizedState, t.updateQueue = n.updateQueue, t.type = n.type, e = n.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function Bu(t, e, n, i, u, s) {
    var f = 0;
    if (i = t, typeof i == "function") tr(i) && (f = 1);
    else if (typeof i == "string")
      f = fb(
        t,
        n,
        cn.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (i) {
        case wt:
          return t = Ae(31, n, e, u), t.elementType = wt, t.lanes = s, t;
        case rt:
          return zi(n.children, u, s, e);
        case nt:
          f = 8, u |= 24;
          break;
        case Dt:
          return t = Ae(12, n, e, u | 2), t.elementType = Dt, t.lanes = s, t;
        case k:
          return t = Ae(13, n, e, u), t.elementType = k, t.lanes = s, t;
        case Z:
          return t = Ae(19, n, e, u), t.elementType = Z, t.lanes = s, t;
        case ue:
        case A:
          return t = u | 32, t = Ae(30, n, e, t), t.elementType = A, t.lanes = s, t.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, t;
        default:
          if (typeof i == "object" && i !== null)
            switch (i.$$typeof) {
              case mt:
                f = 10;
                break t;
              case Ot:
                f = 9;
                break t;
              case j:
                f = 11;
                break t;
              case ft:
                f = 14;
                break t;
              case ot:
                f = 16, i = null;
                break t;
            }
          f = 29, n = Error(
            r(130, t === null ? "null" : typeof t, "")
          ), i = null;
      }
    return e = Ae(f, n, e, u), e.elementType = t, e.type = i, e.lanes = s, e;
  }
  function zi(t, e, n, i) {
    return t = Ae(7, t, i, e), t.lanes = n, t;
  }
  function er(t, e, n) {
    return t = Ae(6, t, null, e), t.lanes = n, t;
  }
  function Bd(t) {
    var e = Ae(18, null, null, 0);
    return e.stateNode = t, e;
  }
  function nr(t, e, n) {
    return e = Ae(
      4,
      t.children !== null ? t.children : [],
      t.key,
      e
    ), e.lanes = n, e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, e;
  }
  var wd = /* @__PURE__ */ new WeakMap();
  function Ze(t, e) {
    if (typeof t == "object" && t !== null) {
      var n = wd.get(t);
      return n !== void 0 ? n : (e = {
        value: t,
        source: e,
        stack: Rh(e)
      }, wd.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: Rh(e)
    };
  }
  var da = [], ma = 0, wu = null, ml = 0, Ke = [], Je = 0, Pn = null, hn = 1, dn = "";
  function Vn(t, e) {
    da[ma++] = ml, da[ma++] = wu, wu = t, ml = e;
  }
  function Hd(t, e, n) {
    Ke[Je++] = hn, Ke[Je++] = dn, Ke[Je++] = Pn, Pn = t;
    var i = hn;
    t = dn;
    var u = 32 - Ve(i) - 1;
    i &= ~(1 << u), n += 1;
    var s = 32 - Ve(e) + u;
    if (30 < s) {
      var f = u - u % 5;
      s = (i & (1 << f) - 1).toString(32), i >>= f, u -= f, hn = 1 << 32 - Ve(e) + u | n << u | i, dn = s + t;
    } else
      hn = 1 << s | n << u | i, dn = t;
  }
  function Hu(t) {
    t.return !== null && (Vn(t, 1), Hd(t, 1, 0));
  }
  function ir(t) {
    for (; t === wu; )
      wu = da[--ma], da[ma] = null, ml = da[--ma], da[ma] = null;
    for (; t === Pn; )
      Pn = Ke[--Je], Ke[Je] = null, dn = Ke[--Je], Ke[Je] = null, hn = Ke[--Je], Ke[Je] = null;
  }
  function Ld(t, e) {
    Ke[Je++] = hn, Ke[Je++] = dn, Ke[Je++] = Pn, hn = e.id, dn = e.overflow, Pn = t;
  }
  var ie = null, Lt = null, gt = !1, kn = null, Fe = !1, ar = Error(r(519));
  function Wn(t) {
    var e = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw yl(Ze(e, t)), ar;
  }
  function jd(t) {
    var e = t.stateNode, n = t.type, i = t.memoizedProps;
    switch (e[se] = t, e[Ee] = i, n) {
      case "dialog":
        vt("cancel", e), vt("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        vt("load", e);
        break;
      case "video":
      case "audio":
        for (n = 0; n < Hl.length; n++)
          vt(Hl[n], e);
        break;
      case "source":
        vt("error", e);
        break;
      case "img":
      case "image":
      case "link":
        vt("error", e), vt("load", e);
        break;
      case "details":
        vt("toggle", e);
        break;
      case "input":
        vt("invalid", e), Wh(
          e,
          i.value,
          i.defaultValue,
          i.checked,
          i.defaultChecked,
          i.type,
          i.name,
          !0
        );
        break;
      case "select":
        vt("invalid", e);
        break;
      case "textarea":
        vt("invalid", e), Ih(e, i.value, i.defaultValue, i.children);
    }
    n = i.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || e.textContent === "" + n || i.suppressHydrationWarning === !0 || u0(e.textContent, n) ? (i.popover != null && (vt("beforetoggle", e), vt("toggle", e)), i.onScroll != null && vt("scroll", e), i.onScrollEnd != null && vt("scrollend", e), i.onClick != null && (e.onclick = fn), e = !0) : e = !1, e || Wn(t, !0);
  }
  function Lu(t) {
    for (ie = t.return; ie; )
      switch (ie.tag) {
        case 5:
        case 31:
        case 13:
          Fe = !1;
          return;
        case 27:
        case 3:
          Fe = !0;
          return;
        default:
          ie = ie.return;
      }
  }
  function ya(t) {
    if (t !== ie) return !1;
    if (!gt) return Lu(t), gt = !0, !1;
    var e = t.tag, n;
    if ((n = e !== 3 && e !== 27) && ((n = e === 5) && (n = t.type, n = !(n !== "form" && n !== "button") || Uc(t.type, t.memoizedProps)), n = !n), n && Lt && Wn(t), Lu(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      Lt = D0(t);
    } else if (e === 31) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(317));
      Lt = D0(t);
    } else
      e === 27 ? (e = Lt, di(t.type) ? (t = Xc, Xc = null, Lt = t) : Lt = e) : Lt = ie ? ke(t.stateNode.nextSibling) : null;
    return !0;
  }
  function Ri() {
    Lt = ie = null, gt = !1;
  }
  function lr() {
    var t = kn;
    return t !== null && (xe === null ? xe = t : xe.push.apply(
      xe,
      t
    ), kn = null), t;
  }
  function yl(t) {
    kn === null ? kn = [t] : kn.push(t);
  }
  var ur = ze(null), Ni = null, _n = null;
  function $n(t, e, n) {
    Ht(ur, e._currentValue), e._currentValue = n;
  }
  function Un(t) {
    t._currentValue = ur.current, Gt(ur);
  }
  function ju(t, e, n) {
    for (; t !== null; ) {
      var i = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, i !== null && (i.childLanes |= e)) : i !== null && (i.childLanes & e) !== e && (i.childLanes |= e), t === n) break;
      t = t.return;
    }
  }
  function sr(t, e, n, i) {
    var u = t.child;
    for (u !== null && (u.return = t); u !== null; ) {
      var s = u.dependencies;
      if (s !== null) {
        var f = u.child;
        s = s.firstContext;
        t: for (; s !== null; ) {
          var m = s;
          s = u;
          for (var T = 0; T < e.length; T++)
            if (m.context === e[T]) {
              s.lanes |= n, m = s.alternate, m !== null && (m.lanes |= n), ju(
                s.return,
                n,
                t
              ), i || (f = null);
              break t;
            }
          s = m.next;
        }
      } else if (u.tag === 18) {
        if (f = u.return, f === null) throw Error(r(341));
        f.lanes |= n, s = f.alternate, s !== null && (s.lanes |= n), ju(f, n, t), f = null;
      } else
        u.tag === 13 && u.memoizedState !== null && u.memoizedState.dehydrated === null ? (u.lanes |= n, f = u.alternate, f !== null && (f.lanes |= n), ju(
          u.return,
          n,
          t
        ), f = u.child, f = f !== null ? f.sibling : null) : f = u.child;
      if (f !== null) f.return = u;
      else
        for (f = u; f !== null; ) {
          if (f === t) {
            f = null;
            break;
          }
          if (u = f.sibling, u !== null) {
            u.return = f.return, f = u;
            break;
          }
          f = f.return;
        }
      u = f;
    }
  }
  function Vi(t, e, n, i) {
    t = null;
    for (var u = e, s = !1; u !== null; ) {
      if (!s) {
        if ((u.flags & 524288) !== 0) s = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var f = u.alternate;
        if (f === null) throw Error(r(387));
        if (f = f.memoizedProps, f !== null) {
          var m = u.type;
          Ue(u.pendingProps.value, f.value) || (t !== null ? t.push(m) : t = [m]);
        }
      } else if (u === hu.current) {
        if (f = u.alternate, f === null) throw Error(r(387));
        f.memoizedState.memoizedState !== u.memoizedState.memoizedState && (t !== null ? t.push(Ya) : t = [Ya]);
      }
      u = u.return;
    }
    return t !== null && sr(
      e,
      t,
      n,
      i
    ), e.flags |= 262144, t !== null;
  }
  function Yu(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!Ue(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function _i(t) {
    Ni = t, _n = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function oe(t) {
    return Yd(Ni, t);
  }
  function Gu(t, e) {
    return Ni === null && _i(t), Yd(t, e);
  }
  function Yd(t, e) {
    var n = e._currentValue;
    if (e = { context: e, memoizedValue: n, next: null }, _n === null) {
      if (t === null) throw Error(r(308));
      _n = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else _n = _n.next = e;
    return n;
  }
  var LS = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(n, i) {
        t.push(i);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(n) {
        return n();
      });
    };
  }, jS = a.unstable_scheduleCallback, YS = a.unstable_NormalPriority, Ft = {
    $$typeof: mt,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function or() {
    return {
      controller: new LS(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function gl(t) {
    t.refCount--, t.refCount === 0 && jS(YS, function() {
      t.controller.abort();
    });
  }
  function Gd(t, e) {
    if ((t.pendingLanes & 4194048) !== 0) {
      var n = t.transitionTypes;
      for (n === null && (n = t.transitionTypes = []), t = 0; t < e.length; t++) {
        var i = e[t];
        n.indexOf(i) === -1 && n.push(i);
      }
    }
  }
  var pl = null;
  function GS(t) {
    var e = t.transitionTypes;
    return t.transitionTypes = null, e;
  }
  var vl = null, rr = 0, Ui = 0, ga = null;
  function qS(t, e) {
    if (vl === null) {
      var n = vl = [];
      rr = 0, Ui = Dc(), ga = {
        status: "pending",
        value: void 0,
        then: function(i) {
          n.push(i);
        }
      };
    }
    return rr++, e.then(qd, qd), e;
  }
  function qd() {
    if (--rr === 0 && (pl = null, vl !== null)) {
      ga !== null && (ga.status = "fulfilled");
      var t = vl;
      vl = null, Ui = 0, ga = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function XS(t, e) {
    var n = [], i = {
      status: "pending",
      value: null,
      reason: null,
      then: function(u) {
        n.push(u);
      }
    };
    return t.then(
      function() {
        i.status = "fulfilled", i.value = e;
        for (var u = 0; u < n.length; u++) (0, n[u])(e);
      },
      function(u) {
        for (i.status = "rejected", i.reason = u, u = 0; u < n.length; u++)
          (0, n[u])(void 0);
      }
    ), i;
  }
  var Xd = $.S;
  $.S = function(t, e) {
    if (By = Re(), typeof e == "object" && e !== null && typeof e.then == "function" && qS(t, e), pl !== null)
      for (var n = Ua; n !== null; )
        Gd(n, pl), n = n.next;
    if (n = t.types, n !== null) {
      for (var i = Ua; i !== null; )
        Gd(i, n), i = i.next;
      if (Ui !== 0) {
        i = pl, i === null && (i = pl = []);
        for (var u = 0; u < n.length; u++) {
          var s = n[u];
          i.indexOf(s) === -1 && i.push(s);
        }
      }
    }
    Xd !== null && Xd(t, e);
  };
  var Bi = ze(null);
  function cr() {
    var t = Bi.current;
    return t !== null ? t : Bt.pooledCache;
  }
  function qu(t, e) {
    e === null ? Ht(Bi, Bi.current) : Ht(Bi, e.pool);
  }
  function Qd() {
    var t = cr();
    return t === null ? null : { parent: Ft._currentValue, pool: t };
  }
  var pa = Error(r(460)), fr = Error(r(474)), Xu = Error(r(542)), Qu = { then: function() {
  } };
  function Zd(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function Kd(t, e, n) {
    switch (n = t[n], n === void 0 ? t.push(e) : n !== e && (e.then(fn, fn), e = n), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, Fd(t), t === void 0 && !("reason" in e) ? Error(r(600)) : t;
      default:
        if (typeof e.status == "string") e.then(fn, fn);
        else {
          if (t = Bt, t !== null && 100 < t.shellSuspendCounter)
            throw Error(r(482));
          t = e, t.status = "pending", t.then(
            function(i) {
              if (e.status === "pending") {
                var u = e;
                u.status = "fulfilled", u.value = i;
              }
            },
            function(i) {
              if (e.status === "pending") {
                var u = e;
                u.status = "rejected", u.reason = i;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, Fd(t), t;
        }
        throw Hi = e, pa;
    }
  }
  function wi(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (Hi = n, pa) : n;
    }
  }
  var Hi = null;
  function Jd() {
    if (Hi === null) throw Error(r(459));
    var t = Hi;
    return Hi = null, t;
  }
  function Fd(t) {
    if (t === pa || t === Xu)
      throw Error(r(483));
  }
  var va = null, Sl = 0;
  function Zu(t) {
    var e = Sl;
    return Sl += 1, va === null && (va = []), Kd(va, t, e);
  }
  function In(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function Ku(t, e) {
    throw e.$$typeof === X ? Error(r(525)) : (t = Object.prototype.toString.call(e), Error(
      r(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function Pd(t) {
    function e(D, E) {
      if (t) {
        var C = D.deletions;
        C === null ? (D.deletions = [E], D.flags |= 16) : C.push(E);
      }
    }
    function n(D, E) {
      if (!t) return null;
      for (; E !== null; )
        e(D, E), E = E.sibling;
      return null;
    }
    function i(D) {
      for (var E = /* @__PURE__ */ new Map(); D !== null; )
        D.key === null ? E.set(D.index, D) : E.set(D.key, D), D = D.sibling;
      return E;
    }
    function u(D, E) {
      return D = Nn(D, E), D.index = 0, D.sibling = null, D;
    }
    function s(D, E, C) {
      return D.index = C, t ? (C = D.alternate, C !== null ? (C = C.index, C < E ? (D.flags |= 2, E) : C) : (D.flags |= 134217730, E)) : (D.flags |= 1048576, E);
    }
    function f(D) {
      return t && D.alternate === null && (D.flags |= 134217730), D;
    }
    function m(D, E, C, V) {
      return E === null || E.tag !== 6 ? (E = er(C, D.mode, V), E.return = D, E) : (E = u(E, C), E.return = D, E);
    }
    function T(D, E, C, V) {
      var K = C.type;
      return K === rt ? (D = z(
        D,
        E,
        C.props.children,
        V,
        C.key
      ), In(D, C), D) : E !== null && (E.elementType === K || typeof K == "object" && K !== null && K.$$typeof === ot && wi(K) === E.type) ? (E = u(E, C.props), In(E, C), E.return = D, E) : (E = Bu(
        C.type,
        C.key,
        C.props,
        null,
        D.mode,
        V
      ), In(E, C), E.return = D, E);
    }
    function x(D, E, C, V) {
      return E === null || E.tag !== 4 || E.stateNode.containerInfo !== C.containerInfo || E.stateNode.implementation !== C.implementation ? (E = nr(C, D.mode, V), E.return = D, E) : (E = u(E, C.children || []), E.return = D, E);
    }
    function z(D, E, C, V, K) {
      return E === null || E.tag !== 7 ? (E = zi(
        C,
        D.mode,
        V,
        K
      ), E.return = D, E) : (E = u(E, C), E.return = D, E);
    }
    function _(D, E, C) {
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return E = er(
          "" + E,
          D.mode,
          C
        ), E.return = D, E;
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case lt:
            return C = Bu(
              E.type,
              E.key,
              E.props,
              null,
              D.mode,
              C
            ), In(C, E), C.return = D, C;
          case J:
            return E = nr(
              E,
              D.mode,
              C
            ), E.return = D, E;
          case ot:
            return E = wi(E), _(D, E, C);
        }
        if (Et(E) || I(E))
          return E = zi(
            E,
            D.mode,
            C,
            null
          ), E.return = D, E;
        if (typeof E.then == "function")
          return _(D, Zu(E), C);
        if (E.$$typeof === mt)
          return _(
            D,
            Gu(D, E),
            C
          );
        Ku(D, E);
      }
      return null;
    }
    function M(D, E, C, V) {
      var K = E !== null ? E.key : null;
      if (typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint")
        return K !== null ? null : m(D, E, "" + C, V);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case lt:
            return C.key === K ? T(D, E, C, V) : null;
          case J:
            return C.key === K ? x(D, E, C, V) : null;
          case ot:
            return C = wi(C), M(D, E, C, V);
        }
        if (Et(C) || I(C))
          return K !== null ? null : z(D, E, C, V, null);
        if (typeof C.then == "function")
          return M(
            D,
            E,
            Zu(C),
            V
          );
        if (C.$$typeof === mt)
          return M(
            D,
            E,
            Gu(D, C),
            V
          );
        Ku(D, C);
      }
      return null;
    }
    function O(D, E, C, V, K) {
      if (typeof V == "string" && V !== "" || typeof V == "number" || typeof V == "bigint")
        return D = D.get(C) || null, m(E, D, "" + V, K);
      if (typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case lt:
            return D = D.get(
              V.key === null ? C : V.key
            ) || null, T(E, D, V, K);
          case J:
            return D = D.get(
              V.key === null ? C : V.key
            ) || null, x(E, D, V, K);
          case ot:
            return V = wi(V), O(
              D,
              E,
              C,
              V,
              K
            );
        }
        if (Et(V) || I(V))
          return D = D.get(C) || null, z(E, D, V, K, null);
        if (typeof V.then == "function")
          return O(
            D,
            E,
            C,
            Zu(V),
            K
          );
        if (V.$$typeof === mt)
          return O(
            D,
            E,
            C,
            Gu(E, V),
            K
          );
        Ku(E, V);
      }
      return null;
    }
    function Q(D, E, C, V) {
      for (var K = null, Tt = null, it = E, ut = E = 0, Wt = null; it !== null && ut < C.length; ut++) {
        it.index > ut ? (Wt = it, it = null) : Wt = it.sibling;
        var At = M(
          D,
          it,
          C[ut],
          V
        );
        if (At === null) {
          it === null && (it = Wt);
          break;
        }
        t && it && At.alternate === null && e(D, it), E = s(At, E, ut), Tt === null ? K = At : Tt.sibling = At, Tt = At, it = Wt;
      }
      if (ut === C.length)
        return n(D, it), gt && Vn(D, ut), K;
      if (it === null) {
        for (; ut < C.length; ut++)
          it = _(D, C[ut], V), it !== null && (E = s(
            it,
            E,
            ut
          ), Tt === null ? K = it : Tt.sibling = it, Tt = it);
        return gt && Vn(D, ut), K;
      }
      for (it = i(it); ut < C.length; ut++)
        Wt = O(
          it,
          D,
          ut,
          C[ut],
          V
        ), Wt !== null && (t && (At = Wt.alternate, At !== null && it.delete(At.key === null ? ut : At.key)), E = s(
          Wt,
          E,
          ut
        ), Tt === null ? K = Wt : Tt.sibling = Wt, Tt = Wt);
      return t && it.forEach(function(vi) {
        return e(D, vi);
      }), gt && Vn(D, ut), K;
    }
    function F(D, E, C, V) {
      if (C == null) throw Error(r(151));
      for (var K = null, Tt = null, it = E, ut = E = 0, Wt = null, At = C.next(); it !== null && !At.done; ut++, At = C.next()) {
        it.index > ut ? (Wt = it, it = null) : Wt = it.sibling;
        var vi = M(D, it, At.value, V);
        if (vi === null) {
          it === null && (it = Wt);
          break;
        }
        t && it && vi.alternate === null && e(D, it), E = s(vi, E, ut), Tt === null ? K = vi : Tt.sibling = vi, Tt = vi, it = Wt;
      }
      if (At.done)
        return n(D, it), gt && Vn(D, ut), K;
      if (it === null) {
        for (; !At.done; ut++, At = C.next())
          At = _(D, At.value, V), At !== null && (E = s(At, E, ut), Tt === null ? K = At : Tt.sibling = At, Tt = At);
        return gt && Vn(D, ut), K;
      }
      for (it = i(it); !At.done; ut++, At = C.next())
        At = O(it, D, ut, At.value, V), At !== null && (t && (Wt = At.alternate, Wt !== null && it.delete(
          Wt.key === null ? ut : Wt.key
        )), E = s(At, E, ut), Tt === null ? K = At : Tt.sibling = At, Tt = At);
      return t && it.forEach(function(Ab) {
        return e(D, Ab);
      }), gt && Vn(D, ut), K;
    }
    function dt(D, E, C, V) {
      if (typeof C == "object" && C !== null && C.type === rt && C.key === null && C.props.ref === void 0 && (C = C.props.children), typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case lt:
            t: {
              for (var K = C.key; E !== null; ) {
                if (E.key === K) {
                  if (K = C.type, K === rt) {
                    if (E.tag === 7) {
                      n(
                        D,
                        E.sibling
                      ), V = u(
                        E,
                        C.props.children
                      ), In(V, C), V.return = D, D = V;
                      break t;
                    }
                  } else if (E.elementType === K || typeof K == "object" && K !== null && K.$$typeof === ot && wi(K) === E.type) {
                    n(
                      D,
                      E.sibling
                    ), V = u(E, C.props), In(V, C), V.return = D, D = V;
                    break t;
                  }
                  n(D, E);
                  break;
                } else e(D, E);
                E = E.sibling;
              }
              C.type === rt ? (V = zi(
                C.props.children,
                D.mode,
                V,
                C.key
              ), In(V, C), V.return = D, D = V) : (V = Bu(
                C.type,
                C.key,
                C.props,
                null,
                D.mode,
                V
              ), In(V, C), V.return = D, D = V);
            }
            return f(D);
          case J:
            t: {
              for (K = C.key; E !== null; ) {
                if (E.key === K)
                  if (E.tag === 4 && E.stateNode.containerInfo === C.containerInfo && E.stateNode.implementation === C.implementation) {
                    n(
                      D,
                      E.sibling
                    ), V = u(E, C.children || []), V.return = D, D = V;
                    break t;
                  } else {
                    n(D, E);
                    break;
                  }
                else e(D, E);
                E = E.sibling;
              }
              V = nr(C, D.mode, V), V.return = D, D = V;
            }
            return f(D);
          case ot:
            return C = wi(C), dt(
              D,
              E,
              C,
              V
            );
        }
        if (Et(C))
          return Q(
            D,
            E,
            C,
            V
          );
        if (I(C)) {
          if (K = I(C), typeof K != "function") throw Error(r(150));
          return C = K.call(C), F(
            D,
            E,
            C,
            V
          );
        }
        if (typeof C.then == "function")
          return dt(
            D,
            E,
            Zu(C),
            V
          );
        if (C.$$typeof === mt)
          return dt(
            D,
            E,
            Gu(D, C),
            V
          );
        Ku(D, C);
      }
      return typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint" ? (C = "" + C, E !== null && E.tag === 6 ? (n(D, E.sibling), V = u(E, C), V.return = D, D = V) : (n(D, E), V = er(C, D.mode, V), V.return = D, D = V), f(D)) : n(D, E);
    }
    return function(D, E, C, V) {
      try {
        Sl = 0;
        var K = dt(
          D,
          E,
          C,
          V
        );
        return va = null, K;
      } catch (it) {
        if (it === pa || it === Xu) throw it;
        var Tt = Ae(29, it, null, D.mode);
        return Tt.lanes = V, Tt.return = D, Tt;
      }
    };
  }
  var Li = Pd(!0), kd = Pd(!1), ti = !1;
  function hr(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function dr(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function ei(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function ni(t, e, n) {
    var i = t.updateQueue;
    if (i === null) return null;
    if (i = i.shared, (xt & 2) !== 0) {
      var u = i.pending;
      return u === null ? e.next = e : (e.next = u.next, u.next = e), i.pending = e, e = Uu(t), _d(t, null, n), e;
    }
    return _u(t, i, e, n), Uu(t);
  }
  function Tl(t, e, n) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194048) !== 0)) {
      var i = e.lanes;
      i &= t.pendingLanes, n |= i, e.lanes = n, Hh(t, n);
    }
  }
  function mr(t, e) {
    var n = t.updateQueue, i = t.alternate;
    if (i !== null && (i = i.updateQueue, n === i)) {
      var u = null, s = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var f = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          s === null ? u = s = f : s = s.next = f, n = n.next;
        } while (n !== null);
        s === null ? u = s = e : s = s.next = e;
      } else u = s = e;
      n = {
        baseState: i.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: s,
        shared: i.shared,
        callbacks: i.callbacks
      }, t.updateQueue = n;
      return;
    }
    t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e;
  }
  var yr = !1;
  function bl() {
    if (yr) {
      var t = ga;
      if (t !== null) throw t;
    }
  }
  function El(t, e, n, i) {
    yr = !1;
    var u = t.updateQueue;
    ti = !1;
    var s = u.firstBaseUpdate, f = u.lastBaseUpdate, m = u.shared.pending;
    if (m !== null) {
      u.shared.pending = null;
      var T = m, x = T.next;
      T.next = null, f === null ? s = x : f.next = x, f = T;
      var z = t.alternate;
      z !== null && (z = z.updateQueue, m = z.lastBaseUpdate, m !== f && (m === null ? z.firstBaseUpdate = x : m.next = x, z.lastBaseUpdate = T));
    }
    if (s !== null) {
      var _ = u.baseState;
      f = 0, z = x = T = null, m = s;
      do {
        var M = m.lane & -536870913, O = M !== m.lane;
        if (O ? (St & M) === M : (i & M) === M) {
          M !== 0 && M === Ui && (yr = !0), z !== null && (z = z.next = {
            lane: 0,
            tag: m.tag,
            payload: m.payload,
            callback: null,
            next: null
          });
          t: {
            var Q = t, F = m;
            M = e;
            var dt = n;
            switch (F.tag) {
              case 1:
                if (Q = F.payload, typeof Q == "function") {
                  _ = Q.call(dt, _, M);
                  break t;
                }
                _ = Q;
                break t;
              case 3:
                Q.flags = Q.flags & -65537 | 128;
              case 0:
                if (Q = F.payload, M = typeof Q == "function" ? Q.call(dt, _, M) : Q, M == null) break t;
                _ = G({}, _, M);
                break t;
              case 2:
                ti = !0;
            }
          }
          M = m.callback, M !== null && (t.flags |= 64, O && (t.flags |= 8192), O = u.callbacks, O === null ? u.callbacks = [M] : O.push(M));
        } else
          O = {
            lane: M,
            tag: m.tag,
            payload: m.payload,
            callback: m.callback,
            next: null
          }, z === null ? (x = z = O, T = _) : z = z.next = O, f |= M;
        if (m = m.next, m === null) {
          if (m = u.shared.pending, m === null)
            break;
          O = m, m = O.next, O.next = null, u.lastBaseUpdate = O, u.shared.pending = null;
        }
      } while (!0);
      z === null && (T = _), u.baseState = T, u.firstBaseUpdate = x, u.lastBaseUpdate = z, s === null && (u.shared.lanes = 0), ri |= f, t.lanes = f, t.memoizedState = _;
    }
  }
  function Wd(t, e) {
    if (typeof t != "function")
      throw Error(r(191, t));
    t.call(e);
  }
  function $d(t, e) {
    var n = t.callbacks;
    if (n !== null)
      for (t.callbacks = null, t = 0; t < n.length; t++)
        Wd(n[t], e);
  }
  var ii = ze(null), Ju = ze(0);
  function Id(t, e) {
    t = jn, Ht(Ju, t), Ht(ii, e), jn = t | e.baseLanes;
  }
  function gr() {
    Ht(Ju, jn), Ht(ii, ii.current);
  }
  function pr() {
    jn = Ju.current, Gt(ii), Gt(Ju);
  }
  var re = ze(null), ye = null;
  function ai(t) {
    var e = t.alternate;
    Ht(ce, ce.current & 1), Ht(re, t), ye === null && (e === null || ii.current !== null || e.memoizedState !== null) && (ye = t);
  }
  function vr(t) {
    Ht(ce, ce.current), Ht(re, t), ye === null && (ye = t);
  }
  function tm(t) {
    t.tag === 22 ? (Ht(ce, ce.current), Ht(re, t), ye === null && (ye = t)) : li();
  }
  function li() {
    Ht(ce, ce.current), Ht(re, re.current);
  }
  function Be(t) {
    Gt(re), ye === t && (ye = null), Gt(ce);
  }
  var ce = ze(0);
  function Al(t, e) {
    Ht(re, re.current), Ht(ce, e);
  }
  function Sr(t) {
    Gt(ce), Gt(re), ye === t && (ye = null);
  }
  function Fu(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var n = e.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || Gc(n) || qc(n)))
          return e;
      } else if (e.tag === 19 && e.memoizedProps.revealOrder !== "independent") {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    return null;
  }
  var Bn = 0, ht = null, Vt = null, Pt = null, Pu = !1, Sa = !1, ji = !1, ku = 0, Ml = 0, Ta = null, QS = 0;
  function Xt() {
    throw Error(r(321));
  }
  function Tr(t, e) {
    if (e === null) return !1;
    for (var n = 0; n < e.length && n < t.length; n++)
      if (!Ue(t[n], e[n])) return !1;
    return !0;
  }
  function br(t, e, n, i, u, s) {
    return Bn = s, ht = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, $.H = t === null || t.memoizedState === null ? Hm : Lm, ji = !1, s = n(i, u), ji = !1, Sa && (s = nm(
      e,
      n,
      i,
      u
    )), em(t), s;
  }
  function em(t) {
    $.H = is;
    var e = Vt !== null && Vt.next !== null;
    if (Bn = 0, Pt = Vt = ht = null, Pu = !1, Ml = 0, Ta = null, e) throw Error(r(300));
    t === null || kt || (t = t.dependencies, t !== null && Yu(t) && (kt = !0));
  }
  function nm(t, e, n, i) {
    ht = t;
    var u = 0;
    do {
      if (Sa && (Ta = null), Ml = 0, Sa = !1, 25 <= u) throw Error(r(301));
      if (u += 1, Pt = Vt = null, t.updateQueue != null) {
        var s = t.updateQueue;
        s.lastEffect = null, s.events = null, s.stores = null, s.memoCache != null && (s.memoCache.index = 0);
      }
      $.H = $S, s = e(n, i);
    } while (Sa);
    return s;
  }
  function ZS() {
    var t = $.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? Dl(e) : e, t = t.useState()[0], (Vt !== null ? Vt.memoizedState : null) !== t && (ht.flags |= 1024), e;
  }
  function Er() {
    var t = ku !== 0;
    return ku = 0, t;
  }
  function Ar(t, e, n) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~n;
  }
  function Mr(t) {
    if (Pu) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      Pu = !1;
    }
    Bn = 0, Pt = Vt = ht = null, Sa = !1, Ml = ku = 0, Ta = null;
  }
  function pe() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Pt === null ? ht.memoizedState = Pt = t : Pt = Pt.next = t, Pt;
  }
  function Kt() {
    if (Vt === null) {
      var t = ht.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Vt.next;
    var e = Pt === null ? ht.memoizedState : Pt.next;
    if (e !== null)
      Pt = e, Vt = t;
    else {
      if (t === null)
        throw ht.alternate === null ? Error(r(467)) : Error(r(310));
      Vt = t, t = {
        memoizedState: Vt.memoizedState,
        baseState: Vt.baseState,
        baseQueue: Vt.baseQueue,
        queue: Vt.queue,
        next: null
      }, Pt === null ? ht.memoizedState = Pt = t : Pt = Pt.next = t;
    }
    return Pt;
  }
  function Wu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Dl(t) {
    var e = Ml;
    return Ml += 1, Ta === null && (Ta = []), t = Kd(Ta, t, e), e = ht, (Pt === null ? e.memoizedState : Pt.next) === null && (e = e.alternate, $.H = e === null || e.memoizedState === null ? Hm : Lm), t;
  }
  function $u(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return Dl(t);
      if (t.$$typeof === H) return;
      if (t.$$typeof === mt) return oe(t);
    }
    throw Error(r(438, String(t)));
  }
  function Dr(t) {
    var e = null, n = ht.updateQueue;
    if (n !== null && (e = n.memoCache), e == null) {
      var i = ht.alternate;
      i !== null && (i = i.updateQueue, i !== null && (i = i.memoCache, i != null && (e = {
        data: i.data.map(function(u) {
          return u.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), n === null && (n = Wu(), ht.updateQueue = n), n.memoCache = e, n = e.data[e.index], n === void 0)
      for (n = e.data[e.index] = Array(t), i = 0; i < t; i++)
        n[i] = Ge;
    return e.index++, n;
  }
  function wn(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function Iu(t) {
    var e = Kt();
    return xr(e, Vt, t);
  }
  function xr(t, e, n) {
    var i = t.queue;
    if (i === null) throw Error(r(311));
    i.lastRenderedReducer = n;
    var u = t.baseQueue, s = i.pending;
    if (s !== null) {
      if (u !== null) {
        var f = u.next;
        u.next = s.next, s.next = f;
      }
      e.baseQueue = u = s, i.pending = null;
    }
    if (s = t.baseState, u === null) t.memoizedState = s;
    else {
      e = u.next;
      var m = f = null, T = null, x = e, z = !1;
      do {
        var _ = x.lane & -536870913;
        if (_ !== x.lane ? (St & _) === _ : (Bn & _) === _) {
          var M = x.revertLane;
          if (M === 0)
            T !== null && (T = T.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: x.action,
              hasEagerState: x.hasEagerState,
              eagerState: x.eagerState,
              next: null
            }), _ === Ui && (z = !0);
          else if ((Bn & M) === M) {
            x = x.next, M === Ui && (z = !0);
            continue;
          } else
            _ = {
              lane: 0,
              revertLane: x.revertLane,
              gesture: null,
              action: x.action,
              hasEagerState: x.hasEagerState,
              eagerState: x.eagerState,
              next: null
            }, T === null ? (m = T = _, f = s) : T = T.next = _, ht.lanes |= M, ri |= M;
          _ = x.action, ji && n(s, _), s = x.hasEagerState ? x.eagerState : n(s, _);
        } else
          M = {
            lane: _,
            revertLane: x.revertLane,
            gesture: x.gesture,
            action: x.action,
            hasEagerState: x.hasEagerState,
            eagerState: x.eagerState,
            next: null
          }, T === null ? (m = T = M, f = s) : T = T.next = M, ht.lanes |= _, ri |= _;
        x = x.next;
      } while (x !== null && x !== e);
      if (T === null ? f = s : T.next = m, !Ue(s, t.memoizedState) && (kt = !0, z && (n = ga, n !== null)))
        throw n;
      t.memoizedState = s, t.baseState = f, t.baseQueue = T, i.lastRenderedState = s;
    }
    return u === null && (i.lanes = 0), [t.memoizedState, i.dispatch];
  }
  function Cr(t) {
    var e = Kt(), n = e.queue;
    if (n === null) throw Error(r(311));
    n.lastRenderedReducer = t;
    var i = n.dispatch, u = n.pending, s = e.memoizedState;
    if (u !== null) {
      n.pending = null;
      var f = u = u.next;
      do
        s = t(s, f.action), f = f.next;
      while (f !== u);
      Ue(s, e.memoizedState) || (kt = !0), e.memoizedState = s, e.baseQueue === null && (e.baseState = s), n.lastRenderedState = s;
    }
    return [s, i];
  }
  function im(t, e, n) {
    var i = ht, u = Kt(), s = gt;
    if (s) {
      if (n === void 0) throw Error(r(407));
      n = n();
    } else n = e();
    var f = !Ue(
      (Vt || u).memoizedState,
      n
    );
    if (f && (u.memoizedState = n, kt = !0), u = u.queue, Rr(um.bind(null, i, u, t), [
      t
    ]), t = u.getSnapshot !== e || f || Pt !== null && (Pt.memoizedState.tag & 1) !== 0, ba(
      t ? 9 : 8,
      { destroy: void 0 },
      lm.bind(null, i, u, n, e),
      null
    ), t) {
      if (i.flags |= 2048, Bt === null) throw Error(r(349));
      s || (Bn & 127) !== 0 || am(i, e, n);
    }
    return n;
  }
  function am(t, e, n) {
    t.flags |= 16384, t = { getSnapshot: e, value: n }, e = ht.updateQueue, e === null ? (e = Wu(), ht.updateQueue = e, e.stores = [t]) : (n = e.stores, n === null ? e.stores = [t] : n.push(t));
  }
  function lm(t, e, n, i) {
    e.value = n, e.getSnapshot = i, sm(e) && om(t);
  }
  function um(t, e, n) {
    return n(function() {
      sm(e) && om(t);
    });
  }
  function sm(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var n = e();
      return !Ue(t, n);
    } catch {
      return !0;
    }
  }
  function om(t) {
    var e = Oi(t, 2);
    e !== null && Ce(e, t, 2);
  }
  function Or(t) {
    var e = pe();
    if (typeof t == "function") {
      var n = t;
      if (t = n(), ji) {
        Kn(!0);
        try {
          n();
        } finally {
          Kn(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: wn,
      lastRenderedState: t
    }, e;
  }
  function rm(t, e, n, i) {
    return t.baseState = n, xr(
      t,
      Vt,
      typeof i == "function" ? i : wn
    );
  }
  function KS(t, e, n, i, u) {
    if (ns(t)) throw Error(r(485));
    if (t = e.action, t !== null) {
      var s = {
        payload: u,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(f) {
          s.listeners.push(f);
        }
      };
      $.T !== null ? n(!0) : s.isTransition = !1, i(s), n = e.pending, n === null ? (s.next = e.pending = s, cm(e, s)) : (s.next = n.next, e.pending = n.next = s);
    }
  }
  function cm(t, e) {
    var n = e.action, i = e.payload, u = t.state;
    if (e.isTransition) {
      var s = $.T, f = {};
      f.types = s !== null ? s.types : null, $.T = f;
      try {
        var m = n(u, i), T = $.S;
        T !== null && T(f, m), fm(t, e, m);
      } catch (x) {
        zr(t, e, x);
      } finally {
        s !== null && f.types !== null && (s.types = f.types), $.T = s;
      }
    } else
      try {
        s = n(u, i), fm(t, e, s);
      } catch (x) {
        zr(t, e, x);
      }
  }
  function fm(t, e, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(i) {
        hm(t, e, i);
      },
      function(i) {
        return zr(t, e, i);
      }
    ) : hm(t, e, n);
  }
  function hm(t, e, n) {
    e.status = "fulfilled", e.value = n, dm(e), t.state = n, e = t.pending, e !== null && (n = e.next, n === e ? t.pending = null : (n = n.next, e.next = n, cm(t, n)));
  }
  function zr(t, e, n) {
    var i = t.pending;
    if (t.pending = null, i !== null) {
      i = i.next;
      do
        e.status = "rejected", e.reason = n, dm(e), e = e.next;
      while (e !== i);
    }
    t.action = null;
  }
  function dm(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function mm(t, e) {
    return e;
  }
  function ym(t, e) {
    if (gt) {
      var n = Bt.formState;
      if (n !== null) {
        t: {
          var i = ht;
          if (gt) {
            if (Lt) {
              e: {
                for (var u = Lt, s = Fe; u.nodeType !== 8; ) {
                  if (!s) {
                    u = null;
                    break e;
                  }
                  if (u = ke(
                    u.nextSibling
                  ), u === null) {
                    u = null;
                    break e;
                  }
                }
                s = u.data, u = s === "F!" || s === "F" ? u : null;
              }
              if (u) {
                Lt = ke(
                  u.nextSibling
                ), i = u.data === "F!";
                break t;
              }
            }
            Wn(i);
          }
          i = !1;
        }
        i && (e = n[0]);
      }
    }
    return n = pe(), n.memoizedState = n.baseState = e, i = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: mm,
      lastRenderedState: e
    }, n.queue = i, n = Um.bind(
      null,
      ht,
      i
    ), i.dispatch = n, i = Or(!1), s = Br.bind(
      null,
      ht,
      !1,
      i.queue
    ), i = pe(), u = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, i.queue = u, n = KS.bind(
      null,
      ht,
      u,
      s,
      n
    ), u.dispatch = n, i.memoizedState = t, [e, n, !1];
  }
  function gm(t) {
    var e = Kt();
    return pm(e, Vt, t);
  }
  function pm(t, e, n) {
    if (e = xr(
      t,
      e,
      mm
    )[0], t = Iu(wn)[0], typeof e == "object" && e !== null && typeof e.then == "function")
      try {
        var i = Dl(e);
      } catch (f) {
        throw f === pa ? Xu : f;
      }
    else i = e;
    e = Kt();
    var u = e.queue, s = u.dispatch;
    return n !== e.memoizedState && (ht.flags |= 2048, ba(
      9,
      { destroy: void 0 },
      JS.bind(null, u, n),
      null
    )), [i, s, t];
  }
  function JS(t, e) {
    t.action = e;
  }
  function vm(t) {
    var e = Kt(), n = Vt;
    if (n !== null)
      return pm(e, n, t);
    Kt(), e = e.memoizedState, n = Kt();
    var i = n.queue.dispatch;
    return n.memoizedState = t, [e, i, !1];
  }
  function ba(t, e, n, i) {
    return t = { tag: t, create: n, deps: i, inst: e, next: null }, e = ht.updateQueue, e === null && (e = Wu(), ht.updateQueue = e), n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (i = n.next, n.next = t, t.next = i, e.lastEffect = t), t;
  }
  function Sm() {
    return Kt().memoizedState;
  }
  function ts(t, e, n, i) {
    var u = pe();
    ht.flags |= t, u.memoizedState = ba(
      1 | e,
      { destroy: void 0 },
      n,
      i === void 0 ? null : i
    );
  }
  function es(t, e, n, i) {
    var u = Kt();
    i = i === void 0 ? null : i;
    var s = u.memoizedState.inst;
    Vt !== null && i !== null && Tr(i, Vt.memoizedState.deps) ? u.memoizedState = ba(e, s, n, i) : (ht.flags |= t, u.memoizedState = ba(
      1 | e,
      s,
      n,
      i
    ));
  }
  function Tm(t, e) {
    ts(8390656, 8, t, e);
  }
  function Rr(t, e) {
    es(2048, 8, t, e);
  }
  function FS(t) {
    ht.flags |= 4;
    var e = ht.updateQueue;
    if (e === null)
      e = Wu(), ht.updateQueue = e, e.events = [t];
    else {
      var n = e.events;
      n === null ? e.events = [t] : n.push(t);
    }
  }
  function bm(t) {
    var e = Kt().memoizedState;
    return FS({ ref: e, nextImpl: t }), function() {
      if ((xt & 2) !== 0) throw Error(r(440));
      return e.impl.apply(void 0, arguments);
    };
  }
  function Em(t, e) {
    return es(4, 2, t, e);
  }
  function Am(t, e) {
    return es(4, 4, t, e);
  }
  function Mm(t, e) {
    if (typeof e == "function") {
      t = t();
      var n = e(t);
      return function() {
        typeof n == "function" ? n() : e(null);
      };
    }
    if (e != null)
      return t = t(), e.current = t, function() {
        e.current = null;
      };
  }
  function Dm(t, e, n) {
    n = n != null ? n.concat([t]) : null, es(4, 4, Mm.bind(null, e, t), n);
  }
  function Nr() {
  }
  function xm(t, e) {
    var n = Kt();
    e = e === void 0 ? null : e;
    var i = n.memoizedState;
    return e !== null && Tr(e, i[1]) ? i[0] : (n.memoizedState = [t, e], t);
  }
  function Cm(t, e) {
    var n = Kt();
    e = e === void 0 ? null : e;
    var i = n.memoizedState;
    if (e !== null && Tr(e, i[1]))
      return i[0];
    if (i = t(), ji) {
      Kn(!0);
      try {
        t();
      } finally {
        Kn(!1);
      }
    }
    return n.memoizedState = [i, e], i;
  }
  function Vr(t, e, n) {
    return n === void 0 || (Bn & 1073741824) !== 0 && (St & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = n, t = Hy(), ht.lanes |= t, ri |= t, n);
  }
  function Om(t, e, n, i) {
    return Ue(n, e) ? n : ii.current !== null ? (t = Vr(t, n, i), Ue(t, e) || (kt = !0), t) : (Bn & 106) === 0 || (Bn & 1073741824) !== 0 && (St & 261930) === 0 ? (kt = !0, t.memoizedState = n) : (t = Hy(), ht.lanes |= t, ri |= t, e);
  }
  function zm(t, e, n, i, u) {
    var s = at.p;
    at.p = s !== 0 && 8 > s ? s : 8;
    var f = $.T, m = {};
    m.types = f !== null ? f.types : null, $.T = m, Br(t, !1, e, n);
    try {
      var T = u(), x = $.S;
      if (x !== null && x(m, T), T !== null && typeof T == "object" && typeof T.then == "function") {
        var z = XS(
          T,
          i
        );
        xl(
          t,
          e,
          z,
          je(t)
        );
      } else
        xl(
          t,
          e,
          i,
          je(t)
        );
    } catch (_) {
      xl(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: _ },
        je()
      );
    } finally {
      at.p = s, f !== null && m.types !== null && (f.types = m.types), $.T = f;
    }
  }
  function PS() {
  }
  function _r(t, e, n, i) {
    if (t.tag !== 5) throw Error(r(476));
    var u = Rm(t).queue;
    zm(
      t,
      u,
      e,
      qe,
      n === null ? PS : function() {
        return Nm(t), n(i);
      }
    );
  }
  function Rm(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: qe,
      baseState: qe,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: wn,
        lastRenderedState: qe
      },
      next: null
    };
    var n = {};
    return e.next = {
      memoizedState: n,
      baseState: n,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: wn,
        lastRenderedState: n
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function Nm(t) {
    var e = Rm(t);
    e.next === null && (e = t.alternate.memoizedState), xl(
      t,
      e.next.queue,
      {},
      je()
    );
  }
  function Ur() {
    return oe(Ya);
  }
  function Vm() {
    return Kt().memoizedState;
  }
  function _m() {
    return Kt().memoizedState;
  }
  function kS(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var n = je();
          t = ei(n);
          var i = ni(e, t, n);
          i !== null && (Ce(i, e, n), Tl(i, e, n)), e = { cache: or() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function WS(t, e, n) {
    var i = je();
    n = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ns(t) ? Bm(e, n) : (n = Io(t, e, n, i), n !== null && (Ce(n, t, i), wm(n, e, i)));
  }
  function Um(t, e, n) {
    var i = je();
    xl(t, e, n, i);
  }
  function xl(t, e, n, i) {
    var u = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (ns(t)) Bm(e, u);
    else {
      var s = t.alternate;
      if (t.lanes === 0 && (s === null || s.lanes === 0) && (s = e.lastRenderedReducer, s !== null))
        try {
          var f = e.lastRenderedState, m = s(f, n);
          if (u.hasEagerState = !0, u.eagerState = m, Ue(m, f))
            return _u(t, e, u, 0), Bt === null && Vu(), !1;
        } catch {
        }
      if (n = Io(t, e, u, i), n !== null)
        return Ce(n, t, i), wm(n, e, i), !0;
    }
    return !1;
  }
  function Br(t, e, n, i) {
    if (i = {
      lane: 2,
      revertLane: Dc(),
      gesture: null,
      action: i,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ns(t)) {
      if (e) throw Error(r(479));
    } else
      e = Io(
        t,
        n,
        i,
        2
      ), e !== null && Ce(e, t, 2);
  }
  function ns(t) {
    var e = t.alternate;
    return t === ht || e !== null && e === ht;
  }
  function Bm(t, e) {
    Sa = Pu = !0;
    var n = t.pending;
    n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
  }
  function wm(t, e, n) {
    if ((n & 4194048) !== 0) {
      var i = e.lanes;
      i &= t.pendingLanes, n |= i, e.lanes = n, Hh(t, n);
    }
  }
  var is = {
    readContext: oe,
    use: $u,
    useCallback: Xt,
    useContext: Xt,
    useEffect: Xt,
    useImperativeHandle: Xt,
    useLayoutEffect: Xt,
    useInsertionEffect: Xt,
    useMemo: Xt,
    useReducer: Xt,
    useRef: Xt,
    useState: Xt,
    useDebugValue: Xt,
    useDeferredValue: Xt,
    useTransition: Xt,
    useSyncExternalStore: Xt,
    useId: Xt,
    useHostTransitionStatus: Xt,
    useFormState: Xt,
    useActionState: Xt,
    useOptimistic: Xt,
    useMemoCache: Xt,
    useCacheRefresh: Xt,
    useEffectEvent: Xt
  }, Hm = {
    readContext: oe,
    use: $u,
    useCallback: function(t, e) {
      return pe().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: oe,
    useEffect: Tm,
    useImperativeHandle: function(t, e, n) {
      n = n != null ? n.concat([t]) : null, ts(
        4194308,
        4,
        Mm.bind(null, e, t),
        n
      );
    },
    useLayoutEffect: function(t, e) {
      return ts(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      ts(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var n = pe();
      e = e === void 0 ? null : e;
      var i = t();
      if (ji) {
        Kn(!0);
        try {
          t();
        } finally {
          Kn(!1);
        }
      }
      return n.memoizedState = [i, e], i;
    },
    useReducer: function(t, e, n) {
      var i = pe();
      if (n !== void 0) {
        var u = n(e);
        if (ji) {
          Kn(!0);
          try {
            n(e);
          } finally {
            Kn(!1);
          }
        }
      } else u = e;
      return i.memoizedState = i.baseState = u, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: u
      }, i.queue = t, t = t.dispatch = WS.bind(
        null,
        ht,
        t
      ), [i.memoizedState, t];
    },
    useRef: function(t) {
      var e = pe();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Or(t);
      var e = t.queue, n = Um.bind(null, ht, e);
      return e.dispatch = n, [t.memoizedState, n];
    },
    useDebugValue: Nr,
    useDeferredValue: function(t, e) {
      var n = pe();
      return Vr(n, t, e);
    },
    useTransition: function() {
      var t = Or(!1);
      return t = zm.bind(
        null,
        ht,
        t.queue,
        !0,
        !1
      ), pe().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, n) {
      var i = ht, u = pe();
      if (gt) {
        if (n === void 0)
          throw Error(r(407));
        n = n();
      } else {
        if (n = e(), Bt === null)
          throw Error(r(349));
        (St & 127) !== 0 || am(i, e, n);
      }
      u.memoizedState = n;
      var s = { value: n, getSnapshot: e };
      return u.queue = s, Tm(um.bind(null, i, s, t), [
        t
      ]), i.flags |= 2048, ba(
        9,
        { destroy: void 0 },
        lm.bind(
          null,
          i,
          s,
          n,
          e
        ),
        null
      ), n;
    },
    useId: function() {
      var t = pe(), e = Bt.identifierPrefix;
      if (gt) {
        var n = dn, i = hn;
        n = (i & ~(1 << 32 - Ve(i) - 1)).toString(32) + n, e = "_" + e + "R_" + n, n = ku++, 0 < n && (e += "H" + n.toString(32)), e += "_";
      } else
        n = QS++, e = "_" + e + "r_" + n.toString(32) + "_";
      return t.memoizedState = e;
    },
    useHostTransitionStatus: Ur,
    useFormState: ym,
    useActionState: ym,
    useOptimistic: function(t) {
      var e = pe();
      e.memoizedState = e.baseState = t;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = n, e = Br.bind(
        null,
        ht,
        !0,
        n
      ), n.dispatch = e, [t, e];
    },
    useMemoCache: Dr,
    useCacheRefresh: function() {
      return pe().memoizedState = kS.bind(
        null,
        ht
      );
    },
    useEffectEvent: function(t) {
      var e = pe(), n = { impl: t };
      return e.memoizedState = n, function() {
        if ((xt & 2) !== 0)
          throw Error(r(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, Lm = {
    readContext: oe,
    use: $u,
    useCallback: xm,
    useContext: oe,
    useEffect: Rr,
    useImperativeHandle: Dm,
    useInsertionEffect: Em,
    useLayoutEffect: Am,
    useMemo: Cm,
    useReducer: Iu,
    useRef: Sm,
    useState: function() {
      return Iu(wn);
    },
    useDebugValue: Nr,
    useDeferredValue: function(t, e) {
      var n = Kt();
      return Om(
        n,
        Vt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Iu(wn)[0], e = Kt().memoizedState;
      return [
        typeof t == "boolean" ? t : Dl(t),
        e
      ];
    },
    useSyncExternalStore: im,
    useId: Vm,
    useHostTransitionStatus: Ur,
    useFormState: gm,
    useActionState: gm,
    useOptimistic: function(t, e) {
      var n = Kt();
      return rm(n, Vt, t, e);
    },
    useMemoCache: Dr,
    useCacheRefresh: _m,
    useEffectEvent: bm
  }, $S = {
    readContext: oe,
    use: $u,
    useCallback: xm,
    useContext: oe,
    useEffect: Rr,
    useImperativeHandle: Dm,
    useInsertionEffect: Em,
    useLayoutEffect: Am,
    useMemo: Cm,
    useReducer: Cr,
    useRef: Sm,
    useState: function() {
      return Cr(wn);
    },
    useDebugValue: Nr,
    useDeferredValue: function(t, e) {
      var n = Kt();
      return Vt === null ? Vr(n, t, e) : Om(
        n,
        Vt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Cr(wn)[0], e = Kt().memoizedState;
      return [
        typeof t == "boolean" ? t : Dl(t),
        e
      ];
    },
    useSyncExternalStore: im,
    useId: Vm,
    useHostTransitionStatus: Ur,
    useFormState: vm,
    useActionState: vm,
    useOptimistic: function(t, e) {
      var n = Kt();
      return Vt !== null ? rm(n, Vt, t, e) : (n.baseState = t, [t, n.queue.dispatch]);
    },
    useMemoCache: Dr,
    useCacheRefresh: _m,
    useEffectEvent: bm
  };
  function wr(t, e, n, i) {
    e = t.memoizedState, n = n(i, e), n = n == null ? e : G({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
  }
  var Hr = {
    enqueueSetState: function(t, e, n) {
      t = t._reactInternals;
      var i = je(), u = ei(i);
      u.payload = e, n != null && (u.callback = n), e = ni(t, u, i), e !== null && (Ce(e, t, i), Tl(e, t, i));
    },
    enqueueReplaceState: function(t, e, n) {
      t = t._reactInternals;
      var i = je(), u = ei(i);
      u.tag = 1, u.payload = e, n != null && (u.callback = n), e = ni(t, u, i), e !== null && (Ce(e, t, i), Tl(e, t, i));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var n = je(), i = ei(n);
      i.tag = 2, e != null && (i.callback = e), e = ni(t, i, n), e !== null && (Ce(e, t, n), Tl(e, t, n));
    }
  };
  function jm(t, e, n, i, u, s, f) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(i, s, f) : e.prototype && e.prototype.isPureReactComponent ? !hl(n, i) || !hl(u, s) : !0;
  }
  function Ym(t, e, n, i) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, i), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, i), e.state !== t && Hr.enqueueReplaceState(e, e.state, null);
  }
  function Yi(t, e) {
    var n = e;
    if ("ref" in e) {
      n = {};
      for (var i in e)
        i !== "ref" && (n[i] = e[i]);
    }
    if (t = t.defaultProps) {
      n === e && (n = G({}, n));
      for (var u in t)
        n[u] === void 0 && (n[u] = t[u]);
    }
    return n;
  }
  function Gm(t) {
    Nu(t);
  }
  function qm(t) {
    console.error(t);
  }
  function Xm(t) {
    Nu(t);
  }
  function as(t, e) {
    try {
      var n = t.onUncaughtError;
      n(e.value, { componentStack: e.stack });
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  function Qm(t, e, n) {
    try {
      var i = t.onCaughtError;
      i(n.value, {
        componentStack: n.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (u) {
      setTimeout(function() {
        throw u;
      });
    }
  }
  function Lr(t, e, n) {
    return n = ei(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      as(t, e);
    }, n;
  }
  function Zm(t) {
    return t = ei(t), t.tag = 3, t;
  }
  function Km(t, e, n, i) {
    var u = n.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var s = i.value;
      t.payload = function() {
        return u(s);
      }, t.callback = function() {
        Qm(e, n, i);
      };
    }
    var f = n.stateNode;
    f !== null && typeof f.componentDidCatch == "function" && (t.callback = function() {
      Qm(e, n, i), typeof u != "function" && (ci === null ? ci = /* @__PURE__ */ new Set([this]) : ci.add(this));
      var m = i.stack;
      this.componentDidCatch(i.value, {
        componentStack: m !== null ? m : ""
      });
    });
  }
  function IS(t, e, n, i, u) {
    if (n.flags |= 32768, i !== null && typeof i == "object" && typeof i.then == "function") {
      if (e = n.alternate, e !== null && Vi(
        e,
        n,
        u,
        !0
      ), n = re.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
          case 19:
            return ye === null ? Ds() : n.alternate === null && Qt === 0 && (Qt = 3), n.flags &= -257, n.flags |= 65536, n.lanes = u, i === Qu ? n.flags |= 16384 : (e = n.updateQueue, e === null ? n.updateQueue = /* @__PURE__ */ new Set([i]) : e.add(i), Ec(t, i, u)), !1;
          case 22:
            return n.flags |= 65536, i === Qu ? n.flags |= 16384 : (e = n.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([i])
            }, n.updateQueue = e) : (n = e.retryQueue, n === null ? e.retryQueue = /* @__PURE__ */ new Set([i]) : n.add(i)), Ec(t, i, u)), !1;
        }
        throw Error(r(435, n.tag));
      }
      return Ec(t, i, u), Ds(), !1;
    }
    if (gt)
      return e = re.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = u, i !== ar && (t = Error(r(422), { cause: i }), yl(Ze(t, n)))) : (i !== ar && (e = Error(r(423), {
        cause: i
      }), yl(
        Ze(e, n)
      )), t = t.current.alternate, t.flags |= 65536, u &= -u, t.lanes |= u, i = Ze(i, n), u = Lr(
        t.stateNode,
        i,
        u
      ), mr(t, u), Qt !== 4 && (Qt = 2)), !1;
    var s = Error(r(520), { cause: i });
    if (s = Ze(s, n), Ul === null ? Ul = [s] : Ul.push(s), Qt !== 4 && (Qt = 2), e === null) return !0;
    i = Ze(i, n), n = e;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, t = u & -u, n.lanes |= t, t = Lr(n.stateNode, i, t), mr(n, t), !1;
        case 1:
          if (e = n.type, s = n.stateNode, (n.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || s !== null && typeof s.componentDidCatch == "function" && (ci === null || !ci.has(s))))
            return n.flags |= 65536, u &= -u, n.lanes |= u, u = Zm(u), Km(
              u,
              t,
              n,
              i
            ), mr(n, u), !1;
          break;
        case 22:
          if (n.memoizedState !== null)
            return n.flags |= 65536, !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var jr = Error(r(461)), kt = !1;
  function te(t, e, n, i) {
    e.child = t === null ? kd(e, null, n, i) : Li(
      e,
      t.child,
      n,
      i
    );
  }
  function Jm(t, e, n, i, u) {
    n = n.render;
    var s = e.ref;
    if ("ref" in i) {
      var f = {};
      for (var m in i)
        m !== "ref" && (f[m] = i[m]);
    } else f = i;
    return _i(e), i = br(
      t,
      e,
      n,
      f,
      s,
      u
    ), m = Er(), t !== null && !kt ? (Ar(t, e, u), Hn(t, e, u)) : (gt && m && Hu(e), e.flags |= 1, te(t, e, i, u), e.child);
  }
  function Fm(t, e, n, i, u) {
    if (t === null) {
      var s = n.type;
      return typeof s == "function" && !tr(s) && s.defaultProps === void 0 && n.compare === null ? (e.tag = 15, e.type = s, Pm(
        t,
        e,
        s,
        i,
        u
      )) : (t = Bu(
        n.type,
        null,
        i,
        e,
        e.mode,
        u
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (s = t.child, !Jr(t, u)) {
      var f = s.memoizedProps;
      if (n = n.compare, n = n !== null ? n : hl, n(f, i) && t.ref === e.ref)
        return Hn(t, e, u);
    }
    return e.flags |= 1, t = Nn(s, i), t.ref = e.ref, t.return = e, e.child = t;
  }
  function Pm(t, e, n, i, u) {
    if (t !== null) {
      var s = t.memoizedProps;
      if (hl(s, i) && t.ref === e.ref)
        if (kt = !1, e.pendingProps = i = s, Jr(t, u))
          (t.flags & 131072) !== 0 && (kt = !0);
        else
          return e.lanes = t.lanes, Hn(t, e, u);
    }
    return Yr(
      t,
      e,
      n,
      i,
      u
    );
  }
  function km(t, e, n, i) {
    var u = i.children, s = t !== null ? t.memoizedState : null;
    if (t === null && e.stateNode === null && (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), i.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (s = s !== null ? s.baseLanes | n : n, t !== null) {
          for (i = e.child = t.child, u = 0; i !== null; )
            u = u | i.lanes | i.childLanes, i = i.sibling;
          i = u & ~s;
        } else i = 0, e.child = null;
        return Wm(
          t,
          e,
          s,
          n,
          i
        );
      }
      if ((n & 536870912) !== 0)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && qu(
          e,
          s !== null ? s.cachePool : null
        ), s !== null ? Id(e, s) : gr(), tm(e);
      else
        return i = e.lanes = 536870912, Wm(
          t,
          e,
          s !== null ? s.baseLanes | n : n,
          n,
          i
        );
    } else
      s !== null ? (qu(e, s.cachePool), Id(e, s), li(), e.memoizedState = null) : (t !== null && qu(e, null), gr(), li());
    return te(t, e, u, n), e.child;
  }
  function Cl(t, e) {
    return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.sibling;
  }
  function Wm(t, e, n, i, u) {
    var s = cr();
    return s = s === null ? null : { parent: Ft._currentValue, pool: s }, e.memoizedState = {
      baseLanes: n,
      cachePool: s
    }, t !== null && qu(e, null), gr(), tm(e), t !== null && Vi(t, e, i, !0), e.childLanes = u, null;
  }
  function ls(t, e) {
    return e = us(
      { mode: e.mode, children: e.children },
      t.mode
    ), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function $m(t, e, n) {
    return Li(e, t.child, null, n), t = ls(e, e.pendingProps), t.flags |= 2, Be(e), e.memoizedState = null, t;
  }
  function tT(t, e, n) {
    var i = e.pendingProps, u = (e.flags & 128) !== 0;
    if (e.flags &= -129, t === null) {
      if (gt) {
        if (i.mode === "hidden")
          return t = ls(e, i), e.lanes = 536870912, t.memoizedState = { baseLanes: 0, cachePool: null }, Cl(null, t);
        if (vr(e), (t = Lt) ? (t = M0(
          t,
          Fe
        ), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: Pn !== null ? { id: hn, overflow: dn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Bd(t), n.return = e, e.child = n, ie = e, Lt = null)) : t = null, t === null) throw Wn(e);
        return e.lanes = 536870912, null;
      }
      return ls(e, i);
    }
    var s = t.memoizedState;
    if (s !== null) {
      var f = s.dehydrated;
      if (vr(e), u)
        if (e.flags & 256)
          e.flags &= -257, e = $m(
            t,
            e,
            n
          );
        else if (e.memoizedState !== null)
          e.child = t.child, e.flags |= 128, e = null;
        else throw Error(r(558));
      else if (kt || Vi(t, e, n, !1), u = (n & t.childLanes) !== 0, kt || u) {
        if (ii.current === null) {
          if (i = Bt, i !== null && (f = Lh(i, n), f !== 0 && f !== s.retryLane))
            throw s.retryLane = f, Oi(t, f), Ce(i, t, f), jr;
          Ds();
        }
        e = $m(
          t,
          e,
          n
        );
      } else
        t = s.treeContext, Lt = ke(f.nextSibling), ie = e, gt = !0, kn = null, Fe = !1, t !== null && Ld(e, t), e = ls(e, i), e.flags |= 134221824;
      return e;
    }
    return t = Nn(t.child, {
      mode: i.mode,
      children: i.children
    }), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Ea(t, e) {
    var n = e.ref;
    if (n === null)
      t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(r(284));
      (t === null || t.ref !== n) && (e.flags |= 4194816);
    }
  }
  function Yr(t, e, n, i, u) {
    return _i(e), n = br(
      t,
      e,
      n,
      i,
      void 0,
      u
    ), i = Er(), t !== null && !kt ? (Ar(t, e, u), Hn(t, e, u)) : (gt && i && Hu(e), e.flags |= 1, te(t, e, n, u), e.child);
  }
  function Im(t, e, n, i, u, s) {
    return _i(e), e.updateQueue = null, n = nm(
      e,
      i,
      n,
      u
    ), em(t), i = Er(), t !== null && !kt ? (Ar(t, e, s), Hn(t, e, s)) : (gt && i && Hu(e), e.flags |= 1, te(t, e, n, s), e.child);
  }
  function ty(t, e, n, i, u) {
    if (_i(e), e.stateNode === null) {
      var s = ha, f = n.contextType;
      typeof f == "object" && f !== null && (s = oe(f)), s = new n(i, s), e.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null, s.updater = Hr, e.stateNode = s, s._reactInternals = e, s = e.stateNode, s.props = i, s.state = e.memoizedState, s.refs = {}, hr(e), f = n.contextType, s.context = typeof f == "object" && f !== null ? oe(f) : ha, s.state = e.memoizedState, f = n.getDerivedStateFromProps, typeof f == "function" && (wr(
        e,
        n,
        f,
        i
      ), s.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof s.getSnapshotBeforeUpdate == "function" || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (f = s.state, typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(), f !== s.state && Hr.enqueueReplaceState(s, s.state, null), El(e, i, s, u), bl(), s.state = e.memoizedState), typeof s.componentDidMount == "function" && (e.flags |= 4194308), i = !0;
    } else if (t === null) {
      s = e.stateNode;
      var m = e.memoizedProps, T = Yi(n, m);
      s.props = T;
      var x = s.context, z = n.contextType;
      f = ha, typeof z == "object" && z !== null && (f = oe(z));
      var _ = n.getDerivedStateFromProps;
      z = typeof _ == "function" || typeof s.getSnapshotBeforeUpdate == "function", m = e.pendingProps !== m, z || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (m || x !== f) && Ym(
        e,
        s,
        i,
        f
      ), ti = !1;
      var M = e.memoizedState;
      s.state = M, El(e, i, s, u), bl(), x = e.memoizedState, m || M !== x || ti ? (typeof _ == "function" && (wr(
        e,
        n,
        _,
        i
      ), x = e.memoizedState), (T = ti || jm(
        e,
        n,
        T,
        i,
        M,
        x,
        f
      )) ? (z || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = i, e.memoizedState = x), s.props = i, s.state = x, s.context = f, i = T) : (typeof s.componentDidMount == "function" && (e.flags |= 4194308), i = !1);
    } else {
      s = e.stateNode, dr(t, e), f = e.memoizedProps, z = Yi(n, f), s.props = z, _ = e.pendingProps, M = s.context, x = n.contextType, T = ha, typeof x == "object" && x !== null && (T = oe(x)), m = n.getDerivedStateFromProps, (x = typeof m == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (f !== _ || M !== T) && Ym(
        e,
        s,
        i,
        T
      ), ti = !1, M = e.memoizedState, s.state = M, El(e, i, s, u), bl();
      var O = e.memoizedState;
      f !== _ || M !== O || ti || t !== null && t.dependencies !== null && Yu(t.dependencies) ? (typeof m == "function" && (wr(
        e,
        n,
        m,
        i
      ), O = e.memoizedState), (z = ti || jm(
        e,
        n,
        z,
        i,
        M,
        O,
        T
      ) || t !== null && t.dependencies !== null && Yu(t.dependencies)) ? (x || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, O, T), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(
        i,
        O,
        T
      )), typeof s.componentDidUpdate == "function" && (e.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || f === t.memoizedProps && M === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || f === t.memoizedProps && M === t.memoizedState || (e.flags |= 1024), e.memoizedProps = i, e.memoizedState = O), s.props = i, s.state = O, s.context = T, i = z) : (typeof s.componentDidUpdate != "function" || f === t.memoizedProps && M === t.memoizedState || (e.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || f === t.memoizedProps && M === t.memoizedState || (e.flags |= 1024), i = !1);
    }
    return s = i, Ea(t, e), i = (e.flags & 128) !== 0, s || i ? (s = e.stateNode, n = i && typeof n.getDerivedStateFromError != "function" ? null : s.render(), e.flags |= 1, t !== null && i ? (e.child = Li(
      e,
      t.child,
      null,
      u
    ), e.child = Li(
      e,
      null,
      n,
      u
    )) : te(t, e, n, u), e.memoizedState = s.state, t = e.child) : t = Hn(
      t,
      e,
      u
    ), t;
  }
  function ey(t, e, n, i) {
    return Ri(), e.flags |= 256, te(t, e, n, i), e.child;
  }
  var Gr = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function qr(t) {
    return { baseLanes: t, cachePool: Qd() };
  }
  function Xr(t, e, n) {
    return t = t !== null ? t.childLanes & ~n : 0, e && (t |= Le), t;
  }
  function ny(t, e, n) {
    var i = e.pendingProps, u = !1, s = (e.flags & 128) !== 0, f;
    if ((f = s) || (f = t !== null && t.memoizedState === null ? !1 : (ce.current & 2) !== 0), f && (u = !0, e.flags &= -129), f = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (gt) {
        if (u ? ai(e) : li(), (t = Lt) ? (t = M0(
          t,
          Fe
        ), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: Pn !== null ? { id: hn, overflow: dn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Bd(t), n.return = e, e.child = n, ie = e, Lt = null)) : t = null, t === null) throw Wn(e);
        return qc(t) ? e.lanes = 32 : e.lanes = 536870912, null;
      }
      return s = i.children, i = i.fallback, u ? (li(), u = e.mode, s = us(
        { mode: "hidden", children: s },
        u
      ), i = zi(
        i,
        u,
        n,
        null
      ), s.return = e, i.return = e, s.sibling = i, e.child = s, i = e.child, i.memoizedState = qr(n), i.childLanes = Xr(
        t,
        f,
        n
      ), e.memoizedState = Gr, Cl(null, i)) : (ai(e), Qr(e, s));
    }
    var m = t.memoizedState;
    if (m !== null) {
      var T = m.dehydrated;
      if (T !== null)
        return eT(
          t,
          e,
          s,
          f,
          i,
          T,
          m,
          n
        );
    }
    return u ? (li(), u = i.fallback, s = e.mode, m = t.child, T = m.sibling, i = Nn(m, {
      mode: "hidden",
      children: i.children
    }), i.subtreeFlags = m.subtreeFlags & 1206910976, T !== null ? u = Nn(T, u) : (u = zi(
      u,
      s,
      n,
      null
    ), u.flags |= 2), u.return = e, i.return = e, i.sibling = u, e.child = i, Cl(null, i), i = e.child, u = t.child.memoizedState, u === null ? u = qr(n) : (s = u.cachePool, s !== null ? (m = Ft._currentValue, s = s.parent !== m ? { parent: m, pool: m } : s) : s = Qd(), u = {
      baseLanes: u.baseLanes | n,
      cachePool: s
    }), i.memoizedState = u, i.childLanes = Xr(
      t,
      f,
      n
    ), e.memoizedState = Gr, Cl(t.child, i)) : (ai(e), n = t.child, t = n.sibling, n = Nn(n, {
      mode: "visible",
      children: i.children
    }), n.return = e, n.sibling = null, t !== null && (f = e.deletions, f === null ? (e.deletions = [t], e.flags |= 16) : f.push(t)), e.child = n, e.memoizedState = null, n);
  }
  function Qr(t, e) {
    return e = us(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function us(t, e) {
    return t = Ae(22, t, null, e), t.lanes = 0, t;
  }
  function ss(t, e, n) {
    return Li(e, t.child, null, n), t = Qr(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function eT(t, e, n, i, u, s, f, m) {
    if (n)
      return e.flags & 256 ? (ai(e), e.flags &= -257, ss(
        t,
        e,
        m
      )) : e.memoizedState !== null ? (li(), e.child = t.child, e.flags |= 128, null) : (li(), s = u.fallback, f = e.mode, u = us(
        { mode: "visible", children: u.children },
        f
      ), s = zi(
        s,
        f,
        m,
        null
      ), s.flags |= 2, u.return = e, s.return = e, u.sibling = s, e.child = u, Li(e, t.child, null, m), u = e.child, u.memoizedState = qr(m), u.childLanes = Xr(
        t,
        i,
        m
      ), e.memoizedState = Gr, Cl(null, u));
    if (ai(e), qc(s)) {
      if (i = s.nextSibling && s.nextSibling.dataset, i) var T = i.dgst;
      return i = T, i !== "" && (u = Error(r(419)), u.stack = "", u.digest = i, yl({ value: u, source: null, stack: null })), ss(
        t,
        e,
        m
      );
    }
    if (kt || Vi(t, e, m, !1), i = (m & t.childLanes) !== 0, kt || i) {
      if (ii.current !== null)
        return ss(
          t,
          e,
          m
        );
      if (i = Bt, i !== null && (u = Lh(
        i,
        m
      ), u !== 0 && u !== f.retryLane))
        throw f.retryLane = u, Oi(t, u), Ce(i, t, u), jr;
      return Gc(s) || Ds(), ss(
        t,
        e,
        m
      );
    }
    return Gc(s) ? (e.flags |= 192, e.child = t.child, null) : (t = f.treeContext, Lt = ke(s.nextSibling), ie = e, gt = !0, kn = null, Fe = !1, t !== null && Ld(e, t), e = Qr(
      e,
      u.children
    ), e.flags |= 134221824, e);
  }
  function iy(t, e, n) {
    t.lanes |= e;
    var i = t.alternate;
    i !== null && (i.lanes |= e), ju(t.return, e, n);
  }
  function ay(t) {
    for (var e = null; t !== null; ) {
      var n = t.alternate;
      n !== null && Fu(n) === null && (e = t), t = t.sibling;
    }
    return e;
  }
  function os(t, e, n, i, u, s) {
    var f = t.memoizedState;
    f === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: i,
      tail: n,
      tailMode: u,
      treeForkCount: s
    } : (f.isBackwards = e, f.rendering = null, f.renderingStartTime = 0, f.last = i, f.tail = n, f.tailMode = u, f.treeForkCount = s);
  }
  function Zr(t) {
    var e = t.child;
    for (t.child = null; e !== null; ) {
      var n = e.sibling;
      e.sibling = t.child, t.child = e, e = n;
    }
  }
  function Kr(t, e, n) {
    var i = e.pendingProps, u = i.revealOrder, s = i.tail;
    i = i.children;
    var f = ce.current;
    if (e.flags & 128)
      return Al(e, f), null;
    var m = (f & 2) !== 0;
    if (m ? (f = f & 1 | 2, e.flags |= 128) : f &= 1, Al(e, f), u === "backwards" && t !== null ? (Zr(t), te(t, e, i, n), Zr(t)) : te(t, e, i, n), i = gt ? ml : 0, !m && t !== null && (t.flags & 128) !== 0)
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13)
          t.memoizedState !== null && iy(t, n, e);
        else if (t.tag === 19)
          iy(t, n, e);
        else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            break t;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    switch (u) {
      case "backwards":
        n = ay(e.child), n === null ? (u = e.child, e.child = null) : (u = n.sibling, n.sibling = null, Zr(e)), os(
          e,
          !0,
          u,
          null,
          s,
          i
        );
        break;
      case "unstable_legacy-backwards":
        for (n = null, u = e.child, e.child = null; u !== null; ) {
          if (t = u.alternate, t !== null && Fu(t) === null) {
            e.child = u;
            break;
          }
          t = u.sibling, u.sibling = n, n = u, u = t;
        }
        os(
          e,
          !0,
          n,
          null,
          s,
          i
        );
        break;
      case "together":
        os(
          e,
          !1,
          null,
          null,
          void 0,
          i
        );
        break;
      case "independent":
        e.memoizedState = null;
        break;
      default:
        n = ay(e.child), n === null ? (u = e.child, e.child = null) : (u = n.sibling, n.sibling = null), os(
          e,
          !1,
          u,
          n,
          s,
          i
        );
    }
    return e.child;
  }
  function ly(t, e, n) {
    var i = e.pendingProps;
    return $n(e, e.type, i.value), te(t, e, i.children, n), e.child;
  }
  function Hn(t, e, n) {
    if (t !== null && (e.dependencies = t.dependencies), ri |= e.lanes, (n & e.childLanes) === 0)
      if (t !== null) {
        if (Vi(
          t,
          e,
          n,
          !1
        ), (n & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(r(153));
    if (e.child !== null) {
      for (t = e.child, n = Nn(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; )
        t = t.sibling, n = n.sibling = Nn(t, t.pendingProps), n.return = e;
      n.sibling = null;
    }
    return e.child;
  }
  function Jr(t, e) {
    return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && Yu(t)));
  }
  function nT(t, e, n) {
    switch (e.tag) {
      case 3:
        du(e, e.stateNode.containerInfo), $n(e, Ft, t.memoizedState.cache), Ri();
        break;
      case 27:
      case 5:
        To(e);
        break;
      case 4:
        du(e, e.stateNode.containerInfo);
        break;
      case 10:
        $n(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 31:
        if (e.memoizedState !== null)
          return e.flags |= 128, vr(e), null;
        break;
      case 13:
        var i = e.memoizedState;
        if (i !== null) {
          if (i.dehydrated !== null)
            return ai(e), e.flags |= 128, null;
          i = Vi(
            t,
            e,
            n,
            !1
          );
          var u = e.child.childLanes;
          return i || (n & u) !== 0 ? ny(t, e, n) : (ai(e), t = Hn(
            t,
            e,
            n
          ), t !== null ? t.sibling : null);
        }
        ai(e);
        break;
      case 19:
        if (e.flags & 128)
          return Kr(
            t,
            e,
            n
          );
        if (u = (t.flags & 128) !== 0, i = (n & e.childLanes) !== 0, i || (Vi(
          t,
          e,
          n,
          !1
        ), i = (n & e.childLanes) !== 0), u) {
          if (i)
            return Kr(
              t,
              e,
              n
            );
          e.flags |= 128;
        }
        if (u = e.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), Al(e, ce.current), i) break;
        return null;
      case 22:
        return e.lanes = 0, km(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        $n(e, Ft, t.memoizedState.cache);
    }
    return Hn(t, e, n);
  }
  function uy(t, e, n) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        kt = !0;
      else {
        if (!Jr(t, n) && (e.flags & 128) === 0)
          return kt = !1, nT(
            t,
            e,
            n
          );
        kt = (t.flags & 131072) !== 0;
      }
    else
      kt = !1, gt && (e.flags & 1048576) !== 0 && Hd(e, ml, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          var i = e.pendingProps;
          if (t = wi(e.elementType), e.type = t, typeof t == "function")
            tr(t) ? (i = Yi(t, i), e.tag = 1, e = ty(
              null,
              e,
              t,
              i,
              n
            )) : (e.tag = 0, e = Yr(
              null,
              e,
              t,
              i,
              n
            ));
          else {
            if (t != null) {
              var u = t.$$typeof;
              if (u === j) {
                e.tag = 11, e = Jm(
                  null,
                  e,
                  t,
                  i,
                  n
                );
                break t;
              } else if (u === ft) {
                e.tag = 14, e = Fm(
                  null,
                  e,
                  t,
                  i,
                  n
                );
                break t;
              } else if (u === mt) {
                e.tag = 10, e.type = t, e = ly(
                  null,
                  e,
                  n
                );
                break t;
              }
            }
            throw e = bt(t) || t, Error(r(306, e, ""));
          }
        }
        return e;
      case 0:
        return Yr(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 1:
        return i = e.type, u = Yi(
          i,
          e.pendingProps
        ), ty(
          t,
          e,
          i,
          u,
          n
        );
      case 3:
        t: {
          if (du(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(r(387));
          i = e.pendingProps;
          var s = e.memoizedState;
          u = s.element, dr(t, e), El(e, i, null, n);
          var f = e.memoizedState;
          if (i = f.cache, $n(e, Ft, i), i !== s.cache && sr(
            e,
            [Ft],
            n,
            !0
          ), bl(), i = f.element, s.isDehydrated)
            if (s = {
              element: i,
              isDehydrated: !1,
              cache: f.cache
            }, e.updateQueue.baseState = s, e.memoizedState = s, e.flags & 256) {
              e = ey(
                t,
                e,
                i,
                n
              );
              break t;
            } else if (i !== u) {
              u = Ze(
                Error(r(424)),
                e
              ), yl(u), e = ey(
                t,
                e,
                i,
                n
              );
              break t;
            } else
              for (t = e.stateNode.containerInfo, t.nodeType === 9 ? t = t.body : t = t.nodeName === "HTML" ? t.ownerDocument.body : t, Lt = ke(t.firstChild), ie = e, gt = !0, kn = null, Fe = !0, n = kd(
                e,
                null,
                i,
                n
              ), e.child = n; n; )
                n.flags = n.flags & -3 | 134221824, n = n.sibling;
          else {
            if (Ri(), i === u) {
              e = Hn(
                t,
                e,
                n
              );
              break t;
            }
            te(t, e, i, n);
          }
          e = e.child;
        }
        return e;
      case 26:
        return Ea(t, e), t === null ? (n = N0(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = n : gt || (e.stateNode = c0(
          e.type,
          e.pendingProps,
          Qn.current,
          e
        )) : e.memoizedState = N0(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return To(e), t === null && gt && (i = e.stateNode = C0(
          e.type,
          e.pendingProps,
          Qn.current
        ), ie = e, Fe = !0, u = Lt, di(e.type) ? (Xc = u, Lt = ke(i.firstChild)) : Lt = u), te(
          t,
          e,
          e.pendingProps.children,
          n
        ), Ea(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && gt && ((u = i = Lt) && (i = kT(
          i,
          e.type,
          e.pendingProps,
          Fe
        ), i !== null ? (e.stateNode = i, ie = e, Lt = ke(i.firstChild), Fe = !1, u = !0) : u = !1), u || Wn(e)), To(e), u = e.type, s = e.pendingProps, f = t !== null ? t.memoizedProps : null, i = s.children, Uc(u, s) ? i = null : f !== null && Uc(u, f) && (e.flags |= 32), e.memoizedState !== null && (u = br(
          t,
          e,
          ZS,
          null,
          null,
          n
        ), Ya._currentValue = u), Ea(t, e), te(t, e, i, n), e.child;
      case 6:
        return t === null && gt && ((t = n = Lt) && (n = WT(
          n,
          e.pendingProps,
          Fe
        ), n !== null ? (e.stateNode = n, ie = e, Lt = null, t = !0) : t = !1), t || Wn(e)), null;
      case 13:
        return ny(t, e, n);
      case 4:
        return du(
          e,
          e.stateNode.containerInfo
        ), i = e.pendingProps, t === null ? e.child = Li(
          e,
          null,
          i,
          n
        ) : te(t, e, i, n), e.child;
      case 11:
        return Jm(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 7:
        return i = e.pendingProps, Ea(t, e), te(t, e, i, n), e.child;
      case 8:
        return te(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 12:
        return te(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 10:
        return ly(t, e, n);
      case 9:
        return u = e.type._context, i = e.pendingProps.children, _i(e), u = oe(u), i = i(u), e.flags |= 1, te(t, e, i, n), e.child;
      case 14:
        return Fm(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 15:
        return Pm(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 19:
        return Kr(t, e, n);
      case 31:
        return tT(t, e, n);
      case 22:
        return km(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        return _i(e), i = oe(Ft), t === null ? (u = cr(), u === null && (u = Bt, s = or(), u.pooledCache = s, s.refCount++, s !== null && (u.pooledCacheLanes |= n), u = s), e.memoizedState = { parent: i, cache: u }, hr(e), $n(e, Ft, u)) : ((t.lanes & n) !== 0 && (dr(t, e), El(e, null, null, n), bl()), u = t.memoizedState, s = e.memoizedState, u.parent !== i ? (u = { parent: i, cache: i }, e.memoizedState = u, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = u), $n(e, Ft, i)) : (i = s.cache, $n(e, Ft, i), i !== u.cache && sr(
          e,
          [Ft],
          n,
          !0
        ))), te(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 30:
        return e.stateNode === null && (e.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), i = e.pendingProps, i.name != null && i.name !== "auto" ? e.flags |= t === null ? 18882560 : 18874368 : gt && Hu(e), t !== null && t.memoizedProps.name !== i.name ? e.flags |= 4194816 : Ea(t, e), te(t, e, i.children, n), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(r(156, e.tag));
  }
  function Ln(t) {
    t.flags |= 4;
  }
  function Fr(t, e, n, i, u) {
    var s;
    if ((s = (t.mode & 32) !== 0) && (s = n === null ? B0(e, i) : B0(e, i) && (i.src !== n.src || i.srcSet !== n.srcSet)), s) {
      if (t.flags |= 16777216, (u & 335544128) === u)
        if (t.stateNode.complete) t.flags |= 8192;
        else if (Gy()) t.flags |= 8192;
        else
          throw Hi = Qu, fr;
    } else t.flags &= -16777217;
  }
  function sy(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !w0(e))
      if (Gy()) t.flags |= 8192;
      else
        throw Hi = Qu, fr;
  }
  function rs(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Bh() : 536870912, t.lanes |= e, Ca |= e);
  }
  function Ol(t, e) {
    if (!gt)
      switch (t.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var n = t.tail, i = null; n !== null; )
            n.alternate !== null && (i = n), n = n.sibling;
          i === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : i.sibling = null;
          break;
        default:
          for (e = t.tail, n = null; e !== null; )
            e.alternate !== null && (n = e), e = e.sibling;
          n === null ? t.tail = null : n.sibling = null;
      }
  }
  function jt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, n = 0, i = 0;
    if (e)
      for (var u = t.child; u !== null; )
        n |= u.lanes | u.childLanes, i |= u.subtreeFlags & 1206910976, i |= u.flags & 1206910976, u.return = t, u = u.sibling;
    else
      for (u = t.child; u !== null; )
        n |= u.lanes | u.childLanes, i |= u.subtreeFlags, i |= u.flags, u.return = t, u = u.sibling;
    return t.subtreeFlags |= i, t.childLanes = n, e;
  }
  function iT(t, e, n) {
    var i = e.pendingProps;
    switch (ir(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return jt(e), null;
      case 1:
        return jt(e), null;
      case 3:
        return n = e.stateNode, i = null, t !== null && (i = t.memoizedState.cache), e.memoizedState.cache !== i && (e.flags |= 2048), Un(Ft), Ii(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (t === null || t.child === null) && (ya(e) ? Ln(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, lr())), jt(e), null;
      case 26:
        var u = e.type, s = e.memoizedState;
        return t === null ? (Ln(e), s !== null ? (jt(e), sy(e, s)) : (jt(e), Fr(
          e,
          u,
          null,
          i,
          n
        ))) : s ? s !== t.memoizedState ? (Ln(e), jt(e), sy(e, s)) : (jt(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== i && Ln(e), jt(e), Fr(
          e,
          u,
          t,
          i,
          n
        )), null;
      case 27:
        if (mu(e), n = Qn.current, u = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== i && Ln(e);
        else {
          if (!i) {
            if (e.stateNode === null)
              throw Error(r(166));
            return jt(e), e.subtreeFlags &= -33554433, null;
          }
          t = cn.current, ya(e) ? jd(e) : (t = C0(u, i, n), e.stateNode = t, Ln(e));
        }
        return jt(e), e.subtreeFlags &= -33554433, null;
      case 5:
        if (mu(e), u = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== i && Ln(e);
        else {
          if (!i) {
            if (e.stateNode === null)
              throw Error(r(166));
            return jt(e), e.subtreeFlags &= -33554433, null;
          }
          if (s = cn.current, ya(e))
            jd(e);
          else {
            var f = jl(
              Qn.current
            );
            switch (s) {
              case 1:
                s = f.createElementNS(
                  "http://www.w3.org/2000/svg",
                  u
                );
                break;
              case 2:
                s = f.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  u
                );
                break;
              default:
                switch (u) {
                  case "svg":
                    s = f.createElementNS(
                      "http://www.w3.org/2000/svg",
                      u
                    );
                    break;
                  case "math":
                    s = f.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      u
                    );
                    break;
                  case "script":
                    s = f.createElement("div"), s.innerHTML = "<script><\/script>", s = s.removeChild(
                      s.firstChild
                    );
                    break;
                  case "select":
                    s = typeof i.is == "string" ? f.createElement("select", {
                      is: i.is
                    }) : f.createElement("select"), i.multiple ? s.multiple = !0 : i.size && (s.size = i.size);
                    break;
                  default:
                    s = typeof i.is == "string" ? f.createElement(u, { is: i.is }) : f.createElement(u);
                }
            }
            s[se] = e, s[Ee] = i;
            t: for (f = e.child; f !== null; ) {
              if (f.tag === 5 || f.tag === 6)
                s.appendChild(f.stateNode);
              else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
                f.child.return = f, f = f.child;
                continue;
              }
              if (f === e) break t;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === e)
                  break t;
                f = f.return;
              }
              f.sibling.return = f.return, f = f.sibling;
            }
            e.stateNode = s;
            t: switch (he(s, u, i), u) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                i = !!i.autoFocus;
                break t;
              case "img":
                i = !0;
                break t;
              default:
                i = !1;
            }
            i && Ln(e);
          }
        }
        return jt(e), e.subtreeFlags &= -33554433, Fr(
          e,
          e.type,
          t === null ? null : t.memoizedProps,
          e.pendingProps,
          n
        ), null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== i && Ln(e);
        else {
          if (typeof i != "string" && e.stateNode === null)
            throw Error(r(166));
          if (t = Qn.current, ya(e)) {
            if (t = e.stateNode, n = e.memoizedProps, i = null, u = ie, u !== null)
              switch (u.tag) {
                case 27:
                case 5:
                  i = u.memoizedProps;
              }
            t[se] = e, t = !!(t.nodeValue === n || i !== null && i.suppressHydrationWarning === !0 || u0(t.nodeValue, n)), t || Wn(e, !0);
          } else
            t = jl(t).createTextNode(
              i
            ), t[se] = e, e.stateNode = t;
        }
        return jt(e), null;
      case 31:
        if (n = e.memoizedState, t === null || t.memoizedState !== null) {
          if (i = ya(e), n !== null) {
            if (t === null) {
              if (!i) throw Error(r(318));
              if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(r(557));
              t[se] = e;
            } else
              Ri(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            jt(e), t = !1;
          } else
            n = lr(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), t = !0;
          if (!t)
            return e.flags & 256 ? (Be(e), e) : (Be(e), null);
          if ((e.flags & 128) !== 0)
            throw Error(r(558));
        }
        return jt(e), null;
      case 13:
        if (i = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (u = ya(e), i !== null && i.dehydrated !== null) {
            if (t === null) {
              if (!u) throw Error(r(318));
              if (u = e.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(r(317));
              u[se] = e;
            } else
              Ri(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            jt(e), u = !1;
          } else
            u = lr(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = u), u = !0;
          if (!u)
            return e.flags & 256 ? (Be(e), e) : (Be(e), null);
        }
        return Be(e), (e.flags & 128) !== 0 ? (e.lanes = n, e) : (n = i !== null, t = t !== null && t.memoizedState !== null, n && (i = e.child, u = null, i.alternate !== null && i.alternate.memoizedState !== null && i.alternate.memoizedState.cachePool !== null && (u = i.alternate.memoizedState.cachePool.pool), s = null, i.memoizedState !== null && i.memoizedState.cachePool !== null && (s = i.memoizedState.cachePool.pool), s !== u && (i.flags |= 2048)), n !== t && n && (e.child.flags |= 8192), rs(e, e.updateQueue), jt(e), null);
      case 4:
        return Ii(), t === null && zc(e.stateNode.containerInfo), e.flags |= 67108864, jt(e), null;
      case 10:
        return Un(e.type), jt(e), null;
      case 19:
        if (Sr(e), i = e.memoizedState, i === null) return jt(e), null;
        if (u = (e.flags & 128) !== 0, s = i.rendering, s === null)
          if (u) Ol(i, !1);
          else {
            if (Qt !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = e.child; t !== null; ) {
                if (s = Fu(t), s !== null) {
                  for (e.flags |= 128, Ol(i, !1), t = s.updateQueue, e.updateQueue = t, rs(e, t), e.subtreeFlags = 0, t = n, n = e.child; n !== null; )
                    Ud(n, t), n = n.sibling;
                  return Al(
                    e,
                    ce.current & 1 | 2
                  ), gt && Vn(e, i.treeForkCount), e.child;
                }
                t = t.sibling;
              }
            i.tail !== null && Re() > bs && (e.flags |= 128, u = !0, Ol(i, !1), e.lanes = 4194304);
          }
        else {
          if (!u)
            if (t = Fu(s), t !== null) {
              if (e.flags |= 128, u = !0, t = t.updateQueue, e.updateQueue = t, rs(e, t), Ol(i, !0), i.tail === null && i.tailMode !== "collapsed" && i.tailMode !== "visible" && !s.alternate && !gt)
                return jt(e), null;
            } else
              2 * Re() - i.renderingStartTime > bs && n !== 536870912 && (e.flags |= 128, u = !0, Ol(i, !1), e.lanes = 4194304);
          i.isBackwards ? (s.sibling = e.child, e.child = s) : (t = i.last, t !== null ? t.sibling = s : e.child = s, i.last = s);
        }
        if (i.tail !== null) {
          t = i.tail;
          t: {
            for (n = t; n !== null; ) {
              if (n.alternate !== null) {
                n = !1;
                break t;
              }
              n = n.sibling;
            }
            n = !0;
          }
          return i.rendering = t, i.tail = t.sibling, i.renderingStartTime = Re(), t.sibling = null, s = ce.current, s = u ? s & 1 | 2 : s & 1, i.tailMode === "visible" || i.tailMode === "collapsed" || !n || gt ? Al(e, s) : (n = s, Ht(re, e), Ht(ce, n), ye === null && (ye = e)), gt && Vn(e, i.treeForkCount), t;
        }
        return jt(e), null;
      case 22:
      case 23:
        return Be(e), pr(), i = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== i && (e.flags |= 8192) : i && (e.flags |= 8192), i ? (n & 536870912) !== 0 && (e.flags & 128) === 0 && (jt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : jt(e), n = e.updateQueue, n !== null && rs(e, n.retryQueue), n = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), i = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (i = e.memoizedState.cachePool.pool), i !== n && (e.flags |= 2048), t !== null && Gt(Bi), null;
      case 24:
        return n = null, t !== null && (n = t.memoizedState.cache), e.memoizedState.cache !== n && (e.flags |= 2048), Un(Ft), jt(e), null;
      case 25:
        return null;
      case 30:
        return e.flags |= 33554432, jt(e), null;
    }
    throw Error(r(156, e.tag));
  }
  function aT(t, e) {
    switch (ir(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return Un(Ft), Ii(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return mu(e), null;
      case 31:
        if (e.memoizedState !== null) {
          if (Be(e), e.alternate === null)
            throw Error(r(340));
          Ri();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 13:
        if (Be(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(r(340));
          Ri();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return Sr(e), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, t = e.memoizedState, t !== null && (t.rendering = null, t.tail = null), e.flags |= 4, e) : null;
      case 4:
        return Ii(), null;
      case 10:
        return Un(e.type), null;
      case 22:
      case 23:
        return Be(e), pr(), t !== null && Gt(Bi), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return Un(Ft), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function oy(t, e) {
    switch (ir(e), e.tag) {
      case 3:
        Un(Ft), Ii();
        break;
      case 26:
      case 27:
      case 5:
        mu(e);
        break;
      case 4:
        Ii();
        break;
      case 31:
        e.memoizedState !== null && Be(e);
        break;
      case 13:
        Be(e);
        break;
      case 19:
        Sr(e);
        break;
      case 10:
        Un(e.type);
        break;
      case 22:
      case 23:
        Be(e), pr(), t !== null && Gt(Bi);
        break;
      case 24:
        Un(Ft);
    }
  }
  function zl(t, e) {
    try {
      var n = e.updateQueue, i = n !== null ? n.lastEffect : null;
      if (i !== null) {
        var u = i.next;
        n = u;
        do {
          if ((n.tag & t) === t) {
            i = void 0;
            var s = n.create, f = n.inst;
            i = s(), f.destroy = i;
          }
          n = n.next;
        } while (n !== u);
      }
    } catch (m) {
      Rt(e, e.return, m);
    }
  }
  function ui(t, e, n) {
    try {
      var i = e.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next;
        i = s;
        do {
          if ((i.tag & t) === t) {
            var f = i.inst, m = f.destroy;
            if (m !== void 0) {
              f.destroy = void 0, u = e;
              var T = n, x = m;
              try {
                x();
              } catch (z) {
                Rt(
                  u,
                  T,
                  z
                );
              }
            }
          }
          i = i.next;
        } while (i !== s);
      }
    } catch (z) {
      Rt(e, e.return, z);
    }
  }
  function ry(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var n = t.stateNode;
      try {
        $d(e, n);
      } catch (i) {
        Rt(t, t.return, i);
      }
    }
  }
  function cy(t, e, n) {
    n.props = Yi(
      t.type,
      t.memoizedProps
    ), n.state = t.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (i) {
      Rt(t, e, i);
    }
  }
  function mn(t, e) {
    try {
      var n = t.ref;
      if (n !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var i = t.stateNode;
            break;
          case 30:
            var u = t.stateNode, s = zn(t.memoizedProps, u);
            (u.ref === null || u.ref.name !== s) && (u.ref = p0(s)), i = u.ref;
            break;
          case 7:
            if (t.stateNode === null) {
              var f = new Ye(t);
              g(
                t.child,
                !1,
                FT,
                f,
                void 0,
                void 0
              ), t.stateNode = f;
            }
            i = t.stateNode;
            break;
          default:
            i = t.stateNode;
        }
        typeof n == "function" ? t.refCleanup = n(i) : n.current = i;
      }
    } catch (m) {
      Rt(t, e, m);
    }
  }
  function fe(t, e) {
    var n = t.ref, i = t.refCleanup;
    if (n !== null)
      if (typeof i == "function")
        try {
          i();
        } catch (u) {
          Rt(t, e, u);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (u) {
          Rt(t, e, u);
        }
      else n.current = null;
  }
  function cs(t, e) {
    if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && t.alternate === null && e !== null)
      for (var n = 0; n < e.length; n++)
        A0(
          t.stateNode,
          e[n]
        );
  }
  function fy(t) {
    for (var e = t.return; e !== null && (kr(e) && A0(t.stateNode, e.stateNode), !Pr(e)); )
      e = e.return;
  }
  function Rl(t) {
    for (var e = t.return; e !== null && (kr(e) && PT(t.stateNode, e.stateNode), !Pr(e)); )
      e = e.return;
  }
  function Pr(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 27;
  }
  function kr(t) {
    return t && t.tag === 7 && t.stateNode !== null;
  }
  function Wr(t) {
    var e = t.type, n = t.memoizedProps, i = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && i.focus();
          break t;
        case "img":
          n.src ? i.src = n.src : n.srcSet && (i.srcset = n.srcSet);
      }
    } catch (u) {
      Rt(t, t.return, u);
    }
  }
  function $r(t, e, n) {
    try {
      var i = t.stateNode;
      RT(i, t.type, n, e), i[Ee] = e;
    } catch (u) {
      Rt(t, t.return, u);
    }
  }
  function hy(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && di(t.type) || t.tag === 4;
  }
  function Ir(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || hy(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && di(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function tc(t, e, n, i) {
    var u = t.tag;
    if (u === 5 || u === 6)
      u = t.stateNode, e ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(u, e) : (e = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, e.appendChild(u), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = fn)), cs(t, i), Mt = !0;
    else if (u !== 4 && (u === 27 && (cs(t, i), i = null, di(t.type) && (n = t.stateNode, e = null)), t = t.child, t !== null))
      for (tc(
        t,
        e,
        n,
        i
      ), t = t.sibling; t !== null; )
        tc(
          t,
          e,
          n,
          i
        ), t = t.sibling;
  }
  function fs(t, e, n, i) {
    var u = t.tag;
    if (u === 5 || u === 6)
      u = t.stateNode, e ? n.insertBefore(u, e) : n.appendChild(u), cs(t, i), Mt = !0;
    else if (u !== 4 && (u === 27 && (cs(t, i), i = null, di(t.type) && (n = t.stateNode)), t = t.child, t !== null))
      for (fs(
        t,
        e,
        n,
        i
      ), t = t.sibling; t !== null; )
        fs(
          t,
          e,
          n,
          i
        ), t = t.sibling;
  }
  function dy(t) {
    var e = t.stateNode, n = t.memoizedProps;
    try {
      for (var i = t.type, u = e.attributes; u.length; )
        e.removeAttributeNode(u[0]);
      he(e, i, n), e[se] = t, e[Ee] = n;
    } catch (s) {
      Rt(t, t.return, s);
    }
  }
  var hs = !1, we = null;
  function my(t) {
    (t.tag === 30 || (t.subtreeFlags & 33554432) !== 0) && (hs = !0);
  }
  var yn = null;
  function yy() {
    var t = yn;
    return yn = null, t;
  }
  var Me = 0;
  function Aa(t, e, n, i, u) {
    return Me = 0, gy(
      t.child,
      e,
      n,
      i,
      u
    );
  }
  function gy(t, e, n, i, u) {
    for (var s = !1; t !== null; ) {
      if (t.tag === 5) {
        var f = t.stateNode;
        if (i !== null) {
          var m = Hc(f);
          i.push(m), m.view && (s = !0);
        } else
          s || Hc(f).view && (s = !0);
        hs = !0, y0(
          f,
          Me === 0 ? e : e + "_" + Me,
          n
        ), Me++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && u || gy(
        t.child,
        e,
        n,
        i,
        u
      ) && (s = !0));
      t = t.sibling;
    }
    return s;
  }
  function gn(t, e) {
    for (; t !== null; )
      t.tag === 5 ? g0(t.stateNode, t.memoizedProps) : (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && e || gn(
        t.child,
        e
      )), t = t.sibling;
  }
  function ds(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if ((t.tag !== 22 || t.memoizedState === null) && (ds(t), t.tag === 30 && (t.flags & 18874368) !== 0 && t.stateNode.paired)) {
          var e = t.memoizedProps;
          if (e.name == null || e.name === "auto")
            throw Error(r(544));
          var n = e.name;
          e = Rn(e.default, e.share), e !== "none" && (Aa(
            t,
            n,
            e,
            null,
            !1
          ) || gn(t.child, !1));
        }
        t = t.sibling;
      }
  }
  function ec(t, e) {
    if (t.tag === 30) {
      var n = t.stateNode, i = t.memoizedProps, u = zn(i, n), s = Rn(
        i.default,
        n.paired ? i.share : i.enter
      );
      s !== "none" ? Aa(t, u, s, null, !1) ? (ds(t), n.paired || e || Na(t, i.onEnter)) : gn(t.child, !1) : ds(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        ec(t, e), t = t.sibling;
    else ds(t);
  }
  function nc(t) {
    if (we !== null && we.size !== 0) {
      var e = we;
      if ((t.subtreeFlags & 18874368) !== 0)
        for (t = t.child; t !== null; ) {
          if (t.tag !== 22 || t.memoizedState === null) {
            if (t.tag === 30 && (t.flags & 18874368) !== 0) {
              var n = t.memoizedProps, i = n.name;
              if (i != null && i !== "auto") {
                var u = e.get(i);
                if (u !== void 0) {
                  var s = Rn(
                    n.default,
                    n.share
                  );
                  if (s !== "none" && (Aa(
                    t,
                    i,
                    s,
                    null,
                    !1
                  ) ? (s = t.stateNode, u.paired = s, s.paired = u, Na(t, n.onShare)) : gn(t.child, !1)), e.delete(i), e.size === 0) break;
                }
              }
            }
            nc(t);
          }
          t = t.sibling;
        }
    }
  }
  function ic(t) {
    if (t.tag === 30) {
      var e = t.memoizedProps, n = zn(e, t.stateNode), i = we !== null ? we.get(n) : void 0, u = Rn(
        e.default,
        i !== void 0 ? e.share : e.exit
      );
      u !== "none" && (Aa(t, n, u, null, !1) ? i !== void 0 ? (u = t.stateNode, i.paired = u, u.paired = i, we.delete(n), Na(t, e.onShare)) : Na(t, e.onExit) : gn(t.child, !1)), we !== null && nc(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        ic(t), t = t.sibling;
    else
      we !== null && nc(t);
  }
  function py(t) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var e = t.memoizedProps, n = zn(e, t.stateNode);
        e = Rn(e.default, e.update), t.flags &= -5, e !== "none" && Aa(
          t,
          n,
          e,
          t.memoizedState = [],
          !1
        );
      } else
        (t.subtreeFlags & 33554432) !== 0 && py(t);
      t = t.sibling;
    }
  }
  function ac(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if (t.tag !== 22 || t.memoizedState === null) {
          if (t.tag === 30 && (t.flags & 18874368) !== 0) {
            var e = t.stateNode;
            e.paired !== null && (e.paired = null, gn(t.child, !1));
          }
          ac(t);
        }
        t = t.sibling;
      }
  }
  function ms(t) {
    if (t.tag === 30)
      t.stateNode.paired = null, gn(t.child, !1), ac(t);
    else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        ms(t), t = t.sibling;
    else ac(t);
  }
  function vy(t) {
    for (t = t.child; t !== null; )
      t.tag === 30 ? gn(t.child, !1) : (t.subtreeFlags & 33554432) !== 0 && vy(t), t = t.sibling;
  }
  function lc(t, e, n, i, u, s, f) {
    for (var m = !1; e !== null; ) {
      if (e.tag === 5) {
        var T = e.stateNode;
        if (s !== null && Me < s.length) {
          var x = s[Me], z = Hc(T);
          (x.view || z.view) && (m = !0);
          var _;
          if (_ = (t.flags & 4) === 0)
            if (z.clip) _ = !0;
            else {
              _ = x.rect;
              var M = z.rect;
              _ = _.y !== M.y || _.x !== M.x || _.height !== M.height || _.width !== M.width;
            }
          _ && (t.flags |= 4), z.abs ? z = !x.abs : (x = x.rect, z = z.rect, z = x.height !== z.height || x.width !== z.width), z && (t.flags |= 32);
        } else t.flags |= 32;
        (t.flags & 4) !== 0 && y0(
          T,
          Me === 0 ? n : n + "_" + Me,
          u
        ), m && (t.flags & 4) !== 0 || (yn === null && (yn = []), yn.push(
          T,
          Me === 0 ? i : i + "_" + Me,
          e.memoizedProps
        )), Me++;
      } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && f ? t.flags |= e.flags & 32 : lc(
        t,
        e.child,
        n,
        i,
        u,
        s,
        f
      ) && (m = !0));
      e = e.sibling;
    }
    return m;
  }
  function Sy(t, e) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var n = t.memoizedProps, i = t.stateNode, u = zn(n, i), s = Rn(n.default, n.update), f;
        f = t.memoizedState, t.memoizedState = null, i = t;
        var m = t.child;
        Me = 0, u = lc(
          i,
          m,
          u,
          u,
          s,
          f,
          !1
        ), (t.flags & 4) !== 0 && u && Na(t, n.onUpdate);
      } else
        (t.subtreeFlags & 33554432) !== 0 && Sy(t);
      t = t.sibling;
    }
  }
  var ae = !1, Ct = !1, pn = !1, uc = !1, Ty = typeof WeakSet == "function" ? WeakSet : Set, le = null, vn = !1, Nl = !1, ys = !1, sc = !1;
  function lT(t, e, n) {
    if (t = t.containerInfo, Vc = Ga, t = Md(t), Jo(t)) {
      if ("selectionStart" in t)
        var i = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          i = (i = t.ownerDocument) && i.defaultView || window;
          var u = i.getSelection && i.getSelection();
          if (u && u.rangeCount !== 0) {
            i = u.anchorNode;
            var s = u.anchorOffset, f = u.focusNode;
            u = u.focusOffset;
            try {
              i.nodeType, f.nodeType;
            } catch {
              i = null;
              break t;
            }
            var m = 0, T = -1, x = -1, z = 0, _ = 0, M = t, O = null;
            e: for (; ; ) {
              for (var Q; M !== i || s !== 0 && M.nodeType !== 3 || (T = m + s), M !== f || u !== 0 && M.nodeType !== 3 || (x = m + u), M.nodeType === 3 && (m += M.nodeValue.length), (Q = M.firstChild) !== null; )
                O = M, M = Q;
              for (; ; ) {
                if (M === t) break e;
                if (O === i && ++z === s && (T = m), O === f && ++_ === u && (x = m), (Q = M.nextSibling) !== null) break;
                M = O, O = M.parentNode;
              }
              M = Q;
            }
            i = T === -1 || x === -1 ? null : { start: T, end: x };
          } else i = null;
        }
      i = i || { start: 0, end: 0 };
    } else i = null;
    for (_c = { focusedElem: t, selectionRange: i }, Ga = !1, n = (n & 335544064) === n, le = e, e = n ? 9270 : 1024; le !== null; ) {
      if (t = le, n && (i = t.deletions, i !== null))
        for (s = 0; s < i.length; s++)
          n && ic(i[s]);
      if (t.alternate === null && (t.flags & 2) !== 0)
        n && my(t), gs(n);
      else {
        if (t.tag === 22) {
          if (i = t.alternate, t.memoizedState !== null) {
            i !== null && i.memoizedState === null && n && ic(i), gs(n);
            continue;
          } else if (i !== null && i.memoizedState !== null) {
            n && my(t), gs(n);
            continue;
          }
        }
        i = t.child, (t.subtreeFlags & e) !== 0 && i !== null ? (i.return = t, le = i) : (n && py(t), gs(n));
      }
    }
    we = null;
  }
  function gs(t) {
    for (; le !== null; ) {
      var e = le, n = t, i = e.alternate, u = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((u & 1024) !== 0 && i !== null) {
            n = void 0, u = i.memoizedProps, i = i.memoizedState;
            var s = e.stateNode;
            try {
              var f = Yi(
                e.type,
                u
              );
              n = s.getSnapshotBeforeUpdate(
                f,
                i
              ), s.__reactInternalSnapshotBeforeUpdate = n;
            } catch (m) {
              Rt(e, e.return, m);
            }
          }
          break;
        case 3:
          if ((u & 1024) !== 0) {
            if (i = e.stateNode.containerInfo, n = i.nodeType, n === 9)
              Yc(i);
            else if (n === 1)
              switch (i.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Yc(i);
                  break;
                default:
                  i.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          n && i !== null && (n = zn(
            i.memoizedProps,
            i.stateNode
          ), u = e.memoizedProps, u = Rn(u.default, u.update), u !== "none" && Aa(
            i,
            n,
            u,
            i.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((u & 1024) !== 0) throw Error(r(163));
      }
      if (i = e.sibling, i !== null) {
        i.return = e.return, le = i;
        break;
      }
      le = e.return;
    }
  }
  function by(t, e, n) {
    var i = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        Sn(t, n), i & 4 && zl(5, n);
        break;
      case 1:
        if (Sn(t, n), i & 4)
          if (t = n.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (f) {
              Rt(n, n.return, f);
            }
          else {
            var u = Yi(
              n.type,
              e.memoizedProps
            );
            e = e.memoizedState;
            try {
              t.componentDidUpdate(
                u,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (f) {
              Rt(
                n,
                n.return,
                f
              );
            }
          }
        i & 64 && ry(n), i & 512 && mn(n, n.return);
        break;
      case 3:
        if (Sn(t, n), i & 64 && (t = n.updateQueue, t !== null)) {
          if (e = null, n.child !== null)
            switch (n.child.tag) {
              case 27:
              case 5:
                e = n.child.stateNode;
                break;
              case 1:
                e = n.child.stateNode;
            }
          try {
            $d(t, e);
          } catch (f) {
            Rt(n, n.return, f);
          }
        }
        break;
      case 27:
        e === null && i & 4 && dy(n);
      case 26:
      case 5:
        Sn(t, n), e === null && i & 4 && Wr(n), i & 512 && mn(n, n.return);
        break;
      case 12:
        Sn(t, n);
        break;
      case 31:
        Sn(t, n), i & 4 && Dy(t, n);
        break;
      case 13:
        Sn(t, n), i & 4 && xy(t, n), i & 64 && (t = n.memoizedState, t !== null && (t = t.dehydrated, t !== null && (n = pT.bind(
          null,
          n
        ), $T(t, n))));
        break;
      case 22:
        if (i = n.memoizedState !== null || ae, !i) {
          var s = e !== null && e.memoizedState !== null || Ct;
          e = ae, u = Ct, ae = i, (Ct = s) && !u ? (i = 2, (n.subtreeFlags & 8772) !== 0 && (i |= 1), an(
            t,
            n,
            i
          )) : Sn(t, n), ae = e, Ct = u;
        }
        break;
      case 30:
        Sn(t, n), i & 512 && mn(n, n.return);
        break;
      case 7:
        i & 512 && mn(n, n.return);
      default:
        Sn(t, n);
    }
  }
  function oc(t, e) {
    for (t = t.child; t !== null; )
      Ey(t, e), t = t.sibling;
  }
  function Ey(t, e) {
    switch (t.tag) {
      case 5:
      case 26:
        try {
          var n = t.stateNode;
          if (e) {
            var i = n.style;
            typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none";
          } else {
            var u = t.stateNode, s = t.memoizedProps.style, f = s != null && s.hasOwnProperty("display") ? s.display : null;
            u.style.display = f == null || typeof f == "boolean" ? "" : ("" + f).trim();
          }
        } catch (T) {
          Rt(t, t.return, T);
        }
        rc(t, e);
        break;
      case 6:
        try {
          t.stateNode.nodeValue = e ? "" : t.memoizedProps, Mt = !0;
        } catch (T) {
          Rt(t, t.return, T);
        }
        break;
      case 18:
        try {
          var m = t.stateNode;
          e ? m0(m, !0) : m0(t.stateNode, !1);
        } catch (T) {
          Rt(t, t.return, T);
        }
        break;
      case 22:
      case 23:
        t.memoizedState === null && oc(t, e);
        break;
      default:
        oc(t, e);
    }
  }
  function rc(t, e) {
    if (t.subtreeFlags & 67108864)
      for (t = t.child; t !== null; ) {
        t: {
          var n = t, i = e;
          switch (n.tag) {
            case 4:
              Ey(n, i);
              break t;
            case 22:
              n.memoizedState === null && rc(n, i);
              break t;
            default:
              rc(n, i);
          }
        }
        t = t.sibling;
      }
  }
  function Ay(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, Ay(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && bu(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var Yt = null, De = !1;
  function en(t, e, n) {
    for (n = n.child; n !== null; )
      My(t, e, n), n = n.sibling;
  }
  function My(t, e, n) {
    if (Ne && typeof Ne.onCommitFiberUnmount == "function")
      try {
        Ne.onCommitFiberUnmount(tl, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        Ct || fe(n, e), en(
          t,
          e,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !Ct && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        Ct || fe(n, e), Rl(n);
        var i = Yt, u = De;
        di(n.type) && (Yt = n.stateNode, De = !1), en(
          t,
          e,
          n
        ), O0(
          n.stateNode,
          n.type,
          n.memoizedProps
        ), Yt = i, De = u;
        break;
      case 5:
        Ct || fe(n, e), Rl(n);
      case 6:
        if (n.tag === 6 && Rl(n), i = Yt, u = De, Yt = null, en(
          t,
          e,
          n
        ), Yt = i, De = u, Yt !== null)
          if (De)
            try {
              (Yt.nodeType === 9 ? Yt.body : Yt.nodeName === "HTML" ? Yt.ownerDocument.body : Yt).removeChild(n.stateNode), Mt = !0;
            } catch (s) {
              Rt(
                n,
                e,
                s
              );
            }
          else
            try {
              Yt.removeChild(n.stateNode), Mt = !0;
            } catch (s) {
              Rt(
                n,
                e,
                s
              );
            }
        break;
      case 18:
        Yt !== null && (De ? (t = Yt, d0(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          n.stateNode
        ), qa(t)) : d0(Yt, n.stateNode));
        break;
      case 4:
        i = Yt, u = De, Yt = n.stateNode.containerInfo, De = !0, en(
          t,
          e,
          n
        ), Yt = i, De = u;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ui(2, n, e), Ct || ui(4, n, e), en(
          t,
          e,
          n
        );
        break;
      case 1:
        Ct || (fe(n, e), i = n.stateNode, typeof i.componentWillUnmount == "function" && cy(
          n,
          e,
          i
        )), en(
          t,
          e,
          n
        );
        break;
      case 21:
        en(
          t,
          e,
          n
        );
        break;
      case 22:
        Ct = (i = Ct) || n.memoizedState !== null, en(
          t,
          e,
          n
        ), Ct = i;
        break;
      case 30:
        fe(n, e), en(
          t,
          e,
          n
        );
        break;
      case 7:
        Ct || fe(n, e), en(
          t,
          e,
          n
        );
        break;
      default:
        en(
          t,
          e,
          n
        );
    }
  }
  function Dy(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
      t = t.dehydrated;
      try {
        qa(t);
      } catch (n) {
        Rt(e, e.return, n);
      }
    }
  }
  function xy(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        qa(t);
      } catch (n) {
        Rt(e, e.return, n);
      }
  }
  function uT(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new Ty()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new Ty()), e;
      default:
        throw Error(r(435, t.tag));
    }
  }
  function ps(t, e) {
    var n = uT(t);
    e.forEach(function(i) {
      if (!n.has(i)) {
        n.add(i);
        var u = vT.bind(null, t, i);
        i.then(u, u);
      }
    });
  }
  function ve(t, e, n) {
    var i = e.deletions;
    if (i !== null)
      for (var u = 0; u < i.length; u++) {
        var s = i[u], f = t, m = e, T = m;
        t: for (; T !== null; ) {
          switch (T.tag) {
            case 27:
              if (di(T.type)) {
                Yt = T.stateNode, De = !1;
                break t;
              }
              break;
            case 5:
              Yt = T.stateNode, De = !1;
              break t;
            case 3:
            case 4:
              Yt = T.stateNode.containerInfo, De = !0;
              break t;
          }
          T = T.return;
        }
        if (Yt === null) throw Error(r(160));
        My(f, m, s), Yt = null, De = !1, f = s.alternate, f !== null && (f.return = null), s.return = null;
      }
    if (e.subtreeFlags & 13886)
      for (e = e.child; e !== null; )
        Cy(e, t, n), e = e.sibling;
  }
  var nn = null;
  function Cy(t, e, n) {
    var i = t.alternate, u = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (u & 4 && (i = t.updateQueue, i = i !== null ? i.events : null, i !== null))
          for (var s = 0; s < i.length; s++) {
            var f = i[s];
            f.ref.impl = f.nextImpl;
          }
        ve(e, t, n), Se(t), u & 4 && (ui(3, t, t.return), zl(3, t), ui(5, t, t.return));
        break;
      case 1:
        ve(e, t, n), Se(t), u & 512 && (Ct || i === null || fe(i, i.return)), u & 64 && ae && (t = t.updateQueue, t !== null && (e = t.callbacks, e !== null && (n = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = n === null ? e : n.concat(e))));
        break;
      case 26:
        if (s = nn, ve(e, t, n), Se(t), u & 512 && (Ct || i === null || fe(i, i.return)), u & 4)
          if (u = i !== null ? i.memoizedState : null, n = t.memoizedState, i === null)
            if (n === null)
              if (t.stateNode === null)
                if (ae)
                  t.stateNode = c0(
                    t.type,
                    t.memoizedProps,
                    e.containerInfo,
                    t
                  );
                else {
                  t: {
                    e = t.type, n = t.memoizedProps, u = s.ownerDocument || s;
                    e: switch (e) {
                      case "title":
                        i = u.getElementsByTagName("title")[0], (!i || i[il] || i[se] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = u.createElement(e), u.head.insertBefore(
                          i,
                          u.querySelector("head > title")
                        )), he(i, e, n), i[se] = t, ne(i), e = i;
                        break t;
                      case "link":
                        if (s = U0(
                          "link",
                          "href",
                          u
                        ).get(e + (n.href || ""))) {
                          for (f = 0; f < s.length; f++)
                            if (i = s[f], i.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && i.getAttribute("rel") === (n.rel == null ? null : n.rel) && i.getAttribute("title") === (n.title == null ? null : n.title) && i.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                              s.splice(f, 1);
                              break e;
                            }
                        }
                        i = u.createElement(e), he(i, e, n), u.head.appendChild(i);
                        break;
                      case "meta":
                        if (s = U0(
                          "meta",
                          "content",
                          u
                        ).get(e + (n.content || ""))) {
                          for (f = 0; f < s.length; f++)
                            if (i = s[f], i.getAttribute("content") === (n.content == null ? null : "" + n.content) && i.getAttribute("name") === (n.name == null ? null : n.name) && i.getAttribute("property") === (n.property == null ? null : n.property) && i.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && i.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                              s.splice(f, 1);
                              break e;
                            }
                        }
                        i = u.createElement(e), he(i, e, n), u.head.appendChild(i);
                        break;
                      default:
                        throw Error(r(468, e));
                    }
                    i[se] = t, ne(i), e = i;
                  }
                  t.stateNode = e;
                }
              else
                ae || Jc(s, t.type, t.stateNode);
            else
              t.stateNode = _0(
                s,
                n,
                t.memoizedProps
              );
          else
            u !== n ? (u === null ? (e = i.stateNode, e === null || Ct || e.parentNode.removeChild(e)) : u.count--, n === null ? ae || Jc(s, t.type, t.stateNode) : _0(s, n, t.memoizedProps)) : n === null && t.stateNode !== null && $r(
              t,
              t.memoizedProps,
              i.memoizedProps
            );
        break;
      case 27:
        ve(e, t, n), Se(t), u & 512 && (Ct || i === null || fe(i, i.return)), i !== null && u & 4 && $r(
          t,
          t.memoizedProps,
          i.memoizedProps
        );
        break;
      case 5:
        if (s = pn, pn = !1, ve(e, t, n), pn = s, Se(t), u & 512 && (Ct || i === null || fe(i, i.return)), t.flags & 32) {
          e = t.stateNode;
          try {
            la(e, ""), Mt = !0;
          } catch (z) {
            Rt(t, t.return, z);
          }
        }
        u & 4 && t.stateNode != null && (e = t.memoizedProps, $r(
          t,
          e,
          i !== null ? i.memoizedProps : e
        )), u & 1024 && (uc = !0);
        break;
      case 6:
        if (ve(e, t, n), Se(t), u & 4) {
          if (t.stateNode === null)
            throw Error(r(162));
          e = t.memoizedProps, n = t.stateNode;
          try {
            n.nodeValue = e, Mt = !0;
          } catch (z) {
            Rt(t, t.return, z);
          }
        }
        break;
      case 3:
        if (Mt = !1, Vs = null, s = nn, nn = Yl(e.containerInfo), ve(e, t, n), nn = s, Se(t), u & 4 && i !== null && i.memoizedState.isDehydrated)
          try {
            qa(e.containerInfo);
          } catch (z) {
            Rt(t, t.return, z);
          }
        uc && (uc = !1, Oy(t)), Mt = !1;
        break;
      case 4:
        u = pn, pn = ae, i = Fh(), s = nn, nn = Yl(
          t.stateNode.containerInfo
        ), ve(e, t, n), Se(t), nn = s, Mt && Nl && (ys = !0), Mt = i, pn = u;
        break;
      case 12:
        ve(e, t, n), Se(t);
        break;
      case 31:
        ve(e, t, n), Se(t), u & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ps(t, e)));
        break;
      case 13:
        ve(e, t, n), Se(t), t.child.flags & 8192 && t.memoizedState !== null != (i !== null && i.memoizedState !== null) && (Ts = Re()), u & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ps(t, e)));
        break;
      case 22:
        s = t.memoizedState !== null, f = i !== null && i.memoizedState !== null;
        var m = ae, T = Ct, x = pn;
        ae = m || s, pn = x || s, Ct = T || f, ve(e, t, n), Ct = T, pn = x, ae = m, Se(t), u & 8192 && (e = t.stateNode, e._visibility = s ? e._visibility & -2 : e._visibility | 1, !s || i === null || f || ae || Ct || (e = f || Ct, n = ae, i = Ct, ae = s || ae, Ct = e, si(t, 2), ae = n, Ct = i), !s && pn || oc(t, s)), u & 4 && (e = t.updateQueue, e !== null && (n = e.retryQueue, n !== null && (e.retryQueue = null, ps(t, n))));
        break;
      case 19:
        ve(e, t, n), Se(t), u & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, ps(t, e)));
        break;
      case 30:
        u & 512 && (Ct || i === null || fe(i, i.return)), u = Fh(), s = Nl, f = (n & 335544064) === n, m = t.memoizedProps, Nl = f && Rn(
          m.default,
          m.update
        ) !== "none", ve(e, t, n), Se(t), f && i !== null && Mt && (t.flags |= 4), Nl = s, Mt = u;
        break;
      case 21:
        break;
      case 7:
        u & 512 && (Ct || i === null || fe(i, i.return)), i && i.stateNode !== null && (i.stateNode._fragmentFiber = t);
      default:
        ve(e, t, n), Se(t);
    }
  }
  function Se(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var n, i = t.return; i !== null; ) {
          if (hy(i)) {
            n = i;
            break;
          }
          i = i.return;
        }
        i = null;
        for (var u = t.return; u !== null; ) {
          if (kr(u)) {
            var s = u.stateNode;
            i === null ? i = [s] : i.push(s);
          }
          if (Pr(u)) break;
          u = u.return;
        }
        var f = i;
        if (n == null) throw Error(r(160));
        switch (n.tag) {
          case 27:
            var m = n.stateNode, T = Ir(t);
            fs(
              t,
              T,
              m,
              f
            );
            break;
          case 5:
            var x = n.stateNode;
            n.flags & 32 && (la(x, ""), n.flags &= -33);
            var z = Ir(t);
            fs(
              t,
              z,
              x,
              f
            );
            break;
          case 3:
          case 4:
            var _ = n.stateNode.containerInfo, M = Ir(t);
            tc(
              t,
              M,
              _,
              f
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (O) {
        Rt(t, t.return, O);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Oy(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        Oy(e), e.tag === 5 && e.flags & 1024 && (e = e.stateNode, Ga = !0, e.reset(), Ga = !1), t = t.sibling;
      }
  }
  function Ma(t, e) {
    if (e.subtreeFlags & 9270)
      for (e = e.child; e !== null; )
        zy(e, t), e = e.sibling;
    else Sy(e);
  }
  function zy(t, e) {
    var n = t.alternate;
    if (n === null) ec(t, !1);
    else
      switch (t.tag) {
        case 3:
          if (sc = vn = !1, yy(), Ma(e, t), !vn && !ys) {
            if (t = yn, t !== null)
              for (var i = 0; i < t.length; i += 3) {
                n = t[i];
                var u = t[i + 1];
                g0(n, t[i + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + u + ")"
                  }
                );
              }
            t = e.containerInfo, t = t.nodeType === 9 ? t.documentElement : t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "" && (t.style.viewTransitionName = "none", t.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), t.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), sc = !0;
          }
          yn = null;
          break;
        case 5:
          Ma(e, t);
          break;
        case 4:
          i = vn, vn = !1, Ma(e, t), vn && (ys = !0), vn = i;
          break;
        case 22:
          t.memoizedState === null && (n.memoizedState !== null ? ec(t, !1) : Ma(e, t));
          break;
        case 30:
          i = vn, u = yy(), vn = !1, Ma(e, t), vn && (t.flags |= 4);
          var s = t.memoizedProps, f = t.stateNode;
          e = zn(s, f), f = zn(n.memoizedProps, f);
          var m = Rn(s.default, s.update);
          m === "none" ? e = !1 : (s = n.memoizedState, n.memoizedState = null, n = t.child, Me = 0, e = lc(
            t,
            n,
            e,
            f,
            m,
            s,
            !0
          ), Me !== (s === null ? 0 : s.length) && (t.flags |= 32)), (t.flags & 4) !== 0 && e ? (Na(
            t,
            t.memoizedProps.onUpdate
          ), yn = u) : u !== null && (u.push.apply(u, yn), yn = u), vn = (t.flags & 32) !== 0 ? !0 : i;
          break;
        default:
          Ma(e, t);
      }
  }
  function Sn(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        by(t, e.alternate, e), e = e.sibling;
  }
  function si(t, e) {
    for (t = t.child; t !== null; ) {
      var n = t, i = e;
      switch (n.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ui(4, n, n.return), si(
            n,
            i
          );
          break;
        case 1:
          fe(n, n.return);
          var u = n.stateNode;
          typeof u.componentWillUnmount == "function" && cy(
            n,
            n.return,
            u
          ), si(
            n,
            i
          );
          break;
        case 27:
          (i & 2) !== 0 && O0(
            n.stateNode,
            n.type,
            n.memoizedProps
          );
        case 5:
          fe(n, n.return), n.tag !== 5 && n.tag !== 27 || Rl(n), si(
            n,
            i
          );
          break;
        case 6:
          Rl(n);
          break;
        case 26:
          fe(n, n.return), u = n.stateNode, n.memoizedState !== null || u === null || Ct || u.parentNode.removeChild(u), si(
            n,
            i
          );
          break;
        case 22:
          n.memoizedState === null && si(
            n,
            i
          );
          break;
        case 30:
          fe(n, n.return), si(
            n,
            i
          );
          break;
        case 7:
          fe(n, n.return);
        default:
          si(
            n,
            i
          );
      }
      t = t.sibling;
    }
  }
  function an(t, e, n) {
    for (n = (e.subtreeFlags & 8772) !== 0 ? n : n & -2, e = e.child; e !== null; ) {
      var i = e.alternate, u = t, s = e, f = s.flags, m = (n & 1) !== 0;
      switch (s.tag) {
        case 0:
        case 11:
        case 15:
          an(
            u,
            s,
            n
          ), zl(4, s);
          break;
        case 1:
          if (an(
            u,
            s,
            n
          ), i = s, u = i.stateNode, typeof u.componentDidMount == "function")
            try {
              u.componentDidMount();
            } catch (z) {
              Rt(i, i.return, z);
            }
          if (i = s, u = i.updateQueue, u !== null) {
            var T = i.stateNode;
            try {
              var x = u.shared.hiddenCallbacks;
              if (x !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < x.length; u++)
                  Wd(x[u], T);
            } catch (z) {
              Rt(i, i.return, z);
            }
          }
          m && f & 64 && ry(s), mn(s, s.return);
          break;
        case 27:
          (n & 2) !== 0 && dy(s);
        case 5:
          s.tag !== 5 && s.tag !== 27 || fy(s), an(
            u,
            s,
            n
          ), m && i === null && f & 4 && Wr(s), mn(s, s.return);
          break;
        case 6:
          fy(s);
          break;
        case 26:
          T = s.stateNode, s.memoizedState !== null || T === null || ae || Jc(
            Yl(T.ownerDocument),
            s.type,
            T
          ), an(
            u,
            s,
            n
          ), m && i === null && f & 4 && Wr(s), mn(s, s.return);
          break;
        case 12:
          an(
            u,
            s,
            n
          );
          break;
        case 31:
          an(
            u,
            s,
            n
          ), m && f & 4 && Dy(u, s);
          break;
        case 13:
          an(
            u,
            s,
            n
          ), m && f & 4 && xy(u, s);
          break;
        case 22:
          s.memoizedState === null && an(
            u,
            s,
            n
          ), mn(s, s.return);
          break;
        case 30:
          an(
            u,
            s,
            n
          ), mn(s, s.return);
          break;
        case 7:
          mn(s, s.return);
        default:
          an(
            u,
            s,
            n
          );
      }
      e = e.sibling;
    }
  }
  function cc(t, e) {
    var n = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== n && (t != null && t.refCount++, n != null && gl(n));
  }
  function fc(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && gl(t));
  }
  function Pe(t, e, n, i) {
    var u = (n & 335544064) === n;
    if (e.subtreeFlags & (u ? 10262 : 10256))
      for (e = e.child; e !== null; )
        Ry(
          t,
          e,
          n,
          i
        ), e = e.sibling;
    else u && vy(e);
  }
  function Ry(t, e, n, i) {
    var u = (n & 335544064) === n;
    u && e.alternate === null && e.return !== null && e.return.alternate !== null && ms(e);
    var s = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Pe(
          t,
          e,
          n,
          i
        ), s & 2048 && zl(9, e);
        break;
      case 1:
        Pe(
          t,
          e,
          n,
          i
        );
        break;
      case 3:
        Pe(
          t,
          e,
          n,
          i
        ), u && sc && (t = t.containerInfo, t = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, t.style.viewTransitionName === "root" && (t.style.viewTransitionName = ""), t = t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "none" && (t.style.viewTransitionName = "")), s & 2048 && (s = null, e.alternate !== null && (s = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== s && (e.refCount++, s != null && gl(s)));
        break;
      case 12:
        if (s & 2048) {
          Pe(
            t,
            e,
            n,
            i
          ), s = e.stateNode;
          try {
            var f = e.memoizedProps, m = f.id, T = f.onPostCommit;
            typeof T == "function" && T(
              m,
              e.alternate === null ? "mount" : "update",
              s.passiveEffectDuration,
              -0
            );
          } catch (x) {
            Rt(e, e.return, x);
          }
        } else
          Pe(
            t,
            e,
            n,
            i
          );
        break;
      case 31:
        Pe(
          t,
          e,
          n,
          i
        );
        break;
      case 13:
        Pe(
          t,
          e,
          n,
          i
        );
        break;
      case 23:
        break;
      case 22:
        f = e.stateNode, m = e.alternate, e.memoizedState !== null ? (u && m !== null && m.memoizedState === null && ms(m), f._visibility & 2 ? Pe(
          t,
          e,
          n,
          i
        ) : Vl(
          t,
          e
        )) : (u && m !== null && m.memoizedState !== null && ms(e), f._visibility & 2 ? Pe(
          t,
          e,
          n,
          i
        ) : (f._visibility |= 2, Da(
          t,
          e,
          n,
          i,
          (e.subtreeFlags & 10256) !== 0 || !1
        ))), s & 2048 && cc(m, e);
        break;
      case 24:
        Pe(
          t,
          e,
          n,
          i
        ), s & 2048 && fc(e.alternate, e);
        break;
      case 30:
        u && (s = e.alternate, s !== null && (gn(s.child, !0), gn(e.child, !0))), Pe(
          t,
          e,
          n,
          i
        );
        break;
      default:
        Pe(
          t,
          e,
          n,
          i
        );
    }
  }
  function Da(t, e, n, i, u) {
    for (u = u && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var s = t, f = e, m = n, T = i, x = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          Da(
            s,
            f,
            m,
            T,
            u
          ), zl(8, f);
          break;
        case 23:
          break;
        case 22:
          var z = f.stateNode;
          f.memoizedState !== null ? z._visibility & 2 ? Da(
            s,
            f,
            m,
            T,
            u
          ) : Vl(
            s,
            f
          ) : (z._visibility |= 2, Da(
            s,
            f,
            m,
            T,
            u
          )), u && x & 2048 && cc(
            f.alternate,
            f
          );
          break;
        case 24:
          Da(
            s,
            f,
            m,
            T,
            u
          ), u && x & 2048 && fc(f.alternate, f);
          break;
        default:
          Da(
            s,
            f,
            m,
            T,
            u
          );
      }
      e = e.sibling;
    }
  }
  function Vl(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var n = t, i = e, u = i.flags;
        switch (i.tag) {
          case 22:
            Vl(n, i), u & 2048 && cc(
              i.alternate,
              i
            );
            break;
          case 24:
            Vl(n, i), u & 2048 && fc(i.alternate, i);
            break;
          default:
            Vl(n, i);
        }
        e = e.sibling;
      }
  }
  var Gi = 8192;
  function qi(t, e, n) {
    if (t.subtreeFlags & Gi)
      for (t = t.child; t !== null; )
        Ny(
          t,
          e,
          n
        ), t = t.sibling;
  }
  function Ny(t, e, n) {
    switch (t.tag) {
      case 26:
        qi(
          t,
          e,
          n
        ), t.flags & Gi && (t.memoizedState !== null ? hb(
          n,
          nn,
          t.memoizedState,
          t.memoizedProps
        ) : (t = t.stateNode, (e & 335544128) === e && L0(n, t)));
        break;
      case 5:
        qi(
          t,
          e,
          n
        ), t.flags & Gi && (t = t.stateNode, (e & 335544128) === e && L0(n, t));
        break;
      case 3:
      case 4:
        var i = nn;
        nn = Yl(t.stateNode.containerInfo), qi(
          t,
          e,
          n
        ), nn = i;
        break;
      case 22:
        t.memoizedState === null && (i = t.alternate, i !== null && i.memoizedState !== null ? (i = Gi, Gi = 16777216, qi(
          t,
          e,
          n
        ), Gi = i) : qi(
          t,
          e,
          n
        ));
        break;
      case 30:
        if ((t.flags & Gi) !== 0 && (i = t.memoizedProps.name, i != null && i !== "auto")) {
          var u = t.stateNode;
          u.paired = null, we === null && (we = /* @__PURE__ */ new Map()), we.set(i, u);
        }
        qi(
          t,
          e,
          n
        );
        break;
      default:
        qi(
          t,
          e,
          n
        );
    }
  }
  function Vy(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function _l(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          le = i, Uy(
            i,
            t
          );
        }
      Vy(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        _y(t), t = t.sibling;
  }
  function _y(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        _l(t), t.flags & 2048 && ui(9, t, t.return);
        break;
      case 3:
        _l(t);
        break;
      case 12:
        _l(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, vs(t)) : _l(t);
        break;
      default:
        _l(t);
    }
  }
  function vs(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          le = i, Uy(
            i,
            t
          );
        }
      Vy(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          ui(8, e, e.return), vs(e);
          break;
        case 22:
          n = e.stateNode, n._visibility & 2 && (n._visibility &= -3, vs(e));
          break;
        default:
          vs(e);
      }
      t = t.sibling;
    }
  }
  function Uy(t, e) {
    for (; le !== null; ) {
      var n = le;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          ui(8, n, e);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var i = n.memoizedState.cachePool.pool;
            i != null && i.refCount++;
          }
          break;
        case 24:
          gl(n.memoizedState.cache);
      }
      if (i = n.child, i !== null) i.return = n, le = i;
      else
        t: for (n = t; le !== null; ) {
          i = le;
          var u = i.sibling, s = i.return;
          if (Ay(i), i === n) {
            le = null;
            break t;
          }
          if (u !== null) {
            u.return = s, le = u;
            break t;
          }
          le = s;
        }
    }
  }
  var sT = {
    getCacheForType: function(t) {
      var e = oe(Ft), n = e.data.get(t);
      return n === void 0 && (n = t(), e.data.set(t, n)), n;
    },
    cacheSignal: function() {
      return oe(Ft).controller.signal;
    }
  }, oT = typeof WeakMap == "function" ? WeakMap : Map, xt = 0, Bt = null, pt = null, St = 0, zt = 0, He = null, oi = !1, xa = !1, hc = !1, jn = 0, Qt = 0, ri = 0, Xi = 0, Ss = 0, Le = 0, Ca = 0, Ul = null, xe = null, dc = !1, Ts = 0, By = 0, bs = 1 / 0, Es = null, ci = null, qt = 0, ln = null, Qi = null, Tn = 0, mc = 0, yc = null, wy = null, Oa = null, za = null, Ra = null, Bl = 0, As = null;
  function je() {
    return (xt & 2) !== 0 && St !== 0 ? St & -St : $.T !== null ? Dc() : jh();
  }
  function Hy() {
    if (Le === 0)
      if ((St & 536870912) === 0 || gt) {
        var t = pu;
        pu <<= 1, (pu & 3932160) === 0 && (pu = 262144), Le = t;
      } else Le = 536870912;
    return t = re.current, t !== null && (t.flags |= 32), Le;
  }
  function Na(t, e) {
    if (e != null) {
      var n = t.stateNode, i = n.ref;
      i === null && (i = n.ref = p0(
        zn(t.memoizedProps, n)
      )), za === null && (za = []), za.push(e.bind(null, i));
    }
  }
  function Ce(t, e, n) {
    (t === Bt && (zt === 2 || zt === 9) || t.cancelPendingCommit !== null) && (Va(t, 0), fi(
      t,
      St,
      Le,
      !1
    )), nl(t, n), ((xt & 2) === 0 || t !== Bt) && (t === Bt && ((xt & 2) === 0 && (Xi |= n), Qt === 4 && fi(
      t,
      St,
      Le,
      !1
    )), bn(t));
  }
  function Ly(t, e, n) {
    if ((xt & 6) !== 0) throw Error(r(327));
    var i = !n && (e & 127) === 0 && (e & t.expiredLanes) === 0 || el(t, e), u = i ? fT(t, e) : pc(t, e, !0), s = i;
    do {
      if (u === 0) {
        xa && !i && fi(t, e, 0, !1);
        break;
      } else {
        if (n = t.current.alternate, s && !rT(n)) {
          u = pc(t, e, !1), s = !1;
          continue;
        }
        if (u === 2) {
          if (s = e, t.errorRecoveryDisabledLanes & s)
            var f = 0;
          else
            f = t.pendingLanes & -536870913, f = f !== 0 ? f : f & 536870912 ? 536870912 : 0;
          if (f !== 0) {
            e = f;
            t: {
              var m = t;
              u = Ul;
              var T = m.current.memoizedState.isDehydrated;
              if (T && (Va(m, f).flags |= 256), f = pc(
                m,
                f,
                !1
              ), f !== 2 && f !== 6) {
                if (hc && !T) {
                  m.errorRecoveryDisabledLanes |= s, Xi |= s, u = 4;
                  break t;
                }
                s = xe, xe = u, s !== null && (xe === null ? xe = s : xe.push.apply(
                  xe,
                  s
                ));
              }
              u = f;
            }
            if (s = !1, u !== 2) continue;
          }
        }
        if (u === 1) {
          Va(t, 0), fi(t, e, 0, !0);
          break;
        }
        t: {
          switch (i = t, s = u, s) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((e & 4194048) !== e && (e & 62914560) !== e)
                break;
            case 6:
              fi(
                i,
                e,
                Le,
                !oi
              );
              break t;
            case 2:
              xe = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((e & 62914560) === e && (u = Ts + 300 - Re(), 10 < u)) {
            if (fi(
              i,
              e,
              Le,
              !oi
            ), Su(i, 0, !0) !== 0) break t;
            Tn = e, i.timeoutHandle = wc(
              jy.bind(
                null,
                i,
                n,
                xe,
                Es,
                dc,
                e,
                Le,
                Xi,
                Ca,
                oi,
                s,
                "Throttled",
                -0,
                0
              ),
              u
            );
            break t;
          }
          jy(
            i,
            n,
            xe,
            Es,
            dc,
            e,
            Le,
            Xi,
            Ca,
            oi,
            s,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    bn(t);
  }
  function jy(t, e, n, i, u, s, f, m, T, x, z, _, M, O) {
    t.timeoutHandle = -1;
    var Q = e.subtreeFlags, F = (s & 335544064) === s;
    if (_ = null, (F || Q & 8192 || (Q & 16785408) === 16785408) && (_ = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: fn
    }, we = null, Ny(
      e,
      s,
      _
    ), F && (Q = _, F = t.containerInfo, F = (F.nodeType === 9 ? F : F.ownerDocument).__reactViewTransition, F != null && (Q.count++, Q.waitingForViewTransition = !0, Q = Xl.bind(Q), F.finished.then(Q, Q))), Q = (s & 62914560) === s ? Ts - Re() : (s & 4194048) === s ? By - Re() : 0, Q = db(
      _,
      Q
    ), Q !== null)) {
      Tn = s, t.cancelPendingCommit = Q(
        Jy.bind(
          null,
          t,
          e,
          s,
          n,
          i,
          u,
          f,
          m,
          T,
          x,
          z,
          _,
          null,
          M,
          O
        )
      ), fi(t, s, f, !x);
      return;
    }
    Jy(
      t,
      e,
      s,
      n,
      i,
      u,
      f,
      m,
      T,
      x,
      z,
      _
    );
  }
  function rT(t) {
    for (var e = t; ; ) {
      var n = e.tag;
      if ((n === 0 || n === 11 || n === 15) && e.flags & 16384 && (n = e.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var i = 0; i < n.length; i++) {
          var u = n[i], s = u.getSnapshot;
          u = u.value;
          try {
            if (!Ue(s(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (n = e.child, e.subtreeFlags & 16384 && n !== null)
        n.return = e, e = n;
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    }
    return !0;
  }
  function fi(t, e, n, i) {
    e = Uh(t, e), e &= ~Ss, e &= ~Xi, t.suspendedLanes |= e, t.pingedLanes &= ~e, i && (t.warmLanes |= e), i = t.expirationTimes;
    for (var u = e; 0 < u; ) {
      var s = 31 - Ve(u), f = 1 << s;
      i[s] = -1, u &= ~f;
    }
    n !== 0 && wh(t, n, e);
  }
  function Ms() {
    return (xt & 6) === 0 ? (wl(0), !1) : !0;
  }
  function gc() {
    if (pt !== null) {
      if (zt === 0)
        var t = pt.return;
      else
        t = pt, _n = Ni = null, Mr(t), va = null, Sl = 0, t = pt;
      for (; t !== null; )
        oy(t.alternate, t), t = t.return;
      pt = null;
    }
  }
  function Va(t, e) {
    var n = t.timeoutHandle;
    return n !== -1 && (t.timeoutHandle = -1, _T(n)), n = t.cancelPendingCommit, n !== null && (t.cancelPendingCommit = null, n()), Tn = 0, gc(), Bt = t, pt = n = Nn(t.current, null), St = e, zt = 0, He = null, oi = !1, xa = el(t, e), hc = !1, Ca = Le = Ss = Xi = ri = Qt = 0, xe = Ul = null, dc = !1, jn = Uh(t, e), Vu(), n;
  }
  function Yy(t, e) {
    ht = null, $.H = is, e === pa || e === Xu ? (e = Jd(), zt = 3) : e === fr ? (e = Jd(), zt = 4) : zt = e === jr ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, He = e, pt === null && (Qt = 1, as(
      t,
      Ze(e, t.current)
    ));
  }
  function Gy() {
    var t = re.current;
    return t === null ? !0 : (St & 4194048) === St ? ye === null : (St & 62914560) === St || (St & 536870912) !== 0 ? t === ye : !1;
  }
  function qy() {
    var t = $.H;
    return $.H = is, t === null ? is : t;
  }
  function Xy() {
    var t = $.A;
    return $.A = sT, t;
  }
  function Ds() {
    Qt = 4, oi || (St & 4194048) !== St && re.current !== null || (xa = !0), (ri & 134217727) === 0 && (Xi & 134217727) === 0 || Bt === null || fi(
      Bt,
      St,
      Le,
      !1
    );
  }
  function pc(t, e, n) {
    var i = xt;
    xt |= 2;
    var u = qy(), s = Xy();
    (Bt !== t || St !== e) && (Es = null, Va(t, e)), e = !1;
    var f = Qt;
    t: do
      try {
        if (zt !== 0 && pt !== null) {
          var m = pt, T = He;
          switch (zt) {
            case 8:
              gc(), f = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              re.current === null && (e = !0);
              var x = zt;
              if (zt = 0, He = null, _a(t, m, T, x), n && xa) {
                f = 0;
                break t;
              }
              break;
            default:
              x = zt, zt = 0, He = null, _a(t, m, T, x);
          }
        }
        cT(), f = Qt;
        break;
      } catch (z) {
        Yy(t, z);
      }
    while (!0);
    return e && t.shellSuspendCounter++, _n = Ni = null, xt = i, $.H = u, $.A = s, pt === null && (Bt = null, St = 0, Vu()), f;
  }
  function cT() {
    for (; pt !== null; ) Qy(pt);
  }
  function fT(t, e) {
    var n = xt;
    xt |= 2;
    var i = qy(), u = Xy();
    Bt !== t || St !== e ? (Es = null, bs = Re() + 500, Va(t, e)) : xa = el(
      t,
      e
    );
    t: do
      try {
        if (zt !== 0 && pt !== null) {
          e = pt;
          var s = He;
          e: switch (zt) {
            case 1:
              zt = 0, He = null, _a(t, e, s, 1);
              break;
            case 2:
            case 9:
              if (Zd(s)) {
                zt = 0, He = null, Zy(e);
                break;
              }
              e = function() {
                zt !== 2 && zt !== 9 || Bt !== t || (zt = 7), bn(t);
              }, s.then(e, e);
              break t;
            case 3:
              zt = 7;
              break t;
            case 4:
              zt = 5;
              break t;
            case 7:
              Zd(s) ? (zt = 0, He = null, Zy(e)) : (zt = 0, He = null, _a(t, e, s, 7));
              break;
            case 5:
              var f = null;
              switch (pt.tag) {
                case 26:
                  f = pt.memoizedState;
                case 5:
                case 27:
                  var m = pt;
                  if (f ? w0(f) : m.stateNode.complete) {
                    zt = 0, He = null;
                    var T = m.sibling;
                    if (T !== null) pt = T;
                    else {
                      var x = m.return;
                      x !== null ? (pt = x, xs(x)) : pt = null;
                    }
                    break e;
                  }
              }
              zt = 0, He = null, _a(t, e, s, 5);
              break;
            case 6:
              zt = 0, He = null, _a(t, e, s, 6);
              break;
            case 8:
              gc(), Qt = 6;
              break t;
            default:
              throw Error(r(462));
          }
        }
        hT();
        break;
      } catch (z) {
        Yy(t, z);
      }
    while (!0);
    return _n = Ni = null, $.H = i, $.A = u, xt = n, pt !== null ? 0 : (Bt = null, St = 0, Vu(), Qt);
  }
  function hT() {
    for (; pt !== null && !z1(); )
      Qy(pt);
  }
  function Qy(t) {
    var e = uy(t.alternate, t, jn);
    t.memoizedProps = t.pendingProps, e === null ? xs(t) : pt = e;
  }
  function Zy(t) {
    var e = t, n = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = Im(
          n,
          e,
          e.pendingProps,
          e.type,
          void 0,
          St
        );
        break;
      case 11:
        e = Im(
          n,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          St
        );
        break;
      case 5:
        Mr(e);
        var i = e;
        i === ie && (gt ? (Lu(i), i.tag === 5 && i.stateNode != null && (Lt = i.stateNode)) : (Lu(i), gt = !0));
      default:
        oy(n, e), e = pt = Ud(e, jn), e = uy(n, e, jn);
    }
    t.memoizedProps = t.pendingProps, e === null ? xs(t) : pt = e;
  }
  function _a(t, e, n, i) {
    _n = Ni = null, Mr(e), va = null, Sl = 0;
    var u = e.return;
    try {
      if (IS(
        t,
        u,
        e,
        n,
        St
      )) {
        Qt = 1, as(
          t,
          Ze(n, t.current)
        ), pt = null;
        return;
      }
    } catch (s) {
      if (u !== null) throw pt = u, s;
      Qt = 1, as(
        t,
        Ze(n, t.current)
      ), pt = null;
      return;
    }
    e.flags & 32768 ? (gt || i === 1 ? t = !0 : xa || (St & 536870912) !== 0 ? t = !1 : (oi = t = !0, (i === 2 || i === 9 || i === 3 || i === 6) && (i = re.current, i !== null && i.tag === 13 && (i.flags |= 16384))), Ky(e, t)) : xs(e);
  }
  function xs(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        Ky(
          e,
          oi
        );
        return;
      }
      t = e.return;
      var n = iT(
        e.alternate,
        e,
        jn
      );
      if (n !== null) {
        pt = n;
        return;
      }
      if (e = e.sibling, e !== null) {
        pt = e;
        return;
      }
      pt = e = t;
    } while (e !== null);
    Qt === 0 && (Qt = 5);
  }
  function Ky(t, e) {
    do {
      var n = aT(t.alternate, t);
      if (n !== null) {
        n.flags &= 32767, pt = n;
        return;
      }
      if (n = t.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !e && (t = t.sibling, t !== null)) {
        pt = t;
        return;
      }
      pt = t = n;
    } while (t !== null);
    Qt = 6, pt = null;
  }
  function Jy(t, e, n, i, u, s, f, m, T, x, z, _) {
    t.cancelPendingCommit = null;
    do
      Cs();
    while (qt !== 0);
    if ((xt & 6) !== 0) throw Error(r(327));
    if (e !== null) {
      if (e === t.current) throw Error(r(177));
      t === Bt && (pt = Bt = null, St = 0), Qi = e, ln = t, Tn = n, yc = u, wy = i, dT(
        t,
        e,
        n,
        f,
        m,
        T,
        _
      );
    }
  }
  function dT(t, e, n, i, u, s, f) {
    var m = e.lanes | e.childLanes;
    if (mc = m, m |= $o, j1(
      t,
      n,
      m,
      i,
      u,
      s
    ), za = null, (n & 335544064) === n ? (Ra = GS(t), i = 10262) : (Ra = null, i = 10256), (e.subtreeFlags & i) !== 0 || (e.flags & i) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, ST(yu, function() {
      return bc(), null;
    })) : (t.callbackNode = null, t.callbackPriority = 0), hs = !1, i = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || i) {
      i = $.T, $.T = null, u = at.p, at.p = 2, s = xt, xt |= 4;
      try {
        lT(t, e, n);
      } finally {
        xt = s, at.p = u, $.T = i;
      }
    }
    qt = 1, hs ? Oa = jT(
      f,
      t.containerInfo,
      Ra,
      vc,
      Sc,
      yT,
      Tc,
      bc,
      mT
    ) : (vc(), Sc(), Tc());
  }
  function mT(t) {
    if (qt !== 0) {
      var e = ln.onRecoverableError;
      e(t, { componentStack: null });
    }
  }
  function yT() {
    qt === 3 && (qt = 0, zy(Qi, ln), qt = 4);
  }
  function vc() {
    if (qt === 1) {
      qt = 0;
      var t = ln, e = Qi, n = Tn, i = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || i) {
        i = $.T, $.T = null;
        var u = at.p;
        at.p = 2;
        var s = xt;
        xt |= 4;
        try {
          Nl = ys = !1, Cy(e, t, n), n = _c;
          var f = Md(t.containerInfo), m = n.focusedElem, T = n.selectionRange;
          if (f !== m && m && m.ownerDocument && Ad(
            m.ownerDocument.documentElement,
            m
          )) {
            if (T !== null && Jo(m)) {
              var x = T.start, z = T.end;
              if (z === void 0 && (z = x), "selectionStart" in m)
                m.selectionStart = x, m.selectionEnd = Math.min(
                  z,
                  m.value.length
                );
              else {
                var _ = m.ownerDocument || document, M = _ && _.defaultView || window;
                if (M.getSelection) {
                  var O = M.getSelection(), Q = m.textContent.length, F = Math.min(T.start, Q), dt = T.end === void 0 ? F : Math.min(T.end, Q);
                  !O.extend && F > dt && (f = dt, dt = F, F = f);
                  var D = Ed(
                    m,
                    F
                  ), E = Ed(
                    m,
                    dt
                  );
                  if (D && E && (O.rangeCount !== 1 || O.anchorNode !== D.node || O.anchorOffset !== D.offset || O.focusNode !== E.node || O.focusOffset !== E.offset)) {
                    var C = _.createRange();
                    C.setStart(D.node, D.offset), O.removeAllRanges(), F > dt ? (O.addRange(C), O.extend(E.node, E.offset)) : (C.setEnd(E.node, E.offset), O.addRange(C));
                  }
                }
              }
            }
            for (_ = [], O = m; O = O.parentNode; )
              O.nodeType === 1 && _.push({
                element: O,
                left: O.scrollLeft,
                top: O.scrollTop
              });
            for (typeof m.focus == "function" && m.focus(), m = 0; m < _.length; m++) {
              var V = _[m];
              V.element.scrollLeft = V.left, V.element.scrollTop = V.top;
            }
          }
          Ga = !!Vc, _c = Vc = null;
        } finally {
          xt = s, at.p = u, $.T = i;
        }
      }
      t.current = e, qt = 2;
    }
  }
  function Sc() {
    if (qt === 2) {
      qt = 0;
      var t = ln, e = Qi, n = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || n) {
        n = $.T, $.T = null;
        var i = at.p;
        at.p = 2;
        var u = xt;
        xt |= 4;
        try {
          by(t, e.alternate, e);
        } finally {
          xt = u, at.p = i, $.T = n;
        }
      }
      qt = 3;
    }
  }
  function Tc() {
    if (qt === 4 || qt === 3) {
      qt = 0;
      var t = Oa;
      Oa = null, R1();
      var e = ln, n = Qi, i = Tn, u = wy, s = (i & 335544064) === i ? 10262 : 10256;
      if ((n.subtreeFlags & s) !== 0 || (n.flags & s) !== 0 ? qt = 5 : (qt = 0, Qi = ln = null, Fy(e, e.pendingLanes)), s = e.pendingLanes, s === 0 && (ci = null), zo(i), n = n.stateNode, Ne && typeof Ne.onCommitFiberRoot == "function")
        try {
          Ne.onCommitFiberRoot(
            tl,
            n,
            void 0,
            (n.current.flags & 128) === 128
          );
        } catch {
        }
      if (u !== null) {
        n = $.T, s = at.p, at.p = 2, $.T = null;
        try {
          for (var f = e.onRecoverableError, m = 0; m < u.length; m++) {
            var T = u[m];
            f(T.value, {
              componentStack: T.stack
            });
          }
        } finally {
          $.T = n, at.p = s;
        }
      }
      if (u = za, f = Ra, Ra = null, u !== null && (za = null, f === null && (f = []), t !== null))
        for (T = 0; T < u.length; T++)
          n = (0, u[T])(
            f
          ), n !== void 0 && t.finished.finally(n);
      (Tn & 3) !== 0 && Cs(), bn(e), s = e.pendingLanes, (i & 261930) !== 0 && (s & 42) !== 0 ? e === As ? Bl++ : (Bl = 0, As = e) : (Bl = 0, As = null), wl(0);
    }
  }
  function Fy(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, gl(e)));
  }
  function Cs() {
    return Oa !== null && (Oa.skipTransition(), Oa = null), vc(), Sc(), Tc(), bc();
  }
  function bc() {
    if (qt !== 5) return !1;
    var t = ln, e = mc;
    mc = 0;
    var n = zo(Tn), i = $.T, u = at.p;
    try {
      at.p = 32 > n ? 32 : n, $.T = null, n = yc, yc = null;
      var s = ln, f = Tn;
      if (qt = 0, Qi = ln = null, Tn = 0, (xt & 6) !== 0) throw Error(r(331));
      var m = xt;
      if (xt |= 4, _y(s.current), Ry(
        s,
        s.current,
        f,
        n
      ), xt = m, wl(0, !1), Ne && typeof Ne.onPostCommitFiberRoot == "function")
        try {
          Ne.onPostCommitFiberRoot(tl, s);
        } catch {
        }
      return !0;
    } finally {
      at.p = u, $.T = i, Fy(t, e);
    }
  }
  function Py(t, e, n) {
    e = Ze(n, e), e = Lr(t.stateNode, e, 2), t = ni(t, e, 2), t !== null && (nl(t, 2), bn(t));
  }
  function Rt(t, e, n) {
    if (t.tag === 3)
      Py(t, t, n);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          Py(
            e,
            t,
            n
          );
          break;
        } else if (e.tag === 1) {
          var i = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof i.componentDidCatch == "function" && (ci === null || !ci.has(i))) {
            t = Ze(n, t), n = Zm(2), i = ni(e, n, 2), i !== null && (Km(
              n,
              i,
              e,
              t
            ), nl(i, 2), bn(i));
            break;
          }
        }
        e = e.return;
      }
  }
  function Ec(t, e, n) {
    var i = t.pingCache;
    if (i === null) {
      i = t.pingCache = new oT();
      var u = /* @__PURE__ */ new Set();
      i.set(e, u);
    } else
      u = i.get(e), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(e, u));
    u.has(n) || (hc = !0, u.add(n), t = gT.bind(null, t, e, n), e.then(t, t));
  }
  function gT(t, e, n) {
    var i = t.pingCache;
    i !== null && i.delete(e), t.pingedLanes |= t.suspendedLanes & n, t.warmLanes &= ~n, Bt === t && (St & n) === n && ((Qt === 4 || Qt === 3 && (St & 62914560) === St && 300 > Re() - Ts) && (xt & 2) === 0 ? Va(t, 0) : Ss |= n, Ca === St && (Ca = 0)), bn(t);
  }
  function ky(t, e) {
    e === 0 && (e = Bh()), t = Oi(t, e), t !== null && (nl(t, e), bn(t));
  }
  function pT(t) {
    var e = t.memoizedState, n = 0;
    e !== null && (n = e.retryLane), ky(t, n);
  }
  function vT(t, e) {
    var n = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var i = t.stateNode, u = t.memoizedState;
        u !== null && (n = u.retryLane);
        break;
      case 19:
        i = t.stateNode;
        break;
      case 22:
        i = t.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    i !== null && i.delete(e), ky(t, n);
  }
  function ST(t, e) {
    return Do(t, e);
  }
  var Ua = null, Ba = null, Ac = !1, Os = !1, Mc = !1, hi = 0;
  function bn(t) {
    t !== Ba && t.next === null && (Ba === null ? Ua = Ba = t : Ba = Ba.next = t), Os = !0, Ac || (Ac = !0, bT());
  }
  function wl(t, e) {
    if (!Mc && Os) {
      Mc = !0;
      do
        for (var n = !1, i = Ua; i !== null; ) {
          if (t !== 0) {
            var u = i.pendingLanes;
            if (u === 0) var s = 0;
            else {
              var f = i.suspendedLanes, m = i.pingedLanes;
              s = (1 << 31 - Ve(42 | t) + 1) - 1, s &= u & ~(f & ~m), s = s & 201326741 ? s & 201326741 | 1 : s ? s | 2 : 0;
            }
            s !== 0 && (n = !0, t0(i, s));
          } else
            s = St, s = Su(
              i,
              i === Bt ? s : 0,
              i.cancelPendingCommit !== null || i.timeoutHandle !== -1
            ), (s & 3) === 0 || el(i, s) || (n = !0, t0(i, s));
          i = i.next;
        }
      while (n);
      Mc = !1;
    }
  }
  function TT() {
    Wy();
  }
  function Wy() {
    Os = Ac = !1;
    var t = 0;
    hi !== 0 && VT() && (t = hi);
    for (var e = Re(), n = null, i = Ua; i !== null; ) {
      var u = i.next, s = $y(i, e);
      s === 0 ? (i.next = null, n === null ? Ua = u : n.next = u, u === null && (Ba = n)) : (n = i, (t !== 0 || (s & 3) !== 0) && (Os = !0)), i = u;
    }
    qt !== 0 && qt !== 5 || wl(t), hi !== 0 && (hi = 0);
  }
  function $y(t, e) {
    for (var n = t.suspendedLanes, i = t.pingedLanes, u = t.expirationTimes, s = t.pendingLanes & -62914561; 0 < s; ) {
      var f = 31 - Ve(s), m = 1 << f, T = u[f];
      T === -1 ? ((m & n) === 0 || (m & i) !== 0) && (u[f] = L1(m, e)) : T <= e && (t.expiredLanes |= m), s &= ~m;
    }
    if (e = Bt, n = St, n = Su(
      t,
      t === e ? n : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), i = t.callbackNode, n === 0 || t === e && (zt === 2 || zt === 9) || t.cancelPendingCommit !== null)
      return i !== null && i !== null && xo(i), t.callbackNode = null, t.callbackPriority = 0;
    if ((n & 3) === 0 || el(t, n)) {
      if (e = n & -n, e === t.callbackPriority) return e;
      switch (i !== null && xo(i), zo(n)) {
        case 2:
        case 8:
          n = Vh;
          break;
        case 32:
          n = yu;
          break;
        case 268435456:
          n = _h;
          break;
        default:
          n = yu;
      }
      return i = Iy.bind(null, t), n = Do(n, i), t.callbackPriority = e, t.callbackNode = n, e;
    }
    return i !== null && i !== null && xo(i), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function Iy(t, e) {
    if (qt !== 0 && qt !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var n = t.callbackNode;
    if (Cs() && t.callbackNode !== n)
      return null;
    var i = St;
    return i = Su(
      t,
      t === Bt ? i : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), i === 0 ? null : (Ly(t, i, e), $y(t, Re()), t.callbackNode != null && t.callbackNode === n ? Iy.bind(null, t) : null);
  }
  function t0(t, e) {
    if (Cs()) return null;
    Ly(t, e, !0);
  }
  function bT() {
    UT(function() {
      (xt & 6) !== 0 ? Do(
        Nh,
        TT
      ) : Wy();
    });
  }
  function Dc() {
    if (hi === 0) {
      var t = Ui;
      t === 0 && (t = gu, gu <<= 1, (gu & 261888) === 0 && (gu = 256)), hi = t;
    }
    return hi;
  }
  function e0(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Mu(t);
  }
  function ET(t, e, n, i, u) {
    if (e === "submit" && n && n.stateNode === u) {
      var s = e0(
        (u[Ee] || null).action
      ), f = i.submitter;
      f && (e = (e = f[Ee] || null) ? e0(e.formAction) : f.getAttribute("formAction"), e !== null && (s = e, f = null));
      var m = new Ou(
        "action",
        "action",
        null,
        i,
        u
      );
      t.push({
        event: m,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (i.defaultPrevented) {
                if (hi !== 0) {
                  var T = new FormData(u, f);
                  _r(
                    n,
                    {
                      pending: !0,
                      data: T,
                      method: u.method,
                      action: s
                    },
                    null,
                    T
                  );
                }
              } else
                typeof s == "function" && (m.preventDefault(), T = new FormData(u, f), _r(
                  n,
                  {
                    pending: !0,
                    data: T,
                    method: u.method,
                    action: s
                  },
                  s,
                  T
                ));
            },
            currentTarget: u
          }
        ]
      });
    }
  }
  for (var xc = 0; xc < Wo.length; xc++) {
    var Cc = Wo[xc], AT = Cc.toLowerCase(), MT = Cc[0].toUpperCase() + Cc.slice(1);
    tn(
      AT,
      "on" + MT
    );
  }
  tn(Cd, "onAnimationEnd"), tn(Od, "onAnimationIteration"), tn(zd, "onAnimationStart"), tn("dblclick", "onDoubleClick"), tn("focusin", "onFocus"), tn("focusout", "onBlur"), tn(_S, "onTransitionRun"), tn(US, "onTransitionStart"), tn(BS, "onTransitionCancel"), tn(Rd, "onTransitionEnd"), ia("onMouseEnter", ["mouseout", "mouseover"]), ia("onMouseLeave", ["mouseout", "mouseover"]), ia("onPointerEnter", ["pointerout", "pointerover"]), ia("onPointerLeave", ["pointerout", "pointerover"]), Di(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Di(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Di("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Di(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Di(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Di(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Hl = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), DT = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Hl)
  );
  function n0(t, e) {
    e = (e & 4) !== 0;
    for (var n = 0; n < t.length; n++) {
      var i = t[n], u = i.event;
      i = i.listeners;
      t: {
        var s = void 0;
        if (e)
          for (var f = i.length - 1; 0 <= f; f--) {
            var m = i[f], T = m.instance, x = m.currentTarget;
            if (m = m.listener, T !== s && u.isPropagationStopped())
              break t;
            s = m, u.currentTarget = x;
            try {
              s(u);
            } catch (z) {
              Nu(z);
            }
            u.currentTarget = null, s = T;
          }
        else
          for (f = 0; f < i.length; f++) {
            if (m = i[f], T = m.instance, x = m.currentTarget, m = m.listener, T !== s && u.isPropagationStopped())
              break t;
            s = m, u.currentTarget = x;
            try {
              s(u);
            } catch (z) {
              Nu(z);
            }
            u.currentTarget = null, s = T;
          }
      }
    }
  }
  function vt(t, e) {
    var n = e[Gh];
    n === void 0 && (n = e[Gh] = /* @__PURE__ */ new Set());
    var i = t + "__bubble";
    n.has(i) || (i0(e, t, 2, !1), n.add(i));
  }
  function Oc(t, e, n) {
    var i = 0;
    e && (i |= 4), i0(
      n,
      t,
      i,
      e
    );
  }
  var zs = "_reactListening" + Math.random().toString(36).slice(2);
  function zc(t) {
    if (!t[zs]) {
      t[zs] = !0, Qh.forEach(function(n) {
        n !== "selectionchange" && (DT.has(n) || Oc(n, !1, t), Oc(n, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[zs] || (e[zs] = !0, Oc("selectionchange", !1, e));
    }
  }
  function i0(t, e, n, i) {
    switch (K0(e)) {
      case 2:
        var u = pb;
        break;
      case 8:
        u = vb;
        break;
      default:
        u = Pc;
    }
    n = u.bind(
      null,
      e,
      n,
      t
    ), u = void 0, !Ho || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (u = !0), i ? u !== void 0 ? t.addEventListener(e, n, {
      capture: !0,
      passive: u
    }) : t.addEventListener(e, n, !0) : u !== void 0 ? t.addEventListener(e, n, {
      passive: u
    }) : t.addEventListener(e, n, !1);
  }
  function Rc(t, e, n, i, u) {
    var s = i;
    if ((e & 1) === 0 && (e & 2) === 0 && i !== null)
      t: for (; ; ) {
        if (i === null) return;
        var f = i.tag;
        if (f === 3 || f === 4) {
          var m = i.stateNode.containerInfo;
          if (m === u) break;
          if (f === 4)
            for (f = i.return; f !== null; ) {
              var T = f.tag;
              if ((T === 3 || T === 4) && f.stateNode.containerInfo === u)
                return;
              f = f.return;
            }
          for (; m !== null; ) {
            if (f = Mi(m), f === null) return;
            if (T = f.tag, T === 5 || T === 6 || T === 26 || T === 27) {
              i = s = f;
              continue t;
            }
            m = m.parentNode;
          }
        }
        i = i.return;
      }
    id(function() {
      var x = s, z = Bo(n), _ = [];
      t: {
        var M = Nd.get(t);
        if (M !== void 0) {
          var O = Ou, Q = t;
          switch (t) {
            case "keypress":
              if (xu(n) === 0) break t;
            case "keydown":
            case "keyup":
              O = rS;
              break;
            case "focusin":
              Q = "focus", O = Go;
              break;
            case "focusout":
              Q = "blur", O = Go;
              break;
            case "beforeblur":
            case "afterblur":
              O = Go;
              break;
            case "click":
              if (n.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              O = ud;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              O = W1;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              O = mS;
              break;
            case Cd:
            case Od:
            case zd:
              O = tS;
              break;
            case Rd:
              O = gS;
              break;
            case "scroll":
            case "scrollend":
              O = P1;
              break;
            case "wheel":
              O = vS;
              break;
            case "copy":
            case "cut":
            case "paste":
              O = nS;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              O = od;
              break;
            case "submit":
              O = hS;
              break;
            case "toggle":
            case "beforetoggle":
              O = TS;
          }
          var F = (e & 4) !== 0, dt = !F && (t === "scroll" || t === "scrollend"), D = F ? M !== null ? M + "Capture" : null : M;
          F = [];
          for (var E = x, C; E !== null; ) {
            var V = E;
            if (C = V.stateNode, V = V.tag, V !== 5 && V !== 26 && V !== 27 || C === null || D === null || (V = ll(E, D), V != null && F.push(
              Ll(E, V, C)
            )), dt) break;
            E = E.return;
          }
          0 < F.length && (M = new O(
            M,
            Q,
            null,
            n,
            z
          ), _.push({ event: M, listeners: F }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (O = t === "mouseover" || t === "pointerover", M = t === "mouseout" || t === "pointerout", O && n !== Uo && (Q = n.relatedTarget || n.fromElement) && (Mi(Q) || Q[ta]))
            break t;
          (M || O) && (Q = z.window === z ? z : (O = z.ownerDocument) ? O.defaultView || O.parentWindow : window, M ? (O = n.relatedTarget || n.toElement, M = x, O = O ? Mi(O) : null, O !== null && (dt = d(O), F = O.tag, O !== dt || F !== 5 && F !== 27 && F !== 6) && (O = null)) : (M = null, O = x), M !== O && (F = ud, V = "onMouseLeave", D = "onMouseEnter", E = "mouse", (t === "pointerout" || t === "pointerover") && (F = od, V = "onPointerLeave", D = "onPointerEnter", E = "pointer"), dt = M == null ? Q : al(M), C = O == null ? Q : al(O), Q = new F(
            V,
            E + "leave",
            M,
            n,
            z
          ), Q.target = dt, Q.relatedTarget = C, V = null, Mi(z) === x && (F = new F(
            D,
            E + "enter",
            O,
            n,
            z
          ), F.target = C, F.relatedTarget = dt, V = F), dt = V, F = M && O ? st(
            M,
            O,
            xT
          ) : null, M !== null && a0(
            _,
            Q,
            M,
            F,
            !1
          ), O !== null && dt !== null && a0(
            _,
            dt,
            O,
            F,
            !0
          )));
        }
        t: {
          if (M = x ? al(x) : window, O = M.nodeName && M.nodeName.toLowerCase(), O === "select" || O === "input" && M.type === "file")
            var K = gd;
          else if (md(M))
            if (pd)
              K = RS;
            else {
              K = OS;
              var Tt = CS;
            }
          else
            O = M.nodeName, !O || O.toLowerCase() !== "input" || M.type !== "checkbox" && M.type !== "radio" ? x && _o(x.elementType) && (K = gd) : K = zS;
          if (K && (K = K(t, x))) {
            yd(
              _,
              K,
              n,
              z
            );
            break t;
          }
          Tt && Tt(t, M, x);
        }
        switch (Tt = x ? al(x) : window, t) {
          case "focusin":
            (md(Tt) || Tt.contentEditable === "true") && (ra = Tt, Fo = x, dl = null);
            break;
          case "focusout":
            dl = Fo = ra = null;
            break;
          case "mousedown":
            Po = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Po = !1, Dd(_, n, z);
            break;
          case "selectionchange":
            if (VS) break;
          case "keydown":
          case "keyup":
            Dd(_, n, z);
        }
        var it;
        if (Xo)
          t: {
            switch (t) {
              case "compositionstart":
                var ut = "onCompositionStart";
                break t;
              case "compositionend":
                ut = "onCompositionEnd";
                break t;
              case "compositionupdate":
                ut = "onCompositionUpdate";
                break t;
            }
            ut = void 0;
          }
        else
          oa ? hd(t, n) && (ut = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (ut = "onCompositionStart");
        ut && (rd && n.locale !== "ko" && (oa || ut !== "onCompositionStart" ? ut === "onCompositionEnd" && oa && (it = ad()) : (Jn = z, Lo = "value" in Jn ? Jn.value : Jn.textContent, oa = !0)), Tt = Rs(x, ut), 0 < Tt.length && (ut = new sd(
          ut,
          t,
          null,
          n,
          z
        ), _.push({ event: ut, listeners: Tt }), it ? ut.data = it : (it = dd(n), it !== null && (ut.data = it)))), (it = ES ? AS(t, n) : MS(t, n)) && (ut = Rs(x, "onBeforeInput"), 0 < ut.length && (Tt = new sd(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          z
        ), _.push({
          event: Tt,
          listeners: ut
        }), Tt.data = it)), ET(
          _,
          t,
          x,
          n,
          z
        );
      }
      n0(_, e);
    });
  }
  function Ll(t, e, n) {
    return {
      instance: t,
      listener: e,
      currentTarget: n
    };
  }
  function Rs(t, e) {
    for (var n = e + "Capture", i = []; t !== null; ) {
      var u = t, s = u.stateNode;
      if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || s === null || (u = ll(t, n), u != null && i.unshift(
        Ll(t, u, s)
      ), u = ll(t, e), u != null && i.push(
        Ll(t, u, s)
      )), t.tag === 3) return i;
      t = t.return;
    }
    return [];
  }
  function xT(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function a0(t, e, n, i, u) {
    for (var s = e._reactName, f = []; n !== null && n !== i; ) {
      var m = n, T = m.alternate, x = m.stateNode;
      if (m = m.tag, T !== null && T === i) break;
      m !== 5 && m !== 26 && m !== 27 || x === null || (T = x, u ? (x = ll(n, s), x != null && f.unshift(
        Ll(n, x, T)
      )) : u || (x = ll(n, s), x != null && f.push(
        Ll(n, x, T)
      ))), n = n.return;
    }
    f.length !== 0 && t.push({ event: e, listeners: f });
  }
  var CT = /\r\n?/g, OT = /\u0000|\uFFFD/g;
  function l0(t) {
    return (typeof t == "string" ? t : "" + t).replace(CT, `
`).replace(OT, "");
  }
  function u0(t, e) {
    return e = l0(e), l0(t) === e;
  }
  function Nt(t, e, n, i, u, s) {
    switch (n) {
      case "children":
        if (typeof i == "string")
          e === "body" || e === "textarea" && i === "" || la(t, i);
        else if (typeof i == "number" || typeof i == "bigint")
          e !== "body" && la(t, "" + i);
        else return;
        break;
      case "className":
        Au(t, "class", i);
        break;
      case "tabIndex":
        Au(t, "tabindex", i);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Au(t, n, i);
        break;
      case "style":
        ed(t, i, s);
        return;
      case "data":
        if (e !== "object") {
          Au(t, "data", i);
          break;
        }
      case "src":
      case "href":
        if (i === "" && (e !== "a" || n !== "href")) {
          t.removeAttribute(n);
          break;
        }
        if (i == null || typeof i == "function" || typeof i == "symbol" || typeof i == "boolean") {
          t.removeAttribute(n);
          break;
        }
        i = Mu(i), t.setAttribute(n, i);
        break;
      case "action":
      case "formAction":
        if (typeof i == "function") {
          t.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof s == "function" && (n === "formAction" ? (e !== "input" && Nt(t, e, "name", u.name, u, null), Nt(
            t,
            e,
            "formEncType",
            u.formEncType,
            u,
            null
          ), Nt(
            t,
            e,
            "formMethod",
            u.formMethod,
            u,
            null
          ), Nt(
            t,
            e,
            "formTarget",
            u.formTarget,
            u,
            null
          )) : (Nt(t, e, "encType", u.encType, u, null), Nt(t, e, "method", u.method, u, null), Nt(t, e, "target", u.target, u, null)));
        if (i == null || typeof i == "symbol" || typeof i == "boolean") {
          t.removeAttribute(n);
          break;
        }
        i = Mu(i), t.setAttribute(n, i);
        break;
      case "onClick":
        i != null && (t.onclick = fn);
        return;
      case "onScroll":
        i != null && vt("scroll", t);
        return;
      case "onScrollEnd":
        i != null && vt("scrollend", t);
        return;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i))
            throw Error(r(61));
          if (n = i.__html, n != null) {
            if (u.children != null) throw Error(r(60));
            s?.__html !== n && (t.innerHTML = n);
          }
        }
        break;
      case "multiple":
        t.multiple = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "muted":
        t.muted = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (i == null || typeof i == "function" || typeof i == "boolean" || typeof i == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        n = Mu(i), t.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          n
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        i != null && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, i) : t.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        i && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, "") : t.removeAttribute(n);
        break;
      case "capture":
      case "download":
        i === !0 ? t.setAttribute(n, "") : i !== !1 && i != null && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, i) : t.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        i != null && typeof i != "function" && typeof i != "symbol" && !isNaN(i) && 1 <= i ? t.setAttribute(n, i) : t.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        i == null || typeof i == "function" || typeof i == "symbol" || isNaN(i) ? t.removeAttribute(n) : t.setAttribute(n, i);
        break;
      case "popover":
        vt("beforetoggle", t), vt("toggle", t), Eu(t, "popover", i);
        break;
      case "xlinkActuate":
        Cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          i
        );
        break;
      case "xlinkArcrole":
        Cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          i
        );
        break;
      case "xlinkRole":
        Cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          i
        );
        break;
      case "xlinkShow":
        Cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          i
        );
        break;
      case "xlinkTitle":
        Cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          i
        );
        break;
      case "xlinkType":
        Cn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          i
        );
        break;
      case "xmlBase":
        Cn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          i
        );
        break;
      case "xmlLang":
        Cn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          i
        );
        break;
      case "xmlSpace":
        Cn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          i
        );
        break;
      case "is":
        Eu(t, "is", i);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N")
          n = J1.get(n) || n, Eu(t, n, i);
        else return;
    }
    Mt = !0;
  }
  function Nc(t, e, n, i, u, s) {
    switch (n) {
      case "style":
        ed(t, i, s);
        return;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i))
            throw Error(r(61));
          if (n = i.__html, n != null) {
            if (u.children != null) throw Error(r(60));
            s?.__html !== n && (t.innerHTML = n);
          }
        }
        break;
      case "children":
        if (typeof i == "string") la(t, i);
        else if (typeof i == "number" || typeof i == "bigint")
          la(t, "" + i);
        else return;
        break;
      case "onScroll":
        i != null && vt("scroll", t);
        return;
      case "onScrollEnd":
        i != null && vt("scrollend", t);
        return;
      case "onClick":
        i != null && (t.onclick = fn);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!Zh.hasOwnProperty(n))
          t: {
            if (n[0] === "o" && n[1] === "n" && (u = n.endsWith("Capture"), s = n.slice(2, u ? n.length - 7 : void 0), e = t[Ee] || null, e = e != null ? e[n] : null, typeof e == "function" && t.removeEventListener(s, e, u), typeof i == "function")) {
              typeof e != "function" && e !== null && (n in t ? t[n] = null : t.hasAttribute(n) && t.removeAttribute(n)), t.addEventListener(s, i, u);
              break t;
            }
            Mt = !0, n in t ? t[n] = i : i === !0 ? t.setAttribute(n, "") : Eu(t, n, i);
          }
        return;
    }
    Mt = !0;
  }
  function he(t, e, n) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        vt("error", t), vt("load", t);
        var i = !1, u = !1, s;
        for (s in n)
          if (n.hasOwnProperty(s)) {
            var f = n[s];
            if (f != null)
              switch (s) {
                case "src":
                  i = !0;
                  break;
                case "srcSet":
                  u = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, e));
                default:
                  Nt(t, e, s, f, n, null);
              }
          }
        u && Nt(t, e, "srcSet", n.srcSet, n, null), i && Nt(t, e, "src", n.src, n, null);
        return;
      case "input":
        vt("invalid", t);
        var m = s = f = u = null, T = null, x = null;
        for (i in n)
          if (n.hasOwnProperty(i)) {
            var z = n[i];
            if (z != null)
              switch (i) {
                case "name":
                  u = z;
                  break;
                case "type":
                  f = z;
                  break;
                case "checked":
                  T = z;
                  break;
                case "defaultChecked":
                  x = z;
                  break;
                case "value":
                  s = z;
                  break;
                case "defaultValue":
                  m = z;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (z != null)
                    throw Error(r(137, e));
                  break;
                default:
                  Nt(t, e, i, z, n, null);
              }
          }
        Wh(
          t,
          s,
          m,
          T,
          x,
          f,
          u,
          !1
        );
        return;
      case "select":
        vt("invalid", t), i = f = s = null;
        for (u in n)
          if (n.hasOwnProperty(u) && (m = n[u], m != null))
            switch (u) {
              case "value":
                s = m;
                break;
              case "defaultValue":
                f = m;
                break;
              case "multiple":
                i = m;
              default:
                Nt(t, e, u, m, n, null);
            }
        e = s, n = f, t.multiple = !!i, e != null ? aa(t, !!i, e, !1) : n != null && aa(t, !!i, n, !0);
        return;
      case "textarea":
        vt("invalid", t), s = u = i = null;
        for (f in n)
          if (n.hasOwnProperty(f) && (m = n[f], m != null))
            switch (f) {
              case "value":
                i = m;
                break;
              case "defaultValue":
                u = m;
                break;
              case "children":
                s = m;
                break;
              case "dangerouslySetInnerHTML":
                if (m != null) throw Error(r(91));
                break;
              default:
                Nt(t, e, f, m, n, null);
            }
        Ih(t, i, u, s);
        return;
      case "option":
        for (T in n)
          n.hasOwnProperty(T) && (i = n[T], i != null) && (T === "selected" ? t.selected = i && typeof i != "function" && typeof i != "symbol" : Nt(t, e, T, i, n, null));
        return;
      case "dialog":
        vt("beforetoggle", t), vt("toggle", t), vt("cancel", t), vt("close", t);
        break;
      case "iframe":
      case "object":
        vt("load", t);
        break;
      case "video":
      case "audio":
        for (i = 0; i < Hl.length; i++)
          vt(Hl[i], t);
        break;
      case "image":
        vt("error", t), vt("load", t);
        break;
      case "details":
        vt("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        vt("error", t), vt("load", t);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (x in n)
          if (n.hasOwnProperty(x) && (i = n[x], i != null))
            switch (x) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, e));
              default:
                Nt(t, e, x, i, n, null);
            }
        return;
      default:
        if (_o(e)) {
          for (z in n)
            n.hasOwnProperty(z) && (i = n[z], i !== void 0 && Nc(
              t,
              e,
              z,
              i,
              n,
              void 0
            ));
          return;
        }
    }
    for (m in n)
      n.hasOwnProperty(m) && (i = n[m], i != null && Nt(t, e, m, i, n, null));
  }
  var zT = {};
  function RT(t, e, n, i) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var u = null, s = null, f = null, m = null, T = null, x = null, z = null;
        for (O in n) {
          var _ = n[O];
          if (n.hasOwnProperty(O) && _ != null)
            switch (O) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                T = _;
              default:
                i.hasOwnProperty(O) || Nt(t, e, O, null, i, _);
            }
        }
        for (var M in i) {
          var O = i[M];
          if (_ = n[M], i.hasOwnProperty(M) && (O != null || _ != null))
            switch (M) {
              case "type":
                O !== _ && (Mt = !0), s = O;
                break;
              case "name":
                O !== _ && (Mt = !0), u = O;
                break;
              case "checked":
                O !== _ && (Mt = !0), x = O;
                break;
              case "defaultChecked":
                O !== _ && (Mt = !0), z = O;
                break;
              case "value":
                O !== _ && (Mt = !0), f = O;
                break;
              case "defaultValue":
                O !== _ && (Mt = !0), m = O;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (O != null)
                  throw Error(r(137, e));
                break;
              default:
                O !== _ && Nt(
                  t,
                  e,
                  M,
                  O,
                  i,
                  _
                );
            }
        }
        No(
          t,
          f,
          m,
          T,
          x,
          z,
          s,
          u
        );
        return;
      case "select":
        O = f = m = M = null;
        for (s in n)
          if (T = n[s], n.hasOwnProperty(s) && T != null)
            switch (s) {
              case "value":
                break;
              case "multiple":
                O = T;
              default:
                i.hasOwnProperty(s) || Nt(
                  t,
                  e,
                  s,
                  null,
                  i,
                  T
                );
            }
        for (u in i)
          if (s = i[u], T = n[u], i.hasOwnProperty(u) && (s != null || T != null))
            switch (u) {
              case "value":
                s !== T && (Mt = !0), M = s;
                break;
              case "defaultValue":
                s !== T && (Mt = !0), m = s;
                break;
              case "multiple":
                s !== T && (Mt = !0), f = s;
              default:
                s !== T && Nt(
                  t,
                  e,
                  u,
                  s,
                  i,
                  T
                );
            }
        e = m, n = f, i = O, M != null ? aa(t, !!n, M, !1) : !!i != !!n && (e != null ? aa(t, !!n, e, !0) : aa(t, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        O = M = null;
        for (m in n)
          if (u = n[m], n.hasOwnProperty(m) && u != null && !i.hasOwnProperty(m))
            switch (m) {
              case "value":
                break;
              case "children":
                break;
              default:
                Nt(t, e, m, null, i, u);
            }
        for (f in i)
          if (u = i[f], s = n[f], i.hasOwnProperty(f) && (u != null || s != null))
            switch (f) {
              case "value":
                u !== s && (Mt = !0), M = u;
                break;
              case "defaultValue":
                u !== s && (Mt = !0), O = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(r(91));
                break;
              default:
                u !== s && Nt(t, e, f, u, i, s);
            }
        $h(t, M, O);
        return;
      case "option":
        for (var Q in n)
          M = n[Q], n.hasOwnProperty(Q) && M != null && !i.hasOwnProperty(Q) && (Q === "selected" ? t.selected = !1 : Nt(
            t,
            e,
            Q,
            null,
            i,
            M
          ));
        for (T in i)
          M = i[T], O = n[T], i.hasOwnProperty(T) && M !== O && (M != null || O != null) && (T === "selected" ? (M !== O && (Mt = !0), t.selected = M && typeof M != "function" && typeof M != "symbol") : Nt(
            t,
            e,
            T,
            M,
            i,
            O
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var F in n)
          M = n[F], n.hasOwnProperty(F) && M != null && !i.hasOwnProperty(F) && Nt(t, e, F, null, i, M);
        for (x in i)
          if (M = i[x], O = n[x], i.hasOwnProperty(x) && M !== O && (M != null || O != null))
            switch (x) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (M != null)
                  throw Error(r(137, e));
                break;
              default:
                Nt(
                  t,
                  e,
                  x,
                  M,
                  i,
                  O
                );
            }
        return;
      default:
        if (_o(e)) {
          for (var dt in n)
            M = n[dt], n.hasOwnProperty(dt) && M !== void 0 && !i.hasOwnProperty(dt) && Nc(
              t,
              e,
              dt,
              void 0,
              i,
              M
            );
          for (z in i)
            M = i[z], O = n[z], !i.hasOwnProperty(z) || M === O || M === void 0 && O === void 0 || Nc(
              t,
              e,
              z,
              M,
              i,
              O
            );
          return;
        }
    }
    for (var D in n)
      M = n[D], n.hasOwnProperty(D) && M != null && !i.hasOwnProperty(D) && Nt(t, e, D, null, i, M);
    for (_ in i)
      M = i[_], O = n[_], !i.hasOwnProperty(_) || M === O || M == null && O == null || Nt(t, e, _, M, i, O);
  }
  function s0(t) {
    switch (t) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function NT() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, e = 0, n = performance.getEntriesByType("resource"), i = 0; i < n.length; i++) {
        var u = n[i], s = u.transferSize, f = u.initiatorType, m = u.duration;
        if (s && m && s0(f)) {
          for (f = 0, m = u.responseEnd, i += 1; i < n.length; i++) {
            var T = n[i], x = T.startTime;
            if (x > m) break;
            var z = T.transferSize, _ = T.initiatorType;
            z && s0(_) && (T = T.responseEnd, f += z * (T < m ? 1 : (m - x) / (T - x)));
          }
          if (--i, e += 8 * (s + f) / (u.duration / 1e3), t++, 10 < t) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
  }
  var Vc = null, _c = null;
  function jl(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function o0(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function r0(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function c0(t, e, n, i) {
    return n = jl(
      n
    ).createElement(t), n[se] = i, n[Ee] = e, he(n, t, e), ne(n), n;
  }
  function Uc(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var Bc = null;
  function VT() {
    var t = window.event;
    return t && t.type === "popstate" ? t === Bc ? !1 : (Bc = t, !0) : (Bc = null, !1);
  }
  var wc = typeof setTimeout == "function" ? setTimeout : void 0, _T = typeof clearTimeout == "function" ? clearTimeout : void 0, f0 = typeof Promise == "function" ? Promise : void 0, h0 = typeof requestAnimationFrame == "function" ? requestAnimationFrame : wc, UT = typeof queueMicrotask == "function" ? queueMicrotask : typeof f0 < "u" ? function(t) {
    return f0.resolve(null).then(t).catch(BT);
  } : wc;
  function BT(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function di(t) {
    return t === "head";
  }
  function d0(t, e) {
    var n = e, i = 0;
    do {
      var u = n.nextSibling;
      if (t.removeChild(n), u && u.nodeType === 8)
        if (n = u.data, n === "/$" || n === "/&") {
          if (i === 0) {
            t.removeChild(u), qa(e);
            return;
          }
          i--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          i++;
        else if (n === "html")
          Qc(
            t.ownerDocument.documentElement
          );
        else if (n === "head") {
          n = t.ownerDocument.head, Qc(n);
          for (var s = n.firstChild; s; ) {
            var f = s.nextSibling, m = s.nodeName;
            s[il] || m === "SCRIPT" || m === "STYLE" || m === "LINK" && s.rel.toLowerCase() === "stylesheet" || n.removeChild(s), s = f;
          }
        } else
          n === "body" && Qc(t.ownerDocument.body);
      n = u;
    } while (n);
    qa(e);
  }
  function m0(t, e) {
    var n = t;
    t = 0;
    do {
      var i = n.nextSibling;
      if (n.nodeType === 1 ? e ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (e ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), i && i.nodeType === 8)
        if (n = i.data, n === "/$") {
          if (t === 0) break;
          t--;
        } else
          n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || t++;
      n = i;
    } while (n);
  }
  function y0(t, e, n) {
    if (e = CSS.escape(e) !== e ? "r-" + btoa(e).replace(/=/g, "") : e, t.style.viewTransitionName = e, n != null && (t.style.viewTransitionClass = n), n = getComputedStyle(t), n.display === "inline") {
      if (e = t.getClientRects(), e.length === 1) var i = 1;
      else
        for (var u = i = 0; u < e.length; u++) {
          var s = e[u];
          0 < s.width && 0 < s.height && i++;
        }
      i === 1 && (t = t.style, t.display = e.length === 1 ? "inline-block" : "block", t.marginTop = "-" + n.paddingTop, t.marginBottom = "-" + n.paddingBottom);
    }
  }
  function g0(t, e) {
    t = t.style, e = e.style;
    var n = e != null ? e.hasOwnProperty("viewTransitionName") ? e.viewTransitionName : e.hasOwnProperty("view-transition-name") ? e["view-transition-name"] : null : null;
    t.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = e != null ? e.hasOwnProperty("viewTransitionClass") ? e.viewTransitionClass : e.hasOwnProperty("view-transition-class") ? e["view-transition-class"] : null : null, t.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), t.display === "inline-block" && (e == null ? t.display = t.margin = "" : (n = e.display, t.display = n == null || typeof n == "boolean" ? "" : n, n = e.margin, n != null ? t.margin = n : (n = e.hasOwnProperty("marginTop") ? e.marginTop : e["margin-top"], t.marginTop = n == null || typeof n == "boolean" ? "" : n, e = e.hasOwnProperty("marginBottom") ? e.marginBottom : e["margin-bottom"], t.marginBottom = e == null || typeof e == "boolean" ? "" : e)));
  }
  function wT(t, e, n) {
    return n = n.ownerDocument.defaultView, {
      rect: t,
      abs: e.position === "absolute" || e.position === "fixed",
      clip: e.clipPath !== "none" || e.overflow !== "visible" || e.filter !== "none" || e.mask !== "none" || e.mask !== "none" || e.borderRadius !== "0px",
      view: 0 <= t.bottom && 0 <= t.right && t.top <= n.innerHeight && t.left <= n.innerWidth
    };
  }
  function Hc(t) {
    var e = t.getBoundingClientRect(), n = getComputedStyle(t);
    return wT(e, n, t);
  }
  function HT(t) {
    return t.documentElement.clientHeight;
  }
  function LT(t) {
    this.addEventListener("load", t), this.addEventListener("error", t);
  }
  function jT(t, e, n, i, u, s, f, m, T) {
    var x = e.nodeType === 9 ? e : e.ownerDocument;
    try {
      var z = x.startViewTransition({
        update: function() {
          var M = x.defaultView, O = M.navigation && M.navigation.transition, Q = x.fonts.status;
          i();
          var F = [];
          if (Q === "loaded" && (HT(x), x.fonts.status === "loading" && F.push(x.fonts.ready)), Q = F.length, t !== null)
            for (var dt = t.suspenseyImages, D = 0, E = 0; E < dt.length; E++) {
              var C = dt[E];
              if (!C.complete) {
                var V = C.getBoundingClientRect();
                if (0 < V.bottom && 0 < V.right && V.top < M.innerHeight && V.left < M.innerWidth) {
                  if (D += H0(C), D > _s) {
                    F.length = Q;
                    break;
                  }
                  C = new Promise(
                    LT.bind(C)
                  ), F.push(C);
                }
              }
            }
          if (0 < F.length)
            return M = Promise.race([
              Promise.all(F),
              new Promise(function(K) {
                return setTimeout(K, 500);
              })
            ]).then(u, u), (O ? Promise.allSettled([O.finished, M]) : M).then(s, s);
          if (u(), O)
            return O.finished.then(
              s,
              s
            );
          s();
        },
        types: n
      });
      x.__reactViewTransition = z;
      var _ = [];
      return z.ready.then(
        function() {
          for (var M = x.documentElement.getAnimations({
            subtree: !0
          }), O = 0; O < M.length; O++) {
            var Q = M[O], F = Q.effect, dt = F.pseudoElement;
            if (dt != null && dt.startsWith("::view-transition")) {
              _.push(Q), Q = F.getKeyframes();
              for (var D = dt = void 0, E = !0, C = 0; C < Q.length; C++) {
                var V = Q[C], K = V.width;
                if (dt === void 0) dt = K;
                else if (dt !== K) {
                  E = !1;
                  break;
                }
                if (K = V.height, D === void 0) D = K;
                else if (D !== K) {
                  E = !1;
                  break;
                }
                delete V.width, delete V.height, V.transform === "none" && delete V.transform;
              }
              E && dt !== void 0 && D !== void 0 && (F.setKeyframes(Q), E = getComputedStyle(
                F.target,
                F.pseudoElement
              ), E.width !== dt || E.height !== D) && (E = Q[0], E.width = dt, E.height = D, E = Q[Q.length - 1], E.width = dt, E.height = D, F.setKeyframes(Q));
            }
          }
          f();
        },
        function(M) {
          x.__reactViewTransition === z && (x.__reactViewTransition = null);
          try {
            typeof M == "object" && M !== null && M.name === "InvalidStateError" && (M.message === "View transition was skipped because document visibility state is hidden." || M.message === "Skipping view transition because document visibility state has become hidden." || M.message === "Skipping view transition because viewport size changed." || M.message === "Transition was aborted because of invalid state") && (M = null), M !== null && T(M);
          } finally {
            i(), u(), f();
          }
        }
      ), z.finished.finally(function() {
        for (var M = 0; M < _.length; M++)
          _[M].cancel();
        x.__reactViewTransition === z && (x.__reactViewTransition = null), m();
      }), z;
    } catch {
      return i(), u(), f(), null;
    }
  }
  function Zi(t, e) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + t + "(" + e + ")";
  }
  Zi.prototype.animate = function(t, e) {
    return e = typeof e == "number" ? { duration: e } : G({}, e), e.pseudoElement = this._selector, this._scope.animate(t, e);
  }, Zi.prototype.getAnimations = function() {
    for (var t = this._scope, e = this._selector, n = t.getAnimations({ subtree: !0 }), i = [], u = 0; u < n.length; u++) {
      var s = n[u].effect;
      s !== null && s.target === t && s.pseudoElement === e && i.push(n[u]);
    }
    return i;
  }, Zi.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function p0(t) {
    return {
      name: t,
      group: new Zi("group", t),
      imagePair: new Zi("image-pair", t),
      old: new Zi("old", t),
      new: new Zi("new", t)
    };
  }
  function Ye(t) {
    this._fragmentFiber = t, this._observers = this._eventListeners = null;
  }
  Ye.prototype.addEventListener = function(t, e, n) {
    var i = null, u = null;
    if (!(n != null && typeof n != "boolean" && (i = n.signal || null, i !== null && i.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var s = this._eventListeners;
      if (S0(s, t, e, n) === -1) {
        var f = this, m = e;
        n != null && typeof n != "boolean" && n.once === !0 && (m = function(T) {
          f.removeEventListener(
            t,
            e,
            n
          ), typeof e == "function" ? e.call(this, T) : e.handleEvent(T);
        }), i !== null && (u = f.removeEventListener.bind(
          f,
          t,
          e,
          n
        ), i.addEventListener("abort", u, { once: !0 }), u = i.removeEventListener.bind(i, "abort", u)), i = wa(n), s.push({
          type: t,
          listener: e,
          optionsOrUseCapture: n,
          attachedListener: m,
          cleanup: u
        }), g(
          this._fragmentFiber.child,
          !1,
          YT,
          t,
          m,
          i
        );
      }
      this._eventListeners = s;
    }
  };
  function YT(t, e, n, i) {
    return U(t).addEventListener(
      e,
      n,
      i
    ), !1;
  }
  Ye.prototype.removeEventListener = function(t, e, n) {
    var i = this._eventListeners;
    if (i !== null && (e = S0(
      i,
      t,
      e,
      n
    ), e !== -1)) {
      var u = i[e];
      n = u.attachedListener;
      var s = u.cleanup;
      u = wa(u.optionsOrUseCapture), g(
        this._fragmentFiber.child,
        !1,
        GT,
        t,
        n,
        u
      ), i.splice(e, 1), s !== null && s();
    }
  };
  function GT(t, e, n, i) {
    return U(t).removeEventListener(
      e,
      n,
      i
    ), !1;
  }
  function wa(t) {
    return t != null && typeof t != "boolean" && (t.once === !0 || t.signal instanceof AbortSignal) ? { capture: t.capture, passive: t.passive } : t;
  }
  function v0(t) {
    return t == null ? "c=0" : typeof t == "boolean" ? "c=" + (t ? "1" : "0") : "c=" + (t.capture ? "1" : "0");
  }
  function S0(t, e, n, i) {
    if (t.length === 0) return -1;
    i = v0(i);
    for (var u = 0; u < t.length; u++) {
      var s = t[u];
      if (s.type === e && s.listener === n && v0(s.optionsOrUseCapture) === i)
        return u;
    }
    return -1;
  }
  Ye.prototype.dispatchEvent = function(t) {
    var e = b(
      this._fragmentFiber
    );
    if (e === null) return !0;
    e = U(e);
    var n = this._eventListeners;
    if (n !== null && 0 < n.length || !t.bubbles) {
      var i = e.nodeType === 9 ? e.createComment("") : document.createTextNode("");
      if (n)
        for (var u = 0; u < n.length; u++) {
          var s = n[u];
          i.addEventListener(
            s.type,
            s.attachedListener,
            wa(s.optionsOrUseCapture)
          );
        }
      if (e.appendChild(i), t = i.dispatchEvent(t), n)
        for (u = 0; u < n.length; u++)
          s = n[u], i.removeEventListener(
            s.type,
            s.attachedListener,
            wa(s.optionsOrUseCapture)
          );
      return e.removeChild(i), t;
    }
    return e.dispatchEvent(t);
  }, Ye.prototype.focus = function(t) {
    g(
      this._fragmentFiber.child,
      !0,
      T0,
      t,
      void 0,
      void 0
    );
  };
  function T0(t, e) {
    return t.tag === 6 ? !1 : (t = U(t), IT(t, e));
  }
  Ye.prototype.focusLast = function(t) {
    var e = [];
    g(
      this._fragmentFiber.child,
      !0,
      Lc,
      e,
      void 0,
      void 0
    );
    for (var n = e.length - 1; 0 <= n && !T0(e[n], t); n--) ;
  };
  function Lc(t, e) {
    return e.push(t), !1;
  }
  Ye.prototype.blur = function() {
    var t = b(
      this._fragmentFiber
    );
    t !== null && (t = U(t), t = jl(t).activeElement, t !== null && g(
      this._fragmentFiber.child,
      !1,
      qT,
      t,
      void 0,
      void 0
    ));
  };
  function qT(t, e) {
    return t.tag === 6 ? !1 : (t = U(t), t === e || t.contains(e) ? (e.blur(), !0) : !1);
  }
  Ye.prototype.observeUsing = function(t) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(t), g(
      this._fragmentFiber.child,
      !1,
      XT,
      t,
      void 0,
      void 0
    );
  };
  function XT(t, e) {
    return t.tag === 6 || (t = U(t), e.observe(t)), !1;
  }
  Ye.prototype.unobserveUsing = function(t) {
    var e = this._observers;
    if (e !== null && e.has(t)) {
      e.delete(t), g(
        this._fragmentFiber.child,
        !1,
        QT,
        t,
        void 0,
        void 0
      );
      for (var n = e = 0; n < un.length; n++) {
        var i = un[n];
        i.fragmentInstance === this && i.observer === t ? t.unobserve(i.instance) : un[e++] = i;
      }
      un.length = e;
    }
  };
  function QT(t, e) {
    return t.tag === 6 || (t = U(t), e.unobserve(t)), !1;
  }
  var un = [], jc = !1;
  function ZT(t, e, n) {
    un.push({
      fragmentInstance: t,
      observer: e,
      instance: n
    }), jc || (jc = !0, tb(function() {
      jc = !1;
      var i = un;
      un = [];
      for (var u = 0; u < i.length; u++) {
        var s = i[u];
        s.observer.unobserve(s.instance);
      }
    }));
  }
  Ye.prototype.getClientRects = function() {
    var t = [];
    return g(
      this._fragmentFiber.child,
      !1,
      KT,
      t,
      void 0,
      void 0
    ), t;
  };
  function KT(t, e) {
    if (t.tag === 6) {
      t = t.stateNode;
      var n = t.ownerDocument.createRange();
      n.selectNodeContents(t), e.push.apply(e, n.getClientRects());
    } else
      t = U(t), e.push.apply(e, t.getClientRects());
    return !1;
  }
  Ye.prototype.getRootNode = function(t) {
    var e = b(
      this._fragmentFiber
    );
    return e === null ? this : U(e).getRootNode(t);
  }, Ye.prototype.compareDocumentPosition = function(t) {
    var e = b(
      this._fragmentFiber
    );
    if (e === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var n = [];
    g(
      this._fragmentFiber.child,
      !1,
      Lc,
      n,
      void 0,
      void 0
    );
    var i = U(e);
    if (n.length === 0) {
      if (n = i, N(this._fragmentFiber)) {
        t: {
          for (e = this._fragmentFiber.return; e !== null; ) {
            if (e.tag === 4) {
              e = e.stateNode.containerInfo;
              break t;
            }
            if (e.tag === 3 || e.tag === 5 || e.tag === 27)
              break;
            e = e.return;
          }
          e = null;
        }
        e != null && (n = e);
      }
      e = this._fragmentFiber;
      var u = i = n.compareDocumentPosition(t);
      return n === t ? u = Node.DOCUMENT_POSITION_CONTAINS : i & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = R(e)[1], n === null ? u = Node.DOCUMENT_POSITION_PRECEDING : (t = U(n).compareDocumentPosition(
        t
      ), u = t === 0 || t & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), u |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    e = U(n[0]), u = U(n[n.length - 1]);
    var s = N(this._fragmentFiber) ? e.parentElement : i;
    if (s == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    i = s.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY, s = s.compareDocumentPosition(u) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var f = e.compareDocumentPosition(t), m = u.compareDocumentPosition(t), T = f & Node.DOCUMENT_POSITION_CONTAINED_BY || m & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return m = i && s && f & Node.DOCUMENT_POSITION_FOLLOWING && m & Node.DOCUMENT_POSITION_PRECEDING, e = i && e === t || s && u === t || T || m ? Node.DOCUMENT_POSITION_CONTAINED_BY : !i && e === t || !s && u === t ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : f, e & Node.DOCUMENT_POSITION_DISCONNECTED || e & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || JT(
      e,
      this._fragmentFiber,
      n[0],
      n[n.length - 1],
      t
    ) ? e : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function JT(t, e, n, i, u) {
    var s = Mi(u);
    if (t & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (n = !!s)
        t: {
          for (; s !== null; ) {
            if (s.tag === 7 && (s === e || s.alternate === e)) {
              n = !0;
              break t;
            }
            s = s.return;
          }
          n = !1;
        }
      return n;
    }
    if (t & Node.DOCUMENT_POSITION_CONTAINS) {
      if (s === null)
        return s = u.ownerDocument, u === s || u === s.documentElement || u === s.body;
      t: {
        for (s = e, e = b(e); s !== null; ) {
          if (!(s.tag !== 5 && s.tag !== 3 && s.tag !== 27 || s !== e && s.alternate !== e)) {
            s = !0;
            break t;
          }
          s = s.return;
        }
        s = !1;
      }
      return s;
    }
    return t & Node.DOCUMENT_POSITION_PRECEDING ? ((e = !!s) && !(e = s === n) && (e = st(
      n,
      s,
      et
    ), e === null ? e = !1 : (g(
      e,
      !0,
      Y,
      s,
      n
    ), s = w, w = null, e = s !== null)), e) : t & Node.DOCUMENT_POSITION_FOLLOWING ? ((e = !!s) && !(e = s === i) && (e = st(
      i,
      s,
      et
    ), e === null ? e = !1 : (g(
      e,
      !0,
      q,
      s,
      i
    ), s = w, L = w = null, e = s !== null)), e) : !1;
  }
  function b0(t, e) {
    var n = t.ownerDocument.createRange();
    n.selectNodeContents(t), t = n.getBoundingClientRect(), window.scrollTo(
      window.scrollX + t.left,
      e ? window.scrollY + t.top : window.scrollY + t.bottom - window.innerHeight
    );
  }
  Ye.prototype.scrollIntoView = function(t) {
    if (typeof t == "object") throw Error(r(566));
    var e = [];
    g(
      this._fragmentFiber.child,
      !1,
      Lc,
      e,
      void 0,
      void 0
    );
    var n = t !== !1;
    if (e.length === 0) {
      var i = R(
        this._fragmentFiber
      );
      if (i = n ? i[1] || i[0] || b(this._fragmentFiber) : i[0] || i[1], i === null) return;
      if (i.tag === 6) {
        t = U(i), b0(t, n);
        return;
      }
      if (i = U(i), i.nodeType !== 9) {
        if (i.nodeType === 11) {
          n = "host" in i ? i.host : null, n !== null && n.scrollIntoView(t);
          return;
        }
        i.scrollIntoView(t);
      }
    }
    for (i = n ? e.length - 1 : 0; i !== (n ? -1 : e.length); ) {
      var u = e[i];
      u.tag === 6 ? (u = U(u), b0(u, n)) : U(u).scrollIntoView(t), i += n ? -1 : 1;
    }
  };
  function FT(t, e) {
    return t = U(t), E0(t, e), !1;
  }
  function E0(t, e) {
    t.reactFragments == null && (t.reactFragments = /* @__PURE__ */ new Set()), t.reactFragments.add(e);
  }
  function A0(t, e) {
    var n = e._eventListeners;
    if (n !== null)
      for (var i = 0; i < n.length; i++) {
        var u = n[i];
        t.addEventListener(
          u.type,
          u.attachedListener,
          wa(u.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (n = e._observers, n !== null && n.forEach(function(s) {
      for (var f = 0, m = 0; m < un.length; m++) {
        var T = un[m];
        (T.fragmentInstance !== e || T.observer !== s || T.instance !== t) && (un[f++] = T);
      }
      un.length = f, s.observe(t);
    }), E0(t, e));
  }
  function PT(t, e) {
    var n = e._eventListeners;
    if (n !== null)
      for (var i = 0; i < n.length; i++) {
        var u = n[i];
        t.removeEventListener(
          u.type,
          u.attachedListener,
          wa(u.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (n = e._observers, n !== null && n.forEach(function(s) {
      typeof s.rootMargin == "string" ? ZT(
        e,
        s,
        t
      ) : s.unobserve(t);
    }), t.reactFragments != null && t.reactFragments.delete(e));
  }
  function Yc(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var n = e;
      switch (e = e.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Yc(n), bu(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(n);
    }
  }
  function kT(t, e, n, i) {
    for (; t.nodeType === 1; ) {
      var u = n;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!i && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (i) {
        if (!t[il])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (s = t.getAttribute("rel"), s === "stylesheet" && t.hasAttribute("data-precedence"))
                break;
              if (s !== u.rel || t.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || t.getAttribute("title") !== (u.title == null ? null : u.title))
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (s = t.getAttribute("src"), (s !== (u.src == null ? null : u.src) || t.getAttribute("type") !== (u.type == null ? null : u.type) || t.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && s && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var s = u.name == null ? null : "" + u.name;
        if (u.type === "hidden" && t.getAttribute("name") === s)
          return t;
      } else return t;
      if (t = ke(t.nextSibling), t === null) break;
    }
    return null;
  }
  function WT(t, e, n) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !n || (t = ke(t.nextSibling), t === null)) return null;
    return t;
  }
  function M0(t, e) {
    for (; t.nodeType !== 8; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = ke(t.nextSibling), t === null)) return null;
    return t;
  }
  function Gc(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function qc(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
  }
  function $T(t, e) {
    var n = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = e;
    else if (t.data !== "$?" || n.readyState !== "loading")
      e();
    else {
      var i = function() {
        e(), n.removeEventListener("DOMContentLoaded", i);
      };
      n.addEventListener("DOMContentLoaded", i), t._reactRetry = i;
    }
  }
  function ke(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F")
          break;
        if (e === "/$" || e === "/&") return null;
      }
    }
    return t;
  }
  var Xc = null;
  function D0(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "/$" || n === "/&") {
          if (e === 0)
            return ke(t.nextSibling);
          e--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function x0(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (e === 0) return t;
          e--;
        } else n !== "/$" && n !== "/&" || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function IT(t, e) {
    function n() {
      i = !0;
    }
    if (t.ownerDocument.activeElement === t) return !0;
    var i = !1;
    try {
      t.ownerDocument.addEventListener("focus", n, !0), (t.focus || HTMLElement.prototype.focus).call(t, e);
    } finally {
      t.ownerDocument.removeEventListener("focus", n, !0);
    }
    return i;
  }
  function tb(t) {
    h0(function() {
      h0(function(e) {
        return t(e);
      });
    });
  }
  function C0(t, e, n) {
    switch (e = jl(n), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(r(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(r(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(r(454));
        return t;
      default:
        throw Error(r(451));
    }
  }
  function O0(t, e, n) {
    for (var i in n) {
      var u = n[i];
      n.hasOwnProperty(i) && u != null && Nt(t, e, i, null, zT, u);
    }
    n.dangerouslySetInnerHTML != null && (t.textContent = ""), t.onclick === fn && (t.onclick = null), bu(t);
  }
  function Qc(t) {
    for (var e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    bu(t);
  }
  var We = /* @__PURE__ */ new Map(), z0 = /* @__PURE__ */ new Set();
  function Yl(t) {
    if (typeof t.getRootNode == "function") {
      var e = t.getRootNode();
      if (e.nodeType === 9 || e.nodeType === 11) return e;
    }
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  var Yn = at.d;
  at.d = {
    f: eb,
    r: nb,
    D: ib,
    C: ab,
    L: lb,
    m: ub,
    X: ob,
    S: sb,
    M: rb
  };
  function eb() {
    var t = Yn.f(), e = Ms();
    return t || e;
  }
  function nb(t) {
    var e = ea(t);
    e !== null && e.tag === 5 && e.type === "form" ? Nm(e) : Yn.r(t);
  }
  var Ha = typeof document > "u" ? null : document;
  function R0(t, e, n) {
    var i = Ha;
    if (i && typeof e == "string" && e) {
      var u = Xe(e);
      u = 'link[rel="' + t + '"][href="' + u + '"]', typeof n == "string" && (u += '[crossorigin="' + n + '"]'), z0.has(u) || (z0.add(u), t = { rel: t, crossOrigin: n, href: e }, i.querySelector(u) === null && (e = i.createElement("link"), he(e, "link", t), ne(e), i.head.appendChild(e)));
    }
  }
  function ib(t) {
    Yn.D(t), R0("dns-prefetch", t, null);
  }
  function ab(t, e) {
    Yn.C(t, e), R0("preconnect", t, e);
  }
  function lb(t, e, n) {
    Yn.L(t, e, n);
    var i = Ha;
    if (i && t && e) {
      var u = 'link[rel="preload"][as="' + Xe(e) + '"]';
      e === "image" && n && n.imageSrcSet ? (u += '[imagesrcset="' + Xe(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (u += '[imagesizes="' + Xe(
        n.imageSizes
      ) + '"]')) : u += '[href="' + Xe(t) + '"]';
      var s = u;
      switch (e) {
        case "style":
          s = La(t);
          break;
        case "script":
          s = ja(t);
      }
      if (!(We.has(s) || (t = G(
        {
          rel: "preload",
          href: e === "image" && n && n.imageSrcSet ? void 0 : t,
          as: e
        },
        n
      ), We.set(s, t), i.querySelector(u) !== null || e === "style" && i.querySelector(Gl(s)) || e === "script" && i.querySelector(ql(s))))) {
        var f = i.createElement("link");
        he(f, "link", t), e === "style" && (f[Tu] = !0, f.onload = f.onerror = function() {
          Xh(f);
        }), ne(f), i.head.appendChild(f);
      }
    }
  }
  function ub(t, e) {
    Yn.m(t, e);
    var n = Ha;
    if (n && t) {
      var i = e && typeof e.as == "string" ? e.as : "script", u = 'link[rel="modulepreload"][as="' + Xe(i) + '"][href="' + Xe(t) + '"]', s = u;
      switch (i) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          s = ja(t);
      }
      if (!We.has(s) && (t = G({ rel: "modulepreload", href: t }, e), We.set(s, t), n.querySelector(u) === null)) {
        switch (i) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(ql(s)))
              return;
        }
        i = n.createElement("link"), he(i, "link", t), ne(i), n.head.appendChild(i);
      }
    }
  }
  function sb(t, e, n) {
    Yn.S(t, e, n);
    var i = Ha;
    if (i && t) {
      var u = na(i).hoistableStyles, s = La(t);
      e = e || "default";
      var f = u.get(s);
      if (!f) {
        var m = { loading: 0, preload: null };
        if (f = i.querySelector(
          Gl(s)
        ))
          m.loading = 5;
        else {
          t = G(
            { rel: "stylesheet", href: t, "data-precedence": e },
            n
          ), (n = We.get(s)) && Zc(t, n);
          var T = f = i.createElement("link");
          ne(T), he(T, "link", t), T._p = new Promise(function(x, z) {
            T.onload = x, T.onerror = z;
          }), T.addEventListener("load", function() {
            m.loading |= 1;
          }), T.addEventListener("error", function() {
            m.loading |= 2;
          }), m.loading |= 4, Ns(f, e, i);
        }
        f = {
          type: "stylesheet",
          instance: f,
          count: 1,
          state: m
        }, u.set(s, f);
      }
    }
  }
  function ob(t, e) {
    Yn.X(t, e);
    var n = Ha;
    if (n && t) {
      var i = na(n).hoistableScripts, u = ja(t), s = i.get(u);
      s || (s = n.querySelector(ql(u)), s || (t = G({ src: t, async: !0 }, e), (e = We.get(u)) && Kc(t, e), s = n.createElement("script"), ne(s), he(s, "link", t), n.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, i.set(u, s));
    }
  }
  function rb(t, e) {
    Yn.M(t, e);
    var n = Ha;
    if (n && t) {
      var i = na(n).hoistableScripts, u = ja(t), s = i.get(u);
      s || (s = n.querySelector(ql(u)), s || (t = G({ src: t, async: !0, type: "module" }, e), (e = We.get(u)) && Kc(t, e), s = n.createElement("script"), ne(s), he(s, "link", t), n.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, i.set(u, s));
    }
  }
  function N0(t, e, n, i) {
    var u = (u = Qn.current) ? Yl(u) : null;
    if (!u) throw Error(r(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (n = La(n.href), e = na(
          u
        ).hoistableStyles, i = e.get(n), i || (i = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, e.set(n, i)), i) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          t = La(n.href);
          var s = na(
            u
          ).hoistableStyles, f = s.get(t);
          if (f || (u = u.ownerDocument || u, f = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, s.set(t, f), (s = u.querySelector(
            Gl(t)
          )) ? s._p || (f.instance = s, f.state.loading = 5) : (s = We.get(t), s || (s = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, We.set(t, s)), cb(
            u,
            t,
            s,
            f.state
          ))), e && i === null)
            throw Error(r(528, ""));
          return f;
        }
        if (e && i !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return e = n.async, n = n.src, typeof n == "string" && e && typeof e != "function" && typeof e != "symbol" ? (n = ja(n), e = na(
          u
        ).hoistableScripts, i = e.get(n), i || (i = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, e.set(n, i)), i) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, t));
    }
  }
  function La(t) {
    return 'href="' + Xe(t) + '"';
  }
  function Gl(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function V0(t) {
    return G({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function cb(t, e, n, i) {
    if (e = t.querySelector(
      'link[rel="preload"][as="style"][' + e + "]"
    )) {
      if (e[Tu] !== !0) {
        i.loading = 1;
        return;
      }
    } else
      e = t.createElement("link"), e[Tu] = !0, e.onload = e.onerror = Xh.bind(null, e), he(e, "link", n), ne(e), t.head.appendChild(e);
    i.preload = e, e.addEventListener("load", function() {
      return i.loading |= 1;
    }), e.addEventListener("error", function() {
      return i.loading |= 2;
    });
  }
  function ja(t) {
    return '[src="' + Xe(t) + '"]';
  }
  function ql(t) {
    return "script[async]" + t;
  }
  function _0(t, e, n) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var i = t.querySelector(
            'style[data-href~="' + Xe(n.href) + '"]'
          );
          if (i)
            return e.instance = i, ne(i), i;
          var u = G({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return i = (t.ownerDocument || t).createElement(
            "style"
          ), ne(i), he(i, "style", u), Ns(i, n.precedence, t), e.instance = i;
        case "stylesheet":
          u = La(n.href);
          var s = t.querySelector(
            Gl(u)
          );
          if (s)
            return e.state.loading |= 4, e.instance = s, ne(s), s;
          i = V0(n), (u = We.get(u)) && Zc(i, u), s = (t.ownerDocument || t).createElement("link"), ne(s);
          var f = s;
          return f._p = new Promise(function(m, T) {
            f.onload = m, f.onerror = T;
          }), he(s, "link", i), e.state.loading |= 4, Ns(s, n.precedence, t), e.instance = s;
        case "script":
          return s = ja(n.src), (u = t.querySelector(
            ql(s)
          )) ? (e.instance = u, ne(u), u) : (i = n, (u = We.get(s)) && (i = G({}, n), Kc(i, u)), t = t.ownerDocument || t, u = t.createElement("script"), ne(u), he(u, "link", i), t.head.appendChild(u), e.instance = u);
        case "void":
          return null;
        default:
          throw Error(r(443, e.type));
      }
    else
      e.type === "stylesheet" && (e.state.loading & 4) === 0 && (i = e.instance, e.state.loading |= 4, Ns(i, n.precedence, t));
    return e.instance;
  }
  function Ns(t, e, n) {
    for (var i = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), u = i.length ? i[i.length - 1] : null, s = u, f = 0; f < i.length; f++) {
      var m = i[f];
      if (m.dataset.precedence === e) s = m;
      else if (s !== u) break;
    }
    s ? s.parentNode.insertBefore(t, s.nextSibling) : (e = n.nodeType === 9 ? n.head : n, e.insertBefore(t, e.firstChild));
  }
  function Zc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function Kc(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var Vs = null;
  function U0(t, e, n) {
    if (Vs === null) {
      var i = /* @__PURE__ */ new Map(), u = Vs = /* @__PURE__ */ new Map();
      u.set(n, i);
    } else
      u = Vs, i = u.get(n), i || (i = /* @__PURE__ */ new Map(), u.set(n, i));
    if (i.has(t)) return i;
    for (i.set(t, null), n = n.getElementsByTagName(t), u = 0; u < n.length; u++) {
      var s = n[u];
      if (!(s[il] || s[se] || t === "link" && s.getAttribute("rel") === "stylesheet") && s.namespaceURI !== "http://www.w3.org/2000/svg") {
        var f = s.getAttribute(e) || "";
        f = t + f;
        var m = i.get(f);
        m ? m.push(s) : i.set(f, [s]);
      }
    }
    return i;
  }
  function Jc(t, e, n) {
    t = t.ownerDocument || t, t.head.insertBefore(
      n,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function fb(t, e, n) {
    if (n === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "")
          break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
          break;
        return e.rel === "stylesheet" ? (t = e.disabled, typeof e.precedence == "string" && t == null) : !0;
      case "script":
        if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string")
          return !0;
    }
    return !1;
  }
  function B0(t, e) {
    return t === "img" && e.src != null && e.src !== "" && e.onLoad == null && e.loading !== "lazy";
  }
  function w0(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function H0(t) {
    return (t.width || 100) * (t.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function L0(t, e) {
    typeof e.decode == "function" && (t.imgCount++, e.complete || (t.imgBytes += H0(e), t.suspenseyImages.push(e)), t = mb.bind(t), e.decode().then(t, t));
  }
  function hb(t, e, n, i) {
    if (n.type === "stylesheet" && (typeof i.media != "string" || matchMedia(i.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var u = La(i.href), s = e.querySelector(
          Gl(u)
        );
        if (s) {
          e = s._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = Xl.bind(t), e.then(t, t)), n.state.loading |= 4, n.instance = s, ne(s);
          return;
        }
        s = e.ownerDocument || e, i = V0(i), (u = We.get(u)) && Zc(i, u), s = s.createElement("link"), ne(s);
        var f = s;
        f._p = new Promise(function(m, T) {
          f.onload = m, f.onerror = T;
        }), he(s, "link", i), n.instance = s;
      }
      t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(n, e), (e = n.state.preload) && (n.state.loading & 3) === 0 && (t.count++, n = Xl.bind(t), e.addEventListener("load", n), e.addEventListener("error", n));
    }
  }
  var _s = 0;
  function db(t, e) {
    return t.stylesheets && t.count === 0 && Bs(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(n) {
      var i = setTimeout(function() {
        if (t.stylesheets && Bs(t, t.stylesheets), t.unsuspend) {
          var s = t.unsuspend;
          t.unsuspend = null, s();
        }
      }, 6e4 + e);
      0 < t.imgBytes && _s === 0 && (_s = 62500 * NT());
      var u = setTimeout(
        function() {
          if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && Bs(t, t.stylesheets), t.unsuspend)) {
            var s = t.unsuspend;
            t.unsuspend = null, s();
          }
        },
        (t.imgBytes > _s ? 50 : 800) + e
      );
      return t.unsuspend = n, function() {
        t.unsuspend = null, clearTimeout(i), clearTimeout(u);
      };
    } : null;
  }
  function j0(t) {
    if (t.count === 0 && (t.imgCount === 0 || !t.waitingForImages)) {
      if (t.stylesheets) Bs(t, t.stylesheets);
      else if (t.unsuspend) {
        var e = t.unsuspend;
        t.unsuspend = null, e();
      }
    }
  }
  function Xl() {
    this.count--, j0(this);
  }
  function mb() {
    this.imgCount--, j0(this);
  }
  var Us = null;
  function Bs(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, Us = /* @__PURE__ */ new Map(), e.forEach(yb, t), Us = null, Xl.call(t));
  }
  function yb(t, e) {
    if (!(e.state.loading & 4)) {
      var n = Us.get(t);
      if (n) var i = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), Us.set(t, n);
        for (var u = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), s = 0; s < u.length; s++) {
          var f = u[s];
          (f.nodeName === "LINK" || f.getAttribute("media") !== "not all") && (n.set(f.dataset.precedence, f), i = f);
        }
        i && n.set(null, i);
      }
      u = e.instance, f = u.getAttribute("data-precedence"), s = n.get(f) || i, s === i && n.set(null, u), n.set(f, u), this.count++, i = Xl.bind(this), u.addEventListener("load", i), u.addEventListener("error", i), s ? s.parentNode.insertBefore(u, s.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(u, t.firstChild)), e.state.loading |= 4;
    }
  }
  var Ya = {
    $$typeof: mt,
    Provider: null,
    Consumer: null,
    _currentValue: qe,
    _currentValue2: qe,
    _threadCount: 0
  };
  function gb(t, e, n, i, u, s, f, m, T) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Co(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Co(0), this.hiddenUpdates = Co(null), this.identifierPrefix = i, this.onUncaughtError = u, this.onCaughtError = s, this.onRecoverableError = f, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = T, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Y0(t, e, n, i, u, s, f, m, T, x, z, _) {
    return t = new gb(
      t,
      e,
      n,
      f,
      T,
      x,
      z,
      _,
      m
    ), e = 1, s === !0 && (e |= 24), s = Ae(3, null, null, e), t.current = s, s.stateNode = t, e = or(), e.refCount++, t.pooledCache = e, e.refCount++, s.memoizedState = {
      element: i,
      isDehydrated: n,
      cache: e
    }, hr(s), t;
  }
  function G0(t) {
    return t ? (t = ha, t) : ha;
  }
  function q0(t, e, n, i, u, s) {
    u = G0(u), i.context === null ? i.context = u : i.pendingContext = u, i = ei(e), i.payload = { element: n }, s = s === void 0 ? null : s, s !== null && (i.callback = s), n = ni(t, i, e), n !== null && (Ce(n, t, e), Tl(n, t, e));
  }
  function X0(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var n = t.retryLane;
      t.retryLane = n !== 0 && n < e ? n : e;
    }
  }
  function Fc(t, e) {
    X0(t, e), (t = t.alternate) && X0(t, e);
  }
  function Q0(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Oi(t, 67108864);
      e !== null && Ce(e, t, 67108864), Fc(t, 67108864);
    }
  }
  function Z0(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = je();
      e = Oo(e);
      var n = Oi(t, e);
      n !== null && Ce(n, t, e), Fc(t, e);
    }
  }
  var Ga = !0;
  function pb(t, e, n, i) {
    var u = $.T;
    $.T = null;
    var s = at.p;
    try {
      at.p = 2, Pc(t, e, n, i);
    } finally {
      at.p = s, $.T = u;
    }
  }
  function vb(t, e, n, i) {
    var u = $.T;
    $.T = null;
    var s = at.p;
    try {
      at.p = 8, Pc(t, e, n, i);
    } finally {
      at.p = s, $.T = u;
    }
  }
  function Pc(t, e, n, i) {
    if (Ga) {
      var u = kc(i);
      if (u === null)
        Rc(
          t,
          e,
          i,
          ws,
          n
        ), J0(t, i);
      else if (Tb(
        u,
        t,
        e,
        n,
        i
      ))
        i.stopPropagation();
      else if (J0(t, i), e & 4 && -1 < Sb.indexOf(t)) {
        for (; u !== null; ) {
          var s = ea(u);
          if (s !== null)
            switch (s.tag) {
              case 3:
                if (s = s.stateNode, s.current.memoizedState.isDehydrated) {
                  var f = Ai(s.pendingLanes);
                  if (f !== 0) {
                    var m = s;
                    for (m.pendingLanes |= 2, m.entangledLanes |= 2; f; ) {
                      var T = 1 << 31 - Ve(f);
                      m.entanglements[1] |= T, f &= ~T;
                    }
                    bn(s), (xt & 6) === 0 && (bs = Re() + 500, wl(0));
                  }
                }
                break;
              case 31:
              case 13:
                m = Oi(s, 2), m !== null && Ce(m, s, 2), Ms(), Fc(s, 2);
            }
          if (s = kc(i), s === null && Rc(
            t,
            e,
            i,
            ws,
            n
          ), s === u) break;
          u = s;
        }
        u !== null && i.stopPropagation();
      } else
        Rc(
          t,
          e,
          i,
          null,
          n
        );
    }
  }
  function kc(t) {
    return t = Bo(t), Wc(t);
  }
  var ws = null;
  function Wc(t) {
    if (ws = null, t = Mi(t), t !== null) {
      var e = d(t);
      if (e === null) t = null;
      else {
        var n = e.tag;
        if (n === 13) {
          if (t = h(e), t !== null) return t;
          t = null;
        } else if (n === 31) {
          if (t = y(e), t !== null) return t;
          t = null;
        } else if (n === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return ws = t, null;
  }
  function K0(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (N1()) {
          case Nh:
            return 2;
          case Vh:
            return 8;
          case yu:
          case V1:
            return 32;
          case _h:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var $c = !1, mi = null, yi = null, gi = null, Ql = /* @__PURE__ */ new Map(), Zl = /* @__PURE__ */ new Map(), pi = [], Sb = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function J0(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        mi = null;
        break;
      case "dragenter":
      case "dragleave":
        yi = null;
        break;
      case "mouseover":
      case "mouseout":
        gi = null;
        break;
      case "pointerover":
      case "pointerout":
        Ql.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Zl.delete(e.pointerId);
    }
  }
  function Kl(t, e, n, i, u, s) {
    return t === null || t.nativeEvent !== s ? (t = {
      blockedOn: e,
      domEventName: n,
      eventSystemFlags: i,
      nativeEvent: s,
      targetContainers: [u]
    }, e !== null && (e = ea(e), e !== null && Q0(e)), t) : (t.eventSystemFlags |= i, e = t.targetContainers, u !== null && e.indexOf(u) === -1 && e.push(u), t);
  }
  function Tb(t, e, n, i, u) {
    switch (e) {
      case "focusin":
        return mi = Kl(
          mi,
          t,
          e,
          n,
          i,
          u
        ), !0;
      case "dragenter":
        return yi = Kl(
          yi,
          t,
          e,
          n,
          i,
          u
        ), !0;
      case "mouseover":
        return gi = Kl(
          gi,
          t,
          e,
          n,
          i,
          u
        ), !0;
      case "pointerover":
        var s = u.pointerId;
        return Ql.set(
          s,
          Kl(
            Ql.get(s) || null,
            t,
            e,
            n,
            i,
            u
          )
        ), !0;
      case "gotpointercapture":
        return s = u.pointerId, Zl.set(
          s,
          Kl(
            Zl.get(s) || null,
            t,
            e,
            n,
            i,
            u
          )
        ), !0;
    }
    return !1;
  }
  function F0(t) {
    var e = Mi(t.target);
    if (e !== null) {
      var n = d(e);
      if (n !== null) {
        if (e = n.tag, e === 13) {
          if (e = h(n), e !== null) {
            t.blockedOn = e, Yh(t.priority, function() {
              Z0(n);
            });
            return;
          }
        } else if (e === 31) {
          if (e = y(n), e !== null) {
            t.blockedOn = e, Yh(t.priority, function() {
              Z0(n);
            });
            return;
          }
        } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Hs(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var n = kc(t.nativeEvent);
      if (n === null) {
        n = t.nativeEvent;
        var i = new n.constructor(
          n.type,
          n
        );
        Uo = i, n.target.dispatchEvent(i), Uo = null;
      } else
        return e = ea(n), e !== null && Q0(e), t.blockedOn = n, !1;
      e.shift();
    }
    return !0;
  }
  function P0(t, e, n) {
    Hs(t) && n.delete(e);
  }
  function bb() {
    $c = !1, mi !== null && Hs(mi) && (mi = null), yi !== null && Hs(yi) && (yi = null), gi !== null && Hs(gi) && (gi = null), Ql.forEach(P0), Zl.forEach(P0);
  }
  function Ls(t, e) {
    t.blockedOn === e && (t.blockedOn = null, $c || ($c = !0, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      bb
    )));
  }
  var js = null;
  function k0(t) {
    js !== t && (js = t, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      function() {
        js === t && (js = null);
        for (var e = 0; e < t.length; e += 3) {
          var n = t[e], i = t[e + 1], u = t[e + 2];
          if (typeof i != "function") {
            if (Wc(i || n) === null)
              continue;
            break;
          }
          var s = ea(n);
          s !== null && (t.splice(e, 3), e -= 3, _r(
            s,
            {
              pending: !0,
              data: u,
              method: n.method,
              action: i
            },
            i,
            u
          ));
        }
      }
    ));
  }
  function qa(t) {
    function e(T) {
      return Ls(T, t);
    }
    mi !== null && Ls(mi, t), yi !== null && Ls(yi, t), gi !== null && Ls(gi, t), Ql.forEach(e), Zl.forEach(e);
    for (var n = 0; n < pi.length; n++) {
      var i = pi[n];
      i.blockedOn === t && (i.blockedOn = null);
    }
    for (; 0 < pi.length && (n = pi[0], n.blockedOn === null); )
      F0(n), n.blockedOn === null && pi.shift();
    if (n = (t.ownerDocument || t).$$reactFormReplay, n != null)
      for (i = 0; i < n.length; i += 3) {
        var u = n[i], s = n[i + 1], f = u[Ee] || null;
        if (typeof s == "function")
          f || k0(n);
        else if (f) {
          var m = null;
          if (s && s.hasAttribute("formAction")) {
            if (u = s, f = s[Ee] || null)
              m = f.formAction;
            else if (Wc(u) !== null) continue;
          } else m = f.action;
          typeof m == "function" ? n[i + 1] = m : (n.splice(i, 3), i -= 3), k0(n);
        }
      }
  }
  function W0() {
    function t(s) {
      s.canIntercept && s.info === "react-transition" && s.intercept({
        handler: function() {
          return new Promise(function(f) {
            return u = f;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function e() {
      u !== null && (u(), u = null), i || setTimeout(n, 20);
    }
    function n() {
      if (!i && !navigation.transition) {
        var s = navigation.currentEntry;
        s && s.url != null && navigation.navigate(s.url, {
          state: s.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var i = !1, u = null;
      return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(n, 100), function() {
        i = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), u !== null && (u(), u = null);
      };
    }
  }
  function Ic(t) {
    this._internalRoot = t;
  }
  Ys.prototype.render = Ic.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(r(409));
    var n = e.current, i = je();
    q0(n, i, t, e, null, null);
  }, Ys.prototype.unmount = Ic.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      q0(t.current, 2, null, t, null, null), Ms(), e[ta] = null;
    }
  };
  function Ys(t) {
    this._internalRoot = t;
  }
  Ys.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = jh();
      t = { blockedOn: null, target: t, priority: e };
      for (var n = 0; n < pi.length && e !== 0 && e < pi[n].priority; n++) ;
      pi.splice(n, 0, t), n === 0 && F0(t);
    }
  };
  var $0 = l.version;
  if ($0 !== "19.3.0")
    throw Error(
      r(
        527,
        $0,
        "19.3.0"
      )
    );
  at.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(r(188)) : (t = Object.keys(t).join(","), Error(r(268, t)));
    return t = S(e), t = t !== null ? p(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var Eb = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: $,
    reconcilerVersion: "19.3.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Gs = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Gs.isDisabled && Gs.supportsFiber)
      try {
        tl = Gs.inject(
          Eb
        ), Ne = Gs;
      } catch {
      }
  }
  return Fl.createRoot = function(t, e) {
    if (!c(t)) throw Error(r(299));
    var n = !1, i = "", u = Gm, s = qm, f = Xm;
    return e != null && (e.unstable_strictMode === !0 && (n = !0), e.identifierPrefix !== void 0 && (i = e.identifierPrefix), e.onUncaughtError !== void 0 && (u = e.onUncaughtError), e.onCaughtError !== void 0 && (s = e.onCaughtError), e.onRecoverableError !== void 0 && (f = e.onRecoverableError)), e = Y0(
      t,
      1,
      !1,
      null,
      null,
      n,
      i,
      null,
      u,
      s,
      f,
      W0
    ), t[ta] = e.current, zc(t), new Ic(e);
  }, Fl.hydrateRoot = function(t, e, n) {
    if (!c(t)) throw Error(r(299));
    var i = !1, u = "", s = Gm, f = qm, m = Xm, T = null;
    return n != null && (n.unstable_strictMode === !0 && (i = !0), n.identifierPrefix !== void 0 && (u = n.identifierPrefix), n.onUncaughtError !== void 0 && (s = n.onUncaughtError), n.onCaughtError !== void 0 && (f = n.onCaughtError), n.onRecoverableError !== void 0 && (m = n.onRecoverableError), n.formState !== void 0 && (T = n.formState)), e = Y0(
      t,
      1,
      !0,
      e,
      n ?? null,
      i,
      u,
      T,
      s,
      f,
      m,
      W0
    ), e.context = G0(null), n = e.current, i = je(), i = Oo(i), u = ei(i), u.callback = null, ni(n, u, i), n = i, e.current.lanes = n, nl(e, n), bn(e), t[ta] = e.current, zc(t), new Ys(e);
  }, Fl.version = "19.3.0", Fl;
}
var og;
function Vb() {
  if (og) return ef.exports;
  og = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (l) {
        console.error(l);
      }
  }
  return a(), ef.exports = Nb(), ef.exports;
}
var _b = Vb(), tt = Pf();
const _p = tt.createContext({});
function kf(a) {
  const l = tt.useRef(null);
  return l.current === null && (l.current = a()), l.current;
}
const Ub = typeof window < "u", Up = Ub ? tt.useLayoutEffect : tt.useEffect, Wf = /* @__PURE__ */ tt.createContext(null);
function $f(a, l) {
  a.indexOf(l) === -1 && a.push(l);
}
function Ja(a, l) {
  const o = a.indexOf(l);
  o > -1 && a.splice(o, 1);
}
const Dn = (a, l, o) => o > l ? l : o < a ? a : o;
let mo = () => {
};
const Ti = {}, Bp = (a) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(a), wp = (a) => typeof a == "object" && a !== null, Hp = (a) => /^0[^.\s]+$/u.test(a);
// @__NO_SIDE_EFFECTS__
function Lp(a) {
  let l;
  return () => (l === void 0 && (l = a()), l);
}
const Ie = /* @__NO_SIDE_EFFECTS__ */ (a) => a, ou = (...a) => a.reduce((l, o) => (r) => o(l(r))), Fa = /* @__NO_SIDE_EFFECTS__ */ (a, l, o) => {
  const r = l - a;
  return r ? (o - a) / r : 1;
};
class If {
  constructor() {
    this.subscriptions = [];
  }
  add(l) {
    return $f(this.subscriptions, l), () => Ja(this.subscriptions, l);
  }
  notify(l, o, r) {
    const c = this.subscriptions.length;
    if (c)
      if (c === 1)
        this.subscriptions[0](l, o, r);
      else
        for (let d = 0; d < c; d++) {
          const h = this.subscriptions[d];
          h && h(l, o, r);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const Oe = /* @__NO_SIDE_EFFECTS__ */ (a) => a * 1e3, $e = /* @__NO_SIDE_EFFECTS__ */ (a) => a / 1e3, jp = /* @__NO_SIDE_EFFECTS__ */ (a, l) => l ? a * (1e3 / l) : 0, Bb = (a, l, o) => {
  const r = l - a;
  return ((o - a) % r + r) % r + a;
}, Yp = (a, l, o) => (((1 - 3 * o + 3 * l) * a + (3 * o - 6 * l)) * a + 3 * l) * a, wb = 1e-7, Hb = 12;
function Lb(a, l, o, r, c) {
  let d, h, y = 0;
  do
    h = l + (o - l) / 2, d = Yp(h, r, c) - a, d > 0 ? o = h : l = h;
  while (Math.abs(d) > wb && ++y < Hb);
  return h;
}
// @__NO_SIDE_EFFECTS__
function ru(a, l, o, r) {
  if (a === l && o === r)
    return Ie;
  const c = (d) => Lb(d, 0, 1, a, o);
  return (d) => d === 0 || d === 1 ? d : Yp(c(d), l, r);
}
const Gp = /* @__NO_SIDE_EFFECTS__ */ (a) => (l) => l <= 0.5 ? a(2 * l) / 2 : (2 - a(2 * (1 - l))) / 2, th = /* @__NO_SIDE_EFFECTS__ */ (a) => (l) => 1 - a(1 - l), qp = /* @__PURE__ */ ru(0.33, 1.53, 0.69, 0.99), eh = /* @__PURE__ */ th(qp), Xp = /* @__PURE__ */ Gp(eh), Qp = (a) => a >= 1 ? 1 : (a *= 2) < 1 ? 0.5 * eh(a) : 0.5 * (2 - Math.pow(2, -10 * (a - 1))), nh = (a) => 1 - Math.sin(Math.acos(a)), Zp = /* @__PURE__ */ th(nh), Kp = /* @__PURE__ */ Gp(nh), jb = /* @__PURE__ */ ru(0.42, 0, 1, 1), Yb = /* @__PURE__ */ ru(0, 0, 0.58, 1), Jp = /* @__PURE__ */ ru(0.42, 0, 0.58, 1), Fp = /* @__NO_SIDE_EFFECTS__ */ (a) => Array.isArray(a) && typeof a[0] != "number";
// @__NO_SIDE_EFFECTS__
function Pp(a, l) {
  return /* @__PURE__ */ Fp(a) ? a[Bb(0, a.length, l)] : a;
}
const kp = /* @__NO_SIDE_EFFECTS__ */ (a) => Array.isArray(a) && typeof a[0] == "number", Gb = {
  linear: Ie,
  easeIn: jb,
  easeInOut: Jp,
  easeOut: Yb,
  circIn: nh,
  circInOut: Kp,
  circOut: Zp,
  backIn: eh,
  backInOut: Xp,
  backOut: qp,
  anticipate: Qp
}, qb = (a) => typeof a == "string", rg = (a) => {
  if (/* @__PURE__ */ kp(a)) {
    mo(a.length === 4);
    const [l, o, r, c] = a;
    return /* @__PURE__ */ ru(l, o, r, c);
  } else if (qb(a))
    return Gb[a];
  return a;
}, qs = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function Xb(a) {
  let l = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), r = !1, c = !1;
  const d = /* @__PURE__ */ new WeakSet();
  let h = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function y(S) {
    d.has(S) && (v.schedule(S), a()), S(h);
  }
  const v = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (S, p = !1, g = !1) => {
      const N = g && r ? l : o;
      return p && d.add(S), N.add(S), S;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (S) => {
      o.delete(S), d.delete(S);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (S) => {
      if (h = S, r) {
        c = !0;
        return;
      }
      r = !0;
      const p = l;
      l = o, o = p, l.forEach(y), l.clear(), r = !1, c && (c = !1, v.process(S));
    }
  };
  return v;
}
const Qb = 40;
function Wp(a, l) {
  let o = !1, r = !0;
  const c = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, d = () => o = !0, h = qs.reduce((Y, q) => (Y[q] = Xb(d), Y), {}), { setup: y, read: v, resolveKeyframes: S, preUpdate: p, update: g, preRender: b, render: N, postRender: R } = h, B = () => {
    const Y = Ti.useManualTiming, q = Y ? c.timestamp : performance.now();
    o = !1, Y || (c.delta = r ? 1e3 / 60 : Math.max(Math.min(q - c.timestamp, Qb), 1)), c.timestamp = q, c.isProcessing = !0, y.process(c), v.process(c), S.process(c), p.process(c), g.process(c), b.process(c), N.process(c), R.process(c), c.isProcessing = !1, o && l && (r = !1, a(B));
  }, U = () => {
    o = !0, r = !0, c.isProcessing || a(B);
  };
  return { schedule: qs.reduce((Y, q) => {
    const et = h[q];
    return Y[q] = (st, G = !1, X = !1) => (o || U(), et.schedule(st, G, X)), Y;
  }, {}), cancel: (Y) => {
    for (let q = 0; q < qs.length; q++)
      h[qs[q]].cancel(Y);
  }, state: c, steps: h };
}
const { schedule: Ut, cancel: qn, state: me, steps: sf } = /* @__PURE__ */ Wp(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Ie, !0);
let Js;
function Zb() {
  Js = void 0;
}
const Te = {
  now: () => (Js === void 0 && Te.set(me.isProcessing || Ti.useManualTiming ? me.timestamp : performance.now()), Js),
  set: (a) => {
    Js = a, queueMicrotask(Zb);
  }
}, $p = (a) => (l) => typeof l == "string" && l.startsWith(a), Ip = /* @__PURE__ */ $p("--"), Kb = /* @__PURE__ */ $p("var(--"), ih = (a) => Kb(a) ? Jb.test(a.split("/*")[0].trim()) : !1, Jb = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function cg(a) {
  return typeof a != "string" ? !1 : a.split("/*")[0].includes("var(--");
}
const ka = {
  test: (a) => typeof a == "number",
  parse: parseFloat,
  transform: (a) => a
}, iu = {
  ...ka,
  transform: (a) => Dn(0, 1, a)
}, Xs = {
  ...ka,
  default: 1
}, $l = (a) => Math.round(a * 1e5) / 1e5, ah = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function Fb(a) {
  return a == null;
}
const Pb = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, lh = (a, l) => (o) => !!(typeof o == "string" && Pb.test(o) && o.startsWith(a) || l && !Fb(o) && Object.prototype.hasOwnProperty.call(o, l)), tv = (a, l, o) => (r) => {
  if (typeof r != "string")
    return r;
  const [c, d, h, y] = r.match(ah);
  return {
    [a]: parseFloat(c),
    [l]: parseFloat(d),
    [o]: parseFloat(h),
    alpha: y !== void 0 ? parseFloat(y) : 1
  };
}, kb = (a) => Dn(0, 255, a), of = {
  ...ka,
  transform: (a) => Math.round(kb(a))
}, Fi = {
  test: /* @__PURE__ */ lh("rgb", "red"),
  parse: /* @__PURE__ */ tv("red", "green", "blue"),
  transform: ({ red: a, green: l, blue: o, alpha: r = 1 }) => "rgba(" + of.transform(a) + ", " + of.transform(l) + ", " + of.transform(o) + ", " + $l(iu.transform(r)) + ")"
};
function Wb(a) {
  let l = "", o = "", r = "", c = "";
  return a.length > 5 ? (l = a.substring(1, 3), o = a.substring(3, 5), r = a.substring(5, 7), c = a.substring(7, 9)) : (l = a.substring(1, 2), o = a.substring(2, 3), r = a.substring(3, 4), c = a.substring(4, 5), l += l, o += o, r += r, c += c), {
    red: parseInt(l, 16),
    green: parseInt(o, 16),
    blue: parseInt(r, 16),
    alpha: c ? parseInt(c, 16) / 255 : 1
  };
}
const Df = {
  test: /* @__PURE__ */ lh("#"),
  parse: Wb,
  transform: Fi.transform
}, cu = /* @__NO_SIDE_EFFECTS__ */ (a) => ({
  test: (l) => typeof l == "string" && l.endsWith(a) && l.split(" ").length === 1,
  parse: parseFloat,
  transform: (l) => `${l}${a}`
}), Gn = /* @__PURE__ */ cu("deg"), Mn = /* @__PURE__ */ cu("%"), P = /* @__PURE__ */ cu("px"), $b = /* @__PURE__ */ cu("vh"), Ib = /* @__PURE__ */ cu("vw"), fg = {
  ...Mn,
  parse: (a) => Mn.parse(a) / 100,
  transform: (a) => Mn.transform(a * 100)
}, Qa = {
  test: /* @__PURE__ */ lh("hsl", "hue"),
  parse: /* @__PURE__ */ tv("hue", "saturation", "lightness"),
  transform: ({ hue: a, saturation: l, lightness: o, alpha: r = 1 }) => "hsla(" + Math.round(a) + ", " + Mn.transform($l(l)) + ", " + Mn.transform($l(o)) + ", " + $l(iu.transform(r)) + ")"
}, It = {
  test: (a) => Fi.test(a) || Df.test(a) || Qa.test(a),
  parse: (a) => Fi.test(a) ? Fi.parse(a) : Qa.test(a) ? Qa.parse(a) : Df.parse(a),
  transform: (a) => typeof a == "string" ? a : a.hasOwnProperty("red") ? Fi.transform(a) : Qa.transform(a),
  getAnimatableNone: (a) => {
    const l = It.parse(a);
    return l.alpha = 0, It.transform(l);
  }
}, tE = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function eE(a) {
  return isNaN(a) && typeof a == "string" && (a.match(ah)?.length || 0) + (a.match(tE)?.length || 0) > 0;
}
const ev = "number", nv = "color", nE = "var", iE = "var(", hg = "${}", aE = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Pa(a) {
  const l = a.toString(), o = [], r = {
    color: [],
    number: [],
    var: []
  }, c = [];
  let d = 0;
  const y = l.replace(aE, (v) => (It.test(v) ? (r.color.push(d), c.push(nv), o.push(It.parse(v))) : v.startsWith(iE) ? (r.var.push(d), c.push(nE), o.push(v)) : (r.number.push(d), c.push(ev), o.push(parseFloat(v))), ++d, hg)).split(hg);
  return { values: o, split: y, indexes: r, types: c };
}
function lE(a) {
  return Pa(a).values;
}
function iv({ split: a, types: l }) {
  const o = a.length;
  return (r) => {
    let c = "";
    for (let d = 0; d < o; d++)
      if (c += a[d], r[d] !== void 0) {
        const h = l[d];
        h === ev ? c += $l(r[d]) : h === nv ? c += It.transform(r[d]) : c += r[d];
      }
    return c;
  };
}
function uE(a) {
  return iv(Pa(a));
}
const sE = (a) => typeof a == "number" ? 0 : It.test(a) ? It.getAnimatableNone(a) : a, oE = (a, l) => typeof a == "number" ? l?.trim().endsWith("/") ? a : 0 : sE(a);
function rE(a) {
  const l = Pa(a);
  return iv(l)(l.values.map((r, c) => oE(r, l.split[c])));
}
const rn = {
  test: eE,
  parse: lE,
  createTransformer: uE,
  getAnimatableNone: rE
};
function rf(a, l, o) {
  return o < 0 && (o += 1), o > 1 && (o -= 1), o < 1 / 6 ? a + (l - a) * 6 * o : o < 1 / 2 ? l : o < 2 / 3 ? a + (l - a) * (2 / 3 - o) * 6 : a;
}
function cE({ hue: a, saturation: l, lightness: o, alpha: r }) {
  a /= 360, l /= 100, o /= 100;
  let c = 0, d = 0, h = 0;
  if (!l)
    c = d = h = o;
  else {
    const y = o < 0.5 ? o * (1 + l) : o + l - o * l, v = 2 * o - y;
    c = rf(v, y, a + 1 / 3), d = rf(v, y, a), h = rf(v, y, a - 1 / 3);
  }
  return {
    red: Math.round(c * 255),
    green: Math.round(d * 255),
    blue: Math.round(h * 255),
    alpha: r
  };
}
function ao(a, l) {
  return (o) => o > 0 ? l : a;
}
const _t = (a, l, o) => a + (l - a) * o, cf = (a, l, o) => {
  const r = a * a, c = o * (l * l - r) + r;
  return c < 0 ? 0 : Math.sqrt(c);
}, fE = [Df, Fi, Qa], hE = (a) => fE.find((l) => l.test(a));
function dg(a) {
  const l = hE(a);
  if (!l)
    return !1;
  let o = l.parse(a);
  return l === Qa && (o = cE(o)), o;
}
const mg = (a, l) => {
  const o = dg(a), r = dg(l);
  if (!o || !r)
    return ao(a, l);
  const c = { ...o };
  return (d) => (c.red = cf(o.red, r.red, d), c.green = cf(o.green, r.green, d), c.blue = cf(o.blue, r.blue, d), c.alpha = _t(o.alpha, r.alpha, d), Fi.transform(c));
}, xf = /* @__PURE__ */ new Set(["none", "hidden"]);
function dE(a, l) {
  return xf.has(a) ? (o) => o <= 0 ? a : l : (o) => o >= 1 ? l : a;
}
function mE(a, l) {
  return (o) => _t(a, l, o);
}
function uh(a) {
  return typeof a == "number" ? mE : typeof a == "string" ? ih(a) ? ao : It.test(a) ? mg : pE : Array.isArray(a) ? av : typeof a == "object" ? It.test(a) ? mg : yE : ao;
}
function av(a, l) {
  const o = [...a], r = o.length, c = a.map((d, h) => uh(d)(d, l[h]));
  return (d) => {
    for (let h = 0; h < r; h++)
      o[h] = c[h](d);
    return o;
  };
}
function yE(a, l) {
  const o = { ...a, ...l }, r = {};
  for (const c in o)
    a[c] !== void 0 && l[c] !== void 0 && (r[c] = uh(a[c])(a[c], l[c]));
  return (c) => {
    for (const d in r)
      o[d] = r[d](c);
    return o;
  };
}
function gE(a, l) {
  const o = [], r = { color: 0, var: 0, number: 0 };
  for (let c = 0; c < l.values.length; c++) {
    const d = l.types[c], h = a.indexes[d][r[d]], y = a.values[h] ?? 0;
    o[c] = y, r[d]++;
  }
  return o;
}
const pE = (a, l) => {
  const o = rn.createTransformer(l), r = Pa(a), c = Pa(l);
  return r.indexes.var.length === c.indexes.var.length && r.indexes.color.length === c.indexes.color.length && r.indexes.number.length >= c.indexes.number.length ? xf.has(a) && !c.values.length || xf.has(l) && !r.values.length ? dE(a, l) : ou(av(gE(r, c), c.values), o) : ao(a, l);
};
function lv(a, l, o) {
  return typeof a == "number" && typeof l == "number" && typeof o == "number" ? _t(a, l, o) : uh(a)(a, l);
}
const vE = (a) => {
  const l = ({ timestamp: o }) => a(o);
  return {
    start: (o = !0) => Ut.update(l, o),
    stop: () => qn(l),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => me.isProcessing ? me.timestamp : Te.now()
  };
}, uv = (a, l, o = 10) => {
  let r = "";
  const c = Math.max(Math.round(l / o), 2);
  for (let d = 0; d < c; d++)
    r += Math.round(a(d / (c - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${r.substring(0, r.length - 2)})`;
}, lo = 2e4;
function sh(a) {
  let l = 0;
  const o = 50;
  let r = a.next(l);
  for (; !r.done && l < lo; )
    l += o, r = a.next(l);
  return l >= lo ? 1 / 0 : l;
}
function sv(a, l = 100, o) {
  const r = o({ ...a, keyframes: [0, l] }), c = Math.min(sh(r), lo);
  return {
    type: "keyframes",
    ease: (d) => r.next(c * d).value / l,
    duration: /* @__PURE__ */ $e(c)
  };
}
const Zt = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
};
function Cf(a, l) {
  return a * Math.sqrt(1 - l * l);
}
const SE = 12;
function TE(a, l, o) {
  let r = o;
  for (let c = 1; c < SE; c++)
    r = r - a(r) / l(r);
  return r;
}
const ff = 1e-3;
function bE({ duration: a = Zt.duration, bounce: l = Zt.bounce, velocity: o = Zt.velocity, mass: r = Zt.mass }) {
  let c, d, h = 1 - l;
  h = Dn(Zt.minDamping, Zt.maxDamping, h), a = Dn(Zt.minDuration, Zt.maxDuration, /* @__PURE__ */ $e(a)), h < 1 ? (c = (S) => {
    const p = S * h, g = p * a, b = p - o, N = Cf(S, h), R = Math.exp(-g);
    return ff - b / N * R;
  }, d = (S) => {
    const g = S * h * a, b = g * o + o, N = Math.pow(h, 2) * Math.pow(S, 2) * a, R = Math.exp(-g), B = Cf(Math.pow(S, 2), h);
    return (-c(S) + ff > 0 ? -1 : 1) * ((b - N) * R) / B;
  }) : (c = (S) => {
    const p = Math.exp(-S * a), g = (S - o) * a + 1;
    return -ff + p * g;
  }, d = (S) => {
    const p = Math.exp(-S * a), g = (o - S) * (a * a);
    return p * g;
  });
  const y = 5 / a, v = TE(c, d, y);
  if (a = /* @__PURE__ */ Oe(a), isNaN(v))
    return {
      stiffness: Zt.stiffness,
      damping: Zt.damping,
      duration: a
    };
  {
    const S = Math.pow(v, 2) * r;
    return {
      stiffness: S,
      damping: h * 2 * Math.sqrt(r * S),
      duration: a
    };
  }
}
const EE = ["duration", "bounce"], AE = ["stiffness", "damping", "mass"];
function yg(a, l) {
  return l.some((o) => a[o] !== void 0);
}
function ME(a) {
  let l = {
    velocity: Zt.velocity,
    stiffness: Zt.stiffness,
    damping: Zt.damping,
    mass: Zt.mass,
    isResolvedFromDuration: !1,
    ...a
  };
  if (!yg(a, AE) && yg(a, EE))
    if (l.velocity = 0, a.visualDuration) {
      const o = a.visualDuration, r = 2 * Math.PI / (o * 1.2), c = r * r, d = 2 * Dn(0.05, 1, 1 - (a.bounce || 0)) * Math.sqrt(c);
      l = {
        ...l,
        mass: Zt.mass,
        stiffness: c,
        damping: d
      };
    } else {
      const o = bE({ ...a, velocity: 0 });
      l = {
        ...l,
        ...o,
        mass: Zt.mass
      }, l.isResolvedFromDuration = !0;
    }
  return l;
}
function au(a = Zt.visualDuration, l = Zt.bounce) {
  const o = typeof a != "object" ? {
    visualDuration: a,
    keyframes: [0, 1],
    bounce: l
  } : a;
  let { restSpeed: r, restDelta: c } = o;
  const d = o.keyframes[0], h = o.keyframes[o.keyframes.length - 1], y = { done: !1, value: d }, { stiffness: v, damping: S, mass: p, duration: g, velocity: b, isResolvedFromDuration: N } = ME({
    ...o,
    velocity: -/* @__PURE__ */ $e(o.velocity || 0)
  }), R = b || 0, B = S / (2 * Math.sqrt(v * p)), U = h - d, w = /* @__PURE__ */ $e(Math.sqrt(v / p)), L = Math.abs(U) < 5;
  r || (r = L ? Zt.restSpeed.granular : Zt.restSpeed.default), c || (c = L ? Zt.restDelta.granular : Zt.restDelta.default);
  let Y, q, et, st, G, X;
  if (B < 1)
    et = Cf(w, B), st = (R + B * w * U) / et, Y = (J) => {
      const rt = Math.exp(-B * w * J);
      return h - rt * (st * Math.sin(et * J) + U * Math.cos(et * J));
    }, G = B * w * st + U * et, X = B * w * U - st * et, q = (J) => Math.exp(-B * w * J) * (G * Math.sin(et * J) + X * Math.cos(et * J));
  else if (B === 1) {
    Y = (rt) => h - Math.exp(-w * rt) * (U + (R + w * U) * rt);
    const J = R + w * U;
    q = (rt) => Math.exp(-w * rt) * (w * J * rt - R);
  } else {
    const J = w * Math.sqrt(B * B - 1);
    Y = (Ot) => {
      const mt = Math.exp(-B * w * Ot), j = Math.min(J * Ot, 300);
      return h - mt * ((R + B * w * U) * Math.sinh(j) + J * U * Math.cosh(j)) / J;
    };
    const rt = (R + B * w * U) / J, nt = B * w * rt - U * J, Dt = B * w * U - rt * J;
    q = (Ot) => {
      const mt = Math.exp(-B * w * Ot), j = Math.min(J * Ot, 300);
      return mt * (nt * Math.sinh(j) + Dt * Math.cosh(j));
    };
  }
  const lt = {
    calculatedDuration: N && g || null,
    velocity: (J) => /* @__PURE__ */ Oe(q(J)),
    next: (J) => {
      if (!N && B < 1) {
        const nt = Math.exp(-B * w * J), Dt = Math.sin(et * J), Ot = Math.cos(et * J), mt = h - nt * (st * Dt + U * Ot), j = /* @__PURE__ */ Oe(nt * (G * Dt + X * Ot));
        return y.done = Math.abs(j) <= r && Math.abs(h - mt) <= c, y.value = y.done ? h : mt, y;
      }
      const rt = Y(J);
      if (N)
        y.done = J >= g;
      else {
        const nt = /* @__PURE__ */ Oe(q(J));
        y.done = Math.abs(nt) <= r && Math.abs(h - rt) <= c;
      }
      return y.value = y.done ? h : rt, y;
    },
    toString: () => {
      const J = Math.min(sh(lt), lo), rt = uv((nt) => lt.next(J * nt).value, J, 30);
      return J + "ms " + rt;
    },
    toTransition: () => {
    }
  };
  return lt;
}
au.applyToOptions = (a) => {
  const l = sv(a, 100, au);
  return a.ease = l.ease, a.duration = /* @__PURE__ */ Oe(l.duration), a.type = "keyframes", a;
};
const DE = 5;
function ov(a, l, o) {
  const r = Math.max(l - DE, 0);
  return /* @__PURE__ */ jp(o - a(r), l - r);
}
function Of({ keyframes: a, velocity: l = 0, power: o = 0.8, timeConstant: r = 325, bounceDamping: c = 10, bounceStiffness: d = 500, modifyTarget: h, min: y, max: v, restDelta: S = 0.5, restSpeed: p }) {
  const g = a[0], b = {
    done: !1,
    value: g
  }, N = (X) => y !== void 0 && X < y || v !== void 0 && X > v, R = (X) => y === void 0 ? v : v === void 0 || Math.abs(y - X) < Math.abs(v - X) ? y : v;
  let B = o * l;
  const U = g + B, w = h === void 0 ? U : h(U);
  w !== U && (B = w - g);
  const L = (X) => -B * Math.exp(-X / r), Y = (X) => w + L(X), q = (X) => {
    const lt = L(X), J = Y(X);
    b.done = Math.abs(lt) <= S, b.value = b.done ? w : J;
  };
  let et, st;
  const G = (X) => {
    N(b.value) && (et = X, st = au({
      keyframes: [b.value, R(b.value)],
      velocity: ov(Y, X, b.value),
      // TODO: This should be passing * 1000
      damping: c,
      stiffness: d,
      restDelta: S,
      restSpeed: p
    }));
  };
  return G(0), {
    calculatedDuration: null,
    next: (X) => {
      let lt = !1;
      return !st && et === void 0 && (lt = !0, q(X), G(X)), et !== void 0 && X >= et ? st.next(X - et) : (!lt && q(X), b);
    }
  };
}
function xE(a, l, o) {
  const r = [], c = o || Ti.mix || lv, d = a.length - 1;
  for (let h = 0; h < d; h++) {
    let y = c(a[h], a[h + 1]);
    if (l) {
      const v = Array.isArray(l) ? l[h] || Ie : l;
      y = ou(v, y);
    }
    r.push(y);
  }
  return r;
}
function rv(a, l, { clamp: o = !0, ease: r, mixer: c } = {}) {
  const d = a.length;
  if (mo(d === l.length), d === 1)
    return () => l[0];
  if (d === 2 && l[0] === l[1])
    return () => l[1];
  const h = a[0] === a[1];
  a[0] > a[d - 1] && (a = [...a].reverse(), l = [...l].reverse());
  const y = xE(l, r, c), v = y.length, S = (p) => {
    if (h && p < a[0])
      return l[0];
    let g = 0;
    if (v > 1)
      for (; g < a.length - 2 && !(p < a[g + 1]); g++)
        ;
    const b = /* @__PURE__ */ Fa(a[g], a[g + 1], p);
    return y[g](b);
  };
  return o ? (p) => S(Dn(a[0], a[d - 1], p)) : S;
}
function cv(a, l) {
  const o = a[a.length - 1];
  for (let r = 1; r <= l; r++) {
    const c = /* @__PURE__ */ Fa(0, l, r);
    a.push(_t(o, 1, c));
  }
}
function fv(a) {
  const l = [0];
  return cv(l, a.length - 1), l;
}
function CE(a, l) {
  return a.map((o) => o * l);
}
function OE(a, l) {
  return a.map(() => l || Jp).splice(0, a.length - 1);
}
function Il({ duration: a = 300, keyframes: l, times: o, ease: r = "easeInOut" }) {
  const c = /* @__PURE__ */ Fp(r) ? r.map(rg) : rg(r), d = {
    done: !1,
    value: l[0]
  }, h = CE(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    o && o.length === l.length ? o : fv(l),
    a
  ), y = rv(h, l, {
    ease: Array.isArray(c) ? c : OE(l, c)
  });
  return {
    calculatedDuration: a,
    next: (v) => (d.value = y(v), d.done = v >= a, d)
  };
}
const zE = (a) => a !== null;
function yo(a, { repeat: l, repeatType: o = "loop" }, r, c = 1) {
  const d = a.filter(zE), y = c < 0 || l && o !== "loop" && l % 2 === 1 ? 0 : d.length - 1;
  return !y || r === void 0 ? d[y] : r;
}
const RE = {
  decay: Of,
  inertia: Of,
  tween: Il,
  keyframes: Il,
  spring: au
};
function hv(a) {
  typeof a.type == "string" && (a.type = RE[a.type]);
}
class oh {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((l) => {
      this.resolve = l;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(l, o) {
    return this.finished.then(l, o);
  }
}
const NE = (a) => a / 100;
class uo extends oh {
  constructor(l) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
      done: !1,
      value: void 0
    }, this.stop = () => {
      const { motionValue: o } = this.options;
      o && o.updatedAt !== Te.now() && this.tick(Te.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), this.options.onStop?.());
    }, this.options = l, this.initAnimation(), this.play(), l.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: l } = this;
    hv(l);
    const { type: o = Il, repeat: r = 0, repeatDelay: c = 0, repeatType: d, velocity: h = 0 } = l;
    let { keyframes: y } = l;
    const v = o || Il;
    v !== Il && typeof y[0] != "number" && (this.mixKeyframes = ou(NE, lv(y[0], y[1])), y = [0, 100]);
    const S = v({ ...l, keyframes: y });
    d === "mirror" && (this.mirroredGenerator = v({
      ...l,
      keyframes: [...y].reverse(),
      velocity: -h
    })), S.calculatedDuration === null && (S.calculatedDuration = sh(S));
    const { calculatedDuration: p } = S;
    this.calculatedDuration = p, this.resolvedDuration = p + c, this.totalDuration = this.resolvedDuration * (r + 1) - c, this.generator = S;
  }
  updateTime(l) {
    const o = Math.round(l - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = o;
  }
  tick(l, o = !1) {
    const { generator: r, totalDuration: c, mixKeyframes: d, mirroredGenerator: h, resolvedDuration: y, calculatedDuration: v } = this;
    if (this.startTime === null)
      return r.next(0);
    const { delay: S = 0, keyframes: p, repeat: g, repeatType: b, repeatDelay: N, type: R, onUpdate: B, finalKeyframe: U } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, l) : this.speed < 0 && (this.startTime = Math.min(l - c / this.speed, this.startTime)), o ? this.currentTime = l : this.updateTime(l);
    const w = this.currentTime - S * (this.playbackSpeed >= 0 ? 1 : -1), L = this.playbackSpeed >= 0 ? w < 0 : w > c;
    this.currentTime = Math.max(w, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = c);
    let Y = this.currentTime, q = r;
    if (g) {
      const X = Math.min(this.currentTime, c) / y;
      let lt = Math.floor(X), J = X % 1;
      !J && X >= 1 && (J = 1), J === 1 && lt--, lt = Math.min(lt, g + 1), lt % 2 && (b === "reverse" ? (J = 1 - J, N && (J -= N / y)) : b === "mirror" && (q = h)), Y = Dn(0, 1, J) * y;
    }
    let et;
    L ? (this.delayState.value = p[0], et = this.delayState) : et = q.next(Y), d && !L && (et.value = d(et.value));
    let { done: st } = et;
    !L && v !== null && (st = this.playbackSpeed >= 0 ? this.currentTime >= c : this.currentTime <= 0);
    const G = this.holdTime === null && (this.state === "finished" || this.state === "running" && st);
    return G && R !== Of && (et.value = yo(p, this.options, U, this.speed)), B && B(et.value), G && this.finish(), et;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(l, o) {
    return this.finished.then(l, o);
  }
  get duration() {
    return /* @__PURE__ */ $e(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ $e(l);
  }
  get time() {
    return /* @__PURE__ */ $e(this.currentTime);
  }
  set time(l) {
    l = /* @__PURE__ */ Oe(l), this.currentTime = l, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = l : this.driver && (this.startTime = this.driver.now() - l / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = l, this.tick(l));
  }
  /**
   * Returns the generator's velocity at the current time in units/second.
   * Uses the analytical derivative when available (springs), avoiding
   * the MotionValue's frame-dependent velocity estimation.
   */
  getGeneratorVelocity() {
    const l = this.currentTime;
    if (l <= 0)
      return this.options.velocity || 0;
    if (this.generator.velocity)
      return this.generator.velocity(l);
    const o = this.generator.next(l).value;
    return ov((r) => this.generator.next(r).value, l, o);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(l) {
    const o = this.playbackSpeed !== l;
    o && this.driver && this.updateTime(Te.now()), this.playbackSpeed = l, o && this.driver && (this.time = /* @__PURE__ */ $e(this.currentTime));
  }
  play() {
    if (this.isStopped)
      return;
    const { driver: l = vE, startTime: o } = this.options;
    this.driver || (this.driver = l((c) => this.tick(c))), this.options.onPlay?.();
    const r = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = r) : this.holdTime !== null ? this.startTime = r - this.holdTime : this.startTime || (this.startTime = o ?? r), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(Te.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
  }
  cancel() {
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(l) {
    return this.startTime = 0, this.tick(l, !0);
  }
  attachTimeline(l) {
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), l.observe(this);
  }
}
function VE(a) {
  for (let l = 1; l < a.length; l++)
    a[l] ?? (a[l] = a[l - 1]);
}
const Pi = (a) => a * 180 / Math.PI, zf = (a) => {
  const l = Pi(Math.atan2(a[1], a[0]));
  return Rf(l);
}, _E = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (a) => (Math.abs(a[0]) + Math.abs(a[3])) / 2,
  rotate: zf,
  rotateZ: zf,
  skewX: (a) => Pi(Math.atan(a[1])),
  skewY: (a) => Pi(Math.atan(a[2])),
  skew: (a) => (Math.abs(a[1]) + Math.abs(a[2])) / 2
}, Rf = (a) => (a = a % 360, a < 0 && (a += 360), a), gg = zf, pg = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1]), vg = (a) => Math.sqrt(a[4] * a[4] + a[5] * a[5]), UE = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: pg,
  scaleY: vg,
  scale: (a) => (pg(a) + vg(a)) / 2,
  rotateX: (a) => Rf(Pi(Math.atan2(a[6], a[5]))),
  rotateY: (a) => Rf(Pi(Math.atan2(-a[2], a[0]))),
  rotateZ: gg,
  rotate: gg,
  skewX: (a) => Pi(Math.atan(a[4])),
  skewY: (a) => Pi(Math.atan(a[1])),
  skew: (a) => (Math.abs(a[1]) + Math.abs(a[4])) / 2
};
function Nf(a) {
  return a.includes("scale") ? 1 : 0;
}
function Vf(a, l) {
  if (!a || a === "none")
    return Nf(l);
  const o = a.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let r, c;
  if (o)
    r = UE, c = o;
  else {
    const y = a.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    r = _E, c = y;
  }
  if (!c)
    return Nf(l);
  const d = r[l], h = c[1].split(",").map(wE);
  return typeof d == "function" ? d(h) : h[d];
}
const BE = (a, l) => {
  const { transform: o = "none" } = getComputedStyle(a);
  return Vf(o, l);
};
function wE(a) {
  return parseFloat(a.trim());
}
const Wa = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], $a = /* @__PURE__ */ new Set([...Wa, "pathRotation"]), Sg = (a) => a === ka || a === P, HE = /* @__PURE__ */ new Set(["x", "y", "z"]), LE = Wa.filter((a) => !HE.has(a));
function jE(a) {
  const l = [];
  return LE.forEach((o) => {
    const r = a.getValue(o);
    r !== void 0 && (l.push([o, r.get()]), r.set(o.startsWith("scale") ? 1 : 0));
  }), l;
}
const Si = {
  // Dimensions
  width: ({ x: a }, { paddingLeft: l = "0", paddingRight: o = "0", boxSizing: r }) => {
    const c = a.max - a.min;
    return r === "border-box" ? c : c - parseFloat(l) - parseFloat(o);
  },
  height: ({ y: a }, { paddingTop: l = "0", paddingBottom: o = "0", boxSizing: r }) => {
    const c = a.max - a.min;
    return r === "border-box" ? c : c - parseFloat(l) - parseFloat(o);
  },
  top: (a, { top: l }) => parseFloat(l),
  left: (a, { left: l }) => parseFloat(l),
  bottom: ({ y: a }, { top: l }) => parseFloat(l) + (a.max - a.min),
  right: ({ x: a }, { left: l }) => parseFloat(l) + (a.max - a.min),
  // Transform
  x: (a, { transform: l }) => Vf(l, "x"),
  y: (a, { transform: l }) => Vf(l, "y")
};
Si.translateX = Si.x;
Si.translateY = Si.y;
const ki = /* @__PURE__ */ new Set();
let _f = !1, Uf = !1, Bf = !1;
function dv() {
  if (Uf) {
    const a = Array.from(ki).filter((r) => r.needsMeasurement), l = new Set(a.map((r) => r.element)), o = /* @__PURE__ */ new Map();
    l.forEach((r) => {
      const c = jE(r);
      c.length && (o.set(r, c), r.render());
    }), a.forEach((r) => r.measureInitialState()), l.forEach((r) => {
      r.render();
      const c = o.get(r);
      c && c.forEach(([d, h]) => {
        r.getValue(d)?.set(h);
      });
    }), a.forEach((r) => r.measureEndState()), a.forEach((r) => {
      r.suspendedScrollY !== void 0 && window.scrollTo(0, r.suspendedScrollY);
    });
  }
  Uf = !1, _f = !1, ki.forEach((a) => a.complete(Bf)), ki.clear();
}
function mv() {
  ki.forEach((a) => {
    a.readKeyframes(), a.needsMeasurement && (Uf = !0);
  });
}
function YE() {
  Bf = !0, mv(), dv(), Bf = !1;
}
class rh {
  constructor(l, o, r, c, d, h = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...l], this.onComplete = o, this.name = r, this.motionValue = c, this.element = d, this.isAsync = h;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (ki.add(this), _f || (_f = !0, Ut.read(mv), Ut.resolveKeyframes(dv))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: l, name: o, element: r, motionValue: c } = this;
    if (l[0] === null) {
      const d = c?.get(), h = l[l.length - 1];
      if (d !== void 0)
        l[0] = d;
      else if (r && o) {
        const y = r.readValue(o, h);
        y != null && (l[0] = y);
      }
      l[0] === void 0 && (l[0] = h), c && d === void 0 && c.set(l[0]);
    }
    VE(l);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(l = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, l), ki.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (ki.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const GE = (a) => a.startsWith("--");
function yv(a, l, o) {
  GE(l) ? a.style.setProperty(l, o) : a.style[l] = o;
}
const qE = {};
function gv(a, l) {
  const o = /* @__PURE__ */ Lp(a);
  return () => qE[l] ?? o();
}
const XE = /* @__PURE__ */ gv(() => window.ScrollTimeline !== void 0, "scrollTimeline"), pv = /* @__PURE__ */ gv(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), kl = ([a, l, o, r]) => `cubic-bezier(${a}, ${l}, ${o}, ${r})`, Tg = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ kl([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ kl([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ kl([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ kl([0.33, 1.53, 0.69, 0.99])
};
function vv(a, l) {
  if (a)
    return typeof a == "function" ? pv() ? uv(a, l) : "ease-out" : /* @__PURE__ */ kp(a) ? kl(a) : Array.isArray(a) ? a.map((o) => vv(o, l) || Tg.easeOut) : Tg[a];
}
function QE(a, l, o, { delay: r = 0, duration: c = 300, repeat: d = 0, repeatType: h = "loop", ease: y = "easeOut", times: v } = {}, S = void 0) {
  const p = {
    [l]: o
  };
  v && (p.offset = v);
  const g = vv(y, c);
  Array.isArray(g) && (p.easing = g);
  const b = {
    delay: r,
    duration: c,
    easing: Array.isArray(g) ? "linear" : g,
    fill: "both",
    iterations: d + 1,
    direction: h === "reverse" ? "alternate" : "normal"
  };
  return S && (b.pseudoElement = S), a.animate(p, b);
}
function ch(a) {
  return typeof a == "function" && "applyToOptions" in a;
}
function ZE({ type: a, ...l }) {
  return ch(a) && pv() ? a.applyToOptions(l) : (l.duration ?? (l.duration = 300), l.ease ?? (l.ease = "easeOut"), l);
}
class Sv extends oh {
  constructor(l) {
    if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !l)
      return;
    const { element: o, name: r, keyframes: c, pseudoElement: d, allowFlatten: h = !1, finalKeyframe: y, onComplete: v } = l;
    this.isPseudoElement = !!d, this.allowFlatten = h, this.options = l, mo(typeof l.type != "string");
    const S = ZE(l);
    this.animation = QE(o, r, c, S, d), S.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !d) {
        const p = yo(c, this.options, y, this.speed);
        this.updateMotionValue && this.updateMotionValue(p), yv(o, r, p), this.animation.cancel();
      }
      v?.(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state: l } = this;
    l === "idle" || l === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    const l = this.options?.element;
    !this.isPseudoElement && l?.isConnected && this.animation.commitStyles?.();
  }
  get duration() {
    const l = this.animation.effect?.getComputedTiming?.().duration || 0;
    return /* @__PURE__ */ $e(Number(l));
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ $e(l);
  }
  get time() {
    return /* @__PURE__ */ $e(Number(this.animation.currentTime) || 0);
  }
  set time(l) {
    const o = this.finishedTime !== null;
    this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ Oe(l), o && this.animation.pause();
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(l) {
    l < 0 && (this.finishedTime = null), this.animation.playbackRate = l;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(l) {
    this.manualStartTime = this.animation.startTime = l;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline: l, rangeStart: o, rangeEnd: r, observe: c }) {
    return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, l && XE() ? (this.animation.timeline = l, o && (this.animation.rangeStart = o), r && (this.animation.rangeEnd = r), Ie) : c(this);
  }
}
const Tv = {
  anticipate: Qp,
  backInOut: Xp,
  circInOut: Kp
};
function KE(a) {
  return a in Tv;
}
function JE(a) {
  typeof a.ease == "string" && KE(a.ease) && (a.ease = Tv[a.ease]);
}
const hf = 10;
class FE extends Sv {
  constructor(l) {
    JE(l), hv(l), super(l), l.startTime !== void 0 && l.autoplay !== !1 && (this.startTime = l.startTime), this.options = l;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read committed styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(l) {
    const { motionValue: o, onUpdate: r, onComplete: c, element: d, ...h } = this.options;
    if (!o)
      return;
    if (l !== void 0) {
      o.set(l);
      return;
    }
    const y = new uo({
      ...h,
      autoplay: !1
    }), v = Math.max(hf, Te.now() - this.startTime), S = Dn(0, hf, v - hf), p = y.sample(v).value, { name: g } = this.options;
    d && g && yv(d, g, p), o.setWithVelocity(y.sample(Math.max(0, v - S)).value, p, S), y.stop();
  }
}
const bg = (a, l) => l === "zIndex" ? !1 : !!(typeof a == "number" || Array.isArray(a) || typeof a == "string" && // It's animatable if we have a string
(rn.test(a) || a === "0") && // And it contains numbers and/or colors
!a.startsWith("url("));
function PE(a) {
  const l = a[0];
  if (a.length === 1)
    return !0;
  for (let o = 0; o < a.length; o++)
    if (a[o] !== l)
      return !0;
}
function kE(a, l, o, r) {
  const c = a[0];
  if (c === null)
    return !1;
  if (l === "display" || l === "visibility")
    return !0;
  const d = a[a.length - 1], h = bg(c, l), y = bg(d, l);
  return !h || !y ? !1 : PE(a) || (o === "spring" || ch(o)) && r;
}
function wf(a) {
  a.duration = 0, a.type = "keyframes";
}
const bv = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform",
  "backgroundColor"
]), WE = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function $E(a) {
  for (let l = 0; l < a.length; l++)
    if (typeof a[l] == "string" && WE.test(a[l]))
      return !0;
  return !1;
}
const IE = /* @__PURE__ */ new Set([
  "color",
  "backgroundColor",
  "outlineColor",
  "fill",
  "stroke",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor"
]), tA = /* @__PURE__ */ Lp(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function eA(a) {
  const { motionValue: l, name: o, repeatDelay: r, repeatType: c, damping: d, type: h, keyframes: y } = a, v = l?.owner?.current;
  if (!(v instanceof HTMLElement) && !(v instanceof SVGElement))
    return !1;
  const { onUpdate: S, transformTemplate: p } = l.owner.getProps();
  return tA() && o && /**
   * Force WAAPI for color properties with browser-only color formats
   * (oklch, oklab, lab, lch, etc.) that the JS animation path can't parse.
   */
  (bv.has(o) || IE.has(o) && $E(y)) && (o !== "transform" || !p) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !S && !r && c !== "mirror" && d !== 0 && h !== "inertia";
}
const nA = 40;
class iA extends oh {
  constructor({ autoplay: l = !0, delay: o = 0, type: r = "keyframes", repeat: c = 0, repeatDelay: d = 0, repeatType: h = "loop", keyframes: y, name: v, motionValue: S, element: p, ...g }) {
    super(), this.stop = () => {
      this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
    }, this.createdAt = Te.now();
    const b = {
      autoplay: l,
      delay: o,
      type: r,
      repeat: c,
      repeatDelay: d,
      repeatType: h,
      name: v,
      motionValue: S,
      element: p,
      ...g
    }, N = p?.KeyframeResolver || rh;
    this.keyframeResolver = new N(y, (R, B, U) => this.onKeyframesResolved(R, B, b, !U), v, S, p), this.keyframeResolver?.scheduleResolve();
  }
  onKeyframesResolved(l, o, r, c) {
    this.keyframeResolver = void 0;
    const { name: d, type: h, velocity: y, delay: v, isHandoff: S, onUpdate: p } = r;
    this.resolvedAt = Te.now();
    let g = !0;
    kE(l, d, h, y) || (g = !1, (Ti.instantAnimations || !v) && p?.(yo(l, r, o)), l[0] = l[l.length - 1], wf(r), r.repeat = 0);
    const N = {
      startTime: c ? this.resolvedAt ? this.resolvedAt - this.createdAt > nA ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: o,
      ...r,
      keyframes: l
    }, R = g && !S && eA(N), B = N.motionValue?.owner?.current;
    let U;
    if (R)
      try {
        U = new FE({
          ...N,
          element: B
        });
      } catch {
        U = new uo(N);
      }
    else
      U = new uo(N);
    U.finished.then(() => {
      this.notifyFinished();
    }).catch(Ie), this.pendingTimeline && (this.stopTimeline = U.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = U;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(l, o) {
    return this.finished.finally(l).then(() => {
    });
  }
  get animation() {
    return this._animation || (this.keyframeResolver?.resume(), YE()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(l) {
    this.animation.time = l;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(l) {
    this.animation.speed = l;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(l) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(l) : this.pendingTimeline = l, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    this._animation && this.animation.cancel(), this.keyframeResolver?.cancel();
  }
}
class aA {
  constructor(l) {
    this.stop = () => this.runAll("stop"), this.animations = l.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((l) => l.finished));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(l) {
    return this.animations[0][l];
  }
  setAll(l, o) {
    for (let r = 0; r < this.animations.length; r++)
      this.animations[r][l] = o;
  }
  attachTimeline(l) {
    const o = this.animations.map((r) => r.attachTimeline(l));
    return () => {
      o.forEach((r, c) => {
        r && r(), this.animations[c].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(l) {
    this.setAll("time", l);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(l) {
    this.setAll("speed", l);
  }
  get state() {
    return this.getAll("state");
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    return Eg(this.animations, "duration");
  }
  get iterationDuration() {
    return Eg(this.animations, "iterationDuration");
  }
  runAll(l) {
    this.animations.forEach((o) => o[l]());
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
function Eg(a, l) {
  let o = 0;
  for (let r = 0; r < a.length; r++) {
    const c = a[r][l];
    c !== null && c > o && (o = c);
  }
  return o;
}
class lA extends aA {
  then(l, o) {
    return this.finished.finally(l).then(() => {
    });
  }
}
function Ev(a, l, o, r = 0, c = 1) {
  const d = Array.from(a).sort((S, p) => S.sortNodePosition(p)).indexOf(l), h = a.size, y = (h - 1) * r;
  return typeof o == "function" ? o(d, h) : c === 1 ? d * r : y - d * r;
}
const Ag = 30, uA = (a) => !isNaN(parseFloat(a)), tu = {
  current: void 0
};
class sA {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(l, o = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (r) => {
      const c = Te.now();
      if (this.updatedAt !== c && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(r), this.current !== this.prev && (this.events.change?.notify(this.current), this.dependents))
        for (const d of this.dependents)
          d.dirty();
    }, this.hasAnimated = !1, this.setCurrent(l), this.owner = o.owner;
  }
  setCurrent(l) {
    this.current = l, this.updatedAt = Te.now(), this.canTrackVelocity === null && l !== void 0 && (this.canTrackVelocity = uA(this.current));
  }
  setPrevFrameValue(l = this.current) {
    this.prevFrameValue = l, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(l) {
    return this.on("change", l);
  }
  on(l, o) {
    this.events[l] || (this.events[l] = new If());
    const r = this.events[l].add(o);
    return l === "change" ? () => {
      r(), Ut.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : r;
  }
  clearListeners() {
    for (const l in this.events)
      this.events[l].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(l, o) {
    this.passiveEffect = l, this.stopPassiveEffect = o;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(l) {
    this.passiveEffect ? this.passiveEffect(l, this.updateAndNotify) : this.updateAndNotify(l);
  }
  setWithVelocity(l, o, r) {
    this.set(o), this.prev = void 0, this.prevFrameValue = l, this.prevUpdatedAt = this.updatedAt - r;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(l, o = !0) {
    this.updateAndNotify(l), this.prev = l, this.prevUpdatedAt = this.prevFrameValue = void 0, o && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(l) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(l);
  }
  removeDependent(l) {
    this.dependents && this.dependents.delete(l);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return tu.current && tu.current.push(this), this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const l = Te.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || l - this.updatedAt > Ag)
      return 0;
    const o = Math.min(this.updatedAt - this.prevUpdatedAt, Ag);
    return /* @__PURE__ */ jp(parseFloat(this.current) - parseFloat(this.prevFrameValue), o);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(l) {
    return this.stop(), new Promise((o) => {
      this.hasAnimated = !0, this.animation = l(o), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function bi(a, l) {
  return new sA(a, l);
}
function Av(a, l) {
  if (a?.inherit && l) {
    const { inherit: o, ...r } = a;
    return { ...l, ...r };
  }
  return a;
}
function fh(a, l) {
  const o = a?.[l] ?? a?.default ?? a;
  return o !== a ? Av(o, a) : o;
}
const oA = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, rA = (a) => ({
  type: "spring",
  stiffness: 550,
  damping: a === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), cA = {
  type: "keyframes",
  duration: 0.8
}, fA = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, hA = (a, { keyframes: l }) => l.length > 2 ? cA : $a.has(a) ? a.startsWith("scale") ? rA(l[1]) : oA : fA, dA = /* @__PURE__ */ new Set([
  "when",
  "delay",
  "delayChildren",
  "staggerChildren",
  "staggerDirection",
  "repeat",
  "repeatType",
  "repeatDelay",
  "from",
  "elapsed"
]);
function mA(a) {
  for (const l in a)
    if (!dA.has(l))
      return !0;
  return !1;
}
const hh = (a, l, o, r = {}, c, d) => (h) => {
  const y = fh(r, a) || {}, v = y.delay || r.delay || 0;
  let { elapsed: S = 0 } = r;
  S = S - /* @__PURE__ */ Oe(v);
  const p = {
    keyframes: Array.isArray(o) ? o : [null, o],
    ease: "easeOut",
    velocity: l.getVelocity(),
    ...y,
    delay: -S,
    onUpdate: (b) => {
      l.set(b), y.onUpdate && y.onUpdate(b);
    },
    onComplete: () => {
      h(), y.onComplete && y.onComplete();
    },
    name: a,
    motionValue: l,
    element: d ? void 0 : c
  };
  mA(y) || Object.assign(p, hA(a, p)), p.duration && (p.duration = /* @__PURE__ */ Oe(p.duration)), p.repeatDelay && (p.repeatDelay = /* @__PURE__ */ Oe(p.repeatDelay)), p.from !== void 0 && (p.keyframes[0] = p.from);
  let g = !1;
  if ((p.type === !1 || p.duration === 0 && !p.repeatDelay) && (wf(p), p.delay === 0 && (g = !0)), (Ti.instantAnimations || Ti.skipAnimations || c?.shouldSkipAnimations || y.skipAnimations) && (g = !0, wf(p), p.delay = 0), p.allowFlatten = !y.type && !y.ease, g && !d && l.get() !== void 0) {
    const b = yo(p.keyframes, y);
    if (b !== void 0) {
      Ut.update(() => {
        p.onUpdate(b), p.onComplete();
      });
      return;
    }
  }
  return y.isSync ? new uo(p) : new iA(p);
}, yA = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function gA(a) {
  const l = yA.exec(a);
  if (!l)
    return [,];
  const [, o, r, c] = l;
  return [`--${o ?? r}`, c];
}
function Mv(a, l, o = 1) {
  const [r, c] = gA(a);
  if (!r)
    return;
  const d = window.getComputedStyle(l).getPropertyValue(r);
  if (d) {
    const h = d.trim();
    return Bp(h) ? parseFloat(h) : h;
  }
  return ih(c) ? Mv(c, l, o + 1) : c;
}
function Mg(a) {
  const l = [{}, {}];
  return a?.values.forEach((o, r) => {
    l[0][r] = o.get(), l[1][r] = o.getVelocity();
  }), l;
}
function dh(a, l, o, r) {
  if (typeof l == "function") {
    const [c, d] = Mg(r);
    l = l(o !== void 0 ? o : a.custom, c, d);
  }
  if (typeof l == "string" && (l = a.variants && a.variants[l]), typeof l == "function") {
    const [c, d] = Mg(r);
    l = l(o !== void 0 ? o : a.custom, c, d);
  }
  return l;
}
function Wi(a, l, o) {
  const r = a.getProps();
  return dh(r, l, o !== void 0 ? o : r.custom, a);
}
const Dv = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...Wa
]), Hf = (a) => Array.isArray(a);
function pA(a, l, o) {
  a.hasValue(l) ? a.getValue(l).set(o) : a.addValue(l, bi(o));
}
function vA(a) {
  return Hf(a) ? a[a.length - 1] || 0 : a;
}
function SA(a, l) {
  const o = Wi(a, l);
  let { transitionEnd: r = {}, transition: c = {}, ...d } = o || {};
  d = { ...d, ...r };
  for (const h in d) {
    const y = vA(d[h]);
    pA(a, h, y);
  }
}
const ee = (a) => !!(a && a.getVelocity);
function TA(a) {
  return !!(ee(a) && a.add);
}
function Lf(a, l) {
  const o = a.getValue("willChange");
  if (TA(o))
    return o.add(l);
  if (!o && Ti.WillChange) {
    const r = new Ti.WillChange("auto");
    a.addValue("willChange", r), r.add(l);
  }
}
function mh(a) {
  return a.replace(/([A-Z])/g, (l) => `-${l.toLowerCase()}`);
}
const bA = "framerAppearId", xv = "data-" + mh(bA);
function Cv(a) {
  return a.props[xv];
}
function EA({ protectedKeys: a, needsAnimating: l }, o) {
  const r = a.hasOwnProperty(o) && l[o] !== !0;
  return l[o] = !1, r;
}
function yh(a, l, { delay: o = 0, transitionOverride: r, type: c } = {}) {
  let { transition: d, transitionEnd: h, ...y } = l;
  const v = a.getDefaultTransition();
  d = d ? Av(d, v) : v;
  const S = d?.reduceMotion, p = d?.skipAnimations;
  r && (d = r);
  const g = [], b = c && a.animationState && a.animationState.getState()[c], N = d?.path;
  N && N.animateVisualElement(a, y, d, o, g);
  for (const R in y) {
    const B = a.getValue(R, a.latestValues[R] ?? null), U = y[R];
    if (U === void 0 || b && EA(b, R))
      continue;
    const w = {
      delay: o,
      ...fh(d || {}, R)
    };
    p && (w.skipAnimations = !0);
    const L = B.get();
    if (L !== void 0 && !B.isAnimating() && !Array.isArray(U) && U === L && !w.velocity) {
      Ut.update(() => B.set(U));
      continue;
    }
    let Y = !1;
    if (window.MotionHandoffAnimation) {
      const st = Cv(a);
      if (st) {
        const G = window.MotionHandoffAnimation(st, R, Ut);
        G !== null && (w.startTime = G, Y = !0);
      }
    }
    Lf(a, R);
    const q = S ?? a.shouldReduceMotion;
    B.start(hh(R, B, U, q && Dv.has(R) ? { type: !1 } : w, a, Y));
    const et = B.animation;
    et && g.push(et);
  }
  if (h) {
    const R = () => Ut.update(() => {
      h && SA(a, h);
    });
    g.length ? Promise.all(g).then(R) : R();
  }
  return g;
}
function jf(a, l, o = {}) {
  const r = Wi(a, l, o.type === "exit" ? a.presenceContext?.custom : void 0);
  let { transition: c = a.getDefaultTransition() || {} } = r || {};
  o.transitionOverride && (c = o.transitionOverride);
  const d = r ? () => Promise.all(yh(a, r, o)) : () => Promise.resolve(), h = a.variantChildren && a.variantChildren.size ? (v = 0) => {
    const { delayChildren: S = 0, staggerChildren: p, staggerDirection: g } = c;
    return AA(a, l, v, S, p, g, o);
  } : () => Promise.resolve(), { when: y } = c;
  if (y) {
    const [v, S] = y === "beforeChildren" ? [d, h] : [h, d];
    return v().then(() => S());
  } else
    return Promise.all([d(), h(o.delay)]);
}
function AA(a, l, o = 0, r = 0, c = 0, d = 1, h) {
  const y = [];
  for (const v of a.variantChildren)
    v.notify("AnimationStart", l), y.push(jf(v, l, {
      ...h,
      delay: o + (typeof r == "function" ? 0 : r) + Ev(a.variantChildren, v, r, c, d)
    }).then(() => v.notify("AnimationComplete", l)));
  return Promise.all(y);
}
function MA(a, l, o = {}) {
  a.notify("AnimationStart", l);
  let r;
  if (Array.isArray(l)) {
    const c = l.map((d) => jf(a, d, o));
    r = Promise.all(c);
  } else if (typeof l == "string")
    r = jf(a, l, o);
  else {
    const c = typeof l == "function" ? Wi(a, l, o.custom) : l;
    r = Promise.all(yh(a, c, o));
  }
  return r.then(() => {
    a.notify("AnimationComplete", l);
  });
}
const DA = {
  test: (a) => a === "auto",
  parse: (a) => a
}, Ov = (a) => (l) => l.test(a), zv = [ka, P, Mn, Gn, Ib, $b, DA], Dg = (a) => zv.find(Ov(a));
function xA(a) {
  return typeof a == "number" ? a === 0 : a !== null ? a === "none" || a === "0" || Hp(a) : !0;
}
const CA = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function OA(a) {
  const [l, o] = a.slice(0, -1).split("(");
  if (l === "drop-shadow")
    return a;
  const [r] = o.match(ah) || [];
  if (!r)
    return a;
  const c = o.replace(r, "");
  let d = CA.has(l) ? 1 : 0;
  return r !== o && (d *= 100), l + "(" + d + c + ")";
}
const zA = /\b([a-z-]*)\(.*?\)/gu, Yf = {
  ...rn,
  getAnimatableNone: (a) => {
    const l = a.match(zA);
    return l ? l.map(OA).join(" ") : a;
  }
}, Gf = {
  ...rn,
  getAnimatableNone: (a) => {
    const l = rn.parse(a);
    return rn.createTransformer(a)(l.map((r) => typeof r == "number" ? 0 : typeof r == "object" ? { ...r, alpha: 1 } : r));
  }
}, xg = {
  ...ka,
  transform: Math.round
}, RA = {
  rotate: Gn,
  /**
   * Internal channel for `transition.path` orientToPath. Composed onto
   * `rotate` at the transform-build sites so the user's `rotate` is
   * never read or overwritten. Not part of `transformPropOrder`.
   */
  pathRotation: Gn,
  rotateX: Gn,
  rotateY: Gn,
  rotateZ: Gn,
  scale: Xs,
  scaleX: Xs,
  scaleY: Xs,
  scaleZ: Xs,
  skew: Gn,
  skewX: Gn,
  skewY: Gn,
  distance: P,
  translateX: P,
  translateY: P,
  translateZ: P,
  x: P,
  y: P,
  z: P,
  perspective: P,
  transformPerspective: P,
  opacity: iu,
  originX: fg,
  originY: fg,
  originZ: P
}, so = {
  // Border props
  borderWidth: P,
  borderTopWidth: P,
  borderRightWidth: P,
  borderBottomWidth: P,
  borderLeftWidth: P,
  borderRadius: P,
  borderTopLeftRadius: P,
  borderTopRightRadius: P,
  borderBottomRightRadius: P,
  borderBottomLeftRadius: P,
  // Positioning props
  width: P,
  maxWidth: P,
  height: P,
  maxHeight: P,
  top: P,
  right: P,
  bottom: P,
  left: P,
  inset: P,
  insetBlock: P,
  insetBlockStart: P,
  insetBlockEnd: P,
  insetInline: P,
  insetInlineStart: P,
  insetInlineEnd: P,
  // Spacing props
  padding: P,
  paddingTop: P,
  paddingRight: P,
  paddingBottom: P,
  paddingLeft: P,
  paddingBlock: P,
  paddingBlockStart: P,
  paddingBlockEnd: P,
  paddingInline: P,
  paddingInlineStart: P,
  paddingInlineEnd: P,
  margin: P,
  marginTop: P,
  marginRight: P,
  marginBottom: P,
  marginLeft: P,
  marginBlock: P,
  marginBlockStart: P,
  marginBlockEnd: P,
  marginInline: P,
  marginInlineStart: P,
  marginInlineEnd: P,
  // Typography
  fontSize: P,
  // Misc
  backgroundPositionX: P,
  backgroundPositionY: P,
  ...RA,
  zIndex: xg,
  // SVG
  fillOpacity: iu,
  strokeOpacity: iu,
  numOctaves: xg
}, NA = {
  ...so,
  // Color props
  color: It,
  backgroundColor: It,
  outlineColor: It,
  fill: It,
  stroke: It,
  // Border props
  borderColor: It,
  borderTopColor: It,
  borderRightColor: It,
  borderBottomColor: It,
  borderLeftColor: It,
  filter: Yf,
  WebkitFilter: Yf,
  mask: Gf,
  WebkitMask: Gf
}, Rv = (a) => NA[a], VA = /* @__PURE__ */ new Set([Yf, Gf]);
function Nv(a, l) {
  let o = Rv(a);
  return VA.has(o) || (o = rn), o.getAnimatableNone ? o.getAnimatableNone(l) : void 0;
}
const _A = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function UA(a, l, o) {
  let r = 0, c;
  for (; r < a.length && !c; ) {
    const d = a[r];
    typeof d == "string" && !_A.has(d) && Pa(d).values.length && (c = a[r]), r++;
  }
  if (c && o)
    for (const d of l)
      a[d] = Nv(o, c);
}
class BA extends rh {
  constructor(l, o, r, c, d) {
    super(l, o, r, c, d, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: l, element: o, name: r } = this;
    if (!o || !o.current)
      return;
    super.readKeyframes();
    for (let p = 0; p < l.length; p++) {
      let g = l[p];
      if (typeof g == "string" && (g = g.trim(), ih(g))) {
        const b = Mv(g, o.current);
        b !== void 0 && (l[p] = b), p === l.length - 1 && (this.finalKeyframe = g);
      }
    }
    if (this.resolveNoneKeyframes(), !Dv.has(r) || l.length !== 2)
      return;
    const [c, d] = l, h = Dg(c), y = Dg(d), v = cg(c), S = cg(d);
    if (v !== S && Si[r]) {
      this.needsMeasurement = !0;
      return;
    }
    if (h !== y)
      if (Sg(h) && Sg(y))
        for (let p = 0; p < l.length; p++) {
          const g = l[p];
          typeof g == "string" && (l[p] = parseFloat(g));
        }
      else Si[r] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: l, name: o } = this, r = [];
    for (let c = 0; c < l.length; c++)
      (l[c] === null || xA(l[c])) && r.push(c);
    r.length && UA(l, r, o);
  }
  measureInitialState() {
    const { element: l, unresolvedKeyframes: o, name: r } = this;
    if (!l || !l.current)
      return;
    r === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = Si[r](l.measureViewportBox(), window.getComputedStyle(l.current)), o[0] = this.measuredOrigin;
    const c = o[o.length - 1];
    c !== void 0 && l.getValue(r, c).jump(c, !1);
  }
  measureEndState() {
    const { element: l, name: o, unresolvedKeyframes: r } = this;
    if (!l || !l.current)
      return;
    const c = l.getValue(o);
    c && c.jump(this.measuredOrigin, !1);
    const d = r.length - 1, h = r[d];
    r[d] = Si[o](l.measureViewportBox(), window.getComputedStyle(l.current)), h !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = h), this.removedTransforms?.length && this.removedTransforms.forEach(([y, v]) => {
      l.getValue(y).set(v);
    }), this.resolveNoneKeyframes();
  }
}
const gh = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius"
];
function ph(a, l, o) {
  if (a == null)
    return [];
  if (a instanceof EventTarget)
    return [a];
  if (typeof a == "string") {
    let r = document;
    l && (r = l.current);
    const c = o?.[a] ?? r.querySelectorAll(a);
    return c ? Array.from(c) : [];
  }
  return Array.from(a).filter((r) => r != null);
}
const qf = (a, l) => l && typeof a == "number" ? l.transform(a) : a;
function wA(a) {
  return wp(a) && "offsetHeight" in a && !("ownerSVGElement" in a);
}
const { schedule: vh } = /* @__PURE__ */ Wp(queueMicrotask, !1), on = {
  x: !1,
  y: !1
};
function Vv() {
  return on.x || on.y;
}
function HA(a) {
  return a === "x" || a === "y" ? on[a] ? null : (on[a] = !0, () => {
    on[a] = !1;
  }) : on.x || on.y ? null : (on.x = on.y = !0, () => {
    on.x = on.y = !1;
  });
}
function _v(a, l) {
  const o = ph(a), r = new AbortController(), c = {
    passive: !0,
    ...l,
    signal: r.signal
  };
  return [o, c, () => r.abort()];
}
function LA(a) {
  return !(a.pointerType === "touch" || Vv());
}
function jA(a, l, o = {}) {
  const [r, c, d] = _v(a, o);
  return r.forEach((h) => {
    let y = !1, v = !1, S;
    const p = () => {
      h.removeEventListener("pointerleave", R);
    }, g = (U) => {
      S && (S(U), S = void 0), p();
    }, b = (U) => {
      y = !1, window.removeEventListener("pointerup", b), window.removeEventListener("pointercancel", b), v && (v = !1, g(U));
    }, N = () => {
      y = !0, window.addEventListener("pointerup", b, c), window.addEventListener("pointercancel", b, c);
    }, R = (U) => {
      if (U.pointerType !== "touch") {
        if (y) {
          v = !0;
          return;
        }
        g(U);
      }
    }, B = (U) => {
      if (!LA(U))
        return;
      v = !1;
      const w = l(h, U);
      typeof w == "function" && (S = w, h.addEventListener("pointerleave", R, c));
    };
    h.addEventListener("pointerenter", B, c), h.addEventListener("pointerdown", N, c);
  }), d;
}
const Uv = (a, l) => l ? a === l ? !0 : Uv(a, l.parentElement) : !1, Sh = (a) => a.pointerType === "mouse" ? typeof a.button != "number" || a.button <= 0 : a.isPrimary !== !1, YA = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function GA(a) {
  return YA.has(a.tagName) || a.isContentEditable === !0;
}
const qA = /* @__PURE__ */ new Set(["INPUT", "SELECT", "TEXTAREA"]);
function XA(a) {
  return qA.has(a.tagName) || a.isContentEditable === !0;
}
const Fs = /* @__PURE__ */ new WeakSet();
function Cg(a) {
  return (l) => {
    l.key === "Enter" && a(l);
  };
}
function df(a, l) {
  a.dispatchEvent(new PointerEvent("pointer" + l, { isPrimary: !0, bubbles: !0 }));
}
const QA = (a, l) => {
  const o = a.currentTarget;
  if (!o)
    return;
  const r = Cg(() => {
    if (Fs.has(o))
      return;
    df(o, "down");
    const c = Cg(() => {
      df(o, "up");
    }), d = () => df(o, "cancel");
    o.addEventListener("keyup", c, l), o.addEventListener("blur", d, l);
  });
  o.addEventListener("keydown", r, l), o.addEventListener("blur", () => o.removeEventListener("keydown", r), l);
};
function Og(a) {
  return Sh(a) && !Vv();
}
const zg = /* @__PURE__ */ new WeakSet();
function ZA(a, l, o = {}) {
  const [r, c, d] = _v(a, o), h = (y) => {
    const v = y.currentTarget;
    if (!Og(y) || zg.has(y))
      return;
    Fs.add(v), o.stopPropagation && zg.add(y);
    const S = l(v, y), p = { ...c, capture: !0 }, g = (R, B) => {
      window.removeEventListener("pointerup", b, p), window.removeEventListener("pointercancel", N, p), Fs.has(v) && Fs.delete(v), Og(R) && typeof S == "function" && S(R, { success: B });
    }, b = (R) => {
      g(R, v === window || v === document || o.useGlobalTarget || Uv(v, R.target));
    }, N = (R) => {
      g(R, !1);
    };
    window.addEventListener("pointerup", b, p), window.addEventListener("pointercancel", N, p);
  };
  return r.forEach((y) => {
    (o.useGlobalTarget ? window : y).addEventListener("pointerdown", h, c), wA(y) && (y.addEventListener("focus", (S) => QA(S, c)), !GA(y) && !y.hasAttribute("tabindex") && (y.tabIndex = 0));
  }), d;
}
function go(a) {
  return wp(a) && "ownerSVGElement" in a;
}
const Ps = /* @__PURE__ */ new WeakMap();
let ks;
const Bv = (a, l, o) => (r, c) => c && c[0] ? c[0][a + "Size"] : go(r) && "getBBox" in r ? r.getBBox()[l] : r[o], KA = /* @__PURE__ */ Bv("inline", "width", "offsetWidth"), JA = /* @__PURE__ */ Bv("block", "height", "offsetHeight");
function FA({ target: a, borderBoxSize: l }) {
  Ps.get(a)?.forEach((o) => {
    o(a, {
      get width() {
        return KA(a, l);
      },
      get height() {
        return JA(a, l);
      }
    });
  });
}
function PA(a) {
  a.forEach(FA);
}
function kA() {
  typeof ResizeObserver > "u" || (ks = new ResizeObserver(PA));
}
function WA(a, l) {
  ks || kA();
  const o = ph(a);
  return o.forEach((r) => {
    let c = Ps.get(r);
    c || (c = /* @__PURE__ */ new Set(), Ps.set(r, c)), c.add(l), ks?.observe(r);
  }), () => {
    o.forEach((r) => {
      const c = Ps.get(r);
      c?.delete(l), c?.size || ks?.unobserve(r);
    });
  };
}
const Ws = /* @__PURE__ */ new Set();
let Za;
function $A() {
  Za = () => {
    const a = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      }
    };
    Ws.forEach((l) => l(a));
  }, window.addEventListener("resize", Za);
}
function IA(a) {
  return Ws.add(a), Za || $A(), () => {
    Ws.delete(a), !Ws.size && typeof Za == "function" && (window.removeEventListener("resize", Za), Za = void 0);
  };
}
function Rg(a, l) {
  return typeof a == "function" ? IA(a) : WA(a, l);
}
function wv(a) {
  return go(a) && a.tagName === "svg";
}
function t2(...a) {
  const l = !Array.isArray(a[0]), o = l ? 0 : -1, r = a[0 + o], c = a[1 + o], d = a[2 + o], h = a[3 + o], y = rv(c, d, h);
  return l ? y(r) : y;
}
const e2 = [...zv, It, rn], n2 = (a) => e2.find(Ov(a)), Ng = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Ka = () => ({
  x: Ng(),
  y: Ng()
}), Vg = () => ({ min: 0, max: 0 }), $t = () => ({
  x: Vg(),
  y: Vg()
}), lu = /* @__PURE__ */ new WeakMap();
function po(a) {
  return a !== null && typeof a == "object" && typeof a.start == "function";
}
function uu(a) {
  return typeof a == "string" || Array.isArray(a);
}
const Th = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], bh = ["initial", ...Th];
function vo(a) {
  return po(a.animate) || bh.some((l) => uu(a[l]));
}
function Hv(a) {
  return !!(vo(a) || a.variants);
}
function i2(a, l, o) {
  for (const r in l) {
    const c = l[r], d = o[r];
    if (ee(c))
      a.addValue(r, c);
    else if (ee(d))
      a.addValue(r, bi(c, { owner: a }));
    else if (d !== c)
      if (a.hasValue(r)) {
        const h = a.getValue(r);
        h.liveStyle === !0 ? h.jump(c) : h.hasAnimated || h.set(c);
      } else {
        const h = a.getStaticValue(r);
        a.addValue(r, bi(h !== void 0 ? h : c, { owner: a }));
      }
  }
  for (const r in o)
    l[r] === void 0 && a.removeValue(r);
  return l;
}
const oo = { current: null }, Eh = { current: !1 }, a2 = typeof window < "u";
function Lv() {
  if (Eh.current = !0, !!a2)
    if (window.matchMedia) {
      const a = window.matchMedia("(prefers-reduced-motion)"), l = () => oo.current = a.matches;
      a.addEventListener("change", l), l();
    } else
      oo.current = !1;
}
const _g = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
let ro = {};
function jv(a) {
  ro = a;
}
function l2() {
  return ro;
}
class Yv {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(l, o, r) {
    return {};
  }
  constructor({ parent: l, props: o, presenceContext: r, reducedMotionConfig: c, skipAnimations: d, blockInitialAnimation: h, visualState: y }, v = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = rh, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const N = Te.now();
      this.renderScheduledAt < N && (this.renderScheduledAt = N, Ut.render(this.render, !1, !0));
    };
    const { latestValues: S, renderState: p } = y;
    this.latestValues = S, this.baseTarget = { ...S }, this.initialValues = o.initial ? { ...S } : {}, this.renderState = p, this.parent = l, this.props = o, this.presenceContext = r, this.depth = l ? l.depth + 1 : 0, this.reducedMotionConfig = c, this.skipAnimationsConfig = d, this.options = v, this.blockInitialAnimation = !!h, this.isControllingVariants = vo(o), this.isVariantNode = Hv(o), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(l && l.current);
    const { willChange: g, ...b } = this.scrapeMotionValuesFromProps(o, {}, this);
    for (const N in b) {
      const R = b[N];
      S[N] !== void 0 && ee(R) && R.set(S[N]);
    }
  }
  mount(l) {
    if (this.hasBeenMounted)
      for (const o in this.initialValues)
        this.values.get(o)?.jump(this.initialValues[o]), this.latestValues[o] = this.initialValues[o];
    this.current = l, lu.set(l, this), this.projection && !this.projection.instance && this.projection.mount(l), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((o, r) => this.bindToMotionValue(r, o)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (Eh.current || Lv(), this.shouldReduceMotion = oo.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
  }
  unmount() {
    this.projection && this.projection.unmount(), qn(this.notifyUpdate), qn(this.render), this.valueSubscriptions.forEach((l) => l()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
    for (const l in this.events)
      this.events[l].clear();
    for (const l in this.features) {
      const o = this.features[l];
      o && (o.unmount(), o.isMounted = !1);
    }
    this.current = null;
  }
  addChild(l) {
    this.children.add(l), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(l);
  }
  removeChild(l) {
    this.children.delete(l), this.enteringChildren && this.enteringChildren.delete(l);
  }
  bindToMotionValue(l, o) {
    if (this.valueSubscriptions.has(l) && this.valueSubscriptions.get(l)(), o.accelerate && bv.has(l) && this.current instanceof HTMLElement) {
      const { factory: h, keyframes: y, times: v, ease: S, duration: p } = o.accelerate, g = new Sv({
        element: this.current,
        name: l,
        keyframes: y,
        times: v,
        ease: S,
        duration: /* @__PURE__ */ Oe(p)
      }), b = h(g);
      this.valueSubscriptions.set(l, () => {
        b(), g.cancel();
      });
      return;
    }
    const r = $a.has(l);
    r && this.onBindTransform && this.onBindTransform();
    const c = o.on("change", (h) => {
      this.latestValues[l] = h, this.props.onUpdate && Ut.preRender(this.notifyUpdate), r && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let d;
    typeof window < "u" && window.MotionCheckAppearSync && (d = window.MotionCheckAppearSync(this, l, o)), this.valueSubscriptions.set(l, () => {
      c(), d && d();
    });
  }
  sortNodePosition(l) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== l.type ? 0 : this.sortInstanceNodePosition(this.current, l.current);
  }
  updateFeatures() {
    let l = "animation";
    for (l in ro) {
      const o = ro[l];
      if (!o)
        continue;
      const { isEnabled: r, Feature: c } = o;
      if (!this.features[l] && c && r(this.props) && (this.features[l] = new c(this)), this.features[l]) {
        const d = this.features[l];
        d.isMounted ? d.update() : (d.mount(), d.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : $t();
  }
  getStaticValue(l) {
    return this.latestValues[l];
  }
  setStaticValue(l, o) {
    this.latestValues[l] = o;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(l, o) {
    (l.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = l, this.prevPresenceContext = this.presenceContext, this.presenceContext = o;
    for (let r = 0; r < _g.length; r++) {
      const c = _g[r];
      this.propEventSubscriptions[c] && (this.propEventSubscriptions[c](), delete this.propEventSubscriptions[c]);
      const d = "on" + c, h = l[d];
      h && (this.propEventSubscriptions[c] = this.on(c, h));
    }
    this.prevMotionValues = i2(this, this.scrapeMotionValuesFromProps(l, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(l) {
    return this.props.variants ? this.props.variants[l] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(l) {
    const o = this.getClosestVariantNode();
    if (o)
      return o.variantChildren && o.variantChildren.add(l), () => o.variantChildren.delete(l);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(l, o) {
    const r = this.values.get(l);
    o !== r && (r && this.removeValue(l), this.bindToMotionValue(l, o), this.values.set(l, o), this.latestValues[l] = o.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(l) {
    this.values.delete(l);
    const o = this.valueSubscriptions.get(l);
    o && (o(), this.valueSubscriptions.delete(l)), delete this.latestValues[l], this.removeValueFromRenderState(l, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(l) {
    return this.values.has(l);
  }
  getValue(l, o) {
    if (this.props.values && this.props.values[l])
      return this.props.values[l];
    let r = this.values.get(l);
    return r === void 0 && o !== void 0 && (r = bi(o === null ? void 0 : o, { owner: this }), this.addValue(l, r)), r;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(l, o) {
    let r = this.latestValues[l] !== void 0 || !this.current ? this.latestValues[l] : this.getBaseTargetFromProps(this.props, l) ?? this.readValueFromInstance(this.current, l, this.options);
    return r != null && (typeof r == "string" && (Bp(r) || Hp(r)) ? r = parseFloat(r) : !n2(r) && rn.test(o) && (r = Nv(l, o)), this.setBaseTarget(l, ee(r) ? r.get() : r)), ee(r) ? r.get() : r;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(l, o) {
    this.baseTarget[l] = o;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(l) {
    const { initial: o } = this.props;
    let r;
    if (typeof o == "string" || typeof o == "object") {
      const d = dh(this.props, o, this.presenceContext?.custom);
      d && (r = d[l]);
    }
    if (o && r !== void 0)
      return r;
    const c = this.getBaseTargetFromProps(this.props, l);
    return c !== void 0 && !ee(c) ? c : this.initialValues[l] !== void 0 && r === void 0 ? void 0 : this.baseTarget[l];
  }
  on(l, o) {
    return this.events[l] || (this.events[l] = new If()), this.events[l].add(o);
  }
  notify(l, ...o) {
    this.events[l] && this.events[l].notify(...o);
  }
  scheduleRenderMicrotask() {
    vh.render(this.render);
  }
}
class Gv extends Yv {
  constructor() {
    super(...arguments), this.KeyframeResolver = BA;
  }
  sortInstanceNodePosition(l, o) {
    return l.compareDocumentPosition(o) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(l, o) {
    const r = l.style;
    return r ? r[o] : void 0;
  }
  removeValueFromRenderState(l, { vars: o, style: r }) {
    delete o[l], delete r[l];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: l } = this.props;
    ee(l) && (this.childSubscription = l.on("change", (o) => {
      this.current && (this.current.textContent = `${o}`);
    }));
  }
}
class Ei {
  constructor(l) {
    this.isMounted = !1, this.node = l;
  }
  update() {
  }
}
function qv({ top: a, left: l, right: o, bottom: r }) {
  return {
    x: { min: l, max: o },
    y: { min: a, max: r }
  };
}
function u2({ x: a, y: l }) {
  return { top: l.min, right: a.max, bottom: l.max, left: a.min };
}
function s2(a, l) {
  if (!l)
    return a;
  const o = l({ x: a.left, y: a.top }), r = l({ x: a.right, y: a.bottom });
  return {
    top: o.y,
    left: o.x,
    bottom: r.y,
    right: r.x
  };
}
function mf(a) {
  return a === void 0 || a === 1;
}
function Xf({ scale: a, scaleX: l, scaleY: o }) {
  return !mf(a) || !mf(l) || !mf(o);
}
function Ji(a) {
  return Xf(a) || Xv(a) || a.z || a.rotate || a.rotateX || a.rotateY || a.skewX || a.skewY;
}
function Xv(a) {
  return Ug(a.x) || Ug(a.y);
}
function Ug(a) {
  return a && a !== "0%";
}
function co(a, l, o) {
  const r = a - o, c = l * r;
  return o + c;
}
function Bg(a, l, o, r, c) {
  return c !== void 0 && (a = co(a, c, r)), co(a, o, r) + l;
}
function Qf(a, l = 0, o = 1, r, c) {
  a.min = Bg(a.min, l, o, r, c), a.max = Bg(a.max, l, o, r, c);
}
function Qv(a, { x: l, y: o }) {
  Qf(a.x, l.translate, l.scale, l.originPoint), Qf(a.y, o.translate, o.scale, o.originPoint);
}
const wg = 0.999999999999, Hg = 1.0000000000001;
function o2(a, l, o, r = !1) {
  const c = o.length;
  if (!c)
    return;
  l.x = l.y = 1;
  let d, h;
  for (let y = 0; y < c; y++) {
    d = o[y], h = d.projectionDelta;
    const { visualElement: v } = d.options;
    v && v.props.style && v.props.style.display === "contents" || (r && d.options.layoutScroll && d.scroll && d !== d.root && (An(a.x, -d.scroll.offset.x), An(a.y, -d.scroll.offset.y)), h && (l.x *= h.x.scale, l.y *= h.y.scale, Qv(a, h)), r && Ji(d.latestValues) && $s(a, d.latestValues, d.layout?.layoutBox));
  }
  l.x < Hg && l.x > wg && (l.x = 1), l.y < Hg && l.y > wg && (l.y = 1);
}
function An(a, l) {
  a.min += l, a.max += l;
}
function Lg(a, l, o, r, c = 0.5) {
  const d = _t(a.min, a.max, c);
  Qf(a, l, o, d, r);
}
function jg(a, l) {
  return typeof a == "string" ? parseFloat(a) / 100 * (l.max - l.min) : a;
}
function $s(a, l, o) {
  const r = o ?? a;
  Lg(a.x, jg(l.x, r.x), l.scaleX, l.scale, l.originX), Lg(a.y, jg(l.y, r.y), l.scaleY, l.scale, l.originY);
}
function Zv(a, l) {
  return qv(s2(a.getBoundingClientRect(), l));
}
function r2(a, l, o) {
  const r = Zv(a, o), { scroll: c } = l;
  return c && (An(r.x, c.offset.x), An(r.y, c.offset.y)), r;
}
const c2 = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, f2 = Wa.length;
function h2(a, l, o) {
  let r = "", c = !0;
  for (let h = 0; h < f2; h++) {
    const y = Wa[h], v = a[y];
    if (v === void 0)
      continue;
    let S = !0;
    if (typeof v == "number")
      S = v === (y.startsWith("scale") ? 1 : 0);
    else {
      const p = parseFloat(v);
      S = y.startsWith("scale") ? p === 1 : p === 0;
    }
    if (!S || o) {
      const p = qf(v, so[y]);
      if (!S) {
        c = !1;
        const g = c2[y] || y;
        r += `${g}(${p}) `;
      }
      o && (l[y] = p);
    }
  }
  const d = a.pathRotation;
  return d && (c = !1, r += `rotate(${qf(d, so.pathRotation)}) `), r = r.trim(), o ? r = o(l, c ? "" : r) : c && (r = "none"), r;
}
function Ah(a, l, o) {
  const { style: r, vars: c, transformOrigin: d } = a;
  let h = !1, y = !1;
  for (const v in l) {
    const S = l[v];
    if ($a.has(v)) {
      h = !0;
      continue;
    } else if (Ip(v)) {
      c[v] = S;
      continue;
    } else {
      const p = qf(S, so[v]);
      v.startsWith("origin") ? (y = !0, d[v] = p) : r[v] = p;
    }
  }
  if (l.transform || (h || o ? r.transform = h2(l, a.transform, o) : r.transform && (r.transform = "none")), y) {
    const { originX: v = "50%", originY: S = "50%", originZ: p = 0 } = d;
    r.transformOrigin = `${v} ${S} ${p}`;
  }
}
function Kv(a, { style: l, vars: o }, r, c) {
  const d = a.style;
  let h;
  for (h in l)
    d[h] = l[h];
  c?.applyProjectionStyles(d, r);
  for (h in o)
    d.setProperty(h, o[h]);
}
function Yg(a, l) {
  return l.max === l.min ? 0 : a / (l.max - l.min) * 100;
}
const Pl = {
  correct: (a, l) => {
    if (!l.target)
      return a;
    if (typeof a == "string")
      if (P.test(a))
        a = parseFloat(a);
      else
        return a;
    const o = Yg(a, l.target.x), r = Yg(a, l.target.y);
    return `${o}% ${r}%`;
  }
}, d2 = {
  correct: (a, { treeScale: l, projectionDelta: o }) => {
    const r = a, c = rn.parse(a);
    if (c.length > 5)
      return r;
    const d = rn.createTransformer(a), h = typeof c[0] != "number" ? 1 : 0, y = o.x.scale * l.x, v = o.y.scale * l.y;
    c[0 + h] /= y, c[1 + h] /= v;
    const S = _t(y, v, 0.5);
    return typeof c[2 + h] == "number" && (c[2 + h] /= S), typeof c[3 + h] == "number" && (c[3 + h] /= S), d(c);
  }
}, Zf = {
  borderRadius: {
    ...Pl,
    applyTo: [...gh]
  },
  borderTopLeftRadius: Pl,
  borderTopRightRadius: Pl,
  borderBottomLeftRadius: Pl,
  borderBottomRightRadius: Pl,
  boxShadow: d2
};
function Jv(a, { layout: l, layoutId: o }) {
  return $a.has(a) || a.startsWith("origin") || (l || o !== void 0) && (!!Zf[a] || a === "opacity");
}
function Mh(a, l, o) {
  const r = a.style, c = l?.style, d = {};
  if (!r)
    return d;
  for (const h in r)
    (ee(r[h]) || c && ee(c[h]) || Jv(h, a) || o?.getValue(h)?.liveStyle !== void 0) && (d[h] = r[h]);
  return d;
}
function m2(a) {
  return window.getComputedStyle(a);
}
class Fv extends Gv {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = Kv;
  }
  mount(l) {
    mo(!!l.style), super.mount(l);
  }
  readValueFromInstance(l, o) {
    if ($a.has(o))
      return this.projection?.isProjecting ? Nf(o) : BE(l, o);
    {
      const r = m2(l), c = (Ip(o) ? r.getPropertyValue(o) : r[o]) || 0;
      return typeof c == "string" ? c.trim() : c;
    }
  }
  measureInstanceViewportBox(l, { transformPagePoint: o }) {
    return Zv(l, o);
  }
  build(l, o, r) {
    Ah(l, o, r.transformTemplate);
  }
  scrapeMotionValuesFromProps(l, o, r) {
    return Mh(l, o, r);
  }
}
function y2(a, l) {
  return a in l;
}
class g2 extends Yv {
  constructor() {
    super(...arguments), this.type = "object";
  }
  readValueFromInstance(l, o) {
    if (y2(o, l)) {
      const r = l[o];
      if (typeof r == "string" || typeof r == "number")
        return r;
    }
  }
  getBaseTargetFromProps() {
  }
  removeValueFromRenderState(l, o) {
    delete o.output[l];
  }
  measureInstanceViewportBox() {
    return $t();
  }
  build(l, o) {
    Object.assign(l.output, o);
  }
  renderInstance(l, { output: o }) {
    Object.assign(l, o);
  }
  sortInstanceNodePosition() {
    return 0;
  }
}
const p2 = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, v2 = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function S2(a, l, o = 1, r = 0, c = !0) {
  a.pathLength = 1;
  const d = c ? p2 : v2;
  a[d.offset] = `${-r}`, a[d.array] = `${l} ${o}`;
}
const T2 = [
  "offsetDistance",
  "offsetPath",
  "offsetRotate",
  "offsetAnchor"
];
function Pv(a, {
  attrX: l,
  attrY: o,
  attrScale: r,
  pathLength: c,
  pathSpacing: d = 1,
  pathOffset: h = 0,
  // This is object creation, which we try to avoid per-frame.
  ...y
}, v, S, p) {
  if (Ah(a, y, S), v) {
    a.style.viewBox && (a.attrs.viewBox = a.style.viewBox);
    return;
  }
  a.attrs = a.style, a.style = {};
  const { attrs: g, style: b } = a;
  g.transform && (b.transform = g.transform, delete g.transform), (b.transform || g.transformOrigin) && (b.transformOrigin = g.transformOrigin ?? "50% 50%", delete g.transformOrigin), b.transform && (b.transformBox = p?.transformBox ?? "fill-box", delete g.transformBox);
  for (const N of T2)
    g[N] !== void 0 && (b[N] = g[N], delete g[N]);
  l !== void 0 && (g.x = l), o !== void 0 && (g.y = o), r !== void 0 && (g.scale = r), c !== void 0 && S2(g, c, d, h, !1);
}
const kv = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]), Wv = (a) => typeof a == "string" && a.toLowerCase() === "svg";
function b2(a, l, o, r) {
  Kv(a, l, void 0, r);
  for (const c in l.attrs)
    a.setAttribute(kv.has(c) ? c : mh(c), l.attrs[c]);
}
function $v(a, l, o) {
  const r = Mh(a, l, o);
  for (const c in a)
    if (ee(a[c]) || ee(l[c])) {
      const d = Wa.indexOf(c) !== -1 ? "attr" + c.charAt(0).toUpperCase() + c.substring(1) : c;
      r[d] = a[c];
    }
  return r;
}
class Iv extends Gv {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = $t;
  }
  getBaseTargetFromProps(l, o) {
    return l[o];
  }
  readValueFromInstance(l, o) {
    if ($a.has(o)) {
      const r = Rv(o);
      return r && r.default || 0;
    }
    return o = kv.has(o) ? o : mh(o), l.getAttribute(o);
  }
  scrapeMotionValuesFromProps(l, o, r) {
    return $v(l, o, r);
  }
  build(l, o, r) {
    Pv(l, o, this.isSVGTag, r.transformTemplate, r.style);
  }
  renderInstance(l, o, r, c) {
    b2(l, o, r, c);
  }
  mount(l) {
    this.isSVGTag = Wv(l.tagName), super.mount(l);
  }
}
const E2 = bh.length;
function t1(a) {
  if (!a)
    return;
  if (!a.isControllingVariants) {
    const o = a.parent ? t1(a.parent) || {} : {};
    return a.props.initial !== void 0 && (o.initial = a.props.initial), o;
  }
  const l = {};
  for (let o = 0; o < E2; o++) {
    const r = bh[o], c = a.props[r];
    (uu(c) || c === !1) && (l[r] = c);
  }
  return l;
}
function e1(a, l) {
  if (!Array.isArray(l))
    return !1;
  const o = l.length;
  if (o !== a.length)
    return !1;
  for (let r = 0; r < o; r++)
    if (l[r] !== a[r])
      return !1;
  return !0;
}
const A2 = [...Th].reverse(), M2 = Th.length;
function D2(a) {
  return (l) => Promise.all(l.map(({ animation: o, options: r }) => MA(a, o, r)));
}
function x2(a) {
  let l = D2(a), o = Gg(), r = !0, c = !1;
  const d = (S) => (p, g) => {
    const b = Wi(a, g, S === "exit" ? a.presenceContext?.custom : void 0);
    if (b) {
      const { transition: N, transitionEnd: R, ...B } = b;
      p = { ...p, ...B, ...R };
    }
    return p;
  };
  function h(S) {
    l = S(a);
  }
  function y(S) {
    const { props: p } = a, g = t1(a.parent) || {}, b = [], N = /* @__PURE__ */ new Set();
    let R = {}, B = 1 / 0;
    for (let w = 0; w < M2; w++) {
      const L = A2[w], Y = o[L], q = p[L] !== void 0 ? p[L] : g[L], et = uu(q), st = L === S ? Y.isActive : null;
      st === !1 && (B = w);
      let G = q === g[L] && q !== p[L] && et;
      if (G && (r || c) && a.manuallyAnimateOnMount && (G = !1), Y.protectedKeys = { ...R }, // If it isn't active and hasn't *just* been set as inactive
      !Y.isActive && st === null || // If we didn't and don't have any defined prop for this animation type
      !q && !Y.prevProp || // Or if the prop doesn't define an animation
      po(q) || typeof q == "boolean")
        continue;
      if (L === "exit" && Y.isActive && st !== !0) {
        Y.prevResolvedValues && (R = {
          ...R,
          ...Y.prevResolvedValues
        });
        continue;
      }
      const X = C2(Y.prevProp, q);
      let lt = X || // If we're making this variant active, we want to always make it active
      L === S && Y.isActive && !G && et || // If we removed a higher-priority variant (i is in reverse order)
      w > B && et, J = !1;
      const rt = Array.isArray(q) ? q : [q];
      let nt = rt.reduce(d(L), {});
      st === !1 && (nt = {});
      const { prevResolvedValues: Dt = {} } = Y, Ot = {
        ...Dt,
        ...nt
      }, mt = (Z) => {
        lt = !0, N.has(Z) && (J = !0, N.delete(Z)), Y.needsAnimating[Z] = !0;
        const ft = a.getValue(Z);
        ft && (ft.liveStyle = !1);
      };
      for (const Z in Ot) {
        const ft = nt[Z], ot = Dt[Z];
        if (R.hasOwnProperty(Z))
          continue;
        let wt = !1;
        Hf(ft) && Hf(ot) ? wt = !e1(ft, ot) || X : wt = ft !== ot, wt ? ft != null ? mt(Z) : N.add(Z) : ft !== void 0 && N.has(Z) ? mt(Z) : Y.protectedKeys[Z] = !0;
      }
      Y.prevProp = q, Y.prevResolvedValues = nt, Y.isActive && (R = { ...R, ...nt }), (r || c) && a.blockInitialAnimation && (lt = !1);
      const j = G && X;
      lt && (!j || J) && b.push(...rt.map((Z) => {
        const ft = { type: L };
        if (typeof Z == "string" && (r || c) && !j && a.manuallyAnimateOnMount && a.parent) {
          const { parent: ot } = a, wt = Wi(ot, Z);
          if (ot.enteringChildren && wt) {
            const { delayChildren: ue } = wt.transition || {};
            ft.delay = Ev(ot.enteringChildren, a, ue);
          }
        }
        return {
          animation: Z,
          options: ft
        };
      }));
    }
    if (N.size) {
      const w = {};
      if (typeof p.initial != "boolean") {
        const L = Wi(a, Array.isArray(p.initial) ? p.initial[0] : p.initial);
        L && L.transition && (w.transition = L.transition);
      }
      N.forEach((L) => {
        const Y = a.getBaseTarget(L), q = a.getValue(L);
        q && (q.liveStyle = !0), w[L] = Y ?? null;
      }), b.push({ animation: w });
    }
    let U = !!b.length;
    return r && (p.initial === !1 || p.initial === p.animate) && !a.manuallyAnimateOnMount && (U = !1), r = !1, c = !1, U ? l(b) : Promise.resolve();
  }
  function v(S, p) {
    if (o[S].isActive === p)
      return Promise.resolve();
    a.variantChildren?.forEach((b) => b.animationState?.setActive(S, p)), o[S].isActive = p;
    const g = y(S);
    for (const b in o)
      o[b].protectedKeys = {};
    return g;
  }
  return {
    animateChanges: y,
    setActive: v,
    setAnimateFunction: h,
    getState: () => o,
    reset: () => {
      o = Gg(), c = !0;
    }
  };
}
function C2(a, l) {
  return typeof l == "string" ? l !== a : Array.isArray(l) ? !e1(l, a) : !1;
}
function Ki(a = !1) {
  return {
    isActive: a,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function Gg() {
  return {
    animate: Ki(!0),
    whileInView: Ki(),
    whileHover: Ki(),
    whileTap: Ki(),
    whileDrag: Ki(),
    whileFocus: Ki(),
    exit: Ki()
  };
}
function Kf(a, l) {
  a.min = l.min, a.max = l.max;
}
function sn(a, l) {
  Kf(a.x, l.x), Kf(a.y, l.y);
}
function qg(a, l) {
  a.translate = l.translate, a.scale = l.scale, a.originPoint = l.originPoint, a.origin = l.origin;
}
const n1 = 1e-4, O2 = 1 - n1, z2 = 1 + n1, i1 = 0.01, R2 = 0 - i1, N2 = 0 + i1;
function be(a) {
  return a.max - a.min;
}
function V2(a, l, o) {
  return Math.abs(a - l) <= o;
}
function Xg(a, l, o, r = 0.5) {
  a.origin = r, a.originPoint = _t(l.min, l.max, a.origin), a.scale = be(o) / be(l), a.translate = _t(o.min, o.max, a.origin) - a.originPoint, (a.scale >= O2 && a.scale <= z2 || isNaN(a.scale)) && (a.scale = 1), (a.translate >= R2 && a.translate <= N2 || isNaN(a.translate)) && (a.translate = 0);
}
function eu(a, l, o, r) {
  Xg(a.x, l.x, o.x, r ? r.originX : void 0), Xg(a.y, l.y, o.y, r ? r.originY : void 0);
}
function Qg(a, l, o, r = 0) {
  const c = r ? _t(o.min, o.max, r) : o.min;
  a.min = c + l.min, a.max = a.min + be(l);
}
function _2(a, l, o, r) {
  Qg(a.x, l.x, o.x, r?.x), Qg(a.y, l.y, o.y, r?.y);
}
function Zg(a, l, o, r = 0) {
  const c = r ? _t(o.min, o.max, r) : o.min;
  a.min = l.min - c, a.max = a.min + be(l);
}
function fo(a, l, o, r) {
  Zg(a.x, l.x, o.x, r?.x), Zg(a.y, l.y, o.y, r?.y);
}
function Kg(a, l, o, r, c) {
  return a -= l, a = co(a, 1 / o, r), c !== void 0 && (a = co(a, 1 / c, r)), a;
}
function U2(a, l = 0, o = 1, r = 0.5, c, d = a, h = a) {
  if (Mn.test(l) && (l = parseFloat(l), l = _t(h.min, h.max, l / 100) - h.min), typeof l != "number")
    return;
  let y = _t(d.min, d.max, r);
  a === d && (y -= l), a.min = Kg(a.min, l, o, y, c), a.max = Kg(a.max, l, o, y, c);
}
function Jg(a, l, [o, r, c], d, h) {
  U2(a, l[o], l[r], l[c], l.scale, d, h);
}
const B2 = ["x", "scaleX", "originX"], w2 = ["y", "scaleY", "originY"];
function Fg(a, l, o, r) {
  Jg(a.x, l, B2, o ? o.x : void 0, r ? r.x : void 0), Jg(a.y, l, w2, o ? o.y : void 0, r ? r.y : void 0);
}
function Pg(a) {
  return a.translate === 0 && a.scale === 1;
}
function a1(a) {
  return Pg(a.x) && Pg(a.y);
}
function kg(a, l) {
  return a.min === l.min && a.max === l.max;
}
function H2(a, l) {
  return kg(a.x, l.x) && kg(a.y, l.y);
}
function Wg(a, l) {
  return Math.round(a.min) === Math.round(l.min) && Math.round(a.max) === Math.round(l.max);
}
function l1(a, l) {
  return Wg(a.x, l.x) && Wg(a.y, l.y);
}
function $g(a) {
  return be(a.x) / be(a.y);
}
function Ig(a, l) {
  return a.translate === l.translate && a.scale === l.scale && a.originPoint === l.originPoint;
}
function En(a) {
  return [a("x"), a("y")];
}
function L2(a, l, o) {
  let r = "";
  const c = a.x.translate / l.x, d = a.y.translate / l.y, h = o?.z || 0;
  if ((c || d || h) && (r = `translate3d(${c}px, ${d}px, ${h}px) `), (l.x !== 1 || l.y !== 1) && (r += `scale(${1 / l.x}, ${1 / l.y}) `), o) {
    const { transformPerspective: S, rotate: p, pathRotation: g, rotateX: b, rotateY: N, skewX: R, skewY: B } = o;
    S && (r = `perspective(${S}px) ${r}`), p && (r += `rotate(${p}deg) `), g && (r += `rotate(${g}deg) `), b && (r += `rotateX(${b}deg) `), N && (r += `rotateY(${N}deg) `), R && (r += `skewX(${R}deg) `), B && (r += `skewY(${B}deg) `);
  }
  const y = a.x.scale * l.x, v = a.y.scale * l.y;
  return (y !== 1 || v !== 1) && (r += `scale(${y}, ${v})`), r || "none";
}
const j2 = gh.length, tp = (a) => typeof a == "string" ? parseFloat(a) : a, ep = (a) => typeof a == "number" || P.test(a);
function Y2(a, l, o, r, c, d) {
  c ? (a.opacity = _t(0, o.opacity ?? 1, G2(r)), a.opacityExit = _t(l.opacity ?? 1, 0, q2(r))) : d && (a.opacity = _t(l.opacity ?? 1, o.opacity ?? 1, r));
  for (let h = 0; h < j2; h++) {
    const y = gh[h];
    let v = np(l, y), S = np(o, y);
    if (v === void 0 && S === void 0)
      continue;
    v || (v = 0), S || (S = 0), v === 0 || S === 0 || ep(v) === ep(S) ? (a[y] = Math.max(_t(tp(v), tp(S), r), 0), (Mn.test(S) || Mn.test(v)) && (a[y] += "%")) : a[y] = S;
  }
  (l.rotate || o.rotate) && (a.rotate = _t(l.rotate || 0, o.rotate || 0, r));
}
function np(a, l) {
  return a[l] !== void 0 ? a[l] : a.borderRadius;
}
const G2 = /* @__PURE__ */ u1(0, 0.5, Zp), q2 = /* @__PURE__ */ u1(0.5, 0.95, Ie);
function u1(a, l, o) {
  return (r) => r < a ? 0 : r > l ? 1 : o(/* @__PURE__ */ Fa(a, l, r));
}
function s1(a, l, o) {
  const r = ee(a) ? a : bi(a);
  return r.start(hh("", r, l, o)), r.animation;
}
function su(a, l, o, r = { passive: !0 }) {
  return a.addEventListener(l, o, r), () => a.removeEventListener(l, o, r);
}
const X2 = (a, l) => a.depth - l.depth;
class Q2 {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(l) {
    $f(this.children, l), this.isDirty = !0;
  }
  remove(l) {
    Ja(this.children, l), this.isDirty = !0;
  }
  forEach(l) {
    this.isDirty && this.children.sort(X2), this.isDirty = !1, this.children.forEach(l);
  }
}
function Z2(a, l) {
  const o = Te.now(), r = ({ timestamp: c }) => {
    const d = c - o;
    d >= l && (qn(r), a(d - l));
  };
  return Ut.setup(r, !0), () => qn(r);
}
function Is(a) {
  return ee(a) ? a.get() : a;
}
class K2 {
  constructor() {
    this.members = [];
  }
  add(l) {
    $f(this.members, l);
    for (let o = this.members.length - 1; o >= 0; o--) {
      const r = this.members[o];
      if (r === l || r === this.lead || r === this.prevLead)
        continue;
      const c = r.instance;
      (!c || c.isConnected === !1) && !r.snapshot && (Ja(this.members, r), r.unmount());
    }
    l.scheduleRender();
  }
  remove(l) {
    if (Ja(this.members, l), l === this.prevLead && (this.prevLead = void 0), l === this.lead) {
      const o = this.members[this.members.length - 1];
      o && this.promote(o);
    }
  }
  relegate(l) {
    for (let o = this.members.indexOf(l) - 1; o >= 0; o--) {
      const r = this.members[o];
      if (r.isPresent !== !1 && r.instance?.isConnected !== !1)
        return this.promote(r), !0;
    }
    return !1;
  }
  promote(l, o) {
    const r = this.lead;
    if (l !== r && (this.prevLead = r, this.lead = l, l.show(), r)) {
      r.updateSnapshot(), l.scheduleRender();
      const { layoutDependency: c } = r.options, { layoutDependency: d } = l.options;
      (c === void 0 || c !== d) && (l.resumeFrom = r, o && (r.preserveOpacity = !0), r.snapshot && (l.snapshot = r.snapshot, l.snapshot.latestValues = r.animationValues || r.latestValues), l.root?.isUpdating && (l.isLayoutDirty = !0)), l.options.crossfade === !1 && r.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((l) => {
      l.options.onExitComplete?.(), l.resumingFrom?.options.onExitComplete?.();
    });
  }
  scheduleRender() {
    this.members.forEach((l) => l.instance && l.scheduleRender(!1));
  }
  removeLeadSnapshot() {
    this.lead?.snapshot && (this.lead.snapshot = void 0);
  }
}
const to = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
}, yf = ["", "X", "Y", "Z"], J2 = 1e3;
let F2 = 0;
function gf(a, l, o, r) {
  const { latestValues: c } = l;
  c[a] && (o[a] = c[a], l.setStaticValue(a, 0), r && (r[a] = 0));
}
function o1(a) {
  if (a.hasCheckedOptimisedAppear = !0, a.root === a)
    return;
  const { visualElement: l } = a.options;
  if (!l)
    return;
  const o = Cv(l);
  if (window.MotionHasOptimisedAnimation(o, "transform")) {
    const { layout: c, layoutId: d } = a.options;
    window.MotionCancelOptimisedAnimation(o, "transform", Ut, !(c || d));
  }
  const { parent: r } = a;
  r && !r.hasCheckedOptimisedAppear && o1(r);
}
function r1({ attachResizeListener: a, defaultParent: l, measureScroll: o, checkIsScrollRoot: r, resetTransform: c }) {
  return class {
    constructor(h = {}, y = l?.()) {
      this.id = F2++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.layoutVersion = 0, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(W2), this.nodes.forEach(i3), this.nodes.forEach(a3), this.nodes.forEach($2);
      }, this.resolvedRelativeTargetAt = 0, this.linkedParentVersion = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = h, this.root = y ? y.root || y : this, this.path = y ? [...y.path, y] : [], this.parent = y, this.depth = y ? y.depth + 1 : 0;
      for (let v = 0; v < this.path.length; v++)
        this.path[v].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Q2());
    }
    addEventListener(h, y) {
      return this.eventHandlers.has(h) || this.eventHandlers.set(h, new If()), this.eventHandlers.get(h).add(y);
    }
    notifyListeners(h, ...y) {
      const v = this.eventHandlers.get(h);
      v && v.notify(...y);
    }
    hasListeners(h) {
      return this.eventHandlers.has(h);
    }
    /**
     * Lifecycles
     */
    mount(h) {
      if (this.instance)
        return;
      this.isSVG = go(h) && !wv(h), this.instance = h;
      const { layoutId: y, layout: v, visualElement: S } = this.options;
      if (S && !S.current && S.mount(h), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (v || y) && (this.isLayoutDirty = !0), a) {
        let p, g = 0;
        const b = () => this.root.updateBlockedByResize = !1;
        Ut.read(() => {
          g = window.innerWidth;
        }), a(h, () => {
          const N = window.innerWidth;
          N !== g && (g = N, this.root.updateBlockedByResize = !0, p && p(), p = Z2(b, 250), to.hasAnimatedSinceResize && (to.hasAnimatedSinceResize = !1, this.nodes.forEach(lp)));
        });
      }
      y && this.root.registerSharedNode(y, this), this.options.animate !== !1 && S && (y || v) && this.addEventListener("didUpdate", ({ delta: p, hasLayoutChanged: g, hasRelativeLayoutChanged: b, layout: N }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const R = this.options.transition || S.getDefaultTransition() || r3, { onLayoutAnimationStart: B, onLayoutAnimationComplete: U } = S.getProps(), w = !this.targetLayout || !l1(this.targetLayout, N), L = !g && b;
        if (this.options.layoutRoot || this.resumeFrom || L || g && (w || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const Y = {
            ...fh(R, "layout"),
            onPlay: B,
            onComplete: U
          };
          (S.shouldReduceMotion || this.options.layoutRoot) && (Y.delay = 0, Y.type = !1), this.startAnimation(Y), this.setAnimationOrigin(p, L, Y.path);
        } else
          g || lp(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = N;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const h = this.getStack();
      h && h.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), qn(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(l3), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: h } = this.options;
      return h && h.getProps().transformTemplate;
    }
    willUpdate(h = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && o1(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let p = 0; p < this.path.length; p++) {
        const g = this.path[p];
        g.shouldResetTransform = !0, (typeof g.latestValues.x == "string" || typeof g.latestValues.y == "string") && (g.isLayoutDirty = !0), g.updateScroll("snapshot"), g.options.layoutRoot && g.willUpdate(!1);
      }
      const { layoutId: y, layout: v } = this.options;
      if (y === void 0 && !v)
        return;
      const S = this.getTransformTemplate();
      this.prevTransformTemplateValue = S ? S(this.latestValues, "") : void 0, this.updateSnapshot(), h && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        const v = this.updateBlockedByResize;
        this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), v && this.nodes.forEach(t3), this.nodes.forEach(ip);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(ap);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(e3), this.nodes.forEach(n3), this.nodes.forEach(P2), this.nodes.forEach(k2)) : this.nodes.forEach(ap), this.clearAllSnapshots();
      const y = Te.now();
      me.delta = Dn(0, 1e3 / 60, y - me.timestamp), me.timestamp = y, me.isProcessing = !0, sf.update.process(me), sf.preRender.process(me), sf.render.process(me), me.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, vh.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(I2), this.sharedNodes.forEach(u3);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Ut.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Ut.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !be(this.snapshot.measuredBox.x) && !be(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let v = 0; v < this.path.length; v++)
          this.path[v].updateScroll();
      const h = this.layout;
      this.layout = this.measure(!1), this.layoutVersion++, this.layoutCorrected || (this.layoutCorrected = $t()), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: y } = this.options;
      y && y.notify("LayoutMeasure", this.layout.layoutBox, h ? h.layoutBox : void 0);
    }
    updateScroll(h = "measure") {
      let y = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === h && (y = !1), y && this.instance) {
        const v = r(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: h,
          isRoot: v,
          offset: o(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : v
        };
      }
    }
    resetTransform() {
      if (!c)
        return;
      const h = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, y = this.projectionDelta && !a1(this.projectionDelta), v = this.getTransformTemplate(), S = v ? v(this.latestValues, "") : void 0, p = S !== this.prevTransformTemplateValue;
      h && this.instance && (y || Ji(this.latestValues) || p) && (c(this.instance, S), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(h = !0) {
      const y = this.measurePageBox();
      let v = this.removeElementScroll(y);
      return h && (v = this.removeTransform(v)), c3(v), {
        animationId: this.root.animationId,
        measuredBox: y,
        layoutBox: v,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement: h } = this.options;
      if (!h)
        return $t();
      const y = h.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(f3))) {
        const { scroll: S } = this.root;
        S && (An(y.x, S.offset.x), An(y.y, S.offset.y));
      }
      return y;
    }
    removeElementScroll(h) {
      const y = $t();
      if (sn(y, h), this.scroll?.wasRoot)
        return y;
      for (let v = 0; v < this.path.length; v++) {
        const S = this.path[v], { scroll: p, options: g } = S;
        S !== this.root && p && g.layoutScroll && (p.wasRoot && sn(y, h), An(y.x, p.offset.x), An(y.y, p.offset.y));
      }
      return y;
    }
    applyTransform(h, y = !1, v) {
      const S = v || $t();
      sn(S, h);
      for (let p = 0; p < this.path.length; p++) {
        const g = this.path[p];
        !y && g.options.layoutScroll && g.scroll && g !== g.root && (An(S.x, -g.scroll.offset.x), An(S.y, -g.scroll.offset.y)), Ji(g.latestValues) && $s(S, g.latestValues, g.layout?.layoutBox);
      }
      return Ji(this.latestValues) && $s(S, this.latestValues, this.layout?.layoutBox), S;
    }
    removeTransform(h) {
      const y = $t();
      sn(y, h);
      for (let v = 0; v < this.path.length; v++) {
        const S = this.path[v];
        if (!Ji(S.latestValues))
          continue;
        let p;
        S.instance && (Xf(S.latestValues) && S.updateSnapshot(), p = $t(), sn(p, S.measurePageBox())), Fg(y, S.latestValues, S.snapshot?.layoutBox, p);
      }
      return Ji(this.latestValues) && Fg(y, this.latestValues), y;
    }
    setTargetDelta(h) {
      this.targetDelta = h, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(h) {
      this.options = {
        ...this.options,
        ...h,
        crossfade: h.crossfade !== void 0 ? h.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== me.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(h = !1) {
      const y = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = y.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = y.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = y.isSharedProjectionDirty);
      const v = !!this.resumingFrom || this !== y;
      if (!(h || v && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: p, layoutId: g } = this.options;
      if (!this.layout || !(p || g))
        return;
      this.resolvedRelativeTargetAt = me.timestamp;
      const b = this.getClosestProjectingParent();
      b && this.linkedParentVersion !== b.layoutVersion && !b.options.layoutRoot && this.removeRelativeTarget(), !this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && b && b.layout ? this.createRelativeTarget(b, this.layout.layoutBox, b.layout.layoutBox) : this.removeRelativeTarget()), !(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = $t(), this.targetWithTransforms = $t()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), _2(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target) : sn(this.target, this.layout.layoutBox), Qv(this.target, this.targetDelta)) : sn(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && b && !!b.resumingFrom == !!this.resumingFrom && !b.options.layoutScroll && b.target && this.animationProgress !== 1 ? this.createRelativeTarget(b, this.target, b.target) : this.relativeParent = this.relativeTarget = void 0));
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Xf(this.parent.latestValues) || Xv(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(h, y, v) {
      this.relativeParent = h, this.linkedParentVersion = h.layoutVersion, this.forceRelativeParentToResolveTarget(), this.relativeTarget = $t(), this.relativeTargetOrigin = $t(), fo(this.relativeTargetOrigin, y, v, this.options.layoutAnchor || void 0), sn(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      const h = this.getLead(), y = !!this.resumingFrom || this !== h;
      let v = !0;
      if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (v = !1), y && (this.isSharedProjectionDirty || this.isTransformDirty) && (v = !1), this.resolvedRelativeTargetAt === me.timestamp && (v = !1), v)
        return;
      const { layout: S, layoutId: p } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(S || p))
        return;
      sn(this.layoutCorrected, this.layout.layoutBox);
      const g = this.treeScale.x, b = this.treeScale.y;
      o2(this.layoutCorrected, this.treeScale, this.path, y), h.layout && !h.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (h.target = h.layout.layoutBox, h.targetWithTransforms = $t());
      const { target: N } = h;
      if (!N) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (qg(this.prevProjectionDelta.x, this.projectionDelta.x), qg(this.prevProjectionDelta.y, this.projectionDelta.y)), eu(this.projectionDelta, this.layoutCorrected, N, this.latestValues), (this.treeScale.x !== g || this.treeScale.y !== b || !Ig(this.projectionDelta.x, this.prevProjectionDelta.x) || !Ig(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", N));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(h = !0) {
      if (this.options.visualElement?.scheduleRender(), h) {
        const y = this.getStack();
        y && y.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Ka(), this.projectionDelta = Ka(), this.projectionDeltaWithTransform = Ka();
    }
    setAnimationOrigin(h, y = !1, v) {
      const S = this.snapshot, p = S ? S.latestValues : {}, g = { ...this.latestValues }, b = Ka();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !y;
      const N = $t(), R = S ? S.source : void 0, B = this.layout ? this.layout.source : void 0, U = R !== B, w = this.getStack(), L = !w || w.members.length <= 1, Y = !!(U && !L && this.options.crossfade === !0 && !this.path.some(o3));
      this.animationProgress = 0;
      let q;
      const et = v?.interpolateProjection(h);
      this.mixTargetDelta = (st) => {
        const G = st / 1e3, X = et?.(G);
        X ? (b.x.translate = X.x, b.x.scale = _t(h.x.scale, 1, G), b.x.origin = h.x.origin, b.x.originPoint = h.x.originPoint, b.y.translate = X.y, b.y.scale = _t(h.y.scale, 1, G), b.y.origin = h.y.origin, b.y.originPoint = h.y.originPoint) : (up(b.x, h.x, G), up(b.y, h.y, G)), this.setTargetDelta(b), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (fo(N, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), s3(this.relativeTarget, this.relativeTargetOrigin, N, G), q && H2(this.relativeTarget, q) && (this.isProjectionDirty = !1), q || (q = $t()), sn(q, this.relativeTarget)), U && (this.animationValues = g, Y2(g, p, this.latestValues, G, Y, L)), X && X.rotate !== void 0 && (this.animationValues || (this.animationValues = g), this.animationValues.pathRotation = X.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = G;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(h) {
      this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation && (qn(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Ut.update(() => {
        to.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = bi(0)), this.motionValue.jump(0, !1), this.currentAnimation = s1(this.motionValue, [0, 1e3], {
          ...h,
          velocity: 0,
          isSync: !0,
          onUpdate: (y) => {
            this.mixTargetDelta(y), h.onUpdate && h.onUpdate(y);
          },
          onComplete: () => {
            h.onComplete && h.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const h = this.getStack();
      h && h.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(J2), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const h = this.getLead();
      let { targetWithTransforms: y, target: v, layout: S, latestValues: p } = h;
      if (!(!y || !v || !S)) {
        if (this !== h && this.layout && S && c1(this.options.animationType, this.layout.layoutBox, S.layoutBox)) {
          v = this.target || $t();
          const g = be(this.layout.layoutBox.x);
          v.x.min = h.target.x.min, v.x.max = v.x.min + g;
          const b = be(this.layout.layoutBox.y);
          v.y.min = h.target.y.min, v.y.max = v.y.min + b;
        }
        sn(y, v), $s(y, p), eu(this.projectionDeltaWithTransform, this.layoutCorrected, y, p);
      }
    }
    registerSharedNode(h, y) {
      this.sharedNodes.has(h) || this.sharedNodes.set(h, new K2()), this.sharedNodes.get(h).add(y);
      const S = y.options.initialPromotionConfig;
      y.promote({
        transition: S ? S.transition : void 0,
        preserveFollowOpacity: S && S.shouldPreserveFollowOpacity ? S.shouldPreserveFollowOpacity(y) : void 0
      });
    }
    isLead() {
      const h = this.getStack();
      return h ? h.lead === this : !0;
    }
    getLead() {
      const { layoutId: h } = this.options;
      return h ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId: h } = this.options;
      return h ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId: h } = this.options;
      if (h)
        return this.root.sharedNodes.get(h);
    }
    promote({ needsReset: h, transition: y, preserveFollowOpacity: v } = {}) {
      const S = this.getStack();
      S && S.promote(this, v), h && (this.projectionDelta = void 0, this.needsReset = !0), y && this.setOptions({ transition: y });
    }
    relegate() {
      const h = this.getStack();
      return h ? h.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: h } = this.options;
      if (!h)
        return;
      let y = !1;
      const { latestValues: v } = h;
      if ((v.z || v.rotate || v.rotateX || v.rotateY || v.rotateZ || v.skewX || v.skewY) && (y = !0), !y)
        return;
      const S = {};
      v.z && gf("z", h, S, this.animationValues);
      for (let p = 0; p < yf.length; p++)
        gf(`rotate${yf[p]}`, h, S, this.animationValues), gf(`skew${yf[p]}`, h, S, this.animationValues);
      h.render();
      for (const p in S)
        h.setStaticValue(p, S[p]), this.animationValues && (this.animationValues[p] = S[p]);
      h.scheduleRender();
    }
    applyProjectionStyles(h, y) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        h.visibility = "hidden";
        return;
      }
      const v = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, h.visibility = "", h.opacity = "", h.pointerEvents = Is(y?.pointerEvents) || "", h.transform = v ? v(this.latestValues, "") : "none";
        return;
      }
      const S = this.getLead();
      if (!this.projectionDelta || !this.layout || !S.target) {
        this.options.layoutId && (h.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, h.pointerEvents = Is(y?.pointerEvents) || ""), this.hasProjected && !Ji(this.latestValues) && (h.transform = v ? v({}, "") : "none", this.hasProjected = !1);
        return;
      }
      h.visibility = "";
      const p = S.animationValues || S.latestValues;
      this.applyTransformsToTarget();
      let g = L2(this.projectionDeltaWithTransform, this.treeScale, p);
      v && (g = v(p, g)), h.transform = g;
      const { x: b, y: N } = this.projectionDelta;
      h.transformOrigin = `${b.origin * 100}% ${N.origin * 100}% 0`, S.animationValues ? h.opacity = S === this ? p.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : p.opacityExit : h.opacity = S === this ? p.opacity !== void 0 ? p.opacity : "" : p.opacityExit !== void 0 ? p.opacityExit : 0;
      for (const R in Zf) {
        if (p[R] === void 0)
          continue;
        const { correct: B, applyTo: U, isCSSVariable: w } = Zf[R], L = g === "none" ? p[R] : B(p[R], S);
        if (U) {
          const Y = U.length;
          for (let q = 0; q < Y; q++)
            h[U[q]] = L;
        } else
          w ? this.options.visualElement.renderState.vars[R] = L : h[R] = L;
      }
      this.options.layoutId && (h.pointerEvents = S === this ? Is(y?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((h) => h.currentAnimation?.stop()), this.root.nodes.forEach(ip), this.root.sharedNodes.clear();
    }
  };
}
function P2(a) {
  a.updateLayout();
}
function k2(a) {
  const l = a.resumeFrom?.snapshot || a.snapshot;
  if (a.isLead() && a.layout && l && a.hasListeners("didUpdate")) {
    const { layoutBox: o, measuredBox: r } = a.layout, { animationType: c } = a.options, d = l.source !== a.layout.source;
    if (c === "size")
      En((p) => {
        const g = d ? l.measuredBox[p] : l.layoutBox[p], b = be(g);
        g.min = o[p].min, g.max = g.min + b;
      });
    else if (c === "x" || c === "y") {
      const p = c === "x" ? "y" : "x";
      Kf(d ? l.measuredBox[p] : l.layoutBox[p], o[p]);
    } else c1(c, l.layoutBox, o) && En((p) => {
      const g = d ? l.measuredBox[p] : l.layoutBox[p], b = be(o[p]);
      g.max = g.min + b, a.relativeTarget && !a.currentAnimation && (a.isProjectionDirty = !0, a.relativeTarget[p].max = a.relativeTarget[p].min + b);
    });
    const h = Ka();
    eu(h, o, l.layoutBox);
    const y = Ka();
    d ? eu(y, a.applyTransform(r, !0), l.measuredBox) : eu(y, o, l.layoutBox);
    const v = !a1(h);
    let S = !1;
    if (!a.resumeFrom) {
      const p = a.getClosestProjectingParent();
      if (p && !p.resumeFrom) {
        const { snapshot: g, layout: b } = p;
        if (g && b) {
          const N = a.options.layoutAnchor || void 0, R = $t();
          fo(R, l.layoutBox, g.layoutBox, N);
          const B = $t();
          fo(B, o, b.layoutBox, N), l1(R, B) || (S = !0), p.options.layoutRoot && (a.relativeTarget = B, a.relativeTargetOrigin = R, a.relativeParent = p);
        }
      }
    }
    a.notifyListeners("didUpdate", {
      layout: o,
      snapshot: l,
      delta: y,
      layoutDelta: h,
      hasLayoutChanged: v,
      hasRelativeLayoutChanged: S
    });
  } else if (a.isLead()) {
    const { onExitComplete: o } = a.options;
    o && o();
  }
  a.options.transition = void 0;
}
function W2(a) {
  a.parent && (a.isProjecting() || (a.isProjectionDirty = a.parent.isProjectionDirty), a.isSharedProjectionDirty || (a.isSharedProjectionDirty = !!(a.isProjectionDirty || a.parent.isProjectionDirty || a.parent.isSharedProjectionDirty)), a.isTransformDirty || (a.isTransformDirty = a.parent.isTransformDirty));
}
function $2(a) {
  a.isProjectionDirty = a.isSharedProjectionDirty = a.isTransformDirty = !1;
}
function I2(a) {
  a.clearSnapshot();
}
function ip(a) {
  a.clearMeasurements();
}
function t3(a) {
  a.isLayoutDirty = !0, a.updateLayout();
}
function ap(a) {
  a.isLayoutDirty = !1;
}
function e3(a) {
  a.isAnimationBlocked && a.layout && !a.isLayoutDirty && (a.snapshot = a.layout, a.isLayoutDirty = !0);
}
function n3(a) {
  const { visualElement: l } = a.options;
  l && l.getProps().onBeforeLayoutMeasure && l.notify("BeforeLayoutMeasure"), a.resetTransform();
}
function lp(a) {
  a.finishAnimation(), a.targetDelta = a.relativeTarget = a.target = void 0, a.isProjectionDirty = !0;
}
function i3(a) {
  a.resolveTargetDelta();
}
function a3(a) {
  a.calcProjection();
}
function l3(a) {
  a.resetSkewAndRotation();
}
function u3(a) {
  a.removeLeadSnapshot();
}
function up(a, l, o) {
  a.translate = _t(l.translate, 0, o), a.scale = _t(l.scale, 1, o), a.origin = l.origin, a.originPoint = l.originPoint;
}
function sp(a, l, o, r) {
  a.min = _t(l.min, o.min, r), a.max = _t(l.max, o.max, r);
}
function s3(a, l, o, r) {
  sp(a.x, l.x, o.x, r), sp(a.y, l.y, o.y, r);
}
function o3(a) {
  return a.animationValues && a.animationValues.opacityExit !== void 0;
}
const r3 = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, op = (a) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(a), rp = op("applewebkit/") && !op("chrome/") ? Math.round : Ie;
function cp(a) {
  a.min = rp(a.min), a.max = rp(a.max);
}
function c3(a) {
  cp(a.x), cp(a.y);
}
function c1(a, l, o) {
  return a === "position" || a === "preserve-aspect" && !V2($g(l), $g(o), 0.2);
}
function f3(a) {
  return a !== a.root && a.scroll?.wasRoot;
}
const h3 = r1({
  attachResizeListener: (a, l) => su(a, "resize", l),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
    y: document.documentElement.scrollTop || document.body?.scrollTop || 0
  }),
  checkIsScrollRoot: () => !0
}), pf = {
  current: void 0
}, f1 = r1({
  measureScroll: (a) => ({
    x: a.scrollLeft,
    y: a.scrollTop
  }),
  defaultParent: () => {
    if (!pf.current) {
      const a = new h3({});
      a.mount(window), a.setOptions({ layoutScroll: !0 }), pf.current = a;
    }
    return pf.current;
  },
  resetTransform: (a, l) => {
    a.style.transform = l !== void 0 ? l : "none";
  },
  checkIsScrollRoot: (a) => window.getComputedStyle(a).position === "fixed"
}), Dh = tt.createContext({
  transformPagePoint: (a) => a,
  isStatic: !1,
  reducedMotion: "never"
});
function d3(a = !0) {
  const l = tt.useContext(Wf);
  if (l === null)
    return [!0, null];
  const { isPresent: o, onExitComplete: r, register: c } = l, d = tt.useId();
  tt.useEffect(() => {
    if (a)
      return c(d);
  }, [a]);
  const h = tt.useCallback(() => a && r && r(d), [d, r, a]);
  return !o && r ? [!1, h] : [!0];
}
const h1 = tt.createContext({ strict: !1 }), fp = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
let hp = !1;
function m3() {
  if (hp)
    return;
  const a = {};
  for (const l in fp)
    a[l] = {
      isEnabled: (o) => fp[l].some((r) => !!o[r])
    };
  jv(a), hp = !0;
}
function d1() {
  return m3(), l2();
}
function y3(a) {
  const l = d1();
  for (const o in a)
    l[o] = {
      ...l[o],
      ...a[o]
    };
  jv(l);
}
const g3 = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "propagate",
  "ignoreStrict",
  "viewport"
]);
function ho(a) {
  return a.startsWith("while") || a.startsWith("drag") && a !== "draggable" || a.startsWith("layout") || a.startsWith("onTap") || a.startsWith("onPan") || a.startsWith("onLayout") || g3.has(a);
}
let m1 = (a) => !ho(a);
function p3(a) {
  typeof a == "function" && (m1 = (l) => l.startsWith("on") ? !ho(l) : a(l));
}
try {
  p3(require("@emotion/is-prop-valid").default);
} catch {
}
function v3(a, l, o) {
  const r = {};
  for (const c in a)
    c === "values" && typeof a.values == "object" || ee(a[c]) || (m1(c) || o === !0 && ho(c) || !l && !ho(c) || // If trying to use native HTML drag events, forward drag listeners
    a.draggable && c.startsWith("onDrag")) && (r[c] = a[c]);
  return r;
}
const So = /* @__PURE__ */ tt.createContext({});
function S3(a, l) {
  if (vo(a)) {
    const { initial: o, animate: r } = a;
    return {
      initial: o === !1 || uu(o) ? o : void 0,
      animate: uu(r) ? r : void 0
    };
  }
  return a.inherit !== !1 ? l : {};
}
function T3(a) {
  const { initial: l, animate: o } = S3(a, tt.useContext(So));
  return tt.useMemo(() => ({ initial: l, animate: o }), [dp(l), dp(o)]);
}
function dp(a) {
  return Array.isArray(a) ? a.join(" ") : a;
}
const xh = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function y1(a, l, o) {
  for (const r in l)
    !ee(l[r]) && !Jv(r, o) && (a[r] = l[r]);
}
function b3({ transformTemplate: a }, l) {
  return tt.useMemo(() => {
    const o = xh();
    return Ah(o, l, a), Object.assign({}, o.vars, o.style);
  }, [l]);
}
function E3(a, l) {
  const o = a.style || {}, r = {};
  return y1(r, o, a), Object.assign(r, b3(a, l)), r;
}
function A3(a, l) {
  const o = {}, r = E3(a, l);
  return a.drag && a.dragListener !== !1 && (o.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = a.drag === !0 ? "none" : `pan-${a.drag === "x" ? "y" : "x"}`), a.tabIndex === void 0 && (a.onTap || a.onTapStart || a.whileTap) && (o.tabIndex = 0), o.style = r, o;
}
const g1 = () => ({
  ...xh(),
  attrs: {}
});
function M3(a, l, o, r) {
  const c = tt.useMemo(() => {
    const d = g1();
    return Pv(d, l, Wv(r), a.transformTemplate, a.style), {
      ...d.attrs,
      style: { ...d.style }
    };
  }, [l]);
  if (a.style) {
    const d = {};
    y1(d, a.style, a), c.style = { ...d, ...c.style };
  }
  return c;
}
const D3 = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function Ch(a) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof a != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    a.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(D3.indexOf(a) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(a))
    )
  );
}
function x3(a, l, o, { latestValues: r }, c, d = !1, h) {
  const v = (h ?? Ch(a) ? M3 : A3)(l, r, c, a), S = v3(l, typeof a == "string", d), p = a !== tt.Fragment ? { ...S, ...v, ref: o } : {}, { children: g } = l, b = tt.useMemo(() => ee(g) ? g.get() : g, [g]);
  return tt.createElement(a, {
    ...p,
    children: b
  });
}
function C3({ scrapeMotionValuesFromProps: a, createRenderState: l }, o, r, c) {
  return {
    latestValues: O3(o, r, c, a),
    renderState: l()
  };
}
function O3(a, l, o, r) {
  const c = {}, d = r(a, {});
  for (const b in d)
    c[b] = Is(d[b]);
  let { initial: h, animate: y } = a;
  const v = vo(a), S = Hv(a);
  l && S && !v && a.inherit !== !1 && (h === void 0 && (h = l.initial), y === void 0 && (y = l.animate));
  let p = o ? o.initial === !1 : !1;
  p = p || h === !1;
  const g = p ? y : h;
  if (g && typeof g != "boolean" && !po(g)) {
    const b = Array.isArray(g) ? g : [g];
    for (let N = 0; N < b.length; N++) {
      const R = dh(a, b[N]);
      if (R) {
        const { transitionEnd: B, transition: U, ...w } = R;
        for (const L in w) {
          let Y = w[L];
          if (Array.isArray(Y)) {
            const q = p ? Y.length - 1 : 0;
            Y = Y[q];
          }
          Y !== null && (c[L] = Y);
        }
        for (const L in B)
          c[L] = B[L];
      }
    }
  }
  return c;
}
const p1 = (a) => (l, o) => {
  const r = tt.useContext(So), c = tt.useContext(Wf), d = () => C3(a, l, r, c);
  return o ? d() : kf(d);
}, z3 = /* @__PURE__ */ p1({
  scrapeMotionValuesFromProps: Mh,
  createRenderState: xh
}), R3 = /* @__PURE__ */ p1({
  scrapeMotionValuesFromProps: $v,
  createRenderState: g1
}), N3 = /* @__PURE__ */ Symbol.for("motionComponentSymbol");
function V3(a, l, o) {
  const r = tt.useRef(o);
  tt.useInsertionEffect(() => {
    r.current = o;
  });
  const c = tt.useRef(null);
  return tt.useCallback((d) => {
    d && a.onMount?.(d), l && (d ? l.mount(d) : l.unmount());
    const h = r.current;
    if (typeof h == "function")
      if (d) {
        const y = h(d);
        typeof y == "function" && (c.current = y);
      } else c.current ? (c.current(), c.current = null) : h(d);
    else h && (h.current = d);
  }, [l]);
}
const v1 = tt.createContext({});
function Xa(a) {
  return a && typeof a == "object" && Object.prototype.hasOwnProperty.call(a, "current");
}
function _3(a, l, o, r, c, d) {
  const { visualElement: h } = tt.useContext(So), y = tt.useContext(h1), v = tt.useContext(Wf), S = tt.useContext(Dh), p = S.reducedMotion, g = S.skipAnimations, b = tt.useRef(null), N = tt.useRef(!1);
  r = r || y.renderer, !b.current && r && (b.current = r(a, {
    visualState: l,
    parent: h,
    props: o,
    presenceContext: v,
    blockInitialAnimation: v ? v.initial === !1 : !1,
    reducedMotionConfig: p,
    skipAnimations: g,
    isSVG: d
  }), N.current && b.current && (b.current.manuallyAnimateOnMount = !0));
  const R = b.current, B = tt.useContext(v1);
  R && !R.projection && c && (R.type === "html" || R.type === "svg") && U3(b.current, o, c, B);
  const U = tt.useRef(!1);
  tt.useInsertionEffect(() => {
    R && U.current && R.update(o, v);
  });
  const w = o[xv], L = tt.useRef(!!w && typeof window < "u" && !window.MotionHandoffIsComplete?.(w) && window.MotionHasOptimisedAnimation?.(w));
  return Up(() => {
    N.current = !0, R && (U.current = !0, window.MotionIsMounted = !0, R.updateFeatures(), R.scheduleRenderMicrotask(), L.current && R.animationState && R.animationState.animateChanges());
  }), tt.useEffect(() => {
    R && (!L.current && R.animationState && R.animationState.animateChanges(), L.current && (queueMicrotask(() => {
      window.MotionHandoffMarkAsComplete?.(w);
    }), L.current = !1), R.enteringChildren = void 0);
  }), R;
}
function U3(a, l, o, r) {
  const { layoutId: c, layout: d, drag: h, dragConstraints: y, layoutScroll: v, layoutRoot: S, layoutAnchor: p, layoutCrossfade: g } = l;
  a.projection = new o(a.latestValues, l["data-framer-portal-id"] ? void 0 : S1(a.parent)), a.projection.setOptions({
    layoutId: c,
    layout: d,
    alwaysMeasureLayout: !!h || y && Xa(y),
    visualElement: a,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof d == "string" ? d : "both",
    initialPromotionConfig: r,
    crossfade: g,
    layoutScroll: v,
    layoutRoot: S,
    layoutAnchor: p
  });
}
function S1(a) {
  if (a)
    return a.options.allowProjection !== !1 ? a.projection : S1(a.parent);
}
function vf(a, { forwardMotionProps: l = !1, type: o } = {}, r, c) {
  r && y3(r);
  const d = o ? o === "svg" : Ch(a), h = d ? R3 : z3;
  function y(S, p) {
    let g;
    const b = {
      ...tt.useContext(Dh),
      ...S,
      layoutId: B3(S)
    }, { isStatic: N } = b, R = T3(S), B = h(S, N);
    if (!N && typeof window < "u") {
      w3();
      const U = H3(b);
      g = U.MeasureLayout, R.visualElement = _3(a, B, b, c, U.ProjectionNode, d);
    }
    return Jt.jsxs(So.Provider, { value: R, children: [g && R.visualElement ? Jt.jsx(g, { visualElement: R.visualElement, ...b }) : null, x3(a, S, V3(B, R.visualElement, p), B, N, l, d)] });
  }
  y.displayName = `motion.${typeof a == "string" ? a : `create(${a.displayName ?? a.name ?? ""})`}`;
  const v = tt.forwardRef(y);
  return v[N3] = a, v;
}
function B3({ layoutId: a }) {
  const l = tt.useContext(_p).id;
  return l && a !== void 0 ? l + "-" + a : a;
}
function w3(a, l) {
  tt.useContext(h1).strict;
}
function H3(a) {
  const l = d1(), { drag: o, layout: r } = l;
  if (!o && !r)
    return {};
  const c = { ...o, ...r };
  return {
    MeasureLayout: o?.isEnabled(a) || r?.isEnabled(a) ? c.MeasureLayout : void 0,
    ProjectionNode: c.ProjectionNode
  };
}
function L3(a, l) {
  if (typeof Proxy > "u")
    return vf;
  const o = /* @__PURE__ */ new Map(), r = (d, h) => vf(d, h, a, l), c = (d, h) => r(d, h);
  return new Proxy(c, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (d, h) => h === "create" ? r : (o.has(h) || o.set(h, vf(h, void 0, a, l)), o.get(h))
  });
}
const j3 = (a, l) => l.isSVG ?? Ch(a) ? new Iv(l) : new Fv(l, {
  allowProjection: a !== tt.Fragment
});
class Y3 extends Ei {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(l) {
    super(l), l.animationState || (l.animationState = x2(l));
  }
  updateAnimationControlsSubscription() {
    const { animate: l } = this.node.getProps();
    po(l) && (this.unmountControls = l.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: l } = this.node.getProps(), { animate: o } = this.node.prevProps || {};
    l !== o && this.updateAnimationControlsSubscription();
  }
  unmount() {
    this.node.animationState.reset(), this.unmountControls?.();
  }
}
let G3 = 0;
class q3 extends Ei {
  constructor() {
    super(...arguments), this.id = G3++, this.isExitComplete = !1;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: l, onExitComplete: o } = this.node.presenceContext, { isPresent: r } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || l === r)
      return;
    if (l && r === !1) {
      if (this.isExitComplete) {
        const { initial: d, custom: h } = this.node.getProps();
        if (typeof d == "string" || typeof d == "object" && d !== null && !Array.isArray(d)) {
          const y = Wi(this.node, d, h);
          if (y) {
            const { transition: v, transitionEnd: S, ...p } = y;
            for (const g in p)
              this.node.getValue(g)?.jump(p[g]);
          }
        }
        this.node.animationState.reset(), this.node.animationState.animateChanges();
      } else
        this.node.animationState.setActive("exit", !1);
      this.isExitComplete = !1;
      return;
    }
    const c = this.node.animationState.setActive("exit", !l);
    o && !l && c.then(() => {
      this.isExitComplete = !0, o(this.id);
    });
  }
  mount() {
    const { register: l, onExitComplete: o } = this.node.presenceContext || {};
    o && o(this.id), l && (this.unmount = l(this.id));
  }
  unmount() {
  }
}
const X3 = {
  animation: {
    Feature: Y3
  },
  exit: {
    Feature: q3
  }
};
function fu(a) {
  return {
    point: {
      x: a.pageX,
      y: a.pageY
    }
  };
}
const Q3 = (a) => (l) => Sh(l) && a(l, fu(l));
function nu(a, l, o, r) {
  return su(a, l, Q3(o), r);
}
const T1 = ({ current: a }) => a ? a.ownerDocument.defaultView : null, mp = (a, l) => Math.abs(a - l);
function Z3(a, l) {
  const o = mp(a.x, l.x), r = mp(a.y, l.y);
  return Math.sqrt(o ** 2 + r ** 2);
}
const yp = /* @__PURE__ */ new Set(["auto", "scroll"]);
class b1 {
  constructor(l, o, { transformPagePoint: r, contextWindow: c = window, dragSnapToOrigin: d = !1, distanceThreshold: h = 3, element: y } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (R) => {
      this.handleScroll(R.target);
    }, this.onWindowScroll = () => {
      this.handleScroll(window);
    }, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      this.lastRawMoveEventInfo && (this.lastMoveEventInfo = Qs(this.lastRawMoveEventInfo, this.transformPagePoint));
      const R = Sf(this.lastMoveEventInfo, this.history), B = this.startEvent !== null, U = Z3(R.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!B && !U)
        return;
      const { point: w } = R, { timestamp: L } = me;
      this.history.push({ ...w, timestamp: L });
      const { onStart: Y, onMove: q } = this.handlers;
      B || (Y && Y(this.lastMoveEvent, R), this.startEvent = this.lastMoveEvent), q && q(this.lastMoveEvent, R);
    }, this.handlePointerMove = (R, B) => {
      this.lastMoveEvent = R, this.lastRawMoveEventInfo = B, this.lastMoveEventInfo = Qs(B, this.transformPagePoint), Ut.update(this.updatePoint, !0);
    }, this.handlePointerUp = (R, B) => {
      this.end();
      const { onEnd: U, onSessionEnd: w, resumeAnimation: L } = this.handlers;
      if ((this.dragSnapToOrigin || !this.startEvent) && L && L(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const Y = Sf(R.type === "pointercancel" ? this.lastMoveEventInfo : Qs(B, this.transformPagePoint), this.history);
      this.startEvent && U && U(R, Y), w && w(R, Y);
    }, !Sh(l))
      return;
    this.dragSnapToOrigin = d, this.handlers = o, this.transformPagePoint = r, this.distanceThreshold = h, this.contextWindow = c || window;
    const v = fu(l), S = Qs(v, this.transformPagePoint), { point: p } = S, { timestamp: g } = me;
    this.history = [{ ...p, timestamp: g }];
    const { onSessionStart: b } = o;
    b && b(l, Sf(S, this.history));
    const N = { passive: !0, capture: !0 };
    this.removeListeners = ou(nu(this.contextWindow, "pointermove", this.handlePointerMove, N), nu(this.contextWindow, "pointerup", this.handlePointerUp, N), nu(this.contextWindow, "pointercancel", this.handlePointerUp, N)), y && this.startScrollTracking(y);
  }
  /**
   * Start tracking scroll on ancestors and window.
   */
  startScrollTracking(l) {
    let o = l.parentElement;
    for (; o; ) {
      const r = getComputedStyle(o);
      (yp.has(r.overflowX) || yp.has(r.overflowY)) && this.scrollPositions.set(o, {
        x: o.scrollLeft,
        y: o.scrollTop
      }), o = o.parentElement;
    }
    this.scrollPositions.set(window, {
      x: window.scrollX,
      y: window.scrollY
    }), window.addEventListener("scroll", this.onElementScroll, {
      capture: !0
    }), window.addEventListener("scroll", this.onWindowScroll), this.removeScrollListeners = () => {
      window.removeEventListener("scroll", this.onElementScroll, {
        capture: !0
      }), window.removeEventListener("scroll", this.onWindowScroll);
    };
  }
  /**
   * Handle scroll compensation during drag.
   *
   * For element scroll: adjusts history origin since pageX/pageY doesn't change.
   * For window scroll: adjusts lastMoveEventInfo since pageX/pageY would change.
   */
  handleScroll(l) {
    const o = this.scrollPositions.get(l);
    if (!o)
      return;
    const r = l === window, c = r ? { x: window.scrollX, y: window.scrollY } : {
      x: l.scrollLeft,
      y: l.scrollTop
    }, d = { x: c.x - o.x, y: c.y - o.y };
    d.x === 0 && d.y === 0 || (r ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += d.x, this.lastMoveEventInfo.point.y += d.y) : this.history.length > 0 && (this.history[0].x -= d.x, this.history[0].y -= d.y), this.scrollPositions.set(l, c), Ut.update(this.updatePoint, !0));
  }
  updateHandlers(l) {
    this.handlers = l;
  }
  end() {
    this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), qn(this.updatePoint);
  }
}
function Qs(a, l) {
  return l ? { point: l(a.point) } : a;
}
function gp(a, l) {
  return { x: a.x - l.x, y: a.y - l.y };
}
function Sf({ point: a }, l) {
  return {
    point: a,
    delta: gp(a, E1(l)),
    offset: gp(a, K3(l)),
    velocity: J3(l, 0.1)
  };
}
function K3(a) {
  return a[0];
}
function E1(a) {
  return a[a.length - 1];
}
function J3(a, l) {
  if (a.length < 2)
    return { x: 0, y: 0 };
  let o = a.length - 1, r = null;
  const c = E1(a);
  for (; o >= 0 && (r = a[o], !(c.timestamp - r.timestamp > /* @__PURE__ */ Oe(l))); )
    o--;
  if (!r)
    return { x: 0, y: 0 };
  r === a[0] && a.length > 2 && c.timestamp - r.timestamp > /* @__PURE__ */ Oe(l) * 2 && (r = a[1]);
  const d = /* @__PURE__ */ $e(c.timestamp - r.timestamp);
  if (d === 0)
    return { x: 0, y: 0 };
  const h = {
    x: (c.x - r.x) / d,
    y: (c.y - r.y) / d
  };
  return h.x === 1 / 0 && (h.x = 0), h.y === 1 / 0 && (h.y = 0), h;
}
function F3(a, { min: l, max: o }, r) {
  return l !== void 0 && a < l ? a = r ? _t(l, a, r.min) : Math.max(a, l) : o !== void 0 && a > o && (a = r ? _t(o, a, r.max) : Math.min(a, o)), a;
}
function pp(a, l, o) {
  return {
    min: l !== void 0 ? a.min + l : void 0,
    max: o !== void 0 ? a.max + o - (a.max - a.min) : void 0
  };
}
function P3(a, { top: l, left: o, bottom: r, right: c }) {
  return {
    x: pp(a.x, o, c),
    y: pp(a.y, l, r)
  };
}
function vp(a, l) {
  let o = l.min - a.min, r = l.max - a.max;
  return l.max - l.min < a.max - a.min && ([o, r] = [r, o]), { min: o, max: r };
}
function k3(a, l) {
  return {
    x: vp(a.x, l.x),
    y: vp(a.y, l.y)
  };
}
function W3(a, l) {
  let o = 0.5;
  const r = be(a), c = be(l);
  return c > r ? o = /* @__PURE__ */ Fa(l.min, l.max - r, a.min) : r > c && (o = /* @__PURE__ */ Fa(a.min, a.max - c, l.min)), Dn(0, 1, o);
}
function $3(a, l) {
  const o = {};
  return l.min !== void 0 && (o.min = l.min - a.min), l.max !== void 0 && (o.max = l.max - a.min), o;
}
const Jf = 0.35;
function I3(a = Jf) {
  return a === !1 ? a = 0 : a === !0 && (a = Jf), {
    x: Sp(a, "left", "right"),
    y: Sp(a, "top", "bottom")
  };
}
function Sp(a, l, o) {
  return {
    min: Tp(a, l),
    max: Tp(a, o)
  };
}
function Tp(a, l) {
  return typeof a == "number" ? a : a[l] || 0;
}
const tM = /* @__PURE__ */ new WeakMap();
class eM {
  constructor(l) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = $t(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = l;
  }
  start(l, { snapToCursor: o = !1, distanceThreshold: r } = {}) {
    const { presenceContext: c } = this.visualElement;
    if (c && c.isPresent === !1)
      return;
    const d = (g) => {
      o && this.snapToCursor(fu(g).point), this.stopAnimation();
    }, h = (g, b) => {
      const { drag: N, dragPropagation: R, onDragStart: B } = this.getProps();
      if (N && !R && (this.openDragLock && this.openDragLock(), this.openDragLock = HA(N), !this.openDragLock))
        return;
      this.latestPointerEvent = g, this.latestPanInfo = b, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), En((w) => {
        let L = this.getAxisMotionValue(w).get() || 0;
        if (Mn.test(L)) {
          const { projection: Y } = this.visualElement;
          if (Y && Y.layout) {
            const q = Y.layout.layoutBox[w];
            q && (L = be(q) * (parseFloat(L) / 100));
          }
        }
        this.originPoint[w] = L;
      }), B && Ut.update(() => B(g, b), !1, !0), Lf(this.visualElement, "transform");
      const { animationState: U } = this.visualElement;
      U && U.setActive("whileDrag", !0);
    }, y = (g, b) => {
      this.latestPointerEvent = g, this.latestPanInfo = b;
      const { dragPropagation: N, dragDirectionLock: R, onDirectionLock: B, onDrag: U } = this.getProps();
      if (!N && !this.openDragLock)
        return;
      const { offset: w } = b;
      if (R && this.currentDirection === null) {
        this.currentDirection = iM(w), this.currentDirection !== null && B && B(this.currentDirection);
        return;
      }
      this.updateAxis("x", b.point, w), this.updateAxis("y", b.point, w), this.visualElement.render(), U && Ut.update(() => U(g, b), !1, !0);
    }, v = (g, b) => {
      this.latestPointerEvent = g, this.latestPanInfo = b, this.stop(g, b), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, S = () => {
      const { dragSnapToOrigin: g } = this.getProps();
      (g || this.constraints) && this.startAnimation({ x: 0, y: 0 });
    }, { dragSnapToOrigin: p } = this.getProps();
    this.panSession = new b1(l, {
      onSessionStart: d,
      onStart: h,
      onMove: y,
      onSessionEnd: v,
      resumeAnimation: S
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: p,
      distanceThreshold: r,
      contextWindow: T1(this.visualElement),
      element: this.visualElement.current
    });
  }
  /**
   * @internal
   */
  stop(l, o) {
    const r = l || this.latestPointerEvent, c = o || this.latestPanInfo, d = this.isDragging;
    if (this.cancel(), !d || !c || !r)
      return;
    const { velocity: h } = c;
    this.startAnimation(h);
    const { onDragEnd: y } = this.getProps();
    y && Ut.postRender(() => y(r, c));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: l, animationState: o } = this.visualElement;
    l && (l.isAnimationBlocked = !1), this.endPanSession();
    const { dragPropagation: r } = this.getProps();
    !r && this.openDragLock && (this.openDragLock(), this.openDragLock = null), o && o.setActive("whileDrag", !1);
  }
  /**
   * Clean up the pan session without modifying other drag state.
   * This is used during unmount to ensure event listeners are removed
   * without affecting projection animations or drag locks.
   * @internal
   */
  endPanSession() {
    this.panSession && this.panSession.end(), this.panSession = void 0;
  }
  updateAxis(l, o, r) {
    const { drag: c } = this.getProps();
    if (!r || !Zs(l, c, this.currentDirection))
      return;
    const d = this.getAxisMotionValue(l);
    let h = this.originPoint[l] + r[l];
    this.constraints && this.constraints[l] && (h = F3(h, this.constraints[l], this.elastic[l])), d.set(h);
  }
  resolveConstraints() {
    const { dragConstraints: l, dragElastic: o } = this.getProps(), r = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout, c = this.constraints;
    l && Xa(l) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : l && r ? this.constraints = P3(r.layoutBox, l) : this.constraints = !1, this.elastic = I3(o), c !== this.constraints && !Xa(l) && r && this.constraints && !this.hasMutatedConstraints && En((d) => {
      this.constraints !== !1 && this.getAxisMotionValue(d) && (this.constraints[d] = $3(r.layoutBox[d], this.constraints[d]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: l, onMeasureDragConstraints: o } = this.getProps();
    if (!l || !Xa(l))
      return !1;
    const r = l.current, { projection: c } = this.visualElement;
    if (!c || !c.layout)
      return !1;
    c.root && (c.root.scroll = void 0, c.root.updateScroll());
    const d = r2(r, c.root, this.visualElement.getTransformPagePoint());
    let h = k3(c.layout.layoutBox, d);
    if (o) {
      const y = o(u2(h));
      this.hasMutatedConstraints = !!y, y && (h = qv(y));
    }
    return h;
  }
  startAnimation(l) {
    const { drag: o, dragMomentum: r, dragElastic: c, dragTransition: d, dragSnapToOrigin: h, onDragTransitionEnd: y } = this.getProps(), v = this.constraints || {}, S = En((p) => {
      if (!Zs(p, o, this.currentDirection))
        return;
      let g = v && v[p] || {};
      (h === !0 || h === p) && (g = { min: 0, max: 0 });
      const b = c ? 200 : 1e6, N = c ? 40 : 1e7, R = {
        type: "inertia",
        velocity: r ? l[p] : 0,
        bounceStiffness: b,
        bounceDamping: N,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...d,
        ...g
      };
      return this.startAxisValueAnimation(p, R);
    });
    return Promise.all(S).then(y);
  }
  startAxisValueAnimation(l, o) {
    const r = this.getAxisMotionValue(l);
    return Lf(this.visualElement, l), r.start(hh(l, r, 0, o, this.visualElement, !1));
  }
  stopAnimation() {
    En((l) => this.getAxisMotionValue(l).stop());
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(l) {
    const o = `_drag${l.toUpperCase()}`, c = this.visualElement.getProps()[o];
    return c || this.visualElement.getValue(l, this.visualElement.latestValues[l] ?? 0);
  }
  snapToCursor(l) {
    En((o) => {
      const { drag: r } = this.getProps();
      if (!Zs(o, r, this.currentDirection))
        return;
      const { projection: c } = this.visualElement, d = this.getAxisMotionValue(o);
      if (c && c.layout) {
        const { min: h, max: y } = c.layout.layoutBox[o], v = d.get() || 0;
        d.set(l[o] - _t(h, y, 0.5) + v);
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: l, dragConstraints: o } = this.getProps(), { projection: r } = this.visualElement;
    if (!Xa(o) || !r || !this.constraints)
      return;
    this.stopAnimation();
    const c = { x: 0, y: 0 };
    En((h) => {
      const y = this.getAxisMotionValue(h);
      if (y && this.constraints !== !1) {
        const v = y.get();
        c[h] = W3({ min: v, max: v }, this.constraints[h]);
      }
    });
    const { transformTemplate: d } = this.visualElement.getProps();
    this.visualElement.current.style.transform = d ? d({}, "") : "none", r.root && r.root.updateScroll(), r.updateLayout(), this.constraints = !1, this.resolveConstraints(), En((h) => {
      if (!Zs(h, l, null))
        return;
      const y = this.getAxisMotionValue(h), { min: v, max: S } = this.constraints[h];
      y.set(_t(v, S, c[h]));
    }), this.visualElement.render();
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    tM.set(this.visualElement, this);
    const l = this.visualElement.current, o = nu(l, "pointerdown", (S) => {
      const { drag: p, dragListener: g = !0 } = this.getProps(), b = S.target, N = b !== l && XA(b);
      p && g && !N && this.start(S);
    });
    let r;
    const c = () => {
      const { dragConstraints: S } = this.getProps();
      Xa(S) && S.current && (this.constraints = this.resolveRefConstraints(), r || (r = nM(l, S.current, () => this.scalePositionWithinConstraints())));
    }, { projection: d } = this.visualElement, h = d.addEventListener("measure", c);
    d && !d.layout && (d.root && d.root.updateScroll(), d.updateLayout()), Ut.read(c);
    const y = su(window, "resize", () => this.scalePositionWithinConstraints()), v = d.addEventListener("didUpdate", (({ delta: S, hasLayoutChanged: p }) => {
      this.isDragging && p && (En((g) => {
        const b = this.getAxisMotionValue(g);
        b && (this.originPoint[g] += S[g].translate, b.set(b.get() + S[g].translate));
      }), this.visualElement.render());
    }));
    return () => {
      y(), o(), h(), v && v(), r && r();
    };
  }
  getProps() {
    const l = this.visualElement.getProps(), { drag: o = !1, dragDirectionLock: r = !1, dragPropagation: c = !1, dragConstraints: d = !1, dragElastic: h = Jf, dragMomentum: y = !0 } = l;
    return {
      ...l,
      drag: o,
      dragDirectionLock: r,
      dragPropagation: c,
      dragConstraints: d,
      dragElastic: h,
      dragMomentum: y
    };
  }
}
function bp(a) {
  let l = !0;
  return () => {
    if (l) {
      l = !1;
      return;
    }
    a();
  };
}
function nM(a, l, o) {
  const r = Rg(a, bp(o)), c = Rg(l, bp(o));
  return () => {
    r(), c();
  };
}
function Zs(a, l, o) {
  return (l === !0 || l === a) && (o === null || o === a);
}
function iM(a, l = 10) {
  let o = null;
  return Math.abs(a.y) > l ? o = "y" : Math.abs(a.x) > l && (o = "x"), o;
}
class aM extends Ei {
  constructor(l) {
    super(l), this.removeGroupControls = Ie, this.removeListeners = Ie, this.controls = new eM(l);
  }
  mount() {
    const { dragControls: l } = this.node.getProps();
    l && (this.removeGroupControls = l.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || Ie;
  }
  update() {
    const { dragControls: l } = this.node.getProps(), { dragControls: o } = this.node.prevProps || {};
    l !== o && (this.removeGroupControls(), l && (this.removeGroupControls = l.subscribe(this.controls)));
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
  }
}
const Tf = (a) => (l, o) => {
  a && Ut.update(() => a(l, o), !1, !0);
};
class lM extends Ei {
  constructor() {
    super(...arguments), this.removePointerDownListener = Ie;
  }
  onPointerDown(l) {
    this.session = new b1(l, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: T1(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: l, onPanStart: o, onPan: r, onPanEnd: c } = this.node.getProps();
    return {
      onSessionStart: Tf(l),
      onStart: Tf(o),
      onMove: Tf(r),
      onEnd: (d, h) => {
        delete this.session, c && Ut.postRender(() => c(d, h));
      }
    };
  }
  mount() {
    this.removePointerDownListener = nu(this.node.current, "pointerdown", (l) => this.onPointerDown(l));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
let bf = !1;
class uM extends tt.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: l, layoutGroup: o, switchLayoutGroup: r, layoutId: c } = this.props, { projection: d } = l;
    d && (o.group && o.group.add(d), r && r.register && c && r.register(d), bf && d.root.didUpdate(), d.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), d.setOptions({
      ...d.options,
      layoutDependency: this.props.layoutDependency,
      onExitComplete: () => this.safeToRemove()
    })), to.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(l) {
    const { layoutDependency: o, visualElement: r, drag: c, isPresent: d } = this.props, { projection: h } = r;
    return h && (h.isPresent = d, l.layoutDependency !== o && h.setOptions({
      ...h.options,
      layoutDependency: o
    }), bf = !0, c || l.layoutDependency !== o || o === void 0 || l.isPresent !== d ? h.willUpdate() : this.safeToRemove(), l.isPresent !== d && (d ? h.promote() : h.relegate() || Ut.postRender(() => {
      const y = h.getStack();
      (!y || !y.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { visualElement: l, layoutAnchor: o } = this.props, { projection: r } = l;
    r && (r.options.layoutAnchor = o, r.root.didUpdate(), vh.postRender(() => {
      !r.currentAnimation && r.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: l, layoutGroup: o, switchLayoutGroup: r } = this.props, { projection: c } = l;
    bf = !0, c && (c.scheduleCheckAfterUnmount(), o && o.group && o.group.remove(c), r && r.deregister && r.deregister(c));
  }
  safeToRemove() {
    const { safeToRemove: l } = this.props;
    l && l();
  }
  render() {
    return null;
  }
}
function A1(a) {
  const [l, o] = d3(), r = tt.useContext(_p);
  return Jt.jsx(uM, { ...a, layoutGroup: r, switchLayoutGroup: tt.useContext(v1), isPresent: l, safeToRemove: o });
}
const sM = {
  pan: {
    Feature: lM
  },
  drag: {
    Feature: aM,
    ProjectionNode: f1,
    MeasureLayout: A1
  }
};
function Ep(a, l, o) {
  const { props: r } = a;
  a.animationState && r.whileHover && a.animationState.setActive("whileHover", o === "Start");
  const c = "onHover" + o, d = r[c];
  d && Ut.postRender(() => d(l, fu(l)));
}
class oM extends Ei {
  mount() {
    const { current: l } = this.node;
    l && (this.unmount = jA(l, (o, r) => (Ep(this.node, r, "Start"), (c) => Ep(this.node, c, "End"))));
  }
  unmount() {
  }
}
class rM extends Ei {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let l = !1;
    try {
      l = this.node.current.matches(":focus-visible");
    } catch {
      l = !0;
    }
    !l || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = ou(su(this.node.current, "focus", () => this.onFocus()), su(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function Ap(a, l, o) {
  const { props: r } = a;
  if (a.current instanceof HTMLButtonElement && a.current.disabled)
    return;
  a.animationState && r.whileTap && a.animationState.setActive("whileTap", o === "Start");
  const c = "onTap" + (o === "End" ? "" : o), d = r[c];
  d && Ut.postRender(() => d(l, fu(l)));
}
class cM extends Ei {
  mount() {
    const { current: l } = this.node;
    if (!l)
      return;
    const { globalTapTarget: o, propagate: r } = this.node.props;
    this.unmount = ZA(l, (c, d) => (Ap(this.node, d, "Start"), (h, { success: y }) => Ap(this.node, h, y ? "End" : "Cancel")), {
      useGlobalTarget: o,
      stopPropagation: r?.tap === !1
    });
  }
  unmount() {
  }
}
const Ff = /* @__PURE__ */ new WeakMap(), Ef = /* @__PURE__ */ new WeakMap(), fM = (a) => {
  const l = Ff.get(a.target);
  l && l(a);
}, hM = (a) => {
  a.forEach(fM);
};
function dM({ root: a, ...l }) {
  const o = a || document;
  Ef.has(o) || Ef.set(o, {});
  const r = Ef.get(o), c = JSON.stringify(l);
  return r[c] || (r[c] = new IntersectionObserver(hM, { root: a, ...l })), r[c];
}
function mM(a, l, o) {
  const r = dM(l);
  return Ff.set(a, o), r.observe(a), () => {
    Ff.delete(a), r.unobserve(a);
  };
}
const yM = {
  some: 0,
  all: 1
};
class gM extends Ei {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.stopObserver?.();
    const { viewport: l = {} } = this.node.getProps(), { root: o, margin: r, amount: c = "some", once: d } = l, h = {
      root: o ? o.current : void 0,
      rootMargin: r,
      threshold: typeof c == "number" ? c : yM[c]
    }, y = (v) => {
      const { isIntersecting: S } = v;
      if (this.isInView === S || (this.isInView = S, d && !S && this.hasEnteredView))
        return;
      S && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", S);
      const { onViewportEnter: p, onViewportLeave: g } = this.node.getProps(), b = S ? p : g;
      b && b(v);
    };
    this.stopObserver = mM(this.node.current, h, y);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: l, prevProps: o } = this.node;
    ["amount", "margin", "root"].some(pM(l, o)) && this.startObserver();
  }
  unmount() {
    this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1;
  }
}
function pM({ viewport: a = {} }, { viewport: l = {} } = {}) {
  return (o) => a[o] !== l[o];
}
const vM = {
  inView: {
    Feature: gM
  },
  tap: {
    Feature: cM
  },
  focus: {
    Feature: rM
  },
  hover: {
    Feature: oM
  }
}, SM = {
  layout: {
    ProjectionNode: f1,
    MeasureLayout: A1
  }
}, TM = {
  ...X3,
  ...vM,
  ...sM,
  ...SM
}, bM = /* @__PURE__ */ L3(TM, j3);
function eo(a) {
  const l = kf(() => bi(a)), { isStatic: o } = tt.useContext(Dh);
  if (o) {
    const [, r] = tt.useState(a);
    tt.useEffect(() => l.on("change", r), []);
  }
  return l;
}
function M1(a, l) {
  const o = eo(l()), r = () => o.set(l());
  return r(), Up(() => {
    const c = () => Ut.preRender(r, !1, !0), d = a.map((h) => h.on("change", c));
    return () => {
      d.forEach((h) => h()), qn(r);
    };
  }), o;
}
function EM(a) {
  tu.current = [], a();
  const l = M1(tu.current, a);
  return tu.current = void 0, l;
}
function Af(a, l, o, r) {
  if (typeof a == "function")
    return EM(a);
  const d = typeof l == "function" ? l : t2(l, o, r), h = Array.isArray(a) ? Mp(a, d) : Mp([a], ([v]) => d(v)), y = Array.isArray(a) ? void 0 : a.accelerate;
  return y && !y.isTransformed && typeof l != "function" && Array.isArray(o) && r?.clamp !== !1 && (h.accelerate = {
    ...y,
    times: l,
    keyframes: o,
    isTransformed: !0
  }), h;
}
function Mp(a, l) {
  const o = kf(() => []);
  return M1(a, () => {
    o.length = 0;
    const r = a.length;
    for (let c = 0; c < r; c++)
      o[c] = a[c].get();
    return l(o);
  });
}
function AM() {
  !Eh.current && Lv();
  const [a] = tt.useState(oo.current);
  return a;
}
function Oh(a) {
  return typeof a == "object" && !Array.isArray(a);
}
function D1(a, l, o, r) {
  return a == null ? [] : typeof a == "string" && Oh(l) ? ph(a, o, r) : a instanceof NodeList ? Array.from(a) : Array.isArray(a) ? a.filter((c) => c != null) : [a];
}
function MM(a, l, o) {
  return a * (l + 1) + o * l;
}
function Dp(a, l, o, r) {
  return typeof l == "number" ? l : l.startsWith("-") || l.startsWith("+") ? Math.max(0, a + parseFloat(l)) : l === "<" ? o : l.startsWith("<") ? Math.max(0, o + parseFloat(l.slice(1))) : r.get(l) ?? a;
}
function DM(a, l, o) {
  for (let r = 0; r < a.length; r++) {
    const c = a[r];
    c.at > l && c.at < o && (Ja(a, c), r--);
  }
}
function xM(a, l, o, r, c, d) {
  DM(a, c, d);
  for (let h = 0; h < l.length; h++)
    a.push({
      value: l[h],
      at: _t(c, d, r[h]),
      easing: /* @__PURE__ */ Pp(o, h)
    });
}
function CM(a, l, o = 0) {
  const r = l + 1 + l * o;
  for (let c = 0; c < a.length; c++)
    a[c] = a[c] / r;
}
function OM(a, l) {
  return a.at === l.at ? a.value === null ? 1 : l.value === null ? -1 : 0 : a.at - l.at;
}
const zM = "easeInOut", RM = 20;
function NM(a, { defaultTransition: l = {}, ...o } = {}, r, c) {
  const d = l.duration || 0.3, h = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), v = {}, S = /* @__PURE__ */ new Map();
  let p = 0, g = 0, b = 0;
  for (let N = 0; N < a.length; N++) {
    const R = a[N];
    if (typeof R == "string") {
      S.set(R, g);
      continue;
    } else if (!Array.isArray(R)) {
      S.set(R.name, Dp(g, R.at, p, S));
      continue;
    }
    let [B, U, w = {}] = R;
    w.at !== void 0 && (g = Dp(g, w.at, p, S));
    let L = 0;
    const Y = (q, et, st, G = 0, X = 0) => {
      const lt = VM(q), { delay: J = 0, times: rt = fv(lt), type: nt = l.type || "keyframes", repeat: Dt, repeatType: Ot, repeatDelay: mt = 0, ...j } = et;
      let { ease: k = l.ease || "easeOut", duration: Z } = et;
      const ft = typeof J == "function" ? J(G, X) : J, ot = lt.length, wt = ch(nt) ? nt : c?.[nt || "keyframes"];
      if (ot <= 2 && wt) {
        let H = 100;
        if (ot === 2 && BM(lt)) {
          const yt = lt[1] - lt[0];
          H = Math.abs(yt);
        }
        const W = {
          ...l,
          ...j
        };
        Z !== void 0 && (W.duration = /* @__PURE__ */ Oe(Z));
        const I = sv(W, H, wt);
        k = I.ease, Z = I.duration;
      }
      Z ?? (Z = d);
      const ue = g + ft;
      rt.length === 1 && rt[0] === 0 && (rt[1] = 1);
      const Ge = rt.length - lt.length;
      if (Ge > 0 && cv(rt, Ge), lt.length === 1 && lt.unshift(null), Dt && Dt < RM) {
        const H = Z > 0 ? mt / Z : 0;
        Z = MM(Z, Dt, mt);
        const W = [...lt], I = [...rt];
        k = Array.isArray(k) ? [...k] : [k];
        const yt = [...k], bt = Ot === "reverse" || Ot === "mirror";
        let Et = W, $ = yt;
        bt && (Et = [...W].reverse(), Ot === "reverse" && ($ = [...yt].reverse().map((at) => typeof at == "function" ? /* @__PURE__ */ th(at) : at)));
        for (let at = 0; at < Dt; at++) {
          const qe = bt && at % 2 === 0, $i = qe ? Et : W, Xn = qe ? $ : yt, ze = (at + 1) * (1 + H);
          H > 0 && (lt.push(lt[lt.length - 1]), rt.push(ze), k.push("linear")), lt.push(...$i);
          for (let Gt = 0; Gt < $i.length; Gt++)
            rt.push(I[Gt] + ze), k.push(Gt === 0 ? "linear" : /* @__PURE__ */ Pp(Xn, Gt - 1));
        }
        CM(rt, Dt, H);
      }
      const A = ue + Z;
      xM(st, lt, k, rt, ue, A), L = Math.max(ft + Z, L), b = Math.max(A, b);
    };
    if (ee(B)) {
      const q = xp(B, y);
      Y(U, w, Cp("default", q));
    } else {
      const q = D1(B, U, r, v), et = q.length;
      for (let st = 0; st < et; st++) {
        U = U, w = w;
        const G = q[st], X = xp(G, y);
        for (const lt in U)
          Y(U[lt], _M(w, lt), Cp(lt, X), st, et);
      }
    }
    p = g, g += L;
  }
  return y.forEach((N, R) => {
    for (const B in N) {
      const U = N[B];
      U.sort(OM);
      const w = [], L = [], Y = [];
      for (let G = 0; G < U.length; G++) {
        const { at: X, value: lt, easing: J } = U[G];
        w.push(lt), L.push(/* @__PURE__ */ Fa(0, b, X)), Y.push(J || "easeOut");
      }
      L[0] !== 0 && (L.unshift(0), w.unshift(w[0]), Y.unshift(zM)), L[L.length - 1] !== 1 && (L.push(1), w.push(null)), h.has(R) || h.set(R, {
        keyframes: {},
        transition: {}
      });
      const q = h.get(R);
      q.keyframes[B] = w;
      const { type: et, ...st } = l;
      q.transition[B] = {
        ...st,
        duration: b,
        ease: Y,
        times: L,
        ...o
      };
    }
  }), h;
}
function xp(a, l) {
  return !l.has(a) && l.set(a, {}), l.get(a);
}
function Cp(a, l) {
  return l[a] || (l[a] = []), l[a];
}
function VM(a) {
  return Array.isArray(a) ? a : [a];
}
function _M(a, l) {
  return a && a[l] ? {
    ...a,
    ...a[l]
  } : { ...a };
}
const UM = (a) => typeof a == "number", BM = (a) => a.every(UM);
function wM(a) {
  const l = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        transform: {},
        transformOrigin: {},
        style: {},
        vars: {},
        attrs: {}
      },
      latestValues: {}
    }
  }, o = go(a) && !wv(a) ? new Iv(l) : new Fv(l);
  o.mount(a), lu.set(a, o);
}
function HM(a) {
  const l = {
    presenceContext: null,
    props: {},
    visualState: {
      renderState: {
        output: {}
      },
      latestValues: {}
    }
  }, o = new g2(l);
  o.mount(a), lu.set(a, o);
}
function LM(a, l) {
  return ee(a) || typeof a == "number" || typeof a == "string" && !Oh(l);
}
function x1(a, l, o, r) {
  const c = [];
  if (LM(a, l))
    c.push(s1(a, Oh(l) && l.default || l, o && (o.default || o)));
  else {
    if (a == null)
      return c;
    const d = D1(a, l, r), h = d.length;
    for (let y = 0; y < h; y++) {
      const v = d[y], S = v instanceof Element ? wM : HM;
      lu.has(v) || S(v);
      const p = lu.get(v), g = { ...o };
      "delay" in g && typeof g.delay == "function" && (g.delay = g.delay(y, h)), c.push(...yh(p, { ...l, transition: g }, {}));
    }
  }
  return c;
}
function jM(a, l, o) {
  const r = [], c = a.map((h) => {
    if (Array.isArray(h) && typeof h[0] == "function") {
      const y = h[0], v = bi(0);
      return v.on("change", y), h.length === 1 ? [v, [0, 1]] : h.length === 2 ? [v, [0, 1], h[1]] : [v, h[1], h[2]];
    }
    return h;
  });
  return NM(c, l, o, { spring: au }).forEach(({ keyframes: h, transition: y }, v) => {
    r.push(...x1(v, h, y));
  }), r;
}
function YM(a) {
  return Array.isArray(a) && a.some(Array.isArray);
}
function GM(a = {}) {
  const { scope: l, reduceMotion: o, skipAnimations: r } = a;
  function c(d, h, y) {
    let v = [], S;
    const p = {};
    if (o !== void 0 && (p.reduceMotion = o), r !== void 0 && (p.skipAnimations = r), YM(d)) {
      const { onComplete: b, ...N } = h || {};
      typeof b == "function" && (S = b), v = jM(d, { ...p, ...N }, l);
    } else {
      const { onComplete: b, ...N } = y || {};
      typeof b == "function" && (S = b), v = x1(d, h, { ...p, ...N }, l);
    }
    const g = new lA(v);
    return S && g.finished.then(S), l && (l.animations.push(g), g.finished.then(() => {
      Ja(l.animations, g);
    })), g;
  }
  return c;
}
const Mf = GM(), Wl = bM, Ks = "/static/intro/", no = [0.22, 1, 0.36, 1], Op = ["home", "prepare", "arrive", "settle"], C1 = { home: "right", prepare: "above", arrive: "below", settle: "right" }, qM = { ...C1, settle: "left" }, io = 1.75, zp = (io - 1) / 2 * 100, Rp = (a) => Math.max(-zp, Math.min(zp, a)), XM = (a) => ({ scale: io, x: `${Rp((0.5 - a.x) * 100 * io)}%`, y: `${Rp((0.5 - a.y) * 100 * io)}%` });
function QM() {
  const a = "(max-width: 760px)", [l, o] = tt.useState(() => matchMedia(a).matches);
  return tt.useEffect(() => {
    const r = matchMedia(a), c = () => o(r.matches);
    return r.addEventListener("change", c), () => r.removeEventListener("change", c);
  }, []), l;
}
function Np(a) {
  const [l, o] = tt.useState(null);
  return tt.useEffect(() => {
    let r = !0;
    return fetch(a).then((c) => c.json()).then((c) => r && o(c)).catch(() => {
    }), () => {
      r = !1;
    };
  }, [a]), l;
}
function ZM(a, l) {
  let o = 0, r = 1 / 0;
  return a.forEach(([c, d], h) => {
    const y = (c - l.x) ** 2 + (d - l.y) ** 2;
    y < r && (r = y, o = h);
  }), a.slice(0, o + 1);
}
function KM({ done: a, total: l }) {
  if (!l) return null;
  const o = 15, r = 2 * Math.PI * o;
  return /* @__PURE__ */ Jt.jsxs("svg", { className: "brm-ring", viewBox: "0 0 36 36", "aria-hidden": "true", children: [
    /* @__PURE__ */ Jt.jsx("circle", { cx: "18", cy: "18", r: o, className: "brm-ring-bg" }),
    /* @__PURE__ */ Jt.jsx(
      Wl.circle,
      {
        cx: "18",
        cy: "18",
        r: o,
        className: "brm-ring-fg",
        strokeDasharray: r,
        initial: { strokeDashoffset: r },
        animate: { strokeDashoffset: r * (1 - a / l) },
        transition: { duration: 1.1, ease: no, delay: 0.6 },
        transform: "rotate(-90 18 18)"
      }
    )
  ] });
}
const Vp = tt.forwardRef(function({ stages: l = {}, current: o = "home", progress: r = {}, cityFrom: c = "", cityTo: d = "", onStop: h, backdrop: y = !1, focus: v = null }, S) {
  const p = QM(), g = AM(), b = Np(`${Ks}roadmap${p ? "-tall" : ""}.json`), N = Np(`${Ks}boat.json`), [R, B] = tt.useState(null), U = y ? v : R, w = Math.max(0, Op.indexOf(o));
  tt.useImperativeHandle(S, () => ({ zoomOut: () => B(null) }), []);
  const L = eo(0), Y = eo(0), q = eo(0.3), et = Af(L, (nt) => `${nt * 100}%`), st = Af(Y, (nt) => `${nt * 100}%`), G = tt.useMemo(() => {
    if (!b) return null;
    const nt = y ? v || "home" : o, Dt = b.stages[nt === "settle" ? "arrive" : nt];
    return ZM(b.path, Dt);
  }, [b, o, y, v]);
  tt.useEffect(() => {
    if (!b || !N || !G) return;
    const nt = b.stages, Dt = N.length, Ot = (ot) => {
      const wt = nt.home, ue = nt.arrive, Ge = Math.max(0, Math.min(1, (ot - wt.y) / (ue.y - wt.y)));
      return (wt.boat + (ue.boat - wt.boat) * Ge) / Dt;
    }, mt = G[G.length - 1];
    if (g || G.length < 2) {
      L.set(mt[0]), Y.set(mt[1]), q.set(Ot(mt[1]));
      return;
    }
    L.set(G[0][0]), Y.set(G[0][1]), q.set(Ot(G[0][1]));
    const j = { duration: 1.2 + G.length * 0.07, ease: [0.45, 0, 0.2, 1], delay: 0.5 }, k = Mf(L, G.map((ot) => ot[0]), j), Z = Mf(Y, G.map((ot) => ot[1]), j), ft = Mf(q, G.map((ot) => Ot(ot[1])), j);
    return () => {
      k.stop(), Z.stop(), ft.stop();
    };
  }, [b, N, G, g]);
  const X = Af(q, (nt) => nt);
  if (!b) return /* @__PURE__ */ Jt.jsx("div", { className: "brm brm-loading" });
  const lt = U ? b.stages[U] : null, J = {
    home: { title: l.home?.title || "Home", sub: c ? `From ${c}` : "Where you start" },
    prepare: { title: l.prepare?.title || "Prepare the move", sub: "Papers, portals, packing" },
    arrive: { title: l.arrive?.title || "Arrive and set up", sub: "The first weeks" },
    settle: { title: l.settle?.title || "Settle in", sub: d ? `Your home in ${d}` : "Months three to twelve" }
  }, rt = (nt) => {
    B(nt), setTimeout(() => h?.(nt), g ? 0 : 650);
  };
  return /* @__PURE__ */ Jt.jsx("div", { className: `brm ${p ? "tall" : ""} ${y ? "backdrop" : ""}`, style: y ? {} : { aspectRatio: `${b.w} / ${b.h}` }, children: /* @__PURE__ */ Jt.jsx("div", { className: "brm-fit", style: { "--ar": b.w / b.h }, children: /* @__PURE__ */ Jt.jsxs(
    Wl.div,
    {
      className: "brm-world",
      animate: lt ? XM(lt) : { scale: 1, x: "0%", y: "0%" },
      transition: { duration: y ? 1.2 : 0.75, ease: no },
      style: { transformOrigin: "50% 50%" },
      children: [
        /* @__PURE__ */ Jt.jsx(Wl.img, { src: `${Ks}roadmap${p ? "-tall" : ""}.webp`, alt: "", className: "brm-img", initial: { opacity: 0, scale: 1.04 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.2, ease: no } }),
        N && /* @__PURE__ */ Jt.jsx(
          Wl.img,
          {
            src: `${Ks}boat.webp`,
            alt: "",
            className: "brm-boat",
            "aria-hidden": "true",
            style: { left: et, top: st, scale: X, width: N.w, height: N.h, x: `${-N.anchor[0] * 100}%`, y: `${-N.anchor[1] * 100}%`, transformOrigin: `${N.anchor[0] * 100}% ${N.anchor[1] * 100}%` }
          }
        ),
        !y && Op.map((nt, Dt) => {
          const Ot = b.stages[nt], mt = Dt < w ? "past" : Dt === w ? "now" : "next", [j, k] = r[nt] || [0, 0];
          return /* @__PURE__ */ Jt.jsxs(
            Wl.button,
            {
              className: `brm-stop ${mt} at-${(p ? qM : C1)[nt]}`,
              style: { left: `${Ot.x * 100}%`, top: `${Ot.y * 100}%` },
              onClick: () => rt(nt),
              initial: { opacity: 0, y: 10 },
              animate: { opacity: lt && U !== nt ? 0 : 1, y: 0 },
              transition: { delay: lt ? 0 : 0.9 + Dt * 0.18, duration: 0.5, ease: no },
              "aria-label": `${J[nt].title}: open its checklist`,
              children: [
                /* @__PURE__ */ Jt.jsxs("span", { className: "brm-pin", children: [
                  /* @__PURE__ */ Jt.jsx("span", { className: "brm-n", children: mt === "past" ? "✓" : Dt + 1 }),
                  /* @__PURE__ */ Jt.jsx(KM, { done: j, total: k })
                ] }),
                /* @__PURE__ */ Jt.jsxs("span", { className: "brm-label", children: [
                  /* @__PURE__ */ Jt.jsx("b", { children: J[nt].title }),
                  /* @__PURE__ */ Jt.jsx("small", { children: mt === "now" ? "You are here" : mt === "past" ? "Behind you" : J[nt].sub })
                ] })
              ]
            },
            nt
          );
        })
      ]
    }
  ) }) });
});
function JM(a, l) {
  const o = _b.createRoot(a), r = tt.createRef();
  let c = l;
  o.render(/* @__PURE__ */ Jt.jsx(Vp, { ref: r, ...c }));
  const d = () => o.unmount();
  return d.zoomOut = () => r.current?.zoomOut(), d.update = (h) => {
    c = { ...c, ...h }, o.render(/* @__PURE__ */ Jt.jsx(Vp, { ref: r, ...c }));
  }, d;
}
window.BA_UI = { ...window.BA_UI || {}, mountRoadmap: JM };
export {
  JM as mountRoadmap
};
