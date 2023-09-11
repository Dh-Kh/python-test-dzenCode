from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserFields, RecordFields
from django.db import IntegrityError

class ReceiveTokensSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token
        
class RegisterModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFields
        fields = ("username", "email", "password")
        extra_kwargs = {
            "password": {"write_only": True}
        }
    def create(self, validated_data):
        try:
            user_fields = UserFields.objects.create(username=validated_data["username"],
                        email=validated_data["email"],
                        password=validated_data["password"])
        
            return user_fields
        except IntegrityError as e:
            raise e

class UserFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFields
        fields = ("username", "email")

class RecordFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordFields
        fields = "__all__"
        
    
class TextFormSerializer(serializers.Serializer):
    attribute_data = serializers.CharField(max_length=100)
    text_data = serializers.CharField(max_length=100)
        