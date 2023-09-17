let video = document.getElementById('video');
let videoMic = document.createElement('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const list = document.getElementById('list');

let index = localStorage.getItem('video-index') ?? 0;
let videos = [
    './media/exemplu.mp4',
    './media/sample-5s.mp4',
    './media/sample-mp4-file-small.mp4',
    './media/video_preview_h264.mp4'
];

let W;
let H;
let display = false;
let handler_ti;

function initVariables() {
   
    for (let i = 0; i < videos.length; i++) {
        insertVideo(videos[i], i);
    }
  
    if(index > videos.length - 1 || index < 0)
        index = 0;
    video.src = videos[index];
    video.type = 'video/mp4';
    video.currentTime = localStorage.getItem('video-time') ?? 0;
    video.volume = localStorage.getItem('video-volume') ?? 0;
}

function shuffleOrder() {
    let newVideos = videos.sort(() => Math.random() - 0.8);
    videos = newVideos;
    list.innerHTML = '<p class="text-primary" style="font-size: 15pt; text-decoration: underline">Current videos</p>';
    for (let i = 0; i < videos.length; i++) {
        insertVideo(videos[i], i);
    }
}

function addEvents() {
    document.getElementById("shuffle").addEventListener('click', () => shuffleOrder());
    canvas.addEventListener('click', function () {
        handler_ti = setTimeout(displayVideo, 1);
    });

    video.addEventListener('loadedmetadata', function () {
        canvas.width = 933;
        canvas.height = 457;
        W = canvas.width;
        H = canvas.height;
    });

    video.addEventListener('pause', function () {
        cancelAnimationFrame(handler_ti);
    });

    canvas.addEventListener('click', (e) => {
        let pointX = e.clientX - canvas.getBoundingClientRect().left;
        let pointY = e.clientY - canvas.getBoundingClientRect().top;

        function fillProgressBar() {
            if (video.duration && pointX >= 7 && pointX <= 7 + W - 14 && pointY >= H - 31 && pointY <= H - 31 + 12) {
                const pos = (pointX - 7) / (W - 14);
                video.currentTime = pos * video.duration;
            }
        }
        fillProgressBar();

        function fillVolumeBar() {
            if (pointX >= W / 2 + 339 && pointX <= W / 2 + 439 && pointY >= H - 75 && pointY <= H - 63) {
                const volume = (pointX - W / 2 - 339) / 100;
                video.volume = volume;
            }
        }
        fillVolumeBar();

        if (W / 2 - 407 <= pointX && pointX <= W / 2 - 407 + W / 31 && H - 80 <= pointY && pointY <= H - 80 + 31) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
        if (W / 2 - 429 - H / 20 <= pointX && pointX <= W / 2 - 409 - H / 20 && H - 80 <= pointY && pointY <= H - 55) {
            previousVideo();
        }
        if (W / 2 - 368 - H / 20 <= pointX && pointX <= W / 2 - 328 - H / 20 && H - 80 <= pointY && pointY <= H - 55) {
            nextVideo();
        }
    });

    if (video.src !== null) {
        video.addEventListener('ended', nextVideo);
    }
    canvas.addEventListener('mouseenter', (e) => (display = true));
    canvas.addEventListener('mouseleave', (e) => (display = false));

}


initVariables();
addEvents();

function displayVideo() {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    displayControls();
    localStorage.setItem('video-volume', video.volume);
    localStorage.setItem('video-index', index);
    localStorage.setItem('video-time', video.currentTime);
    handler_ti = setTimeout(displayVideo, 1);
}


function displayControls() {
    if (display == false) return;

    let position = 0;
    let volume = 0.5;
    if (video.currentTime && video.duration) {
        position = video.currentTime / video.duration;
        volume = video.volume;
    }
    let backStart = W / 2 - 429;
    let forwardStart = W / 2 - 368;
    let buttonTop = H - 55;
    let buttonBottom = H - 75;

    context.fillStyle = `rgb(199,166,214)`;
    context.strokeStyle = `rgb(199,133,234)`;
    context.fillRect(W / 2 + 339, buttonBottom, 100 * volume, 12);
    context.strokeRect(W / 2 + 339, H - 75, 100, 12);

    context.fillRect(7, H - 31, (W - 14) * position, 12);
    context.strokeRect(7, H - 31, W - 14, 12);

    context.beginPath();
    context.moveTo(backStart, buttonBottom);
    context.lineTo(backStart, buttonTop);
    context.lineTo(backStart - H / 20, buttonBottom + 10);
    context.closePath();
    context.fill();


    context.beginPath();
    context.moveTo(forwardStart, buttonBottom);
    context.lineTo(forwardStart, buttonTop);
    context.lineTo(forwardStart + H / 20, buttonBottom + 10);
    context.closePath();
    context.fill();

    let playX = W / 2 - 407;
    let playHeight = H - 80;

    if (video.paused) {
      
        context.beginPath();
        context.moveTo(playX, playHeight);
        context.lineTo(playX, H - 50);
        context.lineTo(playX + H / 20, H - 65);
        context.closePath();
        context.fill();
    } else {
        
        context.fillRect(playX, playHeight, W / 108 - 2, 31);
        context.fillRect(playX + 12, playHeight, W / 108 - 2, 31);
    }
}

function nextVideo() {
    if (index < videos.length - 1) {
        loadCertainVideo(++index);
    } else {
        index = 0;
        loadCertainVideo(index);
    }
}

function previousVideo() {
    if (index > 0) {
        loadCertainVideo(--index);
    } else {
        index = videos.length - 1;
        loadCertainVideo(index);
    }
}

function loadCertainVideo(index) {
    videoMic.src = videos[index];
    videoMic.load();
    videoMic.play();
    video = videoMic;
    video.addEventListener('ended', nextVideo);
    onIndexChange(index);
}


function insertVideo(title, indexList) {
    let titleArray = title.split('\\');
    let splitTitleArray = titleArray[titleArray.length - 1].split('/');
    let fullFilename = splitTitleArray[splitTitleArray.length - 1];
    list.innerHTML += `<p>${fullFilename}</p>`;
    addClickEvents();
}

function addClickEvents() {
    list.querySelectorAll('p').forEach((p, i) => {
        p.addEventListener('click', (e) => {
            index = i-1;
            onIndexChange(index);
            video.src = videos[index];
            video.load();
            video.play();
        });
        p.addEventListener('contextmenu', function (ev) {
            ev.preventDefault();
            const current = list.childNodes[i + 2]
            if (current)
                list.removeChild(current);
            return false;
        }, false);
    })

}

function onIndexChange(index) {
    let paragrafe = list.querySelectorAll('p');
    paragrafe.forEach((p, i) => {
        paragrafe[i].classList.remove('selectat');
    })
    paragrafe[index + 1].classList.add('selectat');
}