from django.urls import path
from .views import (
    AdminProjectDetailView,
    AdminProjectListView,
    ProjectFeedbackView,
    ProjectListCreateView,
    HeroAnnouncementView,
)

urlpatterns = [
    path('', ProjectListCreateView.as_view()),
    path('<int:pk>/feedback/', ProjectFeedbackView.as_view()),
    path('announcement/', HeroAnnouncementView.as_view()),
    path('admin/', AdminProjectListView.as_view()),
    path('admin/<int:pk>/', AdminProjectDetailView.as_view()),
]
