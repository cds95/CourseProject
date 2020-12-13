// For simplicity I just copy and pasted this from NLTK's list of stopwords
var stopWords = ["you'd", 'she', "she's", 'mightn', "that'll", 're', 'those', 'while', 'themselves', "weren't", 'once', 'mustn', 'hasn', 'only', 'needn', 'until', 'into', 'to', 'they', 'off', 'had', 'with', 'll', 'same', "shouldn't", 'just', "you've", 'didn', 'any', 'after', 'ma', 'this', 'were', 'been', 'at', 'most', 'not', 'y', 'against', 'that', 'which', 'my', 'don', 'now', 'our', 'up', 'on', 'such', 'over', 'did', "you're", 'very', 'again', 'or', 'me', 's', 'through', 'will', 'what', 'then', 'an', 'herself', "isn't", "shan't", "couldn't", 'haven', "wasn't", 't', "won't", 'itself', 'and', 'more', "hasn't", 'why', 'both', 'than', 'can', 'hadn', 'shouldn', 'should', "it's", 'yourselves', 'so', 'whom', 'being', "hadn't", 'yourself', 'wouldn', 'm', 'theirs', 'before', 'his', 'has', 'during', 'o', "you'll", 'couldn', 'ourselves', 'was', 'as', 'other', "mustn't", 'about', 'here', 'some', 'between', 'it', 'himself', 'having', 'her', 'are', 'because', 'myself', 'by', 'each', 'from', "aren't", 'weren', 'won', 'own', 'no', 'its', 'd', 'down', "doesn't", 'yours', 'a', 'too', 'for', 'further', 'them', "should've", 'you', 'him', 'out', 'when', 'all', 'doing', "wouldn't", 'aren', 'doesn', 'their', 'be', 'there', 'is', 'he', 'ain', 'shan', "mightn't", 'isn', 'ours', 'but', 'below', 'wasn', 'am', 'where', 'in', "haven't", 'above', 'few', 'who', "needn't", 'i', 'if', "didn't", 'have', 'how', 'your', 've', 'does', 'these', 'we', 'do', 'of', 'hers', 'nor', "don't", 'the', 'under']
var commonNounAbbr = ["mr", "mrs", "ms", "dr", "prof"]

/**
 * Sanitizes a word by removing unwanted characters
 * @param {*} word 
 */
function sanitizeWord(word) {
    var charsToIgnore = [",", "'s", "\"", "\n"]
    for(var i = 0; i < charsToIgnore.length; i++) {
        word = word.replace(charsToIgnore[i], "")
    }
    return word 
}

/**
 * Tokenizes words from a list of tokenized sentences.  Returns the tokenized words as a list
 * @param {*} tokenizedSentences 
 */
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

/**
 * Takes in the article and returns a list of tokenized sentences.
 * @param {*} text 
 */
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
            currSentence += char 
        } else if (isInMiddleOfQuote) {
            if(char === "\"") {
                isInMiddleOfQuote = false 
            } 
            currSentence += char 
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

/**
 * Takes in a list of tokenized words and returns a list of those words excluding stop words
 * @param {*} tokenizedWords 
 */
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

/**
 * Get the word counts for each word and returns them as a dictionary
 * @param {*} tokenizedWords 
 */
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

/**
 * Normalizes the word count frequencies and returns the results in a dictionary.
 * @param {*} wordFreqs 
 */
function normalizeWordFreq(wordFreqs) {
    var largestScore = 0
    for(wordScore of Object.values(wordFreqs)) {
        largestScore = Math.max(wordScore, largestScore)
    }
    for(word of Object.keys(wordFreqs)) {
        wordFreqs[word] = wordFreqs[word] / largestScore
    }
}

/**
 * Calculates the score for each word based off their frequencies.  Returns the results as a dictionary.
 * @param {*} tokenizedWords 
 */
function getWordScores(tokenizedWords) {
    var wordFreqs = getWordFreqDict(tokenizedWords)
    normalizeWordFreq(wordFreqs)
    return wordFreqs
}

/**
 * Gets the score for each sentence and returns them as a dictionary
 * @param {*} sentences 
 * @param {*} wordScores 
 */
function getSentenceScores(sentences, wordScores) {
    var scores = {}
    for(var i = 0; i < sentences.length; i++) {
        var sentence = sentences[i]
        var words = sentence.split(" ")
        var sentenceScore = 0.0
        for(var j = 0; j < words.length; j++) {
            var sanitizedWord = sanitizeWord(words[j])
            var wordScore = wordScores[sanitizedWord]
            if(wordScore !== undefined) {
                sentenceScore += wordScore 
            }
        }
        scores[sentence] = sentenceScore
    }
    return scores 
}

/**
 * Takes the highest scoring sentences and returns the result as a string.
 * @param {*} sentenceScores 
 * @param {*} numSentences 
 */
function takeHighestScoreSentences(sentenceScores, numSentences) {
    var sentences = Object.keys(sentenceScores)
    // Rank sentences from highest to lowest scores
    sentences.sort(function(sentA, sentB) {
        return sentenceScores[sentB] - sentenceScores[sentA]
    })
    var result = []

    // Generate sentences this way so as to preserve order.
    for(var sentence of Object.keys(sentenceScores)) {
        if(sentences.indexOf(sentence) < parseInt(numSentences)) {
            result.push(sentence)
        }
    }
    return result.join(". ")
}

/**
 * Summarizes the text into a given number of sentences.
 * @param {*} text 
 * @param {*} numSentences 
 */
function summarizeText(text, numSentences) {
    var tokenizedSentences = tokenizeIntoSentences(text)
    var tokenizedWords = tokenizeIntoWords(tokenizedSentences)
    var tokenizedNonStopwords = removeStopwords(tokenizedWords)
    var wordScores = getWordScores(tokenizedNonStopwords)
    var sentenceScores = getSentenceScores(tokenizedSentences, wordScores)
    return takeHighestScoreSentences(sentenceScores, numSentences)
}

/**
 * Scrapes the article's text from the DOM and returns them as a string 
 */
function scrapeArticleText() {
    var articleText = ""
    var paragraphElements = document.querySelectorAll(".zn-body__paragraph")
    for(const element of paragraphElements) {
        var paragraphText = element.innerText
        articleText += paragraphText
    }
    return articleText
}

/**
 * Listener for the request sent by the button action from user-interface.js
 */
chrome.runtime.onMessage.addListener(function(request, _, sendResponse) {
    var numSentences = request.numSentences
    var articleText = scrapeArticleText()
    var summarizedArticle = summarizeText(articleText, numSentences)
    sendResponse(summarizedArticle)
})