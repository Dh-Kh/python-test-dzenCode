from django.db.models import F, IntegerField
from django.db.models.functions import Coalesce
from rest_framework.response import Response
from .serializers import RecordModelSerializer



def root_queryset(obj, num=1):
    if num == 1:
        return obj.objects.annotate(
            root_sort=Coalesce('root_record', F('id'), output_field=IntegerField())
        ).order_by('root_sort')
    elif num == 2:
        return obj.objects.annotate(
            root_sort=Coalesce('root_record', F('id'), output_field=IntegerField())
        ).order_by('-root_sort')
    
def sort_queryset(obj, attribute_data, text_data):
    filtered_queryset = obj.objects.filter(**{attribute_data: text_data})
    serializer = RecordModelSerializer(filtered_queryset, many=True)
    return Response(serializer.data)





    