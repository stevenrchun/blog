var parents = document.getElementsByClassName('sidenote');

for (var i = 1; i < parents.length; i += 2) {
  parents[i].classList.add('even-sidenote');
}
