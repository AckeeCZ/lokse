# 🔑 Authentication

There are two options for authentication: Service Account or API key. For each of these options we have to define some values as environment variables.

## Environment variables

We have practically two ways of how to define environment variables containing API key or Service Account credentials

Use it before the command like

```sh
$ LOKSE_SERVICE_ACCOUNT_EMAIL=this_is_account_email LOKSE_PRIVATE_KEY=this_is_the_private_key lokse update
```

or use a more flexible and handy way of keeping variables inside the `.env.local` file. Create the file if you don't have it yet and put your variables into it like

```
LOKSE_SERVICE_ACCOUNT_EMAIL=this_is_account_email
LOKSE_PRIVATE_KEY=this_is_the_private_key
```

then you'll be able to run

```sh
$ lokse update
```

> For the sake of security reasons **Never check your API keys / secrets into version control**. That means you should **not forget to add `.env.local` into the `.gitignore`**.

## Service Account

Currently the best option of authentication is to create a Service account (if you don't have any, follow [the instructions here](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account)) and then setup at least read permissions for your account in the spreadsheet.

Since every Service account contains email adress just click the "Share" button at top right corner of the spreadsheet and add your Service account email there.

Once you have the Service account created, you should have its client email and private key. It looks smilar to this

```
"client_email": "localize-with-spreadsheet@localize-with-spreadsheet.iam.gserviceaccount.com",
"private_key": "-----BEGIN PRIVATE KEY-----\nAnd_here_is_a_long_text_of_random_characters_that_defines_the_private_key\n-----END PRIVATE KEY-----\n",
```

Take these two values, put them into `LOKSE_SERVICE_ACCOUNT_EMAIL` and `LOKSE_PRIVATE_KEY` variables using one of two ways [described above](#environment-variables) and there you go, fetching data from spreadsheet should work now.

## API key

For read only access, we're good with usage of API key, if you don't have any, follow [the instructions here](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=api-key) to create one.

Then define the variable `LOKSE_API_KEY=this_is_your_api_key` and then if the key is valid fetching data should work for you.

Using API key instead of Service account has one important limitation: You spreadsheet must set permissions to be visible for everyone in the Internet.
