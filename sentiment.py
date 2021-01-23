from textblob import TextBlob, Word, Blobber
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import json
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

import sys
import requests
from bs4 import BeautifulSoup
import statistics



sia = SentimentIntensityAnalyzer()



""" 
pos_file_handler = open("positive_words.txt", "r")
pos_words = pos_file_handler.read().split("\n")
pos_file_handler.close()



neg_file_handler = open("negative_words.txt", "r")
neg_words = neg_file_handler.read().split("\n")
neg_file_handler.close()
"""


article_sentences = dict()

def k (t):
    return float(t[1])


def main():
    failed_connections = 0
    pos_text_words = dict()
    neg_text_words = dict()
    textLink = dict()
    linkPolarities = dict()
    sentence_polarities = dict()

    lines = sys.stdin.readlines()
    articleLinks = json.loads(lines[0]) 
    
   # articleLinks = articleLinksHard
    articles = []
    for link in articleLinks:
        text = extract_text_content(link)
        if text != False:
            articles.append(text)
            textLink[text] = link
        else:
            articles.append(False)
            failed_connections += 1


    polarities = []
    all_articles = ''
    for article in articles:
        all_articles = all_articles + '--------------------------------------------------------------------------------------------------\n' + article
        link = textLink[article]
        article = article.replace('\n', ' ')
        article = article.replace('\t', ' ')
        polarities.append(sia.polarity_scores(text = article)['compound'])
        linkPolarities[link] = polarities[len(polarities) - 1]

        article_sentences = article.replace('.', "/LLL")
        article_sentences = article_sentences.replace('?', "/LLL")
        article_sentences = article_sentences.replace('!', "/LLL")
        article_sentences = article_sentences.split("/LLL")
        for sentence in article_sentences:
            if sentence != '':  
                sentence_polarities[sentence] = sia.polarity_scores(sentence)['compound']

        article_words = article.split(" ")
        for word in article_words:
            word = word.lower()
            word = remove_punctuation(word)
            word = word.strip()
            if word != '':
                word_polarity = sia.polarity_scores(word)['compound']
        
                if  word_polarity >= 0.5:
                    pos_text_words[word] = pos_text_words.get(word, 0) + 1
                elif word_polarity <= -0.5:
                    neg_text_words[word] = neg_text_words.get(word, 0) + 1
       

    pos_text_words = list(pos_text_words.items())
    pos_text_words.sort(key = k, reverse = True)
    neg_text_words = list(neg_text_words.items())
    neg_text_words.sort(key = k, reverse = True)
    linkPolarities = list(linkPolarities.items())
    linkPolarities.sort(key = k, reverse = True)
    sentence_polarities = list(sentence_polarities.items())
    sentence_polarities.sort(key = k, reverse = True)
    
    results = {
        "res": [all_articles, polarities, statistics.mean(polarities), polarities[int(len(polarities)/2)], statistics.stdev(polarities), linkPolarities[:5], linkPolarities[-5:], pos_text_words[:10], neg_text_words[:10],  sentence_polarities[:10], sentence_polarities[-10:], failed_connections, 'Successfully ran script']
    }
    
    print(json.dumps(results))

    
    

def extract_text_content(url):
    try:
        r1 = requests.get(url)
    except:
        return False
    coverpage = r1.content
    soup1 = BeautifulSoup(coverpage, 'lxml')
    coverpage_news_header = soup1.find_all()
    coverpage_news = soup1.find_all(['p'])
    

    content = ''

    for paragraph in coverpage_news:
        p = paragraph.get_text()
        content = content + '  ' + p
    
    return content



def remove_punctuation(s):
   
    s = s.replace(".", "")
    s = s.replace(">", "")
    s = s.replace("<", "")
    s = s.replace(",", "")
    s = s.replace("+", "")
    s = s.replace("=", "")
    s = s.replace("/", "")
    s = s.replace("_", "")    
    s = s.replace(":", "")
    s = s.replace("\\", "")
    s = s.replace("|", "")
    s = s.replace("!", "")
    s = s.replace("?", "")
    s = s.replace(";", "")
    s = s.replace("'", "")
    s = s.replace("@", "")
    s = s.replace("#", "")
    s = s.replace("{", "")
    s = s.replace("}", "")
    s = s.replace("\"", "")
    s = s.replace("$", "")
    s = s.replace("%", "")
    s = s.replace("^", "")
    s = s.replace("-", "")
    s = s.replace("*", "")
    s = s.replace("(", "")
    s = s.replace(")", "")
    s = s.replace("`", "")
    s = s.replace("+", "")
    s = s.replace("~", "")
    s = s.replace("&", "")
    s = s.replace("[", "")
    s = s.replace("]", "")
    return s

if __name__ == '__main__':
    main()








