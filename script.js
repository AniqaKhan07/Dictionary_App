document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultDiv = document.querySelector('.result');
    const errorDiv = document.querySelector('.error-message');

    const wordTitle = document.getElementById('word-title');
    const partOfSpeech = document.getElementById('part-of-speech');
    const phonetic = document.getElementById('phonetic');
    const definition = document.getElementById('definition');
    const example = document.getElementById('example');
    const speakerBtn = document.getElementById('speaker-btn');

    // Dictionary API URL
    const englishApiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

    // Search function
    async function searchWord() {
        const word = searchInput.value.trim();

        if (!word) {
            alert('Please enter a word');
            return;
        }

        try {
            const englishResponse = await fetch(`${englishApiUrl}${word}`);

            if (!englishResponse.ok) {
                throw new Error('Word not found');
            }

            const englishData = await englishResponse.json();
            displayResult(englishData[0]);

            resultDiv.style.display = 'block';
            errorDiv.style.display = 'none';

        } catch (error) {
            resultDiv.style.display = 'none';
            errorDiv.style.display = 'block';
            console.error('Error:', error);
        }
    }

    // Display English result
    function displayResult(data) {
        wordTitle.textContent = data.word;

        if (data.meanings && data.meanings.length > 0) {
            partOfSpeech.textContent = data.meanings[0].partOfSpeech || 'N/A';
        } else {
            partOfSpeech.textContent = 'N/A';
        }

        phonetic.textContent = data.phonetic || data.phonetics.find(p => p.text)?.text || 'N/A';

        if (
            data.meanings &&
            data.meanings.length > 0 &&
            data.meanings[0].definitions &&
            data.meanings[0].definitions.length > 0
        ) {
            definition.textContent = data.meanings[0].definitions[0].definition || 'N/A';
            example.textContent = data.meanings[0].definitions[0].example || 'No example available';
        } else {
            definition.textContent = 'No definition available';
            example.textContent = 'No example available';
        }

        speakerBtn.onclick = () => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(data.word);
                utterance.lang = 'en-US';
                speechSynthesis.speak(utterance);
            } else {
                alert('Text-to-speech not supported in your browser');
            }
        };
    }

    // Event listeners
    searchBtn.addEventListener('click', searchWord);
    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            searchWord();
        }
    });
});
