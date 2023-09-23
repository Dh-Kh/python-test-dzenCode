from django.core.exceptions import ValidationError
from bs4 import BeautifulSoup
from PIL import Image


def validate_text(value):
    if not value.strip():
        raise ValidationError("Empty text is not allowed")

def validate_html_tags(value):
     soup = BeautifulSoup(value, "html.parser")
     empty_tags = soup.find_all(lambda tag: not tag.contents and not tag.text.strip())
     if empty_tags:
         raise ValidationError("Empty tags is not allowed")
         
def validate_photo_ext(value):
    if value != None:
        if value.name.endswith(("jpg","gif", "png", "jpeg")):
            img = Image.open(value.file)
            if img.width > 320 or img.height> 240:
                output_size = (320, 240)
                img.thumbnail(output_size)
                img.save(value.path)
        else:
             raise ValidationError("only JPG|GIF|PNG format") 



