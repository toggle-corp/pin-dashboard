from django.contrib import admin
from django.db.models import Count
from pin.admin import linkify
from pin.filters import RelatedDropdownFilter

from .models import (
    Map,
    Province,
    District,
    Palika,
    Ward,
)

admin.site.register(Map)


class MetaCountMixin():
    meta_count_prefex = ''

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.annotate(
            hh_count=Count(f'{self.meta_count_prefex}household', distinct=True),
            gs_count=Count(f'{self.meta_count_prefex}geosite', distinct=True),
        )
        return qs

    def gs_count(self, obj):
        return obj.gs_count
    gs_count.admin_order_field = 'gs_count'

    def hh_count(self, obj):
        return obj.hh_count
    hh_count.admin_order_field = 'hh_count'


@admin.register(Province)
class ProvinceAdmin(MetaCountMixin, admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name', 'hh_count', 'gs_count')
    meta_count_prefex = 'district__'


class PalikaInine(admin.StackedInline):
    model = Palika
    exclude = ('geojson',)
    extra = 0


@admin.register(District)
class DistrictAdmin(MetaCountMixin, admin.ModelAdmin):
    inlines = (PalikaInine,)
    search_fields = ('name',)
    list_display = ('name', linkify('province'), 'hh_count', 'gs_count')
    list_filter = ('province',)


class WardInline(admin.StackedInline):
    model = Ward
    extra = 0


@admin.register(Palika)
class PalikaAdmin(MetaCountMixin, admin.ModelAdmin):
    search_fields = ('name',)
    inlines = (WardInline,)
    list_display = (
        'name', linkify('district'),
        linkify('district.province', 'Province'),
        'hh_count', 'gs_count',
    )
    list_filter = (
        ('district', RelatedDropdownFilter),
        'district__province',
    )
