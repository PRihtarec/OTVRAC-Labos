# OTVRAC-Labos
# Skup podataka o bolestima i simptomima

Ovaj skup podataka sadrži informacije o 10 bolesti i pripadajućim simptomima te raznim podacima za svaku bolest. Podaci su strukturirani u obliku relacijske baze podataka s tri glavne tablice: `bolesti`, `simptomi` te `bolest_simptom` koja povezuje bolesti i simptome.

## Opis skupa podataka

- **Licencija**: Unlicense 
- **Autor**: Petar Rihtarec
- **Datum izrade skupa podataka**: 27.10.2024.
- **Verzija**: 1.0
- **Jezik**: Hrvatski
- **Opis atributa**:
    - `bolest_id`: Jedinstveni identifikator za svaku bolest
    - `naziv_bolesti`: Naziv bolesti
    - `tipicna_starost_dijagnoze`: Tipična dob dijagnosticiranja bolesti
    - `genetska_predispozicija`: Genetska predispozicija povezana s bolešću (niska, srednja, visoka)
    - `razina_opasnosti`: Razina ozbiljnosti bolesti (blaga, srednja, teška)
    - `faktori_rizika`: Rizični čimbenici povezani s bolešću
    - `uobicajeni_lijekovi`: Uobičajeni lijekovi propisani za liječenje bolesti
    - `brzina_progresije_bolesti`: Stopa progresije bolesti
    - `dijagnosticki_testovi`: Uobičajeni dijagnostički testovi za potvrdu bolesti
    - `tip_tretmana`: Vrsta liječenja (medikamentozno, promjena načina života, terapija)
- **Dostupni formati**: JSON i CSV
- **Broj zapisa**: Skup podataka sadrži 10 različitih bolesti i 17 različitih simptoma.
- **Ključne riječi**: bolesti, simptomi, medicinska baza podataka, relacijski model
- **Veličina podataka**: 6KB u JSON-u, 7KB u CSV-u




