from django.urls import path
from .views import (
    AdminProjectDetailView,
    AdminProjectListView,
    ProjectFeedbackView,
    ProjectListCreateView,
    HeroAnnouncementView,
    PlacementCompanyLinkListCreateView,
    PlacementCompanyLinkDetailView,
    ToggleJobAppliedView,
    TrackCompanyClickView,
)

urlpatterns = [
    path('', ProjectListCreateView.as_view()),
    path('<int:pk>/feedback/', ProjectFeedbackView.as_view()),
    path('announcement/', HeroAnnouncementView.as_view()),
    path('admin/', AdminProjectListView.as_view()),
    path('admin/<int:pk>/', AdminProjectDetailView.as_view()),
    path('placement-links/', PlacementCompanyLinkListCreateView.as_view()),
    path('placement-links/<int:pk>/', PlacementCompanyLinkDetailView.as_view()),
    path('placement-links/<int:pk>/toggle-apply/', ToggleJobAppliedView.as_view()),
    path('placement-links/<int:pk>/track-click/', TrackCompanyClickView.as_view()),
]
