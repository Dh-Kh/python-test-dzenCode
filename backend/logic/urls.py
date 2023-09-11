from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import (ReceiveTokenView, RegisterModelView, UserFieldsView,
                    RecordFieldsView, TextFormView)

urlpatterns = [
    path('token/', jwt_views.TokenObtainPairView.as_view()),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view()),
    path("login_model/", ReceiveTokenView.as_view()),
    path("register_model/", RegisterModelView.as_view()),
    path("display_model/", UserFieldsView.as_view()),
    path("record_fields/<int:check_id>/", RecordFieldsView.as_view()),
    path("text_form/", TextFormView.as_view()),
    ]