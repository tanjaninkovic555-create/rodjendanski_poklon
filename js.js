let gameTimer;
let gameStartTime;
let moveCount=0;
let currentDifficulty='easy';
let puzzlePieces=[];
let completedPiecesCount = 0;
let currentPuzzleIndex = 0;
let currentSlideIndex=0;
let currentTrack=0;
let isPlaying=false;

function sakrijPrviBlok(){
    var prvi=document.getElementById('prviBlok');
    var drugi=document.getElementById('drugiBlok');

    prvi.style.opacity=0;

    setTimeout(function() {
        prvi.style.display='none';
        drugi.style.display='block';
        setTimeout(function() {
            drugi.style.opacity=1;
        },50);
    },700);
}
const videoList = [
    'video/video14.mp4',
    'video/video2.mp4',
    'video/video3.mp4',
    'video/video4.mp4',
    'video/video5.mp4',
    'video/video6.mp4',
    'video/video7.mp4',
    'video/video8.mp4',
    'video/video9.mp4',
    'video/video10.mp4',
    'video/video11.mp4',
    'video/video12.mp4',
    'video/video13.mp4',
    'video/video1.mp4',
    'video/video15.mp4',
    'video/video16.mp4',
    'video/video17.mp4',
    'video/video18.mp4',
    'video/video19.mp4',
    'video/video20.mp4',
    'video/video21.mp4',
    'video/video22.mp4',
    'video/video23.mp4',
    'video/video24.mp4',
    'video/video25.mp4',
    'video/video26.mp4',
    'video/video27.mp4',
    'video/video28.mp4',
    'video/video29.mp4',
    'video/video30.mp4',
    'video/video31.mp4',
    'video/video32.mp4',
    'video/video33.mp4',
];

const puzzleImages =[
    "images/OIG1.jpg",
    "images/OIG2.jpg",
    "images/OIG3.jpg",
    "images/OIG4.jpg",
    "images/OIG5.jpg",
    "images/OIG6.jpg",
];

function initializePuzzleGame(){
    changeDifficulty();
    startNewGame();
}

function changeDifficulty(){
    const select =document.getElementById('difficultySelect');
    if(!select) return;

    currentDifficulty=select.value;

    const puzzleBoard = document.getElementById('puzzleBoard');
    if(!puzzleBoard) return;

    let gridSize;

    switch(currentDifficulty){
        case 'easy':
            gridSize=3;
            break;
        case 'medium':
            gridSize=4;
            break;
        case 'hard':
            gridSize=5;
            break;
    }

    puzzleBoard.style.gridTemplateColumns=`repeat(${gridSize}, 1fr)`;
    puzzleBoard.style.width='300px';
    puzzleBoard.style.height='300px';
}

function startNewGame(){
    clearInterval(gameTimer);
    gameStartTime=Date.now();
    moveCount=0;
    updateGameStats();

    generatePuzzle(puzzleImages[currentPuzzleIndex]);
    shufflePuzzle();
    startGameTimer();

    const gameCompletion=document.getElementById('gameCompletion');
    if(gameCompletion){
        gameCompletion.style.display='none';
    }

    const cakeBtn = document.getElementById('cakeBtn');
    if(cakeBtn) cakeBtn.style.display='none';

    const piecesCompletedEl = document.getElementById('piecesCompleted');
    if (piecesCompletedEl) piecesCompletedEl.textContent = `${completedPiecesCount} / 6`;
}

function generatePuzzle(imageUrl){
    const puzzleBoard=document.getElementById('puzzleBoard');
    if(!puzzleBoard) return;

    const gridSize=currentDifficulty==='easy' ? 3 : currentDifficulty==='medium' ? 4:5;
    const totalPieces=gridSize*gridSize;

    puzzleBoard.innerHTML='';
    puzzlePieces=[];

    const solutionImage=document.getElementById('solutionImage');
    if(solutionImage) solutionImage.src=imageUrl;

    for(let i=0;i<totalPieces;i++)
    {
        const piece = document.createElement('div');
        piece.className='puzzle-piece';
        piece.dataset.position=i;
        piece.dataset.correctPosition=i;

        const row = Math.floor(i/gridSize);
        const col=i%gridSize;
        const bgPosX=(col/(gridSize -1))*100;
        const bgPosY=(row/(gridSize-1))*100;

        piece.style.backgroundImage=`url(${imageUrl})`;
        piece.style.backgroundPosition=`${bgPosX}% ${bgPosY}%`;
        piece.style.backgroundSize=`${gridSize*100}%`;

        piece.draggable=true;
        piece.addEventListener('dragstart',handleDragStart);
        piece.addEventListener('dragover',handleDragOver);
        piece.addEventListener('drop',handleDrop);
        piece.addEventListener('dragend',handleDragEnd);

        puzzleBoard.appendChild(piece);
        puzzlePieces.push(piece);
        enableTouchForPuzzle(piece);
    }
}

function shufflePuzzle(){
    const puzzleBoard=document.getElementById('puzzleBoard');
    if(!puzzleBoard) return;

    const pieces=Array.from(puzzlePieces);

    for(let i=pieces.length-1;i>0;i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        [pieces[i],pieces[j]]=[pieces[j],pieces[i]];
    }

    pieces.forEach((piece,index) =>{
        piece.dataset.position=index;
        puzzleBoard.appendChild(piece);
    });
}

let draggedElement=null;

function handleDragStart(e){
    draggedElement=e.target;
    e.target.classList.add('dragging');
}

function handleDragOver(e){
    e.preventDefault();
}

function handleDrop(e){
    e.preventDefault();

    if(draggedElement && e.target !== draggedElement && e.target.classList.contains('puzzle-piece')){
        const draggedPosition = draggedElement.dataset.position;
        const targetPosition =e.target.dataset.position;

        draggedElement.dataset.position=targetPosition;
        e.target.dataset.position=draggedPosition;

        const parent= draggedElement.parentNode;
        const nextSibling=draggedElement.nextSibling===e.target ? draggedElement : draggedElement.nextSibling;

        parent.insertBefore(draggedElement,e.target.nextSibling);
        parent.insertBefore(e.target,nextSibling);

        moveCount++;
        updateGameStats();
        checkPuzzleCompletion();
        updateCompletedPieces();
    }
}

function handleDragEnd(e){
    e.target.classList.remove('dragging');
    draggedElement=null;
}

function updateCompletedPieces() {
    const piecesCompletedEl = document.getElementById('piecesCompleted');
    const isCurrentPuzzleComplete = puzzlePieces.every(piece => piece.dataset.position === piece.dataset.correctPosition);
    
    if(piecesCompletedEl)
    {
        piecesCompletedEl.textContent=`${completedPiecesCount} / 6`;
    }

    if(isCurrentPuzzleComplete)
    {
        completedPiecesCount++;
        
        const completionDiv = document.getElementById('gameCompletion');
        const cakeBtn = document.getElementById('cakeBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');

        if(completionDiv){
            completionDiv.style.display = 'flex'; // pokaži blok čestitke
        }

        if(currentPuzzleIndex<puzzleImages.length-1)
        {
            if(playAgainBtn) playAgainBtn.style.display = 'inline-block';
            if(cakeBtn) cakeBtn.style.display = 'none';
        }else{
           if(playAgainBtn) playAgainBtn.style.display = 'none';
            if(cakeBtn) cakeBtn.style.display = 'inline-block';
        }
        currentPuzzleIndex++;
    }
}

function checkPuzzleCompletion(){
    const isComplete = puzzlePieces.every(piece => piece.dataset.position===piece.dataset.correctPosition);

    if(isComplete)
    {
        clearInterval(gameTimer);
        showCompletionMessage();
    }
}

function showCompletionMessage(){
    const completionDiv=document.getElementById('gameCompletion');
    const finalTime=document.getElementById('finalTime');
    const finalMoves=document.getElementById('finalMoves');

    if(!completionDiv || !finalTime || !finalMoves) return;

    const timeElipsed =Math.floor((Date.now()-gameStartTime)/1000);
    const minutes=Math.floor(timeElipsed/60);
    const seconds =timeElipsed%60;

    finalTime.textContent=`${minutes}:${seconds.toString().padStart(2, '0')}`;
    finalMoves.textContent=moveCount;

    completionDiv.style.display='flex';
    pokreniKonfete();
}

function showSolution(){
    puzzlePieces.sort((a,b) => a.dataset.correctPosition - b.dataset.correctPosition);

    const puzzleBoard=document.getElementById('puzzleBoard');
    if(!puzzleBoard) return;

    puzzlePieces.forEach((piece, index) =>{
        piece.dataset.position=index;
        puzzleBoard.appendChild(piece);
    });
}

function startGameTimer(){
    gameTimer=setInterval(() =>{
        const timeElipsed = Math.floor((Date.now()-gameStartTime)/1000);
        const minutes=Math.floor(timeElipsed/60);
        const seconds =timeElipsed%60;
        const gameTimerElement = document.getElementById('gameTimer');
        if(gameTimerElement){
            gameTimerElement.textContent=`${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    },1000);
}

function updateGameStats(){
    const moveCounter=document.getElementById('moveCounter');
    if(moveCounter)
    {
        moveCounter.textContent=moveCount;
    }
}

document.addEventListener('DOMContentLoaded',function(){
    initializePuzzleGame();
    initializeNavigation();
    initializeEventListeners();
    initializeGalleryLightbox();
    initializeMusicPlayer();

    const celebrateBtn = document.getElementById('celebrateBtn');
    if(celebrateBtn){
        celebrateBtn.addEventListener('click', celebrateNow);
        celebrateBtn.addEventListener('touchend', celebrateNow);
    }

    const videoBtn = document.getElementById('videoBtn');
    if(videoBtn) {
        const videoHandler = () => {
            stopBackgroundMusic();
            const galleryGrid = document.getElementById('galleryGrid');
            const gallerySlideshow = document.getElementById('gallerySlideshow');

            if(galleryGrid) galleryGrid.style.display = 'none';
            if(gallerySlideshow) gallerySlideshow.style.display = 'block';

            generateVideoSlides();

            const firstSlide = document.querySelector('#gallerySlideshow .slide');
            if(firstSlide){
                const firstVideo = firstSlide.querySelector('video');
                if(firstVideo) firstVideo.play();
            }
        };

        videoBtn.addEventListener('click', videoHandler);
        videoBtn.addEventListener('touchend', videoHandler);
    }

    const imagesBtn = document.getElementById('slikeBtn');
    if(imagesBtn){
        const imagesHandler = () => {
            const galleryGrid = document.getElementById('galleryGrid');
            const gallerySlideshow = document.getElementById('gallerySlideshow');

            if(galleryGrid) galleryGrid.style.display = 'grid';
            if(gallerySlideshow) gallerySlideshow.style.display = 'none';

            const slides = document.querySelectorAll('#gallerySlideshow .slide video');
            slides.forEach(video => {
                video.pause();
                video.currentTime = 0;
            });

            const music = document.getElementById('bgMusic');
            if (music && music.paused) {
                music.play().catch(() => {});
            }
        };
        imagesBtn.addEventListener('click', imagesHandler);
        imagesBtn.addEventListener('touchend', imagesHandler);
    }

    const pismoSrce = document.getElementById("pismoSrce");
    const pismoBlok = document.getElementById("letter");
    const noviBlok = document.getElementById("noviBlok");

    if(pismoSrce){
        const pismoHandler = () => {
            const heartWrap = document.getElementById("heartWrap");
            heartWrap.innerHTML = ""; 
            const pismoTekst = document.querySelector(".pismoTekst");
            pismoTekst.innerHTML = "<h2>Novi sadržaj 💖</h2><p>Ovo je novi blok koji se pojavi</p>";
        };

        pismoSrce.addEventListener("click", pismoHandler);
        pismoSrce.addEventListener("touchend", pismoHandler);
    }

    // Dugme za puštanje muzike
const muzikaBtn = document.getElementById('muzikaBtn');
if(muzikaBtn){
    const playMusic = () => {
        const music = document.getElementById('bgMusic');
        if(music){
            music.currentTime = 0;
            music.play().catch(err => console.log("Muzika nije mogla da se pusti:", err));
        }
    };
    muzikaBtn.addEventListener('click', playMusic);
    muzikaBtn.addEventListener('touchend', playMusic);
}

// Dugme za mikrofon
const micBtn = document.getElementById('micBtn');
if(micBtn){
    const micHandler = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 256;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const checkBlow = () => {
                analyser.getByteFrequencyData(dataArray);
                const sum = dataArray.reduce((a,b) => a+b, 0);
                if(sum > 5000){
                    blowOutCandles();
                    return;
                }
                requestAnimationFrame(checkBlow);
            }
            checkBlow();
        } catch(err) {
            console.log("Greška pri pristupu mikrofonu:", err);
        }
    };
    micBtn.addEventListener('click', micHandler);
    micBtn.addEventListener('touchend', micHandler);
}

});

function pokreniKonfete() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1fbcd1ff', '#1d61c0ff', '#0a3284ff', '#035293ff', '#2188b4ff', '#1bc4eeff']
    });
}

function showCakeButton() {
    const cakeBtn = document.getElementById('cakeBtn');
    if(cakeBtn) cakeBtn.style.display = 'inline-block';
    
    const playAgainBtn = document.getElementById('playAgainBtn');
    if(playAgainBtn) playAgainBtn.style.display = 'none';
}

function showSurprise(){
    const drugiBlok = document.getElementById('drugiBlok');
    const gameCompletion = document.getElementById('gameCompletion');
    if(drugiBlok) drugiBlok.style.display = 'none';
    if(gameCompletion) gameCompletion.style.display = 'none';

    const treciBlok = document.getElementById('treciBlok');
    if(treciBlok) treciBlok.style.display = 'block';
}

function blowOutCandles() {
    document.querySelectorAll('.flame').forEach(f => f.style.display = 'none');
    pokreniKonfete();
    

    const prviBlok = document.getElementById('prviBlok');
    const drugiBlok = document.getElementById('drugiBlok');
    const treciBlok = document.getElementById('treciBlok');
    const naslov = document.getElementById('naslov');

    setTimeout(() => {
    if(prviBlok) prviBlok.style.display = 'none';
    if(drugiBlok) drugiBlok.style.display = 'none';
    if(treciBlok) treciBlok.style.display = 'none';
    if(naslov) naslov.style.display = 'none';

    // prikaži navbar
    const navbar = document.getElementById('navbar');
    if(navbar) navbar.style.display = 'flex';
    const hero=document.getElementById('home');
    if(hero) hero.style.display='flex'
    const galleryBlok=document.getElementById('gallery');
    if(galleryBlok) galleryBlok.style.display='';
    const musicBlok=document.getElementById('music');
    if(musicBlok) musicBlok.style.display='flex';
    const pismoBlok=document.getElementById('letter');
    if(pismoBlok) pismoBlok.style.display='block';
    window.scrollTo({ top: 0, behavior: 'auto' });
     }, 1500);
}

function initializeNavigation(){
    const navToggle=document.getElementById('navToggle');
    const navMenu=document.getElementById('navMenu');
    const navLinks=document.querySelectorAll('.nav-link');

    if(navToggle && navMenu)
    {
        navToggle.addEventListener('click',function(){
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    navLinks.forEach(link =>{
        link.addEventListener('click',function(){
            if(navMenu) navMenu.classList.remove('active');
            if(navToggle) navToggle.classList.remove('active');
        });
    });

    window.addEventListener('scroll',function(){
        const navbar=this.document.getElementById('navbar');
        if(navbar)
        {
            if(this.window.scrollY>100)
            {
                navbar.style.background='rgba(255,255,255,0.98)';
                navbar.style.backdropFilter='blur(20px)';
            } else{
                navbar.style.background='rgba(255,255,255,0.95)';
                navbar.style.backdropFilter='blur(10px)';
            }
        }
    });

    navLinks.forEach(link =>{
        link.addEventListener('click',function(e){
            e.preventDefault();
            const targetId=this.getAttribute('href');
            const targetSection=document.querySelector(targetId);

            if(targetSection)
            {
                const offsetTop=targetSection.offsetTop-80;
                window.scrollTo({
                    top: offsetTop,
                    behavior:'smooth'
                });
            }
        });
    });
}

function initializeEventListeners(){
    const celebrateBtn=document.getElementById('celebrateBtn');
    if(celebrateBtn)
    {
        celebrateBtn.addEventListener('click',celebrateNow);
    }

    const slideShowViewBtn=document.getElementById('slideShowBtn');
    if(slideShowViewBtn)
    {
        slideShowViewBtn.addEventListener('click',() => changeView('slideshow'));
    }

    const prevSlideBtn=document.getElementById('prevSlideBtn');
    const nextSlideBtn=document.getElementById('nextSlideBtn');

    if(prevSlideBtn)
    {
        prevSlideBtn.addEventListener('click',() => changeSlide(-1));
    }
    if(nextSlideBtn)
    {
        nextSlideBtn.addEventListener('click',() => changeSlide(1));
    }

    const difficultySelect = document.getElementById('difficultySelect');
    const newGameBtn = document.getElementById('newGameBtn');
    const showSolutionBtn = document.getElementById('showSolutionBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');

    if(difficultySelect){
        difficultySelect.addEventListener('change',changeDifficulty);
    }
    if(newGameBtn){
        newGameBtn.addEventListener('click',startNewGame);
    }
    if(showSolutionBtn){
        showSolutionBtn.addEventListener('click',showSolution);
    }
    if(playAgainBtn){
        playAgainBtn.addEventListener('click',startNewGame)
    }

    const indicators=document.querySelectorAll('.indicator');
    indicators.forEach((indicator,index) =>{
        indicator.addEventListener('click',() => jumpToSlide(index));
    });
}

function celebrateNow(){
    pokreniKonfete();

    const gallerySection=document.getElementById('gallery');
    if(gallerySection){
        const offsetTop=gallerySection.offsetTop-80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function initializeGalleryLightbox(){
    const items = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');

    items.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // zabrani scroll
        });
    });

    function closeLightbox(){
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) closeLightbox();
    });
}

function changeView(viewType){
    const gridView = document.getElementById('galleryGrid');
    const slideshowView = document.getElementById('gallerySlideshow');

    if(!gridView || !slideshowView) return;

    if(viewType=='grid')
    {
        gridView.style.display='grid';
        slideshowView.style.display='none';
    }else if(viewType=='slideshow'){
        gridView.style.display='none';
        slideshowView.style.display='block';
        startSlideShow();
    }
}

function changeSlide(direction){
    stopBackgroundMusic();
    const slides=document.querySelectorAll('.slide');
    const indicators=document.querySelectorAll('.indicator');

    if(slides.length===0) return;

    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');

    currentSlideIndex+=direction;

    if(currentSlideIndex>=slides.length){
        currentSlideIndex=0;
    }else if(currentSlideIndex<0){
        currentSlideIndex=slides.length-1;
    }

    // Zaustavi sve videe
    slides.forEach(slide => {
        const video = slide.querySelector('video');
        if(video){
            video.pause();
            video.currentTime = 0;
        }
    });

    // Pusti video trenutnog slajda
    const currentVideo = slides[currentSlideIndex].querySelector('video');
    if(currentVideo) currentVideo.play();


    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function jumpToSlide(slideIndex){
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    if(slides.length === 0) return;

    // Pauziraj sve videe
    slides.forEach(slide => {
        const video = slide.querySelector('video');
        if(video) video.pause();
    });

    // Ukloni aktivnu klasu sa trenutnog slajda i indikatora
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');

    // Postavi novi slajd
    currentSlideIndex = slideIndex;

    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');

    // Pusti video na novom slajdu
    const currentVideo = slides[currentSlideIndex].querySelector('video');
    if(currentVideo) currentVideo.play();
}


let slideshowInterval;

function startSlideShow(){
    const slides = document.querySelectorAll('.slide');
    if(slides.length === 0) return;

    // Pusti video u prvom slajdu
    const firstVideo = slides[0].querySelector('video');
    if(firstVideo) firstVideo.play();

    // Očisti prethodni interval ako postoji
    if(slideshowInterval) clearInterval(slideshowInterval);

    // Pokreni automatsko mijenjanje slajdova svakih 5 sekundi
    slideshowInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // svaka 5 sekundi
}


function generateVideoSlides() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    const indicatorsContainer = document.querySelector('.slide-indicator');

    if(!slideshowContainer || !indicatorsContainer) return;

    slideshowContainer.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    videoList.forEach((src, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        if(index === 0) slideDiv.classList.add('active');

        const videoEl = document.createElement('video');
        videoEl.src = src;
        videoEl.controls = true;
        videoEl.playsInline = true;
        videoEl.muted = false;


        videoEl.addEventListener('play', () => {
            stopBackgroundMusic();
        });

        slideDiv.appendChild(videoEl);

        slideshowContainer.appendChild(slideDiv);

        // Dodaj indikator
        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        if(index === 0) indicator.classList.add('active');
        indicator.dataset.slide = index;
        indicator.addEventListener('click', () => jumpToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    currentSlideIndex = 0; // resetuj indeks
}

function stopBackgroundMusic() {
    const music = document.getElementById('bgMusic');
    if (music && !music.paused) {
        music.pause();
    }
}

const audioTracks=[
    {
        title:"Šuti moj dječače plavi",
        artist:"Novi fosili",
        duration:"3:19",
        src:"audio/playlist/pjesma1.mp3"
    },
    {
        title:"Bigmouth Strikes Again",
        artist:"The Smiths",
        duration:"3:13",
        src:"audio/playlist/pjesma2.mp3"
    },
    {
        title:"Jenny Jenny",
        artist: "TuttoneJJ",
        duration:"3:46",
        src:"audio/playlist/pjesma3.mp3"
    },
    {
        title:"Euforija",
        artist:"Buč Kesedi",
        duration:"2:53",
        src:"audio/playlist/pjesma4.mp3"
    },
    {
        title:"Tamo gdje ljubav počinje",
        artist:"Crvena jabuka",
        duration:"5:34",
        src:"audio/playlist/pjesma5.mp3"
    },
    {
        title:"Poker u dvoje",
        artist:"Nataša Bekvalac",
        duration:"3:04",
        src:"audio/playlist/pjesma6.mp3"
    },
    {
        title:"E moj Saša",
        artist:"Novi fosili",
        duration:"4:10",
        src:"audio/playlist/pjesma7.mp3"
    },
    {
        title:"Cesarica",
        artist:"Oliver Dragojević",
        duration:"4:16",
        src:"audio/playlist/pjesma8.mp3"
    }
];

const audioPlayer=document.getElementById('audioPlayer');
const playPauseBtn=document.getElementById('playPauseBtn');
const progressBar=document.getElementById('progress');
const currentTimeDisplay=document.getElementById('currentTime');
const durationDisplay=document.getElementById('duration');
const volumeSlider=document.getElementById('volumeSlider');
const vinylRecord=document.getElementById('vinylRecord');

function initializeMusicPlayer(){
    audioPlayer.src = audioTracks[currentTrack].src;
    updateTrackDisplay();
    durationDisplay.textContent = audioTracks[currentTrack].duration;

    playPauseBtn.addEventListener('click', togglePlay);
    volumeSlider.addEventListener('input', changeVolume);
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('ended', nextTrack);

    document.getElementById('prevTrackBtn').addEventListener('click', previousTrack);
    document.getElementById('nextTrackBtn').addEventListener('click', nextTrack);

    document.querySelector('.progress-bar').addEventListener('click', seek);

    document.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', () => {
            selectTrack(parseInt(item.dataset.track));
        });
    });
}

function togglePlay(){
    stopAndForgetBackgroundMusic();
    if(audioPlayer.paused){
        audioPlayer.play();
        playPauseBtn.textContent = '⏸️';
        vinylRecord.classList.add('playing');
        isPlaying = true;
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶️';
        vinylRecord.classList.remove('playing');
        isPlaying = false;
    }
}


function previousTrack(){
    currentTrack=currentTrack > 0 ? currentTrack - 1 : audioTracks.length - 1;
    switchTrack();
}

function nextTrack(){
    currentTrack=currentTrack < audioTracks.length - 1 ? currentTrack + 1 : 0;
    switchTrack();
}

function selectTrack(trackIndex){
    stopAndForgetBackgroundMusic();
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => item.classList.remove('active'));

    if(playlistItems[trackIndex]){
        playlistItems[trackIndex].classList.add('active');
    }

    currentTrack=trackIndex;
    switchTrack();
}

function switchTrack(){
    stopAndForgetBackgroundMusic();
    audioPlayer.src = audioTracks[currentTrack].src;
    audioPlayer.currentTime = 0;
    updateTrackDisplay();
    durationDisplay.textContent = audioTracks[currentTrack].duration;

    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentTrack);
    });

    if(isPlaying){
        audioPlayer.play();
    }
}


function updateTrackDisplay(){
    const track=audioTracks[currentTrack];
    const trackTitle=document.getElementById('trackTitle');
    const trackArtist=document.getElementById('trackArtist');

    if(trackTitle) trackTitle.textContent=track.title;
    if(trackArtist) trackArtist.textContent=track.artist;
}

function changeVolume(){
    audioPlayer.volume = volumeSlider.value / 100;
}


function seek(e){
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;

    audioPlayer.currentTime = (clickX / width) * duration;
}


function updateProgressBar(){
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = progressPercent + '%';

    const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
    const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
    currentTimeDisplay.textContent =
        `${currentMinutes}:${currentSeconds.toString().padStart(2,'0')}`;
}

function stopAndForgetBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (!bgMusic) return;

    bgMusic.pause();
    bgMusic.currentTime = 0;

    // ukloni src da se nikad više ne pusti
    bgMusic.src = '';
}
function enableTouchForPuzzle(piece) {
    let touchMoved = false;

    piece.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchMoved = false;

        // isto kao mouse drag
        draggedElement = piece;
        piece.classList.add('dragging');
    });

    piece.addEventListener('touchmove', (e) => {
        e.preventDefault();
        touchMoved = true;
    });

    piece.addEventListener('touchend', (e) => {
        e.preventDefault();

        if (!draggedElement) return;

        const touch = e.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);

        // simuliraj drop koristeći POSTOJEĆU logiku
        if (
            touchMoved &&
            target &&
            target.classList.contains('puzzle-piece') &&
            target !== draggedElement
        ) {
            handleDrop({ 
                preventDefault: () => {}, 
                target 
            });
        }

        piece.classList.remove('dragging');
        draggedElement = null;
    });
}
