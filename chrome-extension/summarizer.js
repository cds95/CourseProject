document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('summarize');
    var textArea = document.getElementById('text-to-analyze')
    var resultSpace = document.getElementById('result')
    checkPageButton.addEventListener('click', function() {
        var unsummarizedText = textArea.value 
        resultSpace.innerText = unsummarizedText
    }, false);
  }, false);