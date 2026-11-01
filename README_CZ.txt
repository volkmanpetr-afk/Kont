ORBIT KONTAKTY – OPRAVENÁ INSTALOVATELNÁ PWA
=============================================

TOTO JE STÁLE PŮVODNÍ TYP APLIKACE PWA
-------------------------------------
Není potřeba Python, Flask ani samostatný server na počítači.
Soubory nahrajte na HTTPS webhosting (na stejnou adresu, ze které se bude
aplikace instalovat). Pak otevřete tuto adresu v prohlížeči.

CO JE OPRAVENO
-------------
- Manifest nyní obsahuje skutečné PNG ikony 192×192 a 512×512, které vyžadují
  instalátory Chrome/Edge pro spolehlivé nabídnutí instalace.
- Přidána ikona Apple Touch Icon pro iPhone/iPad.
- Tlačítko Instalovat je viditelné i v prohlížečích, které nepodporují
  automatické instalační okno; zobrazí konkrétní postup podle prohlížeče.
- Service Worker má novou verzi cache, aby se nepoužíval starý poškozený kód.
- Robustnější spuštění IndexedDB a importní Worker, lepší chybová hlášení.
- Aplikace požádá prohlížeč o zachování lokálního úložiště, pokud to podporuje.

NASAZENÍ
-------
1. Rozbalte ZIP.
2. Nahrajte VŠECHNY soubory a složky do kořenové složky HTTPS webhostingu.
3. Otevřete veřejnou HTTPS adresu v Chrome nebo Edge.
4. Počkejte, až se stránka načte. Tlačítko Instalovat je vpravo nahoře.
5. Pokud prohlížeč nenabídne automatické okno:
   - Chrome Android: ⋮ → Instalovat aplikaci / Přidat na plochu.
   - Edge Android: ⋯ → Přidat do telefonu / Aplikace.
   - iPhone/iPad: Safari → Sdílet → Přidat na plochu.
   - Edge/Chrome na PC: nabídka prohlížeče → Aplikace / Instalovat tuto stránku.
6. Po instalaci spusťte ORBIT ikonou aplikace a vyberte CSV.

DATABÁZE A TRVALÉ ULOŽENÍ
-------------------------
- CSV se zpracovává přímo v prohlížeči a ukládá se do IndexedDB.
- Po úspěšném importu zůstane databáze uložená i po zavření a opětovném
  spuštění PWA. Není nutné ji při každém spuštění znovu importovat.
- Data jsou lokální pro konkrétní zařízení a konkrétní doménu/origin.
  Pokud aplikaci nainstalujete na mobil, databázi je potřeba na mobilu
  importovat zvlášť. Data se automaticky nesynchronizují mezi mobilem a PC.
- Nevymazávejte data webu / úložiště prohlížeče, jinak se může odstranit
  i lokální databáze.
- Při importu nového CSV se stávající databáze přepíše.
- První import velkého souboru může trvat několik minut; po dokončení se
  data zachovají.

FORMÁT CSV
----------
- UTF-8, první řádek je hlavička a přeskočí se.
- Aktuální parser očekává čárkou oddělené hodnoty a 13 sloupců:
  Email, Telefon, Facebook_ID, Jmeno, Prijmeni, Pohlavi, Bydliste,
  Mesto, Rodinny_stav, Zamestnani, Info1, Info2, Info3.
- Uvozovky a čárky uvnitř uvozovaných polí jsou podporovány.

DŮLEŽITÉ
--------
- PWA musí být dostupná přes HTTPS (výjimkou je localhost při testování).
- Nahrání souborů na hosting samo o sobě nepřenese CSV data. CSV se vybírá
  až uvnitř aplikace.
- Data zůstávají v zařízení. Při smazání dat prohlížeče mohou být ztracena.
