from django.contrib import admin
from django.urls import include, path
from django.http import FileResponse, JsonResponse, Http404
from django.views.static import serve
from django.conf import settings
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import LoginView, RegisterView, MeView


def api_home(request):
    return JsonResponse({
        "name": "College Circuit API",
        "status": "running",
        "frontend": "http://localhost:5173",
        "admin": "/admin/",
        "api": {
            "auth": "/api/auth/",
            "projects": "/api/projects/",
        },
    })


def frontend_home(request):
    index = settings.FRONTEND_DIST_DIR / "index.html"

    if index.exists():
        return FileResponse(
            index.open("rb"),
            content_type="text/html"
        )

    return api_home(request)


def frontend_file(request, filename):
    file_path = settings.FRONTEND_DIST_DIR / filename

    if file_path.exists() and file_path.is_file():
        content_types = {
            "favicon.png": "image/png",
            "robots.txt": "text/plain",
            "sitemap.xml": "application/xml",
        }

        return FileResponse(
            file_path.open("rb"),
            content_type=content_types.get(
                filename,
                "application/octet-stream"
            ),
        )

    raise Http404("File not found")


urlpatterns = [
    # React/Vite frontend
    path("", frontend_home),

    # Frontend public files
    path(
        "favicon.png",
        frontend_file,
        {"filename": "favicon.png"},
    ),
    path(
        "robots.txt",
        frontend_file,
        {"filename": "robots.txt"},
    ),
    path(
        "sitemap.xml",
        frontend_file,
        {"filename": "sitemap.xml"},
    ),

    # React/Vite assets
    path(
        "assets/<path:path>",
        serve,
        {
            "document_root": settings.FRONTEND_DIST_DIR / "assets"
        },
    ),

    # Django admin
    path("admin/", admin.site.urls),

    # API
    path("api", api_home),
    path("api/", api_home),
    path("api/auth/register/", RegisterView.as_view()),
    path("api/auth/login/", LoginView.as_view()),
    path("api/auth/refresh/", TokenRefreshView.as_view()),
    path("api/auth/me/", MeView.as_view()),
    path("api/projects/", include("projects.urls")),
]