/* exported aboutProject */
var aboutProject = (function aboutProject() {
  function createAbout() {
    var wrap = document.createElement("div");
    var author = document.createElement("div");
    var text = document.createElement("div");

    wrap.id = "idNewEl";
    wrap.className = "wrapStyle borders";

    author.className = "authorClass";
    author.id = "idAuthorClass";
    author.innerHTML = "TatyanaTimoshek";
    text.className = "textClass";
    text.innerHTML = "Contact us anytime you need: support@example.com";
    wrap.appendChild(author);
    wrap.appendChild(text);
    return wrap;
  }
  return {
    init: createAbout
  };
})();
