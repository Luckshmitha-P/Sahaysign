def normalize_text(text: str) -> str:
    return ' '.join((text or '').lower().replace(',', ' ').replace('.', ' ').split())


def extract_keywords(text: str):
    normalized = normalize_text(text)
    tokens = normalized.split()
    return [token.upper() for token in tokens if token]
