import pytest
from core.graphql.tests.utils import get_graphql_content
from ...models import ProductVariant

PERFORM_ACTION_ON_VARIANTS_MUTATION = """
mutation PerformActionOnVariants(
    $action: VariantActions!
    $variantIds: [ID]!
) {
    performActionOnVariants(
        action: $action
        variantIds: $variantIds
    ) {
        success
        message
        errors
    }
}
"""

@pytest.mark.django_db
def test_perform_action_on_variants_delete_success(
    staff_api_client, 
    staff_member, 
    multi_variant_product
):
    """Test successful deletion of product variants."""
    # Ensure staff member has permission to the store
    store = multi_variant_product.store
    staff_member.store = store
    staff_member.save()

    # Prepare test data
    variants = multi_variant_product.variants.all()
    variant_ids = [str(variant.pk) for variant in variants[:2]]

    # Prepare variables for the mutation
    variables = {
        "action": "DELETE",
        "variantIds": variant_ids
    }

    # Perform the mutation
    response = staff_api_client.post_graphql(
        PERFORM_ACTION_ON_VARIANTS_MUTATION,
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Assertions
    assert content.get("data", {}).get("performActionOnVariants", {}).get("success") is True
    errors = content.get("data", {}).get("performActionOnVariants", {}).get("errors", []) or []
    assert len(errors) == 0
    
    # Verify variants are deleted
    remaining_variants = ProductVariant.objects.filter(id__in=variant_ids)
    assert remaining_variants.count() == 0

@pytest.mark.django_db
def test_perform_action_on_variants_unauthorized(
    staff_api_client, 
    multi_variant_product
):
    """Test performing action on variants without store permission."""
    # Prepare test data
    variants = multi_variant_product.variants.all()
    variant_ids = [str(variant.pk) for variant in variants[:2]]

    # Prepare variables for the mutation
    variables = {
        "action": "DELETE",
        "variantIds": variant_ids
    }

    # Perform the mutation
    response = staff_api_client.post_graphql(
        PERFORM_ACTION_ON_VARIANTS_MUTATION,
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Assertions
    assert "errors" in content
    assert any("You are not authorized" in str(error) for error in content["errors"])

@pytest.mark.django_db
def test_perform_action_on_variants_nonexistent(
    staff_api_client, 
    staff_member,
    multi_variant_product
):
    """Test performing action on non-existent variants."""
    # Ensure staff member has permission to the store
    store = multi_variant_product.store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation with non-existent variant IDs
    variables = {
        "action": "DELETE",
        "variantIds": ["999999"]  # Non-existent variant ID
    }

    # Perform the mutation
    response = staff_api_client.post_graphql(
        PERFORM_ACTION_ON_VARIANTS_MUTATION,
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Assertions
    assert "errors" in content
    assert any("Product variant not found" in str(error) for error in content["errors"])
