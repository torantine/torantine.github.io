// Nav Bar Toggle

const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})

// Search Bar (see https://www.youtube.com/watch?v=TlP5WIxVirU)

const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.querySelector("[data-search]")

let users = []

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase()
  users.forEach(user => {
    const isVisible = 
    user.name.toLowerCase().includes(value) || 
    user.email.toLowerCase().includes(value)
    user.element.classList.toggle("hide", !isVisible)
  })
})

fetch("https://jsonplaceholder.typicode.com/users")
  .then(res => res.json())
  .then(data => {
    users = data.map(user => {
      const card = userCardTemplate.content.cloneNode(true).children[0]
      const header = card.querySelector("[data-header]")
      const body = card.querySelector("[data-body]")
      header.textContent = user.name
      body.textContent = user.email
      userCardContainer.append(card)
      return{ name : user.name, email : user.email, element : card}
    })
  })

// Glossary Terms

const glossaryTermTemplate = document.querySelector("[glossary-item-template]")
const glossaryTermsContainer = document.querySelector("[glossary-terms-container]")
const glossaryExactMatchContainer = document.querySelector("[glossary-exact-match-container]")
const glossaryExactMatch = document.querySelector("[glossary-exact-match]")
const glossarySearchInput = document.querySelector("[glossary-search]")
let terms = [];
let inputEvent = new Event("input");



glossarySearchInput.addEventListener("input", (e) => {
  
  // clear and remove the exact match div
  glossaryExactMatch.textContent = "";
  glossaryExactMatch.remove()

  // set value to lower case so search works in either case
  const value = e.target.value.toLowerCase()

  // if a term's name or definition does not include search text, hide it
  terms.forEach(term => {
    const isVisible = 
    term.name.toLowerCase().includes(value) || 
    term.definition.toLowerCase().includes(value)
    term.element.classList.toggle("hide", !isVisible)
  })

  // if a term's name matches search text exactly, hide it then place it above the other terms
  terms.forEach(term => {
    let lcTerm = term.name.toLowerCase()
    let match = lcTerm === value
    if (match == true) {
      term.element.classList.toggle("hide", match)
      const item = glossaryTermTemplate.content.cloneNode(true).children[0]
      const header = item.querySelector("[term-header]")
      const body = item.querySelector("[term-body]")
      const topic = item.querySelector("[term-topic]")
      header.textContent = term.name
      body.textContent = term.definition
      topic.innerHTML = "Topic: " + term.topicLink
      glossaryExactMatch.append(item)
      glossaryExactMatchContainer.append(glossaryExactMatch)
    }
  })
})

// for each link with the class "search," listen for a click. If clicked, change the value of the search bar to the text of the link. Run input event.
// https://stackoverflow.com/questions/688196/how-to-use-a-link-to-call-javascript/688228#688228
// https://stackoverflow.com/questions/2856513/how-can-i-trigger-an-onchange-event-manually

var links = document.querySelectorAll(".search");
links.forEach(link => {
  link.addEventListener('click', () => {
    glossarySearchInput.value = link.innerText;
    glossarySearchInput.dispatchEvent(inputEvent);
    return false;
  })
})

fetch("../html/glossary-terms.json")
  .then(res => res.json())
  .then(data => {
    data.sort((a, b) => (a.name > b.name) ? 1 : -1) // sort by name
    terms = data.map(term => {
      const item = glossaryTermTemplate.content.cloneNode(true).children[0]
      const header = item.querySelector("[term-header]")
      const body = item.querySelector("[term-body]")
      const topic = item.querySelector("[term-topic]")
      header.textContent = term.name
      body.textContent = term.definition
      topic.innerHTML = "Topic: " + term.topicLink
      glossaryTermsContainer.append(item)
      return { name : term.name, definition: term.definition, topic : term.topic, topicLink : term.topicLink, element : item}
    })
  })


