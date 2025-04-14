import sys
import json
import os
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import unicodedata

# Read JSON data from stdin and decode as UTF-8
input_data = sys.stdin.buffer.read().decode('utf-8')
book_data = json.loads(input_data)

# Set up the PDF buffer
buffer = BytesIO()
doc = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=1*inch, rightMargin=1*inch, topMargin=1*inch, bottomMargin=1*inch)

# Register a font that supports Finnish/Swedish characters
font_name = 'Helvetica'  # Default fallback font
try:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    font_path = os.path.join(script_dir, 'DejaVuSans.ttf')
    pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))
    font_name = 'DejaVuSans'
    print(f"Using DejaVuSans font at {font_path} for Finnish/Swedish character support.", file=sys.stderr)
except Exception as e:
    print(f"Error: Could not load DejaVuSans.ttf ({str(e)}). Falling back to Helvetica, which may not support all characters.", file=sys.stderr)
    font_name = 'Helvetica'

# Define styles using a dictionary
styles = getSampleStyleSheet()
custom_styles = {
    'CoverTitle': ParagraphStyle(
        name='CoverTitle',
        fontName=font_name,
        fontSize=24,
        alignment=1,  # Center
        spaceAfter=20,
        leading=28
    ),
    'CoverText': ParagraphStyle(
        name='CoverText',
        fontName=font_name,
        fontSize=14,
        alignment=1,  # Center
        spaceAfter=10,
        leading=16
    ),
    'Body': ParagraphStyle(
        name='Body',
        fontName=font_name,
        fontSize=12,
        alignment=0,  # Left
        spaceAfter=12,
        leading=14,
        leftIndent=0,
        rightIndent=0,
        firstLineIndent=0.2*inch  # Indent first line of each paragraph
    ),
    'Annotation': ParagraphStyle(
        name='Annotation',
        fontName=font_name,
        fontSize=10,
        alignment=0,  # Left
        spaceBefore=12,
        spaceAfter=12,
        leading=12
    )
}

# Normalize text to preserve Finnish/Swedish characters and handle historical spellings
def normalize_text(text):
    text = unicodedata.normalize('NFC', text)
    replacements = {
        'ả': 'å',
        'ō': 'o',
        'ị': 'i',
        'år': 'är',
        'huar': 'hvar',
        'ofver': 'öfver',
        'såvål': 'såväl',
        'anvåndning': 'användning',
        'nödvåndighet': 'nödvändighet',
        'stådse': 'ständse',
        'åndas': 'ändas',
        'kunnajöra': 'kunna göra',
        'krușa': 'krusa',
        'vär': 'vår',
        'sjål': 'själ',
        'pylara': 'göra',
        'måta': 'mäta',
        'verkljghet': 'verklighet',
        'sjålvståndiga': 'självständiga',
        'oförånderliga': 'oföränderliga',
        'trådvägg': 'trävägg',
        'betrådt': 'beträdt',
        'präppte': 'släppte',
        'föllv': 'själv',
        'fullståndigt': 'fullständigt',
        'heravålde': 'herravälde',
        'någotting': 'någonting',
        'obeyedt': 'obekant',
        'glycos': 'göra',
        'hălla': 'hålla',
        'angär': 'angår',
        'mårke': 'märke',
        'någon': 'någonting',
        'likvål': 'likväl',
        'trångdes': 'trängdes',
        'vantas': 'väntas',
        'århundraden': 'århundraden',
        'nảgon': 'någon',
        'vårde': 'värde',
        'översåttning': 'översättning'
    }
    for wrong, correct in replacements.items():
        text = text.replace(wrong, correct)
    return text

# Build the PDF content
elements = []

# Cover Page (Metadata Only)
cover_items = [
    (f"'{book_data.get('title', 'Untitled')}'", 'CoverTitle'),
    (f"av {book_data['author']}" if book_data.get('author') else None, 'CoverText'),
    (f"Översatt af {book_data['translator']}" if book_data.get('translator') else None, 'CoverText'),
    (book_data.get('publisher'), 'CoverText'),
    (book_data.get('publicationYear'), 'CoverText'),
    (f"Publication No. {book_data['publicationNumber']}" if book_data.get('publicationNumber') else None, 'CoverText'),
    (book_data.get('productionCredits'), 'CoverText'),
    (book_data.get('publicDomainNotice'), 'CoverText'),
    (book_data.get('foreword'), 'CoverText')
]

for text, style in cover_items:
    if text:
        elements.append(Paragraph(normalize_text(text), custom_styles[style]))
        elements.append(Spacer(1, 0.2*inch))  # Add spacing between paragraphs
elements.append(PageBreak())

# Main Content (starting on page 2)
for story in book_data.get('stories', []):
    content = story.get('content', '').strip()
    if content:
        paragraphs = content.split('\n\n')
        for para in paragraphs:
            para = normalize_text(para.strip())
            if para:
                elements.append(Paragraph(para, custom_styles['Body']))
                elements.append(Spacer(1, 0.25*inch))  # Add spacing between paragraphs

# Add annotation at the end (on a new page if necessary)
if book_data.get('annotation'):
    elements.append(PageBreak())
    elements.append(Paragraph(normalize_text(book_data['annotation']), custom_styles['Annotation']))

# Generate the PDF
doc.build(elements)

# Output the PDF bytes to stdout
pdf_bytes = buffer.getvalue()
sys.stdout.buffer.write(pdf_bytes)
sys.stdout.flush()