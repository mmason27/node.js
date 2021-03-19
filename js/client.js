const chatMessageTextBox = document.getElementById("chatMessageTextBox");
const chatnameTextBox = document.getElementById("chatnameTextBox");
const sendButton = document.getElementById("sendButton");
const chatMessagesDisplay = document.getElementById("chatMessagesDisplay");

sendButton.addEventListener('click', () => {
    const chatname = chatnameTextBox.value;
    const chatMessage = chatMessageTextBox.value;

    socket.emit('Houston', {chatname: chatname, message: chatMessage});
})

socket.on('Houston', (chat) => {
    const messageItem = `<div>${chat.chatname}: ${chat.message}</div>`;
    chatMessagesDisplay.insertAdjacentHTML('beforeend', messageItem);
})