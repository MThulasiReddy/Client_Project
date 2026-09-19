from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'is_staff')
    def get_name(self, user): return user.get_full_name() or user.username

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    name = serializers.CharField(write_only=True, max_length=150)
    class Meta:
        model = User
        fields = ('name', 'email', 'password')
    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists(): raise serializers.ValidationError('An account with this email already exists.')
        return value.lower()
    def create(self, data):
        name = data.pop('name')
        first, *last = name.strip().split(' ')
        return User.objects.create_user(username=data['email'], email=data['email'], password=data['password'], first_name=first, last_name=' '.join(last))
