## Force language

The default language of the web admin depends on your browser language.

You can force a language by using (e.g. for French):
```
/?/lang/fr
```

English is the default language when the browser language is not available.

## Update the default string list

Updating the pot file from template files:
```
xgettext views/* -o i18n/localization.pot
xgettext *.php views/*.php -o i18n/localization.pot
```

## Add a new language

Create a new directory path (e.g. for French):
```
mkdir -p i18n/fr_FR/LC_MESSAGES/
```

Generate the po file:
```
msginit --locale=fr_FR.UTF-8 --no-translator -i i18n/localization.pot -o i18n/fr_FR/LC_MESSAGES/localization.po
```

You can use poedit for translating the po:
```
poedit i18n/fr_FR/LC_MESSAGES/localization.po
```

With poedit, just save your modifications with the button and the *localization.mo* (compiled version of the po) file will automatically be created or updated.

If you edited the po by hand, you have to compile the mo file:
```
msgfmt i18n/fr_FR/localization.po -o i18n/fr_FR/LC_MESSAGES/localization.mo
```

Change the default language of your browser, and test this new translation.

You should add the locale to the list at the end of *controller.php*.
