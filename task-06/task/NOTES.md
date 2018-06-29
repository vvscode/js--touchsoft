Пример работы с _long polling_

```javascript
console.clear();
var output = document.querySelector('#output');
var xhttp = new XMLHttpRequest();
var targetUrl = 'https://xxx.firebaseio.com/.json';

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    console.log('done:', this.responseText);
  } else if (this.status) {
    console.log('Progress:', this.status, this.responseText);
  }
};

xhttp.open('GET', targetUrl, true);
// https://firebase.google.com/docs/reference/rest/database/#section-streaming
xhttp.setRequestHeader('Accept', 'text/event-stream');
xhttp.send();
```

Пример чата сделанного по такому принципу - https://fbpollingchat.glitch.me/
