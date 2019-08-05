from rest_framework import serializers
from .models import RelocationSite


class BaseMetadataSerializer(serializers.Serializer):
    landslides_surveyed = serializers.DictField(serializers.IntegerField)
    landslides_risk_score = serializers.DictField(serializers.IntegerField)

    land_purchased = serializers.FloatField()
    geohazard_affected = serializers.DictField(serializers.IntegerField)

    people_relocated = serializers.DictField(serializers.IntegerField)
    total_households = serializers.IntegerField()

    tranches = serializers.DictField(serializers.IntegerField)
    integrated_settlements = serializers.DictField(serializers.IntegerField)
    landless_households = serializers.DictField(serializers.IntegerField)


class RelocationSiteSerializer(serializers.ModelSerializer):
    palika_name = serializers.CharField(source='palika.name', read_only=True)
    district_name = serializers.CharField(source='district.name', read_only=True)
    ward_name = serializers.CharField(source='ward.name', read_only=True)

    class Meta:
        model = RelocationSite
        fields = '__all__'


class CatPointSerializer(serializers.Serializer):
    geosite = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()

    landslide_code = serializers.CharField()
    landslide_cat = serializers.CharField()
    gp_name = serializers.CharField()
    place = serializers.CharField()

    hh_affected = serializers.IntegerField()
    risk_score = serializers.CharField()
    high_risk_of = serializers.CharField()
    direct_risk_for = serializers.CharField()
    potential_impact = serializers.CharField()
    risk_probability = serializers.CharField()
    relocation_sites = RelocationSiteSerializer(many=True)


class Cat2PointSerializer(CatPointSerializer):
    mitigation_work_status = serializers.CharField()
    mitigation_work_by = serializers.CharField()


class Cat3PointSerializer(CatPointSerializer):
    eligible_households = serializers.IntegerField()
    households_relocated = serializers.IntegerField()


class GeoAttributeSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='pk')
    name = serializers.CharField()
    centroid = serializers.ListField(serializers.IntegerField, source='meta.centroid')
    bbox = serializers.ListField(serializers.IntegerField, source='meta.bbox')


class WardSerializer(BaseMetadataSerializer):
    geo_attribute = GeoAttributeSerializer(source='ward')


class PalikaSerializer(BaseMetadataSerializer):
    geo_attribute = GeoAttributeSerializer(source='palika')


class PalikaDetailSerializer(PalikaSerializer):
    cat2_points = Cat2PointSerializer(many=True)
    cat3_points = Cat3PointSerializer(many=True)
    regions = WardSerializer(source='wards', many=True)


class DistrictSerializer(BaseMetadataSerializer):
    geo_attribute = GeoAttributeSerializer(source='district')


class DistrictDetailSerializer(DistrictSerializer):
    cat2_points = Cat2PointSerializer(many=True)
    cat3_points = Cat3PointSerializer(many=True)
    regions = PalikaSerializer(source='palikas', many=True)


class CountrySerializer(BaseMetadataSerializer):
    regions = DistrictSerializer(source='districts', many=True)
    geo_attribute = serializers.SerializerMethodField(read_only=True)

    def get_geo_attribute(self, obj):
        # NOTE: This represents County Geo Attribute (Nepal)
        return GeoAttributeSerializer({
            'pk': 0,
            'name': 'Nepal',
        }).data
