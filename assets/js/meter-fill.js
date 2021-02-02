// A way to watch for class changes to trigger meter fill on activating with Mutation Observer

class ClassWatcher {

  constructor(targetNode, classToWatch, classAddedCallback, classRemovedCallback) {
      this.targetNode = targetNode
      this.classToWatch = classToWatch
      this.classAddedCallback = classAddedCallback
      this.classRemovedCallback = classRemovedCallback
      this.observer = null
      this.lastClassState = targetNode.classList.contains(this.classToWatch)

      this.init()
  }

  init() {
      this.observer = new MutationObserver(this.mutationCallback)
      this.observe()
  }

  observe() {
      this.observer.observe(this.targetNode, { attributes: true })
  }

  disconnect() {
      this.observer.disconnect()
  }

  mutationCallback = mutationsList => {
      for(let mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              let currentClassState = mutation.target.classList.contains(this.classToWatch)
              if(this.lastClassState !== currentClassState) {
                  this.lastClassState = currentClassState
                  if(currentClassState) {
                      this.classAddedCallback()
                  }
                  else {
                      this.classRemovedCallback()
                  }
              }
          }
      }
  }
}

// assigning variables
let targetNode = document.getElementById('skills')
let $meter = $(".meter"),
$percentage = $(".percentage");  


//function for changing the width of meter
const fillingBar = (i) => {  
  let fillID = null;
  let p = 1;    
  const fill = (i) => {
    $meter[i].style.width = p + "%";        
    if (p > parseInt($percentage[i].innerHTML)*0.75) {
      clearInterval(fillID);
    } 
    p++;
  }
  fillID = setInterval( function() { fill(i); }, 12);
}


//callback functions for classwatcher
function onClassAdd() {
  for (let i = 0, delay = 500; i < 8; i++) {
    setTimeout(function() { fillingBar(i) }, delay);
    delay += 100;
  }
}

function onClassRemoval() {
  for (let i = 0, delay = 1000; i < 8; i++) {
    setTimeout(function() { 
      $meter[i].style.width = 0 + "%";        
    }, delay);      
  }
}

//watcher for a class change 'active'
let classWatcher = new ClassWatcher(targetNode, 'active', onClassAdd, onClassRemoval)