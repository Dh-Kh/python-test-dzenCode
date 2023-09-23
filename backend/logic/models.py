from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxLengthValidator, FileExtensionValidator
from django_bleach.models import BleachField
from django.utils import timezone
from .models_validators import (validate_html_tags, 
                validate_photo_ext, validate_text)
import re

class UserModel(AbstractUser):

    def validate_username(self):
        if not re.match(r"^[a-zA-Z0-9]+$", self.username):
            raise ValidationError("Username validation error")
    
    def clean(self, *args, **kwargs):
        self.validate_username()
        super().clean(*args, **kwargs)
            
    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2_sha256$'):
            self.set_password(self.password)
        self.clean()
        return super().save(*args, **kwargs)

class AbstractRecordModel(models.Model):
   username = models.CharField(max_length=100)
   email = models.EmailField()
   text = BleachField(max_length=4096, validators=[
       MaxLengthValidator(limit_value=102400, message="Restriction 100 KB"),
       validate_html_tags,
       validate_text])
   photo = models.ImageField(upload_to="images/", validators=[validate_photo_ext]
                             ,null=True, blank=True, verbose_name="")
   txt_file = models.FileField(null=True, blank=True, 
                               validators=[FileExtensionValidator( ['txt'] ) ])
   time_created = models.CharField(max_length=16)
       
   def save(self, *args, **kwargs):
       self.time_created = timezone.now().strftime("%Y-%m-%dT%H:%M")
       self.full_clean()
       return super().save(*args, **kwargs)
   class Meta:
       abstract = True



class RecordModel(AbstractRecordModel):
    root_record = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, 
                                    blank=True, related_name="children")
    def get_root(self):
        node = self
        while node.root_record is not None:
            node = node.root_record
        return node.id

    class Meta:
        db_table = "logic_recordmodel"



    
    
