---
title: Authentication
description: How to authenticate in Lokse
layout: ../../layouts/MainLayout.astro
---

In order to fetch spreadsheet via `lokse update` command, you need to authenticate first. `lokse` uses [**Application default credential**](https://cloud.google.com/docs/authentication/provide-credentials-adc) – sign-in just with your Google account or provide service account.

## Authenticate `lokse` locally (in your CLI):

1. Install `gcloud` first:

    https://cloud.google.com/sdk/docs/install

2. Sign-in with Google:

    ```sh
    gcloud auth application-default login --scopes=openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/spreadsheets,https://www.googleapis.com/auth/drive.file
    ```

3. Fetch spreadsheets:

    ```sh
    lokse update
    ```

4. In case of getting quote project warning:

    ```sh
    gcloud auth application-default set-quota-project <project-name>
    ```

## Authentication `lokse` in CI pipeline:

https://cloud.google.com/docs/authentication/provide-credentials-adc:

```sh
export GOOGLE_APPLICATION_CREDENTIALS="SERVICE_ACCOUNT_KEY_PATH"
```
