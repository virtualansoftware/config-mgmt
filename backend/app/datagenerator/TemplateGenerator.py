"""Reads in the data file and template and produces the rendered template."""
from jinja2 import Template, StrictUndefined
import os
import json

script_dir = os.path.dirname(__file__)


class TemplateGenerator:
    def apply_configuration(raw_data: str, template_file_content: str):
        data = raw_data
        template = Template(template_file_content, undefined=StrictUndefined)
        output = template.render(data)
        return output
