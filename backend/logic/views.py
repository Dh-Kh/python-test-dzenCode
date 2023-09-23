from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import (CreateAPIView, ListAPIView, RetrieveAPIView,
                                     ListCreateAPIView)
from django.shortcuts import get_object_or_404
from .serializers import (ReceiveTokensSerializer, RegisterModelSerializer, 
                          UserFieldsSerializer, RecordModelSerializer,
                          TextFormSerializer)
from .models import UserModel, RecordModel
from .pagination import RecordModelPagination
from .validators import root_queryset, sort_queryset



class ReceiveTokenView(TokenObtainPairView):
    serializer_class = ReceiveTokensSerializer

class RegisterModelView(CreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = RegisterModelSerializer
    
class UserFieldsView(RetrieveAPIView):
    #Used for read-only endpoints to represent a single model instance.
    serializer_class = UserFieldsSerializer
    def get_object(self):
        check_id = self.request.user.id
        return get_object_or_404(UserModel, id=check_id)
        
class RecordFieldsView(ListAPIView):
    lookup_url_kwarg = "check_id"
    serializer_class = RecordModelSerializer
    pagination_class = RecordModelPagination
    def get_queryset(self):
        check_id = self.kwargs.get(self.lookup_url_kwarg)
        return root_queryset(RecordModel, check_id)
    
    
class TextFormView(ListCreateAPIView):
    serializer_class = TextFormSerializer
    queryset = RecordModel.objects.none()  
    #related records displayed as main
    def post(self, request, *args, **kwargs):
        serializer = TextFormSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            validated_data = serializer.validated_data
            attribute_data = validated_data["attribute_data"]
            text_data = validated_data["text_data"]
            return sort_queryset(RecordModel, attribute_data, text_data)
        
    

        

