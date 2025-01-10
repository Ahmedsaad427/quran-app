let audio = document.querySelector('.quranPlayer'),
    surahsContainer = document.querySelector('.surahs'),
    ayah = document.querySelector('.ayah'),
    reciterNameContainer = document.querySelector('.reciter-name'),
    next = document.querySelector('.next'),
    prev = document.querySelector('.prev'),
    play = document.querySelector('.play'),
    surahDetails = document.querySelector('.surah-details'),
    skipBackward = document.querySelector('.skip-backward'),
    skipForward = document.querySelector('.skip-forward');

let surahs = [];
let currentSurahIndex = 0;

getSurahs();

function getSurahs() {
    fetch('https://quran-endpoint.vercel.app/quran')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Surahs');
            }
            return response.json();
        })
        .then(data => {
            surahs = data.data;
            populateSurahs();
        })
        .catch(error => {
            console.error(error);
            Swal.fire('Error', error.message, 'error');
        });
}

function populateSurahs() {
    surahsContainer.innerHTML = '';
    surahs.forEach(surah => {
        const surahItem = document.createElement('div');
        surahItem.className = 'surah';
        surahItem.textContent = `${surah.number}. ${surah.asma.ar.long}`;
        surahItem.setAttribute('data-index', surah.number - 1);
        surahsContainer.appendChild(surahItem);
    });

    document.querySelectorAll('.surah').forEach(item => {
        item.addEventListener('click', function () {
            currentSurahIndex = parseInt(this.getAttribute('data-index'));
            playSurah(currentSurahIndex);
        });
    });
}

function playSurah(index) {
    if (index >= 0 && index < surahs.length) {
        const selectedSurah = surahs[index];
        audio.src = selectedSurah.recitation.full;
        audio.play();
        ayah.textContent = `${selectedSurah.number}. ${selectedSurah.asma.ar.long}`;
        play.querySelector('i').className = 'fas fa-pause';

        displayReciterName(selectedSurah);

        displaySurahDetails(selectedSurah);

        audio.onended = function() {
            Swal.fire({
                title: "Surah Completed!",
                icon: "success",
                text: "لقد تم الاستماع بنجاح",
                draggable: true
            });
        };
    } else {
        Swal.fire('Error', 'Surah not available', 'error');
    }
}

function displayReciterName(surah) {
    const reciterName = surah.recitation.name || "احمد بن علي العجمي";
    reciterNameContainer.textContent = `القارئ: ${reciterName}`;
}

function displaySurahDetails(surah) {
    surahDetails.innerHTML = `
        <p><strong>Surah Type:</strong> ${surah.type.ar}</p>
        <p><strong>Translation:</strong> ${surah.asma.en.long}</p>
        <p><strong>Tafsir:</strong> ${surah.tafsir.en || 'No translation available'}</p>
    `;
}

play.addEventListener('click', function () {
    if (audio.paused) {
        audio.play();
        play.querySelector('i').className = 'fas fa-pause';
    } else {
        audio.pause();
        play.querySelector('i').className = 'fas fa-play';
    }
});

next.addEventListener('click', function () {
    if (currentSurahIndex < surahs.length - 1) {
        currentSurahIndex++;
        playSurah(currentSurahIndex);
    } else {
        Swal.fire('Notice', 'This is the last Surah', 'info');
    }
});

prev.addEventListener('click', function () {
    if (currentSurahIndex > 0) {
        currentSurahIndex--;
        playSurah(currentSurahIndex);
    } else {
        Swal.fire('Notice', 'This is the first Surah', 'info');
    }
});

skipBackward.addEventListener('click', function () {
    audio.currentTime = Math.max(0, audio.currentTime - 5); // Go back 10 seconds, but not below 0
});

skipForward.addEventListener('click', function () {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); // Go forward 10 seconds, but not beyond the audio duration
});

function toggleAccordion(header) {
    const item = header.parentElement;
    item.classList.toggle('active');
}
