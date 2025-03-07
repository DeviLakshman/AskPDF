import re , json , sys
repeated_lines = set()

def remove_headers_footers(text):
    """Removes repeating headers and footers by identifying frequent patterns."""
    lines = text.split("\n")
    
    for line in lines:
        if lines.count(line) > 5:  # Appears frequently, likely a header/footer
            repeated_lines.add(line.strip())

    cleaned_text = "\n".join([line for line in lines if line.strip() not in repeated_lines])
    return cleaned_text

def fix_extra_newlines(text):
    """Removes unnecessary newlines while preserving paragraph breaks."""
    text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)  # Remove single newlines inside paragraphs
    text = re.sub(r"\n\s*\n+", "\n\n", text)  # Preserve paragraph breaks
    return text.strip()

def fix_hyphenation(text):
    """Fixes broken words split by hyphen across line breaks."""
    return re.sub(r"(\w+)-\n(\w+)", r"\1\2", text)

def normalize_spaces(text):
    """Removes extra spaces while keeping sentence spacing intact."""
    return re.sub(r"\s+", " ", text).strip()

def filter_ascii(text):
    return ''.join(char for char in text if 32 <= ord(char) <= 126)

def clean_text_pipeline(text):
    """Full pipeline to clean extracted text from PDFs."""
    text = remove_headers_footers(text)
    text = fix_hyphenation(text)
    text = fix_extra_newlines(text)
    text = normalize_spaces(text)
    text = filter_ascii(text)
    return text

# Example text (Replace this with actual text from your PDF extraction)
# raw_text = """Page 1 - Confidential Report\n\nDeep learn-\ning is part of AI.\n\n\n\n page Machine   learning powers AI."""

cleaned_data = []
with open("outputs/raw_text.json","rb") as file :
    data = json.load(file)
    for part in data :
        cleaned_data.append({
            "file_name" : part["file_name"],
            "text" : clean_text_pipeline(part["text"])
        })

with open("outputs/cleaned_text.json", "w", encoding="utf-8") as f:
        json.dump(cleaned_data, f, ensure_ascii=True, indent=4)

print("All PDF texts saved in cleaned_text.json ")


if len(repeated_lines) > 0:
    print("Printing those which have been identified as headers/Footers")
    for line in repeated_lines :
        print(line)

sys.stdout.flush()