from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxLengthValidator
from django_bleach.models import BleachField
from PIL import Image
from bs4 import BeautifulSoup
import re


class UserFields(AbstractUser):
    
    def clean(self, *args, **kwargs):
        self.validate_username()
        super().clean(*args, **kwargs)
        
    def validate_username(self):
        if not re.match(r"^[a-zA-Z0-9]+$", self.username):
            raise ValidationError("Username validation error")
        
    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2_sha256$'):
            self.set_password(self.password)
        self.clean()
        return super().save(*args, **kwargs)

class AbstractRecordFields(models.Model):
   username = models.CharField(max_length=100)
   email = models.EmailField()
   home_page = models.CharField(max_length=100, null=True, blank=True)
   text = BleachField(max_length=4096, validators=[
       MaxLengthValidator(limit_value=102400, message="Restriction 100 KB")
       ])
   photo = models.ImageField(upload_to="images/", null=True, blank=True, verbose_name="")
   txt_file = models.FileField(null=True, blank=True)
   time_created = models.DateTimeField(auto_now_add=True)
   def clean(self, *args, **kwargs):
       self.validate_photo_ext()
       self.validate_html_tags()
       self.validate_text()
       self.validate_txt_file()
       super().clean(*args, **kwargs)
       
   def validate_text(self):
       if self.photo is None and self.txt_file is None:
           if not (self.text and self.text.strip()):
               raise ValidationError("Empty text not accepted")
               
   def validate_html_tags(self):
        soup = BeautifulSoup(self.text, "html.parser")
        empty_tags = soup.find_all(lambda tag: not tag.contents and not tag.text.strip())
        if empty_tags:
            raise ValidationError("Empty tags is not allowed")
    
   def validate_photo_ext(self):
       if self.photo != None:
           if self.photo.name.endswith(("jpg","gif", "png", "jpeg")):
               img = Image.open(self.photo.file)
               if img.width > 320 or img.height> 240:
                   output_size = (320, 240)
                   img.thumbnail(output_size)
                   img.save(self.photo.path)
           elif self.photo.name.endswith("txt"):
               pass
           else:
                raise ValidationError("only JPG|GIF|PNG format") 
                
   def validate_txt_file(self):
       if self.txt_file != None:
           if self.txt_file.name.endswith("txt"):
               if self.txt_file.size > 102400:
                   raise ValidationError("Max size 100 KB")
           else:
               raise ValidationError("only TXT format")    
       
   def save(self, *args, **kwargs):
       self.clean()
       return super().save(*args, **kwargs)
   class Meta:
       abstract = True



class RecordFields(AbstractRecordFields):
    root_record = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, 
                                    blank=True, related_name="children")
    def get_root(self):
        node = self
        while node.root_record is not None:
            node = node.root_record
        return node.id
            
    class Meta:
        db_table = "logic_recordfields"



    
    
