const socket = io("http://localhost:5000");

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const allUsers = document.querySelector('.users'); // Ensure this is a valid container in your HTML

const mp3 = new Audio('mp3.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    if (position === 'left') {
        mp3.play();  // Play sound when receiving a message
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You → ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

const name = prompt('Enter your name...');

socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    append(`${name} → joined`, 'left'); // Show that the user joined

    // Update user list
    const userElement = document.createElement('span');
    userElement.innerText = name;
    allUsers.appendChild(userElement);
    userElement.classList.add('user-span')
});

socket.on('recieve', data => {
    append(`${data.message} → ${data.name}`, 'left');
});

socket.on('user-left', name => {
    append(`${name} → left`, 'left');

    // Optionally remove the user from the list
    const userElements = allUsers.children;
    for (let userElement of userElements) {
        if (userElement.innerText === name) {
            allUsers.removeChild(userElement);
            break;
        }
    }
});
