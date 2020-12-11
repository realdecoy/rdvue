# Localization
----------------

Localization refers to the **adaptation** of an application or website content to meet the language, cultural and other requirements of a specific target market (a _locale_). This feature has two parts that is required to work:

1.  A JSON file named as the respective <mark>**i18n language codes,**</mark> stored in the **locales** folder
    
2.  Function call with respective key
    

Based of the current **locale**, the matching JSON file would be searched for the matching key/s.

* * *

**Technical**

Examples:

1.  <mark>A JSON file named “en.json” with structure as follows:</mark>
    

```
{
  "message": "hello i18n!!"
}
```

2\. <mark>Function</mark> called within <mark>document</mark> as follows:

```
<div>
  <p>{{ $t("message") }}</p>
</div>
```

The call above would print the value of the message key <mark>if the **locale** is set to English (en)</mark>.

!>If no matching key was found, the key would be returned instead. In this case _message_