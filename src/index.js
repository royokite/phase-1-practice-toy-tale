//Toy Tale Practice!
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  
  //Load toys from db
  const toySauce = 'http://localhost:3000/toys';

  fetch(toySauce)
  .then(response => response.json())
  .then(toys => renderToys(toys))

  //Add new toy to page
  const newToy = document.querySelector('.add-toy-form');
  
  newToy.addEventListener('submit', (e) => {
    e.preventDefault()
    const toyData = {
      name: document.getElementsByName('name')[0].value,
      image: document.getElementsByName('image')[0].value,
      likes: 0,
    }
    renderOneToy(toyData)
    submitToy(toyData)

    newToy.reset()
  });
  
  //Persist change to db
  function submitToy(toyData) {  
    fetch(toySauce, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(toyData)  
    })
    .then(response => response.json())
  } 
  
  const toySpace = document.querySelector('#toy-collection');

  //Add all toys to page from db
  function renderToys(toys) {  

    toys.map(toy => {    
      const card = document.createElement('div');
      card.className = 'card'
      card.innerHTML = `
        <h2>${toy.name}</h2>
        <img src='${toy.image}' class='toy-avatar'/>
        <p>${toy.likes}</p>
        <button class='like-btn' id='${toy.id}'>Like ❤️</button>
      `
      toySpace.appendChild(card)
    });    
  
    const likeBtns = document.querySelectorAll('.like-btn')

    likeBtns.forEach(btn => btn.addEventListener('click', (e) => {
      let likeCount = parseInt(e.target.parentNode.querySelector('p').textContent, 10)
      likeCount += 1
      e.target.parentNode.querySelector('p').textContent = likeCount
      const likeId = btn.getAttribute('id')

      fetch(`http://localhost:3000/toys/${likeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({likes: likeCount})
    })
    .then(response => response.json())
    }))
  }

  //Add submitted toy to page
  function renderOneToy(addedToy) {
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <h2>${addedToy.name}</h2>
      <img src='${addedToy.image}' class='toy-avatar'/>
      <p>${addedToy.likes}</p>
      <button class='like-btn' id='${addedToy.id}'>Like ❤️</button>
      `
    toySpace.appendChild(card)
  }
});
