# with:
#           upload_url: ${{ steps.create_release.outputs.upload_url }} # This pulls from the CREATE RELEASE step above, referencing it's ID to get its outputs object, which include a `upload_url`. See this blog post for more info: https://jasonet.co/posts/new-features-of-github-actions/#passing-data-to-future-steps
#           asset_path: ./numeric-${{ steps.get_version.outputs.VERSION }}.vsix
#           asset_name: numeric-${{ steps.get_version.outputs.VERSION }}.vsix
#           asset_content_type: application/vsix
