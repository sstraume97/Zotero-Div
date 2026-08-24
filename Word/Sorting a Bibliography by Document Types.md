---
uid: GmCeV5EC3e
---
In most styles, bibliographies are sorted primarily by author name. Some authors may also wish to sort it by document type, for example to distinguish between primary and secondary sources. This can easily be done by adding a simple macro and then adding it as the first sort criterion of the bibliography. The subheadings have to be added manually.

Click on "Macros", then on the "+" at the top of the column, click on the "Macro" button in the pop-up window, and give it a name, for example "sort-by-type". The "macro: Sort-by-type" will appear in the macro list on the left, you can select it, click on the "+" and start entering the following instructions:

Select "Conditional", then "If": the default conditional which appears is "if the document type is", and you can select in the drop-down menu the document types that you want to put in your first category, for example "book" and "chapter".
Then select the "if book OR chapter", click on "+", and "Text", and enter "1" in the "value" field.
Select "Conditional" again, "+", "Else-if" and select the document types you want to include in your second category. Type "2" in the "value" field.
Do this again and again, until you reach the last category (end with "Else").
Then click on "sort", add a new sort-key, type in "macro", and select your new macro. Drag and drop it into the first position of the sort-keys.
If you prefer to work directly on the code, it will look something like this:
```
<macro name="sort-type">
    <choose>
      <if type="book chapter paper-conference article-magazine article-newspaper article-journal manuscript report speech entry-encyclopedia" match="any">
        <text value="1"/>
      </if>
      <else-if type="legal_case">
        <text value="2"/>
        <text variable="title"/>
      </else-if>
      <else-if type="bill legislation" match="any">
        <text value="3"/>
        <choose>
          <if type="legislation">
            <text variable="title"/>
          </if>
        </choose>
      </else-if>
      <else-if type="treaty">
        <text value="4"/>
      </else-if>
      <else>
        <text value="1"/>
      </else>
    </choose>
  </macro>
```
(this macro is taken from the [Oscola Zotero style](https://www.zotero.org/styles?q=oscola), which already uses this sort criterion).

_**Artikkelen er hentet fra:** [LibGuides/Zotero](https://libguides.graduateinstitute.ch/zotero/modifying-styles/sort-by-type)_ | _**Tid:** 14.07.2026 kl. 19:20_
