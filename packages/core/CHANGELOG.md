# @lokse/core

## 3.1.0

### Minor Changes

-   dc55f1b: Major upgrade of internal dependencies.

## 3.0.0

### Major Changes

-   f836acf: 💥 Use application default credentials as only authentication method.

    ## Migration guide

    1. Remove `.env.local`
    2. Install `gcloud` first - https://cloud.google.com/sdk/docs/install
    3. Sign-in with Google:

        ```sh
        gcloud auth application-default login --scopes=openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/spreadsheets,https://www.googleapis.com/auth/drive.file
        ```

    4. Fetch spreadsheets:

        ```sh
        lokse update
        ```

    5. In case of getting quote project warning:

        ```sh
        gcloud auth application-default set-quota-project <project-name>
        ```

## 2.4.1

### Patch Changes

-   c518182: Fix internal imports.

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
