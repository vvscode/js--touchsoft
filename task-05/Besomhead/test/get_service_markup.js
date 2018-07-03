window.addEventListener("load", function getChatConfiguratorMarkUp() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task05/task-05/Besomhead/build/html/service.html",
    false
  );
  xhr.addEventListener("load", function onLoad() {
    document.getElementById("service-container").innerHTML = xhr.responseText;
  });
  xhr.addEventListener("error", function onError() {
    throw new Error(xhr.statusText);
  });
  xhr.send();
});
