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


@pytest.mark.parametrize(
    "text",
    [
        "<script>alert('XSS')</script>",
        "<img src='x' onerror='alert(1)'>",
        "<a href='javascript:alert(1)'>Click me</a>",
        "<div onclick='alert(1)'>Click me</div>",
        "<img src='invalid' onerror='alert(1)'>",
    ],
)
def test_clean_editor_js_security(text):
    # given
    data = {"blocks": [{"data": {"text": text}, "type": "paragraph"}]}

    # when
    result = clean_editor_js(data, to_string=True)

    # then
    assert "<script>" not in result
    assert "javascript:" not in result
    assert "alert(" not in result
    assert "onerror" not in result
    assert "onclick" not in result
