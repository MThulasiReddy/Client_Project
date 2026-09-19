from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset, serializer_class, permission_classes = User.objects.all(), RegisterSerializer, [permissions.AllowAny]
class LoginView(TokenObtainPairView):
    pass
class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    def get_object(self): return self.request.user
