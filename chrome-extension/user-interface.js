document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('summarize');
    var resultSpace = document.getElementById('result')
    var numSentencesInput = document.getElementById('num-sentences')

    /**
     * onClick handler for summarize button
     */
    checkPageButton.onclick = function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            /**
             * Sends the request to summarize the text to content.js.
             */
            chrome.tabs.sendMessage(tabs[0].id, { numSentences: numSentencesInput.value }, function(summarizedText) {
                resultSpace.innerText = summarizedText
            })    
        });
    }

  }, false);