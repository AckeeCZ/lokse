# lokse-doc-site

## 2.4.0

### Minor Changes

-   b098579: Add support for Application Default Credentials authentication. And upgrade tooling & dependencies.

    ***

    **Authenticate with Application Default Credentials**

    If none of these environment variables (`LOKSE_SERVICE_ACCOUNT_EMAIL` & `LOKSE_PRIVATE_KEY` or `LOKSE_API_KEY`) have been provided, `lokse` fallbacks to [application default credential authentication](https://cloud.google.com/docs/authentication/provide-credentials-adc).

    ***

    **Other changes:**

    -   [dcbb5ee] ➕ Add turbo
    -   [063327c] 💚 Update CI configs
    -   [47b9108] ♻️ Update prettier config
    -   [79475bc] ⬆️ typescript@5.x
    -   [c9d6048] ⬆️ Upgrade prettier
    -   [791d7ab] ✅ Fix tests
    -   [5a977ff] ⬆️ upgrade jest@29.x
    -   [4ee1a63] ⬆️ @types/node@20.x
    -   [ef1b926] Require Node >=20 & upgrade to yarn@4.5.1
    -   [db36e47] ✨ Add support for application default credentials
