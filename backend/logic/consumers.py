from django.core.files.base import ContentFile
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from channels.db import database_sync_to_async
from .models import RecordFields
from random import randint
import json
import base64
import httpx



class CommentsConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.user = self.scope["user"]
        await self.channel_layer.group_add("comments", self.channel_name)
        await self.accept()

        
    async def disconnect(self, code):
        await self.channel_layer.group_discard("comments", self.channel_name)
        await self.close()
        
        
    async def receive(self, text_data):
         self.json_load = json.loads(text_data)
         related_record_id = self.json_load.get("related_record")
         text = self.json_load.get("text")
         photo = self.json_load.get("photo")
         txt_file = self.json_load.get("txt_file")
         user_data = {
             "username": self.user.username, 
             "email": self.user.email,
             "home_page": self.user.home_page
             }
         
         if photo is not None:
             format, imgstr = photo.split(';base64,')
             ext = format.split("/")[-1]
             photo = ContentFile(base64.b64decode(imgstr), name=f"photo.{ext}")
        
         if txt_file is not None:
             txt_file = base64.b64decode(txt_file)
             txt_file = ContentFile(txt_file, name=f"{randint(1, 100000)}_file.txt")

         if related_record_id == None:
             record_data = await database_sync_to_async(RecordFields.objects.create)(
                 **user_data,
                 text=text,
                 photo=photo,
                 txt_file=txt_file
                 )
                 
             await database_sync_to_async(record_data.save)()
             await self.captcha_request()
             await self.channel_layer.group_send(
                 "comments", {"type": "websocket.send", "text": text, 
                              "photo": str(photo), "txt_file": str(txt_file)})
         else:
             main_model = await database_sync_to_async(RecordFields.objects.get)(
                 id=related_record_id)
             replies_record = await database_sync_to_async(RecordFields.objects.create)(
                 root_record = main_model,
                 **user_data,
                 text=text,
                 photo=photo,
                 txt_file=txt_file
                 )
             await database_sync_to_async(replies_record.save)()
             await self.channel_layer.group_send(
                 "comments", {"type": "websocket_send", 
                              "related_record": related_record_id, "text": text, 
                              "photo": str(photo), "txt_file": str(txt_file)})
         await self.captcha_request()

         
    async def captcha_request(self):
        data = {
            "secret": settings.SECRET_RE,
            "response": {
                'token': self.json_load.get("token_captcha"),
                'input_value': self.json_load.get("input_value") 
            }
        }
        async with httpx.AsyncClient() as client:
            try:
                await client.post('https://www.google.com/recaptcha/api/siteverify',data=data)
            except httpx.HTTPError as e:
                await self.send(str(e))
    
     
    async def websocket_send(self, event):
        text = event["text"]
        photo = event["photo"]
        await self.send(text_data=json.dumps({
            "text": text,
            "photo": photo
            }))
        
        
