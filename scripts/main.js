
/*
let myHeading = document.querySelector('h1');
myHeading.textContent = 'Hello world!';

function multiply(num1,num2) {
    let result = num1 * num2;
    return result;
}
alert(multiply(4,7));
document.querySelector('html').onclick = function() {
    alert('Ouch! Stop poking me!');
}
*/

let myImage = document.querySelector('img');

myImage.onclick = function() {
    let mySrc = myImage.getAttribute('src');
    if(mySrc === 'https://panels.twitch.tv/panel-666973030-image-1c9e4a69-a54a-4a95-a07d-1a113ec0a0d1') {
    myImage.setAttribute ('src','https://static-cdn.jtvnw.net/jtv_user_pictures/b3125729-52b2-4b7a-9774-bdfa54ccd493-profile_image-70x70.png');
    } else {
    myImage.setAttribute ('src','https://panels.twitch.tv/panel-666973030-image-1c9e4a69-a54a-4a95-a07d-1a113ec0a0d1');
    }
}

let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

function setUserName() {
    let myName = prompt('Please enter your name.');
    if(!myName || myName === null) {
        setUserName();
    } 
    else {
        localStorage.setItem('name', myName);
        myHeading.innerHTML = 'Mozilla is cool, ' + myName;
    }
}

if(!localStorage.getItem('name')) {
    setUserName();
} 
else {
    let storedName = localStorage.getItem('name');
    myHeading.textContent = 'Mozilla is cool, ' + storedName;
}


myButton.onclick = function() {
    setUserName();
}
