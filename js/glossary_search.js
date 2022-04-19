// Glossary Terms

const glossaryTermTemplate = document.querySelector("[glossary-item-template]")
const glossaryTermsContainer = document.querySelector("[glossary-terms-container]")
const glossaryExactMatchContainer = document.querySelector("[glossary-exact-match-container]")
const glossaryExactMatch = document.querySelector("[glossary-exact-match]")
const glossarySearchInput = document.querySelector("[glossary-search]")
let terms = [];
let topics = [];
let inputEvent = new Event("input");
/* const topics = [
    ["Basics of Music Theory" ,"https://dobrian.github.io/cmp/topics/basics-of-music-theory/0.basics-of-music-theory.html"],
    ["Basics of UI Design for Music", "https://dobrian.github.io/cmp/topics/basics-of-ui-for-music/0.index.html"],
    ["Beyond the Web Audio API", "https://dobrian.github.io/cmp/topics/beyond-the-web-audio-api/0.beyond-the-web-audio-api.html"],
    ["Building a Synthesizer with MSP", "https://dobrian.github.io/cmp/topics/building-a-synthesizer-with-msp/0.index.html"],
    ["Building a Synthesizer with Web Audio API", "https://dobrian.github.io/cmp/topics/building-a-synthesizer-with-web-audio-api/0.building-a-synthesizer.html"],
    ["Control Signals", "https://dobrian.github.io/cmp/topics/control-signals/0.index.html"],
    ["Delay-Based Effects", "https://dobrian.github.io/cmp/topics/delay-based-effects/0.index.html"],
    ["Filters", "https://dobrian.github.io/cmp/topics/filters/0.index.html"],
    ["The Fourier Transform", "https://dobrian.github.io/cmp/topics/fourier-transform/0.fourier-transform.html"],
    ["Introduction to HTML and JavaScript", "https://dobrian.github.io/cmp/topics/intro-to-html-and-js/0.introduction-to-html-and-js.html"],
    ["Introduction to Max and MSP", "https://dobrian.github.io/cmp/topics/intro-to-max-and-msp/0.index.html"],
    ["Introduction to Web Audio API", "https://dobrian.github.io/cmp/topics/intro-to-web-audio-api/0.introduction-to-web-audio-api.html"],
    ["Keyboard and Mouse Input in Max", "https://dobrian.github.io/cmp/topics/keyboard-and-mouse-input-in-max/0.index.html"],
    ["Linear Mapping and Interpolation", "https://dobrian.github.io/cmp/topics/linear-mapping-and-interpolation/0.index.html"],
    ["MIDI", "https://dobrian.github.io/cmp/topics/midi/0.index.html"],
    ["Musical Timing", "https://dobrian.github.io/cmp/topics/tempo-based-timing/0.index.html"],
    ["Physics of Sound", "https://dobrian.github.io/cmp/topics/physics-of-sound/0.index.html"],
    ["RAM-Based Sample Playback in Max", "https://dobrian.github.io/cmp/topics/ram-based-sample-playback-in-max/0.RAM-basedSamplePlayback.html"],
    ["Sample Recording and Playback with Web Audio API", "https://dobrian.github.io/cmp/topics/sample-recording-and-playback-with-web-audio-api/0.sample-recording-and-playback.html"],
    ["Sampling Theory", "https://dobrian.github.io/cmp/topics/sampling-theory/0.index.html"],
    ["Spatialization", "https://dobrian.github.io/cmp/topics/spatialization/0.index.html"]
] */

// create headers for each topic

const glossaryByTopic = document.querySelector("#glossary-by-topic")
/* for (i=0; i < topics.length; i++) {
    let topicHeader = document.createElement("div")
    topicHeader.innerHTML = "<h2><a href=\""+ topics[i][1] + "\">" + topics[i][0] + "</a></h2>"
    glossaryByTopic.append(topicHeader)

    let lessonHeader = document.createElement("div")
} */


// when the search box is typed in, filter the term list

glossarySearchInput.addEventListener("input", (e) => {
  
  // clear and remove the exact match div
  glossaryExactMatch.textContent = ""
  glossaryExactMatch.remove()

  // set value to lower case so search works in either case
  const value = e.target.value.toLowerCase()

  // if a term's name or definition does not include search text, hide it
  terms.forEach(term => {
    const isVisible = 
    term.name.toLowerCase().includes(value) || term.definition.toLowerCase().includes(value)
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
      lesson.innerHTML = "Lesson: " + term.topicLink
      glossaryExactMatch.append(item)
      glossaryExactMatchContainer.append(glossaryExactMatch)
    }
  })
})

// for each link with the class "search," listen for a click. If clicked, change the value of the search bar to the text of the link. Run input event.
// https://stackoverflow.com/questions/688196/how-to-use-a-link-to-call-javascript/688228#688228
// https://stackoverflow.com/questions/2856513/how-can-i-trigger-an-onchange-event-manually

var links = document.querySelectorAll(".search")
links.forEach(link => {
  link.addEventListener('click', () => {
    glossarySearchInput.value = link.innerText
    glossarySearchInput.dispatchEvent(inputEvent)
    return false
  })
})

// get data from JSON file

fetch("../json/glossary-terms.json")
  .then(res => res.json())
  .then(data => {
    data.sort((a, b) => (a.name > b.name) ? 1 : -1) // sort by name
    terms = data.map(term => {
      const item = glossaryTermTemplate.content.cloneNode(true).children[0]
      const header = item.querySelector("[term-header]")
      const body = item.querySelector("[term-body]")
      const lesson = item.querySelector("[term-lesson]")
      header.textContent = term.name
      body.textContent = term.definition
      lesson.innerHTML = "Lesson: " + term.topicLink
      glossaryTermsContainer.append(item)
      return { name : term.name, definition: term.definition, topic : term.topic, topicLink : term.topicLink, element : item}
    })
  })

fetch("../json/glossary-topics.json")
  .then(res => res.json())
  .then(data => {
    topics = data.map(topic => {
      const item = glossaryTermTemplate.content.cloneNode(true).children[0]
      const header = item.querySelector("[term-header]")
      const body = item.querySelector("[term-body]")
      const third = item.querySelector("[term-topic]")
      header.innerHTML = "<h2><a href=\""+ topic.link + "\">" + topic.name + "</a></h2>";

      let lessons = [];
      for (i=0; i < topic.lessons.length; i++) {
        lessons.push("<li><a href=\""+ topic.lessonLinks[i] + "\">" + topic.lessons[i] + "</a>")
      }
      lessons = lessons.join("")
      body.innerHTML = "<ul>" + lessons + "</ul>"


      
      glossaryByTopic.append(item)
      return { name : topic.name, link: topic.link, lesson : topic.lessons, lessonLinks : topic.lessonLinks, element : item}
    })
  })