from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title='SahaySign API')


class TextToSignRequest(BaseModel):
    text: str
    language: str = 'en'
    signLanguage: str = 'ISL'


class GenerateSignRequest(BaseModel):
    text: str
    signLanguage: str = 'ISL'


@app.get('/api/health')
def health():
    return {'status': 'ok', 'app': 'SahaySign'}


@app.post('/api/text-to-sign')
def text_to_sign(payload: TextToSignRequest):
    text = payload.text or ''
    words = [part for part in text.lower().split() if part]
    result = []

    for word in words:
        if word in {'tomorrow', 'vaccination', 'camp', 'government', 'hospital', 'help', 'office', 'hello'}:
            result.append(word.upper())

    return {
        'text': payload.text,
        'language': payload.language,
        'signLanguage': payload.signLanguage,
        'glossSequence': result,
    }


@app.post('/api/generate-sign')
def generate_sign(payload: GenerateSignRequest):
    text = payload.text or ''
    words = [part for part in text.lower().split() if part]
    gloss = []

    for word in words:
        if word in {'tomorrow', 'vaccination', 'camp', 'government', 'hospital', 'help', 'office', 'hello'}:
            gloss.append(word.upper())

    motion_sequence = [{'name': term, 'duration': 1.5} for term in gloss]

    return {
        'glossSequence': gloss,
        'motionSequence': motion_sequence,
    }


@app.post('/api/speech-to-text')
def speech_to_text(payload: TextToSignRequest):
    return {'text': payload.text, 'language': payload.language}
