from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path

from rest_framework import routers
from geo.views import MapViewSet
from metadata.views import MetadataView


router = routers.DefaultRouter()
router.register(r'maps', MapViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include(router.urls)),

    path('api/v1/metadata/', MetadataView.as_view()),
    path('api/v1/metadata/<str:district>/', MetadataView.as_view()),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if 'silk' in settings.INSTALLED_APPS:
    urlpatterns += [
        url(r'^silk/', include('silk.urls', namespace='silk')),
    ]
