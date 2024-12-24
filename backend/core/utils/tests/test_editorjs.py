from ..editorjs import clean_editor_js
import pytest
from django.utils.html import strip_tags


@pytest.mark.parametrize(
    "text",
    [
        "Hello, <strong>world!</strong>",
        "Hello, world!",
        "Hello, world! <br> <br>",
        "Hello, world! <br>",
        "Hello, world!",
        "<br>Hello, world!<br>",
        "<br>Hello, world!",
        "<br>",
        "",
        "   ",
        "Hello, world!\n\n",
    ],
)
def test_clean_editor_js(text):
    # given
    data = {"blocks": [{"data": {"text": text}, "type": "paragraph"}]}

    # when
    result = clean_editor_js(data)

    # then
    assert result == data

    # when
    result = clean_editor_js(data, to_string=True)

    # then
    assert result == strip_tags(text)


def test_clean_editor_js_no_blocks():
    # given
    data = {}

    # when
    result = clean_editor_js(data)

    # then
    assert result == data

    # when
    result = clean_editor_js(data, to_string=True)

    # then
    assert result == ""


def test_clean_editor_js_no_data():
    # given
    data = {"blocks": []}

    # when
    result = clean_editor_js(data)

    # then
    assert result == data

    # when
    result = clean_editor_js(data, to_string=True)

    # then
    assert result == ""
