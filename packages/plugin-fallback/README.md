# @lokse/plugin-fallback

Plugin for fallbacking missing translations to the default language translation.

## Installation

```sh
$ yarn add -D @lokse/plugin-fallback
```

## Usage

Add it into plugins section of lokse config, and pass an options with default language

```json
{
    "plugins": [
        { 
            "name": "@lokse/plugin-fallback", 
            "options": { 
                "defaultLanguage": "en-GB" 
            }
        }
    ]
}
```

Then if you spreadsheet contains data like this

|      key_web     |    en-GB   |   cs-CZ    |    de-De    |
|------------------|------------|------------|-------------|
| _auth.username_  |  Username  |            |  Nutzername |
| _auth.password_  |  Password  |  Heslo     |             |
| _auth.login_     |  Login     |  Přihlásit |  Einloggen  |

Then the gaps in translations will be filled with default language translations and output will look like this

```json
// en-GB
{
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.login": "Login"
}
// cs-CZ
{
    "auth.username": "Username",
    "auth.password": "Heslo",
    "auth.login": "Přihlásit"
}
// de-De
{
    "auth.username": "Nutzername",
    "auth.password": "Password",
    "auth.login": "Einloggen"
}
```

## Options

### `defaultLanguage: string`

```json
{
    ...
    "options": { 
        "defaultLanguage": "en-GB" 
    }
}
```

Required. Determines language used to fill missing gaps in translations.
### `logMissingFallback: boolean`

Optional. Defaults to `true`. Determines logging of missing translations in default language. 

Logs only when fallbacking is invoked. For example  if there will be no `en-GB` translation for `auth.username` key in previous example, plugin warns about that fact. But that doesn't apply for `auth.login` as there is no need for translation fallbacking because there are all translations filled.

Loggin can be turned off with

```json
{
    ...
    "options": { 
        "logMissingFallback": false
    }
}
```


## License
Lokse is licensed under the MIT License.
Documentation is licensed under Creative Commons License.
Created with ♥ by [@horaklukas](https://github.com/horaklukas) and all the great contributors.