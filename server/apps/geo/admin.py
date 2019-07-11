from django.contrib import admin
from django.db.models import Q
from pin.admin import linkify
from pin.filters import RelatedDropdownFilter

from metadata.models import GeoSite, Household
from .models import (
    Map, Province, District, Palika
)

admin.site.register(Map)


@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name', 'get_total_hh', 'get_total_gs')

    def get_total_hh(self, obj):
        return Household.objects.filter(
            Q(district__province=obj) | Q(palika__district__province=obj)
        ).distinct().count()

    def get_total_gs(self, obj):
        return GeoSite.objects.filter(
            Q(district__province=obj) | Q(palika__district__province=obj)
        ).distinct().count()


class MetaCountMixin():
    def get_total_hh(self, obj):
        return obj.household_set.count()

    def get_total_gs(self, obj):
        return obj.geosite_set.count()


class PalikaInine(admin.StackedInline):
    model = Palika
    exclude = ('geojson',)
    extra = 0


@admin.register(District)
class DistrictAdmin(MetaCountMixin, admin.ModelAdmin):
    inlines = (PalikaInine,)
    search_fields = ('name',)
    list_display = ('name', linkify('province'), 'get_total_hh', 'get_total_gs')
    list_filter = ('province',)


@admin.register(Palika)
class PalikaAdmin(MetaCountMixin, admin.ModelAdmin):
    search_fields = ('name',)
    list_display = (
        'name', linkify('district'),
        linkify('district.province', 'Province'),
        'get_total_hh', 'get_total_gs',
    )
    list_filter = (
        ('district', RelatedDropdownFilter),
        'district__province',
    )
