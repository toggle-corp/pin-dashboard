from django.urls import reverse
from django.utils.html import format_html


def linkify(field_name, col_name=None):
    """
    Converts a foreign key value into clickable links.

    If field_name is 'parent', link text will be str(obj.parent)
    Link will be admin url for the admin url for obj.parent.id:change
    """

    def _linkify(obj):
        linked_obj = obj
        for _field_name in field_name.split('.'):
            linked_obj = getattr(linked_obj, _field_name, None)
        if linked_obj:
            app_label = linked_obj._meta.app_label
            model_name = linked_obj._meta.model_name
            view_name = f"admin:{app_label}_{model_name}_change"
            link_url = reverse(view_name, args=[linked_obj.pk])
            return format_html(f'<a href="{link_url}">{linked_obj}</a>')

        return '-'

    _linkify.short_description = col_name or ' '.join(field_name.split('.'))
    _linkify.admin_order_field = '__'.join(field_name.split('.'))
    return _linkify
