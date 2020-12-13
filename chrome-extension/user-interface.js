document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('summarize');
    var resultSpace = document.getElementById('result')
    var numSentencesInput = document.getElementById('num-sentences')

    checkPageButton.onclick = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { numSentences: numSentencesInput.value }, function(summarizedText) {
                resultSpace.innerText = summarizedText
            })    
        });
    }

  }, false);