SUPPORTED_SIGNS = {
    'HELLO', 'HELP', 'GOVERNMENT', 'OFFICE', 'HOSPITAL', 'CAMP',
    'VACCINATION', 'TOMORROW', 'TODAY', 'EMERGENCY', 'WARNING',
    'CLOSED', 'OPEN', 'IMPORTANT', 'POLICE', 'SCHOOL', 'COLLEGE',
    'WATER', 'FOOD', 'MEDICINE', 'APPOINTMENT'
}


def generate_gloss(text: str):
    processed = (text or '').upper()
    found = []
    for term in SUPPORTED_SIGNS:
        if term in processed:
            found.append(term)
    return found
