from django.urls import path
from .views import AdminProjectDetailView, AdminProjectListView, ProjectListCreateView
urlpatterns = [path('', ProjectListCreateView.as_view()), path('admin/', AdminProjectListView.as_view()), path('admin/<int:pk>/', AdminProjectDetailView.as_view())]
