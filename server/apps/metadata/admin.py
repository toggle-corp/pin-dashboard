from django.contrib import admin
from pin.admin import linkify
from pin.filters import RelatedDropdownFilter, DropdownFilter
from .models import (
    GeoSite, Household,
)


@admin.register(GeoSite)
class GeoSiteAdmin(admin.ModelAdmin):
    search_fields = ('code', 'district', 'palika',)
    list_display = (
        'code', 'ward', 'category',
        linkify('district'), linkify('palika'),
    )
    list_filter = (
        ('district', RelatedDropdownFilter),
        ('palika', RelatedDropdownFilter),
        ('ward', DropdownFilter),
    )


@admin.register(Household)
class HouseholdAdmin(admin.ModelAdmin):
    search_fields = ('code', 'district', 'palika',)
    list_display = (
        'code', 'ward', 'eligibility_source',
        linkify('district'), linkify('palika'),
    )
    list_filter = (
        ('district', RelatedDropdownFilter),
        ('palika', RelatedDropdownFilter),
        ('ward', DropdownFilter),
    )
