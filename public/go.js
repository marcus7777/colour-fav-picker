function go() {
  let textarea = document.getElementsByTagName('textarea')[0]
  if (textarea.value === '') {
    alert("Please click on the colour you like the most.. \n and keep doing this until they have all gone . . .")
  }

  var colour_array = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "i", "S", "E", "G", "Y", "T"];
  var asked = false
  shuffle(colour_array);
  let container = document.getElementById("container");

  function createFields(cb) {
    container.innerHTML = "<div/>"
    for (let i = 0; i < colour_array.length; i++) {
      let O = document.createElement("div");
      O.className = 'field c' + colour_array[i]
      container.appendChild(O)
      O.addEventListener("click", function () {
        
        let letter = this.className.replace('field c', '')
        container.removeChild(this)
        distributeFields();
	let fields = [... document.getElementsByClassName("field")];
        textarea.value += letter;
         
        if (fields.length == 1) {
          var lastLetter = fields[0].className.replace('field c', '')
	  container.removeChild(fields[0])
          
          textarea.value += lastLetter + '\n'
          shuffle(colour_array)
          createFields(distributeFields)
          if (textarea.value.split('\n').length === 2) {
            alert("That's great just to cross reference please do it again")
          }
          if (textarea.value.split('\n').length > 5 && performance.now() > 84000) {
            var add = textarea.value.replace( /\n/g , " ") 
            var sets = add.split(" ")
            var moving = {}
            for (let index = 0; index < sets.length; ++index) {
              for (let place = 0; place < sets[index].length; ++place) {
                if (moving[sets[index][place]]) {
                  moving[sets[index][place]] += " " + place
                } else {
                  moving[sets[index][place]] = place 
                }
              }
            }
            var movings = 0
            for (places in moving) {
              var thePlaces = moving[places]
              if (+thePlaces != thePlaces) {
                movings += thePlaces.split(" ").reduce(function(max, value) {
                  return Math.max(max, value)
                }, 0) - thePlaces.split(" ").reduce(function(min, value) {
                  return Math.min(min, value)
                }, 15)
              }
            }
            if (movings < 120) {
              firebase.firestore().collection("Picks").add({
                colours: add,
                time: Date.now(),
                timepicking: performance.now(),
                movings: movings,
              })
            } else {
              firebase.firestore().collection("Testing").add({
                colours: add,
                time: Date.now(),
                timepicking: performance.now(),
                movings: movings,
              })
            }
            console.log(movings)

            if (movings > 120 || sets.length > 20) {
              alert("Thank you for testing the colour pick picker\n resetting ...")
              textarea.value = ""
            } else {
              if (!asked && confirm("Thank you for taking the time to pick your colours. Would you like to email them to me so I can give you a reading?")){
                var link = "mailto:andipandi666@gmail.com?subject=I would like a mind blowing insight.&body=Here's what I picked - " 
                window.location.href = link + add
              }
              asked = true
            }
          }
        }
      })
    }
    cb()
  }

  function distributeFields() {
    var radius = 200;
    let fields = [... document.getElementsByClassName("field")];
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let angle = 0;
    let step = (2 * Math.PI) / fields.length;

    fields.forEach(function (o) {
      var x = Math.round(width / 2 + radius * Math.cos(angle) - o.offsetWidth / 2)
      var y = Math.round(height / 2 + radius * Math.sin(angle) - o.offsetHeight / 2)
    
      var size = (Math.round(radius * Math.sin(step))) -9

      o.style.left = x + 'px';
      o.style.top = y + 'px';
      o.style.height = size + 'px';
      o.style.width = size + 'px';
      o.style.borderRadius = size / 2 + 'px';

      angle += step
    })
  }

  createFields(distributeFields);

  function shuffle(array) {
    var m = array.length, t, i

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m]
      array[m] = array[i]
      array[i] = t
    }

    return array
  }
}

setTimeout(go, 500)
