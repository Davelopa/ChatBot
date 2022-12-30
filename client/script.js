// Import image files for user and bot profile images
import bot from './assets/bot.svg'
import user from './assets/user.svg'

// Select form and chat container elements from the DOM
const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

// Declare variable for loading indicator interval
let loadInterval;

// Function to display loading indicator by adding and removing dots in the element passed as an argument
function loader(element) {
  // Clear element's text content
  element.textContent = '';

  // Set interval to add a dot every 300ms
  loadInterval = setInterval(() => {
    element.textContent += '.';

    // If 4 dots have been added, clear them and start over
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}

// Function to simulate typing of text in the element passed as an argument
function typeText(element, text) {
  let i = 0;

  // Set interval to add a character from the text every 20ms
  let typeInterval = setInterval(() => {
    // If all characters have been added, stop the interval
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
    }
  }, 20)
}

// Function to generate a unique ID based on the current timestamp and a random number
function generateUniqueID() {
  const timestamp = Date.now()
  const random = Math.random()
  const hexString = random.toString(16)

  return `id-${timestamp}-${hexString}`
}

// Function to generate a chat stripe element (a chat bubble containing a message and a profile image)
function chatStripe (isAI, value, uniqueId) {
  return(
    `
    <div class="wrapper ${isAI && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src="${isAI ? bot : user}"
            alt="${isAI ? 'bot' : 'user'}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `
  )
}

// Function to handle form submission or enter key press
const handleSubmit = async (e) => {
  // Prevent default form submission behavior
  e.preventDefault();

  // Get user's message from the form
  const data = new FormData(form);

  // User's chatstripe
  // Display user's message in the chat interface
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  // Reset form
  form.reset();

  // AI's chatstripe
  // Display loading indicator in the chat interface
  const uniqueId = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // Scroll chat interface to the bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Get reference to loading indicator element
  const messageDiv = document.getElementById(uniqueId);

  // Display loading indicator
  loader(messageDiv);

  // Fetch data from server
  // Send user's message to the server using an HTTP POST request
  const response = await fetch('https://chatbot-mb3o.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  
  // Clear loading indicator
  clearInterval(loadInterval);
  // Clear message element
  messageDiv.innerHTML = '';
  
  // If the server responds with a success status code
  if(response.ok) {
    // Get response data and parse it
    const data = await response.json();
    const parsedData = data.bot.trim();
  
    // Display response in the chat interface
    typeText(messageDiv, parsedData);
  } else {
    // If the server responds with an error, display error message and log error to the console
    const err = await response.text()
  
    messageDiv.innerHTML = "Something went wrong"
  
    alert(err)
    console.log(err);
  }

}

// Add event listener for form submission
form.addEventListener('submit', handleSubmit);
// Add event listener for keyup event on form
form.addEventListener('keyup', (e) => {
  // If the key pressed was the enter key
  if (e.keyCode === 13) {
    // Call handleSubmit function
    handleSubmit(e)
  }
});