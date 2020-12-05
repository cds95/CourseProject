// For simplicity I just copy and pasted this from NLTK's list of stopwords
var stopWords = ["you'd", 'she', "she's", 'mightn', "that'll", 're', 'those', 'while', 'themselves', "weren't", 'once', 'mustn', 'hasn', 'only', 'needn', 'until', 'into', 'to', 'they', 'off', 'had', 'with', 'll', 'same', "shouldn't", 'just', "you've", 'didn', 'any', 'after', 'ma', 'this', 'were', 'been', 'at', 'most', 'not', 'y', 'against', 'that', 'which', 'my', 'don', 'now', 'our', 'up', 'on', 'such', 'over', 'did', "you're", 'very', 'again', 'or', 'me', 's', 'through', 'will', 'what', 'then', 'an', 'herself', "isn't", "shan't", "couldn't", 'haven', "wasn't", 't', "won't", 'itself', 'and', 'more', "hasn't", 'why', 'both', 'than', 'can', 'hadn', 'shouldn', 'should', "it's", 'yourselves', 'so', 'whom', 'being', "hadn't", 'yourself', 'wouldn', 'm', 'theirs', 'before', 'his', 'has', 'during', 'o', "you'll", 'couldn', 'ourselves', 'was', 'as', 'other', "mustn't", 'about', 'here', 'some', 'between', 'it', 'himself', 'having', 'her', 'are', 'because', 'myself', 'by', 'each', 'from', "aren't", 'weren', 'won', 'own', 'no', 'its', 'd', 'down', "doesn't", 'yours', 'a', 'too', 'for', 'further', 'them', "should've", 'you', 'him', 'out', 'when', 'all', 'doing', "wouldn't", 'aren', 'doesn', 'their', 'be', 'there', 'is', 'he', 'ain', 'shan', "mightn't", 'isn', 'ours', 'but', 'below', 'wasn', 'am', 'where', 'in', "haven't", 'above', 'few', 'who', "needn't", 'i', 'if', "didn't", 'have', 'how', 'your', 've', 'does', 'these', 'we', 'do', 'of', 'hers', 'nor', "don't", 'the', 'under']
var commonNounAbbr = ["mr", "mrs", "ms", "dr", "prof"]

document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('summarize');
    var textArea = document.getElementById('text-to-analyze')
    var resultSpace = document.getElementById('result')

    function isALetter(character) {
        return character.match(/[a-z]/i);
    }

    function removeNonAlphabeticalCharacters(text) {
        var result = ""
        for(var i = 0; i < text.length; i++) {
            var char = text[i]
            if(char === "." || isALetter(char)) {
                result += char 
            }
        }
        return result
    }

    function sanitizeWord(word) {
        var charsToIgnore = [",", "'s", "\"", "\n"]
        for(var i = 0; i < charsToIgnore.length; i++) {
            word = word.replace(charsToIgnore[i], "")
        }
        return word 
    }

    function tokenizeIntoWords(tokenizedSentences) {
        var tokenizedWords = []
        for(var i = 0; i < tokenizedSentences.length; i++) {
            var sentence = tokenizedSentences[i]
            var splitBySpace = sentence.split(" ")
            for(var j = 0; j < splitBySpace.length; j++) {
                var unsanitizedWord = splitBySpace[j]
                tokenizedWords.push(sanitizeWord(unsanitizedWord))
            }
        }
        return tokenizedWords
    }

    function tokenizeIntoSentences(text) {
        var sentences = []
        var currSentence = ""
        var endOfSentencePunc = ["!", ".", "?"]
        var isInMiddleOfQuote = false
        for(var i = 0; i < text.length; i++) {
            var char = text[i]
            // Handle quotes
            if(char === "\"" && !isInMiddleOfQuote) {
                isInMiddleOfQuote = true 
            } else if (isInMiddleOfQuote) {
                if(char === "\"") {
                    isInMiddleOfQuote = false 
                } else {
                    currSentence += char 
                }
            } else if(endOfSentencePunc.indexOf(char) === -1 && char !== "\n") {
                currSentence += char 
            } else {
                if(currSentence.length > 0 && commonNounAbbr.indexOf(currSentence.trim().toLowerCase()) === -1) {
                    sentences.push(currSentence.trim())
                }
                currSentence = ""
            }
        }
        return sentences
    }

    function removeStopwords(tokenizedWords) {
        var words = []
        for(var i = 0; i < tokenizedWords.length; i++) {
            var word = tokenizedWords[i]
            if(stopWords.indexOf(word.toLowerCase()) === -1) {
                words.push(word)
            }
        }
        return words 
    }

    function getWordFreqDict(tokenizedWords) {
        var wordFreqs = {}
        for(var i = 0; i < tokenizedWords.length; i++) {
            var word = tokenizedWords[i].toLowerCase()
            if(wordFreqs[word] === undefined) {
                wordFreqs[word] = 1
            } else {
                wordFreqs[word] += 1
            }
        }
        return wordFreqs
    }

    function normalizeWordFreq(wordFreqs) {
        var largestScore = 0
        for(wordScore of Object.values(wordFreqs)) {
            largestScore = Math.max(wordScore, largestScore)
        }
        for(word of Object.keys(wordFreqs)) {
            wordFreqs[word] = wordFreqs[word] / largestScore
        }
    }

    function getWordScores(tokenizedWords) {
        var wordFreqs = getWordFreqDict(tokenizedWords)
        normalizeWordFreq(wordFreqs)
        return wordFreqs
    }

    function summarizeText(text) {
        var tokenizedSentences = tokenizeIntoSentences(text)
        var tokenizedWords = tokenizeIntoWords(tokenizedSentences)
        var tokenizedNonStopwords = removeStopwords(tokenizedWords)
        var wordScores = getWordScores(tokenizedNonStopwords)
        return tokenizedWords.toString()
    }

    checkPageButton.addEventListener('click', function() {
        var unsummarizedText = textArea.value 
        resultSpace.innerText = summarizeText(unsummarizedText)
    }, false);
  }, false);