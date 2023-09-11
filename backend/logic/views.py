from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import (CreateAPIView, ListAPIView)
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (ReceiveTokensSerializer, RegisterModelSerializer, 
                          UserFieldsSerializer, RecordFieldsSerializer,
                          TextFormSerializer)
from .models import UserFields, RecordFields
from .pagination import RecordFieldsPagination

class ReceiveTokenView(TokenObtainPairView):
    serializer_class = ReceiveTokensSerializer

class RegisterModelView(CreateAPIView):
    queryset = UserFields.objects.all()
    serializer_class = RegisterModelSerializer
    
class UserFieldsView(ListAPIView):
    serializer_class = UserFieldsSerializer
    def get_queryset(self):
        try:
            check_id = self.request.user.id
            queryset = UserFields.objects.filter(id=check_id)
            return queryset
        except UserFields.DoesNotExist:
            print(check_id)
                
    
class RecordFieldsView(ListAPIView):
    queryset = sorted(RecordFields.objects.all(), key=lambda record: record.get_root())
    serializer_class = RecordFieldsSerializer
    pagination_class = RecordFieldsPagination
    
    def get(self, request, check_id, *args, **kwargs):
        queryset_data = sorted(RecordFields.objects.all(), key=lambda record: record.get_root())
        page = self.paginate_queryset(queryset_data)
        if check_id == 1:
            serializer = RecordFieldsSerializer(page, many=True)
            result = self.get_paginated_response(serializer.data)
            return Response(result.data)
        elif check_id == 2:
            queryset_data_reversed = sorted(RecordFields.objects.all(), 
                                   key=lambda record: record.get_root(), reverse=True)
            page = self.paginate_queryset(queryset_data_reversed)
            serializer = RecordFieldsSerializer(page, many=True)
            result = self.get_paginated_response(serializer.data)
            return Response(result.data)

    
class TextFormView(APIView):
    
    def sort_queryset(self, attribute_data, text_data):
        queryset_data = sorted(RecordFields.objects.all(), key=lambda record: record.get_root())
        not_related_records = [[data, None] for data in queryset_data if data.root_record == None]
        related_records = [[data.root_record, data] for data in queryset_data if data.root_record != None]
        merged_array = not_related_records + related_records
        merged_array = sorted(merged_array, key=lambda x: x[0].id)
        with_result = [data[0] for data in merged_array if getattr(data[0], attribute_data) == text_data]
        without_result = [data[0] for data in merged_array if getattr(data[0], attribute_data) != text_data]
        iter_array = with_result + without_result
        serializer  = RecordFieldsSerializer(iter_array, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        serializer = TextFormSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            attribute_data = serializer.validated_data["attribute_data"]
            text_data = serializer.validated_data["text_data"]
            return self.sort_queryset(attribute_data, text_data)

    

        
        
    