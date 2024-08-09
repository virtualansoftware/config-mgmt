"""Reads in the data file and template and produces the rendered template."""
from jinja2 import Template, StrictUndefined
import os
import json

script_dir = os.path.dirname(__file__)


def apply_configuration(key_Id: str, raw_data: str, template_file_content: str):
    # Create the dictionary of data
    data = raw_data
    print(data)
    # Open the template
    template = Template(template_file_content, undefined=StrictUndefined)
    output = template.render(data)
    return output
